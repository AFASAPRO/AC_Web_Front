<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Smartphone, X } from 'lucide-vue-next'

const { t } = useI18n()

const visible = ref(false)
const deferredPrompt = ref(null)
const timerElapsed = ref(false)

const PROMPT_DISMISSED_KEY = 'ac_pwa_prompt_dismissed'
const INSTALLED_KEY = 'ac_pwa_installed'

const isDismissedOrInstalled = () => {
  return (
    localStorage.getItem(PROMPT_DISMISSED_KEY) === 'true' ||
    localStorage.getItem(INSTALLED_KEY) === 'true' ||
    window.matchMedia('(display-mode: standalone)').matches
  )
}

const evaluateAndShow = () => {
  if (timerElapsed.value && deferredPrompt.value && !isDismissedOrInstalled()) {
    visible.value = true
  }
}

const handleBeforeInstallPrompt = (e) => {
  // Prevent browser's default install mini-infobar
  e.preventDefault()
  deferredPrompt.value = e
  evaluateAndShow()
}

const handleAppInstalled = () => {
  visible.value = false
  deferredPrompt.value = null
  localStorage.setItem(INSTALLED_KEY, 'true')
}

let timerId = null

onMounted(() => {
  if (isDismissedOrInstalled()) return

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  // Start 5-second timer on visit
  timerId = setTimeout(() => {
    timerElapsed.value = true
    evaluateAndShow()
  }, 5000)
})

onUnmounted(() => {
  if (timerId) clearTimeout(timerId)
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

const installApp = async () => {
  if (!deferredPrompt.value) return

  // Show the native browser install prompt
  deferredPrompt.value.prompt()

  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    localStorage.setItem(INSTALLED_KEY, 'true')
  } else {
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'true')
  }

  deferredPrompt.value = null
  visible.value = false
}

const dismissPrompt = () => {
  visible.value = false
  localStorage.setItem(PROMPT_DISMISSED_KEY, 'true')
}
</script>

<template>
  <Transition name="pwa-rise">
    <div
      v-if="visible"
      class="glass fixed bottom-6 right-6 z-[90] mx-4 max-w-md rounded-3xl p-6 shadow-2xl shadow-black/20 border border-white/20 sm:mx-0 sm:right-6"
      role="dialog"
      aria-labelledby="pwa-prompt-title"
    >
      <!-- Close button -->
      <button
        type="button"
        class="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
        aria-label="Close"
        @click="dismissPrompt"
      >
        <X class="h-4 w-4" />
      </button>

      <div class="flex items-start gap-4">
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink-950 text-white shadow-md shadow-ink-950/20">
          <Smartphone class="h-6 w-6" />
        </div>

        <div class="flex-1">
          <h3 id="pwa-prompt-title" class="text-base font-bold text-ink-950">
            {{ t('pwa.title') }}
          </h3>
          <p class="mt-1 text-xs leading-relaxed text-ink-600">
            {{ t('pwa.description') }}
          </p>

          <div class="mt-4 flex items-center gap-2">
            <button
              type="button"
              class="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600 shadow-sm"
              @click="installApp"
            >
              <Download class="h-3.5 w-3.5" />
              <span>{{ t('pwa.install') }}</span>
            </button>

            <button
              type="button"
              class="rounded-full border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-950 hover:bg-ink-50"
              @click="dismissPrompt"
            >
              {{ t('pwa.later') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-rise-enter-active,
.pwa-rise-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.pwa-rise-enter-from,
.pwa-rise-leave-to {
  opacity: 0;
  transform: translateY(32px) scale(0.96);
}
</style>
