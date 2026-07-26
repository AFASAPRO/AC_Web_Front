<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { useContentStore } from '@/stores/content'

const { t, tm } = useI18n()
const content = useContentStore()
</script>

<template>
  <section id="services" class="bg-white py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <div class="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <SectionTitle :eyebrow="t('services.eyebrow')" :title="t('services.title')" :subtitle="t('services.subtitle')" />
      </div>

      <div class="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, i) in tm('services.items')"
          :key="i"
          class="reveal group relative bg-white p-7 transition-colors duration-400 hover:bg-ink-50/80 sm:p-8"
        >
          <div class="flex items-start justify-between">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-ink-950 text-white transition-transform duration-400 group-hover:-translate-y-1 group-hover:bg-accent-500">
              <component :is="content.serviceIcons[i]" class="h-5 w-5" />
            </span>
            <span class="font-display text-xs font-bold text-ink-300">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <h3 class="font-display mt-6 text-lg font-bold text-ink-950">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-500">{{ item.desc }}</p>

          <RouterLink to="/contact" class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950">
            <span class="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:decoration-ink-950">
              {{ t('services.learnMore') }}
            </span>
            <ArrowUpRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </RouterLink>
          <span class="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-ink-950 to-accent-500 transition-transform duration-400 group-hover:scale-x-100"></span>
        </div>
      </div>
    </div>
  </section>
</template>
