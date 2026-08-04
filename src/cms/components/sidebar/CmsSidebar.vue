<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const props = defineProps({
  collapsed: Boolean,
  mobileOpen: Boolean,
})
const emit = defineEmits(['toggle', 'close-mobile'])

const route = useRoute()
const auth = useAuthStore()

const role = computed(() => auth.userRole || 'employee')

// Defines accessible routes for each role
const rolePermissions = {
  super_admin: ['*'],
  admin: ['*'],
  manager: ['/cms/dashboard', '/cms/projects', '/cms/tasks', '/cms/crm', '/cms/meetings', '/cms/chat', '/cms/calendar', '/cms/files', '/cms/attendance'],
  hr: ['/cms/dashboard', '/cms/employees', '/cms/payroll', '/cms/meetings', '/cms/chat', '/cms/calendar', '/cms/settings', '/cms/attendance'],
  accountant: ['/cms/dashboard', '/cms/finance', '/cms/payroll', '/cms/reports', '/cms/clients'],
  employee: ['/cms/dashboard', '/cms/tasks', '/cms/projects', '/cms/chat', '/cms/meetings', '/cms/calendar', '/cms/files', '/cms/attendance'],
  client: ['/cms/dashboard', '/cms/projects', '/cms/meetings', '/cms/contact-company', '/cms/files'],
}

const allMenuGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', route: '/cms/dashboard', icon: 'dashboard' },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Employees', route: '/cms/employees', icon: 'employees' },
      { name: 'Clients', route: '/cms/clients', icon: 'clients' },
      { name: 'Projects', route: '/cms/projects', icon: 'projects' },
      { name: 'Tasks', route: '/cms/tasks', icon: 'tasks' },
      { name: 'Attendance & Leave', route: '/cms/attendance', icon: 'tasks' },
      { name: 'CRM', route: '/cms/crm', icon: 'crm' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Finance', route: '/cms/finance', icon: 'finance' },
      { name: 'Payroll', route: '/cms/payroll', icon: 'payroll' },
      { name: 'Reports', route: '/cms/reports', icon: 'reports' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { name: 'Internal Chat', route: '/cms/chat', icon: 'chat' },
      { name: 'Contact Team', route: '/cms/contact-company', icon: 'chat' },
      { name: 'Meetings', route: '/cms/meetings', icon: 'meetings' },
      { name: 'Calendar', route: '/cms/calendar', icon: 'calendar' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'User Accounts', route: '/cms/users', icon: 'employees' },
      { name: 'Website Portfolio', route: '/cms/portfolio-manager', icon: 'projects' },
      { name: 'Security Audit Logs', route: '/cms/audit-logs', icon: 'settings' },
      { name: 'File Manager', route: '/cms/files', icon: 'files' },
      { name: 'Settings', route: '/cms/settings', icon: 'settings' },
    ],
  },
]

// Filter menu groups and items based on role
const menuGroups = computed(() => {
  const allowed = rolePermissions[role.value] || rolePermissions.employee

  return allMenuGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      if (allowed.includes('*')) return true
      return allowed.includes(item.route)
    })
    return { ...group, items: filteredItems }
  }).filter(group => group.items.length > 0)
})

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside
    class="sidebar"
    :class="{
      'sidebar--collapsed': collapsed,
      'sidebar--mobile-open': mobileOpen,
    }"
  >
    <!-- Header -->
    <div class="sidebar__header">
      <router-link to="/cms/dashboard" class="sidebar__brand">
        <svg class="sidebar__logo" viewBox="0 0 32 32" fill="none">
          <path d="M6 8L14 4L14 16L6 20V8Z" fill="currentColor" />
          <path d="M18 12L26 8L26 20L18 24V12Z" fill="currentColor" />
        </svg>
        <span v-if="!collapsed" class="sidebar__brand-text">Nexora Company</span>
      </router-link>
      <button class="sidebar__collapse-btn" @click="emit('toggle')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="!collapsed" d="M11 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          <path v-else d="M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="sidebar__close-btn" @click="emit('close-mobile')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <div v-for="group in menuGroups" :key="group.label" class="sidebar__group">
        <p v-if="!collapsed" class="sidebar__group-label">{{ group.label }}</p>
        <div v-else class="sidebar__group-divider"></div>

        <router-link
          v-for="item in group.items"
          :key="item.route"
          :to="item.route"
          class="sidebar__link"
          :class="{ 'sidebar__link--active': isActive(item.route) }"
          @click="emit('close-mobile')"
        >
          <span class="sidebar__icon">
            <svg v-if="item.icon === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'employees'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'clients'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'projects'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'tasks'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'crm'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'finance'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'payroll'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'reports'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'chat'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'meetings'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'calendar'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'files'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="item.icon === 'settings'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span v-if="!collapsed" class="sidebar__link-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.sidebar--collapsed {
  width: 72px;
}

/* ─── Header ─── */
.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 64px;
}
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: #ffffff;
  overflow: hidden;
}
.sidebar__logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.sidebar__brand-text {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.sidebar__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.sidebar__collapse-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.sidebar__close-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}
.sidebar__close-btn:hover {
  color: #fff;
}

/* ─── Nav ─── */
.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0.5rem;
}
.sidebar__nav::-webkit-scrollbar { width: 3px; }
.sidebar__nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }

.sidebar__group {
  margin-bottom: 0.5rem;
}
.sidebar__group-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  padding: 0.625rem 0.75rem 0.375rem;
  white-space: nowrap;
}
.sidebar__group-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0.5rem 0.75rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5625rem 0.75rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  margin-bottom: 2px;
}
.sidebar__link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
}
.sidebar__link--active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-weight: 600;
}
.sidebar__link--active .sidebar__icon {
  color: #ffffff;
}

.sidebar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.sidebar__link-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Collapsed state ─── */
.sidebar--collapsed .sidebar__header {
  justify-content: center;
  padding: 1.25rem 0.5rem;
}
.sidebar--collapsed .sidebar__collapse-btn {
  display: none;
}
.sidebar--collapsed .sidebar__link {
  justify-content: center;
  padding: 0.625rem;
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  }
  .sidebar--mobile-open {
    transform: translateX(0);
  }
  .sidebar--collapsed {
    width: 280px;
  }
  .sidebar__collapse-btn {
    display: none;
  }
  .sidebar__close-btn {
    display: flex;
  }
}
</style>
