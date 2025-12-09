<template>
        <p class="mt-2 text-sm text-gray-500 font-sans">Espace Purple Dog</p>
  <AuthForm
    title="Connexion"
    subtitle="Accédez à votre compte Purple Dog"
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
          class="text-sm font-medium text-purple-600 hover:text-purple-500"
        >
          Mot de passe oublié ?
        </router-link>
      </div>
    </template>

    <!-- Footer avec liens -->
    <template #footer>
      <div class="pt-6 border-t border-gray-200">
        <p class="text-center text-sm text-gray-600 mb-4">
          Pas encore de compte ?
        </p>
        <div class="grid grid-cols-1 gap-3">
          <router-link
            to="/inscription/particulier"
            class="w-full inline-flex justify-center py-2.5 px-4 border border-purple-300 rounded-lg shadow-sm bg-white text-sm font-medium text-purple-700 hover:bg-purple-50 transition-all duration-200"
          >
            S'inscrire en tant que particulier
          </router-link>
          <router-link
            to="/inscription/professionnel"
            class="w-full inline-flex justify-center py-2.5 px-4 border border-purple-600 rounded-lg shadow-sm bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 transition-all duration-200"
          >
            S'inscrire en tant que professionnel
          </router-link>
        </div>
      </div>
    </template>
  </AuthForm>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '@/components/AuthForm.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const showPassword = ref(false);

const initialFormData = {
  email: '',
  password: '',
  remember: false
};

const handleLogin = async (formData, { setErrors, setLoading }) => {
  try {
    // TODO: Remplacer par ton appel API
    // const response = await api.post('/api/auth/login', formData);
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Login:', formData);
    
    // TODO: Stocker le token et rediriger selon user_type
    // if (response.data.user.user_type === 'particulier') {
    //   router.push('/particulier/dashboard');
    // } else if (response.data.user.user_type === 'professionnel') {
    //   router.push('/professionnel/dashboard');
    // }
    
  } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
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