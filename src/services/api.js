import axios from 'axios'

// In dev, Vite proxies /api -> http://localhost:5000 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend, e.g.
// https://ac-cms-backend.onrender.com/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const submitContactForm = async (payload) => {
  const { data } = await api.post('/contact', payload)
  return data
}

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post('/newsletter', { email })
  return data
}

export default api
