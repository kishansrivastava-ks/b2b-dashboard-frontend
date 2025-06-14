import api from './api'
import Cookies from 'js-cookie'

const USER_KEY = 'user' // localStorage key for storing user data

export const authService = {
  // Login with email & password
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials, {
        withCredentials: true, // important: to include cookies
      })
      // console.log('Data from backend', response.data.user)
      this.setUser(response.data.user)
      return response.data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed!'
      console.error('Login error:', error)
      throw new Error(message)
    }
  },

  // Signup
  async signup(data) {
    try {
      const response = await api.post('/auth/signup', data, {
        withCredentials: true,
      })
      this.setUser(response.data.user)
      return response.data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed!'
      console.error('Signup error:', message)
      throw new Error(message)
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true })
      this.clearUser()
    } catch (error) {
      console.error('Logout error:', error.message)
    }
  },

  // Forgot Password
  async forgotPassword(email) {
    try {
      const res = await api.post('/auth/forgot-password', { email })
      return res.data
    } catch (error) {
      const message = error.response?.data?.message || 'Request failed'
      throw new Error(message)
    }
  },

  // Reset Password
  async resetPassword(token, data) {
    try {
      const res = await api.post(`/auth/reset-password/${token}`, data)
      return res.data
    } catch (error) {
      const message = error.response?.data?.message || 'Reset failed'
      throw new Error(message)
    }
  },

  // Change Password (authenticated)
  async changePassword(data) {
    try {
      const res = await api.put('/auth/change-password', data, {
        withCredentials: true,
      })
      return res.data
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed'
      throw new Error(message)
    }
  },

  // Set user in localStorage
  setUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  },

  getUser() {
    const userStr = localStorage.getItem(USER_KEY)
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch (err) {
      console.error('Error parsing user data', err)
      return null
    }
  },

  clearUser() {
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated() {
    return !!Cookies.get('token') // JWT cookie present?
  },
}
