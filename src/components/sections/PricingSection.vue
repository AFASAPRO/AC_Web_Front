<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t, tm } = useI18n()
const yearly = ref(false)
</script>

<template>
  <section id="pricing" class="py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('pricing.eyebrow')" :title="t('pricing.title')" align="center" />

      <div class="reveal mt-8 flex items-center justify-center gap-3">
        <span class="text-sm font-medium" :class="!yearly ? 'text-ink-950' : 'text-ink-400'">{{ t('pricing.monthly') }}</span>
        <button
          class="relative h-7 w-14 rounded-full transition-colors"
          :class="yearly ? 'bg-ink-950' : 'bg-ink-200'"
          role="switch"
          :aria-checked="yearly"
          aria-label="Toggle yearly pricing"
          @click="yearly = !yearly"
        >
          <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform" :class="yearly ? 'translate-x-8' : 'translate-x-1'"></span>
        </button>
        <span class="text-sm font-medium" :class="yearly ? 'text-ink-950' : 'text-ink-400'">
          {{ t('pricing.yearly') }} <span class="text-accent-600">(-15%)</span>
        </span>
      </div>

      <div class="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div
          v-for="(plan, i) in tm('pricing.plans')"
          :key="plan.name"
          class="reveal relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2"
          :class="i === 1 ? 'border-2 border-ink-950 bg-ink-950 text-white shadow-2xl shadow-black/20' : 'border border-ink-100 bg-white'"
          :style="{ transitionDelay: i * 70 + 'ms' }"
        >
          <span
            v-if="i === 1"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-4 py-1 text-xs font-semibold text-white"
          >
            {{ t('pricing.popular') }}
          </span>

          <h3 class="font-display text-lg font-bold" :class="i === 1 ? 'text-white' : 'text-ink-950'">{{ plan.name }}</h3>
          <p class="mt-2 text-sm" :class="i === 1 ? 'text-white/60' : 'text-ink-500'">{{ plan.desc }}</p>

          <p class="mt-6 flex items-end gap-1">
            <span class="font-display text-4xl font-bold" :class="i === 1 ? 'text-white' : 'text-ink-950'">
              {{ plan.price === 'Custom' ? plan.price : `$${yearly ? Math.round(Number(plan.price.replace(',', '')) * 0.85).toLocaleString() : plan.price}` }}
            </span>
            <span v-if="plan.price !== 'Custom'" class="pb-1.5 text-sm" :class="i === 1 ? 'text-white/50' : 'text-ink-400'">/mo</span>
          </p>

          <ul class="mt-7 space-y-3">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2.5 text-sm" :class="i === 1 ? 'text-white/80' : 'text-ink-600'">
              <Check class="mt-0.5 h-4 w-4 shrink-0" :class="i === 1 ? 'text-accent-400' : 'text-accent-500'" />
              {{ feature }}
            </li>
          </ul>

          <BaseButton tag="router-link" to="/contact" :variant="i === 1 ? 'accent' : 'outline'" block class="mt-8">
            {{ t('pricing.cta') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
