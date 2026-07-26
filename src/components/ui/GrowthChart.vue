<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale,
  Filler, Tooltip,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  label: { type: String, default: 'Projects Delivered' },
  color: { type: String, default: '#2563eb' },
})

const canvasEl = ref(null)
const wrapperEl = ref(null)
let chart = null
let observer = null

const buildChart = () => {
  if (!canvasEl.value || chart) return
  const ctx = canvasEl.value.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 260)
  gradient.addColorStop(0, `${props.color}33`)
  gradient.addColorStop(1, `${props.color}00`)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.label,
          data: props.data,
          borderColor: props.color,
          backgroundColor: gradient,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: props.color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1400, easing: 'easeOutQuart' },
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0a0a0a',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 12, weight: '600' },
          padding: 10,
          cornerRadius: 10,
          displayColors: false,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8a8f98', font: { size: 11, family: 'Inter' } } },
        y: {
          grid: { color: '#f0f1f3' },
          ticks: { color: '#8a8f98', font: { size: 11, family: 'Inter' } },
          border: { display: false },
        },
      },
    },
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && buildChart()),
    { threshold: 0.3 }
  )
  if (wrapperEl.value) observer.observe(wrapperEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.destroy()
})

watch(
  () => props.data,
  (val) => {
    if (chart) {
      chart.data.datasets[0].data = val
      chart.update()
    }
  }
)
</script>

<template>
  <div ref="wrapperEl" class="relative h-64 w-full">
    <canvas ref="canvasEl" role="img" :aria-label="`${label} chart`"></canvas>
  </div>
</template>
