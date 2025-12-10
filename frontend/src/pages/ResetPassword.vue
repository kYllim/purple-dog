<template>
  <div v-if="resetSuccess" class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-accent/10">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
          <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-serif text-text mb-2">Mot de passe réinitialisé !</h1>
        <p class="text-sm text-text/60 font-sans mb-6">
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        
        <router-link
          to="/connexion"
          class="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium font-sans text-white bg-accent hover:bg-accent/90 transition-all duration-200"
        >
          Se connecter
        </router-link>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-serif text-accent mb-2">Purple Dog</h1>
        <p class="text-sm text-text/60 font-sans">Nouveau mot de passe</p>
      </div>

      <AuthForm
        title="Réinitialiser le mot de passe"
        subtitle="Entrez votre nouveau mot de passe"
        submit-text="Réinitialiser"
        loading-text="Réinitialisation..."
        :initial-data="initialFormData"
        max-width="md"
        @submit="handleResetPassword"
      >
        <!-- Contenu du formulaire -->
        <template #default="{ form, errors }">
          <!-- Icon header -->
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10">
              <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          <!-- New Password -->
          <BaseInput
            v-model="form.newPassword"
            label="Nouveau mot de passe"
            :type="showPassword ? 'text' : 'password'"
            name="newPassword"
            placeholder="••••••••••"
            hint="Minimum 8 caractères"
            autocomplete="new-password"
            :required="true"
            :error="errors.newPassword"
            :icon-right="showPassword ? EyeSlashIcon : EyeIcon"
            @icon-click="showPassword = !showPassword"
          />

          <!-- Confirm New Password -->
          <BaseInput
            v-model="form.confirmPassword"
            label="Confirmer le mot de passe"
            :type="showPasswordConfirm ? 'text' : 'password'"
            name="confirmPassword"
            placeholder="••••••••••"
            autocomplete="new-password"
            :required="true"
            :error="errors.confirmPassword"
            :icon-right="showPasswordConfirm ? EyeSlashIcon : EyeIcon"
            @icon-click="showPasswordConfirm = !showPasswordConfirm"
          />
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="text-center">
            <router-link
              to="/connexion"
              class="text-sm font-medium font-sans text-accent hover:text-accent/80 inline-flex items-center gap-2 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la connexion
            </router-link>
          </div>
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthForm from '@/components/AuthForm.vue';
import BaseInput from '@/components/BaseInput.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import authService from '@/services/authService';

const router = useRouter();
const route = useRoute();
const resetSuccess = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const token = ref('');

const initialFormData = {
  newPassword: '',
  confirmPassword: ''
};

onMounted(() => {
  // Récupérer le token depuis l'URL
  token.value = route.query.token || '';
  
  if (!token.value) {
    router.push('/connexion');
  }
});

const handleResetPassword = async (formData, { setErrors, setLoading }) => {
  try {
    // Vérifier que les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({
        confirmPassword: 'Les mots de passe ne correspondent pas'
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrors({
        newPassword: 'Le mot de passe doit contenir au moins 8 caractères'
      });
      setLoading(false);
      return;
    }

    await authService.resetPassword(token.value, formData.newPassword);
    
    resetSuccess.value = true;
    
  } catch (error) {
    console.error('Erreur reset password:', error);
    if (error.response?.data?.error) {
      setErrors({
        newPassword: error.response.data.error
      });
    } else {
      setErrors({
        newPassword: 'Une erreur est survenue. Le lien a peut-être expiré.'
      });
    }
  } finally {
    setLoading(false);
  }
};
</script>
