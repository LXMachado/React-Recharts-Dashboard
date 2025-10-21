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
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-4">
      <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

// Error state component
const KpiCardError: React.FC<{ error: Error; metric: KpiKey }> = ({ error, metric }) => (
  <div className="bg-white rounded-lg border border-red-200 p-6">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">
        {kpiConfig[metric].label}
      </span>
      <div className="h-8 w-8 bg-red-100 rounded flex items-center justify-center">
        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div className="mt-4">
      <div className="text-red-600 text-sm">Failed to load</div>
      <div className="text-red-500 text-xs mt-1">{error.message}</div>
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
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          {config.label}
        </span>
        <div
          className="h-8 w-8 rounded flex items-center justify-center"
          style={{ backgroundColor: `${config.color[100]}20` }}
        >
          <div
            className="h-4 w-4 rounded"
            style={{ backgroundColor: config.color[500] }}
          />
        </div>
      </div>

      <div className="mt-4">
        <div
          className="text-2xl font-bold"
          style={{ color: config.color[900] }}
        >
          {config.format(value)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {/* Could add trend indicator here */}
          No change
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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
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