import React from 'react';

interface MiniSparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  trendDirection?: 'increasing' | 'decreasing' | 'stable';
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color,
  width = 120,
  height = 36,
  trendDirection
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-[#1E293B]/30 rounded" />;
  }

  const strokeColor = color || (
    trendDirection === 'increasing' ? '#F97316' :
    trendDirection === 'decreasing' ? '#38BDF8' :
    '#2DD4BF'
  );

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width - padding}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="2.5"
          fill={strokeColor}
        />
      )}
    </svg>
  );
};
