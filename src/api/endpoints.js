export const API_ROUTES = {
  auth: {
    login: '/auth/admin/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  factories: {
    list: '/factories',
    item: (id) => `/factories/${id}`,
  },
  employees: {
    list: '/employees',
    item: (id) => `/employees/${id}`,
  },
  logs: {
    list: '/logs',
  },
  dashboard: {
    get: '/dashboard',
  },
}
