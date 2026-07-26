import axios from 'axios'

// Same env var as src/services/api.js — keeps both API clients pointed at the same backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance for CMS API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cms_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 / token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('cms_refresh_token')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken })

          if (data.success) {
            localStorage.setItem('cms_access_token', data.data.accessToken)
            localStorage.setItem('cms_refresh_token', data.data.refreshToken)

            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed — clear tokens and redirect to login
          localStorage.removeItem('cms_access_token')
          localStorage.removeItem('cms_refresh_token')
          localStorage.removeItem('cms_user')
          window.location.href = '/cms'
          return Promise.reject(refreshError)
        }
      }

      // No refresh token — redirect to login
      localStorage.removeItem('cms_access_token')
      localStorage.removeItem('cms_refresh_token')
      localStorage.removeItem('cms_user')
      window.location.href = '/cms'
    }

    return Promise.reject(error)
  }
)

export default api
