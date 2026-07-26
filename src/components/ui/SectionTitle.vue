<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'left' }, // left | center
  light: { type: Boolean, default: false },
})
</script>

<template>
  <div class="reveal max-w-2xl" :class="align === 'center' ? 'mx-auto text-center' : ''">
    <div
      v-if="eyebrow"
      class="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
      :class="light ? 'border-white/15 text-white/70' : 'border-ink-200 text-ink-500'"
    >
      <span class="h-1.5 w-1.5 rounded-full bg-accent-500"></span>
      {{ eyebrow }}
    </div>
    <h2
      class="font-display text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]"
      :class="light ? 'text-white' : 'text-ink-950'"
    >
      <slot name="title">{{ title }}</slot>
    </h2>
    <p v-if="subtitle" class="mt-4 text-base leading-relaxed sm:text-lg" :class="light ? 'text-white/65' : 'text-ink-500'">
      {{ subtitle }}
    </p>
  </div>
</template>
