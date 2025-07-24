import { pyClient } from './index';

// Example: Generate metrics for a specific date
export async function exampleGenerateMetricsForDate() {
  console.log('🚀 Example: Generate metrics for all configs for a specific date');
  
  try {
    // Example: Generate metrics for today's timestamp
    const today = Date.now();
    
    console.log(`📅 Generating metrics for date: ${today} (${new Date(today).toISOString()})`);
    
    // This would be called from your API endpoint
    // POST /api/metrics/generate/date
    // Body: { "date": 1703123456789 }
    
    const success = await pyClient.genMetric(1, today);
    console.log(`✅ Metric generation result: ${success}`);
    
  } catch (error) {
    console.error('❌ Error generating metrics:', error);
  }
}

// Example: Generate metrics for a specific service
export async function exampleGenerateMetricsForService() {
  console.log('🚀 Example: Generate metrics for a specific service');
  
  try {
    const serviceId = 1;
    const today = Date.now();
    
    console.log(`📅 Generating metrics for service ${serviceId} on date: ${today}`);
    
    // This would be called from your API endpoint
    // POST /api/metrics/generate/service
    // Body: { "serviceId": 1, "date": 1703123456789 }
    
    // For demonstration, we'll call genMetric for a few config IDs
    const configIds = [1, 2, 3];
    const promises = configIds.map(configId => pyClient.genMetric(configId, today));
    
    const results = await Promise.all(promises);
    console.log(`✅ Metric generation results:`, results);
    
  } catch (error) {
    console.error('❌ Error generating metrics for service:', error);
  }
}

// Example: API usage demonstration
export function demonstrateAPIUsage() {
  console.log(`
📋 API Usage Examples:

1. Generate metrics for all configs for a specific date:
   POST /api/metrics/generate/date
   Content-Type: application/json
   
   {
     "date": 1703123456789
   }

2. Generate metrics for a specific service:
   POST /api/metrics/generate/service
   Content-Type: application/json
   
   {
     "serviceId": 1,
     "date": 1703123456789
   }

3. Get all metrics:
   GET /api/metrics?metrics_config_id=1&state=active&limit=10

4. Get metric by ID:
   GET /api/metrics/123

5. Create a new metric:
   POST /api/metrics
   Content-Type: application/json
   
   {
     "metrics_config_id": 1,
     "name": "CPU Usage",
     "date": 1703123456789,
     "state": "active",
     "value": 85.5,
     "criticalityScore": 75
   }

6. Update a metric:
   PUT /api/metrics/123
   Content-Type: application/json
   
   {
     "state": "resolved",
     "comment": "Issue has been resolved"
   }

7. Delete a metric:
   DELETE /api/metrics/123
  `);
}

// Run examples
export async function runMetricGenerationExamples() {
  console.log('=== Metric Generation Examples ===\n');
  
  demonstrateAPIUsage();
  console.log('\n');
  
  await exampleGenerateMetricsForDate();
  console.log('\n');
  
  await exampleGenerateMetricsForService();
  console.log('\n');
  
  console.log('=== Examples Complete ===');
}

// Run if this file is executed directly
if (require.main === module) {
  runMetricGenerationExamples().catch(console.error);
} 