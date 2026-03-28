import api from './api'

export const contentService = {
  getAll: async () => {
    const response = await api.get('/content')
    return response.data
  },

  getByKey: async (key) => {
    const response = await api.get(`/content/${key}`)
    return response.data
  },

  createOrUpdate: async (key, value) => {
    const response = await api.post('/content', { key, value })
    return response.data
  },

  delete: async (key) => {
    const response = await api.delete(`/content/${key}`)
    return response.data
  },
}
