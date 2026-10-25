/**
 * @license
 * BestMatchupsScreen component
 * Differential statistical matchups for Angoli, Cartellini, Tiri, Falli, and Fuorigiochi
 */

import React, { useState } from 'react';
import { MatchupCategory } from '../types/football';
import { BEST_MATCHUPS } from '../data/mockData';
import { DateStrip } from '../components/common/DateStrip';
import { CrestBadge } from '../components/common/CrestBadge';
import { GitCompare, Flame } from 'lucide-react';

interface BestMatchupsScreenProps {
  onSelectMatchName?: (matchName: string) => void;
}

export const BestMatchupsScreen: React.FC<BestMatchupsScreenProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<MatchupCategory>('Angoli');
  const [selectedDate, setSelectedDate] = useState('2026-10-25');

  const categories: MatchupCategory[] = ['Angoli', 'Cartellini', 'Tiri', 'Falli', 'Fuorigiochi'];

  const filteredMatchups = BEST_MATCHUPS.filter(
    (m) => m.category === selectedCategory
  );

  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto">
      {/* Date Strip */}
      <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <div className="p-3.5 space-y-3">
        {/* Title */}
        <div>
          <h1 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-amber-500" />
            <span>Migliori Matchup Statistiche</span>
          </h1>
          <p className="text-[11px] text-neutral-500">
            Discrepanze e squilibri tra le medie delle due contendenti
          </p>
        </div>

        {/* Compact Segmented Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                  : 'bg-neutral-200/50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Matchup Cards */}
        <div className="space-y-3 pt-1">
          {(filteredMatchups.length > 0 ? filteredMatchups : BEST_MATCHUPS).map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs flex flex-col gap-3"
            >
              {/* Match and League Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center -space-x-1.5">
                    <CrestBadge
                      name={m.homeTeam.name}
                      crestText={m.homeTeam.crestText}
                      primaryColor={m.homeTeam.primaryColor}
                      size="xs"
                    />
                    <CrestBadge
                      name={m.awayTeam.name}
                      crestText={m.awayTeam.crestText}
                      primaryColor={m.awayTeam.primaryColor}
                      size="xs"
                    />
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-neutral-900 dark:text-white">
                      {m.match}
                    </span>
                    <div className="text-[10px] text-neutral-400">
                      {m.league} · {m.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{m.confidenceScore}/10</span>
                </div>
              </div>

              {/* Pills Row: Divario 3,2 · Attesi X - Y · Partite usate 5 / 5 */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <div className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono font-bold text-[11px] border border-amber-500/20">
                  Divario {m.divario.toFixed(1)}
                </div>
                <div className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono font-semibold text-[11px] border border-blue-500/20">
                  {m.category} attesi {m.valoreCasa.toFixed(1)} - {m.valoreOspite.toFixed(1)}
                </div>
                <div className="px-2 py-1 rounded-md bg-neutral-200/60 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">
                  Partite usate: {m.partiteUsate} / {m.partiteTotali}
                </div>
              </div>

              {/* Visual Matchup Proportion Bar */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex justify-between text-neutral-500">
                  <span>{m.homeTeam.name}: {m.valoreCasa}</span>
                  <span>{m.awayTeam.name}: {m.valoreOspite}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
                  <div
                    className="h-full bg-blue-600 rounded-l-full"
                    style={{
                      width: `${(m.valoreCasa / (m.valoreCasa + m.valoreOspite)) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-amber-500 rounded-r-full"
                    style={{
                      width: `${(m.valoreOspite / (m.valoreCasa + m.valoreOspite)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
