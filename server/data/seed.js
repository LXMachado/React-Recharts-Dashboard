// Seed script to generate and validate mock data
import { generateMockData } from './generators.js';

console.log('🌱 Seeding mock data...\n');

// Generate all mock data
const mockData = generateMockData();

// Display sample data for verification
console.log('📊 Generated KPIs:');
console.log(JSON.stringify(mockData.kpis, null, 2));

console.log('\n📈 Time Series (first 3 entries):');
console.log('Visitors:', mockData.timeSeries.visitors.slice(0, 3));
console.log('Signups:', mockData.timeSeries.signups.slice(0, 3));
console.log('Revenue:', mockData.timeSeries.revenue.slice(0, 3));

console.log('\n📊 Breakdowns:');
console.log('Source:', mockData.breakdowns.source);
console.log('Region:', mockData.breakdowns.region);
console.log('Device:', mockData.breakdowns.device);

console.log('\n🚨 Events (first 3):');
console.log(JSON.stringify(mockData.events.slice(0, 3), null, 2));

console.log('\n✅ Mock data seeded successfully!');
console.log(`📋 Generated ${mockData.events.length} events`);
console.log(`📅 Generated ${mockData.timeSeries.visitors.length} time series data points`);