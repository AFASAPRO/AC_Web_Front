<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import api from '../services/api.js'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const messages = ref([])
const textInput = ref('')
const activeChannel = ref('general')
const channels = ['general', 'engineering', 'design', 'announcements']

let socket = null

onMounted(async () => {
  await fetchMessages()
  
  // Socket.IO setup
  // VITE_SOCKET_URL should point at the backend root (no /api suffix), e.g.
  // https://ac-cms-backend.onrender.com — falls back to localhost for dev.
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true })
  socket.on('new_message', (msg) => {
    if (msg.channel === activeChannel.value) {
      messages.value.push(msg)
    }
  })
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})

async function fetchMessages() {
  try {
    const { data } = await api.get(`/cms/messages?channel=${activeChannel.value}`)
    if (data.success) messages.value = data.data
  } catch (err) {
    messages.value = [
      { _id: '1', sender: { firstName: 'John', lastName: 'Doe' }, text: 'Welcome to the internal team chat! Socket.IO is connected.', channel: 'general', createdAt: new Date().toISOString() },
    ]
  }
}

async function selectChannel(ch) {
  activeChannel.value = ch
  await fetchMessages()
}

async function send() {
  if (!textInput.value.trim()) return
  const msgText = textInput.value
  textInput.value = ''

  try {
    await api.post('/cms/messages', { text: msgText, channel: activeChannel.value })
  } catch (err) {
    console.error('Failed to send message')
  }
}
</script>

<template>
  <div class="cms-page chat-layout">
    <!-- Channels Sidebar -->
    <div class="chat-sidebar">
      <h3 class="chat-sidebar__title">Channels</h3>
      <div class="channel-list">
        <button
          v-for="ch in channels"
          :key="ch"
          class="channel-btn"
          :class="{ active: activeChannel === ch }"
          @click="selectChannel(ch)"
        >
          # {{ ch }}
        </button>
      </div>
    </div>

    <!-- Main Chat Window -->
    <div class="chat-window">
      <div class="chat-header">
        <h3># {{ activeChannel }}</h3>
      </div>

      <div class="chat-messages">
        <div v-for="m in messages" :key="m._id" class="chat-msg">
          <div class="msg-avatar">{{ m.sender?.firstName?.[0] }}</div>
          <div>
            <div class="msg-meta">
              <span class="msg-author">{{ m.sender?.firstName }} {{ m.sender?.lastName }}</span>
              <span class="msg-time">{{ new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <p class="msg-text">{{ m.text }}</p>
          </div>
        </div>
      </div>

      <!-- Input box -->
      <form @submit.prevent="send" class="chat-input-row">
        <input v-model="textInput" placeholder="Message #channel..." class="cms-input" />
        <button type="submit" class="cms-btn cms-btn--primary">Send</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-layout { display: grid; grid-template-columns: 240px 1fr; height: calc(100vh - 120px); background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; overflow: hidden; }
.chat-sidebar { background: #f8f9fa; border-right: 1px solid #e5e7eb; padding: 1.25rem; }
.chat-sidebar__title { font-size: 0.75rem; text-transform: uppercase; color: #6b7280; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: 0.05em; }

.channel-list { display: flex; flex-direction: column; gap: 0.25rem; }
.channel-btn { border: none; background: none; text-align: left; padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-weight: 600; font-size: 0.875rem; color: #4b5563; cursor: pointer; }
.channel-btn.active { background: #0a0a0a; color: #fff; }

.chat-window { display: flex; flex-direction: column; height: 100%; }
.chat-header { border-bottom: 1px solid #f0f1f3; padding: 1rem 1.5rem; font-weight: 800; font-size: 1.125rem; }
.chat-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

.chat-msg { display: flex; gap: 0.75rem; align-items: flex-start; }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
.msg-meta { display: flex; gap: 0.5rem; align-items: baseline; margin-bottom: 0.25rem; }
.msg-author { font-weight: 700; font-size: 0.875rem; color: #111827; }
.msg-time { font-size: 0.6875rem; color: #9ca3af; }
.msg-text { font-size: 0.875rem; color: #374151; line-height: 1.4; }

.chat-input-row { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #f0f1f3; }
.cms-input { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; background: #0a0a0a; color: #fff; }
</style>
