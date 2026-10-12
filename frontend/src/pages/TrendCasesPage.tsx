import React, { useState } from 'react';
import { TREND_CASES } from '../data/trendCases';
import { EARTH_VARIABLES } from '../data/variables';
import { TrendCase } from '../types';
import { ArrowRight, Compass, CheckCircle2, ChevronRight, BookOpen, AlertCircle, Database } from 'lucide-react';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { getBaselineSeries } from '../data/curatedSeries';
import { calculateStatistics } from '../services/statisticsEngine';

interface TrendCasesPageProps {
  onOpenInAnalyze: (variableId: string, regionId: string, startYear: number, endYear: number) => void;
  selectedCaseId?: string;
}

export const TrendCasesPage: React.FC<TrendCasesPageProps> = ({
  onOpenInAnalyze,
  selectedCaseId
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(
    selectedCaseId || TREND_CASES[0].id
  );

  const activeCase: TrendCase = TREND_CASES.find(c => c.id === activeCaseId) || TREND_CASES[0];
  const variableMeta = EARTH_VARIABLES[activeCase.variableId];

  // Retrieve observation series for the active case
  const seriesData = getBaselineSeries(
    activeCase.variableId,
    activeCase.regionId,
    activeCase.startYear,
    activeCase.endYear
  );

  const stats = calculateStatistics(
    seriesData,
    activeCase.variableId,
    variableMeta.name,
    variableMeta.unit,
    activeCase.regionName
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section (Black Session Container) */}
        <div className="section-card-scitech bg-[#000000] text-[#ffffff] p-8 sm:p-12 rounded-3xl border border-[rgba(255,255,255,0.14)] shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(246,65,55,0.2)] font-bold">
            <span className="status-indicator status-red" />
            <BookOpen size={13} className="text-[#f64137]" />
            <span>Story Mode · Guided Planetary Investigations</span>
          </div>
          <h1 className="text-h1 text-[#ffffff] font-bold tracking-tight">
            Planetary Trend Case Studies
          </h1>
          <p className="text-base text-[#d1d1d6] mt-3 leading-relaxed max-w-3xl">
            Examine peer-reviewed environmental investigations backed by multi-decadal NASA satellite records. Each case includes physical narrative context, verified sensor provenance, and rigorous non-parametric statistical testing.
          </p>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {TREND_CASES.map(item => {
            const isActive = item.id === activeCase.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCaseId(item.id)}
                className={`px-5 py-3 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-[#0d0d12] text-[#ffffff] border-[#f64137] font-bold shadow-[0_0_20px_rgba(246,65,55,0.35)]'
                    : 'bg-[#08080c] text-[#d1d1d6] border-[rgba(255,255,255,0.12)] hover:text-[#f64137] hover:border-[rgba(246,65,55,0.4)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`status-indicator ${isActive ? 'status-red' : 'status-success'}`} />
                  <span>{item.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Narrative, Key Findings, Sources */}
          <div className="lg:col-span-7 space-y-6">
            <div className="data-card-scitech p-8 hover:border-[#f64137]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[rgba(255,255,255,0.12)]">
                <div>
                  <span className="text-xs font-mono text-[#f64137] uppercase tracking-widest block mb-1 font-bold">
                    {activeCase.regionName} · {activeCase.timePeriod}
                  </span>
                  <h2 className="text-2xl font-bold text-[#ffffff]">{activeCase.title}</h2>
                </div>
                <button
                  onClick={() => onOpenInAnalyze(activeCase.variableId, activeCase.regionId, activeCase.startYear, activeCase.endYear)}
                  className="btn-primary-scitech text-xs py-2.5 px-4 shrink-0"
                >
                  <Compass size={14} />
                  <span>Open in Analyze</span>
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-[#000000] border border-[rgba(246,65,55,0.35)] text-xs font-mono text-[#ffffff] mb-6 flex items-center gap-2 font-medium">
                <span className="status-indicator status-red" />
                <span>{activeCase.tagline}</span>
              </div>

              <div className="space-y-4 text-sm text-[#d1d1d6] leading-relaxed">
                <p>{activeCase.narrativeIntro}</p>
                <p>{activeCase.scientificContext}</p>
              </div>

              {/* Key Findings List */}
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.12)]">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#f64137] mb-4 flex items-center gap-2 font-bold">
                  <CheckCircle2 size={14} className="text-[#00ff88]" />
                  <span>Key Observational Findings</span>
                </h3>
                <ul className="space-y-3 text-xs text-[#ffffff]">
                  {activeCase.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] mt-1.5 shrink-0 shadow-[0_0_6px_#00ff88]" />
                      <span className="leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* NASA Sensor Provenance */}
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.12)]">
                <div className="text-xs font-mono text-[#d1d1d6] mb-3 flex items-center gap-2">
                  <Database size={14} className="text-[#f64137]" />
                  <span>Integrated NASA Sensor Products:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCase.nasaDataSources.map((src, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded bg-[#000000] border border-[rgba(246,65,55,0.35)] text-xs font-mono text-[#ffffff] font-semibold"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Statistical Result Card & Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="data-card-scitech p-8 hover:border-[#f64137]">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.12)] mb-6">
                <div>
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#f64137] block font-bold">
                    STATISTICAL VERDICT
                  </span>
                  <div className="text-h3 text-[#ffffff] font-bold mt-1">
                    {activeCase.statisticalResult.verdictLabel}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-indicator status-success" />
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[rgba(0,255,136,0.12)] text-[#00ff88] border border-[rgba(0,255,136,0.35)] shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                    p &lt; 0.05
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                  <div className="text-xs font-mono text-[#8e8e99] uppercase tracking-wider">Estimated Annual Slope (OLS)</div>
                  <div className="text-2xl font-bold font-mono text-[#ffffff] mt-1">
                    {activeCase.statisticalResult.slope > 0 ? '+' : ''}
                    {activeCase.statisticalResult.slope} {activeCase.statisticalResult.slopeUnit}
                  </div>
                  <div className="text-xs font-mono text-[#f64137] mt-1.5 font-bold">
                    Net Period Departure: {activeCase.statisticalResult.totalChange}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                    <div className="text-[#8e8e99] text-[11px] uppercase tracking-wider">Mann-Kendall p-value</div>
                    <div className="text-lg font-bold text-[#ffffff] mt-1">
                      {activeCase.statisticalResult.pValue < 0.001 ? '< 0.001' : activeCase.statisticalResult.pValue}
                    </div>
                    <div className="text-[10px] text-[#8e8e99] mt-0.5">Two-tailed test</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                    <div className="text-[#8e8e99] text-[11px] uppercase tracking-wider">Kendall’s Tau (τ)</div>
                    <div className="text-lg font-bold text-[#f64137] mt-1">
                      {activeCase.statisticalResult.kendallTau}
                    </div>
                    <div className="text-[10px] text-[#8e8e99] mt-0.5">Rank correlation</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)] text-xs font-mono">
                  <div className="text-[#8e8e99] text-[11px] uppercase tracking-wider mb-1">95% Uncertainty Bounds</div>
                  <div className="text-[#ffffff] font-semibold">{activeCase.statisticalResult.confidence}</div>
                </div>
              </div>

              <button
                onClick={() => onOpenInAnalyze(activeCase.variableId, activeCase.regionId, activeCase.startYear, activeCase.endYear)}
                className="w-full mt-6 btn-primary-scitech justify-center"
              >
                <Compass size={16} />
                <span>Open in Analyze Workbench</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Visualization Area */}
        <div className="data-card-scitech p-6 sm:p-8 border-2 border-[rgba(246,65,55,0.4)] mb-12 relative overflow-hidden bg-[#0d0d12]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[rgba(255,255,255,0.12)]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#f64137] block mb-1 font-bold">
                MULTI-DECADAL OBSERVATION TELEMETRY
              </span>
              <h3 className="text-xl font-bold text-[#ffffff]">
                Sensor Series, Deseasonalized Anomalies &amp; Parametric Trendline
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="status-indicator status-success" />
              <span className="text-xs font-mono text-[#ffffff] bg-[#000000] px-3 py-1 rounded border border-[rgba(255,255,255,0.15)]">
                {seriesData.length} Monthly Observations Loaded
              </span>
            </div>
          </div>

          <div className="min-h-[400px] w-full">
            <TimeSeriesChart
              data={seriesData}
              variableName={variableMeta.name}
              unit={variableMeta.unit}
              olsSlope={stats.olsSlope}
              olsIntercept={stats.olsIntercept}
              ciLower={stats.ciLower}
              ciUpper={stats.ciUpper}
              color={variableMeta.color}
            />
          </div>

          {/* Overlay Text */}
          <div className="text-[12px] font-mono text-[#8e8e99] text-right mt-3">
            NASA EOSDIS / OLS-MK v2.4 ENGINE · WMO STANDARDIZED ANOMALIES
          </div>
        </div>
      </div>
    </div>
  );
};
