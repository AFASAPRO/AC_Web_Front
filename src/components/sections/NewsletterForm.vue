<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Send } from 'lucide-vue-next'
import { isValidEmail } from '@/utils/helpers'
import { subscribeNewsletter } from '@/services/api'
import { useUiStore } from '@/stores/ui'

const { t } = useI18n()
const ui = useUiStore()
const email = ref('')
const loading = ref(false)
const error = ref('')

const submit = async () => {
  error.value = ''
  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  loading.value = true
  try {
    await subscribeNewsletter(email.value)
    ui.pushToast({ type: 'success', message: t('newsletter.success') })
    email.value = ''
  } catch {
    ui.pushToast({ type: 'error', message: 'Something went wrong. Please try again.' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="glass-dark flex flex-col items-center gap-6 rounded-3xl px-8 py-10 text-center lg:flex-row lg:justify-between lg:text-left">
    <div>
      <h3 class="font-display text-2xl font-bold text-white">{{ t('newsletter.title') }}</h3>
      <p class="mt-1 text-sm text-white/55">{{ t('newsletter.subtitle') }}</p>
    </div>
    <form class="w-full max-w-md" novalidate @submit.prevent="submit">
      <div class="flex flex-col gap-3 sm:flex-row">
        <label for="newsletter-email" class="sr-only">{{ t('newsletter.placeholder') }}</label>
        <input
          id="newsletter-email"
          v-model="email"
          type="email"
          :placeholder="t('newsletter.placeholder')"
          class="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-400"
        />
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {{ t('newsletter.cta') }} <Send class="h-4 w-4" />
        </button>
      </div>
      <p v-if="error" class="mt-2 text-left text-xs text-red-400">{{ error }}</p>
    </form>
  </div>
</template>
