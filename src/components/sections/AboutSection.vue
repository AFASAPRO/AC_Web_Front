<script setup>
import { useI18n } from 'vue-i18n'
import { Target, Eye, ArrowRight } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import CompanyTimeline from './CompanyTimeline.vue'

const { t, tm } = useI18n()
</script>

<template>
  <section id="about" class="relative py-24 sm:py-32">
    <div class="container-px mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
      <div class="reveal relative order-2 lg:order-1">
        <div class="grid grid-cols-2 gap-4">
          <LazyImage
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=900&auto=format&fit=crop"
            alt="AC Company engineers collaborating"
            aspect="aspect-[3/4]"
            img-class="rounded-2xl"
            class="translate-y-6"
          />
          <LazyImage
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=900&auto=format&fit=crop"
            alt="AC Company team reviewing a product"
            aspect="aspect-[3/4]"
            img-class="rounded-2xl"
          />
        </div>
        <div class="glass absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-2xl px-6 py-4 shadow-xl shadow-black/10">
          <p class="font-display text-3xl font-bold text-ink-950">9<span class="text-accent-500">+</span></p>
          <p class="max-w-[7rem] text-xs font-medium leading-tight text-ink-500">Years building premium software</p>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <SectionTitle :eyebrow="t('about.eyebrow')" :title="t('about.title')" />
        <p class="reveal mt-5 text-base leading-relaxed text-ink-500">{{ t('about.description') }}</p>

        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="reveal flex items-start gap-3 rounded-2xl border border-ink-100 p-4">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 text-white"><Target class="h-[18px] w-[18px]" /></span>
            <div>
              <p class="font-display text-sm font-bold text-ink-950">{{ t('about.missionTitle') }}</p>
              <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ t('about.mission') }}</p>
            </div>
          </div>
          <div class="reveal flex items-start gap-3 rounded-2xl border border-ink-100 p-4">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-500 text-white"><Eye class="h-[18px] w-[18px]" /></span>
            <div>
              <p class="font-display text-sm font-bold text-ink-950">{{ t('about.visionTitle') }}</p>
              <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ t('about.vision') }}</p>
            </div>
          </div>
        </div>

        <p class="reveal mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{{ t('about.valuesTitle') }}</p>
        <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
          <li v-for="(val, i) in tm('about.values')" :key="i" class="reveal flex items-baseline gap-2 text-sm text-ink-700">
            <span class="text-accent-500">&#9679;</span>
            <span><strong class="text-ink-950">{{ val.title }}</strong> &mdash; {{ val.desc }}</span>
          </li>
        </ul>

        <BaseButton tag="router-link" to="/services" class="reveal mt-9">
          {{ t('about.cta') }} <ArrowRight class="h-4 w-4" />
        </BaseButton>
      </div>
    </div>

    <div class="container-px mx-auto mt-28 max-w-4xl">
      <SectionTitle eyebrow="Our Story" title="A decade of building, one milestone at a time" align="center" />
      <div class="mt-16">
        <CompanyTimeline />
      </div>
    </div>
  </section>
</template>
