import { pyClient, createPyClient } from './PyClient';

async function testPyClient() {
  console.log('🧪 Testing PyClient HTTP Client...\n');

  try {
    // Test 1: Basic GET request
    console.log('1. Testing basic GET request...');
    const response = await pyClient.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('✅ GET request successful');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
    console.log('');

    // Test 2: POST request
    console.log('2. Testing POST request...');
    const postData = {
      title: 'Test Post from PyClient',
      body: 'This is a test post created by PyClient',
      userId: 1
    };
    const postResponse = await pyClient.post('https://jsonplaceholder.typicode.com/posts', postData);
    console.log('✅ POST request successful');
    console.log('   Status:', postResponse.status);
    console.log('   Created post ID:', postResponse.data.id);
    console.log('');

    // Test 3: Custom client with base URL
    console.log('3. Testing custom client with base URL...');
    const customClient = createPyClient({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      retries: 2
    });
    
    const customResponse = await customClient.get('/users/1');
    console.log('✅ Custom client request successful');
    console.log('   Status:', customResponse.status);
    console.log('   User name:', customResponse.data.name);
    console.log('');

    // Test 4: Error handling (404)
    console.log('4. Testing error handling (404)...');
    try {
      await pyClient.get('https://jsonplaceholder.typicode.com/nonexistent');
    } catch (error: any) {
      console.log('✅ Error handling works correctly');
      console.log('   Error:', error.message);
    }
    console.log('');

    // Test 5: Request with custom headers
    console.log('5. Testing request with custom headers...');
    const headerResponse = await pyClient.get('https://httpbin.org/headers', {
      headers: {
        'X-Test-Header': 'PyClient-Test',
        'User-Agent': 'PyClient/1.0'
      }
    });
    console.log('✅ Custom headers request successful');
    console.log('   Status:', headerResponse.status);
    console.log('   Headers received:', headerResponse.data.headers);
    console.log('');

    console.log('🎉 All tests passed! PyClient is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testPyClient().catch(console.error); 