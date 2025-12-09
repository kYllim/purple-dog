import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Error404 from '../pages/Error404.vue';
import Favorite from '../components/cards/FavoriteCard.vue';
import History from '../components/cards/HistoryCard.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/favorites', name: 'Favorites', component: Favorite },
  { path: '/history', name: 'History', component: History },


  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
