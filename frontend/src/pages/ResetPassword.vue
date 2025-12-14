<template>
  <div v-if="resetSuccess" class="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-[#C5A059]/10">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#C5A059]/10 mb-4">
          <svg class="h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-[#0F172A] mb-2 uppercase tracking-wider">Mot de passe réinitialisé !</h1>
        <p class="text-sm text-gray-600 mb-6">
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
        </p>
        
        <router-link
          to="/connexion"
          class="inline-flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#B08F4A] transition-all duration-200"
        >
          Se connecter
        </router-link>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-[#0F172A] mb-2 uppercase tracking-tighter">
          Purple<span class="text-[#C5A059]">Dog</span>
        </h1>
        <p class="text-sm text-gray-600">Nouveau mot de passe</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-[#C5A059]/10">
        <!-- Icon header -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#C5A059]/10">
            <svg class="h-8 w-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-[#0F172A] text-center mb-2 uppercase tracking-wider">
          Réinitialiser le mot de passe
        </h2>
        <p class="text-sm text-gray-600 text-center mb-6">
          Entrez votre nouveau mot de passe
        </p>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <!-- New Password -->
          <BaseInput
            v-model="form.newPassword"
            label="Nouveau mot de passe"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••••"
            :required="true"
            :error="errors.newPassword"
          />

          <!-- Confirm Password -->
          <BaseInput
            v-model="form.confirmPassword"
            label="Confirmer le mot de passe"
            :type="showPasswordConfirm ? 'text' : 'password'"
            placeholder="••••••••••"
            :required="true"
            :error="errors.confirmPassword"
          />

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <BaseButton 
            type="submit" 
            class="w-full py-3 text-sm shadow-xl"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
          </BaseButton>

          <!-- Back to Login -->
          <div class="text-center mt-4">
            <router-link
              to="/connexion"
              class="text-sm font-bold text-[#C5A059] hover:text-[#B08F4A] inline-flex items-center gap-2 transition-colors uppercase tracking-widest"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la connexion
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import authService from '../services/authService';

const router = useRouter();
const route = useRoute();
const resetSuccess = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const token = ref('');

const form = reactive({
  newPassword: '',
  confirmPassword: ''
});

const errors = reactive({
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  // Récupérer le token depuis l'URL (soit dans params soit dans query)
  token.value = route.params.token || route.query.token || '';
  
  if (!token.value) {
    router.push('/connexion');
  }
});

const handleResetPassword = async () => {
  // Reset errors
  errors.newPassword = '';
  errors.confirmPassword = '';
  errorMessage.value = '';

  // Validation
  if (!form.newPassword) {
    errors.newPassword = 'Le mot de passe est requis';
    return;
  }

  if (form.newPassword.length < 8) {
    errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    return;
  }

  isLoading.value = true;

  try {
    await authService.resetPassword(token.value, form.newPassword);
    resetSuccess.value = true;
  } catch (error) {
    console.error('Erreur reset password:', error);
    errorMessage.value = error.response?.data?.error || 'Une erreur est survenue. Le lien a peut-être expiré.';
  } finally {
    isLoading.value = false;
  }
};
</script>
