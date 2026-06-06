import axios from 'axios';

const API_BASE_URL = localStorage.getItem('api_url') || 'https://parlitech.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Debate APIs
export const debateAPI = {
  start: (topic) => api.post('/debate/start', { topic }),
  getStatus: () => api.get('/debate/status'),
  getTranscript: () => api.get('/debate/transcript'),
  reset: () => api.post('/debate/reset'),
};

// Report APIs
export const reportAPI = {
  generatePDF: (debateData) => api.post('/reports/pdf', debateData, { responseType: 'blob' }),
  generateExcel: (debateData) => api.post('/reports/excel', debateData, { responseType: 'blob' }),
  generateCSV: (debateData) => api.post('/reports/csv', debateData, { responseType: 'blob' }),
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settings) => api.post('/settings', settings),
};

// Bill APIs
export const billAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bill/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Agent APIs
export const agentAPI = {
  getAll: () => api.get('/agents'),
  getByRole: (role) => api.get(`/agents/${role}`),
  getRoles: () => api.get('/agents/roles'),
};

export default api;