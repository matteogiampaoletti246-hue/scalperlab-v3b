/**
 * @license
 * Two-sided ComparisonBar component for football stats
 */

import React from 'react';

interface ComparisonBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  homeDisplay?: string;
  awayDisplay?: string;
  homeColor?: string;
  awayColor?: string;
  unit?: string;
  sublabel?: string;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  label,
  homeValue,
  awayValue,
  homeDisplay,
  awayDisplay,
  homeColor = '#2563eb',
  awayColor = '#d97706',
  unit = '',
  sublabel,
}) => {
  const total = homeValue + awayValue;
  const homePct = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPct = total > 0 ? (awayValue / total) * 100 : 50;

  const isHomeGreater = homeValue > awayValue;
  const isAwayGreater = awayValue > homeValue;

  return (
    <div className="flex flex-col w-full py-2">
      {/* Label and Values Row */}
      <div className="flex items-center justify-between text-xs mb-1.5 px-0.5">
        <span
          className={`font-mono tabular-nums text-xs ${
            isHomeGreater
              ? 'font-bold text-neutral-900 dark:text-neutral-50'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {homeDisplay || `${homeValue}${unit}`}
        </span>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
            {label}
          </span>
          {sublabel && (
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500">
              {sublabel}
            </span>
          )}
        </div>

        <span
          className={`font-mono tabular-nums text-xs ${
            isAwayGreater
              ? 'font-bold text-neutral-900 dark:text-neutral-50'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {awayDisplay || `${awayValue}${unit}`}
        </span>
      </div>

      {/* Two-Sided Visual Bar */}
      <div className="grid grid-cols-2 gap-1.5 w-full h-1.5 rounded-full overflow-hidden">
        {/* Home side: fills from right to left towards center */}
        <div className="w-full bg-neutral-200/60 dark:bg-neutral-800/80 rounded-l-full overflow-hidden flex justify-end">
          <div
            className="h-full rounded-l-full transition-all duration-300"
            style={{
              width: `${homePct}%`,
              backgroundColor: homeColor,
              opacity: isHomeGreater ? 1 : 0.65,
            }}
          />
        </div>

        {/* Away side: fills from left to right away from center */}
        <div className="w-full bg-neutral-200/60 dark:bg-neutral-800/80 rounded-r-full overflow-hidden flex justify-start">
          <div
            className="h-full rounded-r-full transition-all duration-300"
            style={{
              width: `${awayPct}%`,
              backgroundColor: awayColor,
              opacity: isAwayGreater ? 1 : 0.65,
            }}
          />
        </div>
      </div>
    </div>
  );
};
