<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ShareButtons from '@/components/ui/ShareButtons.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { useContentStore } from '@/stores/content'
import { SITE } from '@/constants/site'

const { t } = useI18n()
const content = useContentStore()

const isLoading = ref(true)
onMounted(() => setTimeout(() => (isLoading.value = false), 500))

const activeFilter = ref('all')
const filters = ['all', 'web', 'mobile', 'ai', 'cloud']
const filtered = computed(() => content.portfolioByCategory(activeFilter.value))

const activeProject = ref(null)
const open = ref(false)
const showProject = (project) => {
  activeProject.value = project
  open.value = true
}
</script>

<template>
  <section id="portfolio" class="py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <div class="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionTitle :eyebrow="t('portfolio.eyebrow')" :title="t('portfolio.title')" :subtitle="t('portfolio.subtitle')" />
        <div class="reveal flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f"
            class="rounded-full border px-4 py-2 text-sm font-medium transition-all"
            :class="activeFilter === f ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-950'"
            @click="activeFilter = f"
          >
            {{ t(`portfolio.filters.${f}`) }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard v-for="n in 6" :key="n" aspect="aspect-[4/5]" :lines="1" />
      </div>

      <TransitionGroup
        v-else
        tag="div"
        name="grid-fade"
        class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <button
          v-for="project in filtered"
          :key="project.id"
          class="group relative overflow-hidden rounded-3xl text-left ring-1 ring-ink-100 transition-shadow duration-500 hover:shadow-[0_32px_64px_-24px_rgba(10,10,10,0.25)]"
          @click="showProject(project)"
        >
          <LazyImage :src="project.img" :alt="project.title" aspect="aspect-[4/5]" img-class="transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent"></div>

          <span class="absolute right-4 top-4 grid h-10 w-10 -translate-y-2 place-items-center rounded-full bg-white text-ink-950 opacity-0 shadow-lg transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight class="h-4 w-4" />
          </span>

          <div class="absolute inset-x-0 bottom-0 p-6">
            <p class="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {{ t(`portfolio.filters.${project.category}`) }}
            </p>
            <h3 class="font-display mt-2.5 text-lg font-bold text-white">{{ project.title }}</h3>
            <div class="mt-2 flex flex-wrap gap-1.5 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
              <span v-for="tag in project.tags.slice(0, 2)" :key="tag" class="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-medium text-white/70">
                {{ tag }}
              </span>
            </div>
          </div>
        </button>
      </TransitionGroup>
    </div>

    <BaseModal v-model="open">
      <div v-if="activeProject">
        <LazyImage :src="activeProject.img" :alt="activeProject.title" aspect="aspect-[16/9]" img-class="rounded-2xl" />
        <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-600">{{ t(`portfolio.filters.${activeProject.category}`) }}</p>
        <h3 class="font-display mt-1 text-2xl font-bold text-ink-950">{{ activeProject.title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-ink-500">
          A closer look at how our team approached discovery, design and engineering to deliver measurable results for this project.
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in activeProject.tags" :key="tag" class="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">{{ tag }}</span>
        </div>
        <div class="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-3">
            <BaseButton size="sm"><ExternalLink class="h-4 w-4" /> {{ t('portfolio.liveDemo') }}</BaseButton>
            <BaseButton size="sm" variant="outline"><Github class="h-4 w-4" /> {{ t('portfolio.sourceCode') }}</BaseButton>
          </div>
          <ShareButtons :url="`${SITE.url}/portfolio/${activeProject.slug}`" :title="activeProject.title" />
        </div>
      </div>
    </BaseModal>
  </section>
</template>

<style scoped>
.grid-fade-enter-active, .grid-fade-leave-active { transition: all 0.4s ease; }
.grid-fade-enter-from, .grid-fade-leave-to { opacity: 0; transform: scale(0.96); }
.grid-fade-move { transition: transform 0.4s ease; }
</style>
