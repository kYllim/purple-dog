import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/base.css';
import { useFavoritesStore } from './stores/favoritesStore'; // Importer le store

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
  const favoritesStore = useFavoritesStore();
  const userId = localStorage.getItem('userId');
  if (userId) {
    favoritesStore.loadFavorites(userId);
  }
  
  app.mount('#app');
});