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
  },

  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        
        // Sauvegarder le token et les infos utilisateur
        authService.saveAuthData(response.token, {
          role: response.role,
        });

        this.token = response.token;
        this.user = { role: response.role };
        this.isAuthenticated = true;

        return response;
      } catch (error) {
        throw error;
      }
    },

    async registerIndividual(data) {
      try {
        const response = await authService.registerIndividual(data);
        
        // Sauvegarder le token et les infos utilisateur
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
        
        // Sauvegarder le token et les infos utilisateur
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

    // Initialiser le store depuis le localStorage
    initAuth() {
      this.user = authService.getUser();
      this.token = authService.getToken();
      this.isAuthenticated = authService.isAuthenticated();
    },
  },
});
