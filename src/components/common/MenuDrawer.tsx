/**
 * @license
 * MenuDrawer component
 * Full mobile navigation drawer with theme selector (Chiaro / Scuro / Auto)
 */

import React from 'react';
import {
  X,
  Calendar,
  Calculator,
  Target,
  Users,
  GitCompare,
  BookOpen,
  Sun,
  Moon,
  Monitor,
  Flame,
} from 'lucide-react';
import { ThemeMode } from '../../theme/tokens';

export type ScreenId =
  | 'home'
  | 'calculator'
  | 'team-shots'
  | 'best-players'
  | 'best-matchups'
  | 'guidelines'
  | 'match'
  | 'team'
  | 'league'
  | 'player'
  | 'referee';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onReplayLaunch: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  theme,
  onThemeChange,
  onReplayLaunch,
}) => {
  if (!isOpen) return null;

  const NAV_ITEMS = [
    { id: 'home' as ScreenId, label: 'Partite in programma', icon: Calendar },
    { id: 'calculator' as ScreenId, label: 'Calcolatore di Affidabilità', icon: Calculator, badge: 'PRO' },
    { id: 'team-shots' as ScreenId, label: 'Tiri Squadre', icon: Target },
    { id: 'best-players' as ScreenId, label: 'Migliori Giocatori', icon: Users },
    { id: 'best-matchups' as ScreenId, label: 'Migliori Matchup', icon: GitCompare },
    { id: 'guidelines' as ScreenId, label: 'Linee Guida e Modello', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85%] h-full bg-white dark:bg-[#0c0f17] border-r border-black/10 dark:border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
        {/* Top Brand Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Scalper<span className="text-amber-500">Lab</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                Intelligence
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Chiudi menu"
              className="p-1.5 rounded-xl text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Section: Theme Selector & Launch animation trigger */}
        <div className="p-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4">
          {/* Replay Logo Animation */}
          <button
            onClick={() => {
              onClose();
              onReplayLaunch();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Riproduci animazione logo</span>
          </button>

          {/* Theme Switcher: Chiaro / Scuro / Auto */}
          <div>
            <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              Tema interfaccia
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs">
              <button
                onClick={() => onThemeChange('chiaro')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  theme === 'chiaro'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Chiaro</span>
              </button>
              <button
                onClick={() => onThemeChange('scuro')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  theme === 'scuro'
                    ? 'bg-[#1a2130] text-white shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-white dark:text-neutral-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Scuro</span>
              </button>
              <button
                onClick={() => onThemeChange('auto')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  theme === 'auto'
                    ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
