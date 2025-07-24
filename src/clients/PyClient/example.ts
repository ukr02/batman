import { PyClient, createPyClient, pyClient } from './index';

// Example 1: Using the default instance
export async function exampleWithDefaultClient() {
  try {
    // GET request
    const response = await pyClient.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('GET Response:', response.data);

    // POST request
    const postData = {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    };
    const postResponse = await pyClient.post('https://jsonplaceholder.typicode.com/posts', postData);
    console.log('POST Response:', postResponse.data);

  } catch (error) {
    console.error('Error with default client:', error);
  }
}

// Example 2: Creating a custom client with configuration
export async function exampleWithCustomClient() {
  // Create a client with custom configuration
  const customClient = createPyClient({
    baseURL: 'https://api.example.com',
    timeout: 10000, // 10 seconds
    retries: 2,
    headers: {
      'Authorization': 'Bearer your-token-here',
      'X-API-Key': 'your-api-key'
    }
  });

  try {
    // All requests will use the base URL
    const response = await customClient.get('/users');
    console.log('Custom client response:', response.data);

    // Override headers for this specific request
    const responseWithCustomHeaders = await customClient.get('/users', {
      headers: {
        'X-Custom-Header': 'custom-value'
      }
    });

  } catch (error) {
    console.error('Error with custom client:', error);
  }
}

// Example 3: Using different HTTP methods
export async function exampleAllMethods() {
  const client = new PyClient({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  try {
    // GET
    const getResponse = await client.get('/posts/1');
    console.log('GET:', getResponse.data);

    // POST
    const postResponse = await client.post('/posts', {
      title: 'New Post',
      body: 'Post body',
      userId: 1
    });
    console.log('POST:', postResponse.data);

    // PUT
    const putResponse = await client.put('/posts/1', {
      id: 1,
      title: 'Updated Post',
      body: 'Updated body',
      userId: 1
    });
    console.log('PUT:', putResponse.data);

    // DELETE
    const deleteResponse = await client.delete('/posts/1');
    console.log('DELETE:', deleteResponse.data);

    // PATCH
    const patchResponse = await client.patch('/posts/1', {
      title: 'Patched Title'
    });
    console.log('PATCH:', patchResponse.data);

  } catch (error) {
    console.error('Error with all methods:', error);
  }
}

// Example 4: Error handling and retries
export async function exampleErrorHandling() {
  const client = createPyClient({
    retries: 3,
    retryDelay: 1000,
    timeout: 5000
  });

  try {
    // This will fail and retry
    const response = await client.get('https://httpstat.us/500');
    console.log('Response after retries:', response);
  } catch (error) {
    console.log('Expected error after all retries:', error.message);
  }
}

// Example 5: Working with different response types
export async function exampleResponseTypes() {
  try {
    // JSON response
    const jsonResponse = await pyClient.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('JSON response type:', typeof jsonResponse.data);

    // Text response
    const textResponse = await pyClient.get('https://httpstat.us/200', {
      headers: { 'Accept': 'text/plain' }
    });
    console.log('Text response type:', typeof textResponse.data);

  } catch (error) {
    console.error('Error with response types:', error);
  }
}

// Example 6: Dynamic configuration
export async function exampleDynamicConfig() {
  const client = new PyClient();

  // Set base URL dynamically
  client.setBaseURL('https://jsonplaceholder.typicode.com');

  // Set default headers dynamically
  client.setDefaultHeaders({
    'X-Request-ID': 'unique-request-id',
    'User-Agent': 'PyClient/1.0'
  });

  try {
    const response = await client.get('/posts/1');
    console.log('Dynamic config response:', response.data);
    console.log('Current config:', client.getConfig());
  } catch (error) {
    console.error('Error with dynamic config:', error);
  }
}

// Run examples
export async function runExamples() {
  console.log('=== PyClient Examples ===\n');

  console.log('1. Default Client Example:');
  await exampleWithDefaultClient();
  console.log('\n');

  console.log('2. Custom Client Example:');
  await exampleWithCustomClient();
  console.log('\n');

  console.log('3. All HTTP Methods Example:');
  await exampleAllMethods();
  console.log('\n');

  console.log('4. Error Handling Example:');
  await exampleErrorHandling();
  console.log('\n');

  console.log('5. Response Types Example:');
  await exampleResponseTypes();
  console.log('\n');

  console.log('6. Dynamic Configuration Example:');
  await exampleDynamicConfig();
  console.log('\n');

  console.log('=== Examples Complete ===');
} 