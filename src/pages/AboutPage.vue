<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Compass, Rocket, ShieldCheck, Sparkles, Users } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t, tm } = useI18n()
const pillars = tm('about.pillars')
const milestones = tm('about.milestones')
const differentiators = tm('about.differentiators')

useSeoMeta({
  title: computed(() => t('about.seoTitle')),
  description: computed(() => t('about.seoDescription')),
  url: computed(() => `${SITE.url}/about`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,111,97,0.16),transparent_30%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
              <span class="h-2 w-2 rounded-full bg-accent-500"></span>
              {{ t('about.eyebrow') }}
            </p>
            <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl lg:text-6xl">
              {{ t('about.title') }}
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-ink-600">
              {{ t('about.description') }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <BaseButton tag="router-link" to="/services">{{ t('about.ctaPrimary') }} <ArrowRight class="h-4 w-4" /></BaseButton>
              <BaseButton tag="router-link" to="/contact" variant="outline">{{ t('about.ctaSecondary') }}</BaseButton>
            </div>
          </div>

          <GlassCard padding="p-8" class="bg-white/80 backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                <Users class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold text-ink-950">{{ t('about.heroTagline') }}</p>
                <p class="text-sm text-ink-500">{{ t('about.heroSubtitle') }}</p>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div v-for="item in milestones" :key="item.label" class="rounded-2xl border border-ink-100 bg-ink-50/80 p-4 text-center">
                <p class="font-display text-2xl font-semibold text-ink-950">{{ item.value }}</p>
                <p class="mt-1 text-sm text-ink-500">{{ item.label }}</p>
              </div>
            </div>

            <div class="mt-6 rounded-3xl border border-ink-100 bg-linear-to-br from-ink-950 to-ink-800 p-5 text-white">
              <div class="flex items-center gap-2 text-sm font-medium text-white/70">
                <Rocket class="h-4 w-4 text-accent-400" />
                {{ t('about.heroAccent') }}
              </div>
              <p class="mt-3 text-sm leading-7 text-white/70">
                {{ t('about.heroAccentDescription') }}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('about.differentiatorsEyebrow')" :title="t('about.differentiatorsTitle')" :subtitle="t('about.differentiatorsSubtitle')" align="center" />

        <div class="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard v-for="pillar in pillars" :key="pillar.title" padding="p-7">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
              <component :is="pillar.icon" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-ink-950">{{ pillar.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-ink-500">{{ pillar.body }}</p>
          </GlassCard>
        </div>
      </div>
    </section>

    <section class="mt-20 bg-ink-950 text-white">
      <div class="container-px mx-auto max-w-7xl px-6 py-20">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{{ t('about.valuesEyebrow') }}</p>
            <h2 class="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">{{ t('about.valuesTitle') }}</h2>
            <p class="mt-4 max-w-xl text-sm leading-7 text-white/70">{{ t('about.valuesSubtitle') }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <GlassCard padding="p-6" class="bg-white/5 border border-white/10">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{{ t('about.talentTitle') }}</p>
              <p class="mt-3 text-sm leading-7 text-white/70">{{ t('about.talentDescription') }}</p>
            </GlassCard>
            <GlassCard padding="p-6" class="bg-white/5 border border-white/10">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{{ t('about.partnershipTitle') }}</p>
              <p class="mt-3 text-sm leading-7 text-white/70">{{ t('about.partnershipDescription') }}</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('about.storyEyebrow')" :title="t('about.storyTitle')" :subtitle="t('about.storySubtitle')" align="center" />
        <div class="mt-10 space-y-6">
          <div v-for="item in differentiators" :key="item.title" class="rounded-3xl border border-ink-100 bg-white p-7 shadow-sm shadow-black/5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">{{ item.title }}</p>
            <p class="mt-3 text-base leading-7 text-ink-600">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
