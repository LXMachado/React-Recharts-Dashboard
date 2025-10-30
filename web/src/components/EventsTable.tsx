import React, { useState, useMemo, useCallback } from 'react';
import { Event } from '../lib/api';
import { theme } from '../lib/theme';

// Severity badge component with color coding
interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const severityConfig = {
    low: {
      color: '#cbd5f5',
      bgColor: 'rgba(148, 163, 184, 0.16)',
      dotColor: '#94a3b8',
    },
    medium: {
      color: theme.colors.warning[500],
      bgColor: 'rgba(251, 191, 36, 0.14)',
      dotColor: theme.colors.warning[600],
    },
    high: {
      color: '#f87171',
      bgColor: 'rgba(248, 113, 113, 0.14)',
      dotColor: theme.colors.error[500],
    },
    critical: {
      color: '#f87171',
      bgColor: 'rgba(239, 68, 68, 0.2)',
      dotColor: theme.colors.error[600],
    },
  };

  const config = severityConfig[severity];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      <div
        className="w-2 h-2 rounded-full mr-1"
        style={{ backgroundColor: config.dotColor }}
      />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

// Format timestamp for display
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Table row component
interface EventRowProps {
  event: Event;
  style: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}

const EventRow: React.FC<EventRowProps> = ({ event, style, isSelected = false, onClick }) => {
  return (
    <div
      className={`grid grid-cols-12 gap-4 border-b border-slate-800/60 p-3 text-sm transition-colors ${
        isSelected
          ? 'bg-sky-500/15 border-sky-500/40'
          : 'hover:bg-slate-800/50'
      } cursor-pointer`}
      style={style}
      onClick={onClick}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="col-span-3 font-mono text-xs text-slate-500">
        {event.id}
      </div>
      <div className="col-span-2">
        <SeverityBadge severity={event.severity} />
      </div>
      <div className="col-span-2 font-medium text-slate-200">
        {event.service}
      </div>
      <div className="col-span-3 text-slate-300">
        {event.message}
      </div>
      <div className="col-span-2 text-slate-500">
        {formatTimestamp(event.time)}
      </div>
    </div>
  );
};

// Filter controls component
interface EventsFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  availableServices: string[];
}

const EventsFilter: React.FC<EventsFilterProps> = ({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
  serviceFilter,
  onServiceFilterChange,
  availableServices,
}) => {
  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 sm:flex-row">
      {/* Search input */}
      <div className="flex-1">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Search Events
        </label>
        <input
          type="text"
          placeholder="Search by message or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      {/* Severity filter */}
      <div className="sm:w-48">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Severity
        </label>
        <select
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        >
          {severityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Service filter */}
      <div className="sm:w-48">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Service
        </label>
        <select
          value={serviceFilter}
          onChange={(e) => onServiceFilterChange(e.target.value)}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        >
          <option value="">All Services</option>
          {availableServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Simple virtualized table implementation
interface VirtualizedTableProps {
  items: Event[];
  height: number;
  itemHeight: number;
  renderItem: (item: Event, style: React.CSSProperties) => React.ReactNode;
  className?: string;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(height / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className={`relative overflow-auto ${className}`} style={{ height }} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return renderItem(item, {
            position: 'absolute',
            top: actualIndex * itemHeight,
            width: '100%',
            height: itemHeight,
          });
        })}
      </div>
    </div>
  );
};

// Table header component
const EventsTableHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 border-b border-slate-800/70 bg-slate-900/60 p-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
      <div className="col-span-3">Event ID</div>
      <div className="col-span-2">Severity</div>
      <div className="col-span-2">Service</div>
      <div className="col-span-3">Message</div>
      <div className="col-span-2">Time</div>
    </div>
  );
};

// Main EventsTable component
interface EventsTableProps {
  events: Event[];
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading = false,
  error = null,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Get unique services for filter dropdown
  const availableServices = useMemo(() => {
    const services = [...new Set(events.map(event => event.service))];
    return services.sort();
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const startTime = performance.now();

    let filtered = events.filter(event => {
      const matchesSearch = searchTerm === '' ||
        event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === '' || event.severity === severityFilter;
      const matchesService = serviceFilter === '' || event.service === serviceFilter;

      return matchesSearch && matchesSeverity && matchesService;
    });

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const endTime = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`Filtered ${events.length} events in ${endTime - startTime}ms`);
    }

    return filtered;
  }, [events, searchTerm, severityFilter, serviceFilter]);

  if (isLoading) {
    return (
      <div className={`relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 ${className}`}>
        <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: theme.gradients.card }} />
        <div className="relative space-y-4">
          <div className="h-4 w-32 rounded bg-slate-800/70"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-2xl border border-slate-800/70 bg-slate-900/60 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative overflow-hidden rounded-3xl border border-rose-500/40 bg-slate-900/60 p-6 ${className}`}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent" />
        <div className="relative space-y-2 text-center text-sm text-rose-100">
          <div className="text-base font-semibold">Failed to load events</div>
          <div className="text-rose-200/80">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/50 ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: theme.gradients.card }} />
      <div className="relative p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
            <div className="mt-2 h-px w-20 bg-gradient-to-r from-sky-500 to-transparent" />
          </div>
          <div className="text-sm text-slate-400">
            {filteredEvents.length} of {events.length} events
          </div>
        </div>

        <EventsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          serviceFilter={serviceFilter}
          onServiceFilterChange={setServiceFilter}
          availableServices={availableServices}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/30">
          <EventsTableHeader />

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              {searchTerm || severityFilter || serviceFilter
                ? 'No events match your filters'
                : 'No events available'
              }
            </div>
          ) : (
            <VirtualizedTable
              items={filteredEvents}
              height={400}
              itemHeight={60}
              renderItem={(event, style) => (
                <EventRow
                  key={event.id}
                  event={event}
                  style={style}
                  isSelected={selectedEventId === event.id}
                  onClick={() => setSelectedEventId(
                    selectedEventId === event.id ? null : event.id
                  )}
                />
              )}
              className="border-t border-slate-800/70"
            />
          )}
        </div>
      </div>
    </div>
  );
};
