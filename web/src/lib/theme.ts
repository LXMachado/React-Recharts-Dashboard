// Theme tokens and global styles for Mini Analytics Dashboard

export const theme = {
  colors: {
    primary: {
      50: '#1e3a8a',
      100: '#1d4ed8',
      500: '#2563eb',
      600: '#1e40af',
      900: '#0b1f44',
    },
    success: {
      50: '#0f2d2a',
      100: '#065f46',
      500: '#10b981',
      600: '#059669',
      900: '#064e3b',
    },
    warning: {
      50: '#2d1f09',
      100: '#7c3e07',
      200: '#f59e0b',
      500: '#fbbf24',
      600: '#f59e0b',
      700: '#d97706',
      900: '#92400e',
    },
    error: {
      50: '#2d0f10',
      100: '#7f1d1d',
      200: '#b91c1c',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    gray: {
      50: '#f8fafc',
      100: '#e2e8f0',
      200: '#cbd5f5',
      300: '#94a3b8',
      400: '#64748b',
      500: '#475569',
      600: '#334155',
      700: '#1e293b',
      800: '#141c2f',
      900: '#0a1220',
    },
    accent: {
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
    },
  },
  surface: {
    base: '#050a1a',
    muted: '#070f24',
    elevated: '#0d1b33',
    highlight: '#132347',
    border: 'rgba(148, 163, 184, 0.18)',
    glow: 'rgba(14, 165, 233, 0.35)',
  },
  gradients: {
    midnight: 'linear-gradient(135deg, rgba(8,18,41,1) 0%, rgba(5,10,26,1) 40%, rgba(9,20,48,1) 100%)',
    card: 'linear-gradient(135deg, rgba(17,31,55,0.85) 0%, rgba(11,22,44,0.6) 100%)',
    accent: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Utility function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number) => {
  // This is a simple implementation - in production you might want to use a library
  const opacityMap: Record<string, string> = {
    '0.1': '1a',
    '0.2': '33',
    '0.3': '4d',
    '0.4': '66',
    '0.5': '80',
    '0.6': '99',
    '0.7': 'b3',
    '0.8': 'cc',
    '0.9': 'e6',
  };

  return `${color}${opacityMap[opacity.toString()] || 'ff'}`;
};

// Responsive design utilities
export const mediaQueries = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
};

// KPI card color schemes
export const kpiColors = {
  visitors: theme.colors.primary,
  signups: theme.colors.success,
  conversionRate: theme.colors.warning,
  revenue: theme.colors.accent,
  avgLatencyMs: theme.colors.warning,
  errorRate: theme.colors.error,
};

// Chart color palette
export const chartColors = [
  theme.colors.primary[500],
  theme.colors.accent[500],
  theme.colors.success[500],
  '#a855f7', // purple
  '#22d3ee', // cyan
  theme.colors.warning[500],
  '#f97316', // orange
  '#f43f5e', // rose
];
