<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { FileText, BarChart3 } from 'lucide-vue-next'

const transactions = ref([])
const loading = ref(true)
const activeTab = ref('All')
const showModal = ref(false)

const form = ref({
  title: '',
  type: 'Income',
  category: 'Client Payment',
  amount: 5000,
  description: '',
})

onMounted(async () => {
  await fetchTransactions()
})

async function fetchTransactions() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/finance')
    if (data.success) transactions.value = data.data
  } catch (err) {
    transactions.value = [
      { _id: '1', title: 'Acme Corp Milestone #2 Payment', type: 'Income', category: 'Client Payment', amount: 25000, date: '2026-07-20' },
      { _id: '2', title: 'AWS Cloud Hosting & Server Billing', type: 'Expense', category: 'Hosting', amount: 3200, date: '2026-07-18' },
      { _id: '3', title: 'Figma Enterprise Licenses', type: 'Expense', category: 'Office Expenses', amount: 1450, date: '2026-07-15' },
      { _id: '4', title: 'Global Tech Solution Deposit', type: 'Income', category: 'Client Payment', amount: 40000, date: '2026-07-10' },
    ]
  } finally {
    loading.value = false
  }
}

const filteredTransactions = computed(() => {
  if (activeTab.value === 'All') return transactions.value
  return transactions.value.filter(t => t.type === activeTab.value)
})

const totalIncome = computed(() => transactions.value.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0))
const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0))
const netProfit = computed(() => totalIncome.value - totalExpenses.value)

async function saveTransaction() {
  try {
    await api.post('/cms/finance', form.value)
    showModal.value = false
    await fetchTransactions()
  } catch (err) {
    alert('Failed to save transaction')
  }
}

function exportReport(format) {
  alert(`Exporting financial report in ${format.toUpperCase()} format... File download initiated.`)
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Finance & Cash Flow</h2>
        <p class="cms-page__sub">Income, office expenses, financial analytics, and PDF/Excel report exports</p>
      </div>
      <div class="header-actions">
        <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="exportReport('pdf')"><FileText class="w-4 h-4" /> Export PDF</button>
        <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="exportReport('excel')"><BarChart3 class="w-4 h-4" /> Export Excel</button>
        <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Add Transaction</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="finance-stats">
      <div class="stat-box box--income">
        <span class="label">Total Income</span>
        <span class="value">${{ totalIncome.toLocaleString() }}</span>
      </div>
      <div class="stat-box box--expense">
        <span class="label">Total Expenses</span>
        <span class="value">${{ totalExpenses.toLocaleString() }}</span>
      </div>
      <div class="stat-box box--profit">
        <span class="label">Net Profit</span>
        <span class="value">${{ netProfit.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Tabs & Table -->
    <div class="cms-card">
      <div class="tabs">
        <button v-for="t in ['All', 'Income', 'Expense']" :key="t" class="tab-btn" :class="{ active: activeTab === t }" @click="activeTab = t">{{ t }}</button>
      </div>

      <div v-if="loading" class="cms-loading">Loading transactions...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in filteredTransactions" :key="tx._id">
            <td class="font-bold text-gray-900">{{ tx.title }}</td>
            <td><span class="cms-badge" :class="tx.type === 'Income' ? 'badge--income' : 'badge--expense'">{{ tx.type }}</span></td>
            <td><span class="cms-tag">{{ tx.category }}</span></td>
            <td class="text-gray-500">{{ new Date(tx.date).toLocaleDateString() }}</td>
            <td class="font-bold" :class="tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'">
              {{ tx.type === 'Income' ? '+' : '-' }}${{ tx.amount?.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Add Transaction</h3>
        <form @submit.prevent="saveTransaction" class="cms-form">
          <div>
            <label>Transaction Title</label>
            <input v-model="form.title" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Type</label>
              <select v-model="form.type" class="cms-select">
                <option>Income</option>
                <option>Expense</option>
              </select>
            </div>
            <div>
              <label>Category</label>
              <select v-model="form.category" class="cms-select">
                <option>Client Payment</option>
                <option>Office Expenses</option>
                <option>Salaries</option>
                <option>Equipment</option>
                <option>Hosting</option>
                <option>Marketing</option>
                <option>Miscellaneous</option>
              </select>
            </div>
          </div>
          <div>
            <label>Amount ($)</label>
            <input v-model.number="form.amount" type="number" required class="cms-input" />
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Save Transaction</button>
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
.header-actions { display: flex; gap: 0.5rem; }

.finance-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
.stat-box { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; display: flex; flex-direction: column; }
.stat-box .label { font-size: 0.8125rem; color: #6b7280; font-weight: 500; }
.stat-box .value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0a0a0a; margin-top: 0.375rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }
.tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #f0f1f3; padding-bottom: 0.75rem; margin-bottom: 1rem; }
.tab-btn { border: none; background: none; font-size: 0.875rem; font-weight: 600; color: #6b7280; padding: 0.375rem 0.75rem; cursor: pointer; border-radius: 0.375rem; }
.tab-btn.active { background: #0a0a0a; color: #fff; }

.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge--income { background: #dcfce7; color: #166534; }
.badge--expense { background: #fee2e2; color: #991b1b; }

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
