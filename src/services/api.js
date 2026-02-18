const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    const error = new Error(data.message || 'An error occurred');
    error.response = {
      status: response.status,
      data: data,
    };
    throw error;
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

  adminLogin: (credentials) =>
    apiCall('/auth/admin/login', {
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

  updateProfile: (profileData) =>
    apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),
};

// OAuth API calls
export const oauthAPI = {
  googleCallback: (googleData) =>
    apiCall('/oauth/google/callback', {
      method: 'POST',
      body: JSON.stringify(googleData),
    }),

  githubCallback: (githubData) =>
    apiCall('/oauth/github/callback', {
      method: 'POST',
      body: JSON.stringify(githubData),
    }),
};

// Admin API calls
export const adminAPI = {
  getDashboard: () =>
    apiCall('/admin/dashboard', {
      method: 'GET',
    }),

  inviteAdmin: (email, password, fullName) =>
    apiCall('/admin/invite', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),
};

// Cohort API calls
export const cohortAPI = {
  getAllCohorts: (category = 'All') =>
    apiCall(`/cohorts${category !== 'All' ? `?category=${category}` : ''}`, {
      method: 'GET',
    }),

  getUpcomingCohorts: () =>
    apiCall('/cohorts/upcoming', {
      method: 'GET',
    }),

  getCohortById: (cohortId) =>
    apiCall(`/cohorts/${cohortId}`, {
      method: 'GET',
    }),

  getCohortDetails: (cohortId) =>
    apiCall(`/cohorts/${cohortId}/details`, {
      method: 'GET',
    }),

  enrollInCohort: (cohortId) =>
    apiCall(`/cohorts/${cohortId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  unenrollFromCohort: (cohortId) =>
    apiCall(`/cohorts/${cohortId}/unenroll`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  getUserEnrolledCohorts: () =>
    apiCall('/cohorts/user/enrolled', {
      method: 'GET',
    }),
};

// Channel API calls
export const channelAPI = {
  getChannelInfo: (channelKey) =>
    apiCall(`/channels/${channelKey}`, {
      method: 'GET',
    }),

  getChannelMessages: (channelKey, limit = 50, skip = 0) =>
    apiCall(`/channels/${channelKey}/messages?limit=${limit}&skip=${skip}`, {
      method: 'GET',
    }),

  sendMessage: (channelKey, text) =>
    apiCall(`/channels/${channelKey}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  muteUser: (channelKey, userId) =>
    apiCall(`/channels/${channelKey}/mute`, {
      method: 'PATCH',
      body: JSON.stringify({ userId }),
    }),

  unmuteUser: (channelKey, userId) =>
    apiCall(`/channels/${channelKey}/unmute`, {
      method: 'PATCH',
      body: JSON.stringify({ userId }),
    }),

  removeUserFromChannel: (channelKey, userId) =>
    apiCall(`/channels/${channelKey}/members/${userId}`, {
      method: 'DELETE',
    }),

  addUserToChannel: (channelKey, userId) =>
    apiCall(`/channels/${channelKey}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  // Admin channel management
  createChannel: (cohortId, description) =>
    apiCall(`/channels/admin/create`, {
      method: 'POST',
      body: JSON.stringify({ cohortId, description }),
    }),

  getAllCohortsForChannels: () =>
    apiCall(`/channels/admin/cohorts`, {
      method: 'GET',
    }),
};

export default authAPI;
