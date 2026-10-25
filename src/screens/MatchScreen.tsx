/**
 * @license
 * MatchScreen component
 * Comprehensive visual layer for both Pre-Match and Live / Finished football matches
 */

import React, { useState } from 'react';
import { Match, LineupPlayer, StandingsRow } from '../types/football';
import { CrestBadge } from '../components/common/CrestBadge';
import { SwipeableTabs, TabItem } from '../components/common/SwipeableTabs';
import { ComparisonBar } from '../components/common/ComparisonBar';
import { PitchField } from '../components/common/PitchField';
import { ShotMapPitch } from '../components/common/ShotMapPitch';
import { MomentumChart } from '../components/common/MomentumChart';
import { ReliabilityGauge } from '../components/common/ReliabilityGauge';
import { InfoBand } from '../components/common/InfoBand';
import { SponsorBannerSlot } from '../components/common/SponsorBannerSlot';
import { STANDINGS_SERIE_A } from '../data/mockData';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

interface MatchScreenProps {
  match: Match;
  onNavigateTeam: (teamId: string) => void;
  onNavigateReferee: (refereeId: string) => void;
  onNavigatePlayer: (playerId: string) => void;
}

export const MatchScreen: React.FC<MatchScreenProps> = ({
  match,
  onNavigateTeam,
  onNavigateReferee,
  onNavigatePlayer,
}) => {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isPreMatch = match.status === 'pre-match';

  // Tabs setup
  const preMatchTabs: TabItem[] = [
    { id: 'panoramica', label: 'Panoramica' },
    { id: 'statistiche', label: 'Statistiche' },
    { id: 'formazioni', label: 'Formazioni' },
    { id: 'classifica', label: 'Classifica' },
    { id: 'affidabilita', label: 'Affidabilità', badge: `${match.reliability.score}/10` },
  ];

  const liveTabs: TabItem[] = [
    { id: 'riepilogo', label: 'Riepilogo' },
    { id: 'statistiche', label: 'Statistiche' },
    { id: 'formazioni', label: 'Formazioni' },
    { id: 'mappa-tiri', label: 'Mappa tiri', badge: match.shots.length },
    { id: 'classifica', label: 'Classifica' },
  ];

  const tabs = isPreMatch ? preMatchTabs : liveTabs;
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  // Form dot renderer (V = green, P = amber, S = red)
  const renderFormDots = (form: ('V' | 'P' | 'S')[]) => (
    <div className="flex items-center gap-1">
      {form.map((res, i) => (
        <span
          key={i}
          className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
            res === 'V'
              ? 'bg-emerald-600'
              : res === 'P'
              ? 'bg-amber-500'
              : 'bg-rose-600'
          }`}
        >
          {res}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Match Hero Header with Team Colors Soft Gradient */}
      <div
        className="relative px-4 pt-5 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${match.homeTeam.primaryColor}22 0%, transparent 50%, ${match.awayTeam.primaryColor}22 100%)`,
        }}
      >
        {/* League and Round */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-medium">
          <span>{match.leagueName}</span>
          <span className="font-mono text-[11px]">{match.round}</span>
        </div>

        {/* Teams and Score / Kickoff */}
        <div className="flex items-center justify-between gap-3">
          {/* Home Team */}
          <div
            onClick={() => onNavigateTeam(match.homeTeam.id)}
            role="button"
            tabIndex={0}
            className="flex-1 flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-transform"
          >
            <CrestBadge
              name={match.homeTeam.name}
              crestText={match.homeTeam.crestText}
              primaryColor={match.homeTeam.primaryColor}
              secondaryColor={match.homeTeam.secondaryColor}
              size="lg"
              className="shadow-md"
            />
            <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-50 mt-2 line-clamp-1">
              {match.homeTeam.name}
            </span>
            <div className="mt-1">{renderFormDots(match.homeForm)}</div>
          </div>

          {/* Center Status / Score */}
          <div className="flex flex-col items-center justify-center px-2 shrink-0">
            {isLive ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  <span>{match.liveMinute}'</span>
                </div>
                <div className="font-mono text-3xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
                  {match.score?.home} - {match.score?.away}
                </div>
                <span className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  1°T: {match.score?.halfTimeHome}-{match.score?.halfTimeAway}
                </span>
              </div>
            ) : isFinished ? (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                  FINALE
                </span>
                <div className="font-mono text-3xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
                  {match.score?.home} - {match.score?.away}
                </div>
                <span className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  1°T: {match.score?.halfTimeHome}-{match.score?.halfTimeAway}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="px-3 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-xs font-mono text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {match.kickoffTime}
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {match.date}
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div
            onClick={() => onNavigateTeam(match.awayTeam.id)}
            role="button"
            tabIndex={0}
            className="flex-1 flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-transform"
          >
            <CrestBadge
              name={match.awayTeam.name}
              crestText={match.awayTeam.crestText}
              primaryColor={match.awayTeam.primaryColor}
              secondaryColor={match.awayTeam.secondaryColor}
              size="lg"
              className="shadow-md"
            />
            <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-50 mt-2 line-clamp-1">
              {match.awayTeam.name}
            </span>
            <div className="mt-1">{renderFormDots(match.awayForm)}</div>
          </div>
        </div>
      </div>

      {/* Swipeable Tabs Navigation */}
      <SwipeableTabs
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        className="max-w-md mx-auto w-full"
      >
        {isPreMatch ? [
          /* TAB 1: PANORAMICA (PRE-MATCH) */
          <div key="panoramica" className="flex flex-col gap-4 px-3.5 pt-3">
            {/* Compact Info Band */}
            <InfoBand
              info={match.info}
              onRefereeClick={() => onNavigateReferee(match.info.referee.id)}
            />

            {/* "Numeri da tenere d'occhio" highlight cards */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Numeri da tenere d'occhio
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {match.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {h.label}
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50">
                        {h.value}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {h.rankBadge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsor / Odds Banner Placeholder */}
            <SponsorBannerSlot />

            {/* "Giocatori migliori" two-sided comparison rows */}
            {match.keyPlayerComparison.length > 0 && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  Giocatori migliori a confronto
                </span>
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {match.keyPlayerComparison.map((comp, idx) => (
                    <div key={idx} className="py-2">
                      <ComparisonBar
                        label={comp.metric}
                        homeValue={comp.homePlayer.value}
                        awayValue={comp.awayPlayer.value}
                        homeDisplay={comp.homePlayer.formattedValue}
                        awayDisplay={comp.awayPlayer.formattedValue}
                        homeColor={match.homeTeam.primaryColor}
                        awayColor={match.awayTeam.primaryColor}
                        sublabel={`${comp.homePlayer.name} vs ${comp.awayPlayer.name}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>,

          /* TAB 2: STATISTICHE (PRE-MATCH) */
          <div key="statistiche" className="flex flex-col gap-4 px-3.5 pt-3">
            {/* Attesi in partita */}
            <div className="flex flex-col p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5 mb-2">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Attesi in partita (Modello Poisson)
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Pace Normalizzato</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {match.preMatchExpectedStats.map((stat, i) => (
                  <ComparisonBar
                    key={i}
                    label={stat.label}
                    homeValue={stat.home}
                    awayValue={stat.away}
                    homeColor={match.homeTeam.primaryColor}
                    awayColor={match.awayTeam.primaryColor}
                  />
                ))}
              </div>
            </div>

            {/* Medie di stagione */}
            <div className="flex flex-col p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5 mb-2">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Medie di stagione
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Ultime 8 gare</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {match.preMatchSeasonAverages.map((stat, i) => (
                  <ComparisonBar
                    key={i}
                    label={stat.label}
                    homeValue={stat.home}
                    awayValue={stat.away}
                    homeColor={match.homeTeam.primaryColor}
                    awayColor={match.awayTeam.primaryColor}
                  />
                ))}
              </div>
            </div>
          </div>,

          /* TAB 3: FORMAZIONI (PRE-MATCH) */
          <div key="formazioni" className="flex flex-col gap-4 px-3.5 pt-3">
            <PitchField
              formation={match.homeFormation}
              teamName={match.homeTeam.name}
              teamColor={match.homeTeam.primaryColor}
              onSelectPlayer={(p) => onNavigatePlayer(p.id)}
            />
            <div className="pt-2">
              <PitchField
                formation={match.awayFormation}
                teamName={match.awayTeam.name}
                teamColor={match.awayTeam.primaryColor}
                onSelectPlayer={(p) => onNavigatePlayer(p.id)}
              />
            </div>
          </div>,

          /* TAB 4: CLASSIFICA (PRE-MATCH) */
          <div key="classifica" className="flex flex-col gap-3 px-3.5 pt-3">
            <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5">
              <div className="flex items-center justify-between px-3 py-2 bg-neutral-100/60 dark:bg-white/5 text-[11px] font-mono font-medium text-neutral-500">
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
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {STANDINGS_SERIE_A.map((row) => {
                  const isHome = row.team.id === match.homeTeam.id;
                  const isAway = row.team.id === match.awayTeam.id;
                  const isHighlighted = isHome || isAway;

                  return (
                    <div
                      key={row.team.id}
                      onClick={() => onNavigateTeam(row.team.id)}
                      className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold text-neutral-900 dark:text-neutral-50'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-neutral-400 w-5">{row.position}</span>
                        <CrestBadge
                          name={row.team.name}
                          crestText={row.team.crestText}
                          primaryColor={row.team.primaryColor}
                          secondaryColor={row.team.secondaryColor}
                          size="xs"
                        />
                        <span className="truncate">{row.team.name}</span>
                        {isHighlighted && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500 text-white font-bold">
                            {isHome ? 'CASA' : 'OSPITE'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="w-6 text-center text-neutral-400">{row.played}</span>
                        <span className="w-7 text-center text-neutral-400">
                          {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                        </span>
                        <span className="w-7 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {row.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,

          /* TAB 5: AFFIDABILITÀ (PRE-MATCH) */
          <div key="affidabilita" className="flex flex-col gap-4 px-3.5 pt-3">
            {/* Reliability Gauge Card */}
            <div className="p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Indice di Affidabilità ScalperLab
              </span>
              <ReliabilityGauge score={match.reliability.score} size="lg" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-3 max-w-xs">
                Calcolato con distribuzione di Poisson su dati ponderati (ultime 5 gare al 60% e media stagione al 40%).
              </p>
            </div>

            {/* Stake Box & Recommended Market */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  Giocata Consigliata
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                  EV +{match.reliability.evPercent}%
                </span>
              </div>

              <div className="font-serif text-base font-bold text-neutral-950 dark:text-white">
                {match.reliability.marketName}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-500/20 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400">Quota Bookmaker</div>
                  <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    @{match.reliability.bookmakerOdd.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">Quota Equa</div>
                  <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    @{match.reliability.fairOdd.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">Stake Kelly</div>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {match.reliability.recommendedStakeUnits} Unità
                  </div>
                </div>
              </div>
            </div>
          </div>
        ] : [
          /* TAB 1: RIEPILOGO (LIVE / FINISHED) */
          <div key="riepilogo" className="flex flex-col gap-4 px-3.5 pt-3">
            {/* Info Band */}
            <InfoBand
              info={match.info}
              onRefereeClick={() => onNavigateReferee(match.info.referee.id)}
            />

            {/* Attacking Momentum Chart */}
            <MomentumChart
              momentum={match.momentum}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />

            {/* Timeline of events */}
            <div className="flex flex-col p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                Cronologia della Partita
              </span>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200 dark:before:bg-neutral-800">
                {match.timeline.map((evt) => (
                  <div key={evt.id} className="relative flex flex-col text-xs">
                    {/* Minute Circle Marker */}
                    <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950 font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {evt.minute}'
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                      <span>{evt.primaryPlayer}</span>
                      {evt.type === 'goal' && <span className="text-emerald-500 font-bold">⚽ GOL!</span>}
                      {evt.type === 'yellow_card' && <span className="text-amber-500 font-bold">🟨 Cartellino Giallo</span>}
                      {evt.type === 'var' && <span className="text-purple-400 font-bold">📺 VAR Check</span>}
                      {evt.type === 'sub' && <span className="text-blue-500 font-bold">🔄 Sostituzione</span>}
                    </div>
                    {evt.description && (
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {evt.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsor Slot */}
            <SponsorBannerSlot />
          </div>,

          /* TAB 2: STATISTICHE (LIVE / FINISHED) */
          <div key="statistiche" className="flex flex-col gap-3 px-3.5 pt-3">
            <div className="flex flex-col p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Statistiche della Partita
              </span>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {(match.liveStats || []).map((stat, i) => (
                  <ComparisonBar
                    key={i}
                    label={stat.label}
                    homeValue={stat.home}
                    awayValue={stat.away}
                    homeDisplay={stat.homeDisplay}
                    awayDisplay={stat.awayDisplay}
                    homeColor={match.homeTeam.primaryColor}
                    awayColor={match.awayTeam.primaryColor}
                  />
                ))}
              </div>
            </div>
          </div>,

          /* TAB 3: FORMAZIONI (LIVE / FINISHED) */
          <div key="formazioni" className="flex flex-col gap-4 px-3.5 pt-3">
            <PitchField
              formation={match.homeFormation}
              teamName={match.homeTeam.name}
              teamColor={match.homeTeam.primaryColor}
              isLive={isLive}
              onSelectPlayer={(p) => onNavigatePlayer(p.id)}
            />
            <div className="pt-2">
              <PitchField
                formation={match.awayFormation}
                teamName={match.awayTeam.name}
                teamColor={match.awayTeam.primaryColor}
                isLive={isLive}
                onSelectPlayer={(p) => onNavigatePlayer(p.id)}
              />
            </div>
          </div>,

          /* TAB 4: MAPPA TIRI (LIVE / FINISHED) */
          <div key="mappa-tiri" className="flex flex-col gap-3 px-3.5 pt-3">
            <ShotMapPitch
              shots={match.shots}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </div>,

          /* TAB 5: CLASSIFICA (LIVE / FINISHED) */
          <div key="classifica" className="flex flex-col gap-3 px-3.5 pt-3">
            <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/5">
              <div className="flex items-center justify-between px-3 py-2 bg-neutral-100/60 dark:bg-white/5 text-[11px] font-mono font-medium text-neutral-500">
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
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {STANDINGS_SERIE_A.map((row) => {
                  const isHome = row.team.id === match.homeTeam.id;
                  const isAway = row.team.id === match.awayTeam.id;
                  const isHighlighted = isHome || isAway;

                  return (
                    <div
                      key={row.team.id}
                      onClick={() => onNavigateTeam(row.team.id)}
                      className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold text-neutral-900 dark:text-neutral-50'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
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
                        <span className="w-7 text-center text-neutral-400">
                          {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                        </span>
                        <span className="w-7 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {row.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
        ]}
      </SwipeableTabs>
    </div>
  );
};
