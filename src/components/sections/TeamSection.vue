<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Linkedin, Twitter, Share2 } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useContentStore } from '@/stores/content'

const { t } = useI18n()
const content = useContentStore()

const isLoading = ref(true)
onMounted(() => setTimeout(() => (isLoading.value = false), 400))
</script>

<template>
  <section id="team" class="bg-ink-50/60 py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('team.eyebrow')" :title="t('team.title')" align="center" />

      <div class="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <template v-if="isLoading">
          <SkeletonBlock v-for="n in 4" :key="n" rounded="rounded-3xl" class="aspect-[3/4]" />
        </template>
        <template v-else>
        <div
          v-for="(member, i) in content.team"
          :key="member.name"
          class="reveal group relative overflow-hidden rounded-3xl"
          :style="{ transitionDelay: (i % 4) * 60 + 'ms' }"
        >
          <LazyImage :src="member.img" :alt="member.name" aspect="aspect-[3/4]" img-class="transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent"></div>

          <div class="absolute right-3 top-3 flex translate-y-2 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <a href="#" aria-label="LinkedIn profile" class="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-950 hover:bg-accent-500 hover:text-white"><Linkedin class="h-3.5 w-3.5" /></a>
            <a href="#" aria-label="Twitter profile" class="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-950 hover:bg-accent-500 hover:text-white"><Twitter class="h-3.5 w-3.5" /></a>
            <a href="#" aria-label="Share profile" class="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-950 hover:bg-accent-500 hover:text-white"><Share2 class="h-3.5 w-3.5" /></a>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-5">
            <p class="font-display text-base font-bold text-white">{{ member.name }}</p>
            <p class="text-xs font-medium text-accent-300">{{ member.role }}</p>
            <p class="mt-1 text-[11px] text-white/60">{{ member.experience }} &middot; {{ member.skills.join(', ') }}</p>
          </div>
        </div>
        </template>
      </div>
    </div>
  </section>
</template>
