/**
 * @license
 * LaunchScreen with animated ScalperLab logo draw-on / reveal
 */

import React, { useEffect, useState } from 'react';

interface LaunchScreenProps {
  onFinish?: () => void;
  forceShow?: boolean;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onFinish, forceShow = false }) => {
  const [phase, setPhase] = useState<'draw' | 'glow' | 'fade'>('draw');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glow'), 500);
    const t2 = setTimeout(() => setPhase('fade'), 1200);
    const t3 = setTimeout(() => onFinish?.(), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0f17] text-white transition-opacity duration-300 ${
        phase === 'fade' && !forceShow ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none animate-pulse" />

      {/* SVG Animated ScalperLab Crest & Logo */}
      <div className="relative flex flex-col items-center">
        <svg
          width="88"
          height="88"
          viewBox="0 0 100 100"
          className="mb-4 transform transition-transform duration-700 hover:scale-105"
        >
          {/* Animated Draw-On Outer Hexagon */}
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            fill="none"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeDasharray="300"
            strokeDashoffset={phase === 'draw' ? '300' : '0'}
            className="transition-all duration-700 ease-out"
          />

          {/* Inner S Letter mark */}
          <path
            d="M 62,35 C 62,26 40,24 38,36 C 36,46 64,48 62,62 C 60,74 38,72 36,65"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="180"
            strokeDashoffset={phase === 'draw' ? '180' : '0'}
            className="transition-all duration-800 ease-out delay-200"
          />

          {/* Pulsing Core Point */}
          <circle
            cx="50"
            cy="50"
            r="3"
            fill="#ffffff"
            className={phase === 'glow' ? 'animate-ping' : ''}
          />
        </svg>

        {/* Brand Name Title */}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white flex items-center">
          Scalper<span className="text-amber-500">Lab</span>
        </h1>

        {/* Subtitle tag */}
        <p className="text-xs font-mono tracking-widest text-neutral-400 mt-2 uppercase">
          Football Intelligence Platform
        </p>

        {/* Loading bar */}
        <div className="w-36 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full w-full animate-[shimmer_1.2s_infinite]" />
        </div>
      </div>
    </div>
  );
};
