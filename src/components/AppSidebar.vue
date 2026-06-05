<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'
import BrandMark from './BrandMark.vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  counts: { type: Object, default: () => ({ factories: null, employees: null }) },
})
defineEmits(['navigate'])

const router = useRouter()
const auth = useAuthStore()

const nav = computed(() => [
  { name: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'factories', label: 'Factories', icon: 'factory', badge: props.counts.factories },
  { name: 'employees', label: 'Employees', icon: 'employees', badge: props.counts.employees },
  { name: 'activity', label: 'Activity log', icon: 'activity' },
])

const initials = computed(() => {
  const n = auth.user?.name || 'Admin'
  return n.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
})

async function signOut() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="flex h-full w-[260px] flex-col bg-ink-900 text-white/80">
    <div class="px-5 py-6">
      <BrandMark variant="light" />
    </div>

    <nav class="flex-1 px-3">
      <p class="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
        Manage
      </p>
      <ul class="space-y-1">
        <li v-for="item in nav" :key="item.name">
          <router-link
            :to="{ name: item.name }"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a
              :href="href"
              class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              :class="isActive
                ? 'bg-primary/15 text-white ring-1 ring-inset ring-primary/30'
                : 'text-white/65 hover:bg-white/5 hover:text-white'"
              @click="(e) => { navigate(e); $emit('navigate') }"
            >
              <AppIcon
                :name="item.icon"
                :size="18"
                :class="isActive ? 'text-primary-300' : 'text-white/45 group-hover:text-white/80'"
              />
              <span class="flex-1 font-medium">{{ item.label }}</span>
              <span
                v-if="item.badge != null"
                class="rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
                :class="isActive ? 'bg-primary/25 text-primary-100' : 'bg-white/10 text-white/60'"
              >
                {{ item.badge }}
              </span>
            </a>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="border-t border-white/10 p-3">
      <div class="flex items-center gap-3 rounded-lg px-2 py-2">
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
          {{ initials }}
        </span>
        <div class="min-w-0 flex-1 leading-tight">
          <p class="truncate text-sm font-semibold text-white">{{ auth.user?.name || 'Admin' }}</p>
          <p class="truncate text-xs text-white/45">{{ auth.user?.email || 'admin@admin.com' }}</p>
        </div>
      </div>
      <button
        class="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        @click="signOut"
      >
        <AppIcon name="logout" :size="18" class="text-white/45" />
        Sign out
      </button>
    </div>
  </aside>
</template>
