<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Bot, X, Send, Sparkles } from 'lucide-vue-next'

const open = ref(false)
const showTeaser = ref(false)
const input = ref('')
const listEl = ref(null)
const messages = ref([
  { role: 'assistant', text: "Hi! I'm the AC Company assistant. Ask me about our services, pricing or how to start a project." },
])
const isTyping = ref(false)
let teaserTimer = null

onMounted(() => {
  teaserTimer = setTimeout(() => {
    if (!open.value) showTeaser.value = true
  }, 3200)
})
onBeforeUnmount(() => clearTimeout(teaserTimer))

const launch = () => {
  open.value = true
  showTeaser.value = false
}

const quickReplies = ['What services do you offer?', 'How much does a project cost?', 'How do I start?']

const scrollToBottom = async () => {
  await nextTick()
  listEl.value?.scrollTo({ top: listEl.value.scrollHeight, behavior: 'smooth' })
}

const respond = (question) => {
  const q = question.toLowerCase()
  if (q.includes('service')) return "We offer web & mobile development, AI solutions, cloud, UI/UX design, DevOps, and more \u2014 see the Services section above."
  if (q.includes('price') || q.includes('cost')) return 'Every project is scoped individually based on complexity and timeline \u2014 tell me a bit about yours and our team will follow up with a quote.'
  if (q.includes('start') || q.includes('begin')) return "Just fill out the contact form below and we'll schedule a discovery call within one business day!"
  return "Thanks for your message! For a detailed answer, our team will follow up shortly \u2014 or use the contact form to reach us directly."
}

const send = async (text) => {
  const value = (text ?? input.value).trim()
  if (!value) return
  messages.value.push({ role: 'user', text: value })
  input.value = ''
  isTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    messages.value.push({ role: 'assistant', text: respond(value) })
    isTyping.value = false
    scrollToBottom()
  }, 900)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40">
    <Transition name="pop">
      <div
        v-if="open"
        class="glass mb-4 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/20"
        role="dialog"
        aria-label="AI chat assistant"
      >
        <div class="flex items-center justify-between bg-gradient-to-br from-ink-950 to-ink-800 px-5 py-4 text-white">
          <div class="flex items-center gap-2.5">
            <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
              <Bot class="h-[18px] w-[18px] text-accent-400" />
            </span>
            <div>
              <p class="text-sm font-semibold leading-none">AC Assistant</p>
              <p class="mt-1 flex items-center gap-1 text-[11px] text-white/50">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Online now
              </p>
            </div>
          </div>
          <button aria-label="Close chat" @click="open = false"><X class="h-4 w-4" /></button>
        </div>

        <div ref="listEl" class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <p
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="m.role === 'user' ? 'bg-accent-500 text-white' : 'bg-ink-100 text-ink-800'"
            >
              {{ m.text }}
            </p>
          </div>
          <div v-if="isTyping" class="flex justify-start">
            <div class="flex items-center gap-1 rounded-2xl bg-ink-100 px-4 py-3">
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"></span>
            </div>
          </div>
        </div>

        <div v-if="messages.length < 2" class="flex flex-wrap gap-2 px-4 pb-3">
          <button
            v-for="q in quickReplies"
            :key="q"
            class="rounded-full border border-ink-200 px-3 py-1.5 text-xs text-ink-600 hover:border-accent-500 hover:text-accent-600"
            @click="send(q)"
          >
            {{ q }}
          </button>
        </div>

        <form class="flex items-center gap-2 border-t border-ink-100 p-3" @submit.prevent="send()">
          <input
            v-model="input"
            type="text"
            placeholder="Type a message..."
            class="flex-1 rounded-full border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-accent-500"
          />
          <button type="submit" aria-label="Send message" class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-950 text-white transition hover:bg-accent-500">
            <Send class="h-4 w-4" />
          </button>
        </form>
      </div>
    </Transition>

    <div class="relative flex items-center justify-end">
      <Transition name="teaser">
        <button
          v-if="showTeaser && !open"
          class="glass mr-4 flex items-center gap-2 rounded-full py-2.5 pl-4 pr-3 text-sm font-medium text-ink-800 shadow-lg shadow-black/10"
          @click="launch"
        >
          <Sparkles class="h-3.5 w-3.5 text-accent-500" />
          Chat with me to get help
          <span class="grid h-5 w-5 place-items-center rounded-full text-ink-400 hover:text-ink-950" @click.stop="showTeaser = false">
            <X class="h-3 w-3" />
          </span>
        </button>
      </Transition>

      <button
        :aria-label="open ? 'Close AI assistant' : 'Open AI assistant'"
       
        class="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-950 to-ink-700 text-white shadow-lg shadow-black/25 transition-transform hover:scale-110"
        @click="open ? (open = false) : launch()"
      >
        <span v-if="!open" class="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent-500 ring-2 ring-white"></span>
        <X v-if="open" class="h-5 w-5" />
        <Bot v-else class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: bottom right; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }
.teaser-enter-active, .teaser-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: right center; }
.teaser-enter-from, .teaser-leave-to { opacity: 0; transform: scale(0.9) translateX(10px); }
</style>
