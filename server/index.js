import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Import data generators and cache (to be created)
import { generateMockData } from './data/generators.js';
import { cacheMiddleware } from './middleware/cache.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(compression());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/kpis', cacheMiddleware(300), (req, res) => {
  const { range = '7d' } = req.query;
  const mockData = generateMockData();

  // For different ranges, we could adjust the data, but for now return same structure
  res.json(mockData.kpis);
});

app.get('/api/timeseries', cacheMiddleware(300), (req, res) => {
  const { metric = 'visitors', interval = 'day', range = '7d' } = req.query;

  if (!['visitors', 'signups', 'revenue', 'latencyMs', 'errors'].includes(metric)) {
    return res.status(400).json({ error: 'Invalid metric' });
  }

  const mockData = generateMockData();
  const timeSeriesData = mockData.timeSeries[metric] || [];

  res.json(timeSeriesData);
});

app.get('/api/breakdown', cacheMiddleware(300), (req, res) => {
  const { by = 'source', range = '7d' } = req.query;

  if (!['source', 'region', 'device'].includes(by)) {
    return res.status(400).json({ error: 'Invalid breakdown category' });
  }

  const mockData = generateMockData();
  const breakdownData = mockData.breakdowns[by] || [];

  res.json(breakdownData);
});

app.get('/api/events', cacheMiddleware(60), (req, res) => {
  const { limit = 50, severity, service } = req.query;
  const mockData = generateMockData();

  let events = mockData.events;

  // Filter by severity if provided
  if (severity) {
    events = events.filter(event => event.severity === severity);
  }

  // Filter by service if provided
  if (service) {
    events = events.filter(event => event.service === service);
  }

  // Apply limit
  events = events.slice(0, parseInt(limit));

  res.json(events);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Mock data seeded and ready`);
});