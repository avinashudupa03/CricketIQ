import api from './axios';

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data: Record<string, unknown>) =>
    api.put('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};
