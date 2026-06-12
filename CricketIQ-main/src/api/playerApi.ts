import api from './axios';

export const playerApi = {
  getAll: (params?: { search?: string; role?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/players', { params }),

  getById: (id: string) =>
    api.get(`/players/${id}`),

  getStats: () =>
    api.get('/players/stats'),

  create: (data: Record<string, unknown>) =>
    api.post('/players', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/players/${id}`, data),

  delete: (id: string) =>
    api.delete(`/players/${id}`),
};
