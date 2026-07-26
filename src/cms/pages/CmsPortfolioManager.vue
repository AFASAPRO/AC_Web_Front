<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { Plus, Trash2, Edit, ExternalLink, Image as ImageIcon } from 'lucide-vue-next'

const items = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  category: 'Web Application',
  clientName: '',
  description: '',
  featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  technologies: 'Vue 3, Node.js, Tailwind CSS',
  liveUrl: 'https://accompany.com',
  isFeatured: true,
})

onMounted(async () => {
  await fetchPortfolio()
})

async function fetchPortfolio() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/portfolio')
    if (data.success) items.value = data.data
  } catch (err) {
    items.value = [
      { _id: '1', title: 'Fintech Mobile Banking System', category: 'Mobile App', clientName: 'Nexus Bank', description: 'Next-gen mobile banking app with biometric authentication and real-time ledger.', featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', technologies: ['React Native', 'Node.js'], isFeatured: true },
      { _id: '2', title: 'AI Customer Support Platform', category: 'AI & ML', clientName: 'Global Cloud', description: 'LLM RAG support assistant reducing ticket resolution time by 60%.', featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', technologies: ['Python', 'Vue 3'], isFeatured: true },
    ]
  } finally {
    loading.value = false
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      form.value.featuredImage = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

function openCreateModal() {
  editingId.value = null
  form.value = {
    title: '',
    category: 'Web Application',
    clientName: '',
    description: '',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    technologies: 'Vue 3, Node.js, Tailwind CSS',
    liveUrl: 'https://accompany.com',
    isFeatured: true,
  }
  showModal.value = true
}

function editItem(item) {
  editingId.value = item._id
  form.value = {
    title: item.title,
    category: item.category,
    clientName: item.clientName || '',
    description: item.description,
    featuredImage: item.featuredImage,
    technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies,
    liveUrl: item.liveUrl || '',
    isFeatured: item.isFeatured,
  }
  showModal.value = true
}

async function savePortfolioItem() {
  try {
    const payload = {
      ...form.value,
      technologies: typeof form.value.technologies === 'string' ? form.value.technologies.split(',').map(t => t.trim()) : form.value.technologies,
    }
    
    if (editingId.value) {
      await api.put(`/cms/portfolio/${editingId.value}`, payload)
    } else {
      await api.post('/cms/portfolio', payload)
    }
    
    showModal.value = false
    await fetchPortfolio()
    alert(editingId.value ? 'Portfolio project updated!' : 'Portfolio project published to public website!')
  } catch (err) {
    alert('Failed to save portfolio project')
  }
}

async function deleteItem(id) {
  if (confirm('Remove project from public portfolio?')) {
    try {
      await api.delete(`/cms/portfolio/${id}`)
      await fetchPortfolio()
    } catch (err) {
      alert('Failed to delete portfolio project')
    }
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Public Portfolio Manager</h2>
        <p class="cms-page__sub">Add, edit, and publish project showcases displayed on the public website (/portfolio)</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="openCreateModal">
        <Plus class="w-4 h-4 mr-1" /> Add Showcase Project
      </button>
    </div>

    <!-- Portfolio Grid -->
    <div v-if="loading" class="cms-loading">Loading portfolio projects...</div>
    <div v-else class="portfolio-grid">
      <div v-for="item in items" :key="item._id" class="portfolio-card">
        <img :src="item.featuredImage" :alt="item.title" class="portfolio-img" />
        <div class="portfolio-body">
          <div class="flex justify-between items-center mb-1">
            <span class="cms-tag">{{ item.category }}</span>
            <div class="flex gap-1">
              <button class="cms-btn-icon" @click="editItem(item)"><Edit class="w-4 h-4 text-blue-600" /></button>
              <button class="cms-btn-icon" @click="deleteItem(item._id)"><Trash2 class="w-4 h-4 text-rose-600" /></button>
            </div>
          </div>
          <h3 class="font-bold text-base text-gray-900 mb-1">{{ item.title }}</h3>
          <p class="text-xs text-gray-500 mb-2">Client: {{ item.clientName || 'AC Company Showcase' }}</p>
          <p class="text-xs text-gray-600 line-clamp-2">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="cms-modal-backdrop" @click.self="showModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">{{ editingId ? 'Edit Showcase Project' : 'Add Website Portfolio Project' }}</h3>
        <form @submit.prevent="savePortfolioItem" class="cms-form">
          <div>
            <label>Project Title</label>
            <input v-model="form.title" required class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Category</label>
              <input v-model="form.category" required class="cms-input" placeholder="e.g. Web Development, AI" />
            </div>
            <div>
              <label>Client Name</label>
              <input v-model="form.clientName" class="cms-input" />
            </div>
          </div>
          <div>
            <label>Description</label>
            <textarea v-model="form.description" rows="3" required class="cms-input"></textarea>
          </div>
          
          <!-- Image upload & preview -->
          <div>
            <label>Project Thumbnail / Cover Image</label>
            <div class="flex gap-2 items-center mt-1">
              <input v-model="form.featuredImage" class="cms-input flex-1" placeholder="Image URL or upload below..." />
              <label class="cms-btn cms-btn--secondary text-xs cursor-pointer flex items-center gap-1">
                <ImageIcon class="w-4 h-4" /> Upload
                <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              </label>
            </div>
            <img v-if="form.featuredImage" :src="form.featuredImage" class="h-20 w-36 object-cover rounded mt-2 border" />
          </div>

          <div class="cms-form-row">
            <div>
              <label>Live URL</label>
              <input v-model="form.liveUrl" class="cms-input" />
            </div>
            <div>
              <label>Technologies (comma separated)</label>
              <input v-model="form.technologies" class="cms-input" />
            </div>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">{{ editingId ? 'Update Project' : 'Publish Project' }}</button>
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

.portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
.portfolio-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; overflow: hidden; display: flex; flex-direction: column; }
.portfolio-img { width: 100%; height: 160px; object-fit: cover; }
.portfolio-body { padding: 1rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }
.cms-btn-icon { background: none; border: none; cursor: pointer; padding: 0.25rem; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-input { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
