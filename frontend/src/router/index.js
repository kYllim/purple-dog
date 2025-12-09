import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Error404 from '../pages/Error404.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  {
    path: '/admin',
    component: AdminLayout,
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

export default router;
