import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: true,
    isMobileMenuOpen: false,
    activeSection: 'home',
    toasts: [],
  }),
  actions: {
    finishLoading() {
      this.isLoading = false
    },
    toggleMobileMenu(force) {
      this.isMobileMenuOpen = force ?? !this.isMobileMenuOpen
    },
    setActiveSection(id) {
      this.activeSection = id
    },
    pushToast({ type = 'success', message }) {
      const id = Date.now() + Math.random()
      this.toasts.push({ id, type, message })
      setTimeout(() => this.dismissToast(id), 4200)
    },
    dismissToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
  },
})
