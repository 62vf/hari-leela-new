import api from './api'

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token)
      // Fetch and store admin user data separately
      const adminData = await authService.getCurrentAdmin();
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  },

  getCurrentAdmin: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken')
  },

  getAdminUser: () => {
    const user = localStorage.getItem('adminUser')
    return user ? JSON.parse(user) : null
  },
}
