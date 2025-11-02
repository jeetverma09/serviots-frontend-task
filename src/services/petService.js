import { get, post, put, del, postFormData, putFormData } from './api.js';

export const petService = {
  getPets: async (params = {}) => {
    return await get('/pets', params);
  },

  getPetById: async (id) => {
    return await get(`/pets/${id}`);
  },

  createPet: async (petData) => {
    if (petData instanceof FormData) {
      return await postFormData('/pets', petData);
    }
    return await post('/pets', petData);
  },

  updatePet: async (id, petData) => {
    if (petData instanceof FormData) {
      return await putFormData(`/pets/${id}`, petData);
    }
    return await put(`/pets/${id}`, petData);
  },

  deletePet: async (id) => {
    return await del(`/pets/${id}`);
  },
};

