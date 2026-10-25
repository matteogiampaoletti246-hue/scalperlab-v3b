/**
 * @license
 * ScalperLab Design Tokens - Glass Editorial Theme
 * All design tokens (colors, type scale, radii, shadows, spacing, motion durations) in ONE file.
 */

export const TOKENS = {
  // Brand & Aesthetic
  name: 'ScalperLab',
  style: 'Glass editorial',
  
  // Color Palette
  colors: {
    // Dark Theme Palette (Deep warm obsidian, slate tones - not pure black)
    dark: {
      bg: '#0c0f17',           // warm deep obsidian
      surface: '#141923',      // elevated glass surface
      surfaceCard: '#1a2130',  // card container
      surfaceGlass: 'rgba(20, 25, 35, 0.72)',
      surfaceHighlight: 'rgba(255, 255, 255, 0.05)',
      borderHairline: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.12)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
    },
    // Light Theme Palette (Warm paper white, soft travertine, clean glass)
    light: {
      bg: '#faf9f5',           // warm paper ivory
      surface: '#ffffff',      // crisp clean surface
      surfaceCard: '#f4f3ee',  // light structural card
      surfaceGlass: 'rgba(255, 255, 255, 0.75)',
      surfaceHighlight: 'rgba(0, 0, 0, 0.03)',
      borderHairline: 'rgba(0, 0, 0, 0.06)',
      borderSubtle: 'rgba(0, 0, 0, 0.10)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
    },
    // Semantic Accents
    accent: {
      gold: '#d97706',         // editorial amber/gold primary
      goldLight: '#f59e0b',
      emerald: '#10b981',      // victory / high value
      rose: '#ef4444',         // live pulse / loss
      blue: '#2563eb',         // saved / UCL / info
      purple: '#8b5cf6',       // referee / special
      orange: '#f97316',       // blocked shot / Europa league
    },
    // Shot outcomes
    shotOutcomes: {
      gol: '#10b981',          // green
      parato: '#3b82f6',       // blue
      fuori: '#94a3b8',        // grey
      murato: '#f97316',       // orange
    },
    // Competition tiers
    competition: {
      champions: '#2563eb',    // blue
      europa: '#f97316',       // orange
      conference: '#10b981',   // emerald
      relegation: '#ef4444',   // red
    }
  },

  // Typography
  typography: {
    fonts: {
      display: 'Fraunces, Georgia, serif',
      sans: 'Plus Jakarta Sans, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    scale: {
      hero: 'clamp(1.75rem, 5vw, 2.25rem)', // 28px - 36px
      title: '1.25rem',                     // 20px
      subtitle: '1rem',                      // 16px
      body: '0.875rem',                      // 14px
      caption: '0.75rem',                    // 12px
      micro: '0.6875rem',                    // 11px
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },

  // Surface Radii
  radii: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.25rem', // 20px
    full: '9999px',
  },

  // Shadows
  shadows: {
    glass: '0 4px 24px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
    glassDark: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.07)',
    glowGold: '0 0 20px -5px rgba(217, 119, 6, 0.4)',
    glowLive: '0 0 14px rgba(239, 68, 68, 0.5)',
  },

  // Spacing (rem)
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
  },

  // Motion Transitions
  motion: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '240ms cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: '360ms cubic-bezier(0.16, 1, 0.3, 1)',
    pulse: '2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  // Component Rules
  rules: {
    cards: 'Single-elevation, hairline border (rgba 6-8%), backdrop blur 16px, p-3.5 to p-4, nested radius math (r_inner = r_outer - padding).',
    rows: 'Height 56-64px, full touch hitbox (min 44px), subtle hover/active scale or highlight, unboxed tabular numbers.',
    tabs: 'Compact text with thin animated bottom line (2px), no chunky pill surrounds, horizontal swipe enabled with gap preview.',
    iconButtons: 'Min 44x44px touch target, subtle circle or rounded-lg backdrop, no garish drop shadows.',
    chips: 'Clean unboxed text metadata with typographic separators (·) for static values; outlined segmented controls for interactive filters.',
    gauges: 'Refined circular or arc SVG with stroke-dasharray animation, tabular decimal display (/10), qualitative label (Alta/Media/Bassa).',
    bars: 'Two-sided symmetric comparison bars with team-accent fills, center metric title, monospace values on extremities.',
  }
} as const;

export type ThemeMode = 'chiaro' | 'scuro' | 'auto';
