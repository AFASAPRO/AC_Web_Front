<script setup>
const milestones = [
  { year: '2017', title: 'AC Company founded', desc: 'Started as a two-person freelance studio building websites for local businesses.' },
  { year: '2019', title: 'First enterprise client', desc: 'Delivered our first large-scale platform, growing the team to 8 engineers.' },
  { year: '2021', title: 'Regional expansion', desc: 'Opened operations across East Africa, serving clients in 6 new countries.' },
  { year: '2023', title: 'AI practice launched', desc: 'Built a dedicated applied-AI team to ship intelligent product features.' },
  { year: '2026', title: '240+ projects shipped', desc: 'Now a full-stack digital engineering studio trusted by 120+ clients worldwide.' },
]
</script>

<template>
  <div class="relative">
    <div class="absolute bottom-0 left-[15px] top-0 w-px bg-ink-200 sm:left-1/2" aria-hidden="true"></div>
    <ol class="space-y-10">
      <li
        v-for="(m, i) in milestones"
        :key="m.year"
        class="reveal relative flex flex-col gap-2 pl-10 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0"
        :class="i % 2 === 0 ? '' : 'sm:[&>*:first-child]:order-2'"
      >
        <span
          class="absolute left-0 top-0.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-[10px] font-bold text-white ring-4 ring-white sm:left-1/2 sm:-translate-x-1/2"
        >
          {{ m.year.slice(2) }}
        </span>

        <div :class="i % 2 === 0 ? 'sm:pr-14 sm:text-right' : 'sm:col-start-2 sm:pl-14'">
          <p class="font-display text-sm font-bold text-accent-600">{{ m.year }}</p>
          <h4 class="font-display mt-1 text-lg font-bold text-ink-950">{{ m.title }}</h4>
          <p class="mt-1.5 text-sm leading-relaxed text-ink-500">{{ m.desc }}</p>
        </div>
        <div v-if="i % 2 === 0" class="hidden sm:block" aria-hidden="true"></div>
      </li>
    </ol>
  </div>
</template>
