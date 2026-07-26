<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCounter } from '@/composables/useCounter'

const props = defineProps({
  target: { type: Number, required: true },
  suffix: { type: String, default: '' },
  duration: { type: Number, default: 1800 },
})

const { value, start } = useCounter(props.target, props.duration)
const el = ref(null)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && start()),
    { threshold: 0.4 }
  )
  if (el.value) observer.observe(el.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <span ref="el" class="tabular-nums">{{ value.toLocaleString() }}{{ suffix }}</span>
</template>
