import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

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
import AdminFinance from '../pages/admin/AdminFinance.vue';
import Favorite from '../components/cards/FavoriteCard.vue';
import History from '../components/cards/HistoryCard.vue';
import ObjectDetailsPage from '../pages/ObjectDetailsPage.vue';
import MyObjectsPage from '../pages/particulier/MyObjectsPage.vue';
import MyObjectsPagePro from '../pages/pro/MyObjectsPagePro.vue';
import MyAuctions from '../pages/MyAuctions.vue';
import EditObjectPage from '../pages/EditObjectPage.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: ContactPage },


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
    path: '/paiement/succes',
    name: 'PaymentSuccess',
    component: () => import('../pages/PaymentSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/paiement/annule',
    name: 'PaymentCancel',
    component: () => import('../pages/PaymentCancel.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mes-commandes',
    name: 'ClientOrders',
    component: () => import('../pages/ClientOrdersPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresRole: 'ADMIN' },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'objets', name: 'AdminObjects', component: AdminObjects },
      { path: 'finance', name: 'AdminFinance', component: AdminFinance }
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
    path: '/mes-favoris',
    name: 'Favorites',
    component: () => import('../pages/FavoritesPage.vue'),
    meta: { requiresAuth: true }
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
    path: "/particulier/mes-ventes",
    name: "MySalesParticulier",
    component: () => import('../pages/particulier/MySalesPage.vue'),
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

  {
    path: "/objets/modifier/:id",
    name: "EditObject",
    component: EditObjectPage,
    meta: { requiresAuth: true }
  },
  { path: '/objets/:id', name: 'ObjectDetails', component: ObjectDetailsPage },
  { path: '/encheres/:id', name: 'AuctionDetails', component: ObjectDetailsPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();


  authStore.initAuth();


  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {

      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (to.meta.requiresRole) {

      if (authStore.userRole === to.meta.requiresRole) {
        next();
      } else {

        next({ name: 'Home' });
      }
    } else {
      next();
    }
  } else {

    next();
  }
});

export default router;
