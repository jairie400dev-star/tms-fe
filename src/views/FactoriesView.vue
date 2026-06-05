<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { factoriesApi } from '@/api/resources'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()

const factories = ref([])
const loading = ref(true)
const search = ref('')
const toDelete = ref(null)
const deleting = ref(false)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return factories.value
  return factories.value.filter((f) =>
    [f.name, f.location, f.email, f.website].some((v) => v?.toLowerCase().includes(q)),
  )
})

async function load() {
  loading.value = true
  try {
    factories.value = await factoriesApi.list()
  } catch (e) {
    toast.error(e?.message || 'Failed to load factories.')
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await factoriesApi.remove(toDelete.value.id)
    factories.value = factories.value.filter((f) => f.id !== toDelete.value.id)
    toast.success(`${toDelete.value.name} deleted.`)
    toDelete.value = null
  } catch (e) {
    toast.error(e?.message || 'Failed to delete factory.')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <PageHeader
      title="Factories"
      subtitle="Manufacturing sites across your network."
    >
      <template #actions>
        <button class="btn-primary" @click="router.push({ name: 'factory-create' })">
          <AppIcon name="plus" :size="16" /> New factory
        </button>
      </template>
    </PageHeader>

    <div class="card mt-8 overflow-hidden">
      <!-- Toolbar -->
      <div class="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <AppIcon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            v-model="search"
            type="search"
            placeholder="Search factories…"
            class="field-input pl-10"
          />
        </div>
        <span class="shrink-0 px-1 text-sm text-ink/45">{{ filtered.length }} factories</span>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-[680px] border-collapse">
          <thead class="bg-canvas/60">
            <tr class="border-b border-line">
              <th class="table-th">Factory</th>
              <th class="table-th">Location</th>
              <th class="table-th">Email</th>
              <th class="table-th text-center">Employees</th>
              <th class="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading skeleton -->
            <tr v-if="loading" v-for="n in 5" :key="`s${n}`" class="border-b border-line/70">
              <td class="table-td" colspan="5">
                <div class="h-5 w-full animate-pulse rounded bg-canvas" />
              </td>
            </tr>

            <tr v-else-if="!filtered.length">
              <td colspan="5" class="px-5 py-16 text-center text-sm text-ink/45">
                No factories match your search.
              </td>
            </tr>

            <tr
              v-else
              v-for="f in filtered"
              :key="f.id"
              class="border-b border-line/70 transition-colors last:border-0 hover:bg-canvas/50"
            >
              <td class="table-td">
                <div class="flex items-center gap-3">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <AppIcon name="building" :size="16" />
                  </span>
                  <div class="leading-tight">
                    <p class="font-semibold text-ink">{{ f.name }}</p>
                    <p class="text-xs text-primary-600">{{ f.website }}</p>
                  </div>
                </div>
              </td>
              <td class="table-td">{{ f.location }}</td>
              <td class="table-td">{{ f.email }}</td>
              <td class="table-td text-center">
                <span class="inline-grid h-6 min-w-6 place-items-center rounded-full bg-canvas px-2 text-xs font-semibold text-ink/70">
                  {{ f.employees_count ?? 0 }}
                </span>
              </td>
              <td class="table-td">
                <div class="flex items-center justify-end gap-1 text-ink/40">
                  <button class="rounded-md p-1.5 hover:bg-canvas hover:text-ink" title="View">
                    <AppIcon name="eye" :size="17" />
                  </button>
                  <button
                    class="rounded-md p-1.5 hover:bg-canvas hover:text-ink"
                    title="Edit"
                    @click="router.push({ name: 'factory-edit', params: { id: f.id } })"
                  >
                    <AppIcon name="pencil" :size="17" />
                  </button>
                  <button
                    class="rounded-md p-1.5 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete"
                    @click="toDelete = f"
                  >
                    <AppIcon name="trash" :size="17" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDialog
      :open="!!toDelete"
      :busy="deleting"
      title="Delete factory?"
      :message="toDelete ? `${toDelete.name} and its association will be removed. This cannot be undone.` : ''"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
