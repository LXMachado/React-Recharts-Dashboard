import React, { Suspense, useState } from 'react';
import { theme } from '../lib/theme';

// Loading skeleton for charts
const ChartSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

// Error boundary for chart components
interface ChartErrorProps {
  error: Error;
  title: string;
}

const ChartError: React.FC<ChartErrorProps> = ({ error, title }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-gray-500 text-sm text-center mb-2">
      Failed to load {title.toLowerCase()}
    </p>
    <p className="text-gray-400 text-xs text-center">
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
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      <div className="relative">
        {isLoading && <ChartSkeleton />}
        {error && <ChartError error={error} title={title} />}
        {!isLoading && !error && (
          <div className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded">
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
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
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
    <div className={`flex flex-wrap justify-center gap-4 mt-4 ${className}`}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">{entry.value}</span>
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
    const baseColors = [
      theme.colors.primary[500],
      theme.colors.success[500],
      theme.colors.warning[500],
      theme.colors.error[500],
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
    ];

    return baseColors.slice(0, count);
  },
};