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
            const config = {};
            if (objectData instanceof FormData) {
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }
            const response = await api.post('/objets', objectData, config);
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
    },

    async getObjectById(id) {
        try {
            const response = await api.get(`/objets/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching object:', error);
            throw error;
        }
    },

    async updateObject(id, objectData) {
        try {
            const config = {};
            if (objectData instanceof FormData) {
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }
            const response = await api.put(`/objets/${id}`, objectData, config);
            return response.data;
        } catch (error) {
            console.error('Error updating object:', error);
            throw error;
        }
    }
};
