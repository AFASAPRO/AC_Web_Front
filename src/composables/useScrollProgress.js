import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrollProgress() {
  const progress = ref(0)
  const scrolled = ref(false)

  const update = () => {
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    progress.value = total > 0 ? Math.min(100, (doc.scrollTop / total) * 100) : 0
    scrolled.value = doc.scrollTop > 24
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return { progress, scrolled }
}
