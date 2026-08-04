<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Play, ChevronDown } from 'lucide-vue-next'
import { useMouseParallax } from '@/composables/useMouseParallax'
import { useContentStore } from '@/stores/content'
import { playHeroTimeline } from '@/animations/gsap'
import BaseButton from '@/components/ui/BaseButton.vue'
import AnimatedCounter from '@/components/ui/AnimatedCounter.vue'
import heroBg from '@/assets/images/hero-background.png'
import heroBgWebp from '@/assets/images/hero-background.webp'
import heroIllustration from '@/assets/images/hero-illustration.png'
import heroIllustrationWebp from '@/assets/images/hero-illustration.webp'

const { t } = useI18n()
const content = useContentStore()
const { style: parallaxStyle } = useMouseParallax(10)

const eyebrowRef = ref(null)
const headingRef = ref(null)
const copyRef = ref(null)
const ctasRef = ref(null)
const statsRef = ref(null)
const artRef = ref(null)

onMounted(() => {
  playHeroTimeline({
    eyebrow: eyebrowRef.value,
    heading: headingRef.value,
    copy: copyRef.value,
    ctas: ctasRef.value,
    stats: statsRef.value,
    art: artRef.value,
    cards: [],
  })
})
</script>

<template>
  <section id="home" class="relative overflow-hidden bg-white pb-20 pt-40 sm:pb-28 sm:pt-48 lg:pt-52">
    <!-- Background image (uploaded asset) -->
    <div class="absolute inset-0 -z-20">
      <picture>
        <source :srcset="heroBgWebp" type="image/webp" />
        <img :src="heroBg" alt="" aria-hidden="true" width="1920" height="880" fetchpriority="high" class="h-full w-full object-cover" />
      </picture>
      <div class="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white"></div>
    </div>

    <!-- Subtle black/gray accents (no color aurora — keep it monochrome) -->
    <div class="pointer-events-none absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-ink-950/[0.04] blur-[110px]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute right-0 top-40 -z-10 h-64 w-64 rounded-full bg-ink-950/[0.05] blur-[100px]" aria-hidden="true"></div>

    <div class="container-px relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div ref="eyebrowRef" class="mb-6 flex items-center gap-3">
          <span class="h-[3px] w-8 rounded-full bg-ink-950"></span>
          <span class="text-xs font-bold uppercase tracking-[0.16em] text-ink-950">{{ t('hero.eyebrow') }}</span>
        </div>

        <h1 ref="headingRef" class="font-display text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-ink-950 sm:text-6xl lg:text-[3.75rem]">
          {{ t('hero.title') }}
        </h1>

        <p ref="copyRef" class="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
          {{ t('hero.subtitle') }}
        </p>

        <div ref="ctasRef" class="mt-9 flex flex-wrap items-center gap-5">
          <BaseButton tag="router-link" to="/contact" size="lg">
            {{ t('hero.ctaPrimary') }}
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </BaseButton>

          <RouterLink to="/portfolio" class="group flex items-center gap-3">
            <span class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-ink-950 shadow-lg shadow-black/10 ring-1 ring-ink-100 transition-transform group-hover:scale-110">
              <Play class="h-4 w-4 translate-x-0.5" fill="currentColor" />
            </span>
            <span class="text-sm font-semibold text-ink-950 underline decoration-ink-300 decoration-2 underline-offset-4 group-hover:decoration-ink-950">
              {{ t('hero.ctaSecondary') }}
            </span>
          </RouterLink>
        </div>

        <dl ref="statsRef" class="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          <div v-for="stat in content.stats" :key="stat.key">
            <dt class="sr-only">{{ t(`hero.stats.${stat.key}`) }}</dt>
            <dd class="font-display text-3xl font-bold text-ink-950">
              <AnimatedCounter :target="stat.value" :suffix="stat.suffix" />
            </dd>
            <p class="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{{ t(`hero.stats.${stat.key}`) }}</p>
          </div>
        </dl>
      </div>

      <div ref="artRef" class="relative">
        <div class="relative mx-auto max-w-2xl" :style="parallaxStyle">
          <picture>
            <source :srcset="heroIllustrationWebp" type="image/webp" />
            <img :src="heroIllustration" alt="Nexora Company digital marketing and analytics illustration" width="1000" height="800" class="w-full drop-shadow-2xl " />
          </picture>
        </div>
      </div>
    </div>

    <a href="#trusted" class="mx-auto mt-16 hidden w-fit flex-col items-center gap-2 text-xs font-medium text-ink-400 sm:flex" aria-hidden="true">
      {{ t('hero.scroll') }}
      <ChevronDown class="h-4 w-4 animate-bounce" />
    </a>
  </section>
</template>
