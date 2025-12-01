import axios from 'axios';

// Change this to your backend URL
// For development: Use your computer's IP address
// For production: Use your deployed backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://10.90.35.221:5000/api' // Your computer's IP address - UPDATE THIS if your IP changes
  : 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Verify QR Code
export const verifyQRCode = async (code) => {
  try {
    const response = await api.get(`/verify?code=${encodeURIComponent(code)}`);
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api;

