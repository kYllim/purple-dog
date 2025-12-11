import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteIds: new Set(),
  }),

  getters: {
    isFavorite: (state) => (objetId) => {
      return state.favoriteIds.has(objetId);
    },
  },

  actions: {
    async loadFavorites(userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/favorites/${userId}`);
        if (response.ok) {
          const favorites = await response.json();
          this.favoriteIds = new Set(favorites.map(f => f.id));
        }
      } catch (err) {
        console.error('Erreur chargement favoris:', err);
      }
    },

    async toggleFavorite(userId, objetId) {
      try {
        const response = await fetch('http://localhost:3000/api/favorites/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            utilisateur_id: userId,
            objet_id: objetId
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.isFavorite) {
            this.favoriteIds.add(objetId);
          } else {
            this.favoriteIds.delete(objetId);
          }
          
          return result.isFavorite;
        }
      } catch (err) {
        console.error('Erreur toggle favori:', err);
        throw err;
      }
    },

    addFavorite(objetId) {
      this.favoriteIds.add(objetId);
    },

    removeFavorite(objetId) {
      this.favoriteIds.delete(objetId);
    },
  },
});