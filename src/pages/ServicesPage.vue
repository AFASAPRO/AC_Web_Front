<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, BrainCircuit, Cloud, Palette, Smartphone, Sparkles, Wrench } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t, tm } = useI18n()
const services = computed(() => {
  const icons = [Palette, Smartphone, BrainCircuit, Cloud]
  return tm('services.items').slice(0, 4).map((item, index) => ({
    ...item,
    icon: icons[index],
  }))
})
const outcomes = tm('services.outcomes')

useSeoMeta({
  title: computed(() => t('services.seoTitle')),
  description: computed(() => t('services.seoDescription')),
  url: computed(() => `${SITE.url}/services`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(122,85,255,0.18),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            <span class="h-2 w-2 rounded-full bg-accent-500"></span>
            {{ t('services.eyebrow') }}
          </p>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
            {{ t('services.title') }}
          </h1>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t('services.subtitle') }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <BaseButton tag="router-link" to="/portfolio">{{ t('services.ctaWork') }} <ArrowRight class="h-4 w-4" /></BaseButton>
            <BaseButton tag="router-link" to="/contact" variant="outline">{{ t('services.ctaProject') }}</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('services.eyebrow')" :title="t('services.title')" :subtitle="t('services.subtitle')" align="center" />

        <div class="mt-10 grid gap-6 md:grid-cols-2">
          <GlassCard v-for="service in services" :key="service.title" padding="p-7">
            <div class="flex items-start justify-between gap-4">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                <component :is="service.icon" class="h-5 w-5" />
              </div>
              <div class="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
                {{ t('services.coreOffering') }}
              </div>
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-950">{{ service.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-ink-500">{{ service.desc }}</p>
            <ul class="mt-4 space-y-2 text-sm text-ink-600">
              <li v-for="point in service.features" :key="point" class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-accent-500"></span>
                {{ point }}
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>

    <section class="mt-16">
      <div class="container-px mx-auto max-w-7xl px-6">
        <GlassCard padding="p-8" class="overflow-hidden border-ink-200 bg-linear-to-r from-ink-950 via-ink-900 to-ink-950 text-white">
          <div class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{{ t('services.deliveryEyebrow') }}</p>
              <h2 class="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">{{ t('services.deliveryTitle') }}</h2>
              <p class="mt-4 max-w-2xl text-sm leading-7 text-white/70">{{ t('services.deliverySubtitle') }}</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-accent-300">
                  <Wrench class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">{{ t('services.deliveryWhatYouGetTitle') }}</p>
                  <p class="text-sm text-white/70">{{ t('services.deliveryWhatYouGetSubtitle') }}</p>
                </div>
              </div>
              <ul class="mt-4 space-y-3">
                <li v-for="item in outcomes" :key="item" class="flex items-center gap-2 text-sm text-white/75">
                  <span class="h-2 w-2 rounded-full bg-accent-400"></span>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  </main>
</template>
