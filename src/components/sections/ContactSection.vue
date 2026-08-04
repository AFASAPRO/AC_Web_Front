<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { isValidEmail } from '@/utils/helpers'
import { submitContactForm } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import { SITE } from '@/constants/site'

const { t } = useI18n()
const ui = useUiStore()

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const loading = ref(false)

const validate = () => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  errors.email = isValidEmail(form.email) ? '' : 'Enter a valid email address.'
  errors.message = form.message.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  return !errors.name && !errors.email && !errors.message
}

const submit = async () => {
  if (!validate()) return
  loading.value = true
  try {
    await submitContactForm({ ...form })
    ui.pushToast({ type: 'success', message: t('contact.success') })
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' })
  } catch {
    ui.pushToast({ type: 'error', message: 'Could not send your message. Please try again.' })
  } finally {
    loading.value = false
  }
}

const infoItems = [
  { icon: MapPin, label: 'office', value: SITE.address },
  { icon: Phone, label: 'callUs', value: SITE.phone },
  { icon: Mail, label: 'emailUs', value: SITE.email },
  { icon: Clock, label: 'hours', value: null },
]
</script>

<template>
  <section id="contact" class="py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('contact.eyebrow')" :title="t('contact.title')" :subtitle="t('contact.subtitle')" align="center" />

      <div class="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div class="reveal space-y-6">
          <div v-for="item in infoItems" :key="item.label" class="flex items-start gap-4 rounded-2xl border border-ink-100 p-5">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-950 text-white">
              <component :is="item.icon" class="h-[18px] w-[18px]" />
            </span>
            <div>
              <p class="font-display text-sm font-bold text-ink-950">{{ t(`contact.${item.label}`) }}</p>
              <p class="mt-1 text-sm text-ink-500">{{ item.value ?? t('contact.hoursValue') }}</p>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-ink-100">
            <iframe
              title="Nexora Company office location map"
              class="h-56 w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Kigali,Rwanda&output=embed"
            ></iframe>
          </div>
        </div>

        <form class="reveal rounded-3xl border border-ink-100 bg-white p-7 shadow-[0_24px_60px_-32px_rgba(10,10,10,0.15)] sm:p-9" novalidate @submit.prevent="submit">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label for="name" class="text-xs font-semibold text-ink-600">{{ t('contact.name') }}</label>
              <input id="name" v-model="form.name" type="text" class="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-accent-500" />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
            </div>
            <div>
              <label for="email" class="text-xs font-semibold text-ink-600">{{ t('contact.email') }}</label>
              <input id="email" v-model="form.email" type="email" class="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-accent-500" />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>
            <div>
              <label for="phone" class="text-xs font-semibold text-ink-600">{{ t('contact.phone') }}</label>
              <input id="phone" v-model="form.phone" type="tel" class="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-accent-500" />
            </div>
            <div>
              <label for="subject" class="text-xs font-semibold text-ink-600">{{ t('contact.subject') }}</label>
              <input id="subject" v-model="form.subject" type="text" class="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-accent-500" />
            </div>
            <div class="sm:col-span-2">
              <label for="message" class="text-xs font-semibold text-ink-600">{{ t('contact.message') }}</label>
              <textarea id="message" v-model="form.message" rows="4" class="mt-1.5 w-full resize-none rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-accent-500"></textarea>
              <p v-if="errors.message" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
            </div>
          </div>

          <BaseButton type="submit" :disabled="loading" class="mt-7" block size="lg">
            {{ loading ? t('contact.sending') : t('contact.send') }}
            <Send class="h-4 w-4" />
          </BaseButton>
        </form>
      </div>
    </div>
  </section>
</template>
