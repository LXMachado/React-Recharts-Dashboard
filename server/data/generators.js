// Deterministic mock data generators for analytics dashboard
// Uses date-based seeding for consistent results

const SOURCES = ['organic', 'paid', 'referral', 'direct', 'social'];
const REGIONS = ['AU', 'EU', 'US', 'ASIA', 'OTHER'];
const DEVICES = ['desktop', 'mobile', 'tablet'];
const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

const SERVICES = [
  'api-gateway', 'user-service', 'payment-service',
  'notification-service', 'analytics-service', 'auth-service'
];

// Simple seeded random number generator for deterministic results
export function seededRandom(seed) {
  // Convert string seed to number
  const seedNum = typeof seed === 'string'
    ? seed.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)
    : seed;

  const x = Math.sin(seedNum) * 10000;
  return Math.abs(x - Math.floor(x));
}

// Generate date range for time series data
export function generateDateRange(days, interval = 'day') {
  const dates = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    if (interval === 'hour') {
      // Generate hourly data for the last 24 hours
      for (let hour = 0; hour < 24; hour++) {
        const hourlyDate = new Date(date);
        hourlyDate.setHours(hour, 0, 0, 0);
        dates.push(hourlyDate.toISOString());
      }
    } else {
      // Daily data
      date.setHours(0, 0, 0, 0);
      dates.push(date.toISOString());
    }
  }

  return dates;
}

// Generate KPI data for a given date range
export function generateKPIs(dateRange = '7d') {
  const days = dateRange === '30d' ? 30 : 7;
  const baseSeed = new Date().toDateString();

  // Base metrics that scale with time
  const baseVisitors = 1000 + (days * 50);
  const baseSignups = Math.floor(baseVisitors * 0.05);
  const baseRevenue = baseSignups * 25;

  return {
    visitors: Math.floor(baseVisitors + (seededRandom(baseSeed + 'visitors') * 200)),
    signups: Math.floor(baseSignups + (seededRandom(baseSeed + 'signups') * 20)),
    conversionRate: Math.round((baseSignups / baseVisitors) * 100 * 100) / 100,
    revenue: Math.floor(baseRevenue + (seededRandom(baseSeed + 'revenue') * 500)),
    avgLatencyMs: Math.floor(150 + (seededRandom(baseSeed + 'latency') * 100)),
    errorRate: Math.round((0.02 + (seededRandom(baseSeed + 'errors') * 0.03)) * 100 * 100) / 100
  };
}

// Generate time series data
export function generateTimeSeries(metric, interval = 'day', range = '7d') {
  const days = range === '30d' ? 30 : 7;
  const dates = generateDateRange(days, interval);
  const baseSeed = new Date().toDateString();

  return dates.map((date, index) => {
    const daySeed = baseSeed + date + metric;
    const baseValue = getBaseValueForMetric(metric, index, days);

    // Add some realistic variation and trends
    const trend = 1 + (index * 0.02) - (seededRandom(daySeed + 'trend') * 0.1);
    const variation = 0.8 + (seededRandom(daySeed + 'variation') * 0.4);

    let value;
    switch (metric) {
      case 'visitors':
        value = Math.floor(baseValue * trend * variation);
        break;
      case 'signups':
        value = Math.floor((baseValue * 0.05) * trend * variation);
        break;
      case 'revenue':
        value = Math.floor((baseValue * 0.0025) * trend * variation);
        break;
      case 'latencyMs':
        value = Math.floor((150 + index * 2) * (0.9 + seededRandom(daySeed) * 0.2));
        break;
      case 'errors':
        value = Math.floor((baseValue * 0.001) * (0.8 + seededRandom(daySeed) * 0.4));
        break;
      default:
        value = 0;
    }

    return {
      timestamp: date,
      [metric]: Math.max(0, value)
    };
  });
}

function getBaseValueForMetric(metric, index, totalDays) {
   const baseValues = {
     visitors: 1000 + (index * 30),
     signups: 50 + (index * 2),
     revenue: 1250 + (index * 40),
     latencyMs: 150,
     errors: 5
   };
   return baseValues[metric] || 1000; // Default fallback value
 }

// Generate breakdown data by category
export function generateBreakdown(category, range = '7d') {
  const days = range === '30d' ? 30 : 7;
  const baseSeed = new Date().toDateString() + category;

  let categories;
  switch (category) {
    case 'source':
      categories = SOURCES;
      break;
    case 'region':
      categories = REGIONS;
      break;
    case 'device':
      categories = DEVICES;
      break;
    default:
      categories = [];
  }

  return categories.map(cat => {
    const seed = baseSeed + cat;
    const value = (seededRandom(seed) * 100) + 10; // Ensure minimum value
    return {
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: Math.round(value)
    };
  }).sort((a, b) => b.value - a.value);
}

// Generate events data
export function generateEvents(limit = 50) {
  const events = [];
  const baseSeed = new Date().toDateString();

  for (let i = 0; i < limit; i++) {
    const eventSeed = baseSeed + 'event' + i;
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (i * 15)); // Spread events over time

    const serviceIndex = Math.floor(seededRandom(eventSeed + 'service') * SERVICES.length);
    const severityIndex = Math.floor(seededRandom(eventSeed + 'severity') * SEVERITY_LEVELS.length);
    const messageIndex = Math.floor(seededRandom(eventSeed + 'message') * 10);

    events.push({
      id: `evt_${i + 1}`,
      time: timestamp.toISOString(),
      service: SERVICES[serviceIndex] || 'api-gateway',
      severity: SEVERITY_LEVELS[severityIndex] || 'medium',
      message: generateEventMessage(eventSeed + 'message')
    });
  }

  return events.reverse(); // Most recent first
}

function generateEventMessage(seed) {
  const messages = [
    'Database connection timeout',
    'High memory usage detected',
    'Rate limit exceeded',
    'Authentication failure',
    'Payment processing error',
    'Service unavailable',
    'Invalid request format',
    'Cache miss rate high',
    'Slow query detected',
    'Circuit breaker activated'
  ];

  const messageIndex = Math.floor(seededRandom(seed + 'message') * messages.length);
  return messages[messageIndex];
}

// Main function to generate all mock data
export function generateMockData() {
  return {
    kpis: generateKPIs(),
    timeSeries: {
      visitors: generateTimeSeries('visitors'),
      signups: generateTimeSeries('signups'),
      revenue: generateTimeSeries('revenue'),
      latencyMs: generateTimeSeries('latencyMs'),
      errors: generateTimeSeries('errors')
    },
    breakdowns: {
      source: generateBreakdown('source'),
      region: generateBreakdown('region'),
      device: generateBreakdown('device')
    },
    events: generateEvents()
  };
}