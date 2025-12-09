import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import RegisterProfessionnel from '../pages/RegisterProfessionnel.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import ProfileEdit from '../pages/ProfileEdit.vue';
import Error404 from '../pages/Error404.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';

import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'Home', component: Home },

  // Routes d'authentification
  { path: '/connexion', name: 'Login', component: Login },
  { path: '/login', redirect: '/connexion' },

  { path: '/inscription/particulier', name: 'RegisterParticulier', component: Register },
  { path: '/inscription/professionnel', name: 'RegisterProfessionnel', component: RegisterProfessionnel },
  { path: '/register', redirect: '/inscription/particulier' },

  { path: '/mot-de-passe-oublie', name: 'ForgotPassword', component: ForgotPassword },

  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: ProfileEdit,
    meta: { requiresAuth: true }
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard }
    ]
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/connexion');
  } else if (requiresAuth && requiredRoles && !requiredRoles.includes(authStore.userRole)) {
    next('/'); // Unauthorized role
  } else {
    next();
  }
});

export default router;