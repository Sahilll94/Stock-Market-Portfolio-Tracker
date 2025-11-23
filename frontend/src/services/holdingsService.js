import api from './api';

export const holdingsService = {
  getAll: () => api.get('/holdings'),
  getById: (id) => api.get(`/holdings/${id}`),
  create: (data) => api.post('/holdings', data),
  update: (id, data) => api.put(`/holdings/${id}`, data),
  delete: (id) => api.delete(`/holdings/${id}`),
};

export default holdingsService;
