import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Error404 from '../pages/Error404.vue';
import DashboardParticulier from "../pages/particulier/Dashboard.vue";
import VendreObjet from "../pages/particulier/VendreObjet.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 },

  { path: "/particulier/dashboard", component: DashboardParticulier },
  { path: "/particulier/vendre", component: VendreObjet },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
