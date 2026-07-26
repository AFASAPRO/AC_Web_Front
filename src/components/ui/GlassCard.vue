<script setup>
defineProps({
  hover: { type: Boolean, default: true },
  padding: { type: String, default: 'p-7' },
})
</script>

<template>
  <div
    class="group relative rounded-3xl border border-ink-100 bg-white transition-all duration-500"
    :class="[padding, hover ? 'hover:-translate-y-1.5 hover:border-ink-200 hover:shadow-[0_24px_48px_-24px_rgba(10,10,10,0.18)]' : '']"
  >
    <div
      v-if="hover"
      class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style="background: radial-gradient(480px circle at var(--mx,50%) var(--my,0%), rgba(37,99,235,0.06), transparent 60%)"
      @mousemove="(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', (e.clientX - r.left) + 'px'); e.currentTarget.style.setProperty('--my', (e.clientY - r.top) + 'px'); }"
    ></div>
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
