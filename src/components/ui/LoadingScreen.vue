<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import LogoMark from '@/components/ui/LogoMark.vue'

const { t } = useI18n()
const ui = useUiStore()

const progress = ref(0)
const ready = ref(false)
let raf = null

const tickTo = (target, speed) => {
  cancelAnimationFrame(raf)
  const step = () => {
    progress.value += (target - progress.value) * speed
    if (Math.abs(target - progress.value) > 0.3) {
      raf = requestAnimationFrame(step)
    } else {
      progress.value = target
    }
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  // Ease toward 90% while real assets load, holding until `load` fires.
  tickTo(90, 0.04)

  const finish = () => {
    ready.value = true
    tickTo(100, 0.12)
    setTimeout(() => ui.finishLoading(), 650)
  }

  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })

  // Failsafe so the loader never blocks the site
  setTimeout(finish, 2800)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="ui.isLoading"
      class="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-white"
      role="status"
      aria-live="polite"
    >
      <!-- animated backdrop -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.05]" style="background-image:radial-gradient(#0a0a0a 1px,transparent 1px);background-size:24px 24px" aria-hidden="true"></div>
      <div class="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[120px] animate-aurora" aria-hidden="true"></div>

      <div class="relative flex flex-col items-center">
        <div class="relative">
          <svg class="h-28 w-28 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f1f3" stroke-width="3" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#loader-gradient)"
              stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 44"
              :stroke-dashoffset="2 * Math.PI * 44 * (1 - progress / 100)"
              style="transition: stroke-dashoffset 0.1s linear"
            />
            <defs>
              <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0a0a0a" />
                <stop offset="100%" stop-color="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 grid place-items-center">
            <LogoMark img-class="h-8 w-auto" />
          </div>
        </div>

        <p class="font-display mt-7 text-2xl font-bold tabular-nums text-ink-950">{{ Math.round(progress) }}%</p>
        <p class="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-400">
          {{ ready ? 'Ready' : t('common.loading') }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-leave-active { transition: opacity 0.6s ease, filter 0.6s ease; }
.loader-fade-leave-to { opacity: 0; filter: blur(6px); }
</style>
