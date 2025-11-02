import { get, post, put, del } from './api.js';

export const applicationService = {
  createApplication: async (applicationData) => {
    return await post('/adoptions', applicationData);
  },

  getUserApplications: async () => {
    return await get('/adoptions/my-applications');
  },

  getAllApplications: async (params = {}) => {
    return await get('/adoptions/admin/all', params);
  },

  getApplicationById: async (id) => {
    return await get(`/adoptions/${id}`);
  },

  updateApplicationStatus: async (id, status) => {
    return await put(`/adoptions/admin/${id}/status`, { status });
  },

  deleteApplication: async (id) => {
    return await del(`/adoptions/${id}`);
  },
};
