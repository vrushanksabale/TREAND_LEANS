import React, { useState, useEffect, useMemo } from 'react';
import { VariableId, EarthVariable, RegionLocation, TimeSeriesPoint, StatisticalResult } from '../types';
import { EARTH_VARIABLES } from '../data/variables';
import { PRESET_REGIONS } from '../data/regions';
import { OPPOSITE_TREND_PAIRS } from '../data/oppositeTrends';
import { fetchNasaPowerSeries } from '../services/nasaPowerApi';
import { getBaselineSeries } from '../data/curatedSeries';
import { calculateStatistics, aggregateSeries } from '../services/statisticsEngine';
import { saveAnalysis, toggleWatchlist, logExportRecord } from '../services/storageService';
import { TrendMap } from '../components/maps/TrendMap';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { ExplanationDrawer } from '../components/ExplanationDrawer';
import { 
  Compass, 
  Bookmark, 
  Download, 
  HelpCircle, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Share2, 
  FileSpreadsheet, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface AnalyzePageProps {
  initialVariableId?: string;
  initialRegionId?: string;
  initialStartYear?: number;
  initialEndYear?: number;
  onOpenExplanationGuide?: () => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  initialVariableId,
  initialRegionId,
  initialStartYear,
  initialEndYear
}) => {
  // Analytical Parameters
  const [selectedVariable, setSelectedVariable] = useState<VariableId>(
    (initialVariableId as VariableId) || 'sea_ice_extent'
  );
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    initialRegionId || 'arctic_ocean'
  );
  const [startYear, setStartYear] = useState<number>(initialStartYear || 1995);
  const [endYear, setEndYear] = useState<number>(initialEndYear || 2024);
  const [aggregation, setAggregation] = useState<'monthly' | 'seasonal' | 'annual'>('monthly');

  // Chart Toggles
  const [showConfidence, setShowConfidence] = useState<boolean>(true);
  const [showRollingMean, setShowRollingMean] = useState<boolean>(true);

  // Custom coordinate probe state
  const [customCoords, setCustomCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Data Loading & Results
  const [rawSeries, setRawSeries] = useState<TimeSeriesPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSourceNotice, setDataSourceNotice] = useState<string>('NASA Observational Stream');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);

  // Identify current region metadata or build custom coordinate region
  const currentRegion: RegionLocation = useMemo(() => {
    if (customCoords) {
      return {
        id: 'custom_coord',
        name: `Probed Coordinate (${customCoords.lat.toFixed(2)}°, ${customCoords.lon.toFixed(2)}°)`,
        category: 'temperate',
        description: 'User-selected point coordinate probed from interactive Leaflet map.',
        lat: customCoords.lat,
        lon: customCoords.lon,
        bbox: [customCoords.lon - 2, customCoords.lat - 2, customCoords.lon + 2, customCoords.lat + 2],
        defaultZoom: 6
      };
    }
    return PRESET_REGIONS.find(r => r.id === selectedRegionId) || PRESET_REGIONS[0];
  }, [selectedRegionId, customCoords]);

  const variableMeta = EARTH_VARIABLES[selectedVariable];

  // Fetch observational data whenever selection changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const { points, source } = await fetchNasaPowerSeries(
          selectedVariable,
          currentRegion.lat,
          currentRegion.lon,
          startYear,
          endYear,
          currentRegion.id
        );

        if (!isCancelled) {
          setRawSeries(points);
          setDataSourceNotice(
            source === 'nasa_power_live' 
              ? 'NASA POWER API (Live Satellite Stream)' 
              : `${variableMeta.nasaMission} (Curated Satellite Benchmark)`
          );
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          // Fallback
          const baseline = getBaselineSeries(selectedVariable, currentRegion.id, startYear, endYear);
          setRawSeries(baseline);
          setDataSourceNotice(`${variableMeta.nasaMission} (Curated Satellite Benchmark)`);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [selectedVariable, currentRegion, startYear, endYear]);

  // Aggregate Series according to monthly / seasonal / annual mode
  const aggregatedSeries = useMemo(() => {
    return aggregateSeries(rawSeries, startYear, endYear, aggregation);
  }, [rawSeries, startYear, endYear, aggregation]);

  // Run statistical test calculations
  const stats: StatisticalResult = useMemo(() => {
    return calculateStatistics(
      aggregatedSeries,
      selectedVariable,
      variableMeta.name,
      variableMeta.unit,
      currentRegion.name,
      aggregation
    );
  }, [aggregatedSeries, selectedVariable, variableMeta, currentRegion, aggregation]);

  // Handle map click coordinate probe
  const handleMapCoordinatePick = (lat: number, lon: number) => {
    setCustomCoords({ lat, lon });
  };

  // Reset to preset region
  const handlePresetSelect = (regId: string) => {
    setCustomCoords(null);
    setSelectedRegionId(regId);
  };

  // Save current investigation
  const handleSaveAnalysis = () => {
    saveAnalysis({
      title: `${variableMeta.shortName} in ${currentRegion.name} (${startYear}–${endYear})`,
      variableId: selectedVariable,
      regionId: currentRegion.id,
      regionName: currentRegion.name,
      coordinates: { lat: currentRegion.lat, lon: currentRegion.lon },
      startYear,
      endYear,
      aggregation,
      result: {
        slope: stats.olsSlope,
        annualRate: stats.annualRate,
        changePercent: stats.percentageChange,
        pValue: stats.pValue,
        verdictLabel: stats.verdictLabel,
        verdict: stats.verdict
      },
      notes: `Observed ${stats.sampleCount} intervals with Kendall's tau = ${stats.kendallTau}. ${stats.interpretiveNotes}`
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Toggle Watchlist
  const handleToggleWatchlist = () => {
    const isAdded = toggleWatchlist({
      variableId: selectedVariable,
      regionId: currentRegion.id,
      regionName: currentRegion.name,
      recentRate: `${stats.olsSlope > 0 ? '+' : ''}${stats.olsSlope.toFixed(4)} ${variableMeta.unit}/yr`,
      trendDirection: stats.olsSlope > 0 ? 'increasing' : stats.olsSlope < 0 ? 'decreasing' : 'stable'
    });
    setIsWatchlisted(isAdded);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (aggregatedSeries.length === 0) return;

    let csv = `TrendLens Earth Observation Export\n`;
    csv += `Variable:,"${variableMeta.name} (${variableMeta.unit})"\n`;
    csv += `Region:,"${currentRegion.name}" (Lat: ${currentRegion.lat}, Lon: ${currentRegion.lon})\n`;
    csv += `Observation Period:,"${startYear} to ${endYear}" (${aggregation})\n`;
    csv += `OLS Slope:,"${stats.olsSlope} ${variableMeta.unit}/year"\n`;
    csv += `Mann-Kendall p-value:,"${stats.pValue}" (tau: ${stats.kendallTau})\n`;
    csv += `Significance Verdict:,"${stats.verdictLabel}"\n`;
    csv += `NASA Mission / Sensor:,"${variableMeta.nasaMission} / ${variableMeta.sensor}"\n`;
    csv += `Provenance:,"${dataSourceNotice}"\n\n`;
    csv += `Date,Year,Month,Observed_Value,Baseline_Anomaly,Rolling_Mean\n`;

    aggregatedSeries.forEach(pt => {
      csv += `${pt.date},${pt.year},${pt.month},${pt.value},${pt.anomaly ?? ''},${pt.rollingAvg ?? ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `TrendLens_${selectedVariable}_${currentRegion.id}_${startYear}_${endYear}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logExportRecord({
      filename,
      variableName: variableMeta.shortName,
      regionName: currentRegion.name,
      format: 'CSV',
      recordCount: aggregatedSeries.length
    });
  };

  // Relevant opposite trend teleconnection
  const matchedOpposite = useMemo(() => {
    return OPPOSITE_TREND_PAIRS.find(pair => 
      pair.primaryRegion.variableId === selectedVariable ||
      pair.secondaryRegion.variableId === selectedVariable
    ) || OPPOSITE_TREND_PAIRS[0];
  }, [selectedVariable]);

  return (
    <div className="min-h-screen pt-[86px] pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar (Black Session Container) */}
        <div className="data-card-scitech p-6 mb-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[rgba(255,255,255,0.15)] shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-bold">
                WORKBENCH TELEMETRY · SCI-TECH MODE
              </span>
              <span className="text-xs text-[#8e8e99]">|</span>
              <span className="text-xs font-mono text-[#d1d1d6]">{dataSourceNotice}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff] font-heading">
              {variableMeta.name} in <span className="text-[#f64137]">{currentRegion.name}</span>
            </h1>
          </div>

          {/* Action Buttons: Save, Watchlist, Export, Help (Bold Red Styling) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsExplanationOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#000000] hover:bg-[#f64137] border-2 border-[#f64137] text-xs font-mono text-[#ffffff] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(246,65,55,0.2)]"
            >
              <HelpCircle size={15} className="text-[#ffffff]" />
              <span>Statistical Guide</span>
            </button>

            <button
              onClick={handleToggleWatchlist}
              className={`px-4 py-2.5 rounded-lg border-2 text-xs font-mono transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isWatchlisted
                  ? 'bg-[#f64137] border-[#f64137] text-[#ffffff] shadow-[0_0_15px_rgba(246,65,55,0.4)]'
                  : 'bg-[#000000] hover:bg-[#f64137] border-[#f64137] text-[#ffffff]'
              }`}
            >
              <Bookmark size={15} />
              <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={handleSaveAnalysis}
              className="px-4 py-2.5 rounded-lg bg-[#000000] hover:bg-[#f64137] border-2 border-[#f64137] text-xs font-mono text-[#ffffff] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(246,65,55,0.2)]"
            >
              <CheckCircle2 size={15} className={saveSuccess ? 'text-[#00ff88]' : 'text-[#ffffff]'} />
              <span>{saveSuccess ? 'Saved to Dashboard!' : 'Save Analysis'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-primary-scitech text-xs py-2.5 px-5"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Core Workspace Layout: 3 Columns (Left Controls, Center Map, Right Verdict) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Controls Sidebar (3 columns) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="data-card-scitech p-5 space-y-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.1)]">
                <Sliders size={15} className="text-[#f64137]" />
                <h2 className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-semibold">
                  Investigation Controls
                </h2>
              </div>

              {/* Variable Selector */}
              <div>
                <label className="block text-xs font-mono text-[#a0b0c0] mb-1.5">
                  Earth-System Variable
                </label>
                <select
                  value={selectedVariable}
                  onChange={e => setSelectedVariable(e.target.value as VariableId)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] text-xs font-medium text-[#ffffff] outline-none cursor-pointer"
                >
                  {Object.values(EARTH_VARIABLES).map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.unit})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#607080] mt-1.5 leading-relaxed">
                  {variableMeta.description}
                </p>
              </div>

              {/* Region Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-[#a0b0c0]">
                    Observation Domain
                  </label>
                  {customCoords && (
                    <button
                      onClick={() => setCustomCoords(null)}
                      className="text-[11px] text-[#f64137] hover:underline"
                    >
                      Reset to preset
                    </button>
                  )}
                </div>

                {customCoords ? (
                  <div className="p-2.5 rounded-lg bg-[#000000] border border-[#f64137] text-xs font-mono text-[#f64137] shadow-[0_0_12px_rgba(246,65,55,0.2)]">
                    <div>Point Coordinate Active</div>
                    <div className="text-[11px] text-[#a0b0c0] mt-0.5">
                      Lat: {customCoords.lat.toFixed(3)}° | Lon: {customCoords.lon.toFixed(3)}°
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedRegionId}
                    onChange={e => handlePresetSelect(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] text-xs font-medium text-[#ffffff] outline-none cursor-pointer"
                  >
                    {PRESET_REGIONS.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-[11px] text-[#607080] mt-1.5">
                  {currentRegion.description}
                </p>
              </div>

              {/* Time Range Selector */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-[#a0b0c0]">Observation Period</span>
                  <span className="text-[#f64137] font-semibold">{startYear} – {endYear}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#607080] block mb-1">Start Year</span>
                    <input
                      type="number"
                      min={1981}
                      max={endYear - 3}
                      value={startYear}
                      onChange={e => setStartYear(Math.min(endYear - 3, Math.max(1981, parseInt(e.target.value) || 1995)))}
                      className="w-full px-2.5 py-1.5 rounded bg-[#000000] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] text-xs font-mono text-[#ffffff]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#607080] block mb-1">End Year</span>
                    <input
                      type="number"
                      min={startYear + 3}
                      max={2024}
                      value={endYear}
                      onChange={e => setEndYear(Math.max(startYear + 3, Math.min(2024, parseInt(e.target.value) || 2024)))}
                      className="w-full px-2.5 py-1.5 rounded bg-[#000000] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] text-xs font-mono text-[#ffffff]"
                    />
                  </div>
                </div>
              </div>

              {/* Temporal Aggregation Mode */}
              <div>
                <label className="block text-xs font-mono text-[#a0b0c0] mb-1.5">
                  Temporal Aggregation
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.12)] text-xs font-mono">
                  {(['monthly', 'seasonal', 'annual'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setAggregation(mode)}
                      className={`py-1.5 rounded text-center capitalize transition-all cursor-pointer ${
                        aggregation === mode
                          ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_10px_rgba(246,65,55,0.3)]'
                          : 'text-[#a0b0c0] hover:text-[#ffffff]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visual Options */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.1)] space-y-2 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-[#ffffff]">
                  <input
                    type="checkbox"
                    checked={showConfidence}
                    onChange={e => setShowConfidence(e.target.checked)}
                    className="accent-[#f64137]"
                  />
                  <span>95% Confidence Band</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#ffffff]">
                  <input
                    type="checkbox"
                    checked={showRollingMean}
                    onChange={e => setShowRollingMean(e.target.checked)}
                    className="accent-[#f64137]"
                  />
                  <span>12-Month Centered Mean</span>
                </label>
              </div>
            </div>

            {/* Sensor Provenance Card */}
            <div className="data-card-scitech p-4 text-xs font-mono space-y-1.5 border border-[rgba(255,255,255,0.1)]">
              <div className="text-[#f64137] font-semibold">Sensor Provenance</div>
              <div className="text-[#a0b0c0]">Mission: <span className="text-[#ffffff]">{variableMeta.nasaMission}</span></div>
              <div className="text-[#a0b0c0]">Resolution: <span className="text-[#ffffff]">{variableMeta.spatialResolution}</span></div>
              <div className="text-[#a0b0c0]">Baseline: <span className="text-[#ffffff]">{variableMeta.baselinePeriod}</span></div>
            </div>
          </div>

          {/* Center Column: Interactive Map (5 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <TrendMap
              currentRegion={currentRegion}
              onMapClickCoordinates={handleMapCoordinatePick}
              variableColor={variableMeta.color || "#f64137"}
              trendVerdict={stats.verdictLabel}
            />
          </div>

          {/* Right Column: Trend Result & Statistical Verdict (4 columns) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="data-card-scitech p-6 shadow-[0_0_30px_rgba(246,65,55,0.08)] border border-[rgba(255,255,255,0.1)]">
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] mb-5">
                <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-semibold">
                  Significance Verdict
                </span>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  stats.verdict === 'significant_increase'
                    ? 'bg-[#f64137]/15 text-[#f64137] border border-[#f64137]/40' :
                  stats.verdict === 'significant_decrease'
                    ? 'bg-[#f64137]/15 text-[#f64137] border border-[#f64137]/40 shadow-[0_0_10px_rgba(246,65,55,0.2)]' :
                  stats.verdict === 'emerging_trend'
                    ? 'bg-[#f64137]/10 text-[#f64137] border border-[#f64137]/30' :
                    'bg-[#a0b0c0]/10 text-[#a0b0c0] border border-[#a0b0c0]/30'
                }`}>
                  {stats.verdictLabel}
                </span>
              </div>

              {/* Core 4 Questions Answers */}
              <div className="space-y-4">
                {/* 1. What is changing */}
                <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#a0b0c0]">
                    <span>What is changing?</span>
                    <span className="text-[#f64137] font-semibold">{variableMeta.shortName}</span>
                  </div>
                  <div className="text-xs text-[#ffffff] mt-1 font-medium">
                    {variableMeta.name}
                  </div>
                </div>

                {/* 2. How much is it changing */}
                <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                  <div className="text-[11px] font-mono text-[#a0b0c0] mb-1">
                    How much is it changing?
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className={`text-h3 font-mono ${
                      stats.olsSlope > 0 ? 'text-[#f64137]' : stats.olsSlope < 0 ? 'text-[#38bdf8]' : 'text-[#ffffff]'
                    }`}>
                      {stats.olsSlope > 0 ? '+' : ''}{stats.olsSlope.toFixed(4)}
                    </span>
                    <span className="text-xs font-mono text-[#a0b0c0]">
                      {variableMeta.unit} / year
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)] flex justify-between text-xs font-mono text-[#a0b0c0]">
                    <span>Total Shift: <strong className="text-[#ffffff]">{stats.absoluteChange > 0 ? '+' : ''}{stats.absoluteChange} {variableMeta.unit}</strong></span>
                    <span>Departure: <strong className="text-[#ffffff]">{stats.percentageChange > 0 ? '+' : ''}{stats.percentageChange}%</strong></span>
                  </div>
                </div>

                {/* 3. Statistical Testing Results */}
                <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)] space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-[#a0b0c0] pb-1 border-b border-[rgba(255,255,255,0.1)]">
                    <span>Mann-Kendall Test</span>
                    <span className="text-[#00ff88] font-bold">
                      {stats.pValue < 0.001 ? 'p < 0.001' : `p = ${stats.pValue}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#a0b0c0]">
                    <span>Kendall's Tau (τ):</span>
                    <span className="text-[#f64137] font-semibold">{stats.kendallTau}</span>
                  </div>
                  <div className="flex justify-between text-[#a0b0c0]">
                    <span>Sen's Robust Slope:</span>
                    <span className="text-[#ffffff] font-semibold">{stats.sensSlope.toFixed(4)}/yr</span>
                  </div>
                  <div className="flex justify-between text-[#a0b0c0]">
                    <span>95% Confidence Bounds:</span>
                    <span className="text-[#607080] text-[11px]">
                      [{stats.ciLower.toFixed(4)}, {stats.ciUpper.toFixed(4)}]
                    </span>
                  </div>
                </div>

                {/* Non-Causal Guidance Banner */}
                <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(246,65,55,0.3)] text-xs">
                  <div className="flex items-center gap-1.5 text-[#f64137] font-semibold mb-1">
                    <AlertTriangle size={13} />
                    <span>Scientific Context (Non-Causal)</span>
                  </div>
                  <p className="text-[#a0b0c0] text-[11px] leading-relaxed">
                    {stats.interpretiveNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opposite-Trend Teleconnection Spotlight Banner */}
        <div className="mb-8 data-card-scitech p-6 border border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#f64137] animate-pulse" />
              <h2 className="text-sm font-mono uppercase tracking-[2px] text-[#ffffff] font-semibold">
                Opposite-Trend Teleconnection Spotlight
              </h2>
            </div>
            <span className="text-xs font-mono text-[#a0b0c0]">
              {matchedOpposite.theme}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-bold text-base text-[#ffffff] mb-1.5">
                {matchedOpposite.title}
              </h3>
              <p className="text-xs text-[#a0b0c0] leading-relaxed mb-3">
                {matchedOpposite.connectedMechanism}
              </p>
              <div className="text-[11px] font-mono text-[#607080]">
                Interpretive context only. Multi-variate atmospheric modeling is required to confirm causal pathways.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(0,255,136,0.3)]">
                <div className="text-[10px] font-mono uppercase text-[#00ff88]">Region A</div>
                <div className="font-semibold text-xs text-[#ffffff] mt-0.5">{matchedOpposite.primaryRegion.name}</div>
                <div className="text-xs font-mono text-[#00ff88] mt-1">{matchedOpposite.primaryRegion.rateText}</div>
                <div className="text-[11px] text-[#a0b0c0] mt-1.5">{matchedOpposite.primaryRegion.driverSummary}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(246,65,55,0.3)]">
                <div className="text-[10px] font-mono uppercase text-[#f64137]">Region B</div>
                <div className="font-semibold text-xs text-[#ffffff] mt-0.5">{matchedOpposite.secondaryRegion.name}</div>
                <div className="text-xs font-mono text-[#f64137] mt-1">{matchedOpposite.secondaryRegion.rateText}</div>
                <div className="text-[11px] text-[#a0b0c0] mt-1.5">{matchedOpposite.secondaryRegion.driverSummary}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Time-Series Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#E6EDF7]">
              Time-Series Observational Trajectory
            </h2>
            <div className="text-xs font-mono text-[#94A3B8]">
              {aggregatedSeries.length} Aggregated Intervals ({startYear}–{endYear})
            </div>
          </div>

          <TimeSeriesChart
            data={aggregatedSeries}
            variableName={variableMeta.name}
            unit={variableMeta.unit}
            olsSlope={stats.olsSlope}
            olsIntercept={stats.olsIntercept}
            ciLower={stats.ciLower}
            ciUpper={stats.ciUpper}
            color={variableMeta.color}
            showConfidenceInterval={showConfidence}
            showRollingMean={showRollingMean}
          />
        </div>
      </div>

      {/* Statistical Explanation Drawer */}
      <ExplanationDrawer
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
      />
    </div>
  );
};
