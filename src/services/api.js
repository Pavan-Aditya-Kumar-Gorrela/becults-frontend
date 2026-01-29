const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios-like fetch wrapper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

// Auth API calls
export const authAPI = {
  signup: (userData) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  forgotPassword: (email) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email, otp) =>
    apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email, newPassword, confirmPassword) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, confirmPassword }),
    }),

  getCurrentUser: () =>
    apiCall('/auth/me', {
      method: 'GET',
    }),
};

export default authAPI;
