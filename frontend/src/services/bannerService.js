import api from './api'

export const bannerService = {
  getAll: async (activeOnly = true) => {
    const response = await api.get('/banners', {
      params: { active_only: activeOnly },
    })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/banners/${id}`)
    return response.data
  },

  create: async (formData) => {
    const response = await api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  update: async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/banners/${id}`)
    return response.data
  },
}
