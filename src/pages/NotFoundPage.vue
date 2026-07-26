<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <p class="font-display text-8xl font-bold text-ink-950">404</p>
    <h1 class="font-display mt-4 text-2xl font-bold text-ink-950">Page not found</h1>
    <p class="mt-2 max-w-sm text-sm text-ink-500">The page you're looking for doesn't exist or has been moved.</p>
    <RouterLink to="/" class="mt-8 inline-flex items-center justify-center rounded-full bg-ink-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
      Back to Home
    </RouterLink>
  </main>
</template>
