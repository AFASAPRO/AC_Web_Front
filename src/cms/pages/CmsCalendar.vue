<script setup>
import { ref } from 'vue'

const currentMonth = ref('July 2026')
const days = ref([
  { date: 1, type: 'task', title: 'Design Figma Spec' },
  { date: 5, type: 'meeting', title: 'Client Kickoff Call' },
  { date: 12, type: 'deadline', title: 'Milestone #1 Submission' },
  { date: 18, type: 'meeting', title: 'Sprint Retrospective' },
  { date: 25, type: 'deadline', title: 'Staging Release' },
])

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)

function getEvents(day) {
  return days.value.filter(d => d.date === day)
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Unified Calendar</h2>
        <p class="cms-page__sub">Tasks, meetings, deadlines, and company holidays</p>
      </div>
      <div class="month-selector">
        <button class="cms-btn cms-btn--secondary">◀</button>
        <span class="font-bold text-lg px-3">{{ currentMonth }}</span>
        <button class="cms-btn cms-btn--secondary">▶</button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-card">
      <div class="calendar-weekdays">
        <div v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d" class="weekday">{{ d }}</div>
      </div>

      <div class="calendar-days">
        <div v-for="day in calendarDays" :key="day" class="day-cell">
          <span class="day-num">{{ day }}</span>
          <div class="event-list">
            <div v-for="e in getEvents(day)" :key="e.title" class="event-tag" :class="`event--${e.type}`">
              {{ e.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1200px; margin: 0 auto; }
.cms-page__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }
.month-selector { display: flex; align-items: center; }

.calendar-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; overflow: hidden; }
.calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); background: #f8f9fa; border-bottom: 1px solid #e5e7eb; text-align: center; }
.weekday { padding: 0.75rem; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; }

.calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); }
.day-cell { min-height: 100px; border-right: 1px solid #f0f1f3; border-bottom: 1px solid #f0f1f3; padding: 0.5rem; display: flex; flex-direction: column; }
.day-num { font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.375rem; }

.event-list { display: flex; flex-direction: column; gap: 0.25rem; }
.event-tag { font-size: 0.6875rem; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
.event--task { background: #eff6ff; color: #1d4ed8; }
.event--meeting { background: #fef3c7; color: #92400e; }
.event--deadline { background: #fee2e2; color: #991b1b; }

.cms-btn { padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-weight: 600; cursor: pointer; border: none; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
</style>
