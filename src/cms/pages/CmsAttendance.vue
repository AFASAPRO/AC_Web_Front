<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { Clock, Square, Palmtree, CheckCircle2, XCircle } from 'lucide-vue-next'

const attendanceRecords = ref([])
const leaveRequests = ref([])
const loading = ref(true)
const clockedIn = ref(false)
const clockInTime = ref(null)

const showLeaveModal = ref(false)
const leaveForm = ref({
  type: 'Annual',
  startDate: '',
  endDate: '',
  reason: '',
})

onMounted(async () => {
  await Promise.all([fetchAttendance(), fetchLeaveRequests()])
})

async function fetchAttendance() {
  loading.value = true
  try {
    const { data } = await api.get('/cms/attendance')
    if (data.success) attendanceRecords.value = data.data
  } catch (err) {
    attendanceRecords.value = [
      { _id: '1', employee: { firstName: 'John', lastName: 'Doe' }, clockIn: '2026-07-25T08:58:00Z', clockOut: '2026-07-25T17:02:00Z', hoursWorked: 8.05, status: 'Present', ip: '192.168.1.45' },
      { _id: '2', employee: { firstName: 'Jane', lastName: 'Smith' }, clockIn: '2026-07-25T09:25:00Z', clockOut: null, hoursWorked: 0, status: 'Late', ip: '192.168.1.88' },
    ]
  } finally {
    loading.value = false
  }
}

async function fetchLeaveRequests() {
  try {
    const { data } = await api.get('/cms/leave')
    if (data.success) leaveRequests.value = data.data
  } catch (err) {
    leaveRequests.value = [
      { _id: '1', employee: { firstName: 'Mike', lastName: 'Johnson' }, type: 'Personal', startDate: '2026-08-01', endDate: '2026-08-05', reason: 'Family vacation', status: 'Pending' },
    ]
  }
}

async function toggleClock() {
  try {
    if (!clockedIn.value) {
      await api.post('/cms/attendance/clock-in')
      clockedIn.value = true
      clockInTime.value = new Date().toLocaleTimeString()
      alert('Clocked IN successfully!')
    } else {
      await api.post('/cms/attendance/clock-out')
      clockedIn.value = false
      alert('Clocked OUT successfully!')
    }
    await fetchAttendance()
  } catch (err) {
    alert(err.response?.data?.message || 'Clock action error')
  }
}

async function submitLeave() {
  try {
    await api.post('/cms/leave', leaveForm.value)
    showLeaveModal.value = false
    await fetchLeaveRequests()
    alert('Leave application submitted to HR.')
  } catch (err) {
    alert('Failed to submit leave request')
  }
}

async function reviewLeave(leaveId, status) {
  try {
    await api.put(`/cms/leave/${leaveId}`, { status, reviewNotes: `Reviewed by HR (${status})` })
    await fetchLeaveRequests()
  } catch (err) {
    alert('Failed to update leave status')
  }
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">Attendance & Leave Management</h2>
        <p class="cms-page__sub">Clock-in/out time tracking, IP logs, and employee leave approvals</p>
      </div>
      <div class="header-actions">
        <button class="cms-btn" :class="clockedIn ? 'btn--danger' : 'btn--success'" @click="toggleClock">
          <Square v-if="clockedIn" class="w-4 h-4 mr-1" />
          <Clock v-else class="w-4 h-4 mr-1" />
          {{ clockedIn ? `Clock Out (${clockInTime})` : 'Clock In Now' }}
        </button>
        <button class="cms-btn cms-btn--primary" @click="showLeaveModal = true">
          <Palmtree class="w-4 h-4 mr-1" /> Request Leave
        </button>
      </div>
    </div>

    <!-- Attendance Log Card -->
    <div class="cms-card mb-6">
      <h3 class="font-bold text-lg mb-4">Daily Clock-In Log</h3>
      <table class="cms-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Hours Worked</th>
            <th>Status</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in attendanceRecords" :key="a._id">
            <td class="font-bold text-gray-900">{{ a.employee?.firstName }} {{ a.employee?.lastName }}</td>
            <td>{{ new Date(a.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</td>
            <td>{{ a.clockOut ? new Date(a.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active' }}</td>
            <td class="font-bold text-emerald-600">{{ a.hoursWorked ? `${a.hoursWorked} hrs` : '--' }}</td>
            <td><span class="cms-badge" :class="a.status === 'Present' ? 'badge--success' : 'badge--warning'">{{ a.status }}</span></td>
            <td class="text-xs text-gray-400"><code>{{ a.ip }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leave Requests Card -->
    <div class="cms-card">
      <h3 class="font-bold text-lg mb-4">Leave Applications</h3>
      <table class="cms-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Reason</th>
            <th>Status</th>
            <th>HR Review</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in leaveRequests" :key="l._id">
            <td class="font-bold text-gray-900">{{ l.employee?.firstName }} {{ l.employee?.lastName }}</td>
            <td><span class="cms-tag">{{ l.type }}</span></td>
            <td>{{ new Date(l.startDate).toLocaleDateString() }} - {{ new Date(l.endDate).toLocaleDateString() }}</td>
            <td class="text-gray-600">{{ l.reason }}</td>
            <td><span class="cms-badge" :class="l.status === 'Approved' ? 'badge--success' : l.status === 'Rejected' ? 'badge--danger' : 'badge--pending'">{{ l.status }}</span></td>
            <td>
              <div v-if="l.status === 'Pending'" class="flex gap-2">
                <button class="cms-btn text-xs py-1 px-2 btn--success flex items-center gap-1" @click="reviewLeave(l._id, 'Approved')">
                  <CheckCircle2 class="w-3 h-3" /> Approve
                </button>
                <button class="cms-btn text-xs py-1 px-2 btn--danger flex items-center gap-1" @click="reviewLeave(l._id, 'Rejected')">
                  <XCircle class="w-3 h-3" /> Reject
                </button>
              </div>
              <span v-else class="text-xs text-gray-400">Reviewed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leave Request Modal -->
    <div v-if="showLeaveModal" class="cms-modal-backdrop" @click.self="showLeaveModal = false">
      <div class="cms-modal">
        <h3 class="cms-modal__title">Apply for Leave</h3>
        <form @submit.prevent="submitLeave" class="cms-form">
          <div>
            <label>Leave Type</label>
            <select v-model="leaveForm.type" class="cms-select">
              <option>Annual</option>
              <option>Sick</option>
              <option>Personal</option>
              <option>Maternity</option>
              <option>Unpaid</option>
            </select>
          </div>
          <div class="cms-form-row">
            <div>
              <label>Start Date</label>
              <input v-model="leaveForm.startDate" type="date" required class="cms-input" />
            </div>
            <div>
              <label>End Date</label>
              <input v-model="leaveForm.endDate" type="date" required class="cms-input" />
            </div>
          </div>
          <div>
            <label>Reason for Leave</label>
            <textarea v-model="leaveForm.reason" rows="3" required class="cms-input"></textarea>
          </div>
          <div class="cms-modal__actions">
            <button type="button" class="cms-btn cms-btn--secondary" @click="showLeaveModal = false">Cancel</button>
            <button type="submit" class="cms-btn cms-btn--primary">Submit Request</button>
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
.header-actions { display: flex; gap: 0.5rem; }

.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.25rem; }
.cms-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.cms-table th { border-bottom: 1px solid #f0f1f3; padding: 0.75rem; color: #6b7280; font-size: 0.75rem; text-transform: uppercase; }
.cms-table td { padding: 0.875rem 0.75rem; border-bottom: 1px solid #f9fafb; vertical-align: middle; }

.cms-tag { background: #f3f4f6; color: #374151; padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.cms-badge { padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--warning { background: #fef9c3; color: #854d0e; }
.badge--danger { background: #fee2e2; color: #991b1b; }
.badge--pending { background: #f3f4f6; color: #4b5563; }

.btn--success { background: #16a34a; color: #fff; }
.btn--danger { background: #dc2626; color: #fff; }
.cms-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
.cms-btn--primary { background: #0a0a0a; color: #fff; }
.cms-btn--secondary { background: #f3f4f6; color: #374151; }

.cms-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 520px; }
.cms-modal__title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; }
.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-input, .cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }
.cms-modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
</style>
