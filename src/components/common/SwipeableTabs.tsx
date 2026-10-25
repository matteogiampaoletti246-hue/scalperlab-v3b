/**
 * @license
 * SwipeableTabs Component
 * Compact tabs with thin animated underline and swipeable container with neighboring peek
 */

import React, { useRef, useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

interface SwipeableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  children: React.ReactNode[];
  className?: string;
}

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  children,
  className = '',
}) => {
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe drag state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const deltaX = isSwiping && touchStartX !== null && touchCurrentX !== null
    ? touchCurrentX - touchStartX
    : 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || touchStartX === null) return;
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping || touchStartX === null || touchCurrentX === null) {
      setIsSwiping(false);
      return;
    }
    const diff = touchCurrentX - touchStartX;
    const threshold = 60; // minimum swipe distance

    if (diff < -threshold && activeIndex < tabs.length - 1) {
      onChangeTab(tabs[activeIndex + 1].id);
    } else if (diff > threshold && activeIndex > 0) {
      onChangeTab(tabs[activeIndex - 1].id);
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
    setIsSwiping(false);
  };

  // Scroll active tab into view in tab header
  const tabHeaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tabHeaderRef.current?.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Compact Tab Header */}
      <div
        ref={tabHeaderRef}
        className="sticky top-14 z-20 w-full flex items-center px-2 border-b border-black/[0.06] dark:border-white/[0.08] backdrop-blur-lg bg-white/80 dark:bg-[#0c0f17]/85 overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="flex items-center min-w-full justify-start gap-1">
          {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative py-3 px-3.5 text-xs whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-neutral-950 dark:text-neutral-50 font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                    {tab.badge}
                  </span>
                )}
                {/* Thin animated underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-neutral-950 dark:bg-amber-400 rounded-full transition-all duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipeable Viewport */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full overflow-hidden relative"
      >
        <div
          className="flex transition-transform ease-out"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${deltaX}px))`,
            transitionDuration: isSwiping ? '0ms' : '280ms',
            gap: '16px', // Gap between pages visible during swipe
          }}
        >
          {children.map((child, idx) => (
            <div
              key={tabs[idx]?.id || idx}
              className="w-full shrink-0 min-w-full pb-8"
              aria-hidden={activeIndex !== idx}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
