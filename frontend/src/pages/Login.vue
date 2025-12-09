<template>

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
  </div>
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
