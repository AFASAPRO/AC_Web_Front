<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, X, ChevronDown } from 'lucide-vue-next'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useUiStore } from '@/stores/ui'
import { NAV_LINKS } from '@/constants/site'
import TopBar from './TopBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LogoMark from '@/components/ui/LogoMark.vue'

const { t } = useI18n()
const { scrolled } = useScrollProgress()
const ui = useUiStore()
const servicesOpen = ref(false)

const close = () => ui.toggleMobileMenu(false)
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <!-- Top info bar: collapses out of view once the page scrolls -->
    <div
      class="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out"
      :style="{ gridTemplateRows: scrolled ? '0fr' : '1fr' }"
    >
      <div class="overflow-hidden">
        <TopBar />
      </div>
    </div>

    <!-- Main nav row: always has a visible surface so the logo/links stay readable -->
    <div class="relative border-b transition-all duration-500" :class="scrolled ? 'border-ink-100 bg-white/95 shadow-sm shadow-black/5 backdrop-blur-xl' : 'border-white/40 bg-white/80 backdrop-blur-md'">
      <nav class="container-px mx-auto flex max-w-7xl items-center justify-between py-3 sm:py-4" aria-label="Primary">
        <RouterLink to="/" class="flex shrink-0 items-center gap-2" @click="close">
          <LogoMark img-class="h-12 w-auto sm:h-14" class="transform" style="transform: scale(1.75);" />
        </RouterLink>

        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="link in NAV_LINKS" :key="link.key" class="relative">
            <div v-if="link.key === 'services'" class="group" @mouseenter="servicesOpen = true" @mouseleave="servicesOpen = false">
              <RouterLink
                :to="link.to"
                class="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-black/5"
              >
                {{ t(`nav.${link.key}`) }}
                <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="servicesOpen ? 'rotate-180' : ''" />
              </RouterLink>
              <Transition name="dropdown">
                <div v-if="servicesOpen" class="glass absolute left-1/2 top-full mt-1 w-72 -translate-x-1/2 rounded-2xl p-3 shadow-xl shadow-black/10">
                  <RouterLink to="/services" class="block rounded-xl px-4 py-2.5 text-sm text-ink-800 hover:bg-ink-100">Web &amp; Mobile Development</RouterLink>
                  <RouterLink to="/services" class="block rounded-xl px-4 py-2.5 text-sm text-ink-800 hover:bg-ink-100">AI &amp; Cloud Solutions</RouterLink>
                  <RouterLink to="/services" class="block rounded-xl px-4 py-2.5 text-sm text-ink-800 hover:bg-ink-100">Design &amp; Consulting</RouterLink>
                </div>
              </Transition>
            </div>
            <RouterLink v-else :to="link.to" class="rounded-full px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-black/5">
              {{ t(`nav.${link.key}`) }}
            </RouterLink>
          </li>
        </ul>

        <div class="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <BaseButton tag="router-link" to="/contact" size="sm">{{ t('nav.getStarted') }}</BaseButton>
        </div>

        <button
          class="grid h-10 w-10 place-items-center rounded-full text-ink-950 lg:hidden"
          :aria-expanded="ui.isMobileMenuOpen"
          aria-label="Toggle navigation menu"
          @click="ui.toggleMobileMenu()"
        >
          <Menu v-if="!ui.isMobileMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </nav>

      <Transition name="mobile-menu">
        <div v-if="ui.isMobileMenuOpen" class="glass container-px mx-auto mb-3 max-w-7xl rounded-3xl p-4 shadow-xl shadow-black/10 lg:hidden">
          <ul class="flex flex-col divide-y divide-ink-100">
            <li v-for="link in NAV_LINKS" :key="link.key">
              <RouterLink :to="link.to" class="block py-3 text-base font-medium text-ink-800" @click="close">
                {{ t(`nav.${link.key}`) }}
              </RouterLink>
            </li>
          </ul>
          <div class="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <BaseButton tag="router-link" to="/contact" size="sm" block @click="close">{{ t('nav.getStarted') }}</BaseButton>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translate(-50%, -8px); }
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
