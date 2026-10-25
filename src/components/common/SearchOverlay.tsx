/**
 * @license
 * SearchOverlay component
 * Clean, fast search for teams, leagues, and players
 */

import React, { useState } from 'react';
import { Search, X, Trophy, Users, Shield } from 'lucide-react';
import { TEAMS, LEAGUES, FEATURED_PLAYERS } from '../../data/mockData';
import { CrestBadge } from './CrestBadge';
import { LeagueBadge } from './LeagueBadge';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: string) => void;
  onSelectLeague: (leagueId: string) => void;
  onSelectPlayer: (playerId: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onSelectLeague,
  onSelectPlayer,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();

  const matchedLeagues = LEAGUES.filter(
    (l) => l.name.toLowerCase().includes(normalized) || l.country.toLowerCase().includes(normalized)
  );

  const matchedTeams = Object.values(TEAMS).filter(
    (t) => t.name.toLowerCase().includes(normalized) || t.shortName.toLowerCase().includes(normalized)
  );

  const matchedPlayers = Object.values(FEATURED_PLAYERS).filter(
    (p) => p.name.toLowerCase().includes(normalized) || p.nationality.toLowerCase().includes(normalized)
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-white dark:bg-[#0c0f17] shadow-2xl overflow-hidden border-x border-black/10 dark:border-white/10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-black/[0.08] dark:border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca squadra, campionato o calciatore..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Chiudi ricerca"
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Leagues */}
          {matchedLeagues.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>Campionati</span>
              </div>
              <div className="space-y-1">
                {matchedLeagues.map((league) => (
                  <div
                    key={league.id}
                    onClick={() => {
                      onSelectLeague(league.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LeagueBadge name={league.name} crestText={league.crestText} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {league.name}
                        </div>
                        <div className="text-[11px] text-neutral-400">{league.country}</div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">&rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {matchedTeams.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Squadre</span>
              </div>
              <div className="space-y-1">
                {matchedTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CrestBadge
                        name={team.name}
                        crestText={team.crestText}
                        primaryColor={team.primaryColor}
                        secondaryColor={team.secondaryColor}
                        size="sm"
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {team.name}
                        </div>
                        <div className="text-[11px] text-neutral-400">{team.stadium}</div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">&rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          {matchedPlayers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Giocatori</span>
              </div>
              <div className="space-y-1">
                {matchedPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      onSelectPlayer(player.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                        {player.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {player.name}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {player.role} · #{player.number}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">&rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedLeagues.length === 0 && matchedTeams.length === 0 && matchedPlayers.length === 0 && (
            <div className="text-center py-12 text-sm text-neutral-400">
              Nessun risultato trovato per "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
