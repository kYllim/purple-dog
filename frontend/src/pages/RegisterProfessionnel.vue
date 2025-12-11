<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-3xl">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-serif text-accent mb-2">Purple Dog</h1>
        <p class="text-sm text-text/60 font-sans">Inscription Professionnel</p>
      </div>

      <AuthForm
        :title="`Inscription - Étape ${currentStep}/4`"
        :subtitle="stepSubtitles[currentStep - 1]"
        :submit-text="currentStep === 4 ? 'S\'inscrire' : 'Suivant'"
        loading-text="Inscription en cours..."
        :initial-data="initialFormData"
        max-width="3xl"
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

          <!-- ÉTAPE 1 : Informations personnelles -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.first_name"
                label="Prénom"
                name="first_name"
                :required="true"
                :error="errors.first_name"
              />
              <BaseInput
                v-model="form.last_name"
                label="Nom"
                name="last_name"
                :required="true"
                :error="errors.last_name"
              />
            </div>

            <BaseInput
              v-model="form.email"
              label="Email professionnel"
              type="email"
              name="email"
              placeholder="contact@entreprise.com"
              :required="true"
              :error="errors.email"
            />


            <BaseInput
              v-model="form.password"
              label="Mot de passe"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="••••••••••"
              hint="Minimum 8 caractères"
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
              :required="true"
              :error="errors.password_confirmation"
              :icon-right="showPasswordConfirm ? EyeSlashIcon : EyeIcon"
              @icon-click="showPasswordConfirm = !showPasswordConfirm"
            />
          </div>

          <!-- ÉTAPE 2 : Informations entreprise -->
          <div v-if="currentStep === 2" class="space-y-6">
            <BaseInput
              v-model="form.company_name"
              label="Dénomination de l'entreprise"
              name="company_name"
              placeholder="Nom de l'entreprise"
              :required="true"
              :error="errors.company_name"
            />

            <BaseInput
              v-model="form.siret"
              label="Numéro SIRET"
              name="siret"
              placeholder="123 456 789 00012"
              hint="14 chiffres"
              :required="true"
              :error="errors.siret"
              @input="formatSiret"
            />

            <BaseFileUpload
              v-model="form.official_document"
              label="Document officiel (K-Bis, avis de situation INSEE)"
              name="official_document"
              accept=".pdf,.jpg,.jpeg,.png"
              :maxSizeMB="10"
              :required="true"
              :error="errors.official_document"
            />

            <BaseInput
              v-model="form.address_line1"
              label="Adresse Postale"
              name="address_line1"
              placeholder="12 rue de la République"
              :required="true"
              :error="errors.address_line1"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.postal_code"
                label="Code postal"
                name="postal_code"
                placeholder="75001"
                :required="true"
                :error="errors.postal_code"
              />
              <BaseInput
                v-model="form.city"
                label="Ville"
                name="city"
                placeholder="Paris"
                :required="true"
                :error="errors.city"
              />
            </div>
          </div>

          <!-- ÉTAPE 3 : Informations marketing -->
          <div v-if="currentStep === 3" class="space-y-6">
            <BaseInput
              v-model="form.website"
              label="Site internet de l'entreprise (optionnel)"
              type="url"
              name="website"
              placeholder="https://www.entreprise.com"
              :error="errors.website"
            />

            <BaseMultiSelect
              v-model="form.specialties"
              label="Vos spécialités"
              name="specialties"
              :options="specialtiesOptions"
              :required="true"
              hint="Sélectionnez au moins une spécialité"
              :error="errors.specialties"
              :columns="2"
            />

            <BaseMultiSelect
              v-model="form.sought_objects"
              label="Objets que vous recherchez le plus"
              name="sought_objects"
              :options="categoriesOptions"
              :required="true"
              hint="Sélectionnez au moins une catégorie"
              :error="errors.sought_objects"
              :columns="2"
            />

            <div class="space-y-3">
              <p class="text-sm font-medium text-text font-sans">Réseaux sociaux (optionnel)</p>
              
              <BaseInput
                v-model="form.social_media.instagram"
                label="Instagram"
                name="instagram"
                placeholder="@votre_compte"
                :error="errors['social_media.instagram']"
              />

              <BaseInput
                v-model="form.social_media.facebook"
                label="Facebook"
                type="url"
                name="facebook"
                placeholder="https://facebook.com/votre-page"
                :error="errors['social_media.facebook']"
              />

              <BaseInput
                v-model="form.social_media.linkedin"
                label="LinkedIn"
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/company/votre-entreprise"
                :error="errors['social_media.linkedin']"
              />
            </div>
          </div>

          <!-- ÉTAPE 4 : Acceptations -->
          <div v-if="currentStep === 4" class="space-y-6">
            <BaseCheckbox
              v-model="form.cgv_accepted"
              label="J'accepte les Conditions Générales de Vente (CGV)"
              name="cgv_accepted"
              :required="true"
              link="/cgv"
              linkText="Lire les CGV"
              :error="errors.cgv_accepted"
            />

            <BaseCheckbox
              v-model="form.mandate_signed"
              label="J'accepte et signe le mandat d'apport d'affaire"
              name="mandate_signed"
              :required="true"
              link="/mandat"
              linkText="Lire le mandat"
              :error="errors.mandate_signed"
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

            <!-- Info abonnement -->
            <div class="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium font-serif text-accent">Abonnement</h3>
                  <p class="mt-1 text-sm text-text/70 font-sans">
                    1 mois d'essai gratuit puis 49€/mois pour un accès illimité à la plateforme
                  </p>
                </div>
              </div>
            </div>
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
import BaseMultiSelect from '../components/BaseMultiSelect.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const currentStep = ref(1);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const stepSubtitles = [
  'Vos informations personnelles',
  'Votre entreprise',
  'Vos activités',
  'Dernières validations'
];

const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  company_name: '',
  siret: '',
  official_document: null,
  address_line1: '',
  address_line2: '',
  postal_code: '',
  city: '',
  country: 'France',
  website: '',
  specialties: [],
  sought_objects: [],
  social_media: {
    instagram: '',
    facebook: '',
    linkedin: ''
  },
  cgv_accepted: false,
  mandate_signed: false,
  newsletter_subscribed: false,
  rgpd_accepted: false
};

const specialtiesOptions = [
  { value: 'antiquaire', label: 'Antiquaire' },
  { value: 'brocanteur', label: 'Brocanteur' },
  { value: 'expert-art', label: 'Expert en art' },
  { value: 'galeriste', label: 'Galeriste' },
  { value: 'marchand-art', label: 'Marchand d\'art' },
  { value: 'commissaire-priseur', label: 'Commissaire-priseur' },
  { value: 'restaurateur', label: 'Restaurateur d\'art' },
  { value: 'autre', label: 'Autre' }
];

const categoriesOptions = [
  { value: 'bijoux-montres', label: 'Bijoux & montres' },
  { value: 'meubles-anciens', label: 'Meubles anciens' },
  { value: 'objets-art-tableaux', label: 'Objets d\'art & tableaux' },
  { value: 'objets-collection', label: 'Objets de collection' },
  { value: 'vins-spiritueux', label: 'Vins & spiritueux de collection' },
  { value: 'instruments-musique', label: 'Instruments de musique' },
  { value: 'livres-manuscrits', label: 'Livres anciens & manuscrits' },
  { value: 'mode-luxe', label: 'Mode & accessoires de luxe' },
  { value: 'horlogerie-pendules', label: 'Horlogerie & pendules anciennes' },
  { value: 'photos-vintage', label: 'Photographies anciennes & appareils vintage' },
  { value: 'vaisselle-argenterie', label: 'Vaisselle & argenterie & cristallerie' },
  { value: 'sculptures-decoratifs', label: 'Sculptures & objets décoratifs' },
  { value: 'vehicules-collection', label: 'Véhicules de collection' }
];

const form = ref({ ...initialFormData });

const formatSiret = (event) => {
  // Supprimer tout sauf les chiffres
  let value = event.target.value.replace(/\D/g, '');
  
  // Limiter strictement à 14 chiffres
  value = value.slice(0, 14);
  
  // Mettre à jour directement le form
  form.value.siret = value;
  event.target.value = value;
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
  const stepErrors = {};

  // Validation par étape
  if (currentStep.value === 1) {
    if (!formData.first_name) stepErrors.first_name = 'Le prénom est obligatoire';
    if (!formData.last_name) stepErrors.last_name = 'Le nom est obligatoire';
    if (!formData.email) stepErrors.email = 'L\'email est obligatoire';
    if (!formData.password) stepErrors.password = 'Le mot de passe est obligatoire';
    if (formData.password.length < 8) stepErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.password_confirmation) {
      stepErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
  } else if (currentStep.value === 2) {
    if (!formData.company_name) stepErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
    if (!formData.siret) stepErrors.siret = 'Le SIRET est obligatoire';
    if (formData.siret.length !== 14) stepErrors.siret = 'Le SIRET doit contenir 14 chiffres';
    if (!formData.official_document) stepErrors.official_document = 'Le document officiel est obligatoire';
    if (!formData.address_line1) stepErrors.address_line1 = 'L\'adresse est obligatoire';
    if (!formData.postal_code) stepErrors.postal_code = 'Le code postal est obligatoire';
    if (!formData.city) stepErrors.city = 'La ville est obligatoire';
  } else if (currentStep.value === 3) {
    if (formData.specialties.length === 0) stepErrors.specialties = 'Sélectionnez au moins une spécialité';
    if (formData.sought_objects.length === 0) stepErrors.sought_objects = 'Sélectionnez au moins une catégorie';
  } else if (currentStep.value === 4) {
    if (!formData.cgv_accepted) stepErrors.cgv_accepted = 'Vous devez accepter les CGV';
    if (!formData.mandate_signed) stepErrors.mandate_signed = 'Vous devez accepter le mandat';
    if (!formData.rgpd_accepted) stepErrors.rgpd_accepted = 'Vous devez accepter la politique RGPD';
  }

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

  // Dernière étape : soumettre
  try {
    // Convertir le document officiel en base64 si il existe
    let documentBase64 = null;
    if (formData.official_document) {
      documentBase64 = await fileToBase64(formData.official_document);
    }

    const dataToSend = {
      email: formData.email,
      password: formData.password,
      company_name: formData.company_name,
      siret: formData.siret,
      official_document: documentBase64, // Sera envoyé comme kbis_url
      website: formData.website || '',
      specialties: formData.specialties, // Tableau qui sera converti en string dans authService
      address_line1: formData.address_line1,
      postal_code: formData.postal_code,
      city: formData.city,
      country: formData.country,
    };

    const response = await authStore.registerPro(dataToSend);
    
    console.log('Inscription Professionnel réussie:', response);
    
    // Déconnecter l'utilisateur (il doit d'abord vérifier son email)
    authStore.logout();
    
    // Redirection vers la page EmailSent avec l'email
    router.push({ name: 'EmailSent', query: { email: formData.email } });
    
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
