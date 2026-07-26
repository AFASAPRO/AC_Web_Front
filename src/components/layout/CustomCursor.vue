<script setup>
import { useCustomCursor } from '@/composables/useCustomCursor'
const { pos, isHovering, isEnabled } = useCustomCursor()
</script>

<template>
  <div v-if="isEnabled" class="pointer-events-none fixed inset-0 z-[95] hidden lg:block" aria-hidden="true">
    <div
      class="absolute rounded-full border border-ink-950/40 transition-[width,height,opacity] duration-200 ease-out"
      :class="isHovering ? 'h-10 w-10 bg-accent-500/10' : 'h-6 w-6'"
      :style="{ left: pos.x + 'px', top: pos.y + 'px', transform: 'translate(-50%, -50%)' }"
    ></div>
    <div
      class="absolute h-1.5 w-1.5 rounded-full bg-ink-950 transition-transform duration-75"
      :style="{ left: pos.x + 'px', top: pos.y + 'px', transform: 'translate(-50%, -50%)' }"
    ></div>
  </div>
</template>
