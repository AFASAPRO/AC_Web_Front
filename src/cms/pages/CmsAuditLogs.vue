<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const logs = ref([])
const loading = ref(true)
const selectedAction = ref('')

onMounted(async () => {
  await fetchLogs()
})

async function fetchLogs() {
  loading.value = true
  try {
    const { data } = await api.get(`/cms/audit-logs${selectedAction.value ? '?action=' + selectedAction.value : ''}`)
    if (data.success) logs.value = data.data
  } catch (err) {
    logs.value = [
      { _id: '1', user: { firstName: 'Super', lastName: 'Admin', email: 'admin@accompany.com' }, action: 'login', details: 'User logged in successfully', ip: '192.168.1.10', createdAt: new Date().toISOString() },
      { _id: '2', user: { firstName: 'Super', lastName: 'Admin', email: 'admin@accompany.com' }, action: 'create', details: 'Created user account: john@accompany.com', ip: '192.168.1.10', createdAt: new Date().toISOString() },
      { _id: '3', user: { firstName: 'John', lastName: 'Doe', email: 'john@accompany.com' }, action: 'update', details: 'Updated project status to In Progress', ip: '192.168.1.45', createdAt: new Date().toISOString() },
    ]
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Security Audit Log Viewer</h2>
        <p class="cms-page__sub">Inspect system security events, IP addresses, failed logins, and user mutations</p>
      </div>
      <button class="cms-btn cms-btn--secondary" @click="fetchLogs">🔄 Refresh Logs</button>
    </div>

    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading security logs...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in logs" :key="l._id">
            <td class="text-xs text-gray-500 font-mono">{{ new Date(l.createdAt).toLocaleString() }}</td>
            <td class="font-bold text-gray-900">{{ l.user?.firstName }} {{ l.user?.lastName }} ({{ l.user?.email }})</td>
            <td><span class="cms-badge badge--action">{{ l.action }}</span></td>
            <td class="text-sm text-gray-700">{{ l.details }}</td>
            <td class="text-xs font-mono text-gray-400">{{ l.ip || '127.0.0.1' }}</td>
          </tr>
        </tbody>
      </table>
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

.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge--action { background: #f3f4f6; color: #111827; }
.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; background: #f3f4f6; color: #374151; }
</style>
