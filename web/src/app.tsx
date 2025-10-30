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
    <div className="flex items-center gap-3">
      <span className="text-[0.65rem] uppercase tracking-[0.38em] text-slate-400">
        Period
      </span>
      <div className="flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/70 p-1 shadow-inner shadow-slate-900/40 backdrop-blur">
        {ranges.map((range) => (
          <button
            key={range.value}
            type="button"
            onClick={() => onRangeChange(range.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              selectedRange === range.value
                ? 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.35)]'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
            }`}
            aria-pressed={selectedRange === range.value}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Header component
interface HeaderProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedRange, onRangeChange }) => (
  <header className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 px-8 py-10 shadow-[0_35px_120px_-40px_rgba(14,165,233,0.45)]">
    <div
      className="pointer-events-none absolute inset-0 opacity-90"
      style={{ background: theme.gradients.card }}
    />
    <div className="pointer-events-none absolute -top-20 -right-10 h-48 w-48 rounded-full bg-sky-500/30 blur-3xl" />
    <div className="pointer-events-none absolute bottom-[-4.5rem] left-1/3 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

    <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          KPI Control Room
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
              Real-time Growth Metrics
            </span>
          </h1>
          <p className="max-w-xl text-sm text-slate-300">
            Monitor acquisition, activation, and platform health from a single vantage point.
            Stay ahead with instant visibility into the signals that matter most.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 md:items-end">
        <RangeSelector selectedRange={selectedRange} onRangeChange={onRangeChange} />
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-300" />
            </span>
            Live data sync
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h13M4 12h9m-9 6h6m9-3 3-3-3-3m3 3h-8" />
            </svg>
            Automated alerts enabled
          </div>
        </div>
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
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <Header selectedRange={selectedRange} onRangeChange={setSelectedRange} />

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white md:text-xl">Key Metrics</h2>
              <p className="text-sm text-slate-400">
                A pulse on acquisition, monetization, and platform reliability.
              </p>
            </div>

            <RangeSelector selectedRange={selectedRange} onRangeChange={setSelectedRange} />
          </div>

          <KpiGrid
            kpis={kpis.data || null}
            isLoading={isLoading}
            error={error as Error | null}
          />
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
        </section>

        <section>
          <EventsTable
            events={events.data || []}
            isLoading={events.isLoading}
            error={events.error as Error | null}
          />
        </section>
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
