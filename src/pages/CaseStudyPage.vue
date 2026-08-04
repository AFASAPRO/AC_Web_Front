<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, ExternalLink, Github } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'
import { useSeoMeta } from '@/composables/useSeoMeta'
import LazyImage from '@/components/ui/LazyImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ShareButtons from '@/components/ui/ShareButtons.vue'
import { SITE } from '@/constants/site'

const route = useRoute()
const content = useContentStore()
const project = computed(() => content.portfolio.find((p) => p.slug === route.params.slug) || content.portfolio[0])

useSeoMeta({
  title: computed(() => `${project.value.title} \u2014 ${SITE.name}`),
  description: computed(() => `Case study: ${project.value.title}, built by ${SITE.name}.`),
  url: computed(() => `${SITE.url}/portfolio/${project.value.slug}`),
  image: computed(() => project.value.img),
})
</script>

<template>
  <main class="pb-24 pt-40 sm:pt-48">
    <div class="container-px mx-auto max-w-4xl">
      <RouterLink to="/#portfolio" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-950">
        <ArrowLeft class="h-4 w-4" /> Back to portfolio
      </RouterLink>

      <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-600">{{ project.category }}</p>
      <h1 class="font-display mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">{{ project.title }}</h1>

      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in project.tags" :key="tag" class="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">{{ tag }}</span>
      </div>
      <ShareButtons class="mt-5" :url="`${SITE.url}/portfolio/${project.slug}`" :title="project.title" />

      <div class="mt-8 overflow-hidden rounded-3xl border border-ink-100 dark:border-ink-800 shadow-lg bg-ink-950">
        <div class="flex items-center justify-between border-b border-ink-100 bg-ink-50/80 px-4 py-3 dark:border-ink-800 dark:bg-ink-950/80">
          <div class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <span class="text-[10px] font-mono font-medium uppercase tracking-wider text-ink-400 dark:text-ink-400">
            {{ project.category }}
          </span>
        </div>
        <LazyImage :src="project.img" :alt="project.title" aspect="aspect-[16/10]" img-class="h-full w-full object-cover object-top" />
      </div>

      <div class="prose prose-ink mt-10 max-w-none text-ink-600">
        <p>
          We partnered closely with the client's team through discovery, design and engineering to
          deliver {{ project.title.toLowerCase() }}. The result: a resilient, well-tested platform that
          performs under real production load.
        </p>
        <h2 class="font-display text-ink-950">The Challenge</h2>
        <p>The existing system struggled to scale and lacked the flexibility to support new business requirements.</p>
        <h2 class="font-display text-ink-950">Our Approach</h2>
        <p>We ran a rapid discovery sprint, mapped the architecture, then delivered in focused two-week iterations with continuous client feedback.</p>
        <h2 class="font-display text-ink-950">The Result</h2>
        <p>A production-ready platform, shipped on time, with measurable improvements in performance and user satisfaction.</p>
      </div>

      <div class="mt-10 flex flex-wrap gap-3">
        <BaseButton><ExternalLink class="h-4 w-4" /> Live Demo</BaseButton>
        <BaseButton variant="outline"><Github class="h-4 w-4" /> Source Code</BaseButton>
      </div>
    </div>
  </main>
</template>
