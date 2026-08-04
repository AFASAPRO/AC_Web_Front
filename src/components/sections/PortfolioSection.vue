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
const filters = ['all', 'web', 'system', 'ai', 'cloud', 'mobile']
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
            {{ t(`portfolio.filters.${f}`) || f }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard v-for="n in 6" :key="n" aspect="aspect-[16/10]" :lines="2" />
      </div>

      <TransitionGroup
        v-else
        tag="div"
        name="grid-fade"
        class="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="project in filtered"
          :key="project.id"
          class="group flex flex-col overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-ink-300 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900"
        >
          <!-- Browser Frame Header -->
          <div class="flex items-center justify-between border-b border-ink-100 bg-ink-50/80 px-4 py-2.5 dark:border-ink-800 dark:bg-ink-950/80">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span class="text-[10px] font-mono font-medium uppercase tracking-wider text-ink-400 dark:text-ink-400">
              {{ t(`portfolio.filters.${project.category}`) || project.category }}
            </span>
          </div>

          <!-- Image Preview -->
          <div class="relative overflow-hidden bg-ink-950 aspect-[16/10] cursor-pointer" @click="showProject(project)">
            <LazyImage
              :src="project.img"
              :alt="project.title"
              aspect="aspect-[16/10]"
              img-class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-ink-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
              <span class="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-ink-950 shadow-lg backdrop-blur">
                Quick View <ArrowUpRight class="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          <!-- Card Info -->
          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-accent-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                  {{ t(`portfolio.filters.${project.category}`) || project.category }}
                </span>
                <span v-for="tag in project.tags" :key="tag" class="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                  {{ tag }}
                </span>
              </div>
              <h3 class="font-display mt-3.5 text-xl font-bold text-ink-950 transition-colors group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400 line-clamp-2">
                {{ t('portfolio.projectSummary') }}
              </p>
            </div>

            <div class="mt-6 flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
              <BaseButton
                tag="router-link"
                :to="`/portfolio/${project.slug}`"
                variant="outline"
                size="sm"
                class="w-full justify-between"
              >
                <span>{{ t('portfolio.viewCase') }}</span>
                <ExternalLink class="h-3.5 w-3.5" />
              </BaseButton>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <BaseModal v-model="open">
      <div v-if="activeProject">
        <div class="overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800 shadow-md">
          <div class="flex items-center justify-between border-b border-ink-100 bg-ink-50/80 px-4 py-2 dark:border-ink-800 dark:bg-ink-950/80">
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-rose-400"></span>
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <LazyImage :src="activeProject.img" :alt="activeProject.title" aspect="aspect-[16/10]" img-class="h-full w-full object-cover object-top" />
        </div>
        <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-600">{{ t(`portfolio.filters.${activeProject.category}`) || activeProject.category }}</p>
        <h3 class="font-display mt-1 text-2xl font-bold text-ink-950 dark:text-white">{{ activeProject.title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          A closer look at how our team approached discovery, design and engineering to deliver measurable results for this project.
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in activeProject.tags" :key="tag" class="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">{{ tag }}</span>
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
