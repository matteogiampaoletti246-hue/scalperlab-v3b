/**
 * @license
 * Football pitch visual for tactical lineups and live player ratings
 */

import React from 'react';
import { Formation, LineupPlayer } from '../../types/football';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface PitchFieldProps {
  formation: Formation;
  teamName: string;
  teamColor?: string;
  isLive?: boolean;
  onSelectPlayer?: (player: LineupPlayer) => void;
}

export const PitchField: React.FC<PitchFieldProps> = ({
  formation,
  teamName,
  teamColor = '#2563eb',
  isLive = false,
  onSelectPlayer,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Formation Header & Coach */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {teamName}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-medium">
            {formation.formation}
          </span>
        </div>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
          All: <span className="font-medium text-neutral-700 dark:text-neutral-200">{formation.coach}</span>
        </div>
      </div>

      {/* SVG Football Pitch Field */}
      <div className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
        {/* Pitch Field Markings SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          viewBox="0 0 100 135"
          preserveAspectRatio="none"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        >
          {/* Outer boundary */}
          <rect x="5" y="5" width="90" height="125" rx="3" />
          {/* Halfway line */}
          <line x1="5" y1="67.5" x2="95" y2="67.5" />
          {/* Center circle */}
          <circle cx="50" cy="67.5" r="14" />
          <circle cx="50" cy="67.5" r="1" fill="#ffffff" />
          {/* Top Penalty Area (Away) */}
          <rect x="25" y="5" width="50" height="22" />
          <rect x="36" y="5" width="28" height="8" />
          <path d="M 38 27 A 10 10 0 0 0 62 27" />
          {/* Bottom Penalty Area (Home) */}
          <rect x="25" y="108" width="50" height="22" />
          <rect x="36" y="122" width="28" height="8" />
          <path d="M 38 108 A 10 10 0 0 1 62 108" />
        </svg>

        {/* Players on Pitch */}
        <div className="absolute inset-0 p-4">
          {formation.startingXI.map((player) => {
            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer?.(player)}
                role="button"
                tabIndex={0}
                style={{
                  left: `${player.x}%`,
                  top: `${player.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              >
                {/* Player Marker Circle */}
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border border-white/40"
                    style={{ backgroundColor: teamColor }}
                  >
                    {player.number}
                  </div>

                  {/* Captain Badge */}
                  {player.isCaptain && (
                    <div
                      title="Capitano"
                      className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-neutral-950 text-[8px] font-bold flex items-center justify-center border border-white/50"
                    >
                      C
                    </div>
                  )}

                  {/* Rating Badge (Live / Pre) */}
                  {player.rating && (
                    <div
                      className={`absolute -top-1.5 -right-2 text-[9px] font-mono font-bold px-1 py-0.2 rounded shadow-xs ${
                        player.rating >= 7.5
                          ? 'bg-emerald-500 text-white'
                          : player.rating >= 7.0
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-100'
                      }`}
                    >
                      {player.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Yellow / Red Card Badge */}
                  {player.yellowCard && (
                    <div
                      title="Cartellino giallo"
                      className="absolute -bottom-1 -left-1 w-2.5 h-3.5 bg-yellow-400 rounded-xs border border-yellow-600 shadow-xs"
                    />
                  )}
                  {player.redCard && (
                    <div
                      title="Cartellino rosso"
                      className="absolute -bottom-1 -left-1 w-2.5 h-3.5 bg-rose-600 rounded-xs border border-rose-800 shadow-xs"
                    />
                  )}

                  {/* Substitution Arrow */}
                  {player.subOutMinute && (
                    <div
                      title={`Sostituito al ${player.subOutMinute}'`}
                      className="absolute -bottom-1.5 -right-1.5 flex items-center bg-rose-600/90 text-white text-[8px] px-1 rounded-sm shadow-xs"
                    >
                      <ArrowDownLeft className="w-2.5 h-2.5" />
                      <span>{player.subOutMinute}'</span>
                    </div>
                  )}
                </div>

                {/* Player Name Tag */}
                <span className="mt-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium max-w-[80px] truncate text-center shadow-xs">
                  {player.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bench (Panchina) - 2 Column Grid */}
      {formation.bench.length > 0 && (
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
          <span className="text-[11px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
            Panchina
          </span>
          <div className="grid grid-cols-2 gap-2">
            {formation.bench.map((player) => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer?.(player)}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-white/5 hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-neutral-400 dark:text-neutral-500 w-4 text-[11px]">
                    {player.number}
                  </span>
                  <span className="text-neutral-800 dark:text-neutral-200 truncate font-medium">
                    {player.name}
                  </span>
                </div>
                {player.subInMinute && (
                  <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono shrink-0">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{player.subInMinute}'</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
