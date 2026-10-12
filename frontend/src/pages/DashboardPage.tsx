import React, { useState, useEffect } from 'react';
import { UserProfile, SavedAnalysis, WatchlistItem } from '../types';
import { 
  getSavedAnalyses, 
  deleteSavedAnalysis, 
  getWatchlist, 
  toggleWatchlist, 
  getExportHistory, 
  ExportHistoryRecord 
} from '../services/storageService';
import { EARTH_VARIABLES } from '../data/variables';
import { PRESET_REGIONS } from '../data/regions';
import { 
  Compass, 
  Trash2, 
  Bookmark, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Tv,
  Radio,
  Sparkles,
  Globe,
  Database,
  Search,
  Shield,
  Layers,
  FileText
} from 'lucide-react';
import { DATA_SOURCES_CATALOG } from '../data/dataSourcesCatalog';
import { MiniSparkline } from '../components/charts/MiniSparkline';

interface DashboardPageProps {
  user: UserProfile | null;
  onOpenLoginModal: () => void;
  onReloadAnalysis: (variableId: string, regionId: string, startYear: number, endYear: number) => void;
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onOpenLoginModal,
  onReloadAnalysis,
  onNavigate
}) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>([]);
  const [dashboardTab, setDashboardTab] = useState<'all' | 'workspace' | 'data' | 'news'>('all');
  const [dataSearchTerm, setDataSearchTerm] = useState('');
  const [selectedDataFilter, setSelectedDataFilter] = useState('all');

  useEffect(() => {
    if (user) {
      setAnalyses(getSavedAnalyses());
      setWatchlist(getWatchlist());
      setExportHistory(getExportHistory());
    }
  }, [user]);

  const handleDelete = (id: string) => {
    deleteSavedAnalysis(id);
    setAnalyses(getSavedAnalyses());
  };

  const handleToggleWatch = (item: WatchlistItem) => {
    toggleWatchlist(item);
    setWatchlist(getWatchlist());
  };

  // Compute analytics
  const totalAnalyses = analyses.length;
  const significantCount = analyses.filter(a => a.result.pValue < 0.05).length;
  const sigPercentage = totalAnalyses > 0 ? Math.round((significantCount / totalAnalyses) * 100) : 0;
  
  // Find most analyzed variable
  const variableCounts: Record<string, number> = {};
  analyses.forEach(a => {
    variableCounts[a.variableId] = (variableCounts[a.variableId] || 0) + 1;
  });
  let mostAnalyzedVar = 'surface_temperature';
  let maxCount = 0;
  Object.keys(variableCounts).forEach(v => {
    if (variableCounts[v] > maxCount) {
      maxCount = variableCounts[v];
      mostAnalyzedVar = v;
    }
  });

  const filteredDataSources = DATA_SOURCES_CATALOG.filter(ds => {
    const q = dataSearchTerm.toLowerCase();
    const matchesSearch = 
      ds.name.toLowerCase().includes(q) ||
      ds.agency.toLowerCase().includes(q) ||
      ds.missionOrModel.toLowerCase().includes(q) ||
      ds.variables.some(v => v.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedDataFilter === 'all') return true;
    if (selectedDataFilter === 'atmosphere') {
      return ds.id === 'nasa_power' || ds.variables.some(v => v.toLowerCase().includes('temperature') || v.toLowerCase().includes('aerosol'));
    }
    if (selectedDataFilter === 'hydrosphere') {
      return ds.variables.some(v => v.toLowerCase().includes('precip') || v.toLowerCase().includes('rain') || v.toLowerCase().includes('water'));
    }
    if (selectedDataFilter === 'cryosphere') {
      return ds.id === 'nsidc_sea_ice' || ds.variables.some(v => v.toLowerCase().includes('ice'));
    }
    if (selectedDataFilter === 'biosphere') {
      return ds.id === 'lp_daac_modis' || ds.variables.some(v => v.toLowerCase().includes('ndvi') || v.toLowerCase().includes('vegetation'));
    }
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#ffffff] text-[#000000]">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <div className="data-card-scitech p-8 sm:p-10 shadow-[0_0_30px_rgba(246,65,55,0.2)] border border-[rgba(255,255,255,0.15)]">
            <div className="w-14 h-14 rounded-2xl bg-[#0d0d12] border border-[rgba(246,65,55,0.5)] text-[#f64137] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(246,65,55,0.3)]">
              <User size={26} />
            </div>
            <h1 className="text-2xl font-bold text-[#ffffff] font-heading mb-2">
              Sign In to Access Your Dashboard
            </h1>
            <p className="text-sm text-[#d1d1d6] max-w-md mx-auto mb-6 leading-relaxed">
              Your personal workspace stores saved Earth data analyses, regional watchlists, and investigation history. Please sign in or create an account to view your dashboard.
            </p>
            <div className="space-y-3">
              <button
                onClick={onOpenLoginModal}
                className="w-full btn-primary-scitech"
              >
                Sign In / Create Account
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full btn-secondary-scitech text-xs font-mono"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[86px] pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Welcome Header */}
        <div className="data-card-scitech p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(246,65,55,0.15)] border border-[rgba(255,255,255,0.14)]">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover border border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.35)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#0d0d12] border border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.35)] flex items-center justify-center text-[#f64137] text-2xl font-bold font-mono">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#f64137] shadow-[0_0_6px_#f64137]" />
                <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-bold">
                  NASA INVESTIGATOR WORKSPACE
                </span>
                {user.isGuest && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d0d12] text-[#d1d1d6] border border-[rgba(255,255,255,0.15)]">
                    Guest Session
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff]">
                {user.displayName}
              </h1>
              <p className="text-xs text-[#d1d1d6] font-mono mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="btn-primary-scitech text-xs py-2.5 px-5"
            >
              <Compass size={15} />
              <span>New Investigation</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setDashboardTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 ${
              dashboardTab === 'all'
                ? 'bg-[#000000] text-[#ffffff] border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.4)]'
                : 'bg-[#000000]/90 text-[#d1d1d6] border-[rgba(255,255,255,0.14)] hover:text-[#f64137] hover:border-[#f64137]'
            }`}
          >
            <Layers size={14} className={dashboardTab === 'all' ? 'text-[#f64137]' : ''} />
            <span>All Dashboard Sections</span>
          </button>

          <button
            onClick={() => setDashboardTab('workspace')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 ${
              dashboardTab === 'workspace'
                ? 'bg-[#000000] text-[#ffffff] border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.4)]'
                : 'bg-[#000000]/90 text-[#d1d1d6] border-[rgba(255,255,255,0.14)] hover:text-[#f64137] hover:border-[#f64137]'
            }`}
          >
            <Compass size={14} className={dashboardTab === 'workspace' ? 'text-[#f64137]' : ''} />
            <span>Investigations &amp; Watchlist ({totalAnalyses})</span>
          </button>

          <button
            onClick={() => setDashboardTab('data')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 ${
              dashboardTab === 'data'
                ? 'bg-[#000000] text-[#ffffff] border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.4)]'
                : 'bg-[#000000]/90 text-[#d1d1d6] border-[rgba(255,255,255,0.14)] hover:text-[#f64137] hover:border-[#f64137]'
            }`}
          >
            <Database size={14} className={dashboardTab === 'data' ? 'text-[#f64137]' : ''} />
            <span>Observational Archives (Data) ({DATA_SOURCES_CATALOG.length})</span>
          </button>

          <button
            onClick={() => setDashboardTab('news')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 ${
              dashboardTab === 'news'
                ? 'bg-[#000000] text-[#ffffff] border-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.4)]'
                : 'bg-[#000000]/90 text-[#d1d1d6] border-[rgba(255,255,255,0.14)] hover:text-[#f64137] hover:border-[#f64137]'
            }`}
          >
            <Tv size={14} className={dashboardTab === 'news' ? 'text-[#f64137]' : ''} />
            <span>NASA News &amp; Multimedia</span>
          </button>
        </div>

        {/* Analytical Metric Widgets & Workspace Grid */}
        {(dashboardTab === 'all' || dashboardTab === 'workspace') && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="data-card-scitech p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#d1d1d6] font-bold">SAVED INVESTIGATIONS</span>
              <span className="status-indicator status-red" />
            </div>
            <div className="text-h3 font-mono text-[#ffffff] mt-1">{totalAnalyses}</div>
            <div className="text-xs text-[#8e8e99] mt-1">Persisted records</div>
          </div>

          <div className="data-card-scitech p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#00ff88] font-bold">SIGNIFICANT TRENDS</span>
              <span className="status-indicator status-success" />
            </div>
            <div className="text-h3 font-mono text-[#00ff88] mt-1">{sigPercentage}%</div>
            <div className="text-xs text-[#8e8e99] mt-1">{significantCount} of {totalAnalyses} passed (p &lt; 0.05)</div>
          </div>

          <div className="data-card-scitech p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-bold">PRIMARY DOMAIN</span>
              <span className="status-indicator status-red" />
            </div>
            <div className="text-xl font-bold text-[#ffffff] mt-1 truncate">
              {EARTH_VARIABLES[mostAnalyzedVar as keyof typeof EARTH_VARIABLES]?.shortName || 'Surface Temp'}
            </div>
            <div className="text-xs text-[#8e8e99] mt-1">NASA Climatology</div>
          </div>

          <div className="data-card-scitech p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#d1d1d6] font-bold">WATCHLIST PINNED</span>
              <span className="status-indicator status-red" />
            </div>
            <div className="text-h3 font-mono text-[#f64137] mt-1">{watchlist.length}</div>
            <div className="text-xs text-[#8e8e99] mt-1">Planetary hotspots</div>
          </div>
        </div>

        {/* Main Workspace Grid: Saved Analyses + Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Saved Analyses List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-[#ffffff]">
                Saved Investigations
              </h2>
              <span className="text-xs font-mono text-[#f64137] bg-[#0d0d12] px-2.5 py-0.5 rounded border border-[rgba(246,65,55,0.3)] font-bold">
                {analyses.length} Records
              </span>
            </div>

            {analyses.length === 0 ? (
              <div className="data-card-scitech p-8 text-center text-sm text-[#d1d1d6]">
                No saved analyses found in this session. Perform an analysis and click "Save Analysis" in the workbench.
              </div>
            ) : (
              analyses.map(item => {
                const varMeta = EARTH_VARIABLES[item.variableId];
                return (
                  <div
                    key={item.id}
                    className="data-card-scitech p-6 group hover:border-[#f64137]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="status-indicator status-red" />
                          <span className="text-xs font-mono text-[#f64137] uppercase tracking-wider font-bold">
                            {varMeta?.name}
                          </span>
                          <span className="text-[11px] text-[#8e8e99] font-mono">
                            {item.startYear}–{item.endYear}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-[#ffffff] group-hover:text-[#f64137] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#d1d1d6] font-mono mt-0.5">
                          Geographic Basin: {item.regionName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                          item.result.pValue < 0.05
                            ? 'bg-[rgba(0,255,136,0.12)] text-[#00ff88] border border-[rgba(0,255,136,0.35)] shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                            : 'bg-[rgba(246,65,55,0.12)] text-[#f64137] border border-[rgba(246,65,55,0.35)]'
                        }`}>
                          {item.result.verdictLabel}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-[#8e8e99] hover:text-[#f64137] rounded transition-colors cursor-pointer"
                          title="Delete Analysis"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#08080c] border border-[rgba(255,255,255,0.12)] text-xs font-mono mb-4">
                      <div>
                        <span className="text-[#8e8e99] block text-[10px] uppercase">Slope Rate</span>
                        <span className={item.result.slope >= 0 ? 'text-[#ffaa00] font-bold text-sm' : 'text-[#f64137] font-bold text-sm'}>
                          {item.result.slope > 0 ? '+' : ''}{item.result.slope} / yr
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8e8e99] block text-[10px] uppercase">Total Departure</span>
                        <span className="text-[#ffffff] font-bold text-sm">{item.result.changePercent}%</span>
                      </div>
                      <div>
                        <span className="text-[#8e8e99] block text-[10px] uppercase">Mann-Kendall</span>
                        <span className="text-[#ffffff] font-bold text-sm">p = {item.result.pValue}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-[#d1d1d6] italic mb-4 p-2.5 rounded bg-[#08080c] border border-[rgba(255,255,255,0.1)]">
                        "{item.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.12)]">
                      <span className="text-[11px] font-mono text-[#8e8e99]">
                        Saved {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onReloadAnalysis(item.variableId, item.regionId, item.startYear, item.endYear)}
                        className="text-xs font-mono text-[#f64137] hover:text-[#ff4d42] flex items-center gap-1.5 cursor-pointer font-bold"
                      >
                        <Compass size={14} />
                        <span>Re-open in Workbench</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Watchlist & Export History (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="data-card-scitech p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.12)]">
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-[#f64137]" />
                  <h3 className="font-bold text-base text-[#ffffff]">
                    Monitored Regions
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#f64137] bg-[#0d0d12] px-2 py-0.5 rounded border border-[rgba(246,65,55,0.3)] font-bold">
                  {watchlist.length} Pinned
                </span>
              </div>

              <div className="space-y-3">
                {watchlist.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#08080c] border border-[rgba(255,255,255,0.1)] hover:border-[#f64137] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#ffffff]">
                          {item.regionName}
                        </div>
                        <div className="text-[10px] text-[#f64137] font-mono mt-0.5 font-semibold">
                          {EARTH_VARIABLES[item.variableId]?.name || item.variableId}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleWatch(item)}
                        className="text-[#8e8e99] hover:text-[#f64137] text-sm cursor-pointer p-0.5"
                        title="Remove from Watchlist"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                      <span className={item.trendDirection === 'increasing' ? 'text-[#ffaa00]' : 'text-[#f64137]'}>
                        Rate: {item.recentRate}
                      </span>
                      <button
                        onClick={() => onReloadAnalysis(item.variableId, item.regionId, 2000, 2024)}
                        className="text-[#f64137] hover:underline text-xs cursor-pointer font-bold"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick-Start Analysis Shortcuts */}
            <div className="data-card-scitech p-6">
              <h3 className="font-bold text-base text-[#ffffff] mb-4">
                Quick Investigation Presets
              </h3>
              <div className="space-y-2.5">
                {[
                  { title: 'Arctic Sea Ice Minimums', varId: 'sea_ice_extent', regId: 'arctic_ocean' },
                  { title: 'California Aquifer Overdraft', varId: 'groundwater_storage', regId: 'california_central_valley' },
                  { title: 'Mediterranean Summer Drying', varId: 'precipitation', regId: 'mediterranean_basin' },
                  { title: 'Indo-Gangetic Air Aerosols', varId: 'aerosol_optical_depth', regId: 'indus_ganges_basin' }
                ].map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => onReloadAnalysis(sc.varId, sc.regId, 2000, 2024)}
                    className="w-full text-left p-3 rounded-xl bg-[#08080c] hover:bg-[#0d0d12] border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] text-xs text-[#ffffff] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <span>{sc.title}</span>
                    <Compass size={14} className="text-[#f64137] group-hover:rotate-45 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Export History Log */}
            {exportHistory.length > 0 && (
              <div className="data-card-scitech p-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.12)] mb-3 text-base font-bold text-[#ffffff]">
                  <Download size={15} className="text-[#f64137]" />
                  <span>Recent Data Exports</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {exportHistory.slice(0, 5).map(ex => (
                    <div key={ex.id} className="p-2.5 rounded-lg bg-[#08080c] border border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                      <div className="truncate mr-2">
                        <span className="text-[#ffffff] block truncate">{ex.filename}</span>
                        <span className="text-[10px] text-[#8e8e99]">{new Date(ex.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-[10px] text-[#f64137] font-bold">
                        {ex.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}

        {/* ========================================================================= */}
        {/* SECTION: NASA OBSERVATIONAL DATA SOURCES & PROVENANCE CATALOG (DATA SESSION) */}
        {/* ========================================================================= */}
        {(dashboardTab === 'all' || dashboardTab === 'data') && (
          <div className="mb-14 pt-8 border-t border-[rgba(255,255,255,0.14)]" id="data-session">
            <div className="section-card-scitech bg-[#000000] text-[#ffffff] p-8 sm:p-10 rounded-3xl border border-[rgba(255,255,255,0.14)] shadow-2xl mb-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] uppercase tracking-wider mb-3 shadow-[0_0_12px_rgba(246,65,55,0.2)] font-bold">
                    <Database size={13} className="text-[#f64137]" />
                    <span>NASA DATA PROVENANCE &amp; OPEN ACCESS CATALOG</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] font-heading">
                    NASA Observational Archives
                  </h2>
                  <p className="text-sm text-[#d1d1d6] mt-2 max-w-2xl leading-relaxed">
                    Directly integrated with NASA Earthdata EOSDIS repositories, MERRA-2 reanalysis models, and public REST APIs. All datasets uphold NASA Open Science guidelines with verified sensor provenance, spatial resolutions, and programmatic access endpoints.
                  </p>
                </div>

                {/* Search Input */}
                <div className="w-full lg:w-80">
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f64137]" />
                    <input
                      type="text"
                      value={dataSearchTerm}
                      onChange={e => setDataSearchTerm(e.target.value)}
                      placeholder="Filter by dataset, sensor, variable..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#08080c] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] focus:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-xl text-xs font-mono text-[#ffffff] outline-none transition-all placeholder:text-[#8e8e99]"
                    />
                  </div>
                </div>
              </div>

              {/* Category Quick-Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-xs font-mono text-[#8e8e99] mr-1">Filter Domain:</span>
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'atmosphere', label: 'Atmosphere & Climatology' },
                  { id: 'cryosphere', label: 'Cryosphere & Polar Ice' },
                  { id: 'hydrosphere', label: 'Hydrosphere & Rain' },
                  { id: 'biosphere', label: 'Biosphere & Vegetation' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedDataFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedDataFilter === cat.id
                        ? 'bg-[#f64137] text-[#ffffff] font-bold shadow-[0_0_12px_rgba(246,65,55,0.4)]'
                        : 'bg-[#08080c] hover:bg-[#121218] text-[#d1d1d6] border border-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Datasets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDataSources.map(ds => {
                  const targetVarId = 
                    ds.id === 'nasa_power' ? 'surface_temperature' :
                    ds.id === 'lp_daac_modis' ? 'vegetation_index' :
                    ds.id === 'nsidc_sea_ice' ? 'sea_ice_extent' :
                    ds.id === 'podaac_grace' ? 'groundwater_storage' :
                    'surface_temperature';

                  return (
                    <div
                      key={ds.id}
                      className="data-card-scitech p-6 flex flex-col justify-between group border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] transition-all bg-[#0a0a0f] rounded-2xl"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-[11px] font-mono text-[#f64137] uppercase tracking-widest block mb-1 font-bold">
                              {ds.agency} · {ds.missionOrModel}
                            </span>
                            <h3 className="text-lg font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors">
                              {ds.name}
                            </h3>
                          </div>
                          <a
                            href={ds.link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-icon-scitech shrink-0"
                            title="Visit Official NASA Repository"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>

                        {/* Specs Box */}
                        <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.1)] mb-4 text-xs font-mono space-y-1.5">
                          <div className="flex items-center justify-between text-[#d1d1d6]">
                            <span>Spatial Resolution:</span>
                            <strong className="text-[#ffffff]">{ds.spatialResolution}</strong>
                          </div>
                          <div className="flex items-center justify-between text-[#d1d1d6]">
                            <span>Temporal Coverage:</span>
                            <strong className="text-[#f64137]">{ds.temporalCoverage}</strong>
                          </div>
                        </div>

                        {/* Variables Pills */}
                        <div className="mb-4">
                          <div className="text-[11px] font-mono uppercase tracking-widest text-[#f64137] mb-2 font-bold">
                            Measured Variables
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {ds.variables.map((v, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded bg-[#000000] border border-[rgba(246,65,55,0.3)] text-[10px] font-mono text-[#ffffff]"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Access Method */}
                        <div className="text-xs mb-4">
                          <span className="font-mono text-[#f64137] text-[11px] uppercase tracking-wider block mb-1 font-bold">
                            Access Protocol:
                          </span>
                          <code className="text-[11px] font-mono text-[#ffffff] block bg-[#000000] p-2 rounded-lg border border-[rgba(255,255,255,0.12)] overflow-x-auto select-all">
                            {ds.apiEndpoint}
                          </code>
                        </div>

                        {/* Citation */}
                        <div className="text-xs mb-4">
                          <span className="font-mono text-[#8e8e99] text-[10px] uppercase tracking-wider block mb-1">
                            Scientific Citation:
                          </span>
                          <p className="text-[11px] italic leading-relaxed text-[#d1d1d6]">
                            {ds.citation}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer with Launch Buttons */}
                      <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.1)] flex flex-wrap items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-[#00ff88] text-[11px] font-mono font-semibold">
                          <Shield size={13} />
                          <span>{ds.license}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onReloadAnalysis(targetVarId, 'global', 2000, 2024)}
                            className="btn-primary-scitech text-xs py-2 px-3.5"
                          >
                            <Compass size={13} />
                            <span>Analyze Record</span>
                          </button>
                          <a
                            href={ds.link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary-scitech text-xs py-2 px-3"
                          >
                            <span>NASA Archive</span>
                            <ArrowUpRight size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: OFFICIAL NASA NEWS & FIELD DISPATCHES (Black-White-Red Theme)   */}
        {/* ========================================================================= */}
        {(dashboardTab === 'all' || dashboardTab === 'news') && (
          <>
            <div className="mb-14 pt-8 border-t border-[rgba(255,255,255,0.14)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] mb-2.5 font-bold shadow-[0_0_12px_rgba(246,65,55,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137]" />
                <span>OFFICIAL NASA.GOV DISPATCHES &amp; SCIENCE RELEASES</span>
              </div>
              <h2 className="text-2xl font-bold text-[#ffffff] font-heading">
                NASA News &amp; Mission Briefings
              </h2>
              <p className="text-xs text-[#d1d1d6] mt-1 max-w-xl">
                Real-time mission coverage, astrophysics observations, and space exploration releases synced directly with NASA headquarters.
              </p>
            </div>
            <a
              href="https://www.nasa.gov/news/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#f64137] hover:underline font-bold"
            >
              <span>View NASA.gov press room</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Story 1 */}
            <a
              href="https://www.nasa.gov/news-release/nasa-sets-coverage-for-spacex-35th-station-resupply-launch-arrival/"
              target="_blank"
              rel="noopener noreferrer"
              className="data-card-scitech p-4 rounded-xl flex flex-col justify-between group block overflow-hidden hover:border-[#f64137]"
            >
              <div>
                <div className="h-40 rounded-lg overflow-hidden bg-[#000000] mb-3 relative">
                  <img
                    src="https://www.nasa.gov/wp-content/uploads/2026/10/spacex-35.jpg?w=1024"
                    alt="SpaceX 35th Resupply"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517976487508-b118b6fc8e5c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#000000]/95 text-[10px] font-mono text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                    4 MIN READ
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase mb-1 font-bold">STATION RESUPPLY · ARTICLE</div>
                <h3 className="text-sm font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors line-clamp-2">
                  NASA Sets Coverage for SpaceX 35th Station Resupply Launch, Arrival
                </h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-[11px] text-[#d1d1d6]">
                <span>NASA News Release</span>
                <ArrowRight size={13} className="text-[#f64137] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Story 2 */}
            <a
              href="https://www.nasa.gov/missions/spherex/nasas-spherex-telescope-sees-menagerie-of-brown-dwarfs/"
              target="_blank"
              rel="noopener noreferrer"
              className="data-card-scitech p-4 rounded-xl flex flex-col justify-between group block overflow-hidden hover:border-[#f64137]"
            >
              <div>
                <div className="h-40 rounded-lg overflow-hidden bg-[#000000] mb-3 relative">
                  <img
                    src="https://www.nasa.gov/wp-content/uploads/2026/10/e1-pia23684.jpg?w=1024"
                    alt="SPHEREx Telescope Brown Dwarfs"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#000000]/95 text-[10px] font-mono text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                    5 MIN READ
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase mb-1 font-bold">ASTROPHYSICS · SURVEY</div>
                <h3 className="text-sm font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors line-clamp-2">
                  NASA’s SPHEREx Telescope Sees Menagerie of Brown Dwarfs
                </h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-[11px] text-[#d1d1d6]">
                <span>Missions Directorate</span>
                <ArrowRight size={13} className="text-[#f64137] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Story 3 */}
            <a
              href="https://science.nasa.gov/missions/webb/webb-measures-distance-to-farthest-fast-radio-burst-suggesting-origin/"
              target="_blank"
              rel="noopener noreferrer"
              className="data-card-scitech p-4 rounded-xl flex flex-col justify-between group block overflow-hidden hover:border-[#f64137]"
            >
              <div>
                <div className="h-40 rounded-lg overflow-hidden bg-[#000000] mb-3 relative">
                  <img
                    src="https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2026/10/STScI-01KKCJGBWX6TE4ABRTFWE9B8SQ.jpg?w=1024"
                    alt="James Webb FRB Origin"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#000000]/95 text-[10px] font-mono text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                    5 MIN READ
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase mb-1 font-bold">DEEP SPACE · ARTICLE</div>
                <h3 className="text-sm font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors line-clamp-2">
                  Webb Measures Distance to Farthest Fast Radio Burst
                </h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-[11px] text-[#d1d1d6]">
                <span>Webb Space Telescope</span>
                <ArrowRight size={13} className="text-[#f64137] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Story 4 */}
            <a
              href="https://science.nasa.gov/solar-system/skywatching/whats-up-october-2026-skywatching-tips-from-nasa/"
              target="_blank"
              rel="noopener noreferrer"
              className="data-card-scitech p-4 rounded-xl flex flex-col justify-between group block overflow-hidden hover:border-[#f64137]"
            >
              <div>
                <div className="h-40 rounded-lg overflow-hidden bg-[#000000] mb-3 relative">
                  <img
                    src="https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar-system/skywatching/2026/october/Orionid%20Meteor%20Shower%202017_Ben%20Goldstein%20via%20Flickr_CC%20BY-NC-SA.jpg?w=1024"
                    alt="October Skywatching Tips"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#000000]/95 text-[10px] font-mono text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                    3 MIN READ
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase mb-1 font-bold">SKYWATCHING · TIPS</div>
                <h3 className="text-sm font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors line-clamp-2">
                  What’s Up: October Skywatching Tips &amp; Meteor Showers
                </h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-[11px] text-[#d1d1d6]">
                <span>Solar System Science</span>
                <ArrowRight size={13} className="text-[#f64137] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          {/* Quick External Links Row */}
          <div className="p-4 rounded-xl bg-[#0d0d12] border border-[rgba(255,255,255,0.12)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[11px] font-mono text-[#f64137] uppercase font-bold">NASA.gov Press Feeds:</span>
            <div className="flex flex-wrap items-center gap-4 text-[#d1d1d6]">
              <a href="https://www.nasa.gov/news-release/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>News Releases</span> <ExternalLink size={11} />
              </a>
              <a href="https://www.nasa.gov/news/recently-published/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>Recently Published</span> <ExternalLink size={11} />
              </a>
              <a href="https://plus.nasa.gov/series/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>NASA+ Series</span> <ExternalLink size={11} />
              </a>
              <a href="https://www.nasa.gov/podcasts-and-audio/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>Podcasts &amp; Audio</span> <ExternalLink size={11} />
              </a>
              <a href="https://www.nasa.gov/event-type/launch-schedule/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>Upcoming Launches</span> <ExternalLink size={11} />
              </a>
              <a href="https://www.nasa.gov/nasa-virtual-guest-program/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f64137] transition-colors flex items-center gap-1">
                <span>Virtual Guest Program</span> <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: NASA MULTIMEDIA & LIVE OBSERVATORIES (Black-White-Red Theme)   */}
        {/* ========================================================================= */}
        <div className="mb-8 pt-8 border-t border-[rgba(255,255,255,0.14)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] mb-2.5 font-bold shadow-[0_0_12px_rgba(246,65,55,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137]" />
                <span>OFFICIAL NASA MULTIMEDIA PORTALS &amp; TELEMETRY</span>
              </div>
              <h2 className="text-2xl font-bold text-[#ffffff] font-heading">
                Multimedia &amp; Observational Streams
              </h2>
              <p className="text-xs text-[#d1d1d6] mt-1 max-w-xl">
                High-definition planetary broadcasts, interactive 3D simulations, and astronomy archives accessible for investigation.
              </p>
            </div>
            <a
              href="https://plus.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#f64137] hover:underline font-bold"
            >
              <span>Explore all media portals</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Media 1: NASA+ Video Streaming */}
            <div className="data-card-scitech p-6 flex flex-col justify-between group hover:border-[#f64137]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#08080c] border border-[rgba(246,65,55,0.4)] text-[#f64137] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(246,65,55,0.25)]">
                  <Tv size={22} />
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase tracking-wider mb-1 font-bold">STREAMING PORTAL</div>
                <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors mb-2">
                  NASA+ Video Service
                </h3>
                <p className="text-xs text-[#d1d1d6] leading-relaxed mb-4">
                  Stream ad-free original series, live agency launch coverage, and documentary research at no cost.
                </p>
              </div>
              <a
                href="https://plus.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-[#f64137] hover:bg-[#b60109] text-[#ffffff] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(246,65,55,0.3)]"
              >
                <span>Launch NASA+</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Media 2: Image of the Day */}
            <div className="data-card-scitech p-6 flex flex-col justify-between group hover:border-[#f64137]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#08080c] border border-[rgba(255,255,255,0.2)] text-[#ffffff] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                  <Sparkles size={22} />
                </div>
                <div className="text-[10px] font-mono text-[#ffffff] uppercase tracking-wider mb-1 font-bold">DAILY OBSERVATION</div>
                <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors mb-2">
                  Image of the Day
                </h3>
                <p className="text-xs text-[#d1d1d6] leading-relaxed mb-4">
                  Curated daily satellite captures, deep space views, and planetary vistas with authoritative scientific captions.
                </p>
              </div>
              <a
                href="https://www.nasa.gov/image-of-the-day/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-[#0d0d12] hover:bg-[#f64137] text-[#ffffff] border border-[rgba(255,255,255,0.2)] hover:border-[#f64137] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>View Today’s Image</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Media 3: NASA Live 24/7 */}
            <div className="data-card-scitech p-6 flex flex-col justify-between group hover:border-[#f64137]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#08080c] border border-[rgba(246,65,55,0.4)] text-[#f64137] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(246,65,55,0.25)]">
                  <Radio size={22} />
                </div>
                <div className="text-[10px] font-mono text-[#f64137] uppercase tracking-wider mb-1 font-bold">LIVE TELEMETRY</div>
                <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors mb-2">
                  NASA Live 24/7
                </h3>
                <p className="text-xs text-[#d1d1d6] leading-relaxed mb-4">
                  Around-the-clock live streams from the International Space Station, mission control operations, and agency events.
                </p>
              </div>
              <a
                href="https://www.nasa.gov/live"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-[#f64137] hover:bg-[#b60109] text-[#ffffff] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(246,65,55,0.3)]"
              >
                <span>Watch Live Broadcast</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Media 4: 3D Interactives */}
            <div className="data-card-scitech p-6 flex flex-col justify-between group hover:border-[#f64137]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#08080c] border border-[rgba(255,255,255,0.2)] text-[#ffffff] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                  <Globe size={22} />
                </div>
                <div className="text-[10px] font-mono text-[#ffffff] uppercase tracking-wider mb-1 font-bold">3D SIMULATION</div>
                <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors mb-2">
                  3D Science Resources
                </h3>
                <p className="text-xs text-[#d1d1d6] leading-relaxed mb-4">
                  Explore interactive 3D models of Earth observation satellites, lunar terrain, and solar system trajectories.
                </p>
              </div>
              <a
                href="https://science.nasa.gov/3d-resources/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-[#0d0d12] hover:bg-[#f64137] text-[#ffffff] border border-[rgba(255,255,255,0.2)] hover:border-[#f64137] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Launch 3D Explorer</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </>
    )}

      </div>
    </div>
  );
};
