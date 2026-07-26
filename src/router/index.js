import { createRouter, createWebHistory } from 'vue-router'

// ─── Public website routes (UNCHANGED) ───
const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'AC Company — Building Digital Solutions for Tomorrow' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: 'About — AC Company' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/ServicesPage.vue'),
    meta: { title: 'Services — AC Company' },
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/pages/PortfolioPage.vue'),
    meta: { title: 'Portfolio — AC Company' },
  },
  {
    path: '/portfolio/:slug',
    name: 'case-study',
    component: () => import('@/pages/CaseStudyPage.vue'),
    meta: { title: 'Case Study — AC Company' },
  },
  {
    path: '/industries',
    name: 'industries',
    component: () => import('@/pages/IndustriesPage.vue'),
    meta: { title: 'Industries — AC Company' },
  },
  {
    path: '/testimonials',
    name: 'testimonials',
    component: () => import('@/pages/TestimonialsPage.vue'),
    meta: { title: 'Testimonials — AC Company' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/BlogPage.vue'),
    meta: { title: 'Blog — AC Company' },
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/pages/BlogPostPage.vue'),
    meta: { title: 'Blog — AC Company' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
    meta: { title: 'Contact — AC Company' },
  },
]

// ─── CMS routes ───
const cmsRoutes = [
  {
    path: '/cms',
    name: 'cms-login',
    component: () => import('@/cms/pages/CmsLogin.vue'),
    meta: { title: 'Sign In — AC CMS', isCms: true },
  },
  {
    path: '/cms',
    component: () => import('@/cms/layouts/CmsLayout.vue'),
    meta: { isCms: true, requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'cms-dashboard', component: () => import('@/cms/pages/CmsDashboard.vue'), meta: { title: 'Dashboard — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'users', name: 'cms-users', component: () => import('@/cms/pages/CmsUserManagement.vue'), meta: { title: 'User Accounts — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'attendance', name: 'cms-attendance', component: () => import('@/cms/pages/CmsAttendance.vue'), meta: { title: 'Attendance & Leave — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'audit-logs', name: 'cms-audit-logs', component: () => import('@/cms/pages/CmsAuditLogs.vue'), meta: { title: 'Audit Logs — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'portfolio-manager', name: 'cms-portfolio-manager', component: () => import('@/cms/pages/CmsPortfolioManager.vue'), meta: { title: 'Website Portfolio — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'employees', name: 'cms-employees', component: () => import('@/cms/pages/CmsEmployees.vue'), meta: { title: 'Employees — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'clients', name: 'cms-clients', component: () => import('@/cms/pages/CmsClients.vue'), meta: { title: 'Clients — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'projects', name: 'cms-projects', component: () => import('@/cms/pages/CmsProjects.vue'), meta: { title: 'Projects — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'tasks', name: 'cms-tasks', component: () => import('@/cms/pages/CmsTasks.vue'), meta: { title: 'Tasks — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'finance', name: 'cms-finance', component: () => import('@/cms/pages/CmsFinance.vue'), meta: { title: 'Finance — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'payroll', name: 'cms-payroll', component: () => import('@/cms/pages/CmsPayroll.vue'), meta: { title: 'Payroll — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'meetings', name: 'cms-meetings', component: () => import('@/cms/pages/CmsMeetings.vue'), meta: { title: 'Meetings — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'chat', name: 'cms-chat', component: () => import('@/cms/pages/CmsChat.vue'), meta: { title: 'Chat — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'contact-company', name: 'cms-client-contact', component: () => import('@/cms/pages/CmsClientContact.vue'), meta: { title: 'Contact Company — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'calendar', name: 'cms-calendar', component: () => import('@/cms/pages/CmsCalendar.vue'), meta: { title: 'Calendar — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'crm', name: 'cms-crm', component: () => import('@/cms/pages/CmsCrm.vue'), meta: { title: 'CRM — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'files', name: 'cms-files', component: () => import('@/cms/pages/CmsFiles.vue'), meta: { title: 'File Manager — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'reports', name: 'cms-reports', component: () => import('@/cms/pages/CmsReports.vue'), meta: { title: 'Reports — AC CMS', isCms: true, requiresAuth: true } },
      { path: 'settings', name: 'cms-settings', component: () => import('@/cms/pages/CmsSettings.vue'), meta: { title: 'Settings — AC CMS', isCms: true, requiresAuth: true } },
    ],
  },
]

// ─── Catch-all ───
const catchAll = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404 — AC Company' },
  },
]

const routes = [...publicRoutes, ...cmsRoutes, ...catchAll]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { top: 0 }
  },
})

// Navigation guard for CMS auth & RBAC permissions
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('cms_access_token')
    const userRaw = localStorage.getItem('cms_user')

    if (!token || !userRaw) {
      return next({ name: 'cms-login' })
    }

    try {
      const user = JSON.parse(userRaw)
      const userRole = user.role || 'employee'

      const rolePermissions = {
        super_admin: ['*'],
        admin: ['*'],
        manager: ['/cms/dashboard', '/cms/projects', '/cms/tasks', '/cms/crm', '/cms/meetings', '/cms/chat', '/cms/calendar', '/cms/files', '/cms/attendance'],
        hr: ['/cms/dashboard', '/cms/employees', '/cms/payroll', '/cms/meetings', '/cms/chat', '/cms/calendar', '/cms/settings', '/cms/attendance'],
        accountant: ['/cms/dashboard', '/cms/finance', '/cms/payroll', '/cms/reports', '/cms/clients'],
        employee: ['/cms/dashboard', '/cms/tasks', '/cms/projects', '/cms/chat', '/cms/meetings', '/cms/calendar', '/cms/files', '/cms/attendance'],
        client: ['/cms/dashboard', '/cms/projects', '/cms/meetings', '/cms/contact-company', '/cms/files'],
      }

      const allowed = rolePermissions[userRole] || rolePermissions.employee
      if (!allowed.includes('*') && !allowed.includes(to.path) && to.path !== '/cms') {
        return next({ name: 'cms-dashboard' })
      }
    } catch {
      return next({ name: 'cms-login' })
    }
  }

  // If already authenticated and visiting /cms login page, redirect to dashboard
  if (to.name === 'cms-login') {
    const token = localStorage.getItem('cms_access_token')
    if (token) {
      return next({ name: 'cms-dashboard' })
    }
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'AC Company'
})

export default router
