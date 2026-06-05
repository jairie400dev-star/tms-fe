<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import BrandMark from '@/components/BrandMark.vue'
import AppIcon from '@/components/AppIcon.vue'
import { factoriesApi, employeesApi } from '@/api/resources'

const mobileOpen = ref(false)
const counts = ref({ factories: null, employees: null })

onMounted(async () => {
  // Populate sidebar badges. Failures are silent — badges just stay hidden.
  try {
    const [f, e] = await Promise.all([factoriesApi.list(), employeesApi.list()])
    counts.value = {
      factories: Array.isArray(f) ? f.length : f?.total ?? null,
      employees: Array.isArray(e) ? e.length : e?.total ?? null,
    }
  } catch {
    /* ignore */
  }
})
</script>

<template>
  <div class="flex min-h-screen bg-canvas">
    <!-- Desktop sidebar -->
    <div class="sticky top-0 hidden h-screen shrink-0 lg:block">
      <AppSidebar :counts="counts" />
    </div>

    <!-- Mobile drawer -->
    <transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
        <div class="absolute inset-0 bg-ink/40" @click="mobileOpen = false" />
        <div class="absolute inset-y-0 left-0 h-full shadow-2xl">
          <AppSidebar :counts="counts" @navigate="mobileOpen = false" />
        </div>
      </div>
    </transition>

    <!-- Main column -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Mobile top bar -->
      <header
        class="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden"
      >
        <BrandMark />
        <button
          class="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface"
          aria-label="Open menu"
          @click="mobileOpen = true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      <main class="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div class="mx-auto w-full max-w-6xl">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
}
</style>
