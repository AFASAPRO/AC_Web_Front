<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { Clock } from 'lucide-vue-next'

const tasks = ref([])
const loading = ref(true)
const showModal = ref(false)

const columns = ['To Do', 'In Progress', 'Review', 'Completed']

const form = ref({
  title: '',
  description: '',
  status: 'To Do',
  priority: 'High',
  estimatedHours: 8,
})

onMounted(async () => {
  await fetchTasks()
})

async function fetchTasks() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/tasks')
    if (data.success) tasks.value = data.data
  } catch (err) {
    tasks.value = [
      { _id: '1', title: 'Design Landing Page Hero Component', description: 'Create responsive hero section in Figma with dark glassmorphism', status: 'To Do', priority: 'High', estimatedHours: 6 },
      { _id: '2', title: 'Integrate JWT Refresh Token Endpoint', description: 'Handle 401 response and token rotation in Axios interceptor', status: 'In Progress', priority: 'Urgent', estimatedHours: 4 },
      { _id: '3', title: 'Setup Mongo Indexes & Soft Delete', description: 'Add proper indexing for user email and deleted flag pre-hook', status: 'Review', priority: 'Medium', estimatedHours: 3 },
      { _id: '4', title: 'Deploy Staging Server to Cloud', description: 'CI/CD GitHub Actions setup for automated test runner', status: 'Completed', priority: 'Low', estimatedHours: 5 },
    ]
  } finally {
    loading.value = false
  }
}

function getColumnTasks(col) {
  return tasks.value.filter(t => t.status === col)
}

async function moveTask(task, newStatus) {
  task.status = newStatus
  try {
    await api.put(`/cms/tasks/${task._id}`, { status: newStatus })
  } catch (err) {
    console.error('Failed to update task status')
  }
}

async function saveTask() {
  try {
    await api.post('/cms/tasks', form.value)
    showModal.value = false
    await fetchTasks()
  } catch (err) {
    alert('Failed to save task')
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Task Management</h2>
        <p class="cms-page__sub">Kanban board view for managing team tasks and deliverables</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="showModal = true">+ Create Task</button>
    </div>

    <!-- Kanban Board -->
    <div v-if="loading" class="cms-loading">Loading board...</div>
    <div v-else class="kanban-board">
      <div v-for="col in columns" :key="col" class="kanban-col">
        <div class="kanban-col__header">
          <span class="col-title">{{ col }}</span>
          <span class="col-count">{{ getColumnTasks(col).length }}</span>
        </div>

        <div class="kanban-col__content">
          <div v-for="t in getColumnTasks(col)" :key="t._id" class="task-card">
            <div class="task-card__priority" :class="`priority--${t.priority.toLowerCase()}`">{{ t.priority }}</div>
            <h4 class="task-card__title">{{ t.title }}</h4>
            <p class="task-card__desc">{{ t.description }}</p>
            
            <div class="task-card__footer">
              <span class="hours flex items-center gap-1"><Clock class="w-3 h-3" /> {{ t.estimatedHours }}h</span>
              <div class="actions">
                <select :value="t.status" @change="e => moveTask(t, e.target.value)" class="move-select">
                  <option v-for="c in columns" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Create New Task</h3>
        <form @submit.prevent="saveTask" class="cms-form">
          <div>
            <label>Task Title</label>
            <input v-model="form.title" required class="cms-input" />
          </div>
          <div>
            <label>Description</label>
            <textarea v-model="form.description" class="cms-input" rows="3"></textarea>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Status Column</label>
              <select v-model="form.status" class="cms-select">
                <option v-for="c in columns" :key="c" :value="c">{{ c }}</option>
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
          <div>
            <label>Estimated Hours</label>
            <input v-model.number="form.estimatedHours" type="number" class="cms-input" />
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1280px; margin: 0 auto; }
.cms-page__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.kanban-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; align-items: start; }
.kanban-col { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1rem; min-height: 500px; }
.kanban-col__header { display: flex; justify-content: space-between; align-items: center; font-weight: 800; margin-bottom: 1rem; }
.col-title { font-size: 0.875rem; color: #111827; }
.col-count { background: #e5e7eb; color: #374151; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 999px; }

.kanban-col__content { display: flex; flex-direction: column; gap: 0.875rem; }
.task-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.625rem; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.task-card__priority { display: inline-block; font-size: 0.6875rem; font-weight: 700; padding: 0.125rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem; text-transform: uppercase; }
.priority--low { background: #f3f4f6; color: #4b5563; }
.priority--medium { background: #fef3c7; color: #92400e; }
.priority--high { background: #fee2e2; color: #991b1b; }
.priority--urgent { background: #7f1d1d; color: #fff; }

.task-card__title { font-size: 0.9375rem; font-weight: 700; color: #0a0a0a; margin-bottom: 0.375rem; }
.task-card__desc { font-size: 0.8125rem; color: #6b7280; line-height: 1.4; margin-bottom: 0.875rem; }

.task-card__footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #9ca3af; border-top: 1px solid #f9fafb; pt: 0.5rem; }
.move-select { border: 1px solid #e5e7eb; border-radius: 0.25rem; font-size: 0.75rem; background: #fff; padding: 0.125rem 0.375rem; }

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
