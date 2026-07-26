<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { FileText, Upload, Download } from 'lucide-vue-next'

const files = ref([])
const loading = ref(true)
const categoryFilter = ref('All')

onMounted(async () => {
  await fetchFiles()
})

async function fetchFiles() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/files')
    if (data.success) files.value = data.data
  } catch (err) {
    files.value = [
      { _id: '1', name: 'Company_Logo_HighRes.png', category: 'Image', size: '2.4 MB', mimeType: 'image/png', createdAt: '2026-07-22' },
      { _id: '2', name: 'Software_Architecture_Spec.pdf', category: 'PDF', size: '5.1 MB', mimeType: 'application/pdf', createdAt: '2026-07-20' },
      { _id: '3', name: 'Q2_Financial_Audit.xlsx', category: 'Spreadsheet', size: '1.2 MB', mimeType: 'application/vnd.ms-excel', createdAt: '2026-07-15' },
    ]
  } finally {
    loading.value = false
  }
}

function uploadMock() {
  alert('File upload dialog opened. Select file to attach to project/client.')
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">File Manager</h2>
        <p class="cms-page__sub">Upload and organize documents, spreadsheets, images, and archives</p>
      </div>
      <button class="cms-btn cms-btn--primary flex items-center gap-1" @click="uploadMock">
        <Upload class="w-4 h-4" /> Upload File
      </button>
    </div>

    <!-- Files Table -->
    <div class="cms-card">
      <div v-if="loading" class="cms-loading">Loading file repository...</div>
      <table v-else class="cms-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Category</th>
            <th>Size</th>
            <th>Date Uploaded</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in files" :key="f._id">
            <td class="font-bold text-gray-900 flex items-center gap-1.5"><FileText class="w-4 h-4 text-blue-600" /> {{ f.name }}</td>
            <td><span class="cms-tag">{{ f.category }}</span></td>
            <td class="text-gray-500">{{ f.size }}</td>
            <td class="text-gray-400">{{ f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A' }}</td>
            <td>
              <button class="cms-btn-icon" @click="alert(`Downloading ${f.name}`)">
                <Download class="w-4 h-4 text-gray-600 hover:text-black" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cms-page { max-width: 1200px; margin: 0 auto; }
.cms-page__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cms-page__title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 800; }
.cms-page__sub { color: #6b7280; font-size: 0.875rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }
.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; background: #0a0a0a; color: #fff; }
.cms-btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; }
</style>
