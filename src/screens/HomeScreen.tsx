/**
 * @license
 * HomeScreen component
 * Football matches list grouped by league, date selector, live filter, pull-to-refresh feel
 */

import React, { useState } from 'react';
import { DateStrip } from '../components/common/DateStrip';
import { CrestBadge } from '../components/common/CrestBadge';
import { LeagueBadge } from '../components/common/LeagueBadge';
import { Match } from '../types/football';
import { ChevronRight, RefreshCw } from 'lucide-react';

interface HomeScreenProps {
  matches: Match[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectMatch: (match: Match) => void;
  onSelectLeague: (leagueId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  matches,
  selectedDate,
  onSelectDate,
  onSelectMatch,
  onSelectLeague,
}) => {
  const [filterType, setFilterType] = useState<'tutte' | 'live'>('tutte');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePullRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (filterType === 'live') {
      return m.status === 'live';
    }
    return m.date === selectedDate || m.status === 'live';
  });

  // Group matches by league
  const groupedByLeague = filteredMatches.reduce((acc, match) => {
    if (!acc[match.leagueId]) {
      acc[match.leagueId] = {
        leagueId: match.leagueId,
        leagueName: match.leagueName,
        matches: [],
      };
    }
    acc[match.leagueId].matches.push(match);
    return acc;
  }, {} as Record<string, { leagueId: string; leagueName: string; matches: Match[] }>);

  const leagueGroups = Object.values(groupedByLeague);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Date Strip */}
      <DateStrip selectedDate={selectedDate} onSelectDate={onSelectDate} />

      {/* Filter Bar: Tutte / Live + Pull refresh button */}
      <div className="flex items-center justify-between px-3.5 py-2.5 max-w-md mx-auto w-full">
        {/* Outlined thin segmented control */}
        <div className="flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-neutral-100/60 dark:bg-white/5 text-xs">
          <button
            onClick={() => setFilterType('tutte')}
            className={`px-3 py-1 rounded-md transition-all ${
              filterType === 'tutte'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Tutte ({matches.length})
          </button>
          <button
            onClick={() => setFilterType('live')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              filterType === 'live'
                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Live ({matches.filter((m) => m.status === 'live').length})</span>
          </button>
        </div>

        {/* Pull refresh feel button */}
        <button
          onClick={handlePullRefresh}
          title="Aggiorna partite"
          className="p-1.5 rounded-lg text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>

      {/* Refreshing skeleton pulse feedback */}
      {isRefreshing && (
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <div className="h-16 rounded-xl bg-neutral-200/60 dark:bg-white/5 animate-pulse" />
        </div>
      )}

      {/* Matches List Grouped By League */}
      <div className="max-w-md mx-auto w-full px-3 space-y-4 mt-1">
        {leagueGroups.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="font-serif text-lg text-neutral-500 dark:text-neutral-400">
              Nessuna partita in programma
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Prova a selezionare un'altra data dalla barra in alto.
            </p>
          </div>
        ) : (
          leagueGroups.map((group) => (
            <div
              key={group.leagueId}
              className="rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#121620]/75 backdrop-blur-xl shadow-xs"
            >
              {/* League Header (Tap opens the league) */}
              <div
                onClick={() => onSelectLeague(group.leagueId)}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50/80 dark:bg-white/[0.03] border-b border-black/[0.05] dark:border-white/[0.06] cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LeagueBadge name={group.leagueName} crestText="SA" size="sm" />
                  <span className="font-serif text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">
                    {group.leagueName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <span>Classifica & Stat</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Match Rows */}
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {group.matches.map((match) => {
                  const isLive = match.status === 'live';
                  const isFinished = match.status === 'finished';

                  return (
                    <div
                      key={match.id}
                      onClick={() => onSelectMatch(match)}
                      role="button"
                      tabIndex={0}
                      className="flex items-center justify-between px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      {/* Left: Time or Score */}
                      <div className="w-14 shrink-0 flex flex-col items-start justify-center">
                        {isLive ? (
                          <div className="flex flex-col items-start">
                            <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                              {match.liveMinute}'
                            </span>
                            <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-wider">
                              LIVE
                            </span>
                          </div>
                        ) : isFinished ? (
                          <div className="flex flex-col items-start">
                            <span className="text-[10px] font-mono font-semibold text-neutral-500 dark:text-neutral-400">
                              FINALE
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start">
                            <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                              {match.kickoffTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Teams & Scores */}
                      <div className="flex-1 flex flex-col gap-1.5 px-2 min-w-0">
                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <CrestBadge
                              name={match.homeTeam.name}
                              crestText={match.homeTeam.crestText}
                              primaryColor={match.homeTeam.primaryColor}
                              secondaryColor={match.homeTeam.secondaryColor}
                              size="xs"
                            />
                            <span
                              className={`text-xs truncate ${
                                isFinished && (match.score?.home ?? 0) > (match.score?.away ?? 0)
                                  ? 'font-bold text-neutral-900 dark:text-neutral-50'
                                  : 'font-medium text-neutral-800 dark:text-neutral-200'
                              }`}
                            >
                              {match.homeTeam.name}
                            </span>
                          </div>
                          {(isLive || isFinished) && (
                            <span
                              className={`font-mono text-xs tabular-nums ${
                                isLive
                                  ? 'font-bold text-rose-600 dark:text-rose-400'
                                  : 'font-bold text-neutral-900 dark:text-neutral-100'
                              }`}
                            >
                              {match.score?.home}
                            </span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <CrestBadge
                              name={match.awayTeam.name}
                              crestText={match.awayTeam.crestText}
                              primaryColor={match.awayTeam.primaryColor}
                              secondaryColor={match.awayTeam.secondaryColor}
                              size="xs"
                            />
                            <span
                              className={`text-xs truncate ${
                                isFinished && (match.score?.away ?? 0) > (match.score?.home ?? 0)
                                  ? 'font-bold text-neutral-900 dark:text-neutral-50'
                                  : 'font-medium text-neutral-800 dark:text-neutral-200'
                              }`}
                            >
                              {match.awayTeam.name}
                            </span>
                          </div>
                          {(isLive || isFinished) && (
                            <span
                              className={`font-mono text-xs tabular-nums ${
                                isLive
                                  ? 'font-bold text-rose-600 dark:text-rose-400'
                                  : 'font-bold text-neutral-900 dark:text-neutral-100'
                              }`}
                            >
                              {match.score?.away}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Reliability Badge or Chevron */}
                      <div className="flex items-center gap-2 shrink-0 pl-1">
                        {match.reliability?.score && (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {match.reliability.score.toFixed(1)}
                            </span>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
