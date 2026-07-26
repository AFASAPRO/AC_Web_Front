<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Languages, Check } from 'lucide-vue-next'

const { locale } = useI18n()
const open = ref(false)
const langs = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
]

const select = (code) => {
  locale.value = code
  localStorage.setItem('ac-locale', code)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-inherit transition hover:bg-black/5"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Languages class="h-4 w-4" />
      <span class="uppercase">{{ locale }}</span>
    </button>
    <Transition name="dropdown">
      <ul
        v-if="open"
        class="glass absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-2xl py-2 shadow-xl shadow-black/10"
        role="listbox"
      >
        <li v-for="l in langs" :key="l.code">
          <button
            class="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-ink-800 hover:bg-ink-100"
            role="option"
            :aria-selected="locale === l.code"
            @click="select(l.code)"
          >
            {{ l.label }}
            <Check v-if="locale === l.code" class="h-3.5 w-3.5 text-accent-500" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
