<template>
  <!-- Pop-up minimisé (icône en bas à droite) -->
  <div 
    v-if="isMinimized && !isDismissed && !shouldHide"
    @click="isMinimized = false"
    class="fixed bottom-6 right-6 z-50 cursor-pointer group"
  >
    <div class="bg-[#C5A059] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 relative">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
      <!-- Badge notification -->
      <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>
    </div>
    <div class="mt-2 bg-white text-gray-700 px-3 py-1 rounded-lg shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Votre avis nous intéresse !
    </div>
  </div>

  <!-- Pop-up complet -->
  <Transition name="slide-fade">
    <div 
      v-if="!isMinimized && !isDismissed"
      class="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border-2 border-[#C5A059]/20 overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 class="text-white font-bold text-sm">Donnez votre avis sur Purple Dog</h3>
        </div>
        <div class="flex gap-2">
          <button 
            @click="minimizePopup"
            class="text-white/70 hover:text-white transition-colors"
            title="Réduire"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <button 
            @click="minimizePopup"
            class="text-white/70 hover:text-white transition-colors"
            title="Fermer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-600 text-sm mb-4">
          Votre avis est précieux pour améliorer Purple Dog !
        </p>

        <!-- Système d'étoiles -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Note sur 10</label>
          <div class="flex gap-1 justify-center flex-wrap">
            <button
              v-for="star in 10"
              :key="star"
              @click="rating = star"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
              class="focus:outline-none transition-transform hover:scale-125"
            >
              <svg 
                class="w-7 h-7 transition-colors"
                :class="star <= (hoverRating || rating) ? 'text-[#C5A059]' : 'text-gray-300'"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Zone de commentaire -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Votre commentaire (optionnel)
          </label>
          <textarea
            v-model="comment"
            rows="4"
            placeholder="Partagez votre expérience avec Purple Dog..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent resize-none text-sm"
          ></textarea>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {{ successMessage }}
        </div>

        <!-- Boutons -->
        <div class="flex gap-3">
          <button
            @click="submitFeedback"
            :disabled="!rating || isSubmitting"
            class="flex-1 bg-[#C5A059] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#B08F4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Envoi...' : 'Envoyer' }}
          </button>
          <button
            @click="dismissPopup"
            class="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()

const isMinimized = ref(true) // Démarrer minimisé
const isDismissed = ref(false) // Caché pendant la session seulement
const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Routes où le pop-up doit être caché
const hiddenRoutes = [
  '/connexion',
  '/login',
  '/inscription/particulier',
  '/inscription/professionnel',
  '/register',
  '/mot-de-passe-oublie',
  '/reset-password',
  '/verify-email',
  '/email-sent'
]

// Computed pour savoir si on doit cacher le pop-up
const shouldHide = computed(() => {
  return hiddenRoutes.some(path => route.path.includes(path))
})

const minimizePopup = () => {
  isMinimized.value = true
}

const dismissPopup = () => {
  isDismissed.value = true
  // Plus de localStorage - se réaffiche à chaque nouvelle session
}

const submitFeedback = async () => {
  if (!rating.value) {
    errorMessage.value = 'Veuillez sélectionner une note'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.post('/feedback', {
      note: rating.value,
      commentaire: comment.value
    })
    
    successMessage.value = 'Merci pour votre avis ! 🎉'
    
    // Réinitialiser et fermer après 2 secondes
    setTimeout(() => {
      rating.value = 0
      comment.value = ''
      dismissPopup()
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'avis:', error)
    errorMessage.value = 'Erreur lors de l\'envoi. Réessayez plus tard.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
