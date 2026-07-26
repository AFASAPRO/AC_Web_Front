<script setup>
import { useI18n } from 'vue-i18n'
import { ArrowUp } from 'lucide-vue-next'
import { useScrollProgress } from '@/composables/useScrollProgress'

const { t } = useI18n()
const { scrolled } = useScrollProgress()

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="scrolled"
      :aria-label="t('common.backToTop')"
      class="fixed bottom-24 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink-950 text-white shadow-lg shadow-black/25 transition hover:-translate-y-1 hover:bg-accent-500"
      @click="scrollToTop"
    >
      <ArrowUp class="h-5 w-5" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active { transition: all 0.3s ease; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(12px) scale(0.9); }
</style>
