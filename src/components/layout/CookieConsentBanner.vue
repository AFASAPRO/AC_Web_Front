<script setup>
import { ref, onMounted } from 'vue'
import { Cookie } from 'lucide-vue-next'

const visible = ref(false)
const STORAGE_KEY = 'ac-cookie-consent'

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) setTimeout(() => (visible.value = true), 1200)
})

const respond = (value) => {
  localStorage.setItem(STORAGE_KEY, value)
  visible.value = false
}
</script>

<template>
  <Transition name="rise">
    <div
      v-if="visible"
      class="glass fixed inset-x-4 bottom-6 z-[80] mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-3xl p-5 shadow-2xl shadow-black/15 sm:flex-row sm:items-center sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-950 text-white">
        <Cookie class="h-5 w-5" />
      </span>
      <p class="flex-1 text-sm leading-relaxed text-ink-600">
        We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.
      </p>
      <div class="flex w-full shrink-0 gap-2 sm:w-auto">
        <button
          class="flex-1 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-ink-950 sm:flex-none"
          @click="respond('declined')"
        >
          Decline
        </button>
        <button
          class="flex-1 rounded-full bg-ink-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600 sm:flex-none"
          @click="respond('accepted')"
        >
          Accept
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.rise-enter-active, .rise-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.rise-enter-from, .rise-leave-to { opacity: 0; transform: translateY(24px); }
</style>
