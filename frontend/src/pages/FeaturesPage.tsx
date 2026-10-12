import React from 'react';
import { 
  Globe, 
  TrendingUp, 
  Cpu, 
  Split, 
  Layers, 
  Bookmark, 
  BookOpen, 
  Download, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface FeaturesPageProps {
  onNavigate: (route: string) => void;
  onOpenLoginModal: () => void;
  user: UserProfile | null;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ 
  onNavigate, 
  onOpenLoginModal,
  user
}) => {
  const handleWorkbenchAction = () => {
    if (!user) {
      onOpenLoginModal();
    } else {
      onNavigate('analyze');
    }
  };

  const features = [
    {
      icon: <Globe size={22} className="text-[#f64137]" />,
      title: 'Interactive Globe & Map Probe',
      tag: 'LEAFLET GIS',
      status: 'status-red',
      desc: 'Pan and zoom across high-resolution NASA satellite base layers. Switch between dark cartography, NASA Blue Marble, and Earth at Night. Draw bounding boxes or probe local pixel records.'
    },
    {
      icon: <TrendingUp size={22} className="text-[#00ff88]" />,
      title: 'Time-Series Analysis',
      tag: 'MULTI-DECADAL',
      status: 'status-success',
      desc: 'Inspect monthly, seasonal, and annual aggregated observations spanning 1981 to present. Toggle 12-month centered rolling means and deseasonalized anomaly departures from climatological normals.'
    },
    {
      icon: <Cpu size={22} className="text-[#ffaa00]" />,
      title: 'Significance Testing',
      tag: 'MANN-KENDALL & OLS',
      status: 'status-warning',
      desc: 'Automatic computation of Ordinary Least Squares slope, standard error, Kendall’s tau, Sen’s slope, and two-tailed p-values. Distinguishes statistically robust trends from random climate noise.'
    },
    {
      icon: <Split size={22} className="text-[#f64137]" />,
      title: 'Opposite-Trend Detector',
      tag: 'TELECONNECTIONS',
      status: 'status-red',
      desc: 'Explore paired regional cases where planetary-scale forcing drives opposite local outcomes, such as Sahel greening versus Mediterranean drying, or Arctic warming versus Southern Ocean buffering.'
    },
    {
      icon: <Layers size={22} className="text-[#ffffff]" />,
      title: 'Variable Comparison',
      tag: 'CROSS-DOMAIN',
      status: 'status-success',
      desc: 'Cross-analyze related variables across the same basin, such as precipitation against vegetation health (NDVI) or surface temperature against aerosol optical depth (AOD).'
    },
    {
      icon: <Bookmark size={22} className="text-[#f64137]" />,
      title: 'Saved Investigations',
      tag: 'CLOUD & LOCAL',
      status: 'status-red',
      desc: 'Save custom configurations, notes, and statistical outputs directly to your Detective Dashboard. Revisit previous findings with one-click reload.'
    },
    {
      icon: <BookOpen size={22} className="text-[#ffffff]" />,
      title: 'Story Mode',
      tag: 'GUIDED CASES',
      status: 'status-success',
      desc: 'Step through structured investigations curated around urgent Earth science challenges, including Arctic pack ice retreat, monsoonal shifts, boreal wildfires, and deep aquifer depletion.'
    },
    {
      icon: <Download size={22} className="text-[#f64137]" />,
      title: 'Export & Open Sharing',
      tag: 'OPEN SCIENCE',
      status: 'status-red',
      desc: 'Export observation data as standardized CSV files with sensor citations and download high-resolution chart graphics for research reports or classroom lectures.'
    },
    {
      icon: <Activity size={22} className="text-[#00ff88]" />,
      title: 'Live Telemetry Engine',
      tag: 'REAL-TIME DATA',
      status: 'status-success',
      desc: 'Stream verified sensor telemetry directly into your research workspace with sub-second recalculation of slope variances, anomaly bounds, and multi-sensor correlations.'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section (Black Session Container) */}
        <div className="section-card-scitech bg-[#000000] text-[#ffffff] p-8 sm:p-12 rounded-3xl border border-[rgba(255,255,255,0.14)] shadow-2xl text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(246,65,55,0.2)] font-bold">
            <span className="status-indicator status-red" />
            <span>Enterprise Scientific Capabilities</span>
          </div>
          <h2 className="text-h2 text-[#ffffff] font-bold tracking-tight">
            Built for Evidence-Based Earth Investigation
          </h2>
          <p className="text-base text-[#d1d1d6] mt-4 leading-relaxed max-w-2xl mx-auto">
            Every analytical feature in TrendLens bridges the gap between raw NASA satellite archives and rigorous, peer-reviewable statistical interpretation.
          </p>
        </div>

        {/* Features Grid: 3 columns (Desktop), 1 column (Mobile), 32px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((f, i) => (
            <div 
              key={i}
              className="data-card-scitech flex flex-col justify-between group hover:border-[#f64137]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.15)] flex items-center justify-center shadow-[0_0_15px_rgba(246,65,55,0.15)] group-hover:border-[#f64137] group-hover:shadow-[0_0_20px_rgba(246,65,55,0.35)] transition-all">
                    {f.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-indicator ${f.status}`} />
                    <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#000000] text-[#f64137] border border-[rgba(246,65,55,0.3)] font-bold">
                      {f.tag}
                    </span>
                  </div>
                </div>

                <div className="text-[12px] uppercase font-mono text-[#f64137] tracking-widest mb-1 font-bold">
                  MODULE 0{i + 1}
                </div>
                <h3 className="text-xl font-bold text-[#ffffff] mb-3 group-hover:text-[#f64137] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-[#d1d1d6] leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between">
                <span className="text-xs font-mono text-[#8e8e99]">NASA EOSDIS Validated</span>
                <button
                  onClick={() => onNavigate('trend-cases')}
                  className="text-xs font-mono text-[#ffffff] hover:text-[#f64137] flex items-center gap-1.5 cursor-pointer font-semibold group/btn"
                >
                  <span>Explore Cases</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-[#f64137]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="data-card-scitech p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border-[rgba(246,65,55,0.4)] bg-[#0d0d12]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#f64137]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#f64137] font-bold">
                WMO &amp; IPCC Standard Compliance
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#ffffff]">
              Test your own regional planetary hypothesis
            </h3>
            <p className="text-sm text-[#d1d1d6] mt-2 leading-relaxed">
              Open guided investigations or browse verified multi-decadal cases to see how climate teleconnections shape divergent ecosystem trends across the globe.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={handleWorkbenchAction}
              className="btn-primary-scitech"
            >
              <span>Launch Workbench</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('trend-cases')}
              className="btn-secondary-scitech"
            >
              <span>Explore Guided Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
