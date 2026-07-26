<script setup>
import { FileText, BarChart3 } from 'lucide-vue-next'

function generate(type, format) {
  alert(`Generating ${type} report in ${format.toUpperCase()} format. Export starting...`)
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Executive Reports</h2>
        <p class="cms-page__sub">Export detailed PDF and Excel reports for financial audit, projects, and employees</p>
      </div>
    </div>

    <div class="reports-grid">
      <div class="report-card">
        <h3>Revenue & Expense Report</h3>
        <p>Comprehensive monthly cash flow analysis, profit margins, and categorizations.</p>
        <div class="actions">
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Revenue', 'pdf')"><FileText class="w-4 h-4" /> Export PDF</button>
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Revenue', 'excel')"><BarChart3 class="w-4 h-4" /> Export Excel</button>
        </div>
      </div>

      <div class="report-card">
        <h3>Employee Performance & Payroll</h3>
        <p>Annual salary breakdown, bonuses, attendance, and department evaluations.</p>
        <div class="actions">
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Payroll', 'pdf')"><FileText class="w-4 h-4" /> Export PDF</button>
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Payroll', 'excel')"><BarChart3 class="w-4 h-4" /> Export Excel</button>
        </div>
      </div>

      <div class="report-card">
        <h3>Project Velocity & Milestones</h3>
        <p>Project deadlines, completion velocity, budget utilization, and assigned resources.</p>
        <div class="actions">
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Projects', 'pdf')"><FileText class="w-4 h-4" /> Export PDF</button>
          <button class="cms-btn cms-btn--secondary flex items-center gap-1" @click="generate('Projects', 'excel')"><BarChart3 class="w-4 h-4" /> Export Excel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1200px; margin: 0 auto; }
.cms-page__header { margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; }
.report-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
.report-card h3 { font-size: 1.125rem; font-weight: 800; color: #0a0a0a; margin-bottom: 0.5rem; }
.report-card p { font-size: 0.875rem; color: #6b7280; line-height: 1.5; margin-bottom: 1.5rem; }

.actions { display: flex; gap: 0.5rem; }
.cms-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.8125rem; cursor: pointer; border: none; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
</style>
