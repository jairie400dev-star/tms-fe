<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { employeesApi, factoriesApi } from '@/api/resources'
import { useToast } from '@/composables/useToast'

const props = defineProps({ id: { type: [String, Number], default: null } })
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => props.id != null)
const saving = ref(false)
const errors = ref({})
const factories = ref([])

const form = ref({ first_name: '', last_name: '', factory_id: '', email: '', phone: '' })

const rules = [
  { field: 'First name', note: 'required', required: true },
  { field: 'Last name', note: 'required', required: true },
  { field: 'Factory', note: 'required, exists:factories,id', required: true },
  { field: 'Email', note: 'optional, valid email', required: false },
  { field: 'Phone', note: 'optional', required: false },
]

function validate() {
  const e = {}
  if (!form.value.first_name.trim()) e.first_name = 'First name is required.'
  if (!form.value.last_name.trim()) e.last_name = 'Last name is required.'
  if (!form.value.factory_id) e.factory_id = 'Please choose a factory.'
  if (form.value.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email))
    e.email = 'Enter a valid email.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  saving.value = true
  try {
    const payload = { ...form.value, factory_id: Number(form.value.factory_id) }
    if (isEdit.value) {
      await employeesApi.update(props.id, payload)
      toast.success('Employee updated.')
    } else {
      await employeesApi.create(payload)
      toast.success('Employee created.')
    }
    router.push({ name: 'employees' })
  } catch (e) {
    if (e?.errors) errors.value = Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]]))
    toast.error(e?.message || 'Failed to save employee.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    factories.value = await factoriesApi.list()
  } catch {
    /* ignore */
  }
  if (isEdit.value) {
    try {
      const e = await employeesApi.get(props.id)
      if (e)
        form.value = {
          first_name: e.first_name,
          last_name: e.last_name,
          factory_id: String(e.factory_id ?? ''),
          email: e.email || '',
          phone: e.phone || '',
        }
    } catch (err) {
      toast.error(err?.message || 'Failed to load employee.')
    }
  }
})
</script>

<template>
  <div>
    <nav class="flex items-center gap-1.5 text-sm text-primary-600">
      <router-link :to="{ name: 'employees' }" class="hover:underline">Employees</router-link>
      <AppIcon name="chevron" :size="14" class="-rotate-90 text-ink/30" />
      <span class="text-ink/50">{{ isEdit ? 'Edit employee' : 'New employee' }}</span>
    </nav>

    <h1 class="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
      {{ isEdit ? 'Edit employee' : 'New employee' }}
    </h1>
    <p class="mt-1.5 text-sm text-ink/55">Add a new person to a factory.</p>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
      <form class="card p-6 sm:p-7" @submit.prevent="submit">
        <div class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="field-label">First name <span class="text-primary-500">*</span></label>
              <input v-model="form.first_name" class="field-input" placeholder="First name" />
              <p v-if="errors.first_name" class="mt-1 text-xs text-rose-600">{{ errors.first_name }}</p>
            </div>
            <div>
              <label class="field-label">Last name <span class="text-primary-500">*</span></label>
              <input v-model="form.last_name" class="field-input" placeholder="Last name" />
              <p v-if="errors.last_name" class="mt-1 text-xs text-rose-600">{{ errors.last_name }}</p>
            </div>
          </div>

          <div>
            <label class="field-label">Factory <span class="text-primary-500">*</span></label>
            <div class="relative">
              <select v-model="form.factory_id" class="field-input appearance-none pr-9">
                <option value="" disabled>Select a factory</option>
                <option v-for="f in factories" :key="f.id" :value="String(f.id)">{{ f.name }}</option>
              </select>
              <AppIcon name="chevron" :size="16" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" />
            </div>
            <p v-if="errors.factory_id" class="mt-1 text-xs text-rose-600">{{ errors.factory_id }}</p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="field-label">Email <span class="text-ink/40 font-normal">optional</span></label>
              <input v-model="form.email" type="email" class="field-input" placeholder="name@example.com" />
              <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
            </div>
            <div>
              <label class="field-label">Phone <span class="text-ink/40 font-normal">optional</span></label>
              <input v-model="form.phone" class="field-input" placeholder="+1 555 000 000" />
            </div>
          </div>
        </div>

        <div class="mt-7 flex items-center gap-2 border-t border-line pt-6">
          <button type="submit" class="btn-primary" :disabled="saving">
            <AppIcon name="check" :size="16" />
            {{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create employee' }}
          </button>
          <button type="button" class="btn-ghost" @click="router.push({ name: 'employees' })">Cancel</button>
        </div>
      </form>

      <aside class="h-fit rounded-2xl border border-line bg-primary-50/40 p-5">
        <p class="eyebrow !text-ink/45">Validation rules</p>
        <ul class="mt-4 space-y-3 text-sm">
          <li v-for="r in rules" :key="r.field" class="flex gap-2.5">
            <AppIcon
              :name="r.required ? 'check' : 'arrowRight'"
              :size="15"
              class="mt-0.5 shrink-0"
              :class="r.required ? 'text-emerald-500' : 'text-ink/35'"
            />
            <span class="text-ink/70">
              <span class="font-semibold text-ink">{{ r.field }}</span> — {{ r.note }}
            </span>
          </li>
        </ul>
        <p class="mt-5 border-t border-line/70 pt-4 font-mono text-xs text-ink/40">
          StoreEmployeeRequest::rules()
        </p>
      </aside>
    </div>
  </div>
</template>
