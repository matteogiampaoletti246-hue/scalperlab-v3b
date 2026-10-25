/**
 * @license
 * TeamScreen component
 * Comprehensive team details with team-colored hero gradient, squad, standings, and stats
 */

import React, { useState } from 'react';
import { Team, Match } from '../types/football';
import { CrestBadge } from '../components/common/CrestBadge';
import { SwipeableTabs, TabItem } from '../components/common/SwipeableTabs';
import { STANDINGS_SERIE_A, MATCHES } from '../data/mockData';
import { ChevronRight } from 'lucide-react';

interface TeamScreenProps {
  team: Team;
  onSelectMatch: (match: Match) => void;
  onSelectPlayer: (playerId: string) => void;
  onSelectLeague: (leagueId: string) => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  team,
  onSelectMatch,
  onSelectPlayer,
  onSelectLeague,
}) => {
  const tabs: TabItem[] = [
    { id: 'partite', label: 'Partite' },
    { id: 'classifica', label: 'Classifica' },
    { id: 'squadra', label: 'Squadra' },
    { id: 'giocatori', label: 'Giocatori' },
    { id: 'statistiche', label: 'Statistiche' },
  ];

  const [activeTab, setActiveTab] = useState<string>('partite');

  // Standing row for this team
  const standing = STANDINGS_SERIE_A.find((s) => s.team.id === team.id) || STANDINGS_SERIE_A[0];

  // Matches for this team
  const teamMatches = MATCHES.filter(
    (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
  );

  // Mock Squad Roles
  const squadByRole = {
    portieri: [
      { id: 'sommer', name: 'Yann Sommer', number: 1, apps: 9, rating: 7.15, cleanSheets: 4 },
      { id: 'martinez_j', name: 'Josep Martínez', number: 13, apps: 0, rating: 6.5, cleanSheets: 0 },
    ],
    difensori: [
      { id: 'bastoni', name: 'Alessandro Bastoni', number: 95, apps: 9, rating: 7.45, goals: 1 },
      { id: 'pavard', name: 'Benjamin Pavard', number: 28, apps: 8, rating: 7.18, goals: 0 },
      { id: 'acerbi', name: 'Francesco Acerbi', number: 15, apps: 7, rating: 6.95, goals: 0 },
      { id: 'dimarco', name: 'Federico Dimarco', number: 32, apps: 9, rating: 7.62, goals: 2 },
      { id: 'dumfries', name: 'Denzel Dumfries', number: 2, apps: 9, rating: 7.10, goals: 2 },
    ],
    centrocampisti: [
      { id: 'barella', name: 'Nicolò Barella', number: 23, apps: 9, rating: 7.70, goals: 2, assists: 3 },
      { id: 'calhanoglu', name: 'Hakan Çalhanoğlu', number: 20, apps: 8, rating: 7.68, goals: 3, assists: 2 },
      { id: 'mkhitaryan', name: 'Henrikh Mkhitaryan', number: 22, apps: 9, rating: 7.20, goals: 1, assists: 2 },
      { id: 'frattesi', name: 'Davide Frattesi', number: 16, apps: 9, rating: 7.12, goals: 3, assists: 1 },
    ],
    attaccanti: [
      { id: 'lautaro', name: 'Lautaro Martínez', number: 10, apps: 9, rating: 7.92, goals: 9, assists: 3 },
      { id: 'thuram', name: 'Marcus Thuram', number: 9, apps: 9, rating: 7.48, goals: 5, assists: 4 },
      { id: 'taremi', name: 'Mehdi Taremi', number: 99, apps: 6, rating: 6.85, goals: 1, assists: 1 },
    ],
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Team Hero Header with team-color gradient */}
      <div
        className="relative px-4 pt-6 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}30 0%, transparent 65%, ${team.secondaryColor}25 100%)`,
        }}
      >
        <div className="flex items-center gap-4">
          <CrestBadge
            name={team.name}
            crestText={team.crestText}
            primaryColor={team.primaryColor}
            secondaryColor={team.secondaryColor}
            size="xl"
            className="shadow-lg"
          />

          <div className="flex-1 flex flex-col">
            <div
              onClick={() => onSelectLeague(team.leagueId)}
              className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Serie A</span>
              <span>&rarr;</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
              {team.name}
            </h1>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              All: <strong className="text-neutral-700 dark:text-neutral-200">{team.coach}</strong>
            </div>

            {/* Position, Points, Form */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5 text-xs">
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {standing.position}° Posto
              </span>
              <span>·</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">
                {standing.points} Punti
              </span>
              <span>·</span>
              <div className="flex items-center gap-0.5">
                {standing.form.map((f, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white ${
                      f === 'V' ? 'bg-emerald-600' : f === 'P' ? 'bg-amber-500' : 'bg-rose-600'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
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
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Partite recenti e in programma
          </span>
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5">
            {teamMatches.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMatch(m)}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 w-14 shrink-0">
                  {m.status === 'live' ? (
                    <span className="text-rose-600 font-bold font-mono animate-pulse">{m.liveMinute}'</span>
                  ) : m.status === 'finished' ? (
                    <span className="text-neutral-400 font-mono">FIN</span>
                  ) : (
                    <span className="font-mono text-neutral-600 dark:text-neutral-300">{m.kickoffTime}</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className={m.homeTeam.id === team.id ? 'font-bold' : ''}>{m.homeTeam.name}</span>
                    {m.score && <span className="font-mono font-bold">{m.score.home}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={m.awayTeam.id === team.id ? 'font-bold' : ''}>{m.awayTeam.name}</span>
                    {m.score && <span className="font-mono font-bold">{m.score.away}</span>}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 ml-3" />
              </div>
            ))}
          </div>
        </div>

        {/* TAB 2: CLASSIFICA */}
        <div key="classifica" className="flex flex-col gap-3 px-3.5 pt-3">
          <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100/60 dark:bg-white/5 text-[11px] font-mono font-medium text-neutral-500">
              <span className="w-5"># Squadra</span>
              <div className="flex items-center gap-3">
                <span className="w-6 text-center">G</span>
                <span className="w-7 text-center">DR</span>
                <span className="w-7 text-right font-bold">Pt</span>
              </div>
            </div>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {STANDINGS_SERIE_A.map((row) => (
                <div
                  key={row.team.id}
                  className={`flex items-center justify-between px-3 py-2 text-xs ${
                    row.team.id === team.id
                      ? 'bg-amber-500/15 font-semibold text-neutral-900 dark:text-neutral-50'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-neutral-400 w-5">{row.position}</span>
                    <CrestBadge
                      name={row.team.name}
                      crestText={row.team.crestText}
                      primaryColor={row.team.primaryColor}
                      secondaryColor={row.team.secondaryColor}
                      size="xs"
                    />
                    <span className="truncate">{row.team.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="w-6 text-center text-neutral-400">{row.played}</span>
                    <span className="w-7 text-center text-neutral-400">{row.goalDiff}</span>
                    <span className="w-7 text-right font-bold">{row.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TAB 3: SQUADRA */}
        <div key="squadra" className="flex flex-col gap-4 px-3.5 pt-3">
          {Object.entries(squadByRole).map(([role, players]) => (
            <div key={role} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 capitalize tracking-wider">
                {role}
              </span>
              <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5">
                {players.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPlayer(p.id)}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 font-mono text-neutral-400">{p.number}</span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-neutral-400">{p.apps} pres.</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {p.rating.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* TAB 4: GIOCATORI LEADERBOARDS */}
        <div key="giocatori" className="flex flex-col gap-3 px-3.5 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] text-neutral-400">Miglior Marcatore</span>
              <div className="font-serif text-sm font-bold mt-1">Lautaro Martínez</div>
              <div className="font-mono text-xs text-amber-500 font-semibold mt-0.5">9 gol in 9 gare</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] text-neutral-400">Miglior Assistman</span>
              <div className="font-serif text-sm font-bold mt-1">Federico Dimarco</div>
              <div className="font-mono text-xs text-blue-500 font-semibold mt-0.5">5 assist vincenti</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] text-neutral-400">Più Tiri p90</span>
              <div className="font-serif text-sm font-bold mt-1">Lautaro Martínez</div>
              <div className="font-mono text-xs text-emerald-500 font-semibold mt-0.5">3.84 tiri ogni 90'</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] text-neutral-400">Voto Medio Più Alto</span>
              <div className="font-serif text-sm font-bold mt-1">Lautaro Martínez</div>
              <div className="font-mono text-xs text-purple-400 font-semibold mt-0.5">7.92 / 10</div>
            </div>
          </div>
        </div>

        {/* TAB 5: STATISTICHE (TILES WITH LEAGUE-RANK BADGES) */}
        <div key="statistiche" className="flex flex-col gap-3 px-3.5 pt-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Rendimento Squadra nel Campionato
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Gol segnati', val: '22', rank: '1ª su 20' },
              { label: 'Expected Goals (xG)', val: '21.4', rank: '1ª su 20' },
              { label: 'Tiri totali ogni 90\'', val: '16.2', rank: '2ª su 20' },
              { label: 'Possesso palla medio', val: '61.4%', rank: '1ª su 20' },
              { label: 'Clean Sheets', val: '4', rank: '3ª su 20' },
              { label: 'Falli commessi p90', val: '10.9', rank: '17ª su 20' },
            ].map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between"
              >
                <span className="text-[11px] text-neutral-400">{st.label}</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {st.val}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                    {st.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SwipeableTabs>
    </div>
  );
};
