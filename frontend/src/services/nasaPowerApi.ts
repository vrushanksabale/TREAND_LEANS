import { TimeSeriesPoint, VariableId } from '../types';
import { getBaselineSeries } from '../data/curatedSeries';

interface CacheEntry {
  timestamp: number;
  data: TimeSeriesPoint[];
}

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Maps TrendLens variable IDs to NASA POWER API parameter codes
 */
const PARAM_MAP: Partial<Record<VariableId, string>> = {
  surface_temperature: 'T2M',
  precipitation: 'PRECTOTCORR',
  solar_irradiance: 'ALLSKY_SFC_SW_DWN'
};

/**
 * Fetch real monthly time series from NASA POWER API
 */
export async function fetchNasaPowerSeries(
  variableId: VariableId,
  lat: number,
  lon: number,
  startYear: number,
  endYear: number,
  regionId: string
): Promise<{ points: TimeSeriesPoint[]; source: 'nasa_power_live' | 'nasa_curated_cache' }> {
  const nasaParam = PARAM_MAP[variableId];

  // If variable is not served by NASA POWER (e.g. GRACE gravimetry, Sea Ice, MODIS NDVI),
  // return curated NASA benchmark series directly
  if (!nasaParam) {
    return {
      points: getBaselineSeries(variableId, regionId, startYear, endYear),
      source: 'nasa_curated_cache'
    };
  }

  const cacheKey = `${variableId}_${lat.toFixed(2)}_${lon.toFixed(2)}_${startYear}_${endYear}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { points: cached.data, source: 'nasa_power_live' };
  }

  // Constrain bounds for NASA POWER (1981 - 2024)
  const safeStart = Math.max(1981, Math.min(startYear, 2024));
  const safeEnd = Math.min(2024, Math.max(endYear, safeStart));

  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=${nasaParam}&community=RE&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}&start=${safeStart}&end=${safeEnd}&format=JSON`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA POWER API HTTP ${res.status}`);
    }

    const json = await res.json();
    const paramData = json?.properties?.parameter?.[nasaParam];

    if (!paramData || typeof paramData !== 'object') {
      throw new Error('Malformed NASA POWER response payload');
    }

    const points: TimeSeriesPoint[] = [];

    // Parse YYYYMM keys (e.g. "199501", "199502", skip "199513" which is annual mean in POWER)
    Object.keys(paramData).forEach(key => {
      if (key.length === 6) {
        const yr = parseInt(key.slice(0, 4), 10);
        const mo = parseInt(key.slice(4, 6), 10);
        if (mo >= 1 && mo <= 12 && yr >= startYear && yr <= endYear) {
          const rawVal = paramData[key];
          // -999 indicates missing / fill value in NASA POWER
          if (rawVal > -900) {
            points.push({
              date: `${yr}-${mo < 10 ? '0' + mo : mo}`,
              year: yr,
              month: mo,
              value: Number(rawVal.toFixed(3))
            });
          }
        }
      }
    });

    if (points.length >= 12) {
      // Sort chronologically
      points.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

      // Compute rolling averages
      for (let i = 0; i < points.length; i++) {
        if (i >= 11) {
          const slice = points.slice(i - 11, i + 1);
          points[i].rollingAvg = Number((slice.reduce((acc, p) => acc + p.value, 0) / 12).toFixed(3));
        }
      }

      apiCache.set(cacheKey, { timestamp: Date.now(), data: points });
      return { points, source: 'nasa_power_live' };
    }

    throw new Error('Insufficient points from NASA POWER, using curated fallback');
  } catch (err) {
    // Graceful fallback to validated authentic NASA baseline series
    console.warn('NASA POWER API fetch notice:', err);
    const fallback = getBaselineSeries(variableId, regionId, startYear, endYear);
    return { points: fallback, source: 'nasa_curated_cache' };
  }
}
