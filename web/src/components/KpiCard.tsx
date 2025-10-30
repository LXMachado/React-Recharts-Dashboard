import React from 'react';
import { KPI } from '../lib/api';
import { theme, kpiColors } from '../lib/theme';

// Individual KPI metric configuration
const kpiConfig = {
  visitors: {
    label: 'Visitors',
    format: (value: number) => value.toLocaleString(),
    suffix: '',
    color: kpiColors.visitors,
  },
  signups: {
    label: 'Signups',
    format: (value: number) => value.toLocaleString(),
    suffix: '',
    color: kpiColors.signups,
  },
  conversionRate: {
    label: 'Conversion Rate',
    format: (value: number) => `${value}%`,
    suffix: '',
    color: kpiColors.conversionRate,
  },
  revenue: {
    label: 'Revenue',
    format: (value: number) => `$${value.toLocaleString()}`,
    suffix: '',
    color: kpiColors.revenue,
  },
  avgLatencyMs: {
    label: 'Avg Latency',
    format: (value: number) => `${value}ms`,
    suffix: '',
    color: kpiColors.avgLatencyMs,
  },
  errorRate: {
    label: 'Error Rate',
    format: (value: number) => `${value}%`,
    suffix: '',
    color: kpiColors.errorRate,
  },
} as const;

type KpiKey = keyof KPI;

interface KpiCardProps {
  metric: KpiKey;
  value: number;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

// Skeleton loader component
const KpiCardSkeleton: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-transparent opacity-80" />
    <div className="relative space-y-4 animate-pulse">
      <div className="h-4 w-24 rounded bg-slate-800/80" />
      <div className="h-8 w-28 rounded bg-slate-800/80" />
      <div className="h-3 w-16 rounded bg-slate-800/70" />
    </div>
  </div>
);

// Error state component
const KpiCardError: React.FC<{ error: Error; metric: KpiKey }> = ({ error, metric }) => (
  <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-slate-900/70 p-6">
    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent" />
    <div className="relative flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
        {kpiConfig[metric].label}
      </span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div className="relative z-10 mt-6 space-y-2">
      <div className="text-sm font-semibold text-rose-200">Unable to load metric</div>
      <div className="text-xs text-rose-300/80">{error.message}</div>
    </div>
  </div>
);

// Main KPI Card component
export const KpiCard: React.FC<KpiCardProps> = ({
  metric,
  value,
  isLoading = false,
  error = null,
  className = '',
}) => {
  const config = kpiConfig[metric];

  if (isLoading) {
    return <KpiCardSkeleton />;
  }

  if (error) {
    return <KpiCardError error={error} metric={metric} />;
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-[0_42px_120px_-45px_rgba(56,189,248,0.45)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${config.color[500]}33 0%, rgba(15,23,42,0) 60%)`,
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          {config.label}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 shadow-inner shadow-slate-900/40">
          <div
            className="h-4 w-4 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.45)]"
            style={{ background: `linear-gradient(135deg, ${config.color[500]}, ${config.color[600] || config.color[500]})` }}
          />
        </div>
      </div>

      <div className="relative mt-6 space-y-2">
        <div
          className="text-3xl font-semibold tracking-tight text-white"
          style={{
            textShadow: `0 0 30px ${config.color[500]}33`,
          }}
        >
          {config.format(value)}
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
          {/* Placeholder trend label */}
          vs last period
        </div>
      </div>
    </div>
  );
};

// Grid layout component for all KPI cards
interface KpiGridProps {
  kpis: KPI | null;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  kpis,
  isLoading = false,
  error = null,
  className = '',
}) => {
  const metrics: KpiKey[] = ['visitors', 'signups', 'conversionRate', 'revenue', 'avgLatencyMs', 'errorRate'];

  return (
    <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ${className}`}>
      {metrics.map((metric) => (
        <KpiCard
          key={metric}
          metric={metric}
          value={kpis?.[metric] ?? 0}
          isLoading={isLoading}
          error={error}
        />
      ))}
    </div>
  );
};
