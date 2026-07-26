<script setup>
import { useScrollProgress } from '@/composables/useScrollProgress'
const { progress } = useScrollProgress()
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
    <div class="h-full bg-gradient-to-r from-ink-950 via-accent-500 to-ink-950 transition-[width] duration-150" :style="{ width: progress + '%' }"></div>
  </div>
</template>
