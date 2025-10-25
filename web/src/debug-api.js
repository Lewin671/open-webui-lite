// Debug API calls
import apiClient from './services/apiClient.js';

console.log('Testing API client...');

// Test login without auth
apiClient.post('/auth/login', {
    email: 'test@example.com',
    password: 'password123'
}).then(response => {
    console.log('Login successful:', response.data);
}).catch(error => {
    console.error('Login failed:', error.response?.data || error.message);
});

// Test models endpoint
apiClient.get('/models').then(response => {
    console.log('Models loaded:', response.data);
}).catch(error => {
    console.error('Models failed:', error.response?.data || error.message);
});
