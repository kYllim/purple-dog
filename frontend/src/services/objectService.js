import api from './api';

export const objectService = {
    async getUserObjects(userId) {
        try {
            const response = await api.get(`/objets/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user objects:', error);
            throw error;
        }
    },

    async createObject(objectData) {
        try {
            const response = await api.post('/objets', objectData);
            return response.data;
        } catch (error) {
            console.error('Error creating object:', error);
            throw error;
        }
    },

    async getCategories() {
        try {
            const response = await api.get(`/objets/categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};
