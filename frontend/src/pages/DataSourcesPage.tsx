import React, { useState } from 'react';
import { DATA_SOURCES_CATALOG } from '../data/dataSourcesCatalog';
import { DataSourceMetadata } from '../types';
import { Database, ExternalLink, Search, Shield, Layers, FileText } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DATA_SOURCES_CATALOG.filter(ds => {
    const q = searchTerm.toLowerCase();
    return (
      ds.name.toLowerCase().includes(q) ||
      ds.agency.toLowerCase().includes(q) ||
      ds.missionOrModel.toLowerCase().includes(q) ||
      ds.variables.some(v => v.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#ffffff] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section (Black Session Container) */}
        <div className="section-card-scitech bg-[#000000] text-[#ffffff] p-8 sm:p-12 rounded-3xl border border-[rgba(255,255,255,0.14)] shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d12] border border-[rgba(246,65,55,0.4)] text-xs font-mono text-[#f64137] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(246,65,55,0.15)] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#f64137] animate-pulse" />
            <Database size={13} className="text-[#f64137]" />
            <span>NASA Data Provenance & Open Access Catalog</span>
          </div>
          <h1 className="text-h1 text-[#ffffff] font-bold tracking-tight">
            NASA Observational Archives
          </h1>
          <p className="text-base text-[#d1d1d6] mt-3 leading-relaxed max-w-3xl">
            TrendLens integrates directly with NASA Earthdata EOSDIS repositories, MERRA-2 reanalysis models, and public REST APIs. We uphold NASA Open Science guidelines: all sensor citations, spatial resolutions, and programmatic access endpoints are fully documented below.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative mb-10 max-w-lg">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f64137]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filter by dataset, sensor, or variable (e.g. MODIS, IMERG, T2M)..."
            className="w-full pl-11 pr-4 py-3 bg-[#0d0d12] border border-[rgba(255,255,255,0.15)] focus:border-[#f64137] focus:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-xl text-xs font-mono text-[#ffffff] outline-none transition-all placeholder:text-[#607080]"
          />
        </div>

        {/* Dataset Grid: Responsive 2-column sci-tech cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map(ds => (
            <div
              key={ds.id}
              className="data-card-scitech flex flex-col justify-between group border border-[rgba(255,255,255,0.1)] hover:border-[rgba(246,65,55,0.4)] transition-all"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[12px] font-mono text-[#f64137] uppercase tracking-widest block mb-1">
                      {ds.agency} · {ds.missionOrModel}
                    </span>
                    <h2 className="text-xl font-bold text-[#ffffff] group-hover:text-[#f64137] transition-colors">
                      {ds.name}
                    </h2>
                  </div>
                  <a
                    href={ds.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-icon-scitech shrink-0"
                    title="Visit NASA Repository"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                {/* Specs Box */}
                <div className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.1)] mb-5 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[#a0b0c0]">
                    <span>Spatial Resolution:</span>
                    <strong className="text-[#ffffff]">{ds.spatialResolution}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#a0b0c0]">
                    <span>Temporal Coverage:</span>
                    <strong className="text-[#f64137]">{ds.temporalCoverage}</strong>
                  </div>
                </div>

                {/* Variables */}
                <div className="mb-5">
                  <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#f64137] mb-2.5">
                    Measured Variables
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ds.variables.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-[#000000] border border-[rgba(246,65,55,0.3)] text-[11px] font-mono text-[#ffffff]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* API & Access Method */}
                <div className="text-xs text-[#a0b0c0] mb-5">
                  <span className="font-mono text-[#f64137] text-[11px] uppercase tracking-wider block mb-1">
                    Access Protocol:
                  </span>
                  <code className="text-[11px] font-mono text-[#ffffff] block bg-[#000000] p-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] overflow-x-auto select-all">
                    {ds.apiEndpoint}
                  </code>
                </div>

                {/* Formal Citation */}
                <div className="text-xs text-[#a0b0c0] mb-4">
                  <span className="font-mono text-[#a0b0c0] text-[11px] uppercase tracking-wider block mb-1">
                    Formal Scientific Citation:
                  </span>
                  <p className="text-[11px] italic leading-relaxed text-[#607080]">
                    {ds.citation}
                  </p>
                </div>
              </div>

              {/* License Footer */}
              <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-2 text-[#00ff88]">
                  <Shield size={14} />
                  <span>{ds.license}</span>
                </span>
                <span className="text-[#f64137] flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#f64137]" />
                  <span>NASA Open Science Compliant</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
