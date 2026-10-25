/**
 * @license
 * BestPlayersScreen component
 * Ranked player cards with threshold toggle (Over 0.5, 1.5, 2.5), expected averages, and recent vs season split
 */

import React, { useState } from 'react';
import { BEST_PLAYER_PICKS } from '../data/mockData';
import { CrestBadge } from '../components/common/CrestBadge';
import { DateStrip } from '../components/common/DateStrip';
import { Trophy, ChevronRight } from 'lucide-react';

interface BestPlayersScreenProps {
  onSelectPlayer: (playerId: string) => void;
}

export const BestPlayersScreen: React.FC<BestPlayersScreenProps> = ({ onSelectPlayer }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-25');
  const [threshold, setThreshold] = useState<'0.5' | '1.5' | '2.5'>('1.5');

  const filteredPicks = BEST_PLAYER_PICKS.filter((p) => p.threshold === threshold);

  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto">
      {/* Date Strip */}
      <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* Header & Threshold Toggle */}
      <div className="p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Migliori Giocatori</span>
            </h1>
            <p className="text-[11px] text-neutral-500">
              Ranking ordinato per probabilità attesa e valore quota
            </p>
          </div>

          {/* Segmented Threshold Switch: Over 0,5 / 1,5 / 2,5 */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-200/60 dark:bg-white/10 text-xs font-mono">
            {(['0.5', '1.5', '2.5'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`px-2 py-1 rounded-md transition-all ${
                  threshold === t
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                +{t}
              </button>
            ))}
          </div>
        </div>

        {/* Ranked Player Cards */}
        <div className="space-y-3">
          {(filteredPicks.length > 0 ? filteredPicks : BEST_PLAYER_PICKS).map((pick) => (
            <div
              key={pick.id}
              onClick={() => onSelectPlayer(pick.player.id)}
              role="button"
              tabIndex={0}
              className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 group active:scale-[0.99]"
            >
              {/* Top Row: Rank, Crests, Player, Match */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Position badge */}
                  <span className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400 w-6">
                    #{pick.rank}
                  </span>

                  <div className="flex items-center -space-x-1.5">
                    <CrestBadge
                      name="Home"
                      crestText={pick.teamCrestText}
                      primaryColor="#002f6c"
                      size="xs"
                    />
                    <CrestBadge
                      name="Away"
                      crestText={pick.opponentCrestText}
                      primaryColor="#1a1a1a"
                      size="xs"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {pick.player.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {pick.match}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Pills Row: Voto, Media attesa, 90' medi */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <div className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-semibold text-[11px] border border-amber-500/20">
                  Voto {pick.votoRating.toFixed(2)}
                </div>
                <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono font-semibold text-[11px] border border-blue-500/20">
                  Media attesa {pick.mediaAttesa.toFixed(2)}
                </div>
                <div className="px-2 py-1 rounded-md bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                  {pick.mediPer90} 90' medi
                </div>
              </div>

              {/* Comparative Split Line: Ultime 5 vs Stagione */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                <span>
                  Ultime 5: <strong className="text-neutral-800 dark:text-neutral-200">{pick.ultime5}</strong>
                  {' - '}
                  stagione: <strong className="text-neutral-800 dark:text-neutral-200">{pick.stagione}</strong> /90'
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  Over {threshold} &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
