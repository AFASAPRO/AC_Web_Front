<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { useAuthStore } from '../stores/auth.js'
import { Code, ExternalLink } from 'lucide-vue-next'

const auth = useAuthStore()
const projects = ref([])
const loading = ref(true)
const showModal = ref(false)

const role = computed(() => auth.userRole || 'employee')

const form = ref({
  name: '',
  description: '',
  status: 'In Progress',
  priority: 'High',
  budget: 25000,
  progress: 45,
  githubRepo: 'https://github.com/ac-company/project',
  demoUrl: 'https://demo.accompany.com',
})

onMounted(async () => {
  await fetchProjects()
})

async function fetchProjects() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/projects')
    if (data.success) projects.value = data.data
  } catch (err) {
    projects.value = [
      { _id: '1', name: 'E-commerce Platform Redesign', description: 'Complete UI/UX overhaul and backend microservices architecture', status: 'In Progress', priority: 'High', budget: 45000, progress: 65, githubRepo: 'github.com/org/ecom-v2', demoUrl: 'ecom-staging.ac.com' },
      { _id: '2', name: 'AI Customer Assistant Integration', description: 'LLM RAG pipeline integration for support desk', status: 'Testing', priority: 'Urgent', budget: 28000, progress: 85, githubRepo: 'github.com/org/ai-support', demoUrl: 'ai-demo.ac.com' },
      { _id: '3', name: 'Mobile Banking App v3.0', description: 'iOS and Android React Native mobile app build', status: 'Planning', priority: 'Medium', budget: 60000, progress: 20, githubRepo: 'github.com/org/bank-mobile', demoUrl: 'bank-app.ac.com' },
    ]
  } finally {
    loading.value = false
  }
}

// For client role, filter to show only their assigned project
const displayProjects = computed(() => {
  if (role.value === 'client') {
    return projects.value.slice(0, 1) // Show client's assigned project
  }
  return projects.value
})

async function saveProject() {
  try {
    await api.post('/cms/projects', form.value)
    showModal.value = false
    await fetchProjects()
  } catch (err) {
    alert('Failed to save project')
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">{{ role === 'client' ? 'My Assigned Projects' : 'Project Management' }}</h2>
        <p class="cms-page__sub">Track project progress, deadlines, milestones, and deliverables</p>
      </div>
      <button v-if="role !== 'client'" class="cms-btn cms-btn--primary" @click="showModal = true">+ Create Project</button>
    </div>

    <!-- Projects Grid -->
    <div v-if="loading" class="cms-loading">Loading projects...</div>
    <div v-else class="projects-grid">
      <div v-for="p in displayProjects" :key="p._id" class="project-card">
        <div class="project-card__header">
          <div>
            <h3 class="project-card__title">{{ p.name }}</h3>
            <span class="cms-badge" :class="p.priority === 'Urgent' ? 'badge--urgent' : 'badge--high'">{{ p.priority }} Priority</span>
          </div>
          <span class="project-card__status">{{ p.status }}</span>
        </div>
        
        <p class="project-card__desc">{{ p.description }}</p>

        <!-- Progress bar -->
        <div class="progress-wrap">
          <div class="progress-info">
            <span>Progress</span>
            <span class="font-bold">{{ p.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: p.progress + '%' }"></div>
          </div>
        </div>

        <!-- Details -->
        <div class="project-card__footer">
          <div class="budget">Budget: <strong>${{ p.budget?.toLocaleString() }}</strong></div>
          <div class="links">
            <a v-if="p.githubRepo" :href="p.githubRepo" target="_blank" class="link-btn flex items-center gap-1">
              <Code class="w-3 h-3" /> GitHub
            </a>
            <a v-if="p.demoUrl" :href="p.demoUrl" target="_blank" class="link-btn flex items-center gap-1">
              <ExternalLink class="w-3 h-3" /> Demo
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Create New Project</h3>
        <form @submit.prevent="saveProject" class="cms-form">
          <div>
            <label>Project Name</label>
            <input v-model="form.name" required class="cms-input" />
          </div>
          <div>
            <label>Description</label>
            <textarea v-model="form.description" class="cms-input" rows="2"></textarea>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Status</label>
              <select v-model="form.status" class="cms-select">
                <option>Planning</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Testing</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select v-model="form.priority" class="cms-select">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Budget ($)</label>
              <input v-model.number="form.budget" type="number" class="cms-input" />
            </div>
            <div>
              <label>Initial Progress (%)</label>
              <input v-model.number="form.progress" type="number" min="0" max="100" class="cms-input" />
            </div>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Create Project</button>
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

.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem; }
.project-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
.project-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.project-card__title { font-size: 1.125rem; font-weight: 800; color: #0a0a0a; margin-bottom: 0.25rem; }
.project-card__status { font-size: 0.75rem; font-weight: 700; background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; }
.project-card__desc { color: #6b7280; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.25rem; }

.progress-wrap { margin-bottom: 1.25rem; }
.progress-info { display: flex; justify-content: space-between; font-size: 0.75rem; color: #374151; margin-bottom: 0.375rem; }
.progress-bar { background: #f3f4f6; height: 8px; border-radius: 999px; overflow: hidden; }
.progress-fill { background: #0a0a0a; height: 100%; border-radius: 999px; transition: width 0.4s ease; }

.project-card__footer { display: flex; justify-content: space-between; align-items: center; pt: 1rem; border-top: 1px solid #f3f4f6; font-size: 0.8125rem; }
.links { display: flex; gap: 0.5rem; }
.link-btn { background: #f9fafb; border: 1px solid #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; color: #374151; text-decoration: none; }

.badge--high { background: #fee2e2; color: #991b1b; }
.badge--urgent { background: #7f1d1d; color: #fff; }

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
