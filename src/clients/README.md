# HTTP Clients

This directory contains all HTTP client implementations for making requests to external services.

## Available Clients

### PyClient

A robust, TypeScript HTTP client built with axios, following the same structure as the sampleentitystructure pattern.

**Features:**
- ✅ TypeScript Support with full type safety
- ✅ Axios-based for reliability
- ✅ Automatic retries with exponential backoff
- ✅ Request/response logging
- ✅ Configurable timeouts and headers
- ✅ Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH)

**Quick Start:**
```typescript
import { pyClient, createPyClient } from './clients';

// Using default instance
const response = await pyClient.get('https://api.example.com/users');

// Creating custom client
const client = createPyClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retries: 3
});
```

**Documentation:** See [PyClient/README.md](./PyClient/README.md) for detailed documentation.

## Directory Structure

```
src/clients/
├── index.ts              # Main exports for all clients
├── README.md             # This documentation
├── test-pyclient.ts      # Test script for PyClient
└── PyClient/             # PyClient implementation
    ├── types.ts          # Type definitions
    ├── index.ts          # Main PyClient class
    ├── example.ts        # Usage examples
    └── README.md         # PyClient documentation
```

## Usage

### Importing Clients

```typescript
// Import specific client
import { pyClient } from './clients/PyClient';

// Import all clients (recommended)
import { pyClient, createPyClient } from './clients';
```

### Running Tests

```bash
# Test PyClient
npm run test-pyclient

# Or run directly
npx ts-node src/clients/test-pyclient.ts
```

### Running Examples

```typescript
import { runExamples } from './clients';

// Run all PyClient examples
await runExamples();
```

## Adding New Clients

When adding new HTTP clients, follow this structure:

1. Create a new directory under `src/clients/` (e.g., `src/clients/NewClient/`)
2. Include the following files:
   - `types.ts` - Type definitions
   - `index.ts` - Main implementation
   - `example.ts` - Usage examples
   - `README.md` - Documentation
3. Export the client from `src/clients/index.ts`
4. Add any test files to the clients directory

## Best Practices

1. **Follow the Pattern**: Use the same structure as existing clients
2. **Type Safety**: Always provide TypeScript types
3. **Error Handling**: Implement proper error handling and retries
4. **Logging**: Include request/response logging for debugging
5. **Documentation**: Provide comprehensive documentation and examples
6. **Testing**: Include test files to verify functionality 