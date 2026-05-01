import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Endpoints Service
export const endpointService = {
  // Get all endpoints
  getAll: () => api.get('/monitor/endpoints/'),

  // Get single endpoint
  getById: (id) => api.get(`/monitor/endpoints/${id}/`),

  // Create new endpoint
  create: (data) => api.post('/monitor/endpoints/', data),

  // Update endpoint
  update: (id, data) => api.put(`/monitor/endpoints/${id}/`, data),

  // Delete endpoint
  delete: (id) => api.delete(`/monitor/endpoints/${id}/`),

  // Activate monitoring
  activateMonitoring: (id) => 
    api.post(`/monitor/endpoints/${id}/activate_monitoring/`),

  // Pause monitoring
  pauseMonitoring: (id) => 
    api.post(`/monitor/endpoints/${id}/pause_monitoring/`),

  // Get performance history
  getPerformanceHistory: (id, hours = 24) =>
    api.get(`/monitor/endpoints/${id}/performance_history/?hours=${hours}`),

  // Get statistics
  getStats: (id, hours = 24) =>
    api.get(`/monitor/endpoints/${id}/stats/?hours=${hours}`),
};

// Performance Metrics Service
export const metricService = {
  // Get all metrics
  getAll: () => api.get('/monitor/metrics/'),

  // Get recent metrics
  getRecent: (minutes = 60) =>
    api.get(`/monitor/metrics/recent/?minutes=${minutes}`),

  // Get alert metrics
  getAlerts: () => api.get('/monitor/metrics/alerts/'),

  // Get metrics by endpoint
  getByEndpoint: (endpointId) =>
    api.get(`/monitor/metrics/?endpoint=${endpointId}`),
};

// Alerts Service
export const alertService = {
  // Get all alerts
  getAll: () => api.get('/monitor/alerts/'),

  // Get single alert
  getById: (id) => api.get(`/monitor/alerts/${id}/`),

  // Get active alerts
  getActive: () => api.get('/monitor/alerts/active/'),

  // Acknowledge alert
  acknowledge: (id) => 
    api.post(`/monitor/alerts/${id}/acknowledge/`),

  // Resolve alert
  resolve: (id) => 
    api.post(`/monitor/alerts/${id}/resolve/`),

  // Get alerts by endpoint
  getByEndpoint: (endpointId) =>
    api.get(`/monitor/alerts/?endpoint=${endpointId}`),
};

// Dashboard Service
export const dashboardService = {
  // Get dashboard summary
  getSummary: () => api.get('/dashboard/summary/'),

  // Get trending data
  getTrendingData: (hours = 24) =>
    api.get(`/dashboard/trending/?hours=${hours}`),

  // Get summary with specific hours
  getSummaryByHours: (hours = 24) =>
    api.get(`/dashboard/summary/?hours=${hours}`),
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.detail || error.response.data?.message || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Check your connection.',
      data: null,
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      data: null,
    };
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any headers or tokens here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.warn('Unauthorized - redirecting to login');
      // You can redirect to login page here
    }
    return Promise.reject(error);
  }
);

export default api;