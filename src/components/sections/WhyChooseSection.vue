<script setup>
import { useI18n } from 'vue-i18n'
import { Users, Zap, Cpu, Headphones, ShieldCheck, TrendingUp, Award, Trophy, Star, Medal } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import GrowthChart from '@/components/ui/GrowthChart.vue'

const { t, tm } = useI18n()
const icons = [Users, Zap, Cpu, Headphones, ShieldCheck, TrendingUp]

const awards = [
  { icon: Trophy, title: 'Top IT Company 2025', org: 'Clutch Global Awards' },
  { icon: Award, title: 'Best Digital Partner', org: 'TechRwanda Summit' },
  { icon: Star, title: '5-Star Client Rating', org: 'Google Reviews' },
  { icon: Medal, title: 'Excellence in AI', org: 'East Africa Tech Awards' },
]

const growthLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
const growthData = [18, 34, 58, 92, 140, 195, 240]
</script>

<template>
  <section class="py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('why.eyebrow')" :title="t('why.title')" align="center" />

      <div class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, i) in tm('why.items')"
          :key="i"
          class="reveal group relative overflow-hidden rounded-3xl bg-ink-50/70 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:bg-ink-950"
        >
          <span class="font-display absolute -right-2 -top-4 text-7xl font-extrabold text-ink-950/[0.05] transition-colors duration-500 group-hover:text-white/10">
            {{ String(i + 1).padStart(2, '0') }}
          </span>

          <div class="relative">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ink-950 shadow-sm shadow-black/5 transition-colors duration-500 group-hover:bg-accent-500 group-hover:text-white">
              <component :is="icons[i]" class="h-5 w-5" />
            </span>
            <h3 class="font-display mt-5 text-lg font-bold text-ink-950 transition-colors duration-500 group-hover:text-white">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-500 transition-colors duration-500 group-hover:text-white/60">{{ item.desc }}</p>
            <span class="mt-5 block h-[2px] w-8 rounded-full bg-ink-950 transition-all duration-500 group-hover:w-14 group-hover:bg-accent-400"></span>
          </div>
        </div>
      </div>

      <!-- Growth chart + Awards -->
      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div class="reveal rounded-3xl border border-ink-100 p-7 sm:p-8">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Our Impact</p>
              <h3 class="font-display mt-1 text-xl font-bold text-ink-950">Projects delivered, year over year</h3>
            </div>
            <p class="font-display text-3xl font-bold text-accent-600">+240</p>
          </div>
          <div class="mt-6">
            <GrowthChart :labels="growthLabels" :data="growthData" label="Projects Delivered" />
          </div>
        </div>

        <div class="reveal rounded-3xl border border-ink-100 bg-ink-50/60 p-7 sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Recognition</p>
          <h3 class="font-display mt-1 text-xl font-bold text-ink-950">Awards &amp; Achievements</h3>
          <div class="mt-6 grid grid-cols-2 gap-4">
            <div v-for="award in awards" :key="award.title" class="flex flex-col items-start gap-2 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-white">
                <component :is="award.icon" class="h-[18px] w-[18px]" />
              </span>
              <p class="font-display text-sm font-bold leading-tight text-ink-950">{{ award.title }}</p>
              <p class="text-xs text-ink-500">{{ award.org }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
