import client from './client'
import { mockApi } from './mock'

// When true, always use in-memory mock data (no network calls).
const FORCE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

/**
 * Try the real API; if the backend is unreachable (network error, no response)
 * fall back to mock data so the UI is always demoable. Real HTTP errors
 * (422 validation, 404, etc.) are re-thrown so the UI can handle them.
 */
async function withFallback(apiCall, mockCall) {
  if (FORCE_MOCKS) return mockCall()
  try {
    return await apiCall()
  } catch (err) {
    const unreachable = !err?.status // no HTTP response => network/CORS/offline
    if (unreachable) {
      if (import.meta.env.DEV) {
        console.warn('[api] backend unreachable — using mock data.', err?.message)
      }
      return mockCall()
    }
    throw err
  }
}

// Laravel resource responses are often wrapped in `{ data: ... }`.
const unwrap = (res) => res.data?.data ?? res.data

export const factoriesApi = {
  list: (params) =>
    withFallback(
      () => client.get('/factories', { params }).then(unwrap),
      () => mockApi.listFactories(),
    ),
  get: (id) =>
    withFallback(
      () => client.get(`/factories/${id}`).then(unwrap),
      () => mockApi.getFactory(id),
    ),
  create: (payload) =>
    withFallback(
      () => client.post('/factories', payload).then(unwrap),
      () => mockApi.createFactory(payload),
    ),
  update: (id, payload) =>
    withFallback(
      () => client.put(`/factories/${id}`, payload).then(unwrap),
      () => mockApi.updateFactory(id, payload),
    ),
  remove: (id) =>
    withFallback(
      () => client.delete(`/factories/${id}`).then(() => true),
      () => mockApi.deleteFactory(id),
    ),
}

export const employeesApi = {
  list: (params) =>
    withFallback(
      () => client.get('/employees', { params }).then(unwrap),
      () => mockApi.listEmployees(),
    ),
  get: (id) =>
    withFallback(
      () => client.get(`/employees/${id}`).then(unwrap),
      () => mockApi.getEmployee(id),
    ),
  create: (payload) =>
    withFallback(
      () => client.post('/employees', payload).then(unwrap),
      () => mockApi.createEmployee(payload),
    ),
  update: (id, payload) =>
    withFallback(
      () => client.put(`/employees/${id}`, payload).then(unwrap),
      () => mockApi.updateEmployee(id, payload),
    ),
  remove: (id) =>
    withFallback(
      () => client.delete(`/employees/${id}`).then(() => true),
      () => mockApi.deleteEmployee(id),
    ),
}

export const activityApi = {
  list: (params) =>
    withFallback(
      () => client.get('/activity-log', { params }).then(unwrap),
      () => mockApi.listActivity(),
    ),
}
