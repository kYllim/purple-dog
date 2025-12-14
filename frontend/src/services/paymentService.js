import api from './api';

export const paymentService = {
    async createCheckoutSession(objetId) {
        try {
            const response = await api.post('/paiement/create-checkout-session', { objetId });
            return response.data; // { url: '...' }
        } catch (error) {
            console.error('Payment Error:', error);
            throw error;
        }
    },

    async confirmPayment(objetId, sessionId) {
        try {
            const response = await api.post('/paiement/success', { objetId, sessionId });
            return response.data;
        } catch (error) {
            console.error('Confirmation Error:', error);
            throw error;
        }
    },

    async getMyOrders() {
        try {
            const response = await api.get('/paiement/commandes');
            return response.data;
        } catch (error) {
            console.error('Fetch Orders Error:', error);
            throw error;
        }
    }
};
