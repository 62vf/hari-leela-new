import api from './api'

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  getFeatured: async () => {
    const response = await api.get('/categories/featured')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`)
    return response.data
  },

  create: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  update: async (id, formData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}
