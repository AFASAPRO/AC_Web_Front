<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'chart' },
  trend: { type: Number, default: 0 },
  trendLabel: { type: String, default: 'vs last month' },
  prefix: { type: String, default: '' },
})

function formatValue(val) {
  if (typeof val === 'number') {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
    return val.toLocaleString()
  }
  return val
}
</script>

<template>
  <div class="stat-card">
    <div class="stat-card__header">
      <span class="stat-card__icon-wrap">
        <!-- Chart icon -->
        <svg v-if="icon === 'chart'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <!-- People icon -->
        <svg v-else-if="icon === 'people'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <!-- Money icon -->
        <svg v-else-if="icon === 'money'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <!-- Folder icon -->
        <svg v-else-if="icon === 'folder'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <!-- Tasks icon -->
        <svg v-else-if="icon === 'tasks'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <!-- Bell icon -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <p class="stat-card__title">{{ title }}</p>
    </div>
    <p class="stat-card__value">{{ prefix }}{{ formatValue(value) }}</p>
    <div v-if="trend !== 0" class="stat-card__trend" :class="trend > 0 ? 'stat-card__trend--up' : 'stat-card__trend--down'">
      <svg v-if="trend > 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>{{ Math.abs(trend) }}% {{ trendLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: #ffffff;
  border: 1px solid #f0f1f3;
  border-radius: 0.875rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
}
.stat-card:hover {
  border-color: #e4e6e9;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.stat-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}
.stat-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  color: #374151;
}
.stat-card__title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
}

.stat-card__value {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 1.625rem;
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}
.stat-card__trend--up {
  color: #059669;
}
.stat-card__trend--down {
  color: #dc2626;
}
</style>
