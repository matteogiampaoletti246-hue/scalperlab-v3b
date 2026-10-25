/**
 * @license
 * DateStrip component with scrollable days and calendar button
 */

import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export interface DayOption {
  id: string; // e.g. "2026-10-24"
  label: string; // "Ieri", "Oggi", "Domani", or "Lun 26"
  subLabel?: string; // "25 Ott"
  isToday?: boolean;
}

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (id: string) => void;
  onOpenCalendar?: () => void;
}

export const DAYS_LIST: DayOption[] = [
  { id: '2026-10-23', label: 'Ven 23', subLabel: '23 Ott' },
  { id: '2026-10-24', label: 'Ieri', subLabel: '24 Ott' },
  { id: '2026-10-25', label: 'Oggi', subLabel: '25 Ott', isToday: true },
  { id: '2026-10-26', label: 'Domani', subLabel: '26 Ott' },
  { id: '2026-10-27', label: 'Mar 27', subLabel: '27 Ott' },
  { id: '2026-10-28', label: 'Mer 28', subLabel: '28 Ott' },
  { id: '2026-10-29', label: 'Gio 29', subLabel: '29 Ott' },
];

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  onOpenCalendar,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full border-b border-black/[0.05] dark:border-white/[0.06] bg-neutral-50/70 dark:bg-[#0e121b]/60 backdrop-blur-md">
      <div className="flex items-center px-2 py-1.5 max-w-md mx-auto gap-1">
        {/* Scrollable date strip */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {DAYS_LIST.map((day) => {
            const isSelected = selectedDate === day.id;
            return (
              <button
                key={day.id}
                onClick={() => onSelectDate(day.id)}
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all text-xs min-w-[58px] ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="leading-tight">{day.label}</span>
                <span
                  className={`text-[10px] font-mono leading-tight ${
                    isSelected ? 'opacity-85' : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {day.subLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Calendar button */}
        <button
          onClick={onOpenCalendar}
          aria-label="Seleziona data dal calendario"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform shrink-0"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
