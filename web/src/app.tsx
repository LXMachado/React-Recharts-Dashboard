import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { KpiGrid } from './components/KpiCard';
import { VisitorsSignupsChart } from './components/LineChart';
import { RevenueChart } from './components/AreaChart';
import { SourceBreakdownChart } from './components/BarChart';
import { DeviceBreakdownChart } from './components/PieChart';
import { EventsTable } from './components/EventsTable';
import { ChartCard } from './components/ChartCard';
import { useDashboardData } from './hooks/useMetrics';
import { theme } from './lib/theme';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Range selector component
const RangeSelector: React.FC<{
  selectedRange: string;
  onRangeChange: (range: string) => void;
}> = ({ selectedRange, onRangeChange }) => {
  const ranges = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Period:</span>
      <div className="flex rounded-lg border border-gray-300 p-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              selectedRange === range.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Header component
const Header: React.FC = () => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <RangeSelector selectedRange="7d" onRangeChange={() => {}} />
      </div>
    </div>
  </header>
);

// Main dashboard content
const Dashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('7d');
  const {
    kpis,
    visitorsTimeSeries,
    signupsTimeSeries,
    revenueTimeSeries,
    sourceBreakdown,
    deviceBreakdown,
    events,
    isLoading,
    error,
  } = useDashboardData(selectedRange);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-8">
        {/* KPI Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
            <RangeSelector
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </div>

          <KpiGrid
            kpis={kpis.data || null}
            isLoading={isLoading}
            error={error as Error | null}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title="Visitors & Signups"
            isLoading={visitorsTimeSeries.isLoading || signupsTimeSeries.isLoading}
            error={(visitorsTimeSeries.error || signupsTimeSeries.error) as Error | null}
          >
            <VisitorsSignupsChart
              visitorsData={visitorsTimeSeries.data || []}
              signupsData={signupsTimeSeries.data || []}
              height={256}
            />
          </ChartCard>

          <ChartCard
            title="Revenue"
            isLoading={revenueTimeSeries.isLoading}
            error={revenueTimeSeries.error as Error | null}
          >
            <RevenueChart
              data={revenueTimeSeries.data || []}
              height={256}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title="Traffic Sources"
            isLoading={sourceBreakdown.isLoading}
            error={sourceBreakdown.error as Error | null}
          >
            <SourceBreakdownChart
              data={sourceBreakdown.data || []}
              height={256}
              layout="vertical"
            />
          </ChartCard>

          <ChartCard
            title="Device Breakdown"
            isLoading={deviceBreakdown.isLoading}
            error={deviceBreakdown.error as Error | null}
          >
            <DeviceBreakdownChart
              data={deviceBreakdown.data || []}
              height={256}
              variant="donut"
            />
          </ChartCard>
        </div>

        <EventsTable
          events={events.data || []}
          isLoading={events.isLoading}
          error={events.error as Error | null}
        />
      </main>
    </div>
  );
};

// Main App component with providers
export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};