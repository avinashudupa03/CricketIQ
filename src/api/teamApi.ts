import api from './axios';

export const teamApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/teams', { params }),

  getById: (id: string) =>
    api.get(`/teams/${id}`),

  create: (data: Record<string, unknown>) =>
    api.post('/teams', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/teams/${id}`, data),

  addPlayer: (teamId: string, playerId: string) =>
    api.post(`/teams/${teamId}/players`, { playerId }),

  removePlayer: (teamId: string, playerId: string) =>
    api.delete(`/teams/${teamId}/players`, { data: { playerId } }),

  delete: (id: string) =>
    api.delete(`/teams/${id}`),
};
