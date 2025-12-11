<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-serif text-accent mb-2">Purple Dog</h1>
        <p class="text-sm text-text/60 font-sans">Espace de connexion</p>
      </div>

      <AuthForm
        title="Connexion"
        subtitle="Accédez à votre compte"
        submit-text="Se connecter"
        loading-text="Connexion..."
        :initial-data="initialFormData"
        max-width="md"
        @submit="handleLogin"
      >
        <!-- Contenu du formulaire -->
        <template #default="{ form, errors }">
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

          <!-- Password -->
          <BaseInput
            v-model="form.password"
            label="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            placeholder="••••••••••"
            autocomplete="current-password"
            :required="true"
            :error="errors.password"
            :icon-right="showPassword ? EyeSlashIcon : EyeIcon"
            @icon-click="showPassword = !showPassword"
          />

          <!-- Remember me + Forgot password -->
          <div class="flex items-center justify-between">
            <BaseCheckbox
              v-model="form.remember"
              label="Se souvenir de moi"
              name="remember"
            />

            <router-link
              to="/mot-de-passe-oublie"
              class="text-sm font-medium font-sans text-accent hover:text-accent/80 transition-colors"
            >
              Mot de passe oublié ?
            </router-link>
          </div>
        </template>

        <!-- Footer avec liens -->
        <template #footer>
          <div class="pt-6 border-t border-text/10">
            <p class="text-center text-sm text-text/60 font-sans mb-4">
              Pas encore de compte ?
            </p>
            <div class="grid grid-cols-1 gap-3">
              <router-link
                to="/inscription/particulier"
                class="w-full inline-flex justify-center py-2.5 px-4 border border-accent/30 rounded-lg shadow-sm bg-white text-sm font-medium font-sans text-accent hover:bg-accent/5 transition-all duration-200"
              >
                S'inscrire en tant que particulier
              </router-link>
              <router-link
                to="/inscription/professionnel"
                class="w-full inline-flex justify-center py-2.5 px-4 border border-accent rounded-lg shadow-sm bg-accent text-sm font-medium font-sans text-white hover:bg-accent/90 transition-all duration-200"
              >
                S'inscrire en tant que professionnel
              </router-link>
            </div>
          </div>
        </template>
      </AuthForm>
    </div>

    <!-- Modale Ban (Style identique à Users.vue) -->
    <div v-if="showBannedModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
         
         <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 class="text-xl font-serif font-bold text-[#0F172A]">
             Compte Suspendu
           </h3>
           <button @click="showBannedModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
         </div>

         <div class="p-6 text-center">
              <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                 <span class="text-3xl">🚫</span>
              </div>
              <p class="font-bold text-[#0F172A] text-lg mb-2">Votre accès a été révoqué</p>
              <p class="text-slate-600 mb-6 text-sm leading-relaxed">
                 Pour espérer récupérer votre compte, vous devez envoyer une lettre de plate excuse et supplier la pitié du support technique.
              </p>
              
              <a href="#" class="block w-full bg-[#0F172A] text-[#C5A059] py-3 px-4 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                Écrire au support en pleurant
              </a>
         </div>

       </div>
     </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseCheckbox from '../components/BaseCheckbox.vue';
import ModalConfirmation from '../components/common/ModalConfirmation.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const showPassword = ref(false);
const showBannedModal = ref(false);

const initialFormData = {
  email: '',
  password: '',
  remember: false
};

const handleLogin = async (formData, { setErrors, setLoading }) => {
  try {
    const response = await authStore.login({
      email: formData.email,
      password: formData.password,
    });
    
    console.log('Login réussi:', response);
    
    // Rediriger selon le rôle
    if (response.role === 'PARTICULIER') {
      router.push('/');
    } else if (response.role === 'PRO') {
      router.push('/');
    } else if (response.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
    
  } catch (error) {
    console.error('Erreur login:', error);
    if (error.response?.status === 403 && error.response.data?.error === 'Votre compte a été suspendu.') {
      showBannedModal.value = true;
    } else if (error.response?.data?.error) {
      setErrors({
        email: error.response.data.error
      });
    } else {
      setErrors({
        email: 'Email ou mot de passe incorrect'
      });
    }
  } finally {
    setLoading(false);
  }
};
</script>
