import { get, post } from './api.js';

export const authService = {
  register: async (userData) => {
    return await post('/auth/register', userData);
  },

  login: async (credentials) => {
    return await post('/auth/login', credentials);
  },

  logout: async () => {
    return await post('/auth/logout');
  },

  getCurrentUser: async () => {
    return await get('/auth/me');
  },
};

