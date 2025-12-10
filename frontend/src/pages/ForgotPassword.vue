<template>
  <div v-if="emailSent" class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-accent/10">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
          <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-serif text-text mb-2">Email envoyé !</h1>
        <p class="text-sm text-text/60 font-sans mb-6">
          Si un compte existe avec l'adresse <strong class="text-accent">{{ sentEmail }}</strong>, 
          vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
        </p>
        
        <p class="text-xs text-text/40 font-sans mb-6">
          Le lien expire dans 60 minutes.
        </p>
        
        <router-link
          to="/connexion"
          class="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium font-sans text-white bg-accent hover:bg-accent/90 transition-all duration-200"
        >
          Retour à la connexion
        </router-link>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-serif text-accent mb-2">Purple Dog</h1>
        <p class="text-sm text-text/60 font-sans">Réinitialisation du mot de passe</p>
      </div>

      <AuthForm
        title="Mot de passe oublié ?"
        subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
        submit-text="Envoyer le lien"
        loading-text="Envoi en cours..."
        :initial-data="initialFormData"
        max-width="md"
        @submit="handleForgotPassword"
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

          <!-- Email -->
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            name="email"
            placeholder="votre@email.com"
            autocomplete="email"
            :required="true"
            :error="errors.email"
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
import { ref } from 'vue';
import AuthForm from '../components/AuthForm.vue';
import BaseInput from '../components/BaseInput.vue';

const emailSent = ref(false);
const sentEmail = ref('');

const initialFormData = {
  email: ''
};

const handleForgotPassword = async (formData, { setErrors, setLoading }) => {
  try {
    await authService.forgotPassword(formData.email);
    
    sentEmail.value = formData.email;
    emailSent.value = true;
    
  } catch (error) {
    console.error('Erreur forgot password:', error);
    if (error.response?.data?.error) {
      setErrors({
        email: error.response.data.error
      });
    } else {
      setErrors({
        email: 'Une erreur est survenue. Veuillez réessayer.'
      });
    }
  } finally {
    setLoading(false);
  }
};
</script>
