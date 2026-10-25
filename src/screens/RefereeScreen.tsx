/**
 * @license
 * RefereeScreen component
 * Referee statistical profile: fouls per game, card averages, strictness gauge, and match history
 */

import React from 'react';
import { Referee } from '../types/football';
import { ShieldCheck, UserCheck } from 'lucide-react';

interface RefereeScreenProps {
  referee: Referee;
}

export const RefereeScreen: React.FC<RefereeScreenProps> = ({ referee }) => {
  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto">
      {/* Referee Hero Header */}
      <div className="relative px-4 pt-6 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br from-neutral-100 via-neutral-50 to-purple-500/10 dark:from-[#131722] dark:via-[#0c0f17] dark:to-purple-500/15">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-purple-400 dark:bg-white/10 dark:text-purple-300 font-serif text-2xl font-bold flex items-center justify-center border border-white/20 shadow-md">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="flex-1 flex flex-col">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Associazione Italiana Arbitri (AIA)
            </span>
            <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white leading-tight mt-0.5">
              {referee.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              <span>{referee.country}</span>
              <span>·</span>
              <span className="font-mono">{referee.matches} partite dirette</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* Strictness Score Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Indice di Severità Disciplinare
            </span>
            <span className="text-[11px] text-neutral-500 mt-0.5">
              Propensione a sanzionare contatti e cartellini
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold text-purple-600 dark:text-purple-400">
              {referee.strictnessIndex.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-neutral-400">/10</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Medie Disciplinari per Gara
          </span>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Falli medi</div>
              <div className="font-mono text-base font-bold text-neutral-900 dark:text-white mt-1">
                {referee.foulsPerMatch.toFixed(1)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Gialli / gara</div>
              <div className="font-mono text-base font-bold text-amber-500 mt-1">
                {referee.yellowPerMatch.toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Rossi / gara</div>
              <div className="font-mono text-base font-bold text-rose-500 mt-1">
                {referee.redPerMatch.toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-[10px] text-neutral-400">Rigori / gara</div>
              <div className="font-mono text-base font-bold text-blue-500 mt-1">
                {referee.penaltiesPerMatch.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches Arbitrated */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Ultime direzioni di gara
          </span>
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5 text-xs">
            {referee.recentMatches.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {m.matchName}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">{m.date}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-neutral-500">{m.fouls} falli</span>
                  <span className="font-bold text-amber-500">{m.yellows} 🟨</span>
                  {m.reds > 0 && <span className="font-bold text-rose-500">{m.reds} 🟥</span>}
                  {m.penalties > 0 && <span className="font-bold text-blue-500">{m.penalties} 🥅</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
