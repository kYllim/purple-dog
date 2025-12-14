<template>
  <div class="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-[#C5A059]/10">
        <!-- Icon -->
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#C5A059]/10 mb-6">
          <svg class="h-10 w-10 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-[#0F172A] mb-3 uppercase tracking-wider">Email de confirmation envoyé !</h1>
        
        <p class="text-gray-600 mb-4 text-sm leading-relaxed">
          Un email de confirmation a été envoyé à <strong class="text-[#C5A059]">{{ email }}</strong>
        </p>
        
        <p class="text-gray-600 mb-6 text-sm">
          Cliquez sur le lien dans l'email pour activer votre compte. <br>
          <strong>N'oubliez pas de vérifier vos spams !</strong>
        </p>

        <!-- Warning Box -->
        <div class="bg-[#FEF3C7] border-l-4 border-[#C5A059] p-4 mb-6 text-left rounded">
          <p class="text-sm text-gray-700">
            <strong>⚠️ Important :</strong> Le lien expire dans 24 heures.
          </p>
        </div>
        
        <!-- Buttons -->
        <div class="flex flex-col gap-3">
          <router-link
            to="/"
            class="inline-flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#B08F4A] transition-all duration-200"
          >
            Retour à l'accueil
          </router-link>
          
          <router-link
            to="/connexion"
            class="inline-flex justify-center py-3 px-8 border border-[#C5A059]/30 rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-200"
          >
            Se connecter
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const email = ref('');

onMounted(() => {
  // Récupérer l'email depuis les query params
  email.value = route.query.email || '';
  
  // Si pas d'email, rediriger vers la home
  if (!email.value) {
    router.push('/');
  }
});
</script>
