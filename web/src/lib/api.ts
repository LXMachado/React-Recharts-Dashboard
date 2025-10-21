// API client configuration and React Query setup

// API Types
export interface KPI {
  visitors: number;
  signups: number;
  conversionRate: number;
  revenue: number;
  avgLatencyMs: number;
  errorRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  visitors?: number;
  signups?: number;
  revenue?: number;
  latencyMs?: number;
  errors?: number;
}

export interface BreakdownData {
  label: string;
  value: number;
}

export interface Event {
  id: string;
  time: string;
  service: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

// API base URL - uses proxy in development
const API_BASE_URL = '/api';

// Generic fetch wrapper with error handling
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// API functions
export const api = {
  // Get KPI data
  getKPIs: (range: string = '7d'): Promise<KPI> =>
    apiRequest<KPI>(`/kpis?range=${range}`),

  // Get time series data
  getTimeSeries: (
    metric: 'visitors' | 'signups' | 'revenue' | 'latencyMs' | 'errors',
    interval: 'day' | 'hour' = 'day',
    range: string = '7d'
  ): Promise<TimeSeriesData[]> =>
    apiRequest<TimeSeriesData[]>(`/timeseries?metric=${metric}&interval=${interval}&range=${range}`),

  // Get breakdown data
  getBreakdown: (
    category: 'source' | 'region' | 'device',
    range: string = '7d'
  ): Promise<BreakdownData[]> =>
    apiRequest<BreakdownData[]>(`/breakdown?by=${category}&range=${range}`),

  // Get events
  getEvents: (options?: {
    limit?: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    service?: string;
  }): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.severity) params.append('severity', options.severity);
    if (options?.service) params.append('service', options.service);

    const queryString = params.toString();
    return apiRequest<Event[]>(`/events${queryString ? `?${queryString}` : ''}`);
  },
};

// React Query keys factory
export const queryKeys = {
  kpis: (range: string) => ['kpis', range] as const,
  timeSeries: (metric: string, interval: string, range: string) =>
    ['timeSeries', metric, interval, range] as const,
  breakdown: (category: string, range: string) => ['breakdown', category, range] as const,
  events: (options?: any) => ['events', options] as const,
};