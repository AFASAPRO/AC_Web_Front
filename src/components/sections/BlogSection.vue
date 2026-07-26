<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Calendar, Search } from 'lucide-vue-next'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { useContentStore } from '@/stores/content'
import { formatDate } from '@/utils/helpers'

const { t, locale } = useI18n()
const content = useContentStore()

const isLoading = ref(true)
onMounted(() => setTimeout(() => (isLoading.value = false), 450))

const query = ref('')
const activeCategory = ref('all')
const categories = computed(() => ['all', ...new Set(content.blog.map((p) => p.category))])

const filtered = computed(() =>
  content.blog.filter((post) => {
    const matchesCategory = activeCategory.value === 'all' || post.category === activeCategory.value
    const matchesQuery =
      !query.value.trim() ||
      post.title.toLowerCase().includes(query.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.value.toLowerCase())
    return matchesCategory && matchesQuery
  })
)
</script>

<template>
  <section id="blog" class="py-24 sm:py-32">
    <div class="container-px mx-auto max-w-7xl">
      <SectionTitle :eyebrow="t('blog.eyebrow')" :title="t('blog.title')" align="center" />

      <div class="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            class="rounded-full border px-4 py-1.5 text-xs font-medium transition-all sm:text-sm"
            :class="activeCategory === cat ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-950'"
            @click="activeCategory = cat"
          >
            {{ cat === 'all' ? t('portfolio.filters.all') : cat }}
          </button>
        </div>

        <div class="relative w-full max-w-xs">
          <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            v-model="query"
            type="search"
            :placeholder="t('blog.searchPlaceholder')"
            class="w-full rounded-full border border-ink-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent-500"
            :aria-label="t('blog.searchPlaceholder')"
          />
        </div>
      </div>

      <div v-if="isLoading" class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SkeletonCard v-for="n in 3" :key="n" aspect="aspect-[16/10]" :lines="2" />
      </div>

      <TransitionGroup
        v-else-if="filtered.length"
        tag="div"
        name="grid-fade"
        class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <router-link
          v-for="post in filtered"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="reveal group block overflow-hidden rounded-3xl border border-ink-100"
        >
          <div class="relative">
            <LazyImage :src="post.img" :alt="post.title" aspect="aspect-[16/10]" img-class="transition-transform duration-700 group-hover:scale-110" />
            <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-800 backdrop-blur">
              {{ post.category }}
            </span>
          </div>
          <div class="p-6">
            <p class="flex items-center gap-1.5 text-xs text-ink-400">
              <Calendar class="h-3.5 w-3.5" /> {{ formatDate(post.date, locale) }}
            </p>
            <h3 class="font-display mt-2 text-lg font-bold leading-snug text-ink-950 transition-colors group-hover:text-accent-600">
              {{ post.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{{ post.excerpt }}</p>
            <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-950">
              {{ t('blog.readMore') }} <ArrowRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </router-link>
      </TransitionGroup>

      <p v-else-if="!isLoading" class="mt-16 text-center text-sm text-ink-400">No articles match your search. Try a different keyword or category.</p>
    </div>
  </section>
</template>

<style scoped>
.grid-fade-enter-active, .grid-fade-leave-active { transition: all 0.35s ease; }
.grid-fade-enter-from, .grid-fade-leave-to { opacity: 0; transform: scale(0.96); }
.grid-fade-move { transition: transform 0.35s ease; }
</style>
