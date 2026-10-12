import { SavedAnalysis, WatchlistItem } from '../types';

const ANALYSES_STORAGE_KEY = 'trendlens_saved_analyses';
const WATCHLIST_STORAGE_KEY = 'trendlens_watchlist';
const EXPORT_HISTORY_KEY = 'trendlens_export_history';

export interface ExportHistoryRecord {
  id: string;
  filename: string;
  variableName: string;
  regionName: string;
  format: 'CSV' | 'PNG' | 'REPORT';
  timestamp: string;
  recordCount: number;
}

// Initial realistic starter analyses matching the spec
const INITIAL_SAVED_ANALYSES: SavedAnalysis[] = [
  {
    id: 'analysis-arctic-sea-ice',
    title: 'Arctic Sea-Ice Extent Decline (1995–2024)',
    variableId: 'sea_ice_extent',
    regionId: 'arctic_ocean',
    regionName: 'Arctic Ocean',
    coordinates: { lat: 78.5, lon: 15.0 },
    startYear: 1995,
    endYear: 2024,
    aggregation: 'monthly',
    result: {
      slope: -0.58,
      annualRate: -0.58,
      changePercent: -14.2,
      pValue: 0.0002,
      verdictLabel: 'Statistically significant decrease',
      verdict: 'significant_decrease'
    },
    createdAt: '2026-10-10T09:24:00Z',
    notes: 'NSIDC passive microwave monthly concentration records show strong multi-year ice depletion.'
  },
  {
    id: 'analysis-california-groundwater',
    title: 'Central Valley Aquifer Storage Depletion (2002–2024)',
    variableId: 'groundwater_storage',
    regionId: 'california_central_valley',
    regionName: 'California Central Valley',
    coordinates: { lat: 36.8, lon: -119.8 },
    startYear: 2002,
    endYear: 2024,
    aggregation: 'monthly',
    result: {
      slope: -1.95,
      annualRate: -1.95,
      changePercent: -43.0,
      pValue: 0.0001,
      verdictLabel: 'Statistically significant decrease',
      verdict: 'significant_decrease'
    },
    createdAt: '2026-10-11T14:15:00Z',
    notes: 'GRACE and GRACE-FO gravimetric mass anomaly grids show unreplenished irrigation deficits.'
  },
  {
    id: 'analysis-sahel-greening',
    title: 'Sahel Belt Vegetation Index Rebound (2000–2024)',
    variableId: 'vegetation_index',
    regionId: 'sahel_belt',
    regionName: 'Sahel Belt, Sub-Saharan Africa',
    coordinates: { lat: 14.5, lon: 2.0 },
    startYear: 2000,
    endYear: 2024,
    aggregation: 'annual',
    result: {
      slope: 0.0022,
      annualRate: 0.0022,
      changePercent: 12.8,
      pValue: 0.012,
      verdictLabel: 'Statistically significant increase',
      verdict: 'significant_increase'
    },
    createdAt: '2026-10-12T11:40:00Z',
    notes: 'MODIS Terra 16-day NDVI composites show greening following northward shifts of Atlantic ITCZ rainfall.'
  }
];

const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    variableId: 'surface_temperature',
    regionId: 'arctic_ocean',
    regionName: 'Arctic Ocean',
    addedAt: '2026-10-08',
    recentRate: '+0.078 °C/yr',
    trendDirection: 'increasing'
  },
  {
    id: 'watch-2',
    variableId: 'groundwater_storage',
    regionId: 'indus_ganges_basin',
    regionName: 'Indus & Indo-Gangetic Plains',
    addedAt: '2026-10-09',
    recentRate: '-1.72 cm eq/yr',
    trendDirection: 'decreasing'
  },
  {
    id: 'watch-3',
    variableId: 'aerosol_optical_depth',
    regionId: 'siberian_boreal_forest',
    regionName: 'Siberian Boreal Taiga',
    addedAt: '2026-10-10',
    recentRate: '+0.0031 AOD/yr',
    trendDirection: 'increasing'
  }
];

export function getSavedAnalyses(): SavedAnalysis[] {
  const data = localStorage.getItem(ANALYSES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(INITIAL_SAVED_ANALYSES));
    return INITIAL_SAVED_ANALYSES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SAVED_ANALYSES;
  }
}

export function saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'createdAt'>): SavedAnalysis {
  const existing = getSavedAnalyses();
  const newRecord: SavedAnalysis = {
    ...analysis,
    id: 'analysis-' + Date.now().toString(36),
    createdAt: new Date().toISOString()
  };
  const updated = [newRecord, ...existing];
  localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
}

export function deleteSavedAnalysis(id: string): void {
  const existing = getSavedAnalyses();
  const updated = existing.filter(a => a.id !== id);
  localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated));
}

export function getWatchlist(): WatchlistItem[] {
  const data = localStorage.getItem(WATCHLIST_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WATCHLIST));
    return INITIAL_WATCHLIST;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_WATCHLIST;
  }
}

export function toggleWatchlist(item: Omit<WatchlistItem, 'id' | 'addedAt'>): boolean {
  const list = getWatchlist();
  const existingIndex = list.findIndex(w => w.variableId === item.variableId && w.regionId === item.regionId);
  if (existingIndex >= 0) {
    list.splice(existingIndex, 1);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
    return false; // removed
  } else {
    const newItem: WatchlistItem = {
      ...item,
      id: 'watch-' + Date.now().toString(36),
      addedAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
    return true; // added
  }
}

export function getExportHistory(): ExportHistoryRecord[] {
  const data = localStorage.getItem(EXPORT_HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function logExportRecord(record: Omit<ExportHistoryRecord, 'id' | 'timestamp'>): void {
  const existing = getExportHistory();
  const newEntry: ExportHistoryRecord = {
    ...record,
    id: 'export-' + Date.now().toString(36),
    timestamp: new Date().toISOString()
  };
  const updated = [newEntry, ...existing].slice(0, 20); // keep last 20
  localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(updated));
}
