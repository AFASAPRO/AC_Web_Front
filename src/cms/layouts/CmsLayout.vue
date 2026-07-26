<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import api from '../services/api.js'
import CmsSidebar from '../components/sidebar/CmsSidebar.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)

const notifications = ref([])
const unreadCount = ref(0)

onMounted(async () => {
  await fetchNotifications()
})

async function fetchNotifications() {
  try {
    const { data } = await api.get('/notifications')
    if (data.success) {
      notifications.value = data.data.notifications || []
      unreadCount.value = data.data.unreadCount || 0
    }
  } catch (err) {
    console.error('Failed to load notifications')
  }
}

async function markAllRead() {
  try {
    await api.put('/notifications/read-all')
    notifications.value.forEach(n => n.isRead = true)
    unreadCount.value = 0
  } catch (err) {
    console.error('Failed to mark notifications read')
  }
}

const pageTitle = computed(() => {
  const name = route.name || ''
  const map = {
    'cms-dashboard': 'Dashboard',
    'cms-users': 'User Accounts',
    'cms-employees': 'Employees',
    'cms-clients': 'Clients',
    'cms-projects': 'Projects',
    'cms-tasks': 'Tasks',
    'cms-finance': 'Finance',
    'cms-payroll': 'Payroll',
    'cms-meetings': 'Meetings',
    'cms-chat': 'Internal Chat',
    'cms-client-contact': 'Contact Company',
    'cms-calendar': 'Calendar',
    'cms-crm': 'CRM',
    'cms-files': 'File Manager',
    'cms-reports': 'Reports',
    'cms-settings': 'Settings',
  }
  return map[name] || 'Dashboard'
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

async function handleLogout() {
  await auth.logout()
  router.push('/cms')
}

function closeDropdowns() {
  showUserMenu.value = false
  showNotifications.value = false
}
</script>

<template>
  <div class="cms-layout" @click="closeDropdowns">
    <!-- Sidebar -->
    <CmsSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileMenuOpen"
      @toggle="toggleSidebar"
      @close-mobile="mobileMenuOpen = false"
    />

    <!-- Main content area -->
    <div class="cms-layout__main" :class="{ 'cms-layout__main--collapsed': sidebarCollapsed }">
      <!-- Top bar -->
      <header class="cms-layout__topbar">
        <div class="cms-layout__topbar-left">
          <!-- Mobile menu toggle -->
          <button class="cms-layout__mobile-toggle" @click.stop="toggleMobileMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round"/>
            </svg>
          </button>

          <h1 class="cms-layout__page-title">{{ pageTitle }}</h1>
        </div>

        <div class="cms-layout__topbar-right">
          <!-- Search -->
          <div class="cms-layout__search">
            <svg class="cms-layout__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="Search..." class="cms-layout__search-input" />
          </div>

          <!-- Notifications bell -->
          <button class="cms-layout__icon-btn" @click.stop="showNotifications = !showNotifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="unreadCount > 0" class="cms-layout__badge">{{ unreadCount }}</span>

            <!-- Notification dropdown -->
            <div v-if="showNotifications" class="cms-layout__dropdown cms-layout__notif-dropdown" @click.stop>
              <div class="cms-layout__dropdown-header">
                <h3>Notifications</h3>
                <button class="cms-layout__dropdown-action" @click="markAllRead">Mark all read</button>
              </div>
              <div class="cms-layout__notif-list">
                <div v-if="notifications.length === 0" class="p-4 text-center text-xs text-gray-400">No notifications</div>
                <div class="cms-layout__notif-item" v-for="n in notifications" :key="n._id">
                  <div class="cms-layout__notif-dot" :class="{ 'opacity-30': n.isRead }"></div>
                  <div>
                    <p class="cms-layout__notif-text">{{ n.title }}</p>
                    <span class="cms-layout__notif-sub">{{ n.message }}</span>
                    <span class="cms-layout__notif-time">{{ new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          <!-- User avatar / menu -->
          <button class="cms-layout__user-btn" @click.stop="showUserMenu = !showUserMenu">
            <div class="cms-layout__avatar">
              {{ auth.userInitials }}
            </div>

            <!-- User dropdown -->
            <div v-if="showUserMenu" class="cms-layout__dropdown cms-layout__user-dropdown" @click.stop>
              <div class="cms-layout__user-info">
                <div class="cms-layout__avatar cms-layout__avatar--lg">{{ auth.userInitials }}</div>
                <div>
                  <p class="cms-layout__user-name">{{ auth.userName }}</p>
                  <p class="cms-layout__user-role">{{ auth.userRole.replace('_', ' ') }}</p>
                </div>
              </div>
              <div class="cms-layout__dropdown-divider"></div>
              <router-link to="/cms/settings" class="cms-layout__dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Settings
              </router-link>
              <button class="cms-layout__dropdown-item cms-layout__dropdown-item--danger" @click="handleLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Log Out
              </button>
            </div>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="cms-layout__content">
        <router-view />
      </main>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="mobileMenuOpen"
      class="cms-layout__overlay"
      @click="mobileMenuOpen = false"
    ></div>
  </div>
</template>

<style scoped>
.cms-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

.cms-layout__main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.cms-layout__main--collapsed {
  margin-left: 72px;
}

.cms-layout__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #f0f1f3;
  position: sticky;
  top: 0;
  z-index: 30;
}
.cms-layout__topbar-left { display: flex; align-items: center; gap: 0.75rem; }
.cms-layout__topbar-right { display: flex; align-items: center; gap: 0.5rem; }

.cms-layout__page-title {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a0a0a;
  letter-spacing: -0.02em;
}

.cms-layout__mobile-toggle {
  display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; background: none; color: #374151; cursor: pointer; border-radius: 0.5rem;
}
.cms-layout__mobile-toggle:hover { background: #f3f4f6; }

.cms-layout__search { position: relative; display: flex; align-items: center; }
.cms-layout__search-icon { position: absolute; left: 0.75rem; color: #9ca3af; pointer-events: none; }
.cms-layout__search-input { width: 220px; padding: 0.5rem 0.75rem 0.5rem 2.25rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8125rem; color: #111827; background: #f9fafb; outline: none; transition: all 0.2s ease; }
.cms-layout__search-input:focus { background: #fff; border-color: #0a0a0a; box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.05); width: 280px; }

.cms-layout__icon-btn { position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: none; color: #374151; cursor: pointer; border-radius: 0.5rem; transition: background 0.15s ease; }
.cms-layout__icon-btn:hover { background: #f3f4f6; }
.cms-layout__badge { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; font-size: 0.625rem; font-weight: 700; border-radius: 50%; border: 2px solid #fff; }

.cms-layout__user-btn { position: relative; display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 0.5rem; }
.cms-layout__user-btn:hover { background: #f3f4f6; }
.cms-layout__avatar { width: 34px; height: 34px; border-radius: 50%; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
.cms-layout__avatar--lg { width: 40px; height: 40px; font-size: 0.875rem; }

.cms-layout__dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); z-index: 50; overflow: hidden; }
.cms-layout__dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 0.875rem 1rem; border-bottom: 1px solid #f3f4f6; }
.cms-layout__dropdown-header h3 { font-size: 0.8125rem; font-weight: 700; color: #111827; }
.cms-layout__dropdown-action { background: none; border: none; font-size: 0.75rem; font-weight: 600; color: #2563eb; cursor: pointer; }

.cms-layout__notif-dropdown { width: 340px; }
.cms-layout__notif-list { max-height: 320px; overflow-y: auto; }
.cms-layout__notif-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; border-bottom: 1px solid #f9fafb; text-align: left; }
.cms-layout__notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; margin-top: 6px; flex-shrink: 0; }
.cms-layout__notif-text { font-size: 0.8125rem; color: #111827; font-weight: 700; }
.cms-layout__notif-sub { font-size: 0.75rem; color: #4b5563; display: block; }
.cms-layout__notif-time { font-size: 0.6875rem; color: #9ca3af; display: block; margin-top: 0.125rem; }

.cms-layout__user-dropdown { width: 240px; }
.cms-layout__user-info { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; }
.cms-layout__user-name { font-size: 0.8125rem; font-weight: 700; color: #111827; }
.cms-layout__user-role { font-size: 0.6875rem; color: #6b7280; text-transform: capitalize; }
.cms-layout__dropdown-divider { height: 1px; background: #f3f4f6; }
.cms-layout__dropdown-item { display: flex; align-items: center; gap: 0.625rem; padding: 0.625rem 1rem; font-size: 0.8125rem; color: #374151; text-decoration: none; cursor: pointer; background: none; border: none; width: 100%; text-align: left; }
.cms-layout__dropdown-item:hover { background: #f9fafb; }
.cms-layout__dropdown-item--danger { color: #dc2626; }

.cms-layout__content { flex: 1; padding: 1.5rem; }
.cms-layout__overlay { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 39; }

@media (max-width: 1024px) {
  .cms-layout__main { margin-left: 0; }
  .cms-layout__main--collapsed { margin-left: 0; }
  .cms-layout__mobile-toggle { display: flex; }
  .cms-layout__search { display: none; }
  .cms-layout__overlay { display: block; }
  .cms-layout__content { padding: 1rem; }
}
</style>
