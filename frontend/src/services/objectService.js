import api from './api';

export const objectService = {
    async getUserObjects(userId) {
        try {
            const response = await api.get(`/objects/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user objects:', error);
            throw error;
        }
    },

    async createObject(objectData) {
        try {
            const response = await api.post('/objects', objectData);
            return response.data;
        } catch (error) {
            console.error('Error creating object:', error);
            throw error;
        }
    },

    async getCategories() {
        try {
            const response = await api.get('/objects/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};
