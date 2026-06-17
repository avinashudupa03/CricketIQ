import api from './axios';

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),

  getProfile: () =>
    api.get('/api/auth/profile'),

  updateProfile: (data: Record<string, unknown>) =>
    api.put('/api/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/api/auth/change-password', data),
};