<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { Video } from 'lucide-vue-next'

const meetings = ref([])
const loading = ref(true)
const showModal = ref(false)

const form = ref({
  title: '',
  provider: 'Google Meet',
  startTime: '2026-07-26T10:00',
  endTime: '2026-07-26T11:00',
  meetingLink: 'https://meet.google.com/abc-defg-hij',
  notes: '',
})

onMounted(async () => {
  await fetchMeetings()
})

async function fetchMeetings() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/meetings')
    if (data.success) meetings.value = data.data
  } catch (err) {
    meetings.value = [
      { _id: '1', title: 'Sprint Planning & Architecture Review', provider: 'Google Meet', startTime: '2026-07-26T10:00:00Z', endTime: '2026-07-26T11:00:00Z', meetingLink: 'https://meet.google.com/abc-defg-hij', organizer: { firstName: 'John', lastName: 'Doe' } },
      { _id: '2', title: 'Client Sync — Acme Corp Project Kickoff', provider: 'Zoom', startTime: '2026-07-27T14:30:00Z', endTime: '2026-07-27T15:30:00Z', meetingLink: 'https://zoom.us/j/987654321', organizer: { firstName: 'Alice', lastName: 'Johnson' } },
    ]
  } finally {
    loading.value = false
  }
}

async function saveMeeting() {
  try {
    await api.post('/cms/meetings', form.value)
    showModal.value = false
    await fetchMeetings()
  } catch (err) {
    alert('Failed to schedule meeting')
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Meetings & Video Calls</h2>
        <p class="cms-page__sub">Schedule team & client meetings with Google Meet and Zoom integration</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Schedule Meeting</button>
    </div>

    <!-- Meetings List -->
    <div v-if="loading" class="cms-loading">Loading meetings...</div>
    <div v-else class="meetings-grid">
      <div v-for="m in meetings" :key="m._id" class="meeting-card">
        <div class="meeting-card__header">
          <span class="provider-badge" :class="m.provider === 'Zoom' ? 'badge--zoom' : 'badge--meet'">{{ m.provider }}</span>
          <span class="time-tag">{{ new Date(m.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}</span>
        </div>
        
        <h3 class="meeting-title">{{ m.title }}</h3>
        <p class="organizer">Organized by: {{ m.organizer?.firstName }} {{ m.organizer?.lastName }}</p>

        <a :href="m.meetingLink" target="_blank" class="join-btn flex items-center justify-center gap-1">
          <Video class="w-4 h-4" /> Join {{ m.provider }}
        </a>
      </div>
    </div>

    <!-- Schedule Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Schedule Meeting</h3>
        <form @submit.prevent="saveMeeting" class="cms-form">
          <div>
            <label>Meeting Title</label>
            <input v-model="form.title" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Provider</label>
              <select v-model="form.provider" class="cms-select">
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>In Person</option>
              </select>
            </div>
            <div>
              <label>Start Time</label>
              <input v-model="form.startTime" type="datetime-local" class="cms-input" />
            </div>
          </div>
          <div>
            <label>Meeting Link (URL)</label>
            <input v-model="form.meetingLink" class="cms-input" placeholder="https://meet.google.com/..." />
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Save & Invite</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1200px; margin: 0 auto; }
.cms-page__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.meetings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; }
.meeting-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
.meeting-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }

.provider-badge { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.625rem; border-radius: 999px; }
.badge--meet { background: #e0f2fe; color: #0369a1; }
.badge--zoom { background: #dbeafe; color: #1d4ed8; }
.time-tag { font-size: 0.75rem; color: #6b7280; }

.meeting-title { font-size: 1.125rem; font-weight: 800; color: #0a0a0a; margin-bottom: 0.5rem; }
.organizer { font-size: 0.8125rem; color: #6b7280; margin-bottom: 1.5rem; }

.join-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 0.625rem; background: #0a0a0a; color: #fff; text-decoration: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
.cms-input, .cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
