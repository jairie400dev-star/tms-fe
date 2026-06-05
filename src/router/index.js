import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, layout: 'blank' },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
      { path: 'factories', name: 'factories', component: () => import('@/views/FactoriesView.vue') },
      { path: 'factories/new', name: 'factory-create', component: () => import('@/views/FactoryFormView.vue') },
      { path: 'factories/:id/edit', name: 'factory-edit', component: () => import('@/views/FactoryFormView.vue'), props: true },
      { path: 'employees', name: 'employees', component: () => import('@/views/EmployeesView.vue') },
      { path: 'employees/new', name: 'employee-create', component: () => import('@/views/EmployeeFormView.vue') },
      { path: 'employees/:id/edit', name: 'employee-edit', component: () => import('@/views/EmployeeFormView.vue'), props: true },
      { path: 'activity', name: 'activity', component: () => import('@/views/ActivityLogView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
