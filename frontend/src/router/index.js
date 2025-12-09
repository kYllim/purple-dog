import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import RegisterProfessionnel from '../pages/RegisterProfessionnel.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import Error404 from '../pages/Error404.vue';
import DashboardParticulier from "../pages/particulier/Dashboard.vue";
import VendreObjet from "../pages/particulier/VendreObjet.vue";
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';

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
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard }
    ]
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 },

  { path: "/particulier/dashboard", component: DashboardParticulier },
  { path: "/particulier/vendre", component: VendreObjet },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;