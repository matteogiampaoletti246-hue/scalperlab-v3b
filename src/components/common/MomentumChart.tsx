/**
 * @license
 * MomentumChart component
 * Visualizes in-game attacking momentum over 90 minutes
 */

import React from 'react';
import { Team } from '../../types/football';

interface MomentumPoint {
  minute: number;
  value: number; // -100 (away dominant) to +100 (home dominant)
}

interface MomentumChartProps {
  momentum: MomentumPoint[];
  homeTeam: Team;
  awayTeam: Team;
}

export const MomentumChart: React.FC<MomentumChartProps> = ({
  momentum,
  homeTeam,
  awayTeam,
}) => {
  // SVG dimensions
  const width = 360;
  const height = 90;
  const midY = height / 2;

  // Build SVG path
  // minute 0 to 90 maps to 0 to width
  const points = [{ minute: 0, value: 0 }, ...momentum];
  if (points[points.length - 1].minute < 90) {
    points.push({ minute: 90, value: 0 });
  }

  const coords = points.map((p) => {
    const x = (p.minute / 90) * width;
    // value -100 to +100 -> y maps midY - (val/100)*(midY - 6)
    const y = midY - (p.value / 100) * (midY - 8);
    return { x, y, value: p.value };
  });

  const pathD = coords.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="flex flex-col w-full p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] gap-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: homeTeam.primaryColor }}
          />
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {homeTeam.name}
          </span>
        </div>
        <span className="text-[11px] font-medium text-neutral-400">
          Grafico Pressione d'Attacco
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {awayTeam.name}
          </span>
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: awayTeam.primaryColor }}
          />
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-24 overflow-hidden rounded-lg bg-neutral-100/60 dark:bg-black/20 border border-black/5 dark:border-white/5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Half time vertical marker line */}
          <line
            x1={width / 2}
            y1="0"
            x2={width / 2}
            y2={height}
            stroke="rgba(148, 163, 184, 0.3)"
            strokeDasharray="3 3"
          />

          {/* Neutral Center baseline (0 line) */}
          <line
            x1="0"
            y1={midY}
            x2={width}
            y2={midY}
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="1"
          />

          {/* Area gradient under path */}
          <path
            d={`${pathD} L ${width} ${midY} L 0 ${midY} Z`}
            fill="url(#momentumGradient)"
            opacity="0.25"
          />

          {/* Momentum line curve */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(217, 119, 6, 0.9)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={homeTeam.primaryColor} />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor={awayTeam.primaryColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels for 0', 45' (Intervallo), 90' */}
        <div className="absolute bottom-1 inset-x-2 flex justify-between text-[9px] font-mono text-neutral-400">
          <span>0'</span>
          <span className="bg-neutral-200/80 dark:bg-neutral-800/80 px-1 rounded">45' Intervallo</span>
          <span>90'</span>
        </div>
      </div>
    </div>
  );
};
