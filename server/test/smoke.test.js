// Basic smoke tests for server endpoints
import { generateMockData } from '../data/generators.js';

console.log('🧪 Running server smoke tests...\n');

// Test 1: Data generation
console.log('Test 1: Data generation');
try {
  const mockData = generateMockData();

  // Validate KPIs structure
  const requiredKpiFields = ['visitors', 'signups', 'conversionRate', 'revenue', 'avgLatencyMs', 'errorRate'];
  const hasAllKpiFields = requiredKpiFields.every(field => typeof mockData.kpis[field] === 'number');

  if (!hasAllKpiFields) {
    throw new Error('Missing or invalid KPI fields');
  }

  console.log('✅ KPIs generated successfully');
  console.log(`   - Visitors: ${mockData.kpis.visitors}`);
  console.log(`   - Signups: ${mockData.kpis.signups}`);
  console.log(`   - Conversion Rate: ${mockData.kpis.conversionRate}%`);
  console.log(`   - Revenue: $${mockData.kpis.revenue}`);
  console.log(`   - Avg Latency: ${mockData.kpis.avgLatencyMs}ms`);
  console.log(`   - Error Rate: ${mockData.kpis.errorRate}%`);
} catch (error) {
  console.error('❌ KPI generation failed:', error.message);
}

// Test 2: Time series data
console.log('\nTest 2: Time series data');
try {
  const mockData = generateMockData();

  const metrics = ['visitors', 'signups', 'revenue', 'latencyMs', 'errors'];
  metrics.forEach(metric => {
    if (!Array.isArray(mockData.timeSeries[metric])) {
      throw new Error(`Time series for ${metric} is not an array`);
    }

    if (mockData.timeSeries[metric].length === 0) {
      throw new Error(`Time series for ${metric} is empty`);
    }

    // Check first entry has required fields
    const firstEntry = mockData.timeSeries[metric][0];
    if (!firstEntry.timestamp || typeof firstEntry[metric] !== 'number') {
      throw new Error(`Invalid time series entry for ${metric}`);
    }
  });

  console.log('✅ Time series data generated successfully');
  console.log(`   - Generated ${mockData.timeSeries.visitors.length} data points`);
} catch (error) {
  console.error('❌ Time series generation failed:', error.message);
}

// Test 3: Breakdown data
console.log('\nTest 3: Breakdown data');
try {
  const mockData = generateMockData();

  const categories = ['source', 'region', 'device'];
  categories.forEach(category => {
    const breakdown = mockData.breakdowns[category];

    if (!Array.isArray(breakdown)) {
      throw new Error(`Breakdown for ${category} is not an array`);
    }

    // Check each entry has required fields
    breakdown.forEach(entry => {
      if (!entry.label || typeof entry.value !== 'number') {
        throw new Error(`Invalid breakdown entry for ${category}`);
      }
    });

    // Check percentages sum to ~100
    const total = breakdown.reduce((sum, entry) => sum + entry.value, 0);
    if (Math.abs(total - 100) > 5) {
      throw new Error(`Breakdown percentages for ${category} don't sum to 100%`);
    }
  });

  console.log('✅ Breakdown data generated successfully');
  mockData.breakdowns.source.forEach(source => {
    console.log(`   - ${source.label}: ${source.value}%`);
  });
} catch (error) {
  console.error('❌ Breakdown generation failed:', error.message);
}

// Test 4: Events data
console.log('\nTest 4: Events data');
try {
  const mockData = generateMockData();

  if (!Array.isArray(mockData.events)) {
    throw new Error('Events is not an array');
  }

  if (mockData.events.length === 0) {
    throw new Error('Events array is empty');
  }

  // Check first event has required fields
  const firstEvent = mockData.events[0];
  const requiredEventFields = ['id', 'time', 'service', 'severity', 'message'];
  const hasAllEventFields = requiredEventFields.every(field => firstEvent.hasOwnProperty(field));

  if (!hasAllEventFields) {
    throw new Error('Missing or invalid event fields');
  }

  console.log('✅ Events data generated successfully');
  console.log(`   - Generated ${mockData.events.length} events`);
  console.log(`   - First event: ${firstEvent.service} - ${firstEvent.severity} - ${firstEvent.message}`);
} catch (error) {
  console.error('❌ Events generation failed:', error.message);
}

// Test 5: Deterministic data (same seed should produce same results)
console.log('\nTest 5: Deterministic data');
try {
  const mockData1 = generateMockData();
  const mockData2 = generateMockData();

  if (mockData1.kpis.visitors !== mockData2.kpis.visitors) {
    throw new Error('Data is not deterministic');
  }

  console.log('✅ Data generation is deterministic');
} catch (error) {
  console.error('❌ Data determinism test failed:', error.message);
}

console.log('\n🎉 All smoke tests completed!');