<script setup>
import { Landmark, HeartPulse, ShoppingBag, Truck, GraduationCap, Building } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const industries = [
  { name: 'Fintech', icon: Landmark, desc: 'Secure, compliant financial platforms.' },
  { name: 'Healthcare', icon: HeartPulse, desc: 'HIPAA-ready telehealth and records systems.' },
  { name: 'E-commerce', icon: ShoppingBag, desc: 'High-converting storefronts and checkout flows.' },
  { name: 'Logistics', icon: Truck, desc: 'Real-time tracking and fleet management tools.' },
  { name: 'Education', icon: GraduationCap, desc: 'Engaging LMS and learning experiences.' },
  { name: 'Real Estate', icon: Building, desc: 'Listing platforms and property management apps.' },
]
</script>

<template>
  <section id="industries" class="bg-ink-50/60 py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle
        eyebrow="Industries"
        title="Purpose-built for the industries that trust us"
        subtitle="Every sector has different rules of the game. We bring specialized experience to each one."
        align="center"
      />
      <div class="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="(ind, i) in industries"
          :key="ind.name"
          class="reveal group flex flex-col items-center rounded-2xl border border-ink-100 bg-white p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-ink-950"
          :style="{ transitionDelay: (i % 6) * 50 + 'ms' }"
        >
          <span class="grid h-12 w-12 place-items-center rounded-xl bg-ink-100 text-ink-950 transition-colors group-hover:bg-ink-950 group-hover:text-white">
            <component :is="ind.icon" class="h-5 w-5" />
          </span>
          <p class="font-display mt-4 text-sm font-bold text-ink-950">{{ ind.name }}</p>
          <p class="mt-1 text-xs leading-relaxed text-ink-500">{{ ind.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
