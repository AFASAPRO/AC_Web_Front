<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowRight, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useContentStore } from '@/stores/content'
import { SITE } from '@/constants/site'
import api from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import LazyImage from '@/components/ui/LazyImage.vue'

const { t } = useI18n()
const content = useContentStore()

const liveProjects = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/cms/portfolio')
    if (res.data.success && res.data.data.length > 0) {
      liveProjects.value = res.data.data.map(item => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
        img: item.featuredImage,
        tags: item.technologies || ['Vue 3', 'Node.js'],
        summary: item.description,
      }))
    }
  } catch (err) {
    console.log('Using static portfolio items')
  }
})

const projects = computed(() => {
  if (liveProjects.value.length > 0) {
    return [...liveProjects.value, ...content.portfolio]
  }
  return content.portfolio
})

useSeoMeta({
  title: computed(() => t('portfolio.seoTitle')),
  description: computed(() => t('portfolio.seoDescription')),
  url: computed(() => `${SITE.url}/portfolio`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,111,97,0.16),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            <span class="h-2 w-2 rounded-full bg-accent-500"></span>
            {{ t('portfolio.eyebrow') }}
          </p>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
            {{ t('portfolio.title') }}
          </h1>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t('portfolio.subtitle') }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <BaseButton tag="router-link" to="/contact">{{ t('portfolio.ctaContact') }} <ArrowRight class="h-4 w-4" /></BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('portfolio.eyebrow')" :title="t('portfolio.title')" :subtitle="t('portfolio.subtitle')" align="center" />

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard v-for="project in projects" :key="project.slug" padding="p-0" class="overflow-hidden">
            <LazyImage :src="project.img" :alt="project.title" aspect="aspect-[16/9]" img-class="h-full w-full object-cover" />
            <div class="p-6">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">{{ project.category }}</span>
                <span v-for="tag in project.tags" :key="tag" class="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-500">{{ tag }}</span>
              </div>
              <h3 class="mt-4 font-display text-2xl font-semibold text-ink-950">{{ project.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-ink-500">{{ t('portfolio.projectSummary') }}</p>
              <BaseButton tag="router-link" :to="`/portfolio/${project.slug}`" variant="outline" class="mt-6">
                {{ t('portfolio.viewCase') }} <ExternalLink class="h-4 w-4" />
              </BaseButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  </main>
</template>
