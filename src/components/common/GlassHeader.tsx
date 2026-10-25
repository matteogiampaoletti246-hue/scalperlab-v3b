/**
 * @license
 * GlassHeader component for ScalperLab
 * Minimal, elegant, icon-driven, single-row contract
 */

import React from 'react';
import { Search, Menu, Radio, ArrowLeft } from 'lucide-react';

interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  liveMatchCount?: number;
  onLiveBarClick?: () => void;
  rightAction?: React.ReactNode;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onOpenMenu,
  onOpenSearch,
  liveMatchCount = 0,
  onLiveBarClick,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0c0f17]/85 border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="flex items-center justify-between px-3.5 h-14 max-w-md mx-auto">
        {/* Left Slot */}
        <div className="flex items-center gap-1.5 min-w-[44px]">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Torna indietro"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenMenu}
              aria-label="Apri menu di navigazione"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo / Title */}
          {!showBack ? (
            <div className="flex items-center gap-1.5 select-none pl-1">
              <span className="font-serif text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Scalper<span className="text-amber-600 dark:text-amber-400">Lab</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                v2
              </span>
            </div>
          ) : (
            <div className="flex flex-col truncate pl-1">
              <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {title}
              </span>
              {subtitle && (
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Slot */}
        <div className="flex items-center gap-1 min-w-[44px] justify-end">
          {rightAction}
          <button
            onClick={onOpenSearch}
            aria-label="Cerca squadre, leghe o giocatori"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Slim "Live Now" Bar (Compact) */}
      {!showBack && liveMatchCount > 0 && (
        <div
          onClick={onLiveBarClick}
          role="button"
          tabIndex={0}
          className="flex items-center justify-between px-3.5 py-1.5 bg-rose-500/10 dark:bg-rose-500/15 border-t border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs cursor-pointer hover:bg-rose-500/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span className="font-medium">
              {liveMatchCount} {liveMatchCount === 1 ? 'partita in corso' : 'partite in corso'}
            </span>
          </div>
          <span className="text-[11px] font-mono underline decoration-rose-500/40">
            Guarda live &rarr;
          </span>
        </div>
      )}
    </header>
  );
};
