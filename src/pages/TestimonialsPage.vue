<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Star } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useContentStore } from '@/stores/content'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t } = useI18n()
const content = useContentStore()
const testimonials = computed(() => content.testimonials)

useSeoMeta({
  title: computed(() => t('testimonials.seoTitle')),
  description: computed(() => t('testimonials.seoDescription')),
  url: computed(() => `${SITE.url}/testimonials`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,85,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            <span class="h-2 w-2 rounded-full bg-accent-500"></span>
            {{ t('testimonials.eyebrow') }}
          </p>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
            {{ t('testimonials.title') }}
          </h1>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t('testimonials.subtitle') }}
          </p>
          <div class="mt-8">
            <BaseButton tag="router-link" to="/contact">{{ t('testimonials.ctaContact') }} <ArrowRight class="h-4 w-4" /></BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('testimonials.sectionEyebrow')" :title="t('testimonials.sectionTitle')" :subtitle="t('testimonials.sectionSubtitle')" align="center" />

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard v-for="testimonial in testimonials" :key="testimonial.name" padding="p-7">
            <div class="flex items-center gap-1 text-accent-500">
              <Star v-for="n in testimonial.rating" :key="`${testimonial.name}-${n}`" class="h-4 w-4 fill-current" />
            </div>
            <p class="mt-4 text-base leading-8 text-ink-600">“{{ testimonial.quote }}”</p>
            <div class="mt-6 flex items-center gap-3">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="h-12 w-12 rounded-full object-cover" />
              <div>
                <p class="font-semibold text-ink-950">{{ testimonial.name }}</p>
                <p class="text-sm text-ink-500">{{ testimonial.role }}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  </main>
</template>
