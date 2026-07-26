import { watchEffect } from 'vue'

/**
 * Lightweight SEO meta manager. Updates document title, meta description,
 * canonical link and Open Graph tags reactively.
 */
export function useSeoMeta({ title, description, image, url }) {
  watchEffect(() => {
    if (title?.value) document.title = title.value

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return
      let el = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description?.value)
    setMeta('og:title', title?.value, 'property')
    setMeta('og:description', description?.value, 'property')
    setMeta('og:image', image?.value, 'property')
    setMeta('og:url', url?.value, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title?.value)
    setMeta('twitter:description', description?.value)

    if (url?.value) {
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', url.value)
    }
  })
}
