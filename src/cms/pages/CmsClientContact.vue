<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

const subject = ref('')
const message = ref('')
const loading = ref(false)
const sent = ref(false)

async function sendMessage() {
  if (!subject.value || !message.value) return
  loading.value = true
  try {
    // Send message or notification to system admin
    await api.post('/cms/messages', {
      text: `[CLIENT INQUIRY] ${subject.value}: ${message.value}`,
      channel: 'general',
    })
    sent.value = true
    subject.value = ''
    message.value = ''
  } catch (err) {
    alert('Failed to send message to company. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Contact AC Company</h2>
        <p class="cms-page__sub">Send a direct message or inquiry to your assigned project team & account manager</p>
      </div>
    </div>

    <div class="cms-card contact-box">
      <div v-if="sent" class="sent-banner">
        <span class="text-xl">✅</span>
        <div>
          <h4 class="font-bold text-emerald-900">Message Sent Successfully</h4>
          <p class="text-xs text-emerald-700">Our project manager and engineering team have been notified. We will reply to your registered email shortly.</p>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="cms-form">
        <div>
          <label class="form-label">Subject / Topic</label>
          <input v-model="subject" placeholder="e.g. Milestone 2 Approval Request or Change Request" required class="cms-input" />
        </div>
        <div>
          <label class="form-label">Your Message / Inquiry</label>
          <textarea v-model="message" rows="6" placeholder="Describe your request, question, or updates here..." required class="cms-input"></textarea>
        </div>
        <button type="submit" class="cms-btn cms-btn--primary" :disabled="loading">
          {{ loading ? 'Sending...' : '🚀 Send Message to Team' }}
        </button>
      </form>

      <!-- Direct Contact Info -->
      <div class="support-info">
        <h4>Need Urgent Support?</h4>
        <p>Email: <a href="mailto:support@accompany.com" class="text-blue-600 underline">support@accompany.com</a></p>
        <p>Direct Line: <strong>+1 (555) 019-2831</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 800px; margin: 0 auto; }
.cms-page__header { margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 2rem; }
.sent-banner { display: flex; gap: 0.75rem; align-items: flex-start; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }

.cms-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-label { font-size: 0.8125rem; font-weight: 700; color: #111827; display: block; margin-bottom: 0.375rem; }
.cms-input { padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; border: none; background: #0a0a0a; color: #fff; width: 100%; }

.support-info { margin-top: 2rem; pt: 1.5rem; border-top: 1px solid #f3f4f6; font-size: 0.8125rem; color: #4b5563; }
.support-info h4 { font-weight: 700; color: #111827; margin-bottom: 0.375rem; }
</style>
