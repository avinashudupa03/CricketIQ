import api from './axios';

export const tournamentApi = {
  getAll: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/tournaments', { params }),

  getById: (id: string) =>
    api.get(`/tournaments/${id}`),

  getStandings: (id: string) =>
    api.get(`/tournaments/${id}/standings`),

  getFixtures: (id: string) =>
    api.get(`/tournaments/${id}/fixtures`),

  create: (data: Record<string, unknown>) =>
    api.post('/tournaments', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/tournaments/${id}`, data),

  updatePointsTable: (id: string, pointsTable: unknown[]) =>
    api.put(`/tournaments/${id}/points`, { pointsTable }),

  delete: (id: string) =>
    api.delete(`/tournaments/${id}`),
};
