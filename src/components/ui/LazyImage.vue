<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  aspect: { type: String, default: 'aspect-[4/3]' },
  imgClass: { type: String, default: '' },
  sizes: { type: String, default: '(min-width: 1024px) 400px, 90vw' },
})
const loaded = ref(false)

// Unsplash serves resized variants via the `w` query param — build a real
// srcset for those so the browser only downloads what it needs.
const isUnsplash = props.src.includes('images.unsplash.com')

const withWidth = (url, width) => {
  try {
    const u = new URL(url)
    u.searchParams.set('w', width)
    u.searchParams.set('q', '75')
    return u.toString()
  } catch {
    return url
  }
}

const srcset = computed(() => {
  if (!isUnsplash) return undefined
  return [320, 640, 900, 1200, 1600].map((w) => `${withWidth(props.src, w)} ${w}w`).join(', ')
})

const optimizedSrc = computed(() => (isUnsplash ? withWidth(props.src, 900) : props.src))
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl" :class="aspect">
    <div v-if="!loaded" class="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-100 via-ink-50 to-ink-100"></div>
    <img
      :src="optimizedSrc"
      :srcset="srcset"
      :sizes="isUnsplash ? sizes : undefined"
      :alt="alt"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-cover transition-opacity duration-700"
      :class="[imgClass, loaded ? 'opacity-100' : 'opacity-0']"
      @load="loaded = true"
    />
  </div>
</template>
