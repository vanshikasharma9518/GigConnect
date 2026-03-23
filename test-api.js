const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing API connection...');
    
    // Test the root endpoint
    const rootResponse = await axios.get('http://localhost:5000');
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test user registration
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Use timestamp to ensure unique email
      password: 'password123',
      phone: '1234567890',
      age: 25,
      skills: ['JavaScript'],
      location: {
        country: 'US',
        state: 'CA',
        city: 'San Francisco'
      }
    };
    
    console.log('Attempting to register user with data:', userData);
    const registerResponse = await axios.post('http://localhost:5000/api/users', userData);
    console.log('Registration successful!');
    console.log('User data:', registerResponse.data);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('API test failed:');
    
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.error('Cannot connect to the server. Please make sure the backend server is running.');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testApi(); 