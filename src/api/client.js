import axios from 'axios'
import { API_BASE_URL, HTTP_HEADERS, STORAGE_KEYS, URL_PATHS } from '@/config'

/**
 * Central axios instance. All resource services build on top of this.
 * Configure the base URL via VITE_API_BASE_URL.
 */
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: HTTP_HEADERS.ACCEPT,
    'Content-Type': HTTP_HEADERS.CONTENT_TYPE,
  },

})

// Attach a bearer token if one was stored at login (persistent or session-only).
client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
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
    if (status === 401 && !window.location.pathname.startsWith(URL_PATHS.LOGIN)) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      // Soft redirect; router guard will also catch this.
      window.location.assign(URL_PATHS.LOGIN)
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
