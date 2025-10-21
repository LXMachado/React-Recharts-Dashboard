import { useQuery } from 'react-query';
import { api, queryKeys, KPI, TimeSeriesData, BreakdownData, Event } from '../lib/api';

// Custom hook for KPI data
export const useKPIs = (range: string = '7d') => {
  return useQuery({
    queryKey: queryKeys.kpis(range),
    queryFn: () => api.getKPIs(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Custom hook for time series data
export const useTimeSeries = (
  metric: 'visitors' | 'signups' | 'revenue' | 'latencyMs' | 'errors',
  interval: 'day' | 'hour' = 'day',
  range: string = '7d'
) => {
  return useQuery({
    queryKey: queryKeys.timeSeries(metric, interval, range),
    queryFn: () => api.getTimeSeries(metric, interval, range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Custom hook for breakdown data
export const useBreakdown = (
  category: 'source' | 'region' | 'device',
  range: string = '7d'
) => {
  return useQuery({
    queryKey: queryKeys.breakdown(category, range),
    queryFn: () => api.getBreakdown(category, range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Custom hook for events data
export const useEvents = (options?: {
  limit?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  service?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.events(options),
    queryFn: () => api.getEvents(options),
    staleTime: 1 * 60 * 1000, // 1 minute (events change more frequently)
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Combined hook for dashboard data
export const useDashboardData = (range: string = '7d') => {
  const kpis = useKPIs(range);
  const visitorsTimeSeries = useTimeSeries('visitors', 'day', range);
  const signupsTimeSeries = useTimeSeries('signups', 'day', range);
  const revenueTimeSeries = useTimeSeries('revenue', 'day', range);
  const sourceBreakdown = useBreakdown('source', range);
  const deviceBreakdown = useBreakdown('device', range);
  const events = useEvents({ limit: 50 });

  return {
    kpis,
    visitorsTimeSeries,
    signupsTimeSeries,
    revenueTimeSeries,
    sourceBreakdown,
    deviceBreakdown,
    events,
    // Overall loading state
    isLoading: kpis.isLoading || visitorsTimeSeries.isLoading,
    // Overall error state (first error encountered)
    error: kpis.error || visitorsTimeSeries.error || signupsTimeSeries.error ||
           revenueTimeSeries.error || sourceBreakdown.error || deviceBreakdown.error || events.error,
  };
};