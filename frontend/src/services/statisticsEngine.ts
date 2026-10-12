import { StatisticalResult, TimeSeriesPoint, TrendVerdict, VariableId } from '../types';

/**
 * Standard Normal Complementary Error Function for accurate p-value calculation
 */
function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1.0 / (1.0 + 0.5 * z);
  const ans = t * Math.exp(-z * z - 1.26551223 +
    t * (1.00002368 +
    t * (0.37409196 +
    t * (0.09678418 +
    t * (-0.18628806 +
    t * (0.27886807 +
    t * (-1.13520398 +
    t * (1.48851587 +
    t * (-0.82215223 +
    t * 0.17087277)))))))));
  return x >= 0 ? ans : 2.0 - ans;
}

/**
 * Standard Normal Cumulative Distribution Function Φ(x)
 */
function standardNormalCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

/**
 * Ordinary Least Squares & Mann-Kendall Trend Analysis
 */
export function calculateStatistics(
  data: TimeSeriesPoint[],
  variableId: VariableId,
  variableName: string,
  unit: string,
  regionName: string,
  aggregation: 'monthly' | 'seasonal' | 'annual' = 'monthly'
): StatisticalResult {
  const n = data.length;

  if (n < 5) {
    return {
      variableId,
      variableName,
      unit,
      regionName,
      startYear: data[0]?.year || 2000,
      endYear: data[n - 1]?.year || 2024,
      sampleCount: n,
      meanValue: 0,
      startValue: 0,
      endValue: 0,
      absoluteChange: 0,
      percentageChange: 0,
      annualRate: 0,
      olsSlope: 0,
      olsIntercept: 0,
      rSquared: 0,
      pearsonR: 0,
      standardError: 0,
      pValue: 1.0,
      mannKendallS: 0,
      mannKendallVarS: 0,
      mannKendallZ: 0,
      kendallTau: 0,
      sensSlope: 0,
      ciLower: 0,
      ciUpper: 0,
      verdict: 'insufficient_data',
      verdictLabel: 'Insufficient data for trend detection',
      interpretiveNotes: 'A minimum of 5 data points is required to calculate statistical significance.'
    };
  }

  // Time index: for monthly, fractional years; for annual, integer years
  const x = data.map((d, i) => {
    return d.year + (d.month - 0.5) / 12;
  });
  const y = data.map(d => d.value);

  // Summary statistics
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const meanY = sumY / n;
  const startVal = y[0];
  const endVal = y[n - 1];
  const absChange = endVal - startVal;
  const pctChange = startVal !== 0 ? (absChange / Math.abs(startVal)) * 100 : 0;

  // Mean of X
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const meanX = sumX / n;

  // OLS Regression
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    den += dx * dx;
  }

  const olsSlope = den !== 0 ? num / den : 0; // Slope per year
  const olsIntercept = meanY - olsSlope * meanX;

  // Residuals, R-squared, Standard Error
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = olsIntercept + olsSlope * x[i];
    ssTot += Math.pow(y[i] - meanY, 2);
    ssRes += Math.pow(y[i] - yPred, 2);
  }

  const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  const pearsonR = (olsSlope >= 0 ? 1 : -1) * Math.sqrt(rSquared);
  const residualVariance = n > 2 ? ssRes / (n - 2) : 0;
  const standardErrorOfSlope = den > 0 ? Math.sqrt(residualVariance / den) : 0;

  // Mann-Kendall Trend Test
  let S = 0;
  const slopes: number[] = []; // for Sen's Slope
  const sampleLimitForSens = Math.min(n, 120); // Subsample for fast O(n^2) Sen's slope if large
  const step = Math.max(1, Math.floor(n / sampleLimitForSens));

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const diff = y[j] - y[i];
      if (diff > 0) S += 1;
      else if (diff < 0) S -= 1;
    }
  }

  // Compute Sen's slope pairwise with controlled step
  for (let i = 0; i < n - 1; i += step) {
    for (let j = i + 1; j < n; j += step) {
      const dt = x[j] - x[i];
      if (dt !== 0) {
        slopes.push((y[j] - y[i]) / dt);
      }
    }
  }
  slopes.sort((a, b) => a - b);
  const sensSlope = slopes.length > 0 ? slopes[Math.floor(slopes.length / 2)] : olsSlope;

  // Mann-Kendall Variance with tie correction
  const tieMap = new Map<number, number>();
  for (const val of y) {
    const rounded = Math.round(val * 100) / 100;
    tieMap.set(rounded, (tieMap.get(rounded) || 0) + 1);
  }
  let tieSum = 0;
  tieMap.forEach(count => {
    if (count > 1) {
      tieSum += count * (count - 1) * (2 * count + 5);
    }
  });

  const varS = (n * (n - 1) * (2 * n + 5) - tieSum) / 18;
  const stdS = Math.sqrt(varS);

  // Standardized Z-statistic
  let Z = 0;
  if (S > 0) {
    Z = (S - 1) / stdS;
  } else if (S < 0) {
    Z = (S + 1) / stdS;
  }

  // Two-tailed p-value
  const pValue = Math.min(1.0, Math.max(0.0001, 2.0 * (1.0 - standardNormalCdf(Math.abs(Z)))));
  const kendallTau = (2.0 * S) / (n * (n - 1));

  // 95% Confidence Interval for Slope
  const zCrit = 1.96;
  const ciLower = olsSlope - zCrit * standardErrorOfSlope;
  const ciUpper = olsSlope + zCrit * standardErrorOfSlope;

  // Verdict determination
  let verdict: TrendVerdict = 'no_significant_trend';
  let verdictLabel = 'No statistically significant trend';

  if (pValue < 0.05) {
    if (S > 0 || olsSlope > 0) {
      verdict = 'significant_increase';
      verdictLabel = 'Statistically significant increase';
    } else {
      verdict = 'significant_decrease';
      verdictLabel = 'Statistically significant decrease';
    }
  } else if (pValue < 0.10) {
    verdict = 'emerging_trend';
    verdictLabel = 'Emerging directional trend (p < 0.10)';
  }

  // Interpretive contextual note (respecting non-causal scientific wording)
  let interpretiveNotes = '';
  if (verdict === 'significant_increase') {
    interpretiveNotes = `This positive trend (p = ${pValue.toFixed(4)}) is statistically robust at the 95% confidence level. This pattern is consistent with persistent regional environmental forcing; further multi-variate modeling is required to evaluate specific physical drivers.`;
  } else if (verdict === 'significant_decrease') {
    interpretiveNotes = `This downward trend (p = ${pValue.toFixed(4)}) is statistically robust at the 95% confidence level. A possible contributing factor is long-term atmospheric circulation changes; never present correlation as proof of direct causation.`;
  } else if (verdict === 'emerging_trend') {
    interpretiveNotes = `An emerging directional pattern is observed (p = ${pValue.toFixed(4)}), though it does not meet the strict 95% threshold. Continued observations are required before establishing persistence.`;
  } else {
    interpretiveNotes = `Natural interannual variability dominates this record (p = ${pValue.toFixed(4)}). No statistically significant secular trend is detected over this observation window.`;
  }

  const startYear = data[0].year;
  const endYear = data[n - 1].year;
  const yearSpan = Math.max(1, endYear - startYear);
  const annualRate = absChange / yearSpan;

  return {
    variableId,
    variableName,
    unit,
    regionName,
    startYear,
    endYear,
    sampleCount: n,
    meanValue: Number(meanY.toFixed(3)),
    startValue: Number(startVal.toFixed(3)),
    endValue: Number(endVal.toFixed(3)),
    absoluteChange: Number(absChange.toFixed(3)),
    percentageChange: Number(pctChange.toFixed(2)),
    annualRate: Number(annualRate.toFixed(4)),
    olsSlope: Number(olsSlope.toFixed(4)),
    olsIntercept: Number(olsIntercept.toFixed(4)),
    rSquared: Number(rSquared.toFixed(3)),
    pearsonR: Number(pearsonR.toFixed(3)),
    standardError: Number(standardErrorOfSlope.toFixed(4)),
    pValue: Number(pValue.toFixed(4)),
    mannKendallS: S,
    mannKendallVarS: Number(varS.toFixed(1)),
    mannKendallZ: Number(Z.toFixed(3)),
    kendallTau: Number(kendallTau.toFixed(3)),
    sensSlope: Number(sensSlope.toFixed(4)),
    ciLower: Number(ciLower.toFixed(4)),
    ciUpper: Number(ciUpper.toFixed(4)),
    verdict,
    verdictLabel,
    interpretiveNotes
  };
}

/**
 * Filter and aggregate time series by year range and aggregation mode
 */
export function aggregateSeries(
  rawPoints: TimeSeriesPoint[],
  startYear: number,
  endYear: number,
  aggregation: 'monthly' | 'seasonal' | 'annual'
): TimeSeriesPoint[] {
  const filtered = rawPoints.filter(p => p.year >= startYear && p.year <= endYear);

  if (aggregation === 'monthly') {
    return filtered;
  }

  if (aggregation === 'annual') {
    const years = Array.from(new Set(filtered.map(p => p.year))).sort((a, b) => a - b);
    return years.map(yr => {
      const yearPoints = filtered.filter(p => p.year === yr);
      const avg = yearPoints.reduce((acc, p) => acc + p.value, 0) / yearPoints.length;
      return {
        date: `${yr}`,
        year: yr,
        month: 6,
        value: Number(avg.toFixed(3)),
        anomaly: yearPoints[0]?.anomaly,
        rollingAvg: Number(avg.toFixed(3))
      };
    });
  }

  if (aggregation === 'seasonal') {
    // Group into 4 meteorological seasons: DJF (Winter), MAM (Spring), JJA (Summer), SON (Autumn)
    const seasons = [
      { name: 'DJF', months: [12, 1, 2] },
      { name: 'MAM', months: [3, 4, 5] },
      { name: 'JJA', months: [6, 7, 8] },
      { name: 'SON', months: [9, 10, 11] }
    ];

    const result: TimeSeriesPoint[] = [];
    const years = Array.from(new Set(filtered.map(p => p.year))).sort((a, b) => a - b);

    for (const yr of years) {
      for (const season of seasons) {
        const seasonPoints = filtered.filter(p => p.year === yr && season.months.includes(p.month));
        if (seasonPoints.length > 0) {
          const avg = seasonPoints.reduce((acc, p) => acc + p.value, 0) / seasonPoints.length;
          result.push({
            date: `${yr} ${season.name}`,
            year: yr,
            month: season.months[1],
            value: Number(avg.toFixed(3))
          });
        }
      }
    }
    return result;
  }

  return filtered;
}
