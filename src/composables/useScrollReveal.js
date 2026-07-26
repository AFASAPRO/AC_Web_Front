import { onMounted, onBeforeUnmount } from 'vue'
import { initScrollReveals, ScrollTrigger } from '@/animations/gsap'

/**
 * Wires every `.reveal` element (including ones mounted later via router
 * navigation or async content) into a GSAP ScrollTrigger batch animation.
 */
export function useScrollReveal() {
  let mo
  let debounceId

  const scan = () => initScrollReveals(document)

  onMounted(() => {
    scan()
    mo = new MutationObserver(() => {
      clearTimeout(debounceId)
      debounceId = setTimeout(scan, 60)
    })
    mo.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    mo?.disconnect()
    clearTimeout(debounceId)
  })

  return { scan }
}
