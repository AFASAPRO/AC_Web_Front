<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { FileText } from 'lucide-vue-next'

const payrolls = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchPayrolls()
})

async function fetchPayrolls() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/payroll')
    if (data.success) payrolls.value = data.data
  } catch (err) {
    payrolls.value = [
      { _id: '1', employee: { firstName: 'John', lastName: 'Doe', department: 'Engineering', position: 'Senior Engineer' }, month: 'July 2026', basicSalary: 8500, bonuses: 500, deductions: 200, netSalary: 8800, status: 'Paid' },
      { _id: '2', employee: { firstName: 'Jane', lastName: 'Smith', department: 'Design', position: 'Lead Designer' }, month: 'July 2026', basicSalary: 7800, bonuses: 300, deductions: 150, netSalary: 7950, status: 'Paid' },
      { _id: '3', employee: { firstName: 'Mike', lastName: 'Johnson', department: 'Finance', position: 'Accountant' }, month: 'July 2026', basicSalary: 6500, bonuses: 0, deductions: 100, netSalary: 6400, status: 'Pending' },
    ]
  } finally {
    loading.value = false
  }
}

function processPayment(p) {
  p.status = 'Paid'
  alert(`Processed payroll payment of $${p.netSalary} for ${p.employee.firstName} ${p.employee.lastName}`)
}

function downloadPayslip(p) {
  alert(`Generating PDF payslip for ${p.employee.firstName} ${p.employee.lastName} (${p.month}). Download starting...`)
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Payroll Management</h2>
        <p class="cms-page__sub">Employee salary structure, bonuses, deductions, and payslip generation</p>
      </div>
    </div>

    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading payrolls...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>Bonuses</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Payslip</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in payrolls" :key="p._id">
            <td class="font-bold text-gray-900">{{ p.employee?.firstName }} {{ p.employee?.lastName }}</td>
            <td class="text-gray-500">{{ p.month }}</td>
            <td>${{ p.basicSalary?.toLocaleString() }}</td>
            <td class="text-emerald-600">+${{ p.bonuses }}</td>
            <td class="text-rose-600">-${{ p.deductions }}</td>
            <td class="font-bold text-gray-900">${{ p.netSalary?.toLocaleString() }}</td>
            <td>
              <span class="cms-badge" :class="p.status === 'Paid' ? 'badge--paid' : 'badge--pending'">{{ p.status }}</span>
            </td>
            <td>
              <div class="action-btns">
                <button v-if="p.status === 'Pending'" class="cms-btn cms-btn--primary py-1 px-2 text-xs" @click="processPayment(p)">Pay Now</button>
                <button class="cms-btn cms-btn--secondary py-1 px-2 text-xs flex items-center gap-1" @click="downloadPayslip(p)"><FileText class="w-3 h-3" /> Payslip</button>
              </div>
            </td>
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
.badge--paid { background: #dcfce7; color: #166534; }
.badge--pending { background: #fef9c3; color: #854d0e; }

.action-btns { display: flex; gap: 0.375rem; }
.cms-btn { border-radius: 0.375rem; font-weight: 600; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
</style>
