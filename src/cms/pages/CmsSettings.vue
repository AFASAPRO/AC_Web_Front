<script setup>
import { ref } from 'vue'

const company = ref({
  name: 'Nexora Company Ltd.',
  email: 'support@accompany.com',
  phone: '+1 (555) 019-2831',
  address: '100 Innovation Way, Suite 400, Tech District',
})

const security = ref({
  twoFactor: false,
  sessionTimeout: '30 minutes',
  passwordPolicy: 'Strong (Min 8 chars, 1 symbol)',
})

function saveSettings() {
  alert('Company settings and security policies saved successfully.')
}
</script>

<template>
  <div class="cms-page">
    <div class="cms-page__header">
      <div>
        <h2 class="cms-page__title">System Settings</h2>
        <p class="cms-page__sub">Configure company profile, security policies, and application preferences</p>
      </div>
      <button class="cms-btn cms-btn--primary" @click="saveSettings">Save Settings</button>
    </div>

    <div class="settings-grid">
      <!-- Company Profile -->
      <div class="cms-card">
        <h3 class="card-title">Company Profile</h3>
        <form class="cms-form">
          <div>
            <label>Company Name</label>
            <input v-model="company.name" class="cms-input" />
          </div>
          <div class="cms-form-row">
            <div>
              <label>Official Email</label>
              <input v-model="company.email" type="email" class="cms-input" />
            </div>
            <div>
              <label>Phone Number</label>
              <input v-model="company.phone" class="cms-input" />
            </div>
          </div>
          <div>
            <label>Headquarters Address</label>
            <textarea v-model="company.address" class="cms-input" rows="2"></textarea>
          </div>
        </form>
      </div>

      <!-- Security Settings -->
      <div class="cms-card">
        <h3 class="card-title">Security & Authentication</h3>
        <div class="setting-row">
          <div>
            <div class="font-bold text-sm">Two-Factor Authentication (2FA)</div>
            <div class="text-xs text-gray-500">Require authenticator app code on login</div>
          </div>
          <input type="checkbox" v-model="security.twoFactor" class="toggle" />
        </div>

        <div class="setting-row">
          <div>
            <div class="font-bold text-sm">Session Timeout</div>
            <div class="text-xs text-gray-500">Automatic logout after inactivity</div>
          </div>
          <select v-model="security.sessionTimeout" class="cms-select text-xs">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>8 hours</option>
          </select>
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

.settings-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.cms-card { background: #fff; border: 1px solid #f0f1f3; border-radius: 0.875rem; padding: 1.5rem; }
.card-title { font-size: 1.125rem; font-weight: 800; color: #0a0a0a; margin-bottom: 1.25rem; }

.cms-form { display: flex; flex-direction: column; gap: 1rem; }
.cms-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cms-input, .cms-select { padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; width: 100%; }

.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f3f4f6; }
.setting-row:last-child { border-bottom: none; }
.toggle { width: 18px; height: 18px; accent-color: #0a0a0a; cursor: pointer; }

.cms-btn { padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; background: #0a0a0a; color: #fff; }
</style>
