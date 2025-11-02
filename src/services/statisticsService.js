import { get } from './api.js';

export const statisticsService = {
  getDashboardStats: async () => {
    return await get('/statistics/dashboard');
  },

  getApplicationStats: async () => {
    return await get('/statistics/applications');
  },

  getPetStats: async () => {
    return await get('/statistics/pets');
  },

  getUserStats: async () => {
    return await get('/statistics/users');
  },
};

