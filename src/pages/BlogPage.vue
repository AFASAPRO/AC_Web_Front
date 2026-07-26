<script setup>
import { computed } from 'vue'
import { ArrowRight, Calendar } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useContentStore } from '@/stores/content'
import { SITE } from '@/constants/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import { formatDate } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'

const content = useContentStore()
const posts = computed(() => content.blog)
const { locale, t } = useI18n()

useSeoMeta({
  title: computed(() => t('blog.seoTitle')),
  description: computed(() => t('blog.seoDescription')),
  url: computed(() => `${SITE.url}/blog`),
})
</script>

<template>
  <main class="pb-24 pt-36 sm:pt-44">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,111,97,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_24%)]"></div>
      <div class="container-px relative mx-auto max-w-7xl px-6">
        <div class="max-w-3xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            <span class="h-2 w-2 rounded-full bg-accent-500"></span>
            {{ t('blog.eyebrow') }}
          </p>
          <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
            {{ t('blog.title') }}
          </h1>
          <p class="mt-5 text-lg leading-8 text-ink-600">
            {{ t('blog.subtitle') }}
          </p>
          <div class="mt-8">
            <BaseButton tag="router-link" to="/contact">{{ t('blog.ctaContact') }} <ArrowRight class="h-4 w-4" /></BaseButton>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-20">
      <div class="container-px mx-auto max-w-7xl px-6">
        <SectionTitle :eyebrow="t('blog.sectionEyebrow')" :title="t('blog.sectionTitle')" :subtitle="t('blog.sectionSubtitle')" align="center" />

        <div class="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard v-for="post in posts" :key="post.slug" padding="p-0" class="overflow-hidden">
            <LazyImage :src="post.img" :alt="post.title" aspect="aspect-[4/3]" img-class="h-full w-full object-cover" />
            <div class="p-6">
              <div class="inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                <Calendar class="h-3.5 w-3.5" />
                {{ formatDate(post.date, locale) }}
              </div>
              <h3 class="mt-4 font-display text-xl font-semibold text-ink-950">{{ post.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-ink-500">{{ post.excerpt }}</p>
              <BaseButton tag="router-link" :to="`/blog/${post.slug}`" variant="outline" class="mt-6">
                {{ t('blog.readArticle') }}
              </BaseButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  </main>
</template>
