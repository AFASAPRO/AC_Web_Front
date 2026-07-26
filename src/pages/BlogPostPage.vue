<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Calendar } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { formatDate } from '@/utils/helpers'
import LazyImage from '@/components/ui/LazyImage.vue'
import ShareButtons from '@/components/ui/ShareButtons.vue'
import { SITE } from '@/constants/site'

const route = useRoute()
const { locale } = useI18n()
const content = useContentStore()
const post = computed(() => content.blog.find((p) => p.slug === route.params.slug) || content.blog[0])

useSeoMeta({
  title: computed(() => `${post.value.title} \u2014 ${SITE.name} Blog`),
  description: computed(() => post.value.excerpt),
  url: computed(() => `${SITE.url}/blog/${post.value.slug}`),
  image: computed(() => post.value.img),
})
</script>

<template>
  <main class="pb-24 pt-40 sm:pt-48">
    <div class="container-px mx-auto max-w-3xl">
      <RouterLink to="/#blog" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-950">
        <ArrowLeft class="h-4 w-4" /> Back to blog
      </RouterLink>

      <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-600">{{ post.category }}</p>
      <h1 class="font-display mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">{{ post.title }}</h1>
      <p class="mt-3 flex items-center gap-1.5 text-sm text-ink-400"><Calendar class="h-4 w-4" /> {{ formatDate(post.date, locale) }}</p>
      <ShareButtons class="mt-5" :url="`${SITE.url}/blog/${post.slug}`" :title="post.title" />

      <LazyImage :src="post.img" :alt="post.title" aspect="aspect-[16/9]" img-class="rounded-3xl" class="mt-8" />

      <div class="prose prose-ink mt-10 max-w-none text-ink-600">
        <p>{{ post.excerpt }}</p>
        <p>
          Our engineering team continues to track how this shift affects delivery timelines, code quality
          and the overall developer experience across the projects we ship for clients.
        </p>
        <h2 class="font-display text-ink-950">Key takeaways</h2>
        <p>Teams that adapt early tend to compound advantages in velocity and product quality over time.</p>
      </div>
    </div>
  </main>
</template>
