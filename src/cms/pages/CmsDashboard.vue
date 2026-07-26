<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { useAuthStore } from '../stores/auth.js'
import StatCard from '../components/common/StatCard.vue'

const auth = useAuthStore()
const stats = ref(null)
const charts = ref(null)
const activities = ref([])
const loading = ref(true)
const selectedRange = ref('1M')

const ranges = ['1D', '1W', '1M', '6M', '1Y']
const role = computed(() => auth.userRole || 'employee')

// ApexCharts
let ApexCharts = null
let revenueChart = null
let profitChart = null
let projectChart = null

onMounted(async () => {
  try {
    const [statsRes, chartsRes, activityRes] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/charts'),
      api.get('/dashboard/activity'),
    ])
    stats.value = statsRes.data.data
    charts.value = chartsRes.data.data
    activities.value = activityRes.data.data

    if (['super_admin', 'admin', 'manager', 'accountant'].includes(role.value)) {
      const module = await import('apexcharts')
      ApexCharts = module.default
      renderCharts()
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    loading.value = false
  }
})

function renderCharts() {
  if (!charts.value || !ApexCharts) return

  const revenueEl = document.querySelector('#revenue-chart')
  if (revenueEl) {
    revenueChart = new ApexCharts(revenueEl, {
      chart: { type: 'area', height: 280, fontFamily: 'Inter, sans-serif', toolbar: { show: false }, zoom: { enabled: false } },
      series: charts.value.revenue.series,
      xaxis: { categories: charts.value.revenue.categories, labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
      yaxis: { labels: { style: { colors: '#9ca3af', fontSize: '11px' }, formatter: (v) => `$${(v/1000).toFixed(0)}K` } },
      colors: ['#0a0a0a', '#d1d5db'],
      fill: { type: 'gradient', gradient: { opacityFrom: 0.15, opacityTo: 0.01 } },
      stroke: { curve: 'smooth', width: [2.5, 2] },
      grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'top', horizontalAlign: 'left' },
      tooltip: { theme: 'light', y: { formatter: (v) => `$${v.toLocaleString()}` } },
    })
    revenueChart.render()
  }

  const projectEl = document.querySelector('#project-chart')
  if (projectEl) {
    projectChart = new ApexCharts(projectEl, {
      chart: { type: 'donut', height: 200, fontFamily: 'Inter, sans-serif' },
      series: charts.value.projectStatus.series,
      labels: charts.value.projectStatus.labels,
      colors: ['#e5e7eb', '#0a0a0a', '#6b7280', '#d1d5db', '#374151'],
      legend: { show: false },
      dataLabels: { enabled: false },
    })
    projectChart.render()
  }
}

function getActivityIcon(type) {
  const map = { project: '📁', task: '✅', payment: '💳', meeting: '📅', info: '📎' }
  return map[type] || '📌'
}
</script>

<template>
  <div class="cms-dash">
    <!-- Welcome Header -->
    <div class="cms-dash__welcome">
      <div>
        <h2 class="cms-dash__welcome-title">Welcome back, {{ auth.user?.firstName || 'User' }} 👋</h2>
        <p class="cms-dash__welcome-sub">
          <span class="role-badge">{{ role.replace('_', ' ').toUpperCase() }} DASHBOARD</span>
          Here is your customized overview & portal metrics
        </p>
      </div>
      <div class="cms-dash__welcome-actions">
        <router-link v-if="role === 'client'" to="/cms/contact-company" class="cms-dash__btn cms-dash__btn--primary">💬 Contact Team</router-link>
        <router-link v-else-if="role === 'employee'" to="/cms/tasks" class="cms-dash__btn cms-dash__btn--primary">✅ View My Tasks</router-link>
        <router-link v-else-if="role === 'hr'" to="/cms/employees" class="cms-dash__btn cms-dash__btn--primary">+ Add Employee</router-link>
        <router-link v-else-if="role === 'accountant'" to="/cms/finance" class="cms-dash__btn cms-dash__btn--primary">📊 Finance Report</router-link>
        <router-link v-else to="/cms/users" class="cms-dash__btn cms-dash__btn--primary">+ Manage Accounts</router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="cms-dash__loading">
      <div class="cms-dash__loader"></div>
      <p>Loading your dashboard...</p>
    </div>

    <template v-else-if="stats">
      <!-- 1. CLIENT DASHBOARD -->
      <div v-if="role === 'client'" class="client-dash">
        <div class="client-stats-grid">
          <div class="client-stat-box">
            <span class="label">My Active Projects</span>
            <span class="val">2</span>
          </div>
          <div class="client-stat-box">
            <span class="label">Milestones Completed</span>
            <span class="val">4 / 6</span>
          </div>
          <div class="client-stat-box">
            <span class="label">Next Payment Due</span>
            <span class="val text-emerald-600">$12,500</span>
          </div>
        </div>

        <!-- Assigned Projects List -->
        <div class="cms-card mt-6">
          <h3 class="font-bold text-lg mb-4">My Assigned Projects</h3>
          <div class="client-project-card">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-bold text-base text-gray-900">E-commerce Platform Redesign</h4>
                <p class="text-xs text-gray-500">Target Launch: Aug 15, 2026</p>
              </div>
              <span class="cms-badge badge--success">In Progress</span>
            </div>
            <div class="progress-bar my-3">
              <div class="progress-fill" style="width: 65%;"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-600">
              <span>Overall Completion: <strong>65%</strong></span>
              <a href="#" class="text-blue-600 font-bold hover:underline">View Deliverables →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. EMPLOYEE DASHBOARD -->
      <div v-else-if="role === 'employee'" class="employee-dash">
        <div class="cms-dash__stats">
          <StatCard title="Assigned Tasks" :value="12" icon="tasks" />
          <StatCard title="In Progress" :value="5" icon="folder" />
          <StatCard title="Completed Tasks" :value="18" icon="tasks" :trend="15" />
          <StatCard title="Upcoming Meetings" :value="3" icon="money" />
        </div>

        <div class="cms-card mt-6">
          <h3 class="font-bold text-lg mb-4">My Task Board Summary</h3>
          <table class="cms-table">
            <thead>
              <tr><th>Task Title</th><th>Priority</th><th>Due Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold">Design Hero Glassmorphism Spec</td>
                <td><span class="cms-badge badge--high">High</span></td>
                <td>Tomorrow</td>
                <td><router-link to="/cms/tasks" class="text-blue-600 font-bold text-xs">Open Task</router-link></td>
              </tr>
              <tr>
                <td class="font-bold">JWT Token Refresh Handling</td>
                <td><span class="cms-badge badge--urgent">Urgent</span></td>
                <td>Today</td>
                <td><router-link to="/cms/tasks" class="text-blue-600 font-bold text-xs">Open Task</router-link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. HR DASHBOARD -->
      <div v-else-if="role === 'hr'" class="hr-dash">
        <div class="cms-dash__stats">
          <StatCard title="Total Employees" :value="stats.employees" icon="people" :trend="5" />
          <StatCard title="Active Staff" :value="stats.employees - 2" icon="people" />
          <StatCard title="On Leave" :value="2" icon="folder" />
          <StatCard title="Pending Payroll" :value="stats.employees" icon="money" />
        </div>

        <div class="cms-card mt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Department Staff Breakdown</h3>
            <router-link to="/cms/employees" class="cms-btn cms-btn--primary text-xs">+ Employee</router-link>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="dept-box"><span>Engineering</span><strong>24 Staff</strong></div>
            <div class="dept-box"><span>Design</span><strong>10 Staff</strong></div>
            <div class="dept-box"><span>Finance & HR</span><strong>8 Staff</strong></div>
          </div>
        </div>
      </div>

      <!-- 4. ACCOUNTANT DASHBOARD -->
      <div v-else-if="role === 'accountant'" class="accountant-dash">
        <div class="cms-dash__stats">
          <StatCard title="Total Revenue" :value="stats.revenue" icon="money" prefix="$" :trend="22" />
          <StatCard title="Total Expenses" :value="stats.expenses" icon="money" prefix="$" :trend="-3" />
          <StatCard title="Net Profit" :value="stats.profit" icon="chart" prefix="$" :trend="18" />
          <StatCard title="Clients Paid" :value="stats.clients" icon="people" />
        </div>

        <div class="cms-card mt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Financial Summary & Report Export</h3>
            <router-link to="/cms/reports" class="cms-btn cms-btn--secondary text-xs">📄 Full Report</router-link>
          </div>
          <p class="text-sm text-gray-600">Current Q3 Operating Profit Margin: <strong>49.9%</strong>. All pending payouts verified.</p>
        </div>
      </div>

      <!-- 5. SUPER ADMIN / ADMIN / MANAGER DASHBOARD -->
      <div v-else class="admin-dash">
        <div class="cms-dash__stats">
          <StatCard title="Total Projects" :value="stats.totalProjects" icon="folder" :trend="12" />
          <StatCard title="Active Projects" :value="stats.activeProjects" icon="folder" :trend="8" />
          <StatCard title="Employees" :value="stats.employees" icon="people" :trend="5" />
          <StatCard title="Clients" :value="stats.clients" icon="people" :trend="15" />
          <StatCard title="Revenue" :value="stats.revenue" icon="money" prefix="$" :trend="22" />
          <StatCard title="Expenses" :value="stats.expenses" icon="money" prefix="$" :trend="-3" />
          <StatCard title="Profit" :value="stats.profit" icon="chart" prefix="$" :trend="18" />
          <StatCard title="Pending Tasks" :value="stats.pendingTasks" icon="tasks" :trend="-7" />
        </div>

        <!-- Charts row -->
        <div class="cms-dash__charts-row">
          <div class="cms-dash__chart-card cms-dash__chart-card--main">
            <div class="cms-dash__chart-header">
              <h3 class="cms-dash__chart-title">Balance & Revenue Trends</h3>
              <div class="cms-dash__range-btns">
                <button v-for="r in ranges" :key="r" class="cms-dash__range-btn" :class="{ 'cms-dash__range-btn--active': selectedRange === r }" @click="selectedRange = r">{{ r }}</button>
              </div>
            </div>
            <div id="revenue-chart"></div>
          </div>

          <div class="cms-dash__chart-side">
            <div class="cms-dash__balance-card">
              <p class="cms-dash__balance-label">Available Profit Balance</p>
              <p class="cms-dash__balance-value">${{ (stats.profit || 0).toLocaleString() }}</p>
              <button class="cms-dash__btn cms-dash__btn--primary cms-dash__btn--full">Withdraw Funds</button>
            </div>

            <div class="cms-dash__chart-card cms-dash__chart-card--sm mt-4">
              <h3 class="cms-dash__chart-title">Project Distribution</h3>
              <div id="project-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cms-dash { max-width: 1280px; }
.cms-dash__welcome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.cms-dash__welcome-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; color: #0a0a0a; }
.cms-dash__welcome-sub { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }

.role-badge { background: #0a0a0a; color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.125rem 0.5rem; border-radius: 0.25rem; letter-spacing: 0.05em; }

.cms-dash__btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; }
.cms-dash__btn--primary { background: #0a0a0a; color: #fff; }
.cms-dash__btn--secondary { background: #f3f4f6; color: #374151; }

.cms-dash__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.cms-dash__charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 1rem; margin-bottom: 1.5rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }

.client-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.client-stat-box { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.75rem; padding: 1.25rem; display: flex; flex-direction: column; }
.client-stat-box .label { font-size: 0.8125rem; color: #6b7280; }
.client-stat-box .val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; color: #0a0a0a; margin-top: 0.25rem; }

.client-project-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; }
.progress-bar { background: #e5e7eb; height: 8px; border-radius: 999px; overflow: hidden; }
.progress-fill { background: #0a0a0a; height: 100%; border-radius: 999px; }

.dept-box { background: #f8f9fa; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.5rem; display: flex; flex-direction: column; }
.dept-box span { font-size: 0.75rem; color: #6b7280; }
.dept-box strong { font-size: 1.125rem; font-weight: 800; color: #0a0a0a; }

.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.625rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.75rem 0.625rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--high { background: #fee2e2; color: #991b1b; }
.badge--urgent { background: #7f1d1d; color: #fff; }

.cms-dash__balance-card { background: #ffffff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }
.cms-dash__balance-label { font-size: 0.8125rem; font-weight: 600; color: #6b7280; }
.cms-dash__balance-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; color: #0a0a0a; margin: 0.375rem 0 1rem; }
.cms-dash__btn--full { width: 100%; justify-content: center; }

.cms-dash__loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; color: #6b7280; gap: 1rem; }
.cms-dash__loader { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .cms-dash__stats { grid-template-columns: repeat(2, 1fr); }
  .cms-dash__charts-row { grid-template-columns: 1fr; }
  .client-stats-grid { grid-template-columns: 1fr; }
}
</style>
