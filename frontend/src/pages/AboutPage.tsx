import React from 'react';
import { ArrowRight, Compass, Shield, Database, Microscope, Network, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-[86px] pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="section-card-scitech bg-[#000000] text-[#ffffff] p-8 sm:p-12 rounded-3xl border border-[rgba(255,255,255,0.14)] shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] mb-4 shadow-[0_0_12px_rgba(246,65,55,0.15)] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#f64137] animate-pulse" />
            <span>MISSION & SCIENTIFIC METHODOLOGY</span>
          </div>
          <h1 className="text-h1 text-[#ffffff]">
            Understanding Earth as an <span className="text-[#f64137]">Interconnected System</span>
          </h1>
          <p className="text-base text-[#d1d1d6] max-w-2xl mt-4 leading-relaxed">
            Earth observations reveal a complex web of interactions. When global temperatures rise, local outcomes vary widely: one basin dries out while another observes severe storm deluges. TrendLens provides the statistical rigor required to test these patterns.
          </p>
        </div>

        {/* The Scientific Problem */}
        <section className="data-card-scitech p-8 sm:p-10 mb-12 shadow-[0_0_30px_rgba(246,65,55,0.08)] border border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] mb-2 font-semibold">
            The Scientific Problem
          </h2>
          <h3 className="text-h2 text-[#ffffff] mb-4">
            Why Eyeballing Lines on Charts is Dangerous
          </h3>
          <div className="space-y-4 text-base text-[#a0b0c0] leading-relaxed">
            <p>
              Environmental records are noisy. Multi-year weather patterns like El Niño, seasonal monsoon swings, and instrument calibration shifts can create misleading appearances of permanent trends.
            </p>
            <p>
              Furthermore, broad planetary forcings often manifest as opposing regional outcomes. Poleward shifts in atmospheric circulation can expand dry subtropical belts over the Mediterranean while simultaneously strengthening monsoon rainfall over the African Sahel.
            </p>
            <p className="text-[#ffffff] font-semibold">
              TrendLens answers four core questions with mathematical precision: What is changing? Where is it changing? How much is it changing? And is that change statistically significant?
            </p>
          </div>
        </section>

        {/* Scientific Approach Diagram Flow */}
        <section className="mb-14">
          <div className="text-center mb-10">
            <h2 className="text-xs font-mono uppercase tracking-[2px] text-[#f64137] mb-2 font-semibold">
              Scientific Pipeline
            </h2>
            <h3 className="text-h2 text-[#ffffff]">
              From Raw Sensor Stream to Verified Insight
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'NASA Data',
                desc: 'Raw observations from MODIS, GPM, GRACE-FO, and MERRA-2 assimilation.'
              },
              {
                step: '02',
                title: 'Regional Bounds',
                desc: 'Spatial extraction by bounding box, preset ecotone, or probed coordinates.'
              },
              {
                step: '03',
                title: 'Trend Detection',
                desc: 'OLS regression slope and Sen’s non-parametric slope estimation.'
              },
              {
                step: '04',
                title: 'Significance Testing',
                desc: 'Mann-Kendall rank correlation test and p-value calculation at 95% confidence.'
              },
              {
                step: '05',
                title: 'Teleconnection Insight',
                desc: 'Cross-regional comparison under coupled physical atmospheric drivers.'
              }
            ].map((node, idx) => (
              <div key={idx} className="data-card-scitech p-6 flex flex-col justify-between hover:border-[rgba(246,65,55,0.4)] transition-all">
                <div>
                  <div className="text-xs font-mono font-bold text-[#f64137] mb-2">{node.step}</div>
                  <h4 className="font-bold text-base text-[#ffffff] mb-1.5">{node.title}</h4>
                  <p className="text-xs text-[#a0b0c0] leading-relaxed">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target Audience */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div className="data-card-scitech p-8">
            <h3 className="text-xl font-bold text-[#ffffff] mb-3">
              Built for Multiple Disciplines
            </h3>
            <p className="text-sm text-[#a0b0c0] leading-relaxed mb-4">
              TrendLens is designed to serve scientific researchers, university students, environmental journalists, educators, and curious citizens who need reliable, unvarnished Earth data without software paywalls.
            </p>
            <ul className="space-y-2.5 text-sm text-[#ffffff]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#00ff88]" />
                <span>Journalists verifying climate and environmental claims</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#00ff88]" />
                <span>Educators teaching Earth system science with real data</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#00ff88]" />
                <span>Researchers conducting exploratory multi-variable surveys</span>
              </li>
            </ul>
          </div>

          <div className="data-card-scitech p-8">
            <h3 className="text-xl font-bold text-[#ffffff] mb-3">
              Open Science Values
            </h3>
            <p className="text-sm text-[#a0b0c0] leading-relaxed mb-4">
              We uphold NASA’s commitment to Open Science. Every dataset used in this application is publicly documented, traceable to its sensor archive, and exportable in open formats.
            </p>
            <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(246,65,55,0.3)] text-xs font-mono text-[#a0b0c0]">
              <div className="text-[#f64137] font-bold mb-1">NASA Space Apps 2026 Commitment</div>
              <div>Zero mock data. Zero paywalls. Transparent mathematics.</div>
            </div>
          </div>
        </section>

        {/* Bottom Action */}
        <section className="data-card-scitech p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-l-[#f64137]">
          <div>
            <h3 className="text-xl font-bold text-[#ffffff]">
              Ready to explore Earth’s changing records?
            </h3>
            <p className="text-sm text-[#a0b0c0] mt-1">
              Select any NASA variable and examine whether recent changes reflect true secular trends.
            </p>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="btn-primary-scitech text-xs py-3 px-6"
          >
            Launch Analyze Workbench
          </button>
        </section>
      </div>
    </div>
  );
};
