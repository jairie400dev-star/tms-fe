export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  REMEMBER_EMAIL: 'remember_email',
}

export const ROUTE_NAMES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  FACTORIES: 'factories',
  FACTORY_CREATE: 'factory-create',
  FACTORY_EDIT: 'factory-edit',
  EMPLOYEES: 'employees',
  EMPLOYEE_CREATE: 'employee-create',
  EMPLOYEE_EDIT: 'employee-edit',
  ACTIVITY: 'activity',
}

export const DEFAULTS = {
  USER_NAME: 'Admin',
  USER_EMAIL: 'admin@admin.com',
  DEMO_CREDENTIALS: { email: 'admin@admin.com', password: 'password' },
}

export const URL_PATHS = {
  LOGIN: '/login',
}

export const HTTP_HEADERS = {
  ACCEPT: 'application/json',
  CONTENT_TYPE: 'application/json',
}
