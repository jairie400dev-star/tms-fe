import axios from 'axios'

/**
 * Central axios instance. All resource services build on top of this.
 * Configure the base URL via VITE_API_BASE_URL (see .env.example).
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // Send cookies for session/Sanctum-style auth. Harmless for token auth.
  withCredentials: true,
})

// Attach a bearer token if one was stored at login.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalise errors and handle expired sessions in one place.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('auth_token')
      // Soft redirect; router guard will also catch this.
      window.location.assign('/login')
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors || null,
      raw: error,
    })
  },
)

export default client
