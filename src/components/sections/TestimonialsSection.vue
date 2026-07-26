<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { useContentStore } from '@/stores/content'

const { t } = useI18n()
const content = useContentStore()
const index = ref(0)
let timer = null

const next = () => (index.value = (index.value + 1) % content.testimonials.length)
const prev = () => (index.value = (index.value - 1 + content.testimonials.length) % content.testimonials.length)

const startAuto = () => {
  timer = setInterval(next, 5500)
}
onMounted(startAuto)
onBeforeUnmount(() => clearInterval(timer))

const pause = () => clearInterval(timer)
const resume = () => startAuto()
</script>

<template>
  <section id="testimonials" class="relative overflow-hidden py-24 sm:py-32">
    <div class="pointer-events-none absolute left-1/2 top-0 h-96 w-[70%] -translate-x-1/2 rounded-full bg-accent-500/5 blur-[130px]" aria-hidden="true"></div>

    <div class="container-px relative mx-auto max-w-4xl">
      <SectionTitle :eyebrow="t('testimonials.eyebrow')" :title="t('testimonials.title')" align="center" />

      <div class="reveal relative mt-14" @mouseenter="pause" @mouseleave="resume">
        <Quote class="mx-auto h-10 w-10 text-accent-500/25" />

        <Transition name="fade-slide" mode="out-in">
          <div :key="index" class="mt-6 text-center">
            <p class="font-display text-xl font-medium leading-relaxed text-ink-950 sm:text-2xl">
              &ldquo;{{ content.testimonials[index].quote }}&rdquo;
            </p>
            <div class="mt-6 flex items-center justify-center gap-1">
              <Star v-for="s in content.testimonials[index].rating" :key="s" class="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
            <div class="mt-5 flex items-center justify-center gap-3">
              <img :src="content.testimonials[index].avatar" :alt="content.testimonials[index].name" class="h-11 w-11 rounded-full object-cover" loading="lazy" />
              <div class="text-left">
                <p class="font-display text-sm font-bold text-ink-950">{{ content.testimonials[index].name }}</p>
                <p class="text-xs text-ink-500">{{ content.testimonials[index].role }}</p>
              </div>
            </div>
          </div>
        </Transition>

        <div class="mt-10 flex items-center justify-center gap-3">
          <button aria-label="Previous testimonial" class="grid h-10 w-10 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-950 hover:text-ink-950" @click="prev">
            <ChevronLeft class="h-4 w-4" />
          </button>
          <div class="flex items-center gap-2">
            <button
              v-for="(t2, i) in content.testimonials"
              :key="i"
              :aria-label="`Go to testimonial ${i + 1}`"
              class="h-1.5 rounded-full transition-all"
              :class="i === index ? 'w-6 bg-ink-950' : 'w-1.5 bg-ink-200'"
              @click="index = i"
            ></button>
          </div>
          <button aria-label="Next testimonial" class="grid h-10 w-10 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-950 hover:text-ink-950" @click="next">
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
