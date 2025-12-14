<template>
  <div class="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-[#C5A059]/10">
        <!-- Loading State -->
        <div v-if="loading" class="py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#C5A059]/10 mb-4">
            <svg class="animate-spin h-8 w-8 text-[#C5A059]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[#0F172A] mb-2 uppercase tracking-wider">Vérification en cours...</h1>
          <p class="text-sm text-gray-600">
            Veuillez patienter pendant que nous vérifions votre email.
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="py-4">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#C5A059]/10 mb-4">
            <svg class="h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-[#0F172A] mb-2 uppercase tracking-wider">Email vérifié !</h1>
          <p class="text-sm text-gray-600 mb-6">
            Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de <span class="font-bold text-[#C5A059]">PurpleDog</span>.
          </p>
          
          <router-link
            to="/connexion"
            class="inline-flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#B08F4A] transition-all duration-200"
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
          
          <h1 class="text-2xl font-bold text-[#0F172A] mb-2 uppercase tracking-wider">Erreur de vérification</h1>
          <p class="text-sm text-gray-600 mb-6">
            {{ errorMessage }}
          </p>
          
          <div class="flex flex-col gap-3">
            <router-link
              to="/connexion"
              class="inline-flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#B08F4A] transition-all duration-200"
            >
              Retour à la connexion
            </router-link>
            
            <router-link
              to="/"
              class="inline-flex justify-center py-3 px-8 border border-[#C5A059]/30 rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-200"
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
  // Récupérer le token depuis l'URL (soit dans params soit dans query)
  const token = route.params.token || route.query.token;
  
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
