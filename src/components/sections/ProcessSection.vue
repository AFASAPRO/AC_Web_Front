<script setup>
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t, tm } = useI18n()
</script>

<template>
  <section id="process" class="relative overflow-hidden bg-ink-950 py-24 text-white sm:py-32">
    <div class="pointer-events-none absolute inset-0 opacity-[0.04]" style="background-image:radial-gradient(circle,#fff 1px,transparent 1px);background-size:26px 26px" aria-hidden="true"></div>
    <div class="pointer-events-none absolute left-1/2 top-0 h-96 w-[60%] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[140px]" aria-hidden="true"></div>

    <div class="container-px relative mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('process.eyebrow')" :title="t('process.title')" align="center" light />

      <ol class="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, i) in tm('process.steps')"
          :key="i"
          class="reveal group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-400/40 hover:bg-white/[0.06]"
          :style="{ transitionDelay: (i % 4) * 70 + 'ms' }"
        >
          <span class="font-display text-4xl font-bold text-white/10 transition-colors duration-500 group-hover:text-accent-400/40">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display mt-3 text-lg font-bold">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/55">{{ step.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
