/**
 * @license
 * InfoBand component for Match Page
 * Compact band displaying Stadio, Meteo (icon + temp + wind), and Arbitro
 */

import React from 'react';
import { MatchInfo } from '../../types/football';
import { MapPin, Cloud, Sun, CloudRain, Wind, UserCheck } from 'lucide-react';

interface InfoBandProps {
  info: MatchInfo;
  onRefereeClick?: () => void;
}

export const InfoBand: React.FC<InfoBandProps> = ({ info, onRefereeClick }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Soleggiato':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Pioggia':
        return <CloudRain className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md text-xs">
      {/* Stadio */}
      <div className="flex items-center gap-1.5 min-w-0 max-w-[34%]">
        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="truncate text-neutral-700 dark:text-neutral-300 font-medium text-[11px]" title={info.stadium}>
          {info.stadium.split(',')[0]}
        </span>
      </div>

      <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 shrink-0" />

      {/* Meteo */}
      <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
        {getWeatherIcon(info.weather.condition)}
        <span className="font-mono text-neutral-800 dark:text-neutral-200">
          {info.weather.temperature}°C
        </span>
        <span className="text-neutral-400 text-[10px] flex items-center gap-0.5">
          <Wind className="w-2.5 h-2.5" />
          {info.weather.windKmH}km/h
        </span>
      </div>

      <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 shrink-0" />

      {/* Arbitro */}
      <div
        onClick={onRefereeClick}
        role={onRefereeClick ? 'button' : undefined}
        tabIndex={onRefereeClick ? 0 : undefined}
        className={`flex items-center gap-1.5 min-w-0 max-w-[34%] ${
          onRefereeClick ? 'cursor-pointer hover:text-amber-500' : ''
        }`}
      >
        <UserCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="truncate text-neutral-700 dark:text-neutral-300 font-medium text-[11px]" title={info.referee.name}>
          {info.referee.name}
        </span>
      </div>
    </div>
  );
};
