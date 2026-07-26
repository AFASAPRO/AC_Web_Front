<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: 'This module is under development and will be available soon.' },
  icon: { type: String, default: '🚧' },
})
</script>

<template>
  <div class="stub-page">
    <div class="stub-page__card">
      <span class="stub-page__icon">{{ icon }}</span>
      <h2 class="stub-page__title">{{ title }}</h2>
      <p class="stub-page__desc">{{ description }}</p>
      <div class="stub-page__badge">Coming Soon</div>
    </div>
  </div>
</template>

<style scoped>
.stub-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 180px);
}
.stub-page__card {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 420px;
}
.stub-page__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}
.stub-page__title {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 1.375rem;
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}
.stub-page__desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.stub-page__badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  background: #f3f4f6;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
