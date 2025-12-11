import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getUser(),
        token: authService.getToken(),
        isAuthenticated: authService.isAuthenticated(),
    }),

    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        currentUser: (state) => state.user,
        userRole: (state) => state.user?.role || null,
        isAdmin: (state) => state.user?.role === 'ADMIN',
        isPro: (state) => state.user?.role === 'PRO',
        isParticulier: (state) => state.user?.role === 'PARTICULIER',
    },

    actions: {
        async login(credentials) {
            try {
                const response = await authService.login(credentials);

            
                const userData = {
                    userId: response.userId,
                    role: response.role,
                    email: credentials.email
                };

              
                authService.saveAuthData(response.token, userData);

                this.token = response.token;
                this.user = userData;
                this.isAuthenticated = true;

                return response;
            } catch (error) {
                throw error;
            }
        },

        async registerIndividual(data) {
            try {
                const response = await authService.registerIndividual(data);

   
                authService.saveAuthData(response.token, {
                    userId: response.userId,
                    role: 'PARTICULIER',
                });

                this.token = response.token;
                this.user = { userId: response.userId, role: 'PARTICULIER' };
                this.isAuthenticated = true;

                return response;
            } catch (error) {
                throw error;
            }
        },

        async registerPro(data) {
            try {
                const response = await authService.registerPro(data);

  
                authService.saveAuthData(response.token, {
                    userId: response.userId,
                    role: 'PRO',
                });

                this.token = response.token;
                this.user = { userId: response.userId, role: 'PRO' };
                this.isAuthenticated = true;

                return response;
            } catch (error) {
                throw error;
            }
        },

        logout() {
            authService.logout();
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },


        initAuth() {
            this.user = authService.getUser();
            this.token = authService.getToken();
            this.isAuthenticated = authService.isAuthenticated();
        },
    },
});