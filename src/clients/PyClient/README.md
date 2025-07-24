# PyClient HTTP Client

A robust, TypeScript HTTP client built with axios, following the same structure as the sampleentitystructure pattern.

## Structure

```
src/clients/PyClient/
├── types.ts          # Type definitions and interfaces
├── index.ts          # Main PyClient class implementation
├── example.ts        # Usage examples
└── README.md         # This documentation
```

## Features

- ✅ **TypeScript Support** - Full type safety with generic response types
- ✅ **Axios-based** - Built on top of axios for reliability
- ✅ **Automatic Retries** - Configurable retry logic with exponential backoff
- ✅ **Request/Response Logging** - Built-in logging for debugging
- ✅ **Timeout Handling** - Configurable request timeouts
- ✅ **Base URL Support** - Set a base URL for all requests
- ✅ **Custom Headers** - Set default and per-request headers
- ✅ **Error Handling** - Comprehensive error handling with detailed error messages
- ✅ **Multiple HTTP Methods** - GET, POST, PUT, DELETE, PATCH support
- ✅ **Response Parsing** - Automatic JSON/text response parsing
- ✅ **Interceptors** - Request and response interceptors for logging

## Installation

The PyClient requires axios as a dependency:

```bash
npm install axios
```

## Basic Usage

### Using the Default Instance

```typescript
import { pyClient } from './clients/PyClient';

// GET request
const response = await pyClient.get('https://api.example.com/users');
console.log(response.data);

// POST request
const userData = { name: 'John Doe', email: 'john@example.com' };
const postResponse = await pyClient.post('https://api.example.com/users', userData);
console.log(postResponse.data);
```

### Creating a Custom Client

```typescript
import { createPyClient } from './clients/PyClient';

const client = createPyClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retries: 3,
  headers: {
    'Authorization': 'Bearer your-token',
    'X-API-Key': 'your-api-key'
  }
});

// All requests will use the base URL
const response = await client.get('/users');
```

## Configuration Options

### PyClientConfig Interface

```typescript
interface PyClientConfig {
  baseURL?: string;           // Base URL for all requests
  timeout?: number;           // Request timeout in milliseconds (default: 30000)
  headers?: Record<string, string>; // Default headers
  retries?: number;           // Number of retry attempts (default: 3)
  retryDelay?: number;        // Base delay between retries in milliseconds (default: 1000)
}
```

### Default Values

- **timeout**: 30 seconds
- **retries**: 3 attempts
- **retryDelay**: 1 second (with exponential backoff)
- **headers**: `Content-Type: application/json`, `Accept: application/json`

## HTTP Methods

### GET Request

```typescript
const response = await client.get('/users');
const responseWithOptions = await client.get('/users', {
  headers: { 'X-Custom-Header': 'value' },
  timeout: 5000
});
```

### POST Request

```typescript
const data = { name: 'John', email: 'john@example.com' };
const response = await client.post('/users', data);
const responseWithOptions = await client.post('/users', data, {
  headers: { 'Content-Type': 'application/xml' }
});
```

### PUT Request

```typescript
const updateData = { name: 'John Updated' };
const response = await client.put('/users/1', updateData);
```

### DELETE Request

```typescript
const response = await client.delete('/users/1');
```

### PATCH Request

```typescript
const patchData = { name: 'John Patched' };
const response = await client.patch('/users/1', patchData);
```

### Generic Request

```typescript
const response = await client.request({
  url: '/users',
  method: 'POST',
  data: { name: 'John' },
  headers: { 'X-Custom': 'value' },
  timeout: 5000
});
```

## Response Format

All methods return a `PyClientResponse<T>` object:

```typescript
interface PyClientResponse<T = any> {
  data: T;                    // Parsed response data
  status: number;             // HTTP status code
  statusText: string;         // HTTP status text
  headers: Record<string, string>; // Response headers
  ok: boolean;                // Whether the request was successful
}
```

## Error Handling

The client automatically handles errors and retries:

```typescript
try {
  const response = await client.get('/users');
  console.log(response.data);
} catch (error) {
  console.error('Request failed:', error.message);
  // Error message includes retry information
}
```

## Dynamic Configuration

You can modify the client configuration at runtime:

```typescript
const client = new PyClient();

// Set base URL
client.setBaseURL('https://api.example.com');

// Set default headers
client.setDefaultHeaders({
  'Authorization': 'Bearer new-token',
  'X-Request-ID': 'unique-id'
});

// Get current configuration
const config = client.getConfig();
console.log(config);
```

## Logging

The client provides built-in logging through axios interceptors:

```
[PyClient] GET https://api.example.com/users
[PyClient] Success: GET https://api.example.com/users - 200
```

For failed requests with retries:

```
[PyClient] get https://api.example.com/users (attempt 1/3)
[PyClient] Error on attempt 1: Request failed with status code 500
[PyClient] Retrying in 1000ms...
[PyClient] get https://api.example.com/users (attempt 2/3)
[PyClient] Success: GET https://api.example.com/users - 200
```

## Running Examples

To run the included examples:

```typescript
import { runExamples } from './clients/PyClient/example';

// Run all examples
await runExamples();
```

## Testing

To test the PyClient:

```bash
npm run test-pyclient
```

## TypeScript Support

The client is fully typed with TypeScript:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe response
const response = await client.get<User>('/users/1');
const user: User = response.data; // Fully typed
```

## Best Practices

1. **Use Base URLs**: Set a base URL for your API to avoid repeating the full URL
2. **Handle Errors**: Always wrap requests in try-catch blocks
3. **Set Appropriate Timeouts**: Adjust timeouts based on your API's response times
4. **Use Retries Wisely**: Don't set too many retries for operations that shouldn't be retried (like POST requests that create resources)
5. **Custom Headers**: Use custom headers for authentication and API versioning
6. **Follow the Pattern**: Use the same structure as other clients in the project 