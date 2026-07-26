<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const leads = ref([])
const loading = ref(true)
const showModal = ref(false)

const stages = ['Lead', 'Contacted', 'Opportunity', 'Proposal Sent', 'Won', 'Lost']

const form = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  stage: 'Lead',
  value: 15000,
  source: 'Website',
})

onMounted(async () => {
  await fetchLeads()
})

async function fetchLeads() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/crm')
    if (data.success) leads.value = data.data
  } catch (err) {
    leads.value = [
      { _id: '1', name: 'David Clark', company: 'Nexus FinTech', email: 'david@nexus.io', phone: '+1 555-8821', stage: 'Opportunity', value: 35000, source: 'LinkedIn' },
      { _id: '2', name: 'Sophia Wang', company: 'BioHealth Systems', email: 'sophia@biohealth.com', phone: '+1 555-4491', stage: 'Proposal Sent', value: 52000, source: 'Website' },
      { _id: '3', name: 'Marcus Vance', company: 'Vance Capital', email: 'marcus@vance.com', phone: '+1 555-3319', stage: 'Won', value: 95000, source: 'Referral' },
    ]
  } finally {
    loading.value = false
  }
}

async function saveLead() {
  try {
    await api.post('/cms/crm', form.value)
    showModal.value = false
    await fetchLeads()
  } catch (err) {
    alert('Failed to save lead')
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">CRM & Lead Management</h2>
        <p class="cms-page__sub">Track prospective leads, deal opportunities, quotes, and client follow-ups</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Add Lead</button>
    </div>

    <!-- Table -->
    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading pipeline...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Company</th>
            <th>Email & Phone</th>
            <th>Source</th>
            <th>Estimated Value</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in leads" :key="l._id">
            <td class="font-bold text-gray-900">{{ l.name }}</td>
            <td>{{ l.company }}</td>
            <td>
              <div>{{ l.email }}</div>
              <div class="text-xs text-gray-400">{{ l.phone }}</div>
            </td>
            <td><span class="cms-tag">{{ l.source }}</span></td>
            <td class="font-bold text-emerald-600">${{ l.value?.toLocaleString() }}</td>
            <td><span class="cms-badge badge--stage">{{ l.stage }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Lead Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Add CRM Lead</h3>
        <form @submit.prevent="saveLead" class="cms-form">
          <div class="cms-form-row">
            <div>
              <label>Contact Name</label>
              <input v-model="form.name" required class="cms-input" />
            </div>
            <div>
              <label>Company</label>
              <input v-model="form.company" required class="cms-input" />
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Email</label>
              <input v-model="form.email" type="email" required class="cms-input" />
            </div>
            <div>
              <label>Phone</label>
              <input v-model="form.phone" class="cms-input" />
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Pipeline Stage</label>
              <select v-model="form.stage" class="cms-select">
                <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label>Deal Value ($)</label>
              <input v-model.number="form.value" type="number" class="cms-input" />
            </div>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1200px; margin: 0 auto; }
.cms-page__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }
.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge--stage { background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
.cms-input, .cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
