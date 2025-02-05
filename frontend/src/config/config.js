// For mobile devices, we need to use the IP address instead of localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.0.196:5000';

// Warn if environment variable is not set
if (!process.env.EXPO_PUBLIC_API_URL) {
  console.warn('Warning: EXPO_PUBLIC_API_URL is not set in .env file, using fallback:', API_URL);
}

export { API_URL };
