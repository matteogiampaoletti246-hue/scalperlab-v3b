/**
 * @license
 * LeagueScreen component
 * Comprehensive league hub: matches, standings with zone bars & filters, teams statistical rankings, player leaderboards, and referee statistics
 */

import React, { useState } from 'react';
import { League, Match, Referee } from '../types/football';
import { LeagueBadge } from '../components/common/LeagueBadge';
import { CrestBadge } from '../components/common/CrestBadge';
import { SwipeableTabs, TabItem } from '../components/common/SwipeableTabs';
import {
  STANDINGS_SERIE_A,
  LEAGUE_TEAM_STATS,
  LEAGUE_PLAYER_LEADERBOARDS,
  LEAGUE_REFEREES,
  MATCHES,
} from '../data/mockData';
import { TOKENS } from '../theme/tokens';
import { ChevronRight, ChevronDown, Award } from 'lucide-react';

interface LeagueScreenProps {
  league: League;
  onSelectMatch: (match: Match) => void;
  onSelectTeam: (teamId: string) => void;
  onSelectReferee: (refereeId: string) => void;
}

export const LeagueScreen: React.FC<LeagueScreenProps> = ({
  league,
  onSelectMatch,
  onSelectTeam,
  onSelectReferee,
}) => {
  const tabs: TabItem[] = [
    { id: 'partite', label: 'Partite' },
    { id: 'classifica', label: 'Classifica' },
    { id: 'squadre', label: 'Squadre' },
    { id: 'giocatori', label: 'Giocatori' },
    { id: 'arbitri', label: 'Arbitri' },
  ];

  const [activeTab, setActiveTab] = useState<string>('classifica');

  // Standings Sub-filter (Totale / Casa / Trasferta / Forma)
  const [standingsFilter, setStandingsFilter] = useState<'totale' | 'casa' | 'trasferta' | 'forma'>('totale');

  // Active metrics inside category cards (Attacco, Difesa, Disciplina, Gioco)
  const [attaccoMetric, setAttaccoMetric] = useState<string>('gol');
  const [difesaMetric, setDifesaMetric] = useState<string>('gol_subiti');
  const [disciplinaMetric, setDisciplinaMetric] = useState<string>('gialli');
  const [giocoMetric, setGiocoMetric] = useState<string>('possesso');

  // Arbitri filter (Gialli / Rossi / Falli / Rigori / Partite)
  const [refereeSort, setRefereeSort] = useState<'gialli' | 'rossi' | 'falli' | 'rigori' | 'partite'>('gialli');

  // Sort referees based on active filter
  const sortedReferees = [...LEAGUE_REFEREES].sort((a, b) => {
    switch (refereeSort) {
      case 'gialli':
        return b.yellowCardsTotal - a.yellowCardsTotal;
      case 'rossi':
        return b.redCardsTotal - a.redCardsTotal;
      case 'falli':
        return b.foulsPerMatch - a.foulsPerMatch;
      case 'rigori':
        return b.penaltiesTotal - a.penaltiesTotal;
      case 'partite':
        return b.matches - a.matches;
    }
  });

  return (
    <div className="flex flex-col w-full pb-16">
      {/* League Hero Header */}
      <div className="relative px-4 pt-6 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br from-neutral-100 via-neutral-50 to-amber-500/5 dark:from-[#121722] dark:via-[#0c0f17] dark:to-amber-500/10">
        <div className="flex items-center gap-3.5">
          <LeagueBadge
            name={league.name}
            crestText={league.crestText}
            size="lg"
            className="shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {league.country} · {league.season}
            </span>
            <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
              {league.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Swipeable Tabs */}
      <SwipeableTabs
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        className="max-w-md mx-auto w-full"
      >
        {/* TAB 1: PARTITE */}
        <div key="partite" className="flex flex-col gap-3 px-3.5 pt-3">
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5">
            {MATCHES.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMatch(m)}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs"
              >
                <div className="w-14 shrink-0 font-mono text-neutral-500">
                  {m.status === 'live' ? (
                    <span className="text-rose-600 font-bold animate-pulse">{m.liveMinute}'</span>
                  ) : m.status === 'finished' ? (
                    'FIN'
                  ) : (
                    m.kickoffTime
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span>{m.homeTeam.name}</span>
                    {m.score && <span className="font-mono font-bold">{m.score.home}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{m.awayTeam.name}</span>
                    {m.score && <span className="font-mono font-bold">{m.score.away}</span>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* TAB 2: CLASSIFICA */}
        <div key="classifica" className="flex flex-col gap-3 px-3.5 pt-3">
          {/* Sub-filter segmented control: Totale / Casa / Trasferta / Forma */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs">
            {(['totale', 'casa', 'trasferta', 'forma'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStandingsFilter(filter)}
                className={`flex-1 py-1 rounded-md transition-all capitalize ${
                  standingsFilter === filter
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Standings Table with Zone Left Colored Bar */}
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100/70 dark:bg-white/5 text-[11px] font-mono text-neutral-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-5">#</span>
                <span>Squadra</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-center">G</span>
                <span className="w-7 text-center">DR</span>
                <span className="w-7 text-right font-bold">Pt</span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {STANDINGS_SERIE_A.map((row) => {
                // Zone Left Bar Color
                const zoneColor =
                  row.zone === 'champions'
                    ? TOKENS.colors.competition.champions
                    : row.zone === 'europa'
                    ? TOKENS.colors.competition.europa
                    : row.zone === 'conference'
                    ? TOKENS.colors.competition.conference
                    : row.zone === 'relegation'
                    ? TOKENS.colors.competition.relegation
                    : 'transparent';

                return (
                  <div
                    key={row.team.id}
                    onClick={() => onSelectTeam(row.team.id)}
                    role="button"
                    tabIndex={0}
                    className="relative flex items-center justify-between px-3 py-2.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer text-xs transition-colors"
                  >
                    {/* Left Colored Zone Indicator Bar */}
                    <div
                      className="absolute left-0 inset-y-1 w-1 rounded-r-full"
                      style={{ backgroundColor: zoneColor }}
                    />

                    <div className="flex items-center gap-2.5 truncate pl-1">
                      <span className="font-mono text-neutral-400 w-5">{row.position}</span>
                      <CrestBadge
                        name={row.team.name}
                        crestText={row.team.crestText}
                        primaryColor={row.team.primaryColor}
                        secondaryColor={row.team.secondaryColor}
                        size="xs"
                      />
                      <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                        {row.team.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="w-6 text-center text-neutral-400">{row.played}</span>
                      <span className="w-7 text-center text-neutral-400">
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </span>
                      <span className="w-7 text-right font-bold text-neutral-900 dark:text-neutral-50">
                        {row.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standings Legend */}
          <div className="flex flex-wrap items-center gap-3 px-1 py-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
              <span>Champions League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 inline-block" />
              <span>Europa League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
              <span>Conference League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" />
              <span>Retrocessione</span>
            </div>
          </div>
        </div>

        {/* TAB 3: SQUADRE (Category Cards: Attacco, Difesa, Disciplina, Gioco) */}
        <div key="squadre" className="flex flex-col gap-4 px-3.5 pt-3">
          {/* Attacco Card */}
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {LEAGUE_TEAM_STATS.attacco.title}
              </span>
              {/* Metric Switch */}
              <select
                value={attaccoMetric}
                onChange={(e) => setAttaccoMetric(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none max-w-[170px] truncate"
              >
                {LEAGUE_TEAM_STATS.attacco.metrics.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Top 3 mini ranking */}
            <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
              {(
                (LEAGUE_TEAM_STATS.attacco.rankings as any)[attaccoMetric] ||
                LEAGUE_TEAM_STATS.attacco.rankings.gol
              ).map((item: any) => (
                <div
                  key={item.team.id}
                  onClick={() => onSelectTeam(item.team.id)}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-1 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-bold w-4">
                      #{item.rank}
                    </span>
                    <CrestBadge
                      name={item.team.name}
                      crestText={item.team.crestText}
                      primaryColor={item.team.primaryColor}
                      secondaryColor={item.team.secondaryColor}
                      size="xs"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {item.team.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span className="cursor-pointer hover:underline">Mostra tutte le 20 squadre</span>
              <span className="text-neutral-400">Vai a &rarr;</span>
            </div>
          </div>

          {/* Difesa Card */}
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {LEAGUE_TEAM_STATS.difesa.title}
              </span>
              <select
                value={difesaMetric}
                onChange={(e) => setDifesaMetric(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none max-w-[170px] truncate"
              >
                {LEAGUE_TEAM_STATS.difesa.metrics.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
              {(
                (LEAGUE_TEAM_STATS.difesa.rankings as any)[difesaMetric] ||
                LEAGUE_TEAM_STATS.difesa.rankings.gol_subiti
              ).map((item: any) => (
                <div
                  key={item.team.id}
                  onClick={() => onSelectTeam(item.team.id)}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-1 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-bold w-4">
                      #{item.rank}
                    </span>
                    <CrestBadge
                      name={item.team.name}
                      crestText={item.team.crestText}
                      primaryColor={item.team.primaryColor}
                      secondaryColor={item.team.secondaryColor}
                      size="xs"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {item.team.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span className="cursor-pointer hover:underline">Mostra tutte</span>
              <span className="text-neutral-400">Vai a &rarr;</span>
            </div>
          </div>

          {/* Disciplina Card */}
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {LEAGUE_TEAM_STATS.disciplina.title}
              </span>
              <select
                value={disciplinaMetric}
                onChange={(e) => setDisciplinaMetric(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none max-w-[170px] truncate"
              >
                {LEAGUE_TEAM_STATS.disciplina.metrics.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
              {(
                (LEAGUE_TEAM_STATS.disciplina.rankings as any)[disciplinaMetric] ||
                LEAGUE_TEAM_STATS.disciplina.rankings.gialli
              ).map((item: any) => (
                <div
                  key={item.team.id}
                  onClick={() => onSelectTeam(item.team.id)}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-1 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-bold w-4">
                      #{item.rank}
                    </span>
                    <CrestBadge
                      name={item.team.name}
                      crestText={item.team.crestText}
                      primaryColor={item.team.primaryColor}
                      secondaryColor={item.team.secondaryColor}
                      size="xs"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {item.team.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span className="cursor-pointer hover:underline">Mostra tutte</span>
              <span className="text-neutral-400">Vai a &rarr;</span>
            </div>
          </div>
        </div>

        {/* TAB 4: GIOCATORI LEADERBOARDS */}
        <div key="giocatori" className="flex flex-col gap-3 px-3.5 pt-3">
          {LEAGUE_PLAYER_LEADERBOARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {card.category}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Top 3</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                {card.items.map((p) => (
                  <div key={p.rank} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-neutral-400 w-4 font-bold">
                        #{p.rank}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-[10px]">
                        {p.name.slice(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-neutral-400">{p.team}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* TAB 5: ARBITRI */}
        <div key="arbitri" className="flex flex-col gap-3 px-3.5 pt-3">
          {/* Arbitri column sort switches */}
          <div className="flex items-center justify-between p-0.5 rounded-lg bg-neutral-100 dark:bg-white/5 text-xs">
            {(['gialli', 'rossi', 'falli', 'rigori', 'partite'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRefereeSort(filter)}
                className={`flex-1 py-1 rounded-md text-[11px] capitalize transition-all ${
                  refereeSort === filter
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Referees Table */}
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100/60 dark:bg-white/5 text-[11px] font-mono text-neutral-500">
              <span>Arbitro</span>
              <div className="flex items-center gap-3">
                <span className={`w-8 text-center ${refereeSort === 'partite' ? 'font-bold text-neutral-900 dark:text-white' : ''}`}>Part</span>
                <span className={`w-8 text-center ${refereeSort === 'gialli' ? 'font-bold text-amber-500' : ''}`}>Gialli</span>
                <span className={`w-8 text-center ${refereeSort === 'rossi' ? 'font-bold text-rose-500' : ''}`}>Rossi</span>
                <span className={`w-9 text-right ${refereeSort === 'falli' ? 'font-bold text-purple-400' : ''}`}>Falli/p</span>
              </div>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5">
              {sortedReferees.map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => onSelectReferee(ref.id)}
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {ref.name}
                    </span>
                    <span className="text-[10px] text-neutral-400">{ref.country}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className={`w-8 text-center ${refereeSort === 'partite' ? 'font-bold text-neutral-900 dark:text-white bg-black/5 dark:bg-white/10 rounded' : 'text-neutral-400'}`}>
                      {ref.matches}
                    </span>
                    <span className={`w-8 text-center ${refereeSort === 'gialli' ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded' : 'text-neutral-400'}`}>
                      {ref.yellowCardsTotal}
                    </span>
                    <span className={`w-8 text-center ${refereeSort === 'rossi' ? 'font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 rounded' : 'text-neutral-400'}`}>
                      {ref.redCardsTotal}
                    </span>
                    <span className={`w-9 text-right ${refereeSort === 'falli' ? 'font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 rounded' : 'text-neutral-400'}`}>
                      {ref.foulsPerMatch.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SwipeableTabs>
    </div>
  );
};
