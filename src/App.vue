<script setup>
import { watch, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { usePwaUpdate } from '@/composables/usePwaUpdate'

import LoadingScreen from '@/components/ui/LoadingScreen.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ScrollProgressBar from '@/components/layout/ScrollProgressBar.vue'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import WhatsAppButton from '@/components/layout/WhatsAppButton.vue'
import ScrollToTopButton from '@/components/layout/ScrollToTopButton.vue'
import AiChatWidget from '@/components/layout/AiChatWidget.vue'
import CookieConsentBanner from '@/components/layout/CookieConsentBanner.vue'

const { locale } = useI18n()
const route = useRoute()
useScrollReveal()
usePwaUpdate()

// Detect if we're on a CMS route — hide public-site chrome
const isCmsRoute = computed(() => route.path.startsWith('/cms'))

watch(
  locale,
  (val) => {
    document.documentElement.setAttribute('lang', val)
  },
  { immediate: true }
)
</script>

<template>
  <div id="app-root" class="relative min-h-screen bg-white">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
      Skip to main content
    </a>

    <!-- Public website chrome — hidden on CMS routes -->
    <template v-if="!isCmsRoute">
      <LoadingScreen />
      <ScrollProgressBar />
      <TheNavbar />
    </template>

    <div id="main-content">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </Transition>
      </RouterView>
    </div>

    <!-- Public website chrome — hidden on CMS routes -->
    <template v-if="!isCmsRoute">
      <TheFooter />
      <WhatsAppButton />
      <ScrollToTopButton />
      <AiChatWidget />
      <ToastContainer />
      <CookieConsentBanner />
    </template>
  </div>
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.35s ease; }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
