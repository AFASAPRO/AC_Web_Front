<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Twitter, Facebook, Linkedin, Instagram, ArrowUpRight } from 'lucide-vue-next'
import { SITE, NAV_LINKS, SOCIAL_LINKS } from '@/constants/site'
import NewsletterForm from '@/components/sections/NewsletterForm.vue'
import LogoMark from '@/components/ui/LogoMark.vue'

const { t } = useI18n()
const year = new Date().getFullYear()
const icons = { Twitter, Facebook, LinkedIn: Linkedin, Instagram }
</script>

<template>
  <footer class="relative overflow-hidden bg-ink-950 text-white">
    <div class="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"></div>

    <div class="container-px relative mx-auto max-w-7xl py-16">
      <NewsletterForm class="mb-16" />

      <div class="grid grid-cols-1 gap-12 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <LogoMark img-class="h-16 w-auto sm:h-18" invert />
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{{ t('footer.about') }}</p>
          <div class="mt-5 flex gap-2">
            <a
              v-for="s in SOCIAL_LINKS"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="s.name"
              class="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-accent-500 hover:text-white"
            >
              <component :is="icons[s.name]" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-display text-sm font-semibold uppercase tracking-wide text-white/90">{{ t('footer.quickLinks') }}</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="link in NAV_LINKS" :key="link.key">
              <RouterLink :to="link.to" class="text-sm text-white/55 transition hover:text-white">{{ t(`nav.${link.key}`) }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-sm font-semibold uppercase tracking-wide text-white/90">{{ t('footer.services') }}</h3>
          <ul class="mt-4 space-y-3">
            <li><RouterLink to="/services" class="text-sm text-white/55 transition hover:text-white">Web &amp; Mobile Development</RouterLink></li>
            <li><RouterLink to="/services" class="text-sm text-white/55 transition hover:text-white">AI Solutions</RouterLink></li>
            <li><RouterLink to="/services" class="text-sm text-white/55 transition hover:text-white">Cloud &amp; DevOps</RouterLink></li>
            <li><RouterLink to="/services" class="text-sm text-white/55 transition hover:text-white">UI/UX Design</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-sm font-semibold uppercase tracking-wide text-white/90">{{ t('footer.contact') }}</h3>
          <ul class="mt-4 space-y-3 text-sm text-white/55">
            <li>{{ SITE.address }}</li>
            <li><a :href="`tel:${SITE.phone}`" class="hover:text-white">{{ SITE.phone }}</a></li>
            <li><a :href="`mailto:${SITE.email}`" class="hover:text-white">{{ SITE.email }}</a></li>
          </ul>
          <RouterLink to="/contact" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-400 hover:text-accent-300">
            Get in touch <ArrowUpRight class="h-3.5 w-3.5" />
          </RouterLink>
        </div>
      </div>

      <div class="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row">
        <p>&copy; {{ year }} {{ SITE.name }}. {{ t('footer.rights') }}</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white">{{ t('footer.privacy') }}</a>
          <a href="#" class="hover:text-white">{{ t('footer.terms') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
