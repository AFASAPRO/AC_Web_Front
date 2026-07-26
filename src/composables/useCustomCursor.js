import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useCustomCursor() {
  const pos = ref({ x: -100, y: -100 })
  const isHovering = ref(false)
  const isEnabled = ref(false)

  const move = (e) => {
    pos.value = { x: e.clientX, y: e.clientY }
  }
  const onOver = (e) => {
    isHovering.value = !!e.target.closest('a, button, [data-cursor-hover]')
  }

  onMounted(() => {
    isEnabled.value =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isEnabled.value) {
      window.addEventListener('mousemove', move, { passive: true })
      window.addEventListener('mouseover', onOver, { passive: true })
    }
  })
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseover', onOver)
  })

  return { pos, isHovering, isEnabled }
}
