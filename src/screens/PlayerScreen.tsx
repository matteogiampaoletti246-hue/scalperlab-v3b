/**
 * @license
 * PlayerScreen component
 * Detailed player profile: hero, season stats grid, last matches, shot map, and per-90 metrics
 */

import React from 'react';
import { Player, Shot } from '../types/football';
import { TEAMS } from '../data/mockData';
import { CrestBadge } from '../components/common/CrestBadge';
import { ShotMapPitch } from '../components/common/ShotMapPitch';

interface PlayerScreenProps {
  player: Player;
  onNavigateTeam: (teamId: string) => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ player, onNavigateTeam }) => {
  const team = TEAMS[player.teamId] || TEAMS.inter;

  // Mock player shots for the shot map
  const playerShots: Shot[] = [
    { id: 'ps-1', playerId: player.id, playerName: player.name, teamId: team.id, x: 52, y: 16, xG: 0.42, minute: 23, outcome: 'gol', bodyPart: 'Piede destro', distanceMeters: 12 },
    { id: 'ps-2', playerId: player.id, playerName: player.name, teamId: team.id, x: 44, y: 18, xG: 0.28, minute: 41, outcome: 'parato', bodyPart: 'Piede sinistro', distanceMeters: 14 },
    { id: 'ps-3', playerId: player.id, playerName: player.name, teamId: team.id, x: 64, y: 24, xG: 0.12, minute: 58, outcome: 'murato', bodyPart: 'Piede destro', distanceMeters: 19 },
    { id: 'ps-4', playerId: player.id, playerName: player.name, teamId: team.id, x: 50, y: 13, xG: 0.35, minute: 74, outcome: 'parato', bodyPart: 'Colpo di testa', distanceMeters: 9 },
    { id: 'ps-5', playerId: player.id, playerName: player.name, teamId: team.id, x: 38, y: 28, xG: 0.08, minute: 82, outcome: 'fuori', bodyPart: 'Piede destro', distanceMeters: 24 },
  ];

  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto">
      {/* Player Hero Header */}
      <div
        className="relative px-4 pt-6 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}25 0%, transparent 70%)`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar with initials fallback */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-amber-400 dark:bg-white/10 dark:text-amber-400 font-serif text-2xl font-bold flex items-center justify-center border border-white/20 shadow-md">
              {player.name.slice(0, 1)}
            </div>
            <div className="absolute -bottom-1 -right-1 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-xs">
              #{player.number}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div
              onClick={() => onNavigateTeam(team.id)}
              className="flex items-center gap-1.5 cursor-pointer hover:underline text-xs text-neutral-500 dark:text-neutral-400 font-medium"
            >
              <CrestBadge
                name={team.name}
                crestText={team.crestText}
                primaryColor={team.primaryColor}
                secondaryColor={team.secondaryColor}
                size="xs"
              />
              <span>{team.name}</span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white leading-tight mt-0.5">
              {player.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              <span>{player.role}</span>
              <span>·</span>
              <span>{player.nationality}</span>
              <span>·</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                Voto medio {player.ratingAvg.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* Season Stats Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Statistiche Stagione 2025/26
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Presenze</div>
              <div className="font-mono text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                {player.appearances}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Gol</div>
              <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {player.goals}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Assist</div>
              <div className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {player.assists}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">xG Totali</div>
              <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {player.xG.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Per-90 Metrics Grid */}
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Metriche ogni 90 minuti (p90)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-white/5 font-mono">
              <span className="text-neutral-500 text-[11px]">Tiri totali</span>
              <strong className="text-neutral-900 dark:text-neutral-100">{player.shotsPer90}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-white/5 font-mono">
              <span className="text-neutral-500 text-[11px]">Nello specchio</span>
              <strong className="text-neutral-900 dark:text-neutral-100">{player.shotsOnTargetPer90}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-white/5 font-mono">
              <span className="text-neutral-500 text-[11px]">Falli subiti</span>
              <strong className="text-neutral-900 dark:text-neutral-100">{player.foulsSufferedPer90}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-white/5 font-mono">
              <span className="text-neutral-500 text-[11px]">Dribbling riusciti</span>
              <strong className="text-neutral-900 dark:text-neutral-100">{player.dribblesPer90}</strong>
            </div>
          </div>
        </div>

        {/* Shot Map for this Player */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Mappa Tiri del Giocatore
          </span>
          <ShotMapPitch
            shots={playerShots}
            homeTeam={team}
            awayTeam={TEAMS.juventus}
          />
        </div>

        {/* Last Matches Log */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Ultime 4 partite disputate
          </span>
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5 text-xs">
            {[
              { match: 'vs Juventus', mins: '68\'', shots: 3, onTarget: 2, goals: 1, rating: 8.2 },
              { match: 'vs Roma', mins: '90\'', shots: 4, onTarget: 2, goals: 1, rating: 7.8 },
              { match: '@ Torino', mins: '85\'', shots: 5, onTarget: 3, goals: 2, rating: 8.5 },
              { match: 'vs Stella Rossa', mins: '72\'', shots: 4, onTarget: 1, goals: 1, rating: 7.4 },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{m.match}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{m.mins} in campo · {m.shots} tiri ({m.onTarget} in porta)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  {m.goals > 0 && (
                    <span className="text-emerald-600 font-bold text-xs">{m.goals} ⚽</span>
                  )}
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    {m.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
