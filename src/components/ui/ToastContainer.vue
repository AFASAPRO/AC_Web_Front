<script setup>
import { TransitionGroup } from 'vue'
import { CheckCircle2, XCircle, X } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <div class="pointer-events-none fixed bottom-6 right-6 z-[90] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in ui.toasts"
        :key="toast.id"
        class="glass pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-xl shadow-black/10"
        role="status"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <XCircle v-else class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <p class="flex-1 text-sm font-medium text-ink-800">{{ toast.message }}</p>
        <button aria-label="Dismiss" @click="ui.dismissToast(toast.id)">
          <X class="h-4 w-4 text-ink-400 hover:text-ink-800" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateX(40px) scale(0.95); }
</style>
