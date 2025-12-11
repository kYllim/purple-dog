<template>
  <PublicLayout>
    <div class="w-full max-w-[1920px] mx-auto pt-32 pb-20 px-6 lg:px-12">
      <!-- Title Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-text mb-4">Contactez-nous</h1>
        <p class="text-text/60 max-w-2xl mx-auto text-lg">
          Une question sur une enchère ? Besoin d'une estimation ? Notre équipe est à votre disposition pour vous accompagner.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        
        <!-- Contact Form -->
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-xl border-t-4 border-accent">
            <h2 class="text-2xl font-serif font-bold text-text mb-8 text-center">Envoyez-nous un message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Name -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Nom</label>
                        <input v-model="form.nom" type="text" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" placeholder="Votre nom" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Prénom</label>
                        <input v-model="form.prenom" type="text" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" placeholder="Votre prénom" />
                    </div>
                </div>

                <!-- Email Phone -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Email</label>
                        <input v-model="form.email" type="email" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" placeholder="contact@exemple.com" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Téléphone</label>
                        <input v-model="form.phone" type="tel" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" placeholder="06 12 34 56 78" />
                    </div>
                </div>

                <!-- Subject -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Sujet</label>
                    <select v-model="form.object" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors appearance-none">
                        <option value="Renseignement général">Renseignement général</option>
                        <option value="Demande d'estimation">Demande d'estimation</option>
                        <option value="Support technique">Support technique</option>
                        <option value="Presse / Partenariat">Presse / Partenariat</option>
                    </select>
                </div>

                <!-- Message -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Message</label>
                    <textarea v-model="form.message" rows="5" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full py-4 bg-accent text-white font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    :disabled="loading"
                >
                    <span v-if="!loading">Envoyer le message</span>
                    <span v-else><i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Envoi en cours...</span>
                </button>
            </form>
        </div>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { reactive, ref } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';

const loading = ref(false);
const form = reactive({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    object: 'Renseignement général',
    message: ''
});

const submitForm = async () => {
    loading.value = true;
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Formulaire contact envoyé:', form);
    alert(`Merci ${form.prenom} ! Votre message a bien été envoyé. Notre équipe vous répondra sous 24h.`);
    
    // Reset
    form.nom = '';
    form.prenom = '';
    form.email = '';
    form.phone = '';
    form.message = '';
    loading.value = false;
};
</script>
