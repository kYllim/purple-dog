import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import RegisterProfessionnel from '../pages/RegisterProfessionnel.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import VerifyEmail from '../pages/VerifyEmail.vue';
import ProfileEdit from '../pages/ProfileEdit.vue';
import Error404 from '../pages/Error404.vue';
import DashboardParticulier from "../pages/particulier/Dashboard.vue";
import DashboardProfessionnel from "../pages/professionnel/Dashboard.vue";
import ProfessionnelLayout from '../layouts/ProfessionnelLayout.vue';
import ParticulierLayout from '../layouts/ParticulierLayout.vue';
import Favorite from '../pages/professionnel/Favoris.vue';
import VendreObjet from "../pages/particulier/VendreObjet.vue";
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';
import AdminUsers from '../pages/admin/Users.vue';
import FavoriteCard from '../components/cards/FavoriteCard.vue';
import HistoryCard from '../components/cards/HistoryCard.vue';
import History from '../pages/professionnel/Historique.vue';



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
    // meta: { requiresAuth: true, requiresRole: 'ADMIN' },
    meta: { requiresAuth: true, requiresRole: 'ADMIN' },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsers }
    ]
  },
  { path: '/favorites', name: 'Favorites', component: FavoriteCard },
  { path: '/history', name: 'History', component: HistoryCard },


  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 },

  { path: "/particulier/dashboard", component: DashboardParticulier, meta: { requiresAuth: true, requiresRole: 'PARTICULIER' } },
  { path: "/particulier/vendre", component: VendreObjet },


  { path: '/professionnel/dashboard',component: DashboardProfessionnel },
  { path: '/professionnel/favoris',component: Favorite },
  { path: '/professionnel/historique',component: History }


  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de navigation pour la protection des routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Initialiser l'état d'authentification depuis le localStorage
  authStore.initAuth();

  
  // Initialiser l'état d'authentification depuis le localStorage
  authStore.initAuth();
  
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Rediriger vers la page de connexion
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (to.meta.requiresRole) {
      // Vérifier le rôle de l'utilisateur
      if (authStore.userRole === to.meta.requiresRole) {
        next();
      } else {
        // Rôle incorrect, rediriger vers la page d'accueil
        next({ name: 'Home' });
      }
    } else {
      next();
    }
  } else {
    // Route publique
    next();
  }
});

export default router;
