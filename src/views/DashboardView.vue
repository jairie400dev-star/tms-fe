<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import { factoriesApi, employeesApi, activityApi } from '@/api/resources'

const router = useRouter()
const factories = ref([])
const employees = ref([])
const activity = ref([])
const loading = ref(true)

const stats = computed(() => [
  { label: 'Factories', value: factories.value.length, icon: 'factory', to: 'factories' },
  { label: 'Employees', value: employees.value.length, icon: 'employees', to: 'employees' },
  { label: 'Locations', value: new Set(factories.value.map((f) => f.location)).size, icon: 'building', to: 'factories' },
  { label: 'Logged events', value: activity.value.length, icon: 'activity', to: 'activity' },
])

const recent = computed(() => activity.value.slice(0, 4))
const actionStyle = {
  created: 'bg-emerald-100 text-emerald-700',
  updated: 'bg-amber-100 text-amber-700',
  deleted: 'bg-rose-100 text-rose-700',
}

onMounted(async () => {
  try {
    const [f, e, a] = await Promise.all([factoriesApi.list(), employeesApi.list(), activityApi.list()])
    factories.value = f
    employees.value = e
    activity.value = a
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <PageHeader eyebrow="Overview" title="Dashboard" subtitle="A snapshot of your manufacturing network." />

    <!-- Stat cards -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="s in stats"
        :key="s.label"
        class="card flex items-center gap-4 p-5 text-left transition-shadow hover:shadow-md"
        @click="router.push({ name: s.to })"
      >
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
          <AppIcon :name="s.icon" :size="20" />
        </span>
        <div>
          <p class="font-serif text-3xl font-semibold leading-none text-ink">
            {{ loading ? '—' : s.value }}
          </p>
          <p class="mt-1 text-sm text-ink/50">{{ s.label }}</p>
        </div>
      </button>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <!-- Recent activity -->
      <section class="card p-6">
        <div class="flex items-center justify-between">
          <h2 class="font-serif text-xl font-semibold text-ink">Recent activity</h2>
          <router-link :to="{ name: 'activity' }" class="text-sm font-medium text-primary-600 hover:underline">
            View all
          </router-link>
        </div>
        <ul class="mt-4 divide-y divide-line/70">
          <li v-for="e in recent" :key="e.id" class="flex items-center gap-3 py-3">
            <span class="rounded-md px-2 py-0.5 text-xs font-semibold capitalize" :class="actionStyle[e.action]">
              {{ e.action }}
            </span>
            <span class="min-w-0 flex-1 truncate text-sm text-ink/75">{{ e.summary }}</span>
            <time class="shrink-0 font-mono text-xs text-ink/40">{{ e.created_at?.slice(5, 16) }}</time>
          </li>
          <li v-if="!loading && !recent.length" class="py-6 text-center text-sm text-ink/45">No activity yet.</li>
        </ul>
      </section>

      <!-- Quick actions -->
      <section class="card p-6">
        <h2 class="font-serif text-xl font-semibold text-ink">Quick actions</h2>
        <div class="mt-4 space-y-3">
          <button class="btn-outline w-full justify-start" @click="router.push({ name: 'factory-create' })">
            <AppIcon name="plus" :size="16" class="text-primary-600" /> New factory
          </button>
          <button class="btn-outline w-full justify-start" @click="router.push({ name: 'employee-create' })">
            <AppIcon name="plus" :size="16" class="text-primary-600" /> New employee
          </button>
          <button class="btn-outline w-full justify-start" @click="router.push({ name: 'activity' })">
            <AppIcon name="activity" :size="16" class="text-primary-600" /> View activity log
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
