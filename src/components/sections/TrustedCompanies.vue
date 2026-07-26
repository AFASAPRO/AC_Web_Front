<script setup>
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/content'

const { t } = useI18n()
const content = useContentStore()
</script>

<template>
  <section id="trusted" class="border-y border-ink-100 bg-ink-50/60 py-10">
    <div class="container-px mx-auto max-w-7xl">
      <p class="reveal mb-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
        {{ t('trusted.title') }}
      </p>
    </div>

    <div class="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div class="flex w-max animate-marquee gap-14 group-hover:[animation-play-state:paused]">
        <div v-for="n in 2" :key="n" class="flex shrink-0 items-center gap-14">
          <span
            v-for="logo in content.trustedLogos"
            :key="logo + n"
            class="font-display whitespace-nowrap text-xl font-bold text-ink-300 transition-colors hover:text-ink-950"
          >
            {{ logo }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
