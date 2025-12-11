<template>
  <PublicLayout>
  <div class="min-h-screen flex items-center justify-center py-6 md:py-12 px-4 bg-[#F1F5F9] font-sans pt-28">
    <div class="max-w-5xl w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C5A059]/10 relative overflow-hidden flex flex-col md:flex-row">
      
      <!-- Sidebar / En-tête Mobile -->
      <div class="md:w-1/3 bg-[#F8FAFC] border-r border-gray-100 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#C5A059] md:hidden"></div>
        <div class="absolute top-0 left-0 h-full w-1 bg-[#C5A059] hidden md:block"></div>
        
        <!-- Photo de profil avec upload (uniquement pour PARTICULIER) -->
        <div v-if="formulaire.role === 'PARTICULIER'" class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 group bg-gray-200 flex items-center justify-center">
          <img 
            v-if="photoPreview || formulaire.photo_profil_url" 
            :src="photoPreview || formulaire.photo_profil_url" 
            alt="Photo de profil" 
            class="w-full h-full object-cover"
          />
          <svg v-else class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          
          <!-- Overlay pour upload -->
          <label class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span class="text-white text-xs font-bold">MODIFIER</span>
            <input 
              type="file" 
              accept="image/*" 
              @change="handlePhotoUpload" 
              class="hidden"
            />
          </label>
        </div>

        <!-- Icon PRO (à la place de la photo) -->
        <div v-else-if="formulaire.role === 'PRO'" class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 bg-[#0F172A] flex items-center justify-center">
          <svg class="w-16 h-16 text-[#C5A059]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
        </div>

        <h2 class="text-2xl font-serif font-bold text-[#0F172A] tracking-wider mb-1">
          <span v-if="formulaire.role === 'PARTICULIER'">{{ formulaire.prenom || 'Utilisateur' }} {{ formulaire.nom }}</span>
          <span v-else-if="formulaire.role === 'PRO'">{{ formulaire.nom_entreprise || 'Entreprise' }}</span>
          <span v-else>Utilisateur</span>
        </h2>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6" 
          :class="formulaire.role === 'PRO' ? 'bg-[#0F172A] text-[#C5A059]' : 'bg-[#C5A059]/20 text-[#C5A059]'">
          {{ formulaire.role }}
        </span>
        <p class="text-sm text-gray-500 mb-8 leading-relaxed">
          Gérez vos informations personnelles et vos préférences de compte.
        </p>
      </div>

      <!-- Formulaire Principal -->
      <div class="flex-1 p-5 md:p-12 relative">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059] mx-auto mb-4"></div>
            <p class="text-gray-500">Chargement...</p>
          </div>
        </div>

        <div class="absolute top-0 right-0 p-6 opacity-5">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="none" class="text-[#C5A059]">
             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
           </svg>
        </div>

        <form @submit.prevent="mettreAJour" class="space-y-10 relative z-10">
          
          <!-- Indicateur d'étapes -->
          <div class="flex justify-center mb-8">
            <div class="flex items-center gap-2">
              <div v-for="step in (formulaire.role === 'PRO' ? 3 : 2)" :key="step" class="flex items-center">
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                    currentStep >= step ? 'bg-[#C5A059] text-white' : 'bg-gray-200 text-gray-400'
                  ]"
                >
                  {{ step }}
                </div>
                <div v-if="step < (formulaire.role === 'PRO' ? 3 : 2)" 
                  :class="['w-12 h-1 mx-2', currentStep > step ? 'bg-[#C5A059]' : 'bg-gray-200']"
                ></div>
              </div>
            </div>
          </div>

          <!-- Étape 1 PARTICULIER: Identité -->
          <section v-if="formulaire.role === 'PARTICULIER' && currentStep === 1" class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Identité & Connexion
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="formulaire.prenom" label="Prénom" required :error="erreurs.prenom" />
              <BaseInput v-model="formulaire.nom" label="Nom" required :error="erreurs.nom" />
              <BaseInput v-model="formulaire.email" type="email" label="Adresse Email" required :error="erreurs.email" class="md:col-span-2" />
            </div>
          </section>

          <!-- Étape 1 PRO: Email uniquement -->
          <section v-if="formulaire.role === 'PRO' && currentStep === 1" class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Identité & Connexion
            </h3>
            <div class="grid grid-cols-1 gap-6">
              <BaseInput v-model="formulaire.email" type="email" label="Adresse Email" required :error="erreurs.email" />
            </div>
          </section>

          <!-- Étape 2 PRO: Informations Professionnelles -->
          <section v-if="formulaire.role === 'PRO' && currentStep === 2" class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Informations Professionnelles
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="formulaire.nom_entreprise" label="Nom de l'entreprise" required :error="erreurs.nom_entreprise" />
              <BaseInput v-model="formulaire.siret" label="SIRET" required :error="erreurs.siret" />
              <BaseInput v-model="formulaire.site_web" label="Site Web" type="url" class="md:col-span-2" />
              <BaseInput v-model="formulaire.kbis_url" label="URL du KBIS" class="md:col-span-2" />
            </div>
          </section>

          <!-- Étape 2 PARTICULIER / Étape 3 PRO: Coordonnées -->
          <section v-if="(formulaire.role === 'PARTICULIER' && currentStep === 2) || (formulaire.role === 'PRO' && currentStep === 3)" class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Coordonnées
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
              <BaseInput v-model="formulaire.adresse" label="Rue & Numéro" class="md:col-span-6" required :error="erreurs.adresse" />
              <BaseInput v-model="formulaire.code_postal" label="Code Postal" class="md:col-span-2" required :error="erreurs.code_postal" />
              <BaseInput v-model="formulaire.ville" label="Ville" class="md:col-span-2" required :error="erreurs.ville" />
              <BaseInput v-model="formulaire.pays" label="Pays" class="md:col-span-2" required :error="erreurs.pays" />
            </div>
          </section>

          <!-- Message d'erreur global -->
          <div v-if="erreurMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ erreurMessage }}
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {{ successMessage }}
          </div>

          <!-- Footer Actions -->
          <div class="pt-6 flex items-center justify-between border-t border-gray-100 mt-8">
            <!-- Bouton Précédent -->
            <button 
              v-if="currentStep > 1"
              type="button" 
              class="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              @click="currentStep--"
            >
              ← Précédent
            </button>
            <button 
              v-else
              type="button" 
              class="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              @click="annuler"
            >
              Annuler
            </button>

            <!-- Bouton Suivant ou Enregistrer -->
            <div class="flex gap-4">
              <button 
                v-if="currentStep < (formulaire.role === 'PRO' ? 3 : 2)"
                type="button"
                class="px-8 py-2.5 text-sm font-bold bg-[#C5A059] text-white rounded hover:bg-[#B08F4A] transition-colors shadow-xl shadow-[#C5A059]/20"
                @click="currentStep++"
              >
                Suivant →
              </button>
              <BaseButton 
                v-else
                type="submit" 
                class="px-8 py-2.5 text-sm shadow-xl shadow-[#C5A059]/20" 
                :disabled="isSaving"
              >
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </BaseButton>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
  </PublicLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import PublicLayout from '../layouts/PublicLayout.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const isSaving = ref(false)
const erreurMessage = ref('')
const successMessage = ref('')
const photoPreview = ref('')
const photoFile = ref(null)
const erreurs = reactive({})
const currentStep = ref(1)
const totalSteps = ref(3) // 3 étapes pour PARTICULIER, peut varier pour PRO

const formulaire = reactive({
  prenom: '',
  nom: '',
  email: '',
  adresse: '',
  ville: '',
  code_postal: '',
  pays: '',
  photo_profil_url: '',
  role: '',
  // Champs PRO
  nom_entreprise: '',
  siret: '',
  kbis_url: '',
  site_web: '',
  specialites: ''
})

// Charger le profil depuis l'API
const chargerProfil = async () => {
  isLoading.value = true
  erreurMessage.value = ''
  
  try {
    const response = await api.get('/auth/profile')
    const data = response.data
    
    // Remplir le formulaire avec les données communes
    formulaire.email = data.email || ''
    formulaire.adresse = data.adresse || ''
    formulaire.ville = data.ville || ''
    formulaire.code_postal = data.code_postal || ''
    formulaire.pays = data.pays || ''
    formulaire.role = data.role || ''
    
    // Données spécifiques PARTICULIER
    if (data.role === 'PARTICULIER') {
      formulaire.prenom = data.prenom || ''
      formulaire.nom = data.nom || ''
      formulaire.photo_profil_url = data.photo_profil_url || ''
    }
    
    // Données spécifiques PRO
    if (data.role === 'PRO') {
      formulaire.nom_entreprise = data.nom_entreprise || ''
      formulaire.siret = data.siret || ''
      formulaire.kbis_url = data.kbis_url || ''
      formulaire.site_web = data.site_web || ''
      formulaire.specialites = data.specialites || ''
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    erreurMessage.value = error.response?.data?.error || 'Impossible de charger le profil'
  } finally {
    isLoading.value = false
  }
}

// Gérer l'upload de photo
const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  if (!file.type.startsWith('image/')) {
    erreurMessage.value = 'Veuillez sélectionner une image valide'
    return
  }

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    erreurMessage.value = 'L\'image ne doit pas dépasser 5 MB'
    return
  }

  photoFile.value = file

  // Convertir en base64 pour prévisualisation
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Valider le formulaire
const validerFormulaire = () => {
  Object.keys(erreurs).forEach(cle => delete erreurs[cle])
  let valide = true

  // Validation spécifique PARTICULIER
  if (formulaire.role === 'PARTICULIER') {
    if (!formulaire.prenom?.trim()) {
      erreurs.prenom = 'Prénom requis'
      valide = false
    }
    
    if (!formulaire.nom?.trim()) {
      erreurs.nom = 'Nom requis'
      valide = false
    }
  }

  // Validation spécifique PRO
  if (formulaire.role === 'PRO') {
    if (!formulaire.nom_entreprise?.trim()) {
      erreurs.nom_entreprise = 'Nom de l\'entreprise requis'
      valide = false
    }
    
    if (!formulaire.siret?.trim()) {
      erreurs.siret = 'SIRET requis'
      valide = false
    }
  }

  // Validations communes
  if (!formulaire.email?.trim() || !formulaire.email.includes('@')) {
    erreurs.email = 'Email invalide'
    valide = false
  }

  if (!formulaire.adresse?.trim()) {
    erreurs.adresse = 'Adresse requise'
    valide = false
  }

  if (!formulaire.ville?.trim()) {
    erreurs.ville = 'Ville requise'
    valide = false
  }

  if (!formulaire.code_postal?.trim()) {
    erreurs.code_postal = 'Code postal requis'
    valide = false
  }

  if (!formulaire.pays?.trim()) {
    erreurs.pays = 'Pays requis'
    valide = false
  }

  return valide
}

// Mettre à jour le profil
const mettreAJour = async () => {
  if (!validerFormulaire()) return

  isSaving.value = true
  erreurMessage.value = ''
  successMessage.value = ''

  try {
    // Préparer les données communes
    const dataToSend = {
      email: formulaire.email,
      adresse: formulaire.adresse,
      ville: formulaire.ville,
      code_postal: formulaire.code_postal,
      pays: formulaire.pays
    }

    // Données PARTICULIER
    if (formulaire.role === 'PARTICULIER') {
      dataToSend.prenom = formulaire.prenom
      dataToSend.nom = formulaire.nom
      
      // Si une nouvelle photo a été uploadée, la convertir en base64
      if (photoFile.value) {
        const reader = new FileReader()
        const base64Promise = new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(photoFile.value)
        })
        dataToSend.photo_profil_url = await base64Promise
      }
    }

    // Données PRO
    if (formulaire.role === 'PRO') {
      dataToSend.nom_entreprise = formulaire.nom_entreprise
      dataToSend.siret = formulaire.siret
      dataToSend.kbis_url = formulaire.kbis_url
      dataToSend.site_web = formulaire.site_web
      dataToSend.specialites = formulaire.specialites
    }

    // Envoyer la requête
    await api.put('/auth/profile', dataToSend)
    
    successMessage.value = 'Profil mis à jour avec succès !'
    photoFile.value = null
    photoPreview.value = ''
    
    // Recharger le profil pour avoir les données à jour
    setTimeout(() => {
      successMessage.value = ''
      chargerProfil()
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    erreurMessage.value = error.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    isSaving.value = false
  }
}

// Annuler et retourner
const annuler = () => {
  router.push('/')
}

// Charger le profil au montage
onMounted(() => {
  chargerProfil()
})
</script>
