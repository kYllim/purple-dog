import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; // Fixed import path

import Home from '../pages/Home.vue';
import ContactPage from '../pages/ContactPage.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import RegisterProfessionnel from '../pages/RegisterProfessionnel.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import VerifyEmail from '../pages/VerifyEmail.vue';
import EmailSent from '../pages/EmailSent.vue';
import ProfileEdit from '../pages/ProfileEdit.vue';
import Error404 from '../pages/Error404.vue';
import VendreObjet from "../pages/particulier/VendreObjet.vue";
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';
import AdminUsers from '../pages/admin/Users.vue';
import AdminObjects from '../pages/admin/AdminObjects.vue';
import Favorite from '../components/cards/FavoriteCard.vue';
import History from '../components/cards/HistoryCard.vue';
import ObjectDetailsPage from '../pages/ObjectDetailsPage.vue';
import MyObjectsPage from '../pages/particulier/MyObjectsPage.vue';
import MyObjectsPagePro from '../pages/pro/MyObjectsPagePro.vue';
import MyAuctions from '../pages/MyAuctions.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: ContactPage },

  // Routes d'authentification
  { path: '/connexion', name: 'Login', component: Login },
  { path: '/login', redirect: '/connexion' },

  { path: '/inscription/particulier', name: 'RegisterParticulier', component: Register },
  { path: '/inscription/professionnel', name: 'RegisterProfessionnel', component: RegisterProfessionnel },
  { path: '/register', redirect: '/inscription/particulier' },

  { path: '/mot-de-passe-oublie', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password/:token?', name: 'ResetPassword', component: ResetPassword },
  { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail },
  { path: '/email-sent', name: 'EmailSent', component: EmailSent },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresRole: 'ADMIN' },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'objets', name: 'AdminObjects', component: AdminObjects }
    ]
  },

  {
    path: "/pro/vendre",
    component: VendreObjet,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },
  {
    path: "/pro/mes-objets",
    name: "MyObjectsPro",
    component: MyObjectsPagePro,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorite,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },

  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },

  {
    path: '/catalogue',
    name: 'Catalogue',
    component: () => import('../pages/Catalogue.vue')
  },
  {
    path: '/catalogue/:id',
    name: 'ObjectDetail',
    component: () => import('../pages/ObjectDetailsPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },

  {
    path: '/mes-encheres',
    name: 'MyAuctions',
    component: MyAuctions,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },




  {
    path: "/particulier/vendre",
    component: VendreObjet,
    meta: { requiresAuth: true, requiresRole: 'PARTICULIER' }
  },
  {
    path: "/particulier/mes-objets",
    name: "MyObjects",
    component: MyObjectsPage,
    meta: { requiresAuth: true, requiresRole: 'PARTICULIER' }
  },
  {
    path: "/particulier/profil",
    name: "ProfileEditParticulier",
    component: ProfileEdit,
    meta: { requiresAuth: true, requiresRole: 'PARTICULIER' }
  },
  {
    path: "/pro/profil",
    name: "ProfileEditPro",
    component: ProfileEdit,
    meta: { requiresAuth: true, requiresRole: 'PRO' }
  },

  { path: '/objets/:id', name: 'ObjectDetails', component: ObjectDetailsPage },
  { path: '/encheres/:id', name: 'AuctionDetails', component: ObjectDetailsPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 },
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
