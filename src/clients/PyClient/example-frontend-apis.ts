// Utility function for date conversion
export function convertDateToEpoch(dateString: string): number {
  // Convert DD-MM-YYYY to epoch (start of IST date)
  const dateParts = dateString.split('-');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(dateParts[2], 10);
  
  // Create date in IST (UTC+5:30) and get start of day
  const istDate = new Date(year, month, day, 0, 0, 0, 0);
  // Convert to UTC epoch (subtract 5:30 hours for IST to UTC)
  const epoch = istDate.getTime() - (5.5 * 60 * 60 * 1000);
  
  return epoch;
}

export function convertEpochToDate(epoch: number): string {
  // Convert epoch to DD-MM-YYYY format
  const date = new Date(epoch + (5.5 * 60 * 60 * 1000)); // Add 5:30 hours for UTC to IST
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

// Example: Date conversion demonstration
export function demonstrateDateConversion() {
  console.log(`
📅 Date Conversion Examples:

1. DD-MM-YYYY to Epoch:
   Input: "25-12-2023"
   Epoch: ${convertDateToEpoch("25-12-2023")}
   
   Input: "01-01-2024"
   Epoch: ${convertDateToEpoch("01-01-2024")}

2. Epoch to DD-MM-YYYY:
   Epoch: 1703462400000
   Date: ${convertEpochToDate(1703462400000)}
   
   Epoch: 1704067200000
   Date: ${convertEpochToDate(1704067200000)}

3. API Usage:
   POST /api/page
   {
     "type": "DAILY",
     "date": "25-12-2023",  // DD-MM-YYYY format
     "svc_id": 1
   }
   
   Response will contain epoch timestamp:
   {
     "page": {
       "date": 1703462400000  // Epoch (start of IST date)
     }
   }
  `);
}

// Example: Frontend API Usage Examples
export function demonstrateFrontendAPIs() {
  console.log(`
🚀 Frontend API Usage Examples:

1. Get Pages Hierarchy (WEEKLY as main, DAILY as children):
   GET /api/pages?svc_id=1
   
   Response:
   {
     "success": true,
     "data": {
       "weekly": [
         {
           "id": 123,
           "name": "WEEKLY_25-12-2023",
           "children": [
             {
               "id": 124,
               "name": "DAILY_25-12-2023"
             },
             {
               "id": 125,
               "name": "DAILY_26-12-2023"
             }
           ]
         }
       ]
     }
   }

2. Get Page with Metrics Compilation:
   GET /api/page/123
   
   Response:
   {
     "success": true,
     "data": {
       "page": {
         "id": 123,
         "service_id": 1,
         "name": "DAILY_25-12-2023",
         "type": "DAILY",
         "date": 1703462400000,
         "summary": "Daily summary",
         "annotations": "Some annotations",
         "created_at": "2023-12-25T00:00:00.000Z",
         "updated_at": "2023-12-25T00:00:00.000Z"
       },
       "metrics": [
         {
           "id": 1,
           "metrics_config_id": 1,
           "name": "CPU Usage",
           "date": 1703462400000,
           "state": "normal",
           "value": 75.5,
           "criticalityScore": 3,
           "summary_text": "CPU usage is within normal range",
           "image_url": "https://example.com/cpu-chart.png",
           "created_at": "2023-12-25T00:00:00.000Z",
           "updated_at": "2023-12-25T00:00:00.000Z"
         },
         {
           "id": 2,
           "metrics_config_id": 2,
           "name": "Memory Usage",
           "date": 1703462400000,
           "state": "warning",
           "value": 85.2,
           "criticalityScore": 7,
           "summary_text": "Memory usage is high",
           "image_url": "https://example.com/memory-chart.png",
           "created_at": "2023-12-25T00:00:00.000Z",
           "updated_at": "2023-12-25T00:00:00.000Z"
         }
       ]
     }
   }

3. Get All Services:
   GET /api/services
   
   Response:
   {
     "success": true,
     "data": [
       {
         "service_id": 1,
         "service_name": "User Service",
         "created_at": "2023-01-01T00:00:00.000Z",
         "updated_at": "2023-12-25T00:00:00.000Z"
       },
       {
         "service_id": 2,
         "service_name": "Payment Service",
         "created_at": "2023-01-01T00:00:00.000Z",
         "updated_at": "2023-12-25T00:00:00.000Z"
       },
       {
         "service_id": 3,
         "service_name": "Notification Service",
         "created_at": "2023-01-01T00:00:00.000Z",
         "updated_at": "2023-12-25T00:00:00.000Z"
       }
     ]
   }

📋 API Endpoints Summary:
- GET /api/pages?svc_id={service_id} - Get pages hierarchy
- GET /api/page/{page_id} - Get page with metrics compilation  
- GET /api/services - Get all services with pages
- POST /api/page - Create page and trigger metrics (existing)
- GET /api/page/{svc_id} - Get pages by service (existing)

🎯 Frontend Use Cases:
1. Service Selection Dropdown - Use /api/services
2. Page Navigation Tree - Use /api/pages?svc_id={selected_service}
3. Page Content Display - Use /api/page/{page_id} for metrics compilation

📅 Date Format Notes:
- Input: DD-MM-YYYY format (e.g., "25-12-2023")
- Storage: Epoch timestamp (start of IST date)
- Display: Epoch timestamp in responses
- Timestamps: ISO 8601 format (e.g., "2023-12-25T00:00:00.000Z")
  `);
}

// Example: Service selection flow
export function demonstrateServiceSelectionFlow() {
  console.log(`
🔄 Frontend Service Selection Flow:

1. Load Services:
   GET /api/services
   → Display services in dropdown/select component

2. User selects a service (e.g., service_id: 1):
   → Store selected service_id in state

3. Load Pages Hierarchy:
   GET /api/pages?svc_id=1
   → Display weekly pages as main items
   → Display daily pages as children under each weekly page

4. User clicks on a page (e.g., page_id: 123):
   → Navigate to page detail view

5. Load Page with Metrics:
   GET /api/page/123
   → Display page information
   → Display all metrics compilation for that page

📊 Data Flow:
Services → Pages Hierarchy → Page Details with Metrics
  `);
}

// Example: Error handling
export function demonstrateErrorHandling() {
  console.log(`
⚠️ Error Handling Examples:

1. Invalid Service ID:
   GET /api/pages?svc_id=invalid
   Response: 400 Bad Request
   {
     "success": false,
     "error": "svc_id query parameter is required and must be a number"
   }

2. Page Not Found:
   GET /api/page/999999
   Response: 404 Not Found
   {
     "success": false,
     "error": "Page not found"
   }

3. Missing Service ID:
   GET /api/pages
   Response: 400 Bad Request
   {
     "success": false,
     "error": "svc_id query parameter is required and must be a number"
   }

4. Invalid Date Format:
   POST /api/page
   Body: {"type": "DAILY", "date": "25-12-23", "svc_id": 1}
   Response: 400 Bad Request
   {
     "success": false,
     "error": "date must be in DD-MM-YYYY format (e.g., '25-12-2023')"
   }

5. Server Error:
   Response: 500 Internal Server Error
   {
     "success": false,
     "error": "Internal server error"
   }
  `);
}

// Run examples
export function runFrontendAPIExamples() {
  console.log('=== Frontend API Examples ===\n');
  
  demonstrateDateConversion();
  console.log('\n');
  
  demonstrateFrontendAPIs();
  console.log('\n');
  
  demonstrateServiceSelectionFlow();
  console.log('\n');
  
  demonstrateErrorHandling();
  console.log('\n');
  
  console.log('=== Examples Complete ===');
}

// Run if this file is executed directly
if (require.main === module) {
  runFrontendAPIExamples();
} 