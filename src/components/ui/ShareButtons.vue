<script setup>
import { ref } from 'vue'
import { Twitter, Facebook, Linkedin, Link2, Share2, Check } from 'lucide-vue-next'

const props = defineProps({
  url: { type: String, required: true },
  title: { type: String, required: true },
})

const copied = ref(false)

const shareLinks = () => [
  { name: 'Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}` },
  { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}` },
  { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}` },
]

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard unavailable — silently ignore */
  }
}

const nativeShare = () => {
  if (navigator.share) {
    navigator.share({ title: props.title, url: props.url }).catch(() => {})
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Share</span>
    <a
      v-for="link in shareLinks()"
      :key="link.name"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Share on ${link.name}`"
      class="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-950 hover:text-ink-950"
    >
      <component :is="link.icon" class="h-4 w-4" />
    </a>
    <button
      aria-label="Copy link"
      class="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-950 hover:text-ink-950"
      @click="copyLink"
    >
      <Check v-if="copied" class="h-4 w-4 text-emerald-500" />
      <Link2 v-else class="h-4 w-4" />
    </button>
    <button
      v-if="typeof navigator !== 'undefined' && navigator.share"
      aria-label="Share"
      class="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-950 hover:text-ink-950 sm:hidden"
      @click="nativeShare"
    >
      <Share2 class="h-4 w-4" />
    </button>
  </div>
</template>
