<script setup>
import { Phone, MapPin, Mail, Twitter, Facebook, Linkedin, Instagram } from 'lucide-vue-next'
import { SITE, SOCIAL_LINKS } from '@/constants/site'

const icons = { Twitter, Facebook, LinkedIn: Linkedin, Instagram }
</script>

<template>
  <div class="w-full border-b border-white/10 bg-ink-950 text-white">
    <div class="container-px mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 py-2 text-xs">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <a :href="`tel:${SITE.phone}`" class="flex items-center gap-1.5 text-white/70 transition hover:text-white">
          <Phone class="h-3.5 w-3.5" /> {{ SITE.phone }}
        </a>
        <span class="hidden items-center gap-1.5 text-white/70 sm:flex">
          <MapPin class="h-3.5 w-3.5" /> {{ SITE.address.split(',').slice(-2).join(',').trim() }}
        </span>
        <a :href="`mailto:${SITE.email}`" class="hidden items-center gap-1.5 text-white/70 transition hover:text-white md:flex">
          <Mail class="h-3.5 w-3.5" /> {{ SITE.email }}
        </a>
      </div>

      <div class="flex items-center gap-3">
        <a
          v-for="s in SOCIAL_LINKS"
          :key="s.name"
          :href="s.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="s.name"
          class="text-white/60 transition hover:text-accent-400"
        >
          <component :is="icons[s.name]" class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </div>
</template>
