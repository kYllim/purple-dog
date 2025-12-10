<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-accent/10">
        <!-- Loading State -->
        <div v-if="loading" class="py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
            <svg class="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-serif text-text mb-2">Vérification en cours...</h1>
          <p class="text-sm text-text/60 font-sans">
            Veuillez patienter pendant que nous vérifions votre email.
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="py-4">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
            <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-2xl font-serif text-text mb-2">Email vérifié !</h1>
          <p class="text-sm text-text/60 font-sans mb-6">
            Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de Purple Dog.
          </p>
          
          <router-link
            to="/connexion"
            class="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium font-sans text-white bg-accent hover:bg-accent/90 transition-all duration-200"
          >
            Se connecter
          </router-link>
        </div>

        <!-- Error State -->
        <div v-else class="py-4">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 class="text-2xl font-serif text-text mb-2">Erreur de vérification</h1>
          <p class="text-sm text-text/60 font-sans mb-6">
            {{ errorMessage }}
          </p>
          
          <div class="flex flex-col gap-3">
            <router-link
              to="/connexion"
              class="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium font-sans text-white bg-accent hover:bg-accent/90 transition-all duration-200"
            >
              Retour à la connexion
            </router-link>
            
            <router-link
              to="/"
              class="inline-flex justify-center py-2.5 px-5 border border-accent/30 rounded-lg shadow-sm text-sm font-medium font-sans text-accent hover:bg-accent/5 transition-all duration-200"
            >
              Retour à l'accueil
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '../services/authService';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  // Récupérer le token depuis l'URL
  const token = route.query.token;
  
  if (!token) {
    loading.value = false;
    errorMessage.value = 'Token de vérification manquant. Le lien semble invalide.';
    return;
  }

  try {
    await authService.verifyEmail(token);
    loading.value = false;
    success.value = true;
  } catch (error) {
    console.error('Erreur vérification email:', error);
    loading.value = false;
    success.value = false;
    
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = 'Une erreur est survenue lors de la vérification. Le lien a peut-être expiré.';
    }
  }
});
</script>
