import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BreakdownData } from '../lib/api';
import { ChartContainer, CustomTooltip, chartUtils } from './ChartCard';
import { theme } from '../lib/theme';

interface BarChartProps {
  data: BreakdownData[];
  dataKey?: string;
  nameKey?: string;
  color?: string;
  colors?: string[];
  formatValue?: (value: number) => string;
  height?: number;
  showGrid?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey = 'value',
  nameKey = 'label',
  color = theme.colors.primary[500],
  colors = chartUtils.getColorPalette(8),
  formatValue = chartUtils.formatPercentage,
  height = 256,
  showGrid = true,
  layout = 'vertical',
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
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  if (layout === 'horizontal') {
    return (
      <ChartContainer height={height} className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            layout="horizontal"
            margin={{
              top: 5,
              right: 30,
              left: 60,
              bottom: 5,
            }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.14)"
              />
            )}

            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'rgba(226, 232, 240, 0.75)' }}
              tickFormatter={formatValue}
              dx={-10}
            />

            <YAxis
              type="category"
              dataKey={nameKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'rgba(226, 232, 240, 0.75)' }}
              width={50}
            />

            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[0, 4, 4, 0]}
              name="Value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>

            <CustomTooltip
              formatValue={formatValue}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  // Vertical layout (default)
  return (
    <ChartContainer height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
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
              stroke="rgba(148, 163, 184, 0.14)"
            />
          )}

          <XAxis
            dataKey={nameKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgba(226, 232, 240, 0.75)' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgba(226, 232, 240, 0.75)' }}
            tickFormatter={formatValue}
            dx={-10}
          />

          <Bar
            dataKey={dataKey}
            radius={[4, 4, 0, 0]}
            name="Value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>

          <CustomTooltip
            formatValue={formatValue}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Specific component for source breakdown
interface SourceBreakdownChartProps {
  data: BreakdownData[];
  isLoading?: boolean;
  error?: Error | null;
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

export const SourceBreakdownChart: React.FC<SourceBreakdownChartProps> = ({
  data,
  isLoading = false,
  error = null,
  height = 256,
  layout = 'vertical',
}) => {
  return (
    <BarChart
      data={data}
      dataKey="value"
      nameKey="label"
      colors={chartUtils.getColorPalette(data.length)}
      formatValue={chartUtils.formatPercentage}
      height={height}
      layout={layout}
      isLoading={isLoading}
      error={error}
    />
  );
};
