import React, { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesData } from '../lib/api';
import { ChartContainer, CustomTooltip, chartUtils } from './ChartCard';
import { theme } from '../lib/theme';

interface LineChartProps {
  data: TimeSeriesData[];
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
    formatValue?: (value: number) => string;
  }>;
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

// Custom tick formatter for Y-axis
const formatYAxisTick = (value: number, dataKey: string): string => {
  if (dataKey === 'revenue') {
    return chartUtils.formatCurrency(value);
  }
  return chartUtils.formatNumber(value);
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
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

  // Custom dot component for data points
  const CustomDot = (props: any) => {
    const { cx, cy, stroke, fill } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={fill || stroke}
        stroke={theme.colors.gray[100]}
        strokeWidth={2}
        className="hover:r-6 transition-all duration-200"
      />
    );
  };

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
        <RechartsLineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
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
            tickFormatter={(value) => formatYAxisTick(value, lines[0]?.dataKey || '')}
            dx={-10}
          />

          {lines.map((line, index) => (
            <Line
              key={`${line.dataKey}-${index}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{
                r: 6,
                fill: line.color,
                stroke: theme.colors.gray[100],
                strokeWidth: 2,
                className: 'animate-pulse',
              }}
              name={line.name}
            />
          ))}

          <CustomTooltip
            formatValue={(value, dataKey) => {
              const line = lines.find(l => l.dataKey === dataKey);
              return line?.formatValue ? line.formatValue(value) : chartUtils.formatNumber(value);
            }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Specific component for visitors and signups trends
interface VisitorsSignupsChartProps {
  visitorsData: TimeSeriesData[];
  signupsData: TimeSeriesData[];
  isLoading?: boolean;
  error?: Error | null;
  height?: number;
}

export const VisitorsSignupsChart: React.FC<VisitorsSignupsChartProps> = ({
  visitorsData,
  signupsData,
  isLoading = false,
  error = null,
  height = 256,
}) => {
  // Combine data from both datasets
  const combinedData = useMemo(() => {
    if (!visitorsData.length || !signupsData.length) return [];

    return visitorsData.map((visitorItem, index) => ({
      ...visitorItem,
      signups: signupsData[index]?.signups || 0,
    }));
  }, [visitorsData, signupsData]);

  const lines = [
    {
      dataKey: 'visitors',
      name: 'Visitors',
      color: theme.colors.primary[500],
      formatValue: chartUtils.formatNumber,
    },
    {
      dataKey: 'signups',
      name: 'Signups',
      color: theme.colors.success[500],
      formatValue: chartUtils.formatNumber,
    },
  ];

  return (
    <LineChart
      data={combinedData}
      lines={lines}
      height={height}
      isLoading={isLoading}
      error={error}
    />
  );
};