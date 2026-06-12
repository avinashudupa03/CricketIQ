import api from './axios';

export const matchApi = {
  getAll: (params?: { search?: string; status?: string; format?: string; page?: number; limit?: number }) =>
    api.get('/matches', { params }),

  getById: (id: string) =>
    api.get(`/matches/${id}`),

  getHistory: (team?: string) =>
    api.get('/matches/history', { params: { team } }),

  create: (data: Record<string, unknown>) =>
    api.post('/matches', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/matches/${id}`, data),

  updateScore: (id: string, data: { scoreA?: string; scoreB?: string; result?: string; status?: string }) =>
    api.put(`/matches/${id}/score`, data),

  delete: (id: string) =>
    api.delete(`/matches/${id}`),
};
