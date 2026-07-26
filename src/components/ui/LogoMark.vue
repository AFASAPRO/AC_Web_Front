<script setup>
import logoWebp from '@/assets/images/logo.webp'
import logoPng from '@/assets/images/logo.png'

defineProps({
  imgClass: { type: String, default: 'h-12 w-auto sm:h-14' },
  invert: { type: Boolean, default: false },
})
</script>

<template>
  <picture>
    <source :srcset="logoWebp" type="image/webp" />
    <img :src="logoPng" alt="AC Company logo" width="220" height="120" :class="[imgClass, invert ? 'brightness-0 invert' : '']" />
  </picture>
</template>
