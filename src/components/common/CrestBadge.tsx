/**
 * @license
 * CrestBadge component with initials fallback and soft glass ring
 */

import React from 'react';

interface CrestBadgeProps {
  name: string;
  shortName?: string;
  crestText: string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm font-semibold',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-bold',
};

export const CrestBadge: React.FC<CrestBadgeProps> = ({
  name,
  crestText,
  primaryColor = '#1e293b',
  secondaryColor = '#334155',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = SIZE_MAP[size];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={name}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl transition-transform active:scale-95 select-none ${sizeClasses} ${className} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        boxShadow: `0 3px 12px -2px ${primaryColor}40, inset 0 1px 1px rgba(255, 255, 255, 0.25)`,
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      <span className="text-white drop-shadow-sm font-serif tracking-wider">
        {crestText.slice(0, 3)}
      </span>
    </div>
  );
};
