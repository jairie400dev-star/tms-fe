import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function persist() {
    if (token.value) localStorage.setItem('auth_token', token.value)
    else localStorage.removeItem('auth_token')
    if (user.value) localStorage.setItem('auth_user', JSON.stringify(user.value))
    else localStorage.removeItem('auth_user')
  }

  async function login({ email, password }) {
    try {
      // Expected backend: POST /login -> { token, user }
      const res = await client.post('/login', { email, password })
      token.value = res.data?.token || 'session'
      user.value = res.data?.user || { name: 'Admin', email }
    } catch (err) {
      // Backend unreachable: accept the seeded demo credentials offline.
      const unreachable = !err?.status
      const seeded = email === 'admin@admin.com' && password === 'password'
      if (unreachable && seeded) {
        token.value = 'demo-token'
        user.value = { name: 'Admin', email }
      } else if (unreachable) {
        throw { status: 0, message: 'Invalid credentials.' }
      } else {
        throw err
      }
    }
    persist()
    return user.value
  }

  async function logout() {
    try {
      await client.post('/logout')
    } catch {
      /* ignore — clear locally regardless */
    }
    token.value = ''
    user.value = null
    persist()
  }

  return { token, user, isAuthenticated, login, logout }
})
