import React, { useState, useMemo } from 'react';
import { TimeSeriesPoint } from '../../types';

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  variableName: string;
  unit: string;
  olsSlope: number;
  olsIntercept: number;
  ciLower: number;
  ciUpper: number;
  color?: string;
  showConfidenceInterval?: boolean;
  showRollingMean?: boolean;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  variableName,
  unit,
  olsSlope,
  olsIntercept,
  ciLower,
  ciUpper,
  color = '#f64137',
  showConfidenceInterval = true,
  showRollingMean = true
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'raw' | 'anomaly'>('raw');

  const chartData = useMemo(() => {
    if (viewMode === 'anomaly') {
      return data.map(d => ({
        ...d,
        displayVal: d.anomaly ?? d.value
      }));
    }
    return data.map(d => ({
      ...d,
      displayVal: d.value
    }));
  }, [data, viewMode]);

  // Dimension calculations
  const width = 900;
  const height = 340;
  const padding = { top: 30, right: 40, bottom: 45, left: 65 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const n = chartData.length;

  const { minVal, maxVal, yRange, yTicks } = useMemo(() => {
    if (n === 0) return { minVal: 0, maxVal: 10, yRange: 10, yTicks: [] };
    const vals = chartData.map(d => d.displayVal);
    let min = Math.min(...vals);
    let max = Math.max(...vals);

    if (viewMode === 'anomaly') {
      const absMax = Math.max(Math.abs(min), Math.abs(max)) * 1.15;
      min = -absMax;
      max = absMax;
    } else {
      const margin = (max - min) * 0.1 || 1;
      min = min - margin;
      max = max + margin;
    }

    const range = max - min || 1;
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
      return min + (range * i) / tickCount;
    });

    return { minVal: min, maxVal: max, yRange: range, yTicks: ticks };
  }, [chartData, viewMode, n]);

  if (n === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#a0b0c0] font-mono text-sm bg-[#0d0d12] border border-[rgba(255,255,255,0.1)] rounded-xl">
        No observational data points available for this period.
      </div>
    );
  }

  const getX = (index: number) => padding.left + (index / (n - 1 || 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - ((val - minVal) / yRange) * innerHeight;

  // Construct raw path
  const pathD = chartData.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.displayVal);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Construct rolling average path if available
  const rollingD = showRollingMean && viewMode === 'raw'
    ? chartData.reduce((acc, pt, i) => {
        if (pt.rollingAvg === undefined) return acc;
        const x = getX(i);
        const y = getY(pt.rollingAvg);
        return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  // Regression trend line points
  const firstPt = chartData[0];
  const lastPt = chartData[n - 1];
  const startXDec = firstPt.year + (firstPt.month - 0.5) / 12;
  const endXDec = lastPt.year + (lastPt.month - 0.5) / 12;

  let regY1 = olsIntercept + olsSlope * startXDec;
  let regY2 = olsIntercept + olsSlope * endXDec;

  if (viewMode === 'anomaly') {
    const centerYear = (startXDec + endXDec) / 2;
    regY1 = olsSlope * (startXDec - centerYear);
    regY2 = olsSlope * (endXDec - centerYear);
  }

  const trendLineY1 = getY(regY1);
  const trendLineY2 = getY(regY2);

  // Confidence interval polygon
  let ciPolygonPoints = '';
  if (showConfidenceInterval && n > 2) {
    const ciUpperY1 = getY(regY1 + 1.96 * Math.abs(ciUpper - olsSlope));
    const ciUpperY2 = getY(regY2 + 1.96 * Math.abs(ciUpper - olsSlope));
    const ciLowerY2 = getY(regY2 - 1.96 * Math.abs(olsSlope - ciLower));
    const ciLowerY1 = getY(regY1 - 1.96 * Math.abs(olsSlope - ciLower));

    ciPolygonPoints = `${padding.left},${ciUpperY1} ${padding.left + innerWidth},${ciUpperY2} ${padding.left + innerWidth},${ciLowerY2} ${padding.left},${ciLowerY1}`;
  }

  const xTicks = useMemo(() => {
    const step = Math.max(1, Math.floor(n / 6));
    const list = [];
    for (let i = 0; i < n; i += step) {
      list.push({ index: i, point: chartData[i] });
    }
    if (list[list.length - 1].index !== n - 1) {
      list.push({ index: n - 1, point: chartData[n - 1] });
    }
    return list;
  }, [chartData, n]);

  const activePoint = hoverIndex !== null ? chartData[hoverIndex] : null;

  return (
    <div className="w-full bg-[#0d0d12] border border-[rgba(255,255,255,0.12)] rounded-2xl p-5 relative select-none shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137]" />
          <span className="font-semibold text-sm text-[#ffffff]">{variableName} Time Series</span>
          <span className="text-xs font-mono text-[#a0b0c0]">({unit})</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'raw' 
                ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_10px_rgba(246,65,55,0.3)]' 
                : 'text-[#a0b0c0] hover:text-[#ffffff] hover:bg-[#1a1a22]'
            }`}
          >
            Observed Values
          </button>
          <button
            onClick={() => setViewMode('anomaly')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'anomaly' 
                ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_10px_rgba(246,65,55,0.3)]' 
                : 'text-[#a0b0c0] hover:text-[#ffffff] hover:bg-[#1a1a22]'
            }`}
          >
            Baseline Anomaly
          </button>
        </div>
      </div>

      {/* Main SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f64137" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f64137" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ciGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f64137" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#f64137" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((tick, idx) => {
            const y = getY(tick);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="2 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#607080"
                  fontSize="10"
                  fontFamily="JetBrains Mono, Courier New"
                >
                  {tick.toFixed(tick > 100 ? 0 : 2)}
                </text>
              </g>
            );
          })}

          {/* Zero baseline */}
          {minVal <= 0 && maxVal >= 0 && (
            <line
              x1={padding.left}
              y1={getY(0)}
              x2={padding.left + innerWidth}
              y2={getY(0)}
              stroke="rgba(246, 65, 55, 0.4)"
              strokeWidth="1.5"
            />
          )}

          {/* Confidence interval area */}
          {ciPolygonPoints && (
            <polygon
              points={ciPolygonPoints}
              fill="url(#ciGradient)"
            />
          )}

          {/* Primary data path */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 12-Month Rolling Mean Path */}
          {rollingD && (
            <path
              d={rollingD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Linear regression slope line */}
          <line
            x1={padding.left}
            y1={trendLineY1}
            x2={padding.left + innerWidth}
            y2={trendLineY2}
            stroke="#f64137"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* X Axis Ticks */}
          {xTicks.map((item, idx) => {
            const x = getX(item.index);
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={padding.top + innerHeight}
                  x2={x}
                  y2={padding.top + innerHeight + 6}
                  stroke="rgba(255, 255, 255, 0.15)"
                />
                <text
                  x={x}
                  y={padding.top + innerHeight + 20}
                  textAnchor="middle"
                  fill="#a0b0c0"
                  fontSize="11"
                  fontFamily="JetBrains Mono, Courier New"
                >
                  {item.point.date}
                </text>
              </g>
            );
          })}

          {/* Interactive Mouse Hover Columns */}
          {chartData.map((pt, i) => {
            const x = getX(i);
            const colWidth = innerWidth / (n - 1 || 1);
            return (
              <rect
                key={i}
                x={x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={innerHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                className="cursor-crosshair"
              />
            );
          })}

          {/* Active Hover Marker */}
          {hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + innerHeight}
                stroke="#f64137"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(chartData[hoverIndex].displayVal)}
                r="5"
                fill="#f64137"
                stroke="#000000"
                strokeWidth="2"
                filter="drop-shadow(0 0 6px #f64137)"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && hoverIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none bg-[#000000]/95 border border-[rgba(246,65,55,0.4)] rounded-lg p-3 shadow-[0_0_20px_rgba(246,65,55,0.25)] backdrop-blur-md text-xs font-mono transition-transform"
            style={{
              left: Math.min(Math.max(10, (hoverIndex / n) * 100 - 15), 70) + '%'
            }}
          >
            <div className="text-[#f64137] font-semibold text-sm mb-1">{activePoint.date}</div>
            <div className="flex justify-between gap-4 text-[#ffffff]">
              <span>Observed:</span>
              <span className="font-bold">{activePoint.value.toFixed(2)} {unit}</span>
            </div>
            {activePoint.anomaly !== undefined && (
              <div className="flex justify-between gap-4 text-[#a0b0c0]">
                <span>Departure:</span>
                <span className={activePoint.anomaly >= 0 ? 'text-[#f64137]' : 'text-[#8e8e99]'}>
                  {activePoint.anomaly >= 0 ? '+' : ''}{activePoint.anomaly.toFixed(2)} {unit}
                </span>
              </div>
            )}
            {activePoint.rollingAvg !== undefined && (
              <div className="flex justify-between gap-4 text-[#ffffff]">
                <span>12-Mo Mean:</span>
                <span>{activePoint.rollingAvg.toFixed(2)} {unit}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend below chart */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-[rgba(255,255,255,0.1)] text-xs text-[#a0b0c0]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5" style={{ backgroundColor: color }} />
            <span>Observed Record</span>
          </div>
          {viewMode === 'raw' && showRollingMean && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-[#ffffff]" />
              <span>12-Month Mean</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-b border-dashed border-[#f64137]" />
            <span>Linear Fit (Slope: {olsSlope > 0 ? '+' : ''}{olsSlope.toFixed(4)}/yr)</span>
          </div>
          {showConfidenceInterval && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[rgba(246,65,55,0.15)] border border-[rgba(246,65,55,0.4)]" />
              <span>95% Confidence Band</span>
            </div>
          )}
        </div>

        <div className="font-mono text-[11px] text-[#607080]">
          n = {n} intervals
        </div>
      </div>
    </div>
  );
};
