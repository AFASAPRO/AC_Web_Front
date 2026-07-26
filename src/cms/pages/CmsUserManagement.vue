<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'

const users = ref([])
const loading = ref(true)
const search = ref('')
const selectedRole = ref('')
const showModal = ref(false)

const roles = ['super_admin', 'admin', 'manager', 'accountant', 'hr', 'employee', 'client']
const departments = ['Engineering', 'Design', 'Finance', 'Human Resources', 'Management', 'Sales']

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'employee',
  department: 'Engineering',
  position: 'Developer',
  phone: '',
})

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/employees')
    if (data.success) {
      users.value = data.data.map(emp => ({
        _id: emp.user?._id || emp._id,
        firstName: emp.user?.firstName || 'User',
        lastName: emp.user?.lastName || '',
        email: emp.user?.email || '',
        role: emp.user?.role || 'employee',
        department: emp.department || 'N/A',
        position: emp.position || 'N/A',
        isActive: true,
      }))
    }
  } catch (err) {
    users.value = [
      { _id: '1', firstName: 'Super', lastName: 'Admin', email: 'admin@accompany.com', role: 'super_admin', department: 'Management', position: 'System Administrator', isActive: true },
      { _id: '2', firstName: 'John', lastName: 'Doe', email: 'john@accompany.com', role: 'manager', department: 'Engineering', position: 'Project Manager', isActive: true },
      { _id: '3', firstName: 'Jane', lastName: 'Smith', email: 'jane@accompany.com', role: 'employee', department: 'Design', position: 'UI/UX Designer', isActive: true },
      { _id: '4', firstName: 'Alice', lastName: 'Johnson', email: 'alice@acme.com', role: 'client', department: 'External', position: 'Client Representative', isActive: true },
    ]
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase()
    const matchesSearch = name.includes(search.value.toLowerCase()) || u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesRole = !selectedRole.value || selectedRole.value === 'All' || u.role === selectedRole.value
    return matchesSearch && matchesRole
  })
})

async function createUserAccount() {
  try {
    const defaultPass = form.value.password ? form.value.password.trim() : 'Account@123'
    const res = await api.post('/cms/employees', {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: defaultPass,
      role: form.value.role,
      department: form.value.department,
      position: form.value.position,
    })
    
    showModal.value = false
    await fetchUsers()
    alert(`✅ Account Created Successfully!\n\nEmail: ${form.value.email}\nPassword: ${defaultPass}\nRole: ${form.value.role.toUpperCase()}\n\nYou can now log in with these credentials.`)
  } catch (err) {
    alert('⚠️ Error creating account: ' + (err.response?.data?.message || err.message || 'Server error'))
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">User Account Management</h2>
        <p class="cms-page__sub">Create and manage accounts for Super Admins, Employees, Managers, HR, Accountants, and Clients</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Create Account</button>
    </div>

    <!-- Filters -->
    <div class="cms-card cms-filters">
      <input v-model="search" type="text" placeholder="Search by name or email..." class="cms-input cms-input--search" />
      <select v-model="selectedRole" class="cms-select">
        <option value="">All Roles</option>
        <option v-for="r in roles" :key="r" :value="r">{{ r.replace('_', ' ').toUpperCase() }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading account directory...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Department</th>
            <th>Position</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u._id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ u.firstName[0] }}{{ u.lastName[0] }}</div>
                <div>
                  <div class="font-bold text-gray-900">{{ u.firstName }} {{ u.lastName }}</div>
                  <div class="text-xs text-gray-400">{{ u.email }}</div>
                </div>
              </div>
            </td>
            <td><span class="role-badge" :class="`role--${u.role}`">{{ u.role.replace('_', ' ') }}</span></td>
            <td><span class="cms-tag">{{ u.department }}</span></td>
            <td>{{ u.position }}</td>
            <td><span class="status-dot"></span> Active</td>
            <td>
              <button class="cms-btn-icon" @click="alert(`Editing permissions for ${u.firstName}`)">⚙️ Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Create Account</h3>
        <form @submit.prevent="createUserAccount" class="cms-form">
          <div class="cms-form-row">
            <div>
              <label>First Name</label>
              <input v-model="form.firstName" required class="cms-input" />
            </div>
            <div>
              <label>Last Name</label>
              <input v-model="form.lastName" required class="cms-input" />
            </div>
          </div>
          <div>
            <label>Email Address</label>
            <input v-model="form.email" type="email" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Password</label>
              <input v-model="form.password" type="password" placeholder="Default: Account@123" class="cms-input" />
            </div>
            <div>
              <label>Role</label>
              <select v-model="form.role" class="cms-select">
                <option v-for="r in roles" :key="r" :value="r">{{ r.replace('_', ' ').toUpperCase() }}</option>
              </select>
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Department</label>
              <select v-model="form.department" class="cms-select">
                <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label>Position / Title</label>
              <input v-model="form.position" required class="cms-input" />
            </div>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Create User</button>
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
.cms-filters { display: flex; gap: 1rem; }
.cms-input, .cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-input--search { width: 320px; }

.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 0.75rem; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }

.role-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
.role--super_admin { background: #fef2f2; color: #991b1b; }
.role--admin { background: #fee2e2; color: #b91c1c; }
.role--manager { background: #e0e7ff; color: #3730a3; }
.role--employee { background: #f3f4f6; color: #374151; }
.role--client { background: #dcfce7; color: #15803d; }

.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16a34a; margin-right: 0.25rem; }
.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
.cms-btn-icon { background: none; border: none; cursor: pointer; font-size: 0.8125rem; font-weight: 600; color: #2563eb; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
