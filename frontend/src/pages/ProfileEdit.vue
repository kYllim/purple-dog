<template>
  <div class="min-h-screen flex items-center justify-center py-6 md:py-12 px-4 bg-[#F1F5F9] font-sans">
    <div class="max-w-5xl w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C5A059]/10 relative overflow-hidden flex flex-col md:flex-row">
      
      <!-- Sidebar / En-tête Mobile -->
      <div class="md:w-1/3 bg-[#F8FAFC] border-r border-gray-100 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#C5A059] md:hidden"></div>
        <div class="absolute top-0 left-0 h-full w-1 bg-[#C5A059] hidden md:block"></div>
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 relative group bg-gray-200 flex items-center justify-center">
           <svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
           <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
             <span class="text-white text-xs font-bold">MODIFIER</span>
           </div>
        </div>
        <h2 class="text-2xl font-serif font-bold text-[#0F172A] tracking-wider mb-1">
          {{ utilisateur_affiche.prenom || 'Utilisateur' }} {{ utilisateur_affiche.nom }}
        </h2>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6" 
          :class="role_utilisateur === 'PRO' ? 'bg-[#0F172A] text-[#C5A059]' : 'bg-[#C5A059]/20 text-[#C5A059]'">
          {{ role_utilisateur }}
        </span>
        <p class="text-sm text-gray-500 mb-8 leading-relaxed">
          Gérez vos informations personnelles et vos préférences de compte.
        </p>
      </div>

      <!-- Formulaire Principal -->
      <div class="flex-1 p-5 md:p-12 relative">
        <div class="absolute top-0 right-0 p-6 opacity-5">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="none" class="text-[#C5A059]"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>
        </div>

        <form @submit.prevent="mettre_a_jour" class="space-y-10 relative z-10">
          
          <!-- Section 1: Identité -->
          <section class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Identité & Connexion
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="role_utilisateur === 'PARTICULIER'" class="contents">
                <BaseInput v-model="formulaire.prenom" label="Prénom" required :error="erreurs.prenom" />
                <BaseInput v-model="formulaire.nom" label="Nom" required :error="erreurs.nom" />
              </div>
              <BaseInput v-model="formulaire.email" type="email" label="Adresse Email" required :error="erreurs.email" class="md:col-span-2" />
              <div v-if="role_utilisateur === 'PARTICULIER'" class="md:col-span-1">
                 <BaseInput v-model.number="formulaire.age" type="number" label="Âge" required :error="erreurs.age" />
              </div>
            </div>
          </section>

          <!-- Section 2: Professionnel (Conditionnel) -->
          <section v-if="role_utilisateur === 'PRO'" class="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
             <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 mb-4">
              <span class="w-1.5 h-1.5 bg-[#0F172A] rounded-full"></span> 
              Informations Entreprise
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="formulaire.nom_entreprise" label="Raison Sociale" required :error="erreurs.nom_entreprise" />
              <BaseInput v-model="formulaire.siret" label="PRO" required :error="erreurs.siret" placeholder="SIRET" />
              <BaseInput v-model="formulaire.url_kbis" label="K-Bis (URL)" required :error="erreurs.url_kbis" />
              <BaseInput v-model="formulaire.site_web" label="Site Internet" required :error="erreurs.site_web" />
              <BaseInput v-model="formulaire.specialites" label="Spécialités" :error="erreurs.specialites" class="md:col-span-2" />
            </div>
          </section>

          <!-- Section 3: Adresse -->
          <section class="space-y-6">
            <h3 class="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <span class="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span> 
              Coordonnées
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
              <BaseInput v-model="formulaire.adresse" label="Rue & Numéro" class="md:col-span-6" required :error="erreurs.adresse" />
              <BaseInput v-model="formulaire.code_postal" label="CP" class="md:col-span-2" required :error="erreurs.code_postal" />
              <BaseInput v-model="formulaire.ville" label="Ville" class="md:col-span-2" required :error="erreurs.ville" />
              <BaseInput v-model="formulaire.pays" label="Pays" class="md:col-span-2" required :error="erreurs.pays" />
            </div>
          </section>

          <!-- Footer Actions -->
          <div class="pt-6 flex items-center justify-between border-t border-gray-100 mt-8">
            <label class="flex items-center gap-3 cursor-pointer group select-none">
              <div class="relative flex items-center">
                <input type="checkbox" v-model="formulaire.newsletter" class="peer sr-only">
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C5A059]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
              </div>
              <span class="text-sm text-gray-500 group-hover:text-[#0F172A] transition-colors">Newsletter</span>
            </label>

            <div class="flex gap-4">
               <button type="button" class="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors" @click="retour">
                Annuler
              </button>
              <BaseButton type="submit" class="px-8 py-2.5 text-sm shadow-xl shadow-[#C5A059]/20" :disabled="est_en_chargement">
                {{ est_en_chargement ? '...' : 'Enregistrer' }}
              </BaseButton>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const routeur = useRouter()
const role_utilisateur = ref('') 
const est_en_chargement = ref(false)
const erreurs = reactive({})

const formulaire = reactive({
  prenom: '',
  nom: '',
  email: '',
  adresse: '',
  ville: '',
  code_postal: '',
  pays: '',
  newsletter: false,
  age: '',
  nom_entreprise: '',
  siret: '',
  url_kbis: '',
  site_web: '',
  specialites: ''
})

const utilisateur_affiche = reactive({
  prenom: '',
  nom: ''
})

onMounted(async () => {
  // Simulation de récupération de l'utilisateur connecté (depuis un store ou API)
  // Dans la réalité, on utiliserait un store Pinia ou un appel API
  const chargerUtilisateur = async () => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Récupérer le user stocké (simulé par localStorage pour le moment) ou mock API
    // Pour l'instant, on laisse un mock "intelligent" qui change selon qui est "connecté" 
    // (Dans un vrai cas, on ferait api.get('/me'))
    
    // EXEMPLE: On peut décommenter pour tester PRO
    // const role_detecte = 'PRO' 
    const role_detecte = 'PARTICULIER' // Valeur par défaut si pas de vraie auth
    
    role_utilisateur.value = role_detecte

    if (role_detecte === 'PARTICULIER') {
      formulaire.prenom = 'Erkant'
      formulaire.nom = 'YILDIZ'
      formulaire.email = 'erkant.yildiz@gmail.com'
      formulaire.adresse = '10 Rue de la Paix'
      formulaire.ville = 'Paris'
      formulaire.code_postal = '75001'
      formulaire.pays = 'France'
      formulaire.age = 25
      formulaire.newsletter = true
    } else {
      // PRO
      formulaire.email = 'contact@purpledog.com'
      formulaire.adresse = '1 Place de la Bourse'
      formulaire.ville = 'Bordeaux'
      formulaire.code_postal = '33000'
      formulaire.pays = 'France'
      formulaire.nom_entreprise = 'Purple Dog SAS'
      formulaire.siret = '888 777 666 00011'
      formulaire.url_kbis = 'https://doc.com/kbis.pdf'
      formulaire.site_web = 'https://purple-dog.com'
      formulaire.specialites = 'Horlogerie, Maroquinerie'
      formulaire.newsletter = true
    }
    
    // Mettre à jour l'affichage initial
    Object.assign(utilisateur_affiche, formulario) // Legacy typo kept for safety unless refined
    utilisateur_affiche.prenom = formulaire.prenom
    utilisateur_affiche.nom = formulaire.nom
  }

  await chargerUtilisateur()
})

const verifier_tout = () => {
  Object.keys(erreurs).forEach(cle => delete erreurs[cle])
  let c_est_bon = true

  if (!formulaire.email || !formulaire.email.includes('@')) { erreurs.email = 'Invalide'; c_est_bon = false }
  
  if (role_utilisateur.value === 'PARTICULIER') {
    if (!formulaire.prenom) { erreurs.prenom = '!'; c_est_bon = false }
    if (!formulaire.nom) { erreurs.nom = '!'; c_est_bon = false }
  } else {
    if (!formulaire.nom_entreprise) { erreurs.nom_entreprise = '!'; c_est_bon = false }
    if (!formulaire.siret) { erreurs.siret = '!'; c_est_bon = false }
  }

  return c_est_bon
}

const mettre_a_jour = async () => {
  if (!verifier_tout()) return
  est_en_chargement.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    // Mise à jour de l'affichage seulement ici
    utilisateur_affiche.prenom = formulaire.prenom
    utilisateur_affiche.nom = formulaire.nom
    utilisateur_affiche.email = formulaire.email
    
    alert('Mise à jour réussie')
  } catch (e) {
    alert('Erreur')
  } finally {
    est_en_chargement.value = false
  }
}

const retour = () => routeur.push('/')
</script>
