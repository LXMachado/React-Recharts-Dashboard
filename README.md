# Mini Analytics Dashboard

A lightweight, full-stack analytics dashboard built with React + TypeScript, Recharts, and Node.js/Express. Features real-time KPI monitoring, time-series charts, category breakdowns, and event logging with client-side caching and performance optimizations.

## 🚀 Features

- **Full-Stack Architecture**: React frontend consuming Express JSON API
- **Performance Optimized**: <100KB gzipped bundle, TTI <2s on mid-tier hardware
- **Responsive Design**: Mobile-first approach supporting 375/768/1280px breakpoints
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Modern Tech Stack**: Vite, React Query, TypeScript, Tailwind CSS
- **Production Ready**: ESLint, Prettier, error boundaries, loading states

## 📊 Dashboard Sections

### KPI Cards
- Visitors, signups, conversion rate, revenue
- Average latency and error rate monitoring
- Color-coded metrics with trend indicators

### Time Series Charts
- Line charts for visitors and signups
- Area charts for revenue tracking
- Configurable time ranges (1d, 7d, 30d)

### Category Breakdowns
- Traffic source analysis (organic, paid, referral)
- Geographic distribution (AU, EU, US, Asia)
- Device type breakdown (desktop, mobile, tablet)

### Events Table
- Real-time error and system event monitoring
- Filterable by severity and service
- Virtualized rendering for performance

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Query** for server state management and caching
- **Recharts** for interactive data visualizations
- **Tailwind CSS** for utility-first styling

### Backend
- **Node.js** with Express framework
- **In-memory TTL cache** for API response optimization
- **Deterministic mock data** generation for consistent testing
- **Security middleware** (Helmet, CORS, compression)

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mini-analytics-dashboard

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../web
   npm install

   # Return to root
   cd ..
   ```

2. **Start the development servers**
   ```bash
   # Terminal 1: Start the API server
   cd server
   npm run dev

   # Terminal 2: Start the web client
   cd ../web
   npm run dev
   ```

3. **Open your browser**
   - API: http://localhost:3001
   - Web: http://localhost:5173

### Alternative: Run tests first
```bash
# Test server functionality
cd server
npm run seed  # Generate and verify mock data

# Test client components
cd ../web
npm run type-check  # Verify TypeScript compilation
```

## 📁 Project Structure

```
mini-analytics-dashboard/
├── server/                 # Express API server
│   ├── data/
│   │   ├── generators.js   # Mock data generation logic
│   │   └── seed.js         # Data seeding script
│   ├── middleware/
│   │   └── cache.js        # TTL cache middleware
│   ├── test/
│   │   └── smoke.test.js   # Basic functionality tests
│   ├── index.js            # Main server application
│   └── package.json        # Server dependencies
│
├── web/                    # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── KpiCard.tsx # KPI metric cards
│   │   │   └── __tests__/  # Component tests
│   │   ├── hooks/
│   │   │   └── useMetrics.ts # Data fetching hooks
│   │   ├── lib/
│   │   │   ├── api.ts      # API client configuration
│   │   │   └── theme.ts    # Design tokens and colors
│   │   ├── app.tsx         # Main application layout
│   │   ├── main.tsx        # React application entry
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── tsconfig.json       # TypeScript configuration
│   ├── vite.config.ts      # Vite build configuration
│   └── package.json        # Frontend dependencies
│
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # This file
```

## 🔌 API Endpoints

### KPI Metrics
```http
GET /api/kpis?range=7d
```
Response:
```json
{
  "visitors": 15420,
  "signups": 772,
  "conversionRate": 5.01,
  "revenue": 19300,
  "avgLatencyMs": 245,
  "errorRate": 0.85
}
```

### Time Series Data
```http
GET /api/timeseries?metric=visitors&interval=day&range=7d
```
Parameters:
- `metric`: `visitors` | `signups` | `revenue` | `latencyMs` | `errors`
- `interval`: `day` | `hour`
- `range`: `1d` | `7d` | `30d`

### Category Breakdowns
```http
GET /api/breakdown?by=source&range=7d
```
Parameters:
- `by`: `source` | `region` | `device`

### System Events
```http
GET /api/events?limit=50&severity=high&service=api-gateway
```
Parameters:
- `limit`: Number of events (default: 50)
- `severity`: `low` | `medium` | `high` | `critical`
- `service`: Filter by service name

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) for visitor metrics
- **Success**: Green (#22c55e) for signups and revenue
- **Warning**: Amber (#f59e0b) for latency and conversion
- **Error**: Red (#ef4444) for error rates

### Typography
- **Font Family**: Inter (system fonts fallback)
- **Responsive scaling** across breakpoints
- **Accessible contrast ratios** (4.5:1 minimum)

### Spacing
- **Consistent scale**: 0.25rem increments
- **Responsive margins** and padding
- **Grid-based layouts** for alignment

## ⚡ Performance

### Bundle Size
- **Target**: <100KB gzipped JavaScript
- **Tree shaking** enabled via Vite
- **Code splitting** for route-based chunks
- **Lazy loading** for chart components

### Loading Performance
- **TTI**: <2 seconds on mid-tier hardware
- **Skeleton loaders** for content placeholders
- **Stale-while-revalidate** caching strategy
- **Request deduplication** via React Query

### Runtime Performance
- **Virtualized tables** for large datasets
- **Memoized selectors** for computed values
- **Efficient re-renders** with proper keying
- **Background data refresh** without blocking UI

## 🧪 Testing

### Server Tests
```bash
cd server
npm run seed  # Generate and validate mock data
```

### Client Tests
```bash
cd web
npm run type-check  # Verify TypeScript compilation
npm run lint        # Check code quality
```

### Manual Testing Checklist
- [ ] All KPI cards render correctly
- [ ] Time range selector updates data
- [ ] Responsive design works on mobile
- [ ] Error states display appropriately
- [ ] Loading skeletons appear during fetch
- [ ] Keyboard navigation functions properly

## 🚢 Deployment

### Development
```bash
# Both servers run concurrently
npm run dev        # Start API server
npm run dev:web    # Start web client (separate terminal)
```

### Production Build
```bash
# Build optimized bundles
npm run build:web  # Production web build
npm run build      # Build server (if needed)
```

### Environment Variables
```bash
# Server configuration
PORT=3001
NODE_ENV=production

# Client configuration (if needed)
VITE_API_URL=http://localhost:3001
```

## 🔒 Security

- **Helmet.js** for security headers
- **CORS** configured for cross-origin requests
- **Input validation** on all API endpoints
- **Error handling** without information leakage
- **HTTPS enforcement** in production

## 🎯 Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive enhancement** for older browsers

## 📈 Monitoring

- **Error tracking** via console logging
- **Performance monitoring** via browser dev tools
- **API response times** logged on server
- **Cache hit rates** tracked internally

## 🤝 Contributing

1. Follow existing code style (ESLint + Prettier)
2. Write descriptive commit messages
3. Update tests for new features
4. Ensure responsive design works
5. Test accessibility with keyboard navigation

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Recharts** for excellent charting components
- **React Query** for powerful data fetching
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development experience

---

**Built with ❤️ for the modern web**