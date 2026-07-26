<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'

const { t } = useI18n()
const contactMethods = computed(() => [
  { title: t('contact.emailUs'), value: SITE.email, href: `mailto:${SITE.email}`, icon: Mail },
  { title: t('contact.callUs'), value: SITE.phone, href: `tel:${SITE.phone}`, icon: Phone },
  { title: t('contact.whatsapp'), value: `+${SITE.whatsapp}`, href: `https://wa.me/${SITE.whatsapp}`, icon: MessageCircle },
  { title: t('contact.visit'), value: SITE.address, href: 'https://maps.google.com', icon: MapPin },
])

useSeoMeta({
  title: computed(() => t('contact.seoTitle')),
  description: computed(() => t('contact.seoDescription')),
  url: computed(() => `${SITE.url}/contact`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,111,97,0.16),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
              <span class="h-2 w-2 rounded-full bg-accent-500"></span>
              {{ t('contact.eyebrow') }}
            </p>
            <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
              {{ t('contact.title') }}
            </h1>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-ink-600">
              {{ t('contact.subtitle') }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <BaseButton tag="a" :href="`mailto:${SITE.email}`">{{ t('contact.ctaEmail') }} <ArrowRight class="h-4 w-4" /></BaseButton>
              <BaseButton tag="a" :href="`https://wa.me/${SITE.whatsapp}`" variant="outline">{{ t('contact.ctaWhatsapp') }}</BaseButton>
            </div>
          </div>

          <GlassCard padding="p-7" class="bg-white/80 backdrop-blur">
            <div class="grid gap-4">
              <a v-for="method in contactMethods" :key="method.title" :href="method.href" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/70 p-4 transition hover:border-accent-500 hover:bg-white">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                  <component :is="method.icon" class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-ink-950">{{ method.title }}</p>
                  <p class="text-sm text-ink-500">{{ method.value }}</p>
                </div>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  </main>
</template>
