<script setup>
import { spawnRipple } from '@/animations/gsap'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | outline | ghost | white | accent
  size: { type: String, default: 'md' }, // sm | md | lg
  tag: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
})

const rippleColor = {
  primary: 'rgba(255,255,255,0.35)',
  accent: 'rgba(255,255,255,0.4)',
  white: 'rgba(10,10,10,0.08)',
  outline: 'rgba(10,10,10,0.08)',
  ghost: 'rgba(10,10,10,0.06)',
}

const onRipple = (e) => {
  spawnRipple(e, e.currentTarget, rippleColor[props.variant] || 'rgba(255,255,255,0.35)')
}
</script>

<template>
  <component
    :is="tag"
    class="btn-ripple group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="[
      block ? 'w-full' : '',
      size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3.5 text-sm',
      variant === 'primary' && 'bg-ink-950 text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_12px_32px_-8px_rgba(0,0,0,0.6)] hover:-translate-y-0.5',
      variant === 'outline' && 'border border-ink-200 text-ink-950 hover:border-ink-950 hover:-translate-y-0.5',
      variant === 'ghost' && 'text-ink-950 hover:bg-ink-100',
      variant === 'white' && 'bg-white text-ink-950 hover:-translate-y-0.5 shadow-lg shadow-black/10',
      variant === 'accent' && 'bg-accent-500 text-white hover:bg-accent-600 hover:-translate-y-0.5 shadow-lg shadow-accent-500/30',
    ]"
    @click="onRipple"
  >
    <span v-if="variant === 'primary'" class="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-700 to-ink-950 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
    </span>
  </component>
</template>
