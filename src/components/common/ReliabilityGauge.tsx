/**
 * @license
 * ReliabilityGauge component
 * Refined arc / circular gauge displaying confidence out of 10
 */

import React from 'react';

interface ReliabilityGaugeProps {
  score: number; // e.g. 8.4
  maxScore?: number; // default 10
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ReliabilityGauge: React.FC<ReliabilityGaugeProps> = ({
  score,
  maxScore = 10,
  size = 'md',
  showLabel = true,
}) => {
  const normalized = Math.min(maxScore, Math.max(0, score));
  const percentage = (normalized / maxScore) * 100;

  // SVG parameters
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 9 : 7;
  const radius = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const circumference = 2 * Math.PI * radius;
  // Arc 240 degrees instead of 360 for speedometer elegance
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  const getLabel = () => {
    if (score >= 8.0) return 'Alta affidabilità';
    if (score >= 6.5) return 'Buona affidabilità';
    if (score >= 5.0) return 'Affidabilità moderata';
    return 'Bassa affidabilità';
  };

  const getColor = () => {
    if (score >= 8.0) return '#10b981'; // emerald
    if (score >= 6.5) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  const dim = radius * 2 + strokeWidth * 2 + 10;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={dim}
          height={dim * 0.88}
          viewBox={`0 0 ${dim} ${dim}`}
          className="transform rotate-[135deg]"
        >
          {/* Background Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Progress */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="flex items-baseline">
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {score.toFixed(1)}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 ml-0.5">
              /10
            </span>
          </div>
        </div>
      </div>

      {showLabel && (
        <span
          className="text-[11px] font-semibold tracking-wide mt-1"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </span>
      )}
    </div>
  );
};
