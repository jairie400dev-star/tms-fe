<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { employeesApi, factoriesApi } from '@/api/resources'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()

const employees = ref([])
const factories = ref([])
const loading = ref(true)
const search = ref('')
const factoryFilter = ref('')
const toDelete = ref(null)
const deleting = ref(false)

// Deterministic avatar colour per employee.
const palette = [
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
]
const avatarClass = (e) => palette[(e.id ?? 0) % palette.length]
const initials = (e) => `${e.first_name?.[0] ?? ''}${e.last_name?.[0] ?? ''}`.toUpperCase()

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return employees.value.filter((e) => {
    const matchesFactory = !factoryFilter.value || String(e.factory_id) === factoryFilter.value
    const matchesQuery =
      !q ||
      [`${e.first_name} ${e.last_name}`, e.email, e.phone, e.factory].some((v) =>
        v?.toLowerCase().includes(q),
      )
    return matchesFactory && matchesQuery
  })
})

async function load() {
  loading.value = true
  try {
    const [emp, fac] = await Promise.all([employeesApi.list(), factoriesApi.list()])
    employees.value = emp
    factories.value = fac
  } catch (e) {
    toast.error(e?.message || 'Failed to load employees.')
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await employeesApi.remove(toDelete.value.id)
    employees.value = employees.value.filter((e) => e.id !== toDelete.value.id)
    toast.success('Employee deleted.')
    toDelete.value = null
  } catch (e) {
    toast.error(e?.message || 'Failed to delete employee.')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <PageHeader title="Employees" subtitle="Everyone working across your factories.">
      <template #actions>
        <button class="btn-primary" @click="router.push({ name: 'employee-create' })">
          <AppIcon name="plus" :size="16" /> New employee
        </button>
      </template>
    </PageHeader>

    <div class="card mt-8 overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <AppIcon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
          <input v-model="search" type="search" placeholder="Search employees…" class="field-input pl-10" />
        </div>
        <div class="relative w-full sm:w-56">
          <select v-model="factoryFilter" class="field-input appearance-none pr-9">
            <option value="">All factories</option>
            <option v-for="f in factories" :key="f.id" :value="String(f.id)">{{ f.name }}</option>
          </select>
          <AppIcon name="chevron" :size="16" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" />
        </div>
        <span class="shrink-0 px-1 text-sm text-ink/45">{{ filtered.length }} employees</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] border-collapse">
          <thead class="bg-canvas/60">
            <tr class="border-b border-line">
              <th class="table-th">Name</th>
              <th class="table-th">Factory</th>
              <th class="table-th">Email</th>
              <th class="table-th">Phone</th>
              <th class="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" v-for="n in 6" :key="`s${n}`" class="border-b border-line/70">
              <td class="table-td" colspan="5"><div class="h-5 w-full animate-pulse rounded bg-canvas" /></td>
            </tr>

            <tr v-else-if="!filtered.length">
              <td colspan="5" class="px-5 py-16 text-center text-sm text-ink/45">No employees match your filters.</td>
            </tr>

            <tr
              v-else
              v-for="e in filtered"
              :key="e.id"
              class="border-b border-line/70 transition-colors last:border-0 hover:bg-canvas/50"
            >
              <td class="table-td">
                <div class="flex items-center gap-3">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold" :class="avatarClass(e)">
                    {{ initials(e) }}
                  </span>
                  <div class="leading-tight">
                    <p class="font-semibold text-ink">{{ e.first_name }} {{ e.last_name }}</p>
                    <p class="text-xs text-ink/40">#{{ e.id }}</p>
                  </div>
                </div>
              </td>
              <td class="table-td">
                <span class="inline-flex items-center gap-1.5 text-primary-600">
                  <AppIcon name="link" :size="14" /> {{ e.factory }}
                </span>
              </td>
              <td class="table-td">{{ e.email }}</td>
              <td class="table-td font-mono text-[13px] text-ink/70">{{ e.phone }}</td>
              <td class="table-td">
                <div class="flex items-center justify-end gap-1 text-ink/40">
                  <button class="rounded-md p-1.5 hover:bg-canvas hover:text-ink" title="View">
                    <AppIcon name="eye" :size="17" />
                  </button>
                  <button
                    class="rounded-md p-1.5 hover:bg-canvas hover:text-ink"
                    title="Edit"
                    @click="router.push({ name: 'employee-edit', params: { id: e.id } })"
                  >
                    <AppIcon name="pencil" :size="17" />
                  </button>
                  <button class="rounded-md p-1.5 hover:bg-rose-50 hover:text-rose-600" title="Delete" @click="toDelete = e">
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
      title="Delete employee?"
      :message="toDelete ? `${toDelete.first_name} ${toDelete.last_name} will be removed. This cannot be undone.` : ''"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
