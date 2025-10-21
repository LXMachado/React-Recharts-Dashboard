import React, { useMemo } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesData } from '../lib/api';
import { ChartContainer, CustomTooltip, chartUtils } from './ChartCard';
import { theme } from '../lib/theme';

interface AreaChartProps {
  data: TimeSeriesData[];
  dataKey: string;
  name: string;
  color: string;
  formatValue?: (value: number) => string;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Custom gradient definition for area fill
const AreaGradient = ({ id, color }: { id: string; color: string }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
      <stop offset="95%" stopColor={color} stopOpacity={0.05} />
    </linearGradient>
  </defs>
);

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  name,
  color,
  formatValue = chartUtils.formatCurrency,
  height = 256,
  showGrid = true,
  className = '',
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayDate: formatDate(item.timestamp),
    }));
  }, [data]);

  // Generate unique gradient ID
  const gradientId = `areaGradient-${dataKey}`;

  if (!data || data.length === 0) {
    return (
      <ChartContainer height={height} className={className}>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <AreaGradient id={gradientId} color={color} />

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.gray[200]}
              opacity={0.5}
            />
          )}

          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.colors.gray[600] }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.colors.gray[600] }}
            tickFormatter={(value) => formatValue(value)}
            dx={-10}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            name={name}
            activeDot={{
              r: 6,
              fill: color,
              stroke: theme.colors.gray[100],
              strokeWidth: 2,
              className: 'animate-pulse',
            }}
          />

          <CustomTooltip
            formatValue={formatValue}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Specific component for revenue tracking
interface RevenueChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
  error?: Error | null;
  height?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  isLoading = false,
  error = null,
  height = 256,
}) => {
  return (
    <AreaChart
      data={data}
      dataKey="revenue"
      name="Revenue"
      color={theme.colors.success[500]}
      formatValue={chartUtils.formatCurrency}
      height={height}
      isLoading={isLoading}
      error={error}
    />
  );
};