import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'

export const useAuthStore = defineStore('cms-auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('cms_user') || 'null'))
  const accessToken = ref(localStorage.getItem('cms_access_token') || '')
  const loading = ref(false)
  const error = ref('')

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userRole = computed(() => user.value?.role || '')
  const userName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
  })

  // Actions
  async function login(email, password, rememberMe = false) {
    loading.value = true
    error.value = ''

    try {
      const { data } = await api.post('/auth/login', { email, password, rememberMe })

      if (data.success) {
        user.value = data.data.user
        accessToken.value = data.data.accessToken

        localStorage.setItem('cms_user', JSON.stringify(data.data.user))
        localStorage.setItem('cms_access_token', data.data.accessToken)
        localStorage.setItem('cms_refresh_token', data.data.refreshToken)

        return { success: true }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors during logout
    } finally {
      user.value = null
      accessToken.value = ''
      localStorage.removeItem('cms_user')
      localStorage.removeItem('cms_access_token')
      localStorage.removeItem('cms_refresh_token')
    }
  }

  async function fetchUser() {
    try {
      const { data } = await api.get('/auth/me')
      if (data.success) {
        user.value = data.data
        localStorage.setItem('cms_user', JSON.stringify(data.data))
      }
    } catch {
      // Token might be invalid
      await logout()
    }
  }

  function clearError() {
    error.value = ''
  }

  return {
    user, accessToken, loading, error,
    isAuthenticated, userRole, userName, userInitials,
    login, logout, fetchUser, clearError,
  }
})
