import { pyClient } from './index';

// Example: Create a page and trigger metric generation
export async function exampleCreatePage() {
  console.log('🚀 Example: Create a page and trigger metric generation');
  
  try {
    // This would be called from your API endpoint
    // POST /api/page
    // Body: {
    //   "type": "DAILY",
    //   "date": "25-12-2023",
    //   "svc_id": 1
    // }
    
    const pageData = {
      type: "DAILY",
      date: "25-12-2023", // DD-MM-YYYY format
      svc_id: 1
    };
    
    console.log('📄 Page data to create:', pageData);
    console.log('📅 Date for metric generation:', pageData.date);
    console.log('📝 Generated page name will be:', `${pageData.type}_${pageData.date}`);
    
    // Simulate the API call that would be made
    console.log('✅ This would create a page and trigger metric generation for service_id: 1');
    
  } catch (error) {
    console.error('❌ Error creating page:', error);
  }
}

// Example: Create a weekly page
export async function exampleCreateWeeklyPage() {
  console.log('🚀 Example: Create a weekly page and trigger metric generation');
  
  try {
    const pageData = {
      type: "WEEKLY",
      date: "25-12-2023", // DD-MM-YYYY format
      svc_id: 2
    };
    
    console.log('📄 Weekly page data to create:', pageData);
    console.log('📅 Date for metric generation:', pageData.date);
    console.log('📝 Generated page name will be:', `${pageData.type}_${pageData.date}`);
    
    console.log('✅ This would create a weekly page and trigger metric generation for service_id: 2');
    
  } catch (error) {
    console.error('❌ Error creating weekly page:', error);
  }
}

// Example: Get pages by service
export async function exampleGetPagesByService() {
  console.log('🚀 Example: Get pages by service ID');
  
  try {
    const serviceId = 1;
    
    console.log(`📄 Getting pages for service ID: ${serviceId}`);
    
    // This would be called from your API endpoint
    // GET /api/page/1
    
    console.log('✅ This would return all pages for service ID 1');
    
  } catch (error) {
    console.error('❌ Error getting pages by service:', error);
  }
}

// Example: API usage demonstration
export function demonstratePageAPIUsage() {
  console.log(`
📋 Simplified Page API Usage Examples:

1. Create a daily page and trigger metric generation:
   POST /api/page
   Content-Type: application/json
   
   {
     "type": "DAILY",
     "date": "25-12-2023",
     "svc_id": 1
   }

2. Create a weekly page and trigger metric generation:
   POST /api/page
   Content-Type: application/json
   
   {
     "type": "WEEKLY",
     "date": "25-12-2023",
     "svc_id": 2
   }

3. Get pages by service ID:
   GET /api/page/1

Response Format for Page Creation:
{
  "success": true,
  "message": "Page created and metric generation triggered successfully",
  "data": {
    "page": {
      "id": 123,
      "service_id": 1,
      "name": "DAILY_25-12-2023",
      "type": "DAILY",
      "date": 1703462400000,
      "created_at": "2023-12-25T00:00:00.000Z",
      "updated_at": "2023-12-25T00:00:00.000Z"
    },
    "metricGeneration": {
      "success": true,
      "results": [
        {
          "config_id": 1,
          "success": true
        },
        {
          "config_id": 2,
          "success": true
        }
      ]
    }
  }
}

Response Format for Getting Pages by Service:
{
  "success": true,
  "data": [
    {
      "id": 123,
      "service_id": 1,
      "name": "DAILY_25-12-2023",
      "type": "DAILY",
      "date": 1703462400000,
      "created_at": "2023-12-25T00:00:00.000Z",
      "updated_at": "2023-12-25T00:00:00.000Z"
    },
    {
      "id": 124,
      "service_id": 1,
      "name": "WEEKLY_25-12-2023",
      "type": "WEEKLY",
      "date": 1703462400000,
      "created_at": "2023-12-25T00:00:00.000Z",
      "updated_at": "2023-12-25T00:00:00.000Z"
    }
  ],
  "count": 2
}

PageType Enum:
- DAILY: For daily pages
- WEEKLY: For weekly pages

Date Format:
- DD-MM-YYYY: Day-Month-Year (e.g., "25-12-2023" for December 25, 2023)
- Converted to epoch (start of IST date) for storage
- Timestamps: ISO 8601 format (e.g., "2023-12-25T00:00:00.000Z")
  `);
}

// Run examples
export async function runPageCreationExamples() {
  console.log('=== Simplified Page Creation Examples ===\n');
  
  demonstratePageAPIUsage();
  console.log('\n');
  
  await exampleCreatePage();
  console.log('\n');
  
  await exampleCreateWeeklyPage();
  console.log('\n');
  
  await exampleGetPagesByService();
  console.log('\n');
  
  console.log('=== Examples Complete ===');
}

// Run if this file is executed directly
if (require.main === module) {
  runPageCreationExamples().catch(console.error);
} 