import api from './api';

const authService = {
  // Connexion
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  // Inscription Particulier
  async registerIndividual(data) {
    const response = await api.post('/auth/register/individual', {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      age: data.age || 18, // Valeur par défaut 18 ans
      address: data.address_line1 || '',
      city: data.city || '',
      zip_code: data.postal_code || '',
      country: data.country || 'France',
    });
    return response.data;
  },

  // Inscription Professionnel
  async registerPro(data) {
    const response = await api.post('/auth/register/pro', {
      email: data.email,
      password: data.password,
      company_name: data.company_name,
      siret: data.siret,
      kbis_url: data.official_document || '', // Base64 ou URL
      site_web: data.website || '',
      specialites: Array.isArray(data.specialties) 
        ? data.specialties.join(', ') 
        : data.specialties || '',
      address: data.address_line1 || '',
      city: data.city || '',
      zip_code: data.postal_code || '',
      country: data.country || 'France',
    });
    return response.data;
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Récupérer le token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Sauvegarder le token et les infos utilisateur
  saveAuthData(token, user) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Récupérer les infos utilisateur
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Demander réinitialisation mot de passe
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Réinitialiser mot de passe
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  // Vérifier l'email
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
};

export default authService;
