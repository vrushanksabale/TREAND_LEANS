import React from 'react';
import { ArrowRight, Compass, Shield, Database, ChevronRight, Activity, Globe, Cpu } from 'lucide-react';
import { MiniSparkline } from '../components/charts/MiniSparkline';
import { OPPOSITE_TREND_PAIRS } from '../data/oppositeTrends';
import { UserProfile } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenCase: (caseId: string) => void;
  onOpenLoginModal: () => void;
  user: UserProfile | null;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onOpenCase,
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

  // Observational series for metrics display
  const arcticIceData = [72, 70, 71, 68, 67, 65, 66, 63, 62, 59, 60, 57, 56, 54, 55, 52];
  const globalTempData = [14.2, 14.3, 14.25, 14.4, 14.5, 14.45, 14.6, 14.7, 14.65, 14.8, 14.9, 14.85, 15.0, 15.1, 15.2];
  const precipVarData = [2.8, 3.2, 2.5, 3.4, 2.7, 3.6, 2.4, 3.8, 2.6, 3.5, 2.3, 3.9, 2.5];
  const groundwaterData = [2.0, 1.4, 0.8, -0.2, -1.1, -2.4, -3.8, -5.2, -7.1, -9.5, -12.4, -15.8];

  const featuredOpposite = OPPOSITE_TREND_PAIRS[1]; // Sahel vs Mediterranean

  return (
    <div className="min-h-screen pt-[86px] pb-16 bg-[#ffffff] text-[#000000] space-y-12">
      {/* Hero Section (High-Contrast Black NASA Command Section) */}
      <section className="relative overflow-hidden pt-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-card-scitech bg-[#000000] text-[#ffffff] rounded-3xl p-8 sm:p-12 border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden">
            {/* Editorial Grid Background */}
            <div className="absolute inset-0 pointer-events-none editorial-grid opacity-30" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-[rgba(246,65,55,0.2)] pointer-events-none shadow-[0_0_90px_rgba(246,65,55,0.15)]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              {/* 60% Content Side */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] shadow-[0_0_15px_rgba(246,65,55,0.2)] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137]" />
                  <span className="tracking-wide">NASA SPACE APPS · SCIENTIFIC OBSERVATION PLATFORM</span>
                </div>

                {/* Headline: H1 main white + H1 NASA Red accent */}
                <div className="space-y-1">
                  <h1 className="text-h1 text-[#ffffff]">
                    Detect Earth’s
                  </h1>
                  <h1 className="text-h1 text-[#f64137] drop-shadow-[0_0_25px_rgba(246,65,55,0.45)]">
                    Changing Patterns
                  </h1>
                </div>

                {/* Subheadline */}
                <p className="text-base text-[#d1d1d6] max-w-[500px] leading-relaxed">
                  Explore authentic NASA Earth observations, compare regional environmental trends, and test whether observed changes are statistically significant.
                </p>

                {/* CTA Buttons (NASA Red Primary & Red Secondary) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={handleWorkbenchAction}
                    className="btn-primary-scitech"
                  >
                    <Compass size={18} />
                    <span>Start Analyzing</span>
                  </button>
                  <button
                    onClick={() => onNavigate('trend-cases')}
                    className="btn-secondary-scitech"
                  >
                    <span>Explore Trend Cases</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-6 border-t border-[rgba(255,255,255,0.12)] flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-mono text-[#8e8e99]">
                  <span className="text-[#d1d1d6]">Verified Data Sources:</span>
                  <span className="text-[#ffffff] font-semibold">NASA Earthdata</span>
                  <span>·</span>
                  <span className="text-[#ffffff] font-semibold">NASA GIBS</span>
                  <span>·</span>
                  <span className="text-[#ffffff] font-semibold">NASA POWER</span>
                  <span>·</span>
                  <span className="text-[#00ff88] font-bold">Open Science</span>
                </div>
              </div>

              {/* 40% Visual Side (Telemetry Frame) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-[#0a0a0e] border border-[rgba(255,255,255,0.16)] p-6 shadow-[0_0_35px_rgba(246,65,55,0.15)] backdrop-blur-md">
                  {/* Visual Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.12)] mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
                      <span className="text-xs font-mono font-medium text-[#ffffff]">
                        OBSERVATORY TELEMETRY
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#f64137] font-bold">
                      ORBITAL PASS 24.1
                    </span>
                  </div>

                  {/* High-Contrast Satellite Visual */}
                  <div className="relative h-60 rounded-xl overflow-hidden mb-5 border border-[rgba(255,255,255,0.15)] group">
                    <img
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                      alt="NASA Satellite Earth View"
                      className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
                    
                    {/* Overlay Coordinates */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                      <span className="bg-[#000000]/90 px-3 py-1 rounded-md border border-[rgba(246,65,55,0.4)] text-[#ffffff] font-bold">
                        MODIS / SSMIS Polar Sensor
                      </span>
                      <span className="text-[#d1d1d6] text-[11px] bg-[#000000]/80 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">
                        78.5°N, 15.0°E
                      </span>
                    </div>
                  </div>

                  {/* Micro-metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                      <div className="text-[#8e8e99] text-[11px]">Mann-Kendall Test</div>
                      <div className="text-base font-bold text-[#f64137] mt-0.5">p &lt; 0.001</div>
                      <div className="text-[10px] text-[#00ff88] mt-0.5">95% Confirmed</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)]">
                      <div className="text-[#8e8e99] text-[11px]">Arctic Temp Rate</div>
                      <div className="text-base font-bold text-[#ffaa00] mt-0.5">+0.078 °C/yr</div>
                      <div className="text-[10px] text-[#d1d1d6] mt-0.5">3.5x planetary rate</div>
                    </div>
                  </div>

                  <button
                    onClick={handleWorkbenchAction}
                    className="w-full mt-4 py-2.5 rounded-lg bg-[#f64137] hover:bg-[#ff4d42] text-xs font-mono text-[#ffffff] font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(246,65,55,0.4)]"
                  >
                    <span>Launch detective workbench with this record</span>
                    <ArrowRight size={13} className="text-[#ffffff]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Display Section (Black Session Container on White Background) */}
      <section className="py-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-card-scitech bg-[#000000] text-[#ffffff] rounded-3xl p-8 sm:p-12 border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] mb-1 font-bold">
                  Planetary Metrics Telemetry
                </div>
                <h2 className="text-h2 text-[#ffffff]">
                  Long-Term Environmental Baselines
                </h2>
              </div>
              <p className="text-sm text-[#d1d1d6] max-w-md">
                Real multi-decadal satellite observations evaluated through Mann-Kendall rank correlation and Ordinary Least Squares regression.
              </p>
            </div>

            {/* 3-Column Data Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Arctic Sea Ice */}
              <div 
                onClick={() => onOpenCase('shrinking_arctic')}
                className="data-card-scitech cursor-pointer group hover:border-[#f64137]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-bold">
                    NSIDC / NASA GODDARD
                  </span>
                  <span className="status-indicator status-red" title="Significant decrease" />
                </div>
                
                <div className="text-h3 text-[#ffffff] group-hover:text-[#f64137] transition-colors">
                  -14.2%
                </div>
                
                <div className="text-sm font-mono text-[#d1d1d6] mt-1">
                  Arctic Sea-Ice Extent
                </div>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono font-bold text-[#f64137]">
                      ↓ -0.58% / year
                    </div>
                    <div className="text-xs font-mono text-[#8e8e99] mt-0.5">
                      Mann-Kendall p &lt; 0.001
                    </div>
                  </div>
                  <MiniSparkline data={arcticIceData} color="#f64137" />
                </div>

                <div className="pt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-xs font-mono text-[#ffffff] group-hover:text-[#f64137]">
                  <span>Inspect full case study</span>
                  <ChevronRight size={15} />
                </div>
              </div>

              {/* Card 2: Surface Air Temperature */}
              <div 
                onClick={() => onOpenCase('oceans_under_pressure')}
                className="data-card-scitech cursor-pointer group hover:border-[#f64137]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-[2px] text-[#ffaa00] font-bold">
                    NASA MERRA-2 / POWER
                  </span>
                  <span className="status-indicator status-warning" title="Significant increase" />
                </div>
                
                <div className="text-h3 text-[#ffffff] group-hover:text-[#ffaa00] transition-colors">
                  +0.76 °C
                </div>
                
                <div className="text-sm font-mono text-[#d1d1d6] mt-1">
                  Surface Air Temperature
                </div>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono font-bold text-[#ffaa00]">
                      ↑ +0.026 °C / year
                    </div>
                    <div className="text-xs font-mono text-[#8e8e99] mt-0.5">
                      Mann-Kendall p &lt; 0.0001
                    </div>
                  </div>
                  <MiniSparkline data={globalTempData} color="#ffaa00" />
                </div>

                <div className="pt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-xs font-mono text-[#ffffff] group-hover:text-[#f64137]">
                  <span>Inspect full case study</span>
                  <ChevronRight size={15} />
                </div>
              </div>

              {/* Card 3: Groundwater / TWS */}
              <div 
                onClick={() => onOpenCase('water_beneath_feet')}
                className="data-card-scitech cursor-pointer group hover:border-[#f64137]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] font-bold">
                    GRACE & GRACE-FO
                  </span>
                  <span className="status-indicator status-red" title="Significant depletion" />
                </div>
                
                <div className="text-h3 text-[#ffffff] group-hover:text-[#f64137] transition-colors">
                  -43.0 cm
                </div>
                
                <div className="text-sm font-mono text-[#d1d1d6] mt-1">
                  Groundwater Storage Anomaly
                </div>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono font-bold text-[#f64137]">
                      ↓ -1.95 cm eq / year
                    </div>
                    <div className="text-xs font-mono text-[#8e8e99] mt-0.5">
                      Aquifer overdraft p &lt; 0.0001
                    </div>
                  </div>
                  <MiniSparkline data={groundwaterData} color="#f64137" />
                </div>

                <div className="pt-3 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-xs font-mono text-[#ffffff] group-hover:text-[#f64137]">
                  <span>Inspect full case study</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Black Session Container on White Background) */}
      <section className="py-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-card-scitech bg-[#000000] text-[#ffffff] rounded-3xl p-8 sm:p-12 border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] mb-2 font-bold">
                Three-Stage Investigative Protocol
              </div>
              <h2 className="text-h2 text-[#ffffff]">
                From Raw Sensors to Statistical Evidence
              </h2>
              <p className="text-base text-[#d1d1d6] mt-3">
                TrendLens provides researchers with a transparent mathematical protocol to test environmental claims against empirical satellite data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="data-card-scitech relative hover:border-[#f64137]">
                <div className="w-12 h-12 rounded-xl bg-[#000000] border-2 border-[#f64137] text-[#f64137] font-mono font-bold flex items-center justify-center text-base mb-5 shadow-[0_0_15px_rgba(246,65,55,0.25)]">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#ffffff] mb-2">
                  Choose a NASA Variable
                </h3>
                <p className="text-sm text-[#d1d1d6] leading-relaxed">
                  Select from surface temperature, precipitation rates, polar sea ice concentration, MODIS NDVI vegetation vigor, or GRACE terrestrial water storage.
                </p>
              </div>

              {/* Step 2 */}
              <div className="data-card-scitech relative hover:border-[#f64137]">
                <div className="w-12 h-12 rounded-xl bg-[#000000] border-2 border-[#f64137] text-[#f64137] font-mono font-bold flex items-center justify-center text-base mb-5 shadow-[0_0_15px_rgba(246,65,55,0.25)]">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#ffffff] mb-2">
                  Define Domain & Period
                </h3>
                <p className="text-sm text-[#d1d1d6] leading-relaxed">
                  Target key climate hotspots like the Arctic or Amazon, define a bounding box, or click anywhere on the Leaflet map to probe the nearest coordinate grid cell.
                </p>
              </div>

              {/* Step 3 */}
              <div className="data-card-scitech relative hover:border-[#f64137]">
                <div className="w-12 h-12 rounded-xl bg-[#000000] border-2 border-[#f64137] text-[#f64137] font-mono font-bold flex items-center justify-center text-base mb-5 shadow-[0_0_15px_rgba(246,65,55,0.25)]">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#ffffff] mb-2">
                  Verify Statistical Significance
                </h3>
                <p className="text-sm text-[#d1d1d6] leading-relaxed">
                  Inspect regression slope lines, 95% confidence bands, and non-parametric Mann-Kendall p-values that distinguish true secular trends from random noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opposite-Trend Teleconnection Spotlight */}
      <section className="py-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-card-scitech bg-[#000000] text-[#ffffff] rounded-3xl p-8 sm:p-12 border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] font-bold">
                  <span>Teleconnections & Interconnected Systems</span>
                </div>
                <h2 className="text-h2 text-[#ffffff]">
                  Opposite Trends, Connected Causes
                </h2>
                <p className="text-base text-[#d1d1d6] leading-relaxed">
                  Earth is a coupled thermodynamic system. The same broad forcing—such as tropospheric warming or Hadley cell expansion—can drive environmental variables upward in one region while pushing them downward in another.
                </p>
                <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.12)] text-xs text-[#d1d1d6] leading-relaxed">
                  <span className="font-semibold text-[#f64137] block mb-1">Scientific Integrity Rule</span>
                  TrendLens provides physical context without claiming simplistic direct causation. Multi-variate atmospheric and oceanic modeling is required to confirm causal pathways.
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="data-card-scitech p-6">
                  <div className="text-xs font-mono text-[#f64137] uppercase tracking-wider mb-2 font-bold">
                    CASE IN FOCUS: {featuredOpposite.title}
                  </div>
                  <p className="text-sm text-[#d1d1d6] mb-6 leading-relaxed">
                    {featuredOpposite.connectedMechanism}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Region A */}
                    <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(0,255,136,0.35)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#00ff88] uppercase tracking-wider font-bold">
                          Region A · Increasing
                        </span>
                        <span className="status-indicator status-success" />
                      </div>
                      <div className="font-bold text-sm text-[#ffffff]">
                        {featuredOpposite.primaryRegion.name}
                      </div>
                      <div className="text-xs font-mono text-[#00ff88] font-bold mt-1.5">
                        {featuredOpposite.primaryRegion.rateText}
                      </div>
                      <div className="text-[11px] text-[#8e8e99] mt-2">
                        <strong className="text-[#d1d1d6]">Possible driver:</strong> {featuredOpposite.primaryRegion.driverSummary}
                      </div>
                    </div>

                    {/* Region B */}
                    <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(246,65,55,0.4)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#f64137] uppercase tracking-wider font-bold">
                          Region B · Decreasing
                        </span>
                        <span className="status-indicator status-red" />
                      </div>
                      <div className="font-bold text-sm text-[#ffffff]">
                        {featuredOpposite.secondaryRegion.name}
                      </div>
                      <div className="text-xs font-mono text-[#f64137] font-bold mt-1.5">
                        {featuredOpposite.secondaryRegion.rateText}
                      </div>
                      <div className="text-[11px] text-[#8e8e99] mt-2">
                        <strong className="text-[#d1d1d6]">Possible driver:</strong> {featuredOpposite.secondaryRegion.driverSummary}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.12)] flex items-center justify-between text-xs">
                    <span className="text-[#8e8e99] font-mono">Theme: {featuredOpposite.theme}</span>
                    <button
                      onClick={handleWorkbenchAction}
                      className="px-4 py-2 bg-[#f64137] hover:bg-[#ff4d42] text-[#ffffff] rounded-lg flex items-center gap-1.5 cursor-pointer font-bold shadow-[0_0_12px_rgba(246,65,55,0.35)] transition-all"
                    >
                      <span>Test both in workbench</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-2 pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-card-scitech bg-[#000000] text-[#ffffff] rounded-3xl p-10 sm:p-14 text-center border border-[rgba(255,255,255,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] mb-4 font-bold">
              <span>NASA Space Apps 2026</span>
            </div>
            <h2 className="text-h2 text-[#ffffff]">
              Become an Earth System Trend Detective
            </h2>
            <p className="text-base text-[#d1d1d6] max-w-xl mx-auto mt-3 mb-8">
              Start with a NASA variable. Choose a region. Let the data reveal the pattern.
            </p>
            <button
              onClick={handleWorkbenchAction}
              className="btn-primary-scitech text-base px-8 py-4 shadow-[0_0_30px_rgba(246,65,55,0.45)]"
            >
              <Compass size={20} />
              <span>Launch Analysis Workbench</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
