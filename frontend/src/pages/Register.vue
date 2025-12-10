<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-serif text-accent mb-2">Purple Dog</h1>
        <p class="text-sm text-text/60 font-sans">Inscription Particulier</p>
      </div>

      <AuthForm
        :title="`Inscription - Étape ${currentStep}/4`"
        :subtitle="stepSubtitles[currentStep - 1]"
        :submit-text="currentStep === 4 ? 'S\'inscrire' : 'Suivant'"
        loading-text="Inscription en cours..."
        :initial-data="initialFormData"
        max-width="2xl"
        @submit="handleStepSubmit"
      >
        <template #default="{ form, errors }">
          
          <!-- Barre de progression -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-2">
              <span v-for="step in 4" :key="step" class="text-sm font-medium font-sans" :class="currentStep >= step ? 'text-accent' : 'text-text/30'">
                Étape {{ step }}
              </span>
            </div>
            <div class="w-full bg-text/10 rounded-full h-2">
              <div class="bg-accent h-2 rounded-full transition-all duration-300" :style="{ width: `${(currentStep / 4) * 100}%` }"></div>
            </div>
          </div>

          <!-- ÉTAPE 1 : Informations personnelles + Photo -->
          <div v-if="currentStep === 1" class="space-y-6">
            <BaseFileUpload
              v-model="form.profile_photo"
              label="Photo de profil (optionnel)"
              name="profile_photo"
              accept="image/*"
              :maxSizeMB="5"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.first_name"
                label="Prénom"
                name="first_name"
                placeholder="Jean"
                autocomplete="given-name"
                :required="true"
                :error="errors.first_name"
              />

              <BaseInput
                v-model="form.last_name"
                label="Nom"
                name="last_name"
                placeholder="Dupont"
                autocomplete="family-name"
                :required="true"
                :error="errors.last_name"
              />
            </div>

            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              name="email"
              placeholder="jean.dupont@email.com"
              autocomplete="email"
              :required="true"
              :error="errors.email"
            />
          </div>

          <!-- ÉTAPE 2 : Adresse complète -->
          <div v-if="currentStep === 2" class="space-y-6">
            <BaseInput
              v-model="form.address_line1"
              label="Adresse postale"
              name="address_line1"
              placeholder="12 rue de la République"
              autocomplete="address-line1"
              :required="true"
              :error="errors.address_line1"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.postal_code"
                label="Code postal"
                name="postal_code"
                placeholder="75001"
                autocomplete="postal-code"
                :required="true"
                :error="errors.postal_code"
              />

              <BaseInput
                v-model="form.city"
                label="Ville"
                name="city"
                placeholder="Paris"
                autocomplete="address-level2"
                :required="true"
                :error="errors.city"
              />
            </div>
          </div>

          <!-- ÉTAPE 3 : Mots de passe -->
          <div v-if="currentStep === 3" class="space-y-6">
            <BaseInput
              v-model="form.password"
              label="Mot de passe"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="••••••••••"
              hint="Minimum 8 caractères"
              autocomplete="new-password"
              :required="true"
              :error="errors.password"
              :icon-right="showPassword ? EyeSlashIcon : EyeIcon"
              @icon-click="showPassword = !showPassword"
            />

            <BaseInput
              v-model="form.password_confirmation"
              label="Confirmer le mot de passe"
              :type="showPasswordConfirm ? 'text' : 'password'"
              name="password_confirmation"
              placeholder="••••••••••"
              autocomplete="new-password"
              :required="true"
              :error="errors.password_confirmation"
              :icon-right="showPasswordConfirm ? EyeSlashIcon : EyeIcon"
              @icon-click="showPasswordConfirm = !showPasswordConfirm"
            />
          </div>

          <!-- ÉTAPE 4 : Acceptations -->
          <div v-if="currentStep === 4" class="space-y-6">
            <BaseCheckbox
              v-model="form.is_over_18"
              label="Je certifie avoir plus de 18 ans"
              name="is_over_18"
              :required="true"
              :error="errors.is_over_18"
            />

            <BaseCheckbox
              v-model="form.newsletter_subscribed"
              label="Je souhaite recevoir la newsletter"
              name="newsletter_subscribed"
            />

            <BaseCheckbox
              v-model="form.rgpd_accepted"
              label="J'accepte la politique de confidentialité et le RGPD"
              name="rgpd_accepted"
              :required="true"
              link="/politique-confidentialite"
              linkText="Lire la politique"
              :error="errors.rgpd_accepted"
            />
          </div>

          <!-- Bouton Précédent (sauf étape 1) -->
          <div v-if="currentStep > 1" class="mt-6">
            <button
              type="button"
              @click="previousStep"
              class="w-full flex items-center justify-center py-3 px-4 border border-text/20 rounded-lg shadow-sm text-sm font-medium font-sans text-text bg-white hover:bg-text/5 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>
          </div>
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="text-center">
            <p class="text-sm text-text/60 font-sans">
              Déjà un compte ?
              <router-link to="/connexion" class="font-medium text-accent hover:text-accent/80 transition-colors">
                Se connecter
              </router-link>
            </p>
          </div>
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseCheckbox from '../components/BaseCheckbox.vue';
import BaseFileUpload from '../components/BaseFileUpload.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const currentStep = ref(1);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const stepSubtitles = [
  'Vos informations personnelles',
  'Votre adresse',
  'Sécurisez votre compte',
  'Dernières validations'
];

const initialFormData = {
  profile_photo: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  postal_code: '',
  city: '',
  country: 'France',
  password: '',
  password_confirmation: '',
  is_over_18: false,
  newsletter_subscribed: false,
  rgpd_accepted: false
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Convertir un fichier en base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleStepSubmit = async (formData, { setErrors, setLoading }) => {
  // Validation par étape
  const stepErrors = {};

  if (currentStep.value === 1) {
    if (!formData.first_name) stepErrors.first_name = 'Le prénom est obligatoire';
    if (!formData.last_name) stepErrors.last_name = 'Le nom est obligatoire';
    if (!formData.email) stepErrors.email = 'L\'email est obligatoire';
  } else if (currentStep.value === 2) {
    if (!formData.address_line1) stepErrors.address_line1 = 'L\'adresse est obligatoire';
    if (!formData.postal_code) stepErrors.postal_code = 'Le code postal est obligatoire';
    if (!formData.city) stepErrors.city = 'La ville est obligatoire';
  } else if (currentStep.value === 3) {
    if (!formData.password) stepErrors.password = 'Le mot de passe est obligatoire';
    if (formData.password.length < 8) stepErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.password_confirmation) {
      stepErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
  } else if (currentStep.value === 4) {
    if (!formData.is_over_18) stepErrors.is_over_18 = 'Vous devez avoir plus de 18 ans';
    if (!formData.rgpd_accepted) stepErrors.rgpd_accepted = 'Vous devez accepter la politique RGPD';
  }

  // Si erreurs, les afficher
  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors);
    setLoading(false);
    return;
  }

  // Si pas la dernière étape, passer à la suivante
  if (currentStep.value < 4) {
    currentStep.value++;
    setLoading(false);
    return;
  }

  // Dernière étape : soumettre le formulaire
  try {
    // Convertir la photo de profil en base64 si elle existe
    let profilePhotoBase64 = null;
    if (formData.profile_photo) {
      profilePhotoBase64 = await fileToBase64(formData.profile_photo);
    }

    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      age: formData.is_over_18 ? 18 : null, // Valeur par défaut 18 ans si cochée
      address_line1: formData.address_line1,
      postal_code: formData.postal_code,
      city: formData.city,
      country: formData.country,
      profile_photo: profilePhotoBase64,
    };

    const response = await authStore.registerIndividual(dataToSend);
    
    console.log('Inscription Particulier réussie:', response);
    
    // Redirection vers la page d'accueil
    router.push('/');
    
  } catch (error) {
    console.error('Erreur inscription:', error);
    if (error.response?.data?.error) {
      if (typeof error.response.data.error === 'string') {
        setErrors({ email: error.response.data.error });
      } else {
        setErrors(error.response.data.error);
      }
    } else {
      setErrors({ email: 'Une erreur est survenue lors de l\'inscription' });
    }
  } finally {
    setLoading(false);
  }
};
</script>
