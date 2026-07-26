<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const panelRef = ref(null)
const closeBtnRef = ref(null)
let lastFocused = null

const close = () => emit('update:modelValue', false)

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

const trapFocus = (e) => {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key !== 'Tab' || !panelRef.value) return

  const focusables = Array.from(panelRef.value.querySelectorAll(focusableSelector)).filter(
    (el) => el.offsetParent !== null
  )
  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      lastFocused = document.activeElement
      await nextTick()
      closeBtnRef.value?.focus()
    } else {
      lastFocused?.focus?.()
    }
  }
)
onBeforeUnmount(() => (document.body.style.overflow = ''))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown="trapFocus"
      >
        <div class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" @click="close"></div>
        <div ref="panelRef" class="glass relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8">
          <button
            ref="closeBtnRef"
            class="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-white transition hover:scale-110"
            aria-label="Close dialog"
            @click="close"
          >
            <X class="h-4 w-4" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .glass, .modal-leave-active .glass { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease; }
.modal-enter-from .glass, .modal-leave-to .glass { transform: scale(0.94) translateY(16px); opacity: 0; }
</style>
