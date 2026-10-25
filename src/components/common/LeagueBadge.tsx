/**
 * @license
 * LeagueBadge supporting light and dark variant styling
 */

import React from 'react';

interface LeagueBadgeProps {
  name: string;
  crestText: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const LeagueBadge: React.FC<LeagueBadgeProps> = ({
  name,
  crestText,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses =
    size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-xs' : 'w-7 h-7 text-[11px]';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      title={name}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg select-none transition-transform active:scale-95 ${sizeClasses} ${className} ${
        onClick ? 'cursor-pointer' : ''
      } bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold tracking-wider border border-black/10 dark:border-white/20 shadow-xs`}
    >
      <span>{crestText}</span>
    </div>
  );
};
