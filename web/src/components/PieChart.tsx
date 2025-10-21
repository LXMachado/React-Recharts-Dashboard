import React, { useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { BreakdownData } from '../lib/api';
import { ChartContainer, CustomTooltip, ChartLegend, chartUtils } from './ChartCard';
import { theme } from '../lib/theme';

interface PieChartProps {
  data: BreakdownData[];
  colors?: string[];
  formatValue?: (value: number) => string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

// Custom label function for pie chart
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = chartUtils.getColorPalette(8),
  formatValue = chartUtils.formatPercentage,
  height = 256,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  className = '',
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }));
  }, [data, colors]);

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
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="label"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>

          <CustomTooltip
            formatValue={formatValue}
          />
        </RechartsPieChart>
      </ResponsiveContainer>

      {showLegend && (
        <ChartLegend
          payload={chartData.map((item, index) => ({
            value: item.label,
            color: item.fill,
          }))}
        />
      )}
    </ChartContainer>
  );
};

// Donut chart variant
interface DonutChartProps {
  data: BreakdownData[];
  colors?: string[];
  formatValue?: (value: number) => string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors,
  formatValue,
  height,
  innerRadius = 40,
  outerRadius = 80,
  showLegend = true,
  className,
}) => {
  return (
    <PieChart
      data={data}
      colors={colors}
      formatValue={formatValue}
      height={height}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      showLegend={showLegend}
      className={className}
    />
  );
};

// Specific component for device breakdown
interface DeviceBreakdownChartProps {
  data: BreakdownData[];
  isLoading?: boolean;
  error?: Error | null;
  height?: number;
  variant?: 'pie' | 'donut';
}

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({
  data,
  isLoading = false,
  error = null,
  height = 256,
  variant = 'donut',
}) => {
  const colors = [
    theme.colors.primary[500],   // Desktop
    theme.colors.success[500],   // Mobile
    theme.colors.warning[500],   // Tablet
  ];

  if (variant === 'donut') {
    return (
      <DonutChart
        data={data}
        colors={colors}
        formatValue={chartUtils.formatPercentage}
        height={height}
        innerRadius={40}
        outerRadius={80}
        showLegend={true}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <PieChart
      data={data}
      colors={colors}
      formatValue={chartUtils.formatPercentage}
      height={height}
      innerRadius={0}
      outerRadius={80}
      showLegend={true}
      isLoading={isLoading}
      error={error}
    />
  );
};