<script setup>
import { useI18n } from 'vue-i18n'
import { MessageCircleQuestion, ArrowRight, Mail } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AccordionFaq from '@/components/ui/AccordionFaq.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useContentStore } from '@/stores/content'
import { SITE } from '@/constants/site'

const { t, tm } = useI18n()
const content = useContentStore()
</script>

<template>
  <section id="faq" class="bg-ink-50/60 py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionTitle :eyebrow="t('faq.eyebrow')" :title="t('faq.title')" />
          <p class="reveal mt-5 max-w-sm text-sm leading-relaxed text-ink-500">
            Can't find the answer you're looking for? Our team is one message away and typically replies within a business day.
          </p>

          <div class="reveal relative mt-8 overflow-hidden rounded-3xl bg-ink-950 p-7 text-white sm:p-8">
            <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-[70px]"></div>
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
              <MessageCircleQuestion class="h-5 w-5 text-accent-400" />
            </span>
            <h3 class="font-display mt-5 text-lg font-bold">Still have questions?</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/55">Reach out directly and we'll get back to you personally.</p>
            <div class="mt-6 flex flex-col gap-3">
              <BaseButton tag="router-link" to="/contact" variant="white" size="sm" class="justify-start">
                Contact us <ArrowRight class="h-3.5 w-3.5" />
              </BaseButton>
              <a :href="`mailto:${SITE.email}`" class="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white">
                <Mail class="h-3.5 w-3.5" /> {{ SITE.email }}
              </a>
            </div>
          </div>
        </div>

        <AccordionFaq v-model="content.faqOpenIndex" :items="tm('faq.items')" />
      </div>
    </div>
  </section>
</template>
