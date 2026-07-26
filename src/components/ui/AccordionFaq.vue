<script setup>
import { Plus } from 'lucide-vue-next'

defineProps({ items: { type: Array, required: true } })
const openIndex = defineModel({ type: Number, default: 0 })

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="reveal overflow-hidden rounded-2xl border transition-colors duration-300"
      :class="openIndex === i ? 'border-ink-950 bg-white shadow-[0_20px_44px_-24px_rgba(10,10,10,0.18)]' : 'border-ink-100 bg-white'"
    >
      <button
        class="flex w-full items-center gap-4 px-6 py-5 text-left"
        :aria-expanded="openIndex === i"
        :aria-controls="`faq-panel-${i}`"
        @click="toggle(i)"
      >
        <span
          class="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300"
          :class="openIndex === i ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-500'"
        >
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <span class="font-display flex-1 text-base font-semibold text-ink-950 sm:text-lg">{{ item.q }}</span>
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300"
          :class="openIndex === i ? 'rotate-45 border-ink-950 bg-ink-950 text-white' : 'border-ink-200 text-ink-500'"
        >
          <Plus class="h-4 w-4" />
        </span>
      </button>
      <div
        :id="`faq-panel-${i}`"
        class="grid transition-all duration-300 ease-out"
        :style="{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }"
      >
        <div class="overflow-hidden">
          <p class="px-6 pb-6 pl-[4.25rem] text-sm leading-relaxed text-ink-500 sm:text-base">{{ item.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
