/**
 * @license
 * SponsorBannerSlot component
 * Premium, non-intrusive editorial placeholder for odds or brand partner
 */

import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface SponsorBannerSlotProps {
  label?: string;
  tagline?: string;
  className?: string;
}

export const SponsorBannerSlot: React.FC<SponsorBannerSlotProps> = ({
  label = 'Partner Ufficiale Quote · BetAnalytics Pro',
  tagline = 'Quote in tempo reale con margine 2.8% e streaming dati live',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 dark:border-amber-400/20 my-2 ${className}`}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px]">
              {label}
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {tagline}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center gap-1 shrink-0">
          SPONSOR
          <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
