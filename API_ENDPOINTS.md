# API Endpoints Documentation

This document describes the implemented API endpoints according to the specification.

## 1. List All Services

**Endpoint:** `GET /api/service`

**Description:** Returns a list of all services in the system.

**Response Format:**
```json
{
  "success": true,
  "response": [
    { "id": 1, "name": "merchant-svc" },
    { "id": 2, "name": "cbs-transactions" },
    { "id": 3, "name": "payout-svc" },
    { "id": 4, "name": "cbs-fd" },
    { "id": 5, "name": "cbs-loan" },
    { "id": 6, "name": "cbs-admin"}
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "response": {
    "message": "Error"
  }
}
```

## 2. Get Pages by Service

**Endpoint:** `GET /api/page/:svc_id`

**Description:** Returns all pages for a specific service, organized by weekly pages with associated files.

**Parameters:**
- `svc_id` (path parameter): The service ID

**Response Format:**
```json
{
  "success": true,
  "response": [
    {
      "id": 1001,
      "weekStart": "2024-01-01",
      "weekEnd": "2024-01-07",
      "title": "Week 1 - Jan 1-7",
      "weeklyFile": {
        "id": 1000,
        "name": "week_summary_2024_01_01-07.log",
        "date": "2024-01-07"
      },
      "files": [
        { "id": 101, "name": "2024-01-01.log", "date": "2024-01-01" },
        { "id": 102, "name": "2024-01-02.log", "date": "2024-01-02" },
        { "id": 103, "name": "2024-01-03.log", "date": "2024-01-03" },
        { "id": 104, "name": "2024-01-04.log", "date": "2024-01-04" },
        { "id": 105, "name": "2024-01-05.log", "date": "2024-01-05" },
        { "id": 106, "name": "2024-01-06.log", "date": "2024-01-06" },
        { "id": 107, "name": "2024-01-07.log", "date": "2024-01-07" }
      ]
    },
    {
      "id": 1002,
      "weekStart": "2024-01-08",
      "weekEnd": "2024-01-14",
      "title": "Week 2 - Jan 8-14",
      "weeklyFile": {
        "id": 1020,
        "name": "week_summary_2024_01_08-14.log",
        "date": "2024-01-14"
      },
      "files": [
        { "id": 108, "name": "2024-01-08.log", "date": "2024-01-08" },
        { "id": 109, "name": "2024-01-09.log", "date": "2024-01-09" },
        { "id": 110, "name": "2024-01-10.log", "date": "2024-01-10" },
        { "id": 111, "name": "2024-01-11.log", "date": "2024-01-11" },
        { "id": 112, "name": "2024-01-12.log", "date": "2024-01-12" },
        { "id": 113, "name": "2024-01-13.log", "date": "2024-01-13" },
        { "id": 114, "name": "2024-01-14.log", "date": "2024-01-14" }
      ]
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "response": {
    "message": "Error"
  }
}
```

## Implementation Details

### Service Listing
- The service listing endpoint uses `ServiceService.getAllServicesForAPI()` method
- The service layer transforms the database response to match the required format
- Only `id` and `name` fields are returned (where `name` maps to `service_name` from the database)
- Error responses follow the standardized format with `success: false` and `response.message`

### Pages by Service
- The pages endpoint uses `PageService.getPagesByServiceForAPI()` method
- The service layer handles all business logic including:
  - **Week Definition**: Monday to Sunday (not Sunday to Saturday)
  - **Two Scenarios**:
    1. **If weekly pages exist**: Use them as the base and group daily pages accordingly
    2. **If no weekly pages exist**: Create week structures based on available daily pages
  - For each week, generating:
    - Week start (Monday) and end (Sunday) dates
    - A title in the format "Week N - Month Day-Day"
    - A weekly summary file with appropriate naming
    - Files array containing actual daily pages that belong to that week
- **Files are based on real daily pages created during the week, not mock data**
- File IDs correspond to actual daily page IDs from the database
- Date formats follow the YYYY-MM-DD pattern as specified
- **Generated IDs**: When no weekly pages exist, week structures get generated IDs (10000+)

### Architecture
- **Controllers**: Handle HTTP requests/responses, validation, and error formatting
- **Services**: Contain all business logic, data transformation, and complex operations
- **Repositories**: Handle data access and database operations
- This follows clean architecture principles with proper separation of concerns

### Error Handling
- All endpoints return consistent error response format
- Invalid service IDs result in appropriate error messages
- Database errors are caught and formatted according to the specification

## Testing

To test the API endpoints, run:
```bash
npm run test-api
```

This will test both endpoints and verify the response formats match the specification.

## Available Endpoints

1. **GET /api/service** - List all services
2. **GET /api/page/:svc_id** - Get pages by service ID
3. **GET /api/page/:page_id** - Get page with metrics (existing)
4. **POST /api/page** - Create page and trigger metrics (existing)

## Notes

- The file structure (weeklyFile and files) is generated based on the weekly pages in the database
- **Files array contains actual daily pages that were created during the corresponding week**
- **Week Definition**: Monday to Sunday (not Sunday to Saturday)
- **Fallback Logic**: If no weekly pages exist, week structures are created from available daily pages
- If no weekly pages exist for a service, week structures are generated from daily pages
- If no daily pages exist for a week, the files array will be empty
- File names follow the pattern specified in the API documentation
- All dates are formatted as YYYY-MM-DD strings
- Weekly reports are generated at the end of the week, while daily reports are generated throughout the week
- **Generated IDs**: Week structures created from daily pages get generated IDs (10000+) since no actual weekly page exists 