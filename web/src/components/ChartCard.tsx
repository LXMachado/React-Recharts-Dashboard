import React from 'react';
import { theme, chartColors as themeChartColors } from '../lib/theme';

// Loading skeleton for charts
const ChartSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 w-36 rounded bg-slate-800/80" />
    <div className="h-64 rounded-2xl border border-slate-800/60 bg-slate-900/60" />
  </div>
);

// Error boundary for chart components
interface ChartErrorProps {
  error: Error;
  title: string;
}

const ChartError: React.FC<ChartErrorProps> = ({ error, title }) => (
  <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-500/40 bg-slate-900/60 text-rose-200">
    <svg className="h-12 w-12 text-rose-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-xs uppercase tracking-[0.35em] text-rose-200/80">
      {title}
    </p>
    <p className="px-6 text-center text-sm text-rose-100/80">
      {error.message}
    </p>
  </div>
);

// Main ChartCard wrapper component
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  isLoading = false,
  error = null,
  className = '',
  actions,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-[0_45px_120px_-60px_rgba(56,189,248,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: theme.gradients.card }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent" />
      <div className="pointer-events-none absolute -top-24 right-0 h-52 w-52 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="mt-2 h-px w-16 bg-gradient-to-r from-sky-500 to-transparent" />
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="relative">
        {isLoading && <ChartSkeleton />}
        {error && <ChartError error={error} title={title} />}
        {!isLoading && !error && (
          <div className="rounded-2xl bg-slate-950/20 p-3 focus-within:ring-2 focus-within:ring-sky-400/60 focus-within:ring-offset-2 focus-within:ring-offset-slate-900/40">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Chart container with responsive behavior
interface ChartContainerProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height = 256,
  className = '',
}) => {
  return (
    <div
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
      role="img"
      aria-label="Data visualization chart"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

// Custom tooltip component for charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
  formatValue?: (value: number) => string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatValue = (value) => value.toString(),
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="min-w-[160px] rounded-2xl border border-slate-800/60 bg-slate-900/90 p-3 shadow-xl shadow-slate-900/60 backdrop-blur">
        <p className="mb-2 text-sm font-medium text-slate-200">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-slate-300" style={{ color: entry.color }}>
            {`${entry.name}: ${formatValue(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Chart legend component
interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
  className?: string;
}

export const ChartLegend: React.FC<LegendProps> = ({ payload, className = '' }) => {
  if (!payload) return null;

  return (
    <div className={`mt-4 flex flex-wrap justify-center gap-4 ${className}`}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/60 px-3 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Responsive chart wrapper for mobile optimization
interface ResponsiveChartWrapperProps {
  children: React.ReactNode;
  minHeight?: number;
}

export const ResponsiveChartWrapper: React.FC<ResponsiveChartWrapperProps> = ({
  children,
  minHeight = 256,
}) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="min-h-[256px] sm:min-h-[300px] lg:min-h-[350px]">
        {children}
      </div>
    </div>
  );
};

// Chart export utilities
export const chartUtils = {
  // Format numbers for display
  formatNumber: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },

  // Format currency values
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },

  // Format percentage values
  formatPercentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },

  // Generate color palette for charts
  getColorPalette: (count: number): string[] => {
    return themeChartColors.slice(0, count);
  },
};
