import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: List all services
    console.log('1. Testing GET /api/service (List all services)...');
    try {
      const servicesResponse = await axios.get(`${BASE_URL}/service`);
      console.log('✅ Services API response:');
      console.log('   Status:', servicesResponse.status);
      console.log('   Success:', servicesResponse.data.success);
      console.log('   Response format:', servicesResponse.data.response ? 'Correct' : 'Incorrect');
      console.log('   Number of services:', servicesResponse.data.response?.length || 0);
      console.log('');
    } catch (error: any) {
      console.log('❌ Services API failed:', error.message);
      console.log('');
    }

    // Test 2: Get pages by service (assuming service ID 1 exists)
    console.log('2. Testing GET /api/page/1 (Get pages by service)...');
    try {
      const pagesResponse = await axios.get(`${BASE_URL}/page/1`);
      console.log('✅ Pages API response:');
      console.log('   Status:', pagesResponse.status);
      console.log('   Success:', pagesResponse.data.success);
      console.log('   Response format:', pagesResponse.data.response ? 'Correct' : 'Incorrect');
      console.log('   Number of weekly pages:', pagesResponse.data.response?.length || 0);
      
      if (pagesResponse.data.response && pagesResponse.data.response.length > 0) {
        const firstPage = pagesResponse.data.response[0];
        console.log('   First page structure:');
        console.log('     - Has id:', !!firstPage.id);
        console.log('     - Has weekStart:', !!firstPage.weekStart);
        console.log('     - Has weekEnd:', !!firstPage.weekEnd);
        console.log('     - Has title:', !!firstPage.title);
        console.log('     - Has weeklyFile:', !!firstPage.weeklyFile);
        console.log('     - Has files:', !!firstPage.files);
        console.log('     - Number of files:', firstPage.files?.length || 0);
      }
      console.log('');
    } catch (error: any) {
      console.log('❌ Pages API failed:', error.message);
      console.log('');
    }

    // Test 3: Test error response format
    console.log('3. Testing error response format (invalid service ID)...');
    try {
      await axios.get(`${BASE_URL}/page/999999`);
    } catch (error: any) {
      if (error.response) {
        console.log('✅ Error response format:');
        console.log('   Status:', error.response.status);
        console.log('   Success:', error.response.data.success);
        console.log('   Has response.message:', !!error.response.data.response?.message);
        console.log('   Error message:', error.response.data.response?.message);
      } else {
        console.log('❌ Unexpected error format');
      }
    }
    console.log('');

    console.log('🎉 API endpoint tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAPIEndpoints().catch(console.error); 