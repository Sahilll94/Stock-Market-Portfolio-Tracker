import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getDistribution: () => api.get('/dashboard/distribution'),
  getPerformance: (days = 30) => api.get(`/dashboard/performance?days=${days}`),
};

export default dashboardService;
