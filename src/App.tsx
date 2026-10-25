/**
 * @license
 * ScalperLab - Complete Visual Layer
 * Mobile-first (iPhone 390px-430px container), Glass Editorial Style, Italian UI
 */

import React, { useState, useEffect } from 'react';
import { ThemeMode } from './theme/tokens';
import { ScreenId, MenuDrawer } from './components/common/MenuDrawer';
import { GlassHeader } from './components/common/GlassHeader';
import { SearchOverlay } from './components/common/SearchOverlay';
import { LaunchScreen } from './components/common/LaunchScreen';

import { HomeScreen } from './screens/HomeScreen';
import { MatchScreen } from './screens/MatchScreen';
import { TeamScreen } from './screens/TeamScreen';
import { LeagueScreen } from './screens/LeagueScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { RefereeScreen } from './screens/RefereeScreen';
import { BestPlayersScreen } from './screens/BestPlayersScreen';
import { BestMatchupsScreen } from './screens/BestMatchupsScreen';
import { GuidelinesScreen } from './screens/GuidelinesScreen';
import { CalculatorScreen } from './screens/CalculatorScreen';

import {
  MATCHES,
  TEAMS,
  LEAGUES,
  FEATURED_PLAYERS,
  REFEREE_ORSATO,
} from './data/mockData';
import { Match, Team, League, Player, Referee } from './types/football';

export default function App() {
  // Navigation stack state
  const [screen, setScreen] = useState<ScreenId>('home');
  const [screenStack, setScreenStack] = useState<ScreenId[]>(['home']);

  // Selected entities for detail screens
  const [selectedMatch, setSelectedMatch] = useState<Match>(MATCHES[0]); // defaults to live Inter vs Juventus
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS.inter);
  const [selectedLeague, setSelectedLeague] = useState<League>(LEAGUES[0]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(FEATURED_PLAYERS.lautaro);
  const [selectedReferee, setSelectedReferee] = useState<Referee>(REFEREE_ORSATO);

  // Selected date on Home
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-25');

  // Overlays
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  // Theme state: chiaro | scuro | auto
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('scalperlab_theme') as ThemeMode;
      return stored || 'scuro'; // Style 2 defaults to deep warm obsidian
    } catch {
      return 'scuro';
    }
  });

  // Apply theme to document
  useEffect(() => {
    try {
      localStorage.setItem('scalperlab_theme', theme);
    } catch (e) {
      console.error(e);
    }

    const root = document.documentElement;
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } else if (theme === 'scuro') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Push navigation
  const navigateTo = (newScreen: ScreenId) => {
    setScreenStack((prev) => [...prev, newScreen]);
    setScreen(newScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pop navigation (back button / swipe-back)
  const handleBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setScreen(prevScreen);
    } else {
      setScreen('home');
      setScreenStack(['home']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation callbacks
  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    navigateTo('match');
  };

  const handleSelectTeam = (teamId: string) => {
    const t = TEAMS[teamId] || TEAMS.inter;
    setSelectedTeam(t);
    navigateTo('team');
  };

  const handleSelectLeague = (leagueId: string) => {
    const l = LEAGUES.find((item) => item.id === leagueId) || LEAGUES[0];
    setSelectedLeague(l);
    navigateTo('league');
  };

  const handleSelectPlayer = (playerId: string) => {
    const p = FEATURED_PLAYERS[playerId] || FEATURED_PLAYERS.lautaro;
    setSelectedPlayer(p);
    navigateTo('player');
  };

  const handleSelectReferee = (_refereeId: string) => {
    setSelectedReferee(REFEREE_ORSATO);
    navigateTo('referee');
  };

  const liveMatches = MATCHES.filter((m) => m.status === 'live');

  // Swipe-back edge gesture support
  const [edgeTouchStartX, setEdgeTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0].clientX < 30 && screenStack.length > 1) {
      setEdgeTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (edgeTouchStartX !== null) {
      const diff = e.changedTouches[0].clientX - edgeTouchStartX;
      if (diff > 70) {
        handleBack();
      }
      setEdgeTouchStartX(null);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full bg-neutral-100 dark:bg-[#07090e] text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-start transition-colors selection:bg-amber-500/20 selection:text-amber-500 font-sans"
    >
      {/* Launch animation */}
      {showLaunchScreen && (
        <LaunchScreen onFinish={() => setShowLaunchScreen(false)} />
      )}

      {/* Ambient background glows for glass editorial aesthetic on desktop */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Mobile-First Device Frame Container (390px viewport width) */}
      <div className="relative w-full max-w-[430px] min-h-screen bg-[#faf9f5] dark:bg-[#0c0f17] shadow-2xl flex flex-col border-x border-black/[0.06] dark:border-white/[0.08]">
        {/* Top Sticky Header */}
        <GlassHeader
          title={
            screen === 'match'
              ? `${selectedMatch.homeTeam.shortName} vs ${selectedMatch.awayTeam.shortName}`
              : screen === 'team'
              ? selectedTeam.name
              : screen === 'league'
              ? selectedLeague.name
              : screen === 'player'
              ? selectedPlayer.name
              : screen === 'referee'
              ? selectedReferee.name
              : screen === 'calculator'
              ? 'Calcolatore Affidabilità'
              : screen === 'best-players'
              ? 'Migliori Giocatori'
              : screen === 'best-matchups'
              ? 'Migliori Matchup'
              : screen === 'guidelines'
              ? 'Linee Guida'
              : undefined
          }
          subtitle={screen === 'match' ? selectedMatch.leagueName : undefined}
          showBack={screen !== 'home'}
          onBack={handleBack}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          liveMatchCount={liveMatches.length}
          onLiveBarClick={() => {
            if (liveMatches.length > 0) handleSelectMatch(liveMatches[0]);
          }}
        />

        {/* Screen Routing */}
        <main className="flex-1 w-full flex flex-col">
          {screen === 'home' && (
            <HomeScreen
              matches={MATCHES}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectMatch={handleSelectMatch}
              onSelectLeague={handleSelectLeague}
            />
          )}

          {screen === 'match' && (
            <MatchScreen
              match={selectedMatch}
              onNavigateTeam={handleSelectTeam}
              onNavigateReferee={handleSelectReferee}
              onNavigatePlayer={handleSelectPlayer}
            />
          )}

          {screen === 'team' && (
            <TeamScreen
              team={selectedTeam}
              onSelectMatch={handleSelectMatch}
              onSelectPlayer={handleSelectPlayer}
              onSelectLeague={handleSelectLeague}
            />
          )}

          {screen === 'league' && (
            <LeagueScreen
              league={selectedLeague}
              onSelectMatch={handleSelectMatch}
              onSelectTeam={handleSelectTeam}
              onSelectReferee={handleSelectReferee}
            />
          )}

          {screen === 'player' && (
            <PlayerScreen
              player={selectedPlayer}
              onNavigateTeam={handleSelectTeam}
            />
          )}

          {screen === 'referee' && (
            <RefereeScreen referee={selectedReferee} />
          )}

          {screen === 'calculator' && <CalculatorScreen />}

          {screen === 'team-shots' && <CalculatorScreen />}

          {screen === 'best-players' && (
            <BestPlayersScreen onSelectPlayer={handleSelectPlayer} />
          )}

          {screen === 'best-matchups' && <BestMatchupsScreen />}

          {screen === 'guidelines' && <GuidelinesScreen />}
        </main>
      </div>

      {/* Global Overlays: Menu Drawer & Search Modal */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentScreen={screen}
        onNavigate={navigateTo}
        theme={theme}
        onThemeChange={setTheme}
        onReplayLaunch={() => setShowLaunchScreen(true)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTeam={handleSelectTeam}
        onSelectLeague={handleSelectLeague}
        onSelectPlayer={handleSelectPlayer}
      />
    </div>
  );
}
