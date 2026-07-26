<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Building2, HeartPulse, ShoppingBag, Truck, GraduationCap, Landmark, ArrowRight } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t } = useI18n()
const industryDefinitions = [
  { key: 'fintech', icon: Landmark },
  { key: 'healthcare', icon: HeartPulse },
  { key: 'ecommerce', icon: ShoppingBag },
  { key: 'logistics', icon: Truck },
  { key: 'education', icon: GraduationCap },
  { key: 'realEstate', icon: Building2 },
]
const industries = computed(() => industryDefinitions.map((item) => ({
  ...item,
  name: t(`industries.items.${item.key}.name`),
  description: t(`industries.items.${item.key}.description`),
  })))

useSeoMeta({
  title: computed(() => t('industries.seoTitle')),
  description: computed(() => t('industries.seoDescription')),
  url: computed(() => `${SITE.url}/industries`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,184,148,0.16),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            <span class="h-2 w-2 rounded-full bg-accent-500"></span>
            {{ t('industries.eyebrow') }}
          </p>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
            {{ t('industries.title') }}
          </h1>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t('industries.subtitle') }}
          </p>
          <div class="mt-8">
            <BaseButton tag="router-link" to="/services">{{ t('industries.ctaServices') }} <ArrowRight class="h-4 w-4" /></BaseButton>
            <BaseButton tag="router-link" to="/contact" variant="outline">{{ t('industries.ctaContact') }}</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('industries.eyebrow')" :title="t('industries.cardSectionTitle')" :subtitle="t('industries.cardSectionSubtitle')" align="center" />

        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <GlassCard v-for="industry in industries" :key="industry.name" padding="p-7">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
              <component :is="industry.icon" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-950">{{ industry.name }}</h3>
            <p class="mt-3 text-sm leading-7 text-ink-500">{{ industry.description }}</p>
          </GlassCard>
        </div>
      </div>
    </section>
  </main>
</template>
