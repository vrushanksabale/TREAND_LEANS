import React from 'react';
import { X, HelpCircle, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface ExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(0,0,0,0.85)] backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#000000] border-l border-[rgba(246,65,55,0.3)] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(246,65,55,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0d0d12] border border-[rgba(246,65,55,0.3)] flex items-center justify-center text-[#f64137] shadow-[0_0_12px_rgba(246,65,55,0.2)]">
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#ffffff]">Scientific & Statistical Guide</h2>
                <p className="text-xs text-[#a0b0c0]">How TrendLens evaluates Earth system observations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#a0b0c0] hover:text-[#f64137] hover:bg-[#0d0d12] rounded-lg transition-colors cursor-pointer"
              aria-label="Close Guide"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core Four Questions */}
          <div className="my-6 p-5 rounded-xl bg-[#0d0d12] border border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f64137] animate-pulse" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#f64137] font-semibold">
                The Four Investigative Questions
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#ffffff]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#f64137] font-mono font-bold">1.</span>
                <span><strong>What is changing?</strong> The physical Earth-system variable (e.g. sea ice, surface air temperature, groundwater).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#f64137] font-mono font-bold">2.</span>
                <span><strong>Where is it changing?</strong> The geographic region, bounding box, or custom coordinate.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#f64137] font-mono font-bold">3.</span>
                <span><strong>How much is it changing?</strong> The annual rate of change and percentage departure.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#f64137] font-mono font-bold">4.</span>
                <span><strong>Is the change statistically significant?</strong> Calculated using regression and the non-parametric Mann-Kendall test.</span>
              </li>
            </ul>
          </div>

          {/* Terminology definitions */}
          <div className="space-y-6 text-sm">
            <div>
              <h4 className="font-bold text-[#ffffff] flex items-center gap-2">
                <span className="text-[#f64137] font-mono">01.</span> Linear Slope (OLS)
              </h4>
              <p className="text-[#a0b0c0] text-xs leading-relaxed mt-1">
                The average annual rate of change computed using Ordinary Least Squares regression. For example, a slope of <span className="font-mono text-[#f64137]">+0.028 °C/year</span> means temperatures have increased by approximately 0.28 °C per decade.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#ffffff] flex items-center gap-2">
                <span className="text-[#f64137] font-mono">02.</span> Mann-Kendall Trend Test
              </h4>
              <p className="text-[#a0b0c0] text-xs leading-relaxed mt-1">
                The World Meteorological Organization (WMO) gold-standard non-parametric test. Unlike simple linear regression, it does not assume data is normally distributed and is resilient to missing months and extreme weather spikes.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#ffffff] flex items-center gap-2">
                <span className="text-[#f64137] font-mono">03.</span> p-Value (Statistical Significance)
              </h4>
              <p className="text-[#a0b0c0] text-xs leading-relaxed mt-1">
                The probability that the observed trend occurred purely by random chance. In TrendLens:
              </p>
              <div className="mt-2 space-y-2 pl-3 border-l-2 border-[rgba(246,65,55,0.4)] text-xs font-mono">
                <div className="text-[#00ff88] flex items-center gap-1.5">
                  <span className="status-indicator status-success" />
                  <span>p &lt; 0.05: Statistically significant trend (95% confidence)</span>
                </div>
                <div className="text-[#f64137] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f64137]" />
                  <span>0.05 ≤ p &lt; 0.10: Emerging directional trend</span>
                </div>
                <div className="text-[#a0b0c0] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8e8e99]" />
                  <span>p ≥ 0.10: No significant trend (consistent with random noise)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#ffffff] flex items-center gap-2">
                <span className="text-[#f64137] font-mono">04.</span> 95% Confidence Interval
              </h4>
              <p className="text-[#a0b0c0] text-xs leading-relaxed mt-1">
                The range within which the true underlying rate of change lies with 95% mathematical probability. If the confidence interval does not contain zero, the trend direction is statistically confirmed.
              </p>
            </div>

            {/* Scientific Caution Alert */}
            <div className="p-4 rounded-xl bg-[rgba(246,65,55,0.08)] border border-[rgba(246,65,55,0.3)]">
              <div className="flex items-center gap-2 text-[#f64137] font-bold text-xs mb-1.5">
                <AlertTriangle size={15} />
                <span>Correlation is Not Direct Causation</span>
              </div>
              <p className="text-xs text-[#a0b0c0] leading-relaxed">
                Earth is an interconnected system. Observing that two environmental variables shift simultaneously does not prove one caused the other. Always frame conclusions cautiously: <em>"This pattern is consistent with broad atmospheric shifts; multi-variate modeling is required to confirm causation."</em>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between text-xs text-[#a0b0c0]">
          <span className="font-mono text-[11px]">NASA Earth Science Reference Guide</span>
          <button
            onClick={onClose}
            className="btn-secondary-scitech py-2 px-5 text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
