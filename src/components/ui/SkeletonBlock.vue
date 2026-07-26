<script setup>
defineProps({
  rounded: { type: String, default: 'rounded-2xl' },
})
</script>

<template>
  <div class="relative overflow-hidden bg-ink-100" :class="rounded" aria-hidden="true">
    <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>
