<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { factoriesApi } from '@/api/resources'
import { useToast } from '@/composables/useToast'

const props = defineProps({ id: { type: [String, Number], default: null } })
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => props.id != null)
const saving = ref(false)
const loading = ref(false)
const errors = ref({})

const form = ref({ name: '', location: '', email: '', website: '' })

const rules = [
  { field: 'Factory name', note: 'required', required: true },
  { field: 'Location', note: 'required', required: true },
  { field: 'Email', note: 'optional, valid email', required: false },
  { field: 'Website', note: 'optional, valid URL', required: false },
]

function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Factory name is required.'
  if (!form.value.location.trim()) e.location = 'Location is required.'
  if (form.value.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email))
    e.email = 'Enter a valid email.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  saving.value = true
  try {
    if (isEdit.value) {
      await factoriesApi.update(props.id, form.value)
      toast.success('Factory updated.')
    } else {
      await factoriesApi.create(form.value)
      toast.success('Factory created.')
    }
    router.push({ name: 'factories' })
  } catch (e) {
    if (e?.errors) errors.value = Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]]))
    toast.error(e?.message || 'Failed to save factory.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const f = await factoriesApi.get(props.id)
    if (f) form.value = { name: f.name, location: f.location, email: f.email || '', website: f.website || '' }
  } catch (e) {
    toast.error(e?.message || 'Failed to load factory.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <nav class="flex items-center gap-1.5 text-sm text-primary-600">
      <router-link :to="{ name: 'factories' }" class="hover:underline">Factories</router-link>
      <AppIcon name="chevron" :size="14" class="-rotate-90 text-ink/30" />
      <span class="text-ink/50">{{ isEdit ? 'Edit factory' : 'New factory' }}</span>
    </nav>

    <h1 class="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
      {{ isEdit ? 'Edit factory' : 'New factory' }}
    </h1>
    <p class="mt-1.5 text-sm text-ink/55">Add a new manufacturing site to your network.</p>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
      <!-- Form card -->
      <form class="card p-6 sm:p-7" @submit.prevent="submit">
        <div class="space-y-5">
          <div>
            <label class="field-label">Factory name <span class="text-primary-500">*</span></label>
            <input v-model="form.name" class="field-input" placeholder="e.g. Meridian Steelworks" />
            <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name }}</p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="field-label">Location <span class="text-primary-500">*</span></label>
              <input v-model="form.location" class="field-input" placeholder="City, Country" />
              <p v-if="errors.location" class="mt-1 text-xs text-rose-600">{{ errors.location }}</p>
            </div>
            <div>
              <label class="field-label">Email <span class="text-ink/40 font-normal">optional</span></label>
              <input v-model="form.email" type="email" class="field-input" placeholder="ops@example.com" />
              <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label class="field-label">Website <span class="text-ink/40 font-normal">optional</span></label>
            <input v-model="form.website" class="field-input sm:max-w-sm" placeholder="example.com" />
          </div>
        </div>

        <div class="mt-7 flex items-center gap-2 border-t border-line pt-6">
          <button type="submit" class="btn-primary" :disabled="saving">
            <AppIcon name="check" :size="16" />
            {{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create factory' }}
          </button>
          <button type="button" class="btn-ghost" @click="router.push({ name: 'factories' })">Cancel</button>
        </div>
      </form>

      <!-- Validation rules panel -->
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
          StoreFactoryRequest::rules()
        </p>
      </aside>
    </div>
  </div>
</template>
