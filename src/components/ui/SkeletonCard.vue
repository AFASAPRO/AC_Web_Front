<script setup>
defineProps({
  aspect: { type: String, default: 'aspect-[4/5]' },
  lines: { type: Number, default: 2 },
})
</script>

<template>
  <div class="overflow-hidden rounded-3xl border border-ink-100">
    <div class="relative overflow-hidden bg-ink-100" :class="aspect" aria-hidden="true">
      <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
    <div class="space-y-2.5 p-6">
      <div class="h-3 w-1/3 rounded-full bg-ink-100"></div>
      <div class="h-4 w-5/6 rounded-full bg-ink-100"></div>
      <div v-for="n in lines" :key="n" class="h-3 rounded-full bg-ink-100" :style="{ width: n === lines ? '60%' : '90%' }"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>
