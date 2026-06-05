import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/config'

const routes = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, layout: 'blank' },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: { name: ROUTE_NAMES.DASHBOARD } },
      { path: 'dashboard', name: ROUTE_NAMES.DASHBOARD, component: () => import('@/views/DashboardView.vue') },
      { path: 'factories', name: ROUTE_NAMES.FACTORIES, component: () => import('@/views/FactoriesView.vue') },
      { path: 'factories/new', name: ROUTE_NAMES.FACTORY_CREATE, component: () => import('@/views/FactoryFormView.vue') },
      { path: 'factories/:id/edit', name: ROUTE_NAMES.FACTORY_EDIT, component: () => import('@/views/FactoryFormView.vue'), props: true },
      { path: 'employees', name: ROUTE_NAMES.EMPLOYEES, component: () => import('@/views/EmployeesView.vue') },
      { path: 'employees/new', name: ROUTE_NAMES.EMPLOYEE_CREATE, component: () => import('@/views/EmployeeFormView.vue') },
      { path: 'employees/:id/edit', name: ROUTE_NAMES.EMPLOYEE_EDIT, component: () => import('@/views/EmployeeFormView.vue'), props: true },
      { path: 'activity', name: ROUTE_NAMES.ACTIVITY, component: () => import('@/views/ActivityLogView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Auth guard disabled to allow visiting the dashboard without logging in
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } }
  }
  if (to.name === ROUTE_NAMES.LOGIN && auth.isAuthenticated) {
    return { name: ROUTE_NAMES.DASHBOARD }
  }
})

export default router
