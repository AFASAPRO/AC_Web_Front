import { ref } from 'vue'

/**
 * Animates a numeric value from 0 to target over `duration` ms using
 * an eased requestAnimationFrame loop. Call `start()` when the element
 * becomes visible (e.g. via v-intersect or useScrollReveal callback).
 */
export function useCounter(target, duration = 1800) {
  const value = ref(0)
  let started = false

  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

  const start = () => {
    if (started) return
    started = true
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      value.value = Math.round(easeOutExpo(progress) * target)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return { value, start }
}
