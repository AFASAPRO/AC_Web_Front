<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { Trash2 } from 'lucide-vue-next'

const clients = ref([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)

const form = ref({
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  industry: 'Technology',
  address: '',
  notes: '',
})

onMounted(async () => {
  await fetchClients()
})

async function fetchClients() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/clients')
    if (data.success) {
      clients.value = data.data
    }
  } catch (err) {
    console.error(err)
    clients.value = [
      { _id: '1', companyName: 'Acme Corp', contactPerson: 'Alice Johnson', email: 'alice@acme.com', phone: '+1 555-0192', industry: 'E-commerce', status: 'Active', totalRevenue: 45000 },
      { _id: '2', companyName: 'Global Tech Solution', contactPerson: 'Robert Miller', email: 'robert@globaltech.io', phone: '+1 555-0382', industry: 'Technology', status: 'Active', totalRevenue: 82000 },
      { _id: '3', companyName: 'Starlight Media', contactPerson: 'Emma Davis', email: 'emma@starlight.com', phone: '+1 555-0481', industry: 'Entertainment', status: 'Lead', totalRevenue: 12000 },
    ]
  } finally {
    loading.value = false
  }
}

const filteredClients = computed(() => {
  return clients.value.filter(c => {
    return c.companyName.toLowerCase().includes(search.value.toLowerCase()) ||
           c.contactPerson.toLowerCase().includes(search.value.toLowerCase()) ||
           c.email.toLowerCase().includes(search.value.toLowerCase())
  })
})

async function saveClient() {
  try {
    await api.post('/cms/clients', form.value)
    showModal.value = false
    await fetchClients()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save client')
  }
}

async function removeClient(id) {
  if (confirm('Delete client record?')) {
    try {
      await api.delete(`/cms/clients/${id}`)
      await fetchClients()
    } catch (err) {
      alert('Failed to delete client')
    }
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Client Management</h2>
        <p class="cms-page__sub">Manage enterprise clients, contracts, and Client Portal access</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Add Client</button>
    </div>

    <!-- Filters -->
    <div class="cms-card cms-filters">
      <input v-model="search" type="text" placeholder="Search company, contact person, or email..." class="cms-input cms-input--search" />
    </div>

    <!-- Clients Table -->
    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading clients...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact Person</th>
            <th>Email & Phone</th>
            <th>Industry</th>
            <th>Total Revenue</th>
            <th>Portal Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filteredClients" :key="c._id">
            <td class="font-bold text-gray-900">{{ c.companyName }}</td>
            <td>{{ c.contactPerson }}</td>
            <td>
              <div>{{ c.email }}</div>
              <div class="text-xs text-gray-400">{{ c.phone || 'N/A' }}</div>
            </td>
            <td><span class="cms-tag">{{ c.industry }}</span></td>
            <td class="font-bold text-emerald-600">${{ (c.totalRevenue || 0).toLocaleString() }}</td>
            <td><span class="cms-badge" :class="c.status === 'Active' ? 'cms-badge--success' : 'cms-badge--warning'">{{ c.status }}</span></td>
            <td>
              <button class="cms-btn-icon cms-btn-icon--danger" @click="removeClient(c._id)">
                <Trash2 class="w-4 h-4 text-rose-600" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Client Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Add New Client</h3>
        <form @submit.prevent="saveClient" class="cms-form">
          <div>
            <label>Company Name</label>
            <input v-model="form.companyName" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Contact Person</label>
              <input v-model="form.contactPerson" required class="cms-input" />
            </div>
            <div>
              <label>Industry</label>
              <input v-model="form.industry" class="cms-input" />
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Email (Portal Login)</label>
              <input v-model="form.email" type="email" required class="cms-input" />
            </div>
            <div>
              <label>Phone Number</label>
              <input v-model="form.phone" class="cms-input" />
            </div>
          </div>
          <div>
            <label>Notes / Contract details</label>
            <textarea v-model="form.notes" class="cms-input" rows="3"></textarea>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Save Client</button>
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

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; margin-bottom: 1.5rem; }
.cms-input { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-input--search { width: 320px; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }

.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge--success { background: #dcfce7; color: #166534; }
.cms-badge--warning { background: #fef9c3; color: #854d0e; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
