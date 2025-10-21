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
      color: theme.colors.gray[500],
      bgColor: theme.colors.gray[100],
      dotColor: theme.colors.gray[400],
    },
    medium: {
      color: theme.colors.warning[700],
      bgColor: theme.colors.warning[100],
      dotColor: theme.colors.warning[500],
    },
    high: {
      color: theme.colors.error[700],
      bgColor: theme.colors.error[100],
      dotColor: theme.colors.error[500],
    },
    critical: {
      color: theme.colors.error[800],
      bgColor: theme.colors.error[200],
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
      className={`grid grid-cols-12 gap-4 p-3 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
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
      <div className="col-span-3 font-mono text-xs text-gray-500">
        {event.id}
      </div>
      <div className="col-span-2">
        <SeverityBadge severity={event.severity} />
      </div>
      <div className="col-span-2 font-medium text-gray-900">
        {event.service}
      </div>
      <div className="col-span-3 text-gray-600">
        {event.message}
      </div>
      <div className="col-span-2 text-gray-500">
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
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      {/* Search input */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Events
        </label>
        <input
          type="text"
          placeholder="Search by message or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Severity filter */}
      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Severity
        </label>
        <select
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service
        </label>
        <select
          value={serviceFilter}
          onChange={(e) => onServiceFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
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
    console.log(`Filtered ${events.length} events in ${endTime - startTime}ms`);

    return filtered;
  }, [events, searchTerm, severityFilter, serviceFilter]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 ${className}`}>
        <div className="p-6 text-center">
          <div className="text-red-600 mb-2">Failed to load events</div>
          <div className="text-red-500 text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <div className="text-sm text-gray-500">
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

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <EventsTableHeader />

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
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
              className="border-t border-gray-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};