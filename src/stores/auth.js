import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http } from '@/api/http'
import { API_ROUTES } from '@/api/endpoints'
import { DEFAULTS, STORAGE_KEYS } from '@/config'
import { getJsonStorage, getStorage, removeStorage, setJsonStorage, setStorage } from '@/utils'

export const useAuthStore = defineStore('auth', () => {
  // A token in localStorage means "remember me"; in sessionStorage it's session-only.
  const remember = ref(!!getStorage(STORAGE_KEYS.AUTH_TOKEN))
  const token = ref(
    getStorage(STORAGE_KEYS.AUTH_TOKEN) || getStorage(STORAGE_KEYS.AUTH_TOKEN, '', true) || '',
  )
  const user = ref(
    getJsonStorage(STORAGE_KEYS.AUTH_USER) ?? getJsonStorage(STORAGE_KEYS.AUTH_USER, null, true),
  )

  const isAuthenticated = computed(() => !!token.value)

  function persist() {
    // session=true → sessionStorage (cleared on browser close); false → localStorage.
    const session = !remember.value
    // Clear both stores first so the token never lingers in the wrong place.
    removeStorage(STORAGE_KEYS.AUTH_TOKEN)
    removeStorage(STORAGE_KEYS.AUTH_TOKEN, true)
    removeStorage(STORAGE_KEYS.AUTH_USER)
    removeStorage(STORAGE_KEYS.AUTH_USER, true)
    if (token.value) setStorage(STORAGE_KEYS.AUTH_TOKEN, token.value, session)
    if (user.value) setJsonStorage(STORAGE_KEYS.AUTH_USER, user.value, session)
  }

  async function login({ email, password, remember: rememberMe = true }) {
    remember.value = rememberMe
    try {
      // Documented backend: POST /auth/admin/login -> { status, message, data: { access_token } }
      const res = await http.post(API_ROUTES.auth.login, { email, password })
      if (res.data?.status === false) {
        throw { status: 401, message: res.data?.message || 'Invalid credentials.' }
      }
      token.value = res.data?.data?.access_token || ''
      user.value = { name: DEFAULTS.USER_NAME, email }
    } catch (err) {
      throw err
    }
    persist()
    // Pull the real profile (name, email, role) now that we have a token.
    fetchProfile()
    return user.value
  }

  async function fetchProfile() {
    if (!token.value) return null
    try {
      const res = await http.get(API_ROUTES.auth.profile)
      const data = res.data?.data ?? res.data
      if (data) {
        user.value = data
        persist()
      }
    } catch {
      /* ignore — keep whatever user we have */
    }
    return user.value
  }

  async function logout() {
    try {
      await http.post(API_ROUTES.auth.logout)
    } catch {
      /* ignore — clear locally regardless */
    }
    token.value = ''
    user.value = null
    persist()
  }

  return { token, user, isAuthenticated, login, logout, fetchProfile }
})
