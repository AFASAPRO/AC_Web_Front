<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { Trash2 } from 'lucide-vue-next'

const employees = ref([])
const loading = ref(true)
const search = ref('')
const selectedDepartment = ref('')
const showModal = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  department: 'Engineering',
  position: 'Software Engineer',
  salary: 5000,
  skills: 'Vue.js, Node.js',
})

const departments = ['All', 'Engineering', 'Design', 'Finance', 'Human Resources', 'Management']

onMounted(async () => {
  await fetchEmployees()
})

async function fetchEmployees() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/employees')
    if (data.success) {
      employees.value = data.data
    }
  } catch (err) {
    console.error(err)
    // Fallback sample data if DB is empty
    employees.value = [
      { _id: '1', employeeId: 'EMP-1001', user: { firstName: 'John', lastName: 'Doe', email: 'john@accompany.com', avatar: '' }, department: 'Engineering', position: 'Senior Full Stack Engineer', salary: 8500, skills: ['Vue 3', 'Node.js', 'MongoDB'], status: 'Active' },
      { _id: '2', employeeId: 'EMP-1002', user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@accompany.com', avatar: '' }, department: 'Design', position: 'Lead UI/UX Designer', salary: 7800, skills: ['Figma', 'Tailwind', 'Prototyping'], status: 'Active' },
      { _id: '3', employeeId: 'EMP-1003', user: { firstName: 'Mike', lastName: 'Johnson', email: 'mike@accompany.com', avatar: '' }, department: 'Finance', position: 'Senior Accountant', salary: 6500, skills: ['Payroll', 'Tax', 'Excel'], status: 'Active' },
    ]
  } finally {
    loading.value = false
  }
}

const filteredEmployees = computed(() => {
  return employees.value.filter(emp => {
    const name = `${emp.user?.firstName || ''} ${emp.user?.lastName || ''}`.toLowerCase()
    const matchesSearch = name.includes(search.value.toLowerCase()) || emp.employeeId?.toLowerCase().includes(search.value.toLowerCase())
    const matchesDept = !selectedDepartment.value || selectedDepartment.value === 'All' || emp.department === selectedDepartment.value
    return matchesSearch && matchesDept
  })
})

async function saveEmployee() {
  try {
    const payload = {
      ...form.value,
      skills: form.value.skills.split(',').map(s => s.trim()),
    }
    await api.post('/cms/employees', payload)
    showModal.value = false
    await fetchEmployees()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save employee')
  }
}

async function removeEmployee(id) {
  if (confirm('Are you sure you want to remove this employee?')) {
    try {
      await api.delete(`/cms/employees/${id}`)
      await fetchEmployees()
    } catch (err) {
      alert('Failed to delete employee')
    }
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Employee Management</h2>
        <p class="cms-page__sub">Manage teams, positions, salaries, and employee information</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Add Employee</button>
    </div>

    <!-- Filters -->
    <div class="cms-card cms-filters">
      <input v-model="search" type="text" placeholder="Search employee name or ID..." class="cms-input cms-input--search" />
      <select v-model="selectedDepartment" class="cms-select">
        <option v-for="d in departments" :key="d" :value="d">{{ d }} Department</option>
      </select>
    </div>

    <!-- Data Table -->
    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading employees...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>ID</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Skills</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredEmployees" :key="emp._id">
            <td>
              <div class="cms-user-cell">
                <div class="cms-avatar">{{ emp.user?.firstName?.[0] }}{{ emp.user?.lastName?.[0] }}</div>
                <div>
                  <div class="cms-user-name">{{ emp.user?.firstName }} {{ emp.user?.lastName }}</div>
                  <div class="cms-user-email">{{ emp.user?.email }}</div>
                </div>
              </div>
            </td>
            <td><code>{{ emp.employeeId }}</code></td>
            <td><span class="cms-tag">{{ emp.department }}</span></td>
            <td>{{ emp.position }}</td>
            <td class="font-bold">${{ emp.salary?.toLocaleString() }}/mo</td>
            <td>
              <div class="cms-skills">
                <span v-for="s in emp.skills" :key="s" class="cms-skill-badge">{{ s }}</span>
              </div>
            </td>
            <td><span class="cms-badge cms-badge--success">{{ emp.status || 'Active' }}</span></td>
            <td>
              <button class="cms-btn-icon cms-btn-icon--danger" @click="removeEmployee(emp._id)">
                <Trash2 class="w-4 h-4 text-rose-600" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Employee Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Add New Employee</h3>
        <form @submit.prevent="saveEmployee" class="cms-form">
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
            <label>Email</label>
            <input v-model="form.email" type="email" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Department</label>
              <select v-model="form.department" class="cms-select">
                <option v-for="d in departments.slice(1)" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label>Position</label>
              <input v-model="form.position" required class="cms-input" />
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Monthly Salary ($)</label>
              <input v-model.number="form.salary" type="number" required class="cms-input" />
            </div>
            <div>
              <label>Skills (comma separated)</label>
              <input v-model="form.skills" class="cms-input" />
            </div>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Save Employee</button>
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
.cms-filters { display: flex; gap: 1rem; align-items: center; }

.cms-input { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-input--search { width: 320px; }
.cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; background: #fff; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
.cms-btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; }

.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-user-cell { display: flex; align-items: center; gap: 0.75rem; }
.cms-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }
.cms-user-name { font-weight: 700; color: #111827; }
.cms-user-email { font-size: 0.75rem; color: #9ca3af; }

.cms-skills { display: flex; gap: 0.375rem; flex-wrap: wrap; }
.cms-skill-badge { background: #f3f4f6; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: #374151; }
.cms-tag { background: #eff6ff; color: #2563eb; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge--success { background: #dcfce7; color: #166534; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
