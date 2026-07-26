import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Batches `.reveal` elements and animates them up+in as they cross the viewport.
 * Falls back to an instant, static reveal when the user prefers reduced motion.
 */
export function initScrollReveals(root = document) {
  const targets = root.querySelectorAll('.reveal:not([data-gsap-bound])')
  if (!targets.length) return

  targets.forEach((el) => el.setAttribute('data-gsap-bound', 'true'))

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }

  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
      }),
  })

  gsap.set(targets, { opacity: 0, y: 32 })
  // Re-check in case some targets are already in view on mount
  ScrollTrigger.refresh()
}

/**
 * Orchestrated hero entrance timeline. Elements are queried by ref/selector
 * and animated in sequence: eyebrow -> heading -> copy -> CTAs -> stats -> art.
 */
export function playHeroTimeline({ eyebrow, heading, copy, ctas, stats, art, cards }) {
  if (prefersReducedMotion()) {
    gsap.set([eyebrow, heading, copy, ctas, stats, art, ...(cards || [])].filter(Boolean), { opacity: 1, y: 0, scale: 1 })
    return null
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
  if (heading) {
    tl.fromTo(
      heading,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.85 },
      '-=0.3'
    )
  }
  if (copy) tl.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
  if (ctas) tl.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  if (stats) tl.fromTo(stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
  if (art) tl.fromTo(art, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, '-=0.9')
  if (cards && cards.length) {
    tl.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.18 },
      '-=0.5'
    )
  }

  return tl
}

/**
 * Lightweight click ripple: expands a circle from the pointer position and fades out.
 */
export function spawnRipple(event, el, color = 'rgba(255,255,255,0.45)') {
  if (prefersReducedMotion()) return
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.2
  const ripple = document.createElement('span')
  ripple.style.position = 'absolute'
  ripple.style.borderRadius = '9999px'
  ripple.style.pointerEvents = 'none'
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${(event.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`
  ripple.style.top = `${(event.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`
  ripple.style.background = color
  ripple.style.opacity = '0.55'
  el.appendChild(ripple)

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.55 },
    {
      scale: 1,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    }
  )
}

export { gsap, ScrollTrigger }
