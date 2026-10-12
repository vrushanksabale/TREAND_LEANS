import React from 'react';
import { ExternalLink, Compass, ShieldCheck, Database, Layers } from 'lucide-react';

interface FooterProps {
  onRouteChange: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  return (
    <footer className="bg-[#000000] border-t border-[rgba(255,255,255,0.14)] text-[#d1d1d6] text-xs pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] shadow-[0_0_15px_rgba(246,65,55,0.25)] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                  <circle cx="32" cy="32" r="14" stroke="#f64137" strokeWidth="2" strokeDasharray="3 3"/>
                  <path d="M18 42L28 32L36 38L48 22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="48" cy="22" r="3.5" fill="#f64137"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-[#ffffff] font-heading">
                TrendLens
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(246,65,55,0.15)] text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                NASA SPACE APPS
              </span>
            </div>
            <p className="text-xs text-[#d1d1d6] max-w-sm leading-relaxed">
              An enterprise-grade scientific technology platform for investigating multi-decadal Earth system trends using verified satellite observations and non-parametric statistical testing.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#8e8e99]">
              <span className="text-[#ffffff]">NASA Earthdata</span>
              <span>·</span>
              <span className="text-[#ffffff]">NASA GIBS</span>
              <span>·</span>
              <span className="text-[#ffffff]">NASA POWER</span>
              <span>·</span>
              <span className="text-[#ffffff]">MERRA-2</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-[#ffffff] text-xs font-mono uppercase tracking-widest mb-4">
              Exploration
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onRouteChange('home')} className="hover:text-[#f64137] transition-colors duration-200 cursor-pointer">
                  Platform Home
                </button>
              </li>
              <li>
                <button onClick={() => onRouteChange('features')} className="hover:text-[#f64137] transition-colors duration-200 cursor-pointer">
                  Analytical Features
                </button>
              </li>
              <li>
                <button onClick={() => onRouteChange('trend-cases')} className="hover:text-[#f64137] transition-colors duration-200 cursor-pointer">
                  Guided Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => onRouteChange('data-sources')} className="hover:text-[#f64137] transition-colors duration-200 cursor-pointer">
                  Observational Archives
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Reference */}
          <div>
            <h4 className="font-bold text-[#ffffff] text-xs font-mono uppercase tracking-widest mb-4">
              Science & Metrics
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onRouteChange('about')} className="hover:text-[#f64137] transition-colors duration-200 cursor-pointer">
                  Methodology & Physics
                </button>
              </li>
              <li>
                <a
                  href="https://power.larc.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f64137] transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  <span>NASA POWER Portal</span>
                  <ExternalLink size={12} className="text-[#f64137]" />
                </a>
              </li>
              <li>
                <a
                  href="https://worldview.earthdata.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f64137] transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  <span>NASA Worldview</span>
                  <ExternalLink size={12} className="text-[#f64137]" />
                </a>
              </li>
              <li>
                <a
                  href="https://gibs.earthdata.nasa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f64137] transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  <span>NASA GIBS API</span>
                  <ExternalLink size={12} className="text-[#f64137]" />
                </a>
              </li>
            </ul>
          </div>

          {/* NASA Challenge */}
          <div>
            <h4 className="font-bold text-[#ffffff] text-xs font-mono uppercase tracking-widest mb-4">
              Compliance
            </h4>
            <div className="space-y-3 text-xs text-[#d1d1d6]">
              <p>
                Challenge: <em className="text-[#ffffff] font-semibold">Be An Earth System Trend Detective!</em>
              </p>
              <p className="text-[11px] leading-relaxed text-[#8e8e99]">
                All measurements retrieved from public NASA and partner archives. No artificial or mock environmental series are used.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-[#ffffff] text-[11px] font-mono">
                  <span className="status-indicator status-success" />
                  <span>NASA Open Data Policy</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Tiny copyright in gray */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-[#8e8e99]">
          <div>
            © 2026 TrendLens Project · Built for NASA Space Apps Challenge · Black-White-Red NASA Theme
          </div>
          <div className="flex items-center gap-6">
            <span>Ordinary Least Squares & Mann-Kendall Testing</span>
            <span>·</span>
            <span>WMO / IPCC Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
