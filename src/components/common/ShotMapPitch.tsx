/**
 * @license
 * ShotMapPitch component
 * Interactive shot map with xG circle sizing, outcome coloring, filters, and tap tooltip
 */

import React, { useState } from 'react';
import { Shot, ShotOutcome, Team } from '../../types/football';
import { TOKENS } from '../../theme/tokens';
import { Info, X } from 'lucide-react';

interface ShotMapPitchProps {
  shots: Shot[];
  homeTeam: Team;
  awayTeam: Team;
}

export const ShotMapPitch: React.FC<ShotMapPitchProps> = ({
  shots,
  homeTeam,
  awayTeam,
}) => {
  const [teamFilter, setTeamFilter] = useState<'all' | 'home' | 'away'>('all');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
  const [activeShot, setActiveShot] = useState<Shot | null>(null);

  // Available unique players who took shots
  const uniquePlayers = Array.from(
    new Map(shots.map((s) => [s.playerId, { id: s.playerId, name: s.playerName }])).values()
  );

  // Filter shots
  const filteredShots = shots.filter((s) => {
    if (teamFilter === 'home' && s.teamId !== homeTeam.id) return false;
    if (teamFilter === 'away' && s.teamId !== awayTeam.id) return false;
    if (selectedPlayerId !== 'all' && s.playerId !== selectedPlayerId) return false;
    return true;
  });

  const getOutcomeColor = (outcome: ShotOutcome) => {
    switch (outcome) {
      case 'gol':
        return TOKENS.colors.shotOutcomes.gol;
      case 'parato':
        return TOKENS.colors.shotOutcomes.parato;
      case 'fuori':
        return TOKENS.colors.shotOutcomes.fuori;
      case 'murato':
        return TOKENS.colors.shotOutcomes.murato;
    }
  };

  const getOutcomeLabel = (outcome: ShotOutcome) => {
    switch (outcome) {
      case 'gol':
        return 'Gol';
      case 'parato':
        return 'Parato';
      case 'fuori':
        return 'Fuori';
      case 'murato':
        return 'Murato';
    }
  };

  // Radius in pixels based on xG (0.05 -> 5px, 0.70 -> 16px)
  const getShotRadius = (xG: number) => {
    return Math.max(5, Math.min(18, Math.round(5 + xG * 20)));
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Filters Bar: Segmented control + Player select */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-2">
          {/* Segmented Team Filter */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 text-xs">
            <button
              onClick={() => setTeamFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                teamFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Tutti ({shots.length})
            </button>
            <button
              onClick={() => setTeamFilter('home')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                teamFilter === 'home'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {homeTeam.shortName}
            </button>
            <button
              onClick={() => setTeamFilter('away')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                teamFilter === 'away'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {awayTeam.shortName}
            </button>
          </div>

          {/* Player Dropdown */}
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border-none outline-none max-w-[130px] truncate"
          >
            <option value="all">Tutti i tiratori</option>
            {uniquePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Gol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>Parato</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
            <span>Fuori</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <span>Murato</span>
          </div>
        </div>
      </div>

      {/* Football Half Pitch for Shot Map */}
      <div className="relative w-full aspect-[4/3.8] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-neutral-900 to-emerald-950">
        {/* SVG Goal & Attacking Third Markings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 100 80"
          preserveAspectRatio="none"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
        >
          {/* Half pitch line at bottom */}
          <line x1="0" y1="80" x2="100" y2="80" />
          <circle cx="50" cy="80" r="14" />
          {/* Goal post at top */}
          <rect x="42" y="0" width="16" height="2" fill="#ffffff" />
          {/* 6-yard box */}
          <rect x="36" y="0" width="28" height="10" />
          {/* 18-yard box */}
          <rect x="22" y="0" width="56" height="28" />
          {/* Penalty arc */}
          <path d="M 38 28 A 10 10 0 0 0 62 28" />
          {/* Penalty spot */}
          <circle cx="50" cy="18" r="0.8" fill="#ffffff" />
        </svg>

        {/* Shots as interactive circles */}
        {filteredShots.map((shot) => {
          const r = getShotRadius(shot.xG);
          const color = getOutcomeColor(shot.outcome);
          const isSelected = activeShot?.id === shot.id;

          return (
            <button
              key={shot.id}
              onClick={() => setActiveShot(shot)}
              style={{
                left: `${shot.x}%`,
                top: `${shot.y}%`,
                width: `${r * 2}px`,
                height: `${r * 2}px`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: color,
                boxShadow: isSelected
                  ? `0 0 0 3px #ffffff, 0 0 12px ${color}`
                  : `0 2px 8px -1px ${color}80`,
              }}
              className={`absolute rounded-full transition-transform hover:scale-125 active:scale-95 cursor-pointer border border-white/60 flex items-center justify-center`}
              title={`${shot.playerName} (${shot.minute}'): ${shot.xG.toFixed(2)} xG`}
            >
              {shot.outcome === 'gol' && (
                <span className="text-[8px] font-bold text-white leading-none">G</span>
              )}
            </button>
          );
        })}

        {/* Interactive Tooltip Card */}
        {activeShot && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-neutral-900/95 text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{activeShot.playerName}</span>
                <span className="font-mono text-neutral-400 text-[11px]">{activeShot.minute}'</span>
                <span
                  className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
                  style={{
                    backgroundColor: `${getOutcomeColor(activeShot.outcome)}30`,
                    color: getOutcomeColor(activeShot.outcome),
                  }}
                >
                  {getOutcomeLabel(activeShot.outcome)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-neutral-300 font-mono">
                <span>xG: <strong className="text-white">{activeShot.xG.toFixed(2)}</strong></span>
                <span>·</span>
                <span>{activeShot.bodyPart}</span>
                <span>·</span>
                <span>{activeShot.distanceMeters}m</span>
              </div>
            </div>

            <button
              onClick={() => setActiveShot(null)}
              aria-label="Chiudi dettaglio tiro"
              className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400 dark:text-neutral-500">
        <span>Dimensione cerchio proporzionale all'xG</span>
        <span>Tocca un tiro per i dettagli</span>
      </div>
    </div>
  );
};
