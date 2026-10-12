export type VariableId = 
  | 'surface_temperature'
  | 'precipitation'
  | 'sea_ice_extent'
  | 'vegetation_index'
  | 'aerosol_optical_depth'
  | 'groundwater_storage'
  | 'solar_irradiance';

export interface EarthVariable {
  id: VariableId;
  name: string;
  shortName: string;
  unit: string;
  description: string;
  nasaMission: string;
  sensor: string;
  spatialResolution: string;
  temporalResolution: string;
  dataLatency: string;
  sourceApi: string;
  gibsLayer?: string;
  gibsFormat?: 'jpg' | 'png';
  color: string;
  baselinePeriod: string;
  cautionaryDriverContext: string;
}

export interface RegionLocation {
  id: string;
  name: string;
  category: 'global' | 'polar' | 'tropical' | 'arid' | 'temperate' | 'marine';
  description: string;
  lat: number;
  lon: number;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  defaultZoom: number;
}

export interface TimeSeriesPoint {
  date: string; // YYYY-MM
  year: number;
  month: number;
  value: number;
  anomaly?: number;
  rollingAvg?: number;
}

export type TrendVerdict = 
  | 'significant_increase'
  | 'significant_decrease'
  | 'emerging_trend'
  | 'no_significant_trend'
  | 'insufficient_data';

export interface StatisticalResult {
  variableId: VariableId;
  variableName: string;
  unit: string;
  regionName: string;
  startYear: number;
  endYear: number;
  sampleCount: number;
  meanValue: number;
  startValue: number;
  endValue: number;
  absoluteChange: number;
  percentageChange: number;
  annualRate: number; // rate per year
  olsSlope: number; // slope per year
  olsIntercept: number;
  rSquared: number;
  pearsonR: number;
  standardError: number;
  pValue: number;
  // Mann-Kendall Specifics
  mannKendallS: number;
  mannKendallVarS: number;
  mannKendallZ: number;
  kendallTau: number;
  sensSlope: number;
  ciLower: number; // 95% CI
  ciUpper: number; // 95% CI
  verdict: TrendVerdict;
  verdictLabel: string;
  interpretiveNotes: string;
}

export interface SavedAnalysis {
  id: string;
  userId?: string;
  title: string;
  variableId: VariableId;
  regionId: string;
  regionName: string;
  coordinates: { lat: number; lon: number };
  startYear: number;
  endYear: number;
  aggregation: 'monthly' | 'seasonal' | 'annual';
  result: {
    slope: number;
    annualRate: number;
    changePercent: number;
    pValue: number;
    verdictLabel: string;
    verdict: TrendVerdict;
  };
  createdAt: string;
  notes?: string;
}

export interface WatchlistItem {
  id: string;
  variableId: VariableId;
  regionId: string;
  regionName: string;
  addedAt: string;
  recentRate: string;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
}

export interface OppositeTrendPair {
  id: string;
  title: string;
  theme: string;
  summary: string;
  connectedMechanism: string;
  primaryRegion: {
    name: string;
    variableId: VariableId;
    lat: number;
    lon: number;
    trendDirection: 'increasing' | 'decreasing';
    rateText: string;
    driverSummary: string;
  };
  secondaryRegion: {
    name: string;
    variableId: VariableId;
    lat: number;
    lon: number;
    trendDirection: 'increasing' | 'decreasing';
    rateText: string;
    driverSummary: string;
  };
}

export interface TrendCase {
  id: string;
  title: string;
  tagline: string;
  variableId: VariableId;
  regionId: string;
  regionName: string;
  timePeriod: string;
  startYear: number;
  endYear: number;
  summary: string;
  narrativeIntro: string;
  keyFindings: string[];
  scientificContext: string;
  statisticalResult: {
    slope: number;
    slopeUnit: string;
    totalChange: string;
    pValue: number;
    kendallTau: number;
    confidence: string;
    verdictLabel: string;
  };
  nasaDataSources: string[];
}

export interface DataSourceMetadata {
  id: string;
  name: string;
  agency: string;
  missionOrModel: string;
  spatialResolution: string;
  temporalResolution: string;
  temporalCoverage: string;
  variables: string[];
  accessMethod: string;
  apiEndpoint: string;
  citation: string;
  license: string;
  link: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isGuest: boolean;
  createdAt: string;
}
