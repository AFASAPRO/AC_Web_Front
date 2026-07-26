import { onMounted, onBeforeUnmount, ref } from 'vue'

export function useMouseParallax(strength = 20) {
  const style = ref({ transform: 'translate(0px, 0px)' })
  let raf = null
  let target = { x: 0, y: 0 }
  let current = { x: 0, y: 0 }

  const handleMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * strength
    const y = (e.clientY / window.innerHeight - 0.5) * strength
    target = { x, y }
  }

  const loop = () => {
    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08
    style.value = { transform: `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px)` }
    raf = requestAnimationFrame(loop)
  }

  onMounted(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isFinePointer && !reduced) {
      window.addEventListener('mousemove', handleMove)
      raf = requestAnimationFrame(loop)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMove)
    if (raf) cancelAnimationFrame(raf)
  })

  return { style }
}
