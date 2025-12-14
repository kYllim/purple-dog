import api from './api';

export const favoritesService = {
    async getFavorites() {
        try {
            const response = await api.get('/favoris');
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    },
    async addFavorite(objetId) {
        try {
            await api.post('/favoris', { objetId });
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },
    async removeFavorite(objetId) {
        try {
            await api.delete(`/favoris/${objetId}`);
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },
    async isFavorite(objetId) {
        try {
            const response = await api.get(`/favoris/${objetId}/check`);
            return response.data.isFavorite;
        } catch (error) {
            return false;
        }
    }
};
