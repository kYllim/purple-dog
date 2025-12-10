<template>
  <div class="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
    
    <div class="mb-8">
      <h1 class="text-3xl font-serif font-bold text-[#0F172A]">Gestion des Utilisateurs</h1>
      <p class="text-slate-500 mt-1">Administrez les comptes particuliers et professionnels.</p>
    </div>

    <div class="animate-fade-in-up">
      
      <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 class="text-xl font-bold text-slate-700">Liste des Comptes</h2>
        <BaseButton @click="ouvrirModaleCreation" class="w-full md:w-auto bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2 rounded-lg shadow-lg shadow-slate-200 text-sm">
          + Nouvel Utilisateur
        </BaseButton>
      </div>

      <!-- VUE TABLEAU (Desktop) -->
      <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th class="p-4 w-24">Rôle</th>
              <th class="p-4">Email / Identité</th>
              <th class="p-4 text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="u in utilisateurs" :key="u.id" :class="['hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0 align-middle', u.est_bloque ? 'bg-slate-100 grayscale opacity-75' : '']">
              <td class="p-4">
                <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', u.role === 'PRO' ? 'bg-[#0F172A] text-[#C5A059]' : 'bg-slate-100 text-slate-600']">
                  {{ u.role }}
                </span>
              </td>
              <td class="p-4">
                <div class="font-bold text-slate-800">
                    {{ u.email }}
                    <span v-if="u.est_bloque" class="ml-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">BLACKLISTÉ</span>
                </div>
                
                <!-- Identification fusionnée -->
                <div v-if="u.role === 'PRO'" class="text-sm text-slate-600 mt-0.5">
                   <span class="font-medium" v-if="u.nom_entreprise">{{ u.nom_entreprise }}</span>
                   <span class="text-xs text-slate-400 ml-1" v-if="u.siret">(SIRET: {{ u.siret }})</span>
                </div>
                <div v-else class="text-sm text-slate-600 mt-0.5">
                   <span class="font-medium">{{ u.prenom }} {{ u.nom }}</span>
                   <span class="text-xs text-slate-400 ml-1" v-if="u.age">{{ u.age }} ans</span>
                </div>
                
                <div class="text-xs text-slate-400 mt-0.5">ID: {{ u.id.substring(0,8) }}...</div>

                <div class="flex gap-1 mt-1.5">
                    <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full w-max', u.email_verifie ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                        {{ u.email_verifie ? 'Vérifié' : 'Non Vérifié' }}
                    </span>
                    <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full w-max', u.newsletter_acceptee ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500']">
                        {{ u.newsletter_acceptee ? 'News' : 'No News' }}
                    </span>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2 opacity-15 group-hover:opacity-100 transition-opacity">
                   <button v-if="u.role === 'PARTICULIER' && !u.est_bloque" @click="ouvrirModaleBlacklist(u)" class="text-slate-500 hover:bg-slate-100 p-2 rounded-full font-bold text-xs" title="Blacklister">🚫</button>
                   <button v-if="u.role === 'PARTICULIER' && u.est_bloque" @click="ouvrirModaleBlacklist(u)" class="text-green-600 hover:bg-green-50 p-2 rounded-full font-bold text-xs" title="Débloquer">✅</button>
                   
                  <button @click="editerUtilisateur(u)" class="text-blue-600 hover:bg-blue-50 p-2 rounded-full font-bold text-xs">Modif.</button>
                  <button @click="confirmerSuppression(u)" class="text-red-500 hover:bg-red-50 p-2 rounded-full font-bold text-xs">Suppr.</button>
                </div>
              </td>
            </tr>
            <tr v-if="utilisateurs.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400 italic">Aucun utilisateur trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VUE CARTES (Mobile) -->
      <div class="md:hidden space-y-4">
        <div v-for="u in utilisateurs" :key="u.id" :class="['bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative', u.est_bloque ? 'bg-slate-50 grayscale opacity-75' : '']">
            
            <!-- Header Carte -->
            <div class="flex justify-between items-start mb-3">
                <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', u.role === 'PRO' ? 'bg-[#0F172A] text-[#C5A059]' : 'bg-slate-100 text-slate-600']">
                  {{ u.role }}
                </span>
                <div class="flex gap-2">
                   <button @click="editerUtilisateur(u)" class="p-2 text-blue-600 bg-blue-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
                   <button @click="confirmerSuppression(u)" class="p-2 text-red-600 bg-red-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
            </div>

            <!-- Contenu Carte -->
            <div class="mb-3">
                <div class="font-bold text-slate-800 text-lg break-words">
                    {{ u.email }}
                </div>
                <!-- Identification fusionnée Mobile -->
                <div v-if="u.role === 'PRO'" class="text-sm text-slate-600 mt-1">
                   <span class="font-medium block" v-if="u.nom_entreprise">{{ u.nom_entreprise }}</span>
                   <span class="text-xs text-slate-400" v-if="u.siret">SIRET: {{ u.siret }}</span>
                </div>
                <div v-else class="text-sm text-slate-600 mt-1">
                   <span class="font-medium block">{{ u.prenom }} {{ u.nom }}</span>
                </div>
                <div class="text-xs text-slate-400 mt-1 font-mono">ID: {{ u.id.substring(0,8) }}...</div>
            </div>

            <!-- Footer Carte (Actions + Badges) -->
            <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-50">
                <!-- Bouton Blacklist Mobile -->
                 <button v-if="u.role === 'PARTICULIER'" @click="ouvrirModaleBlacklist(u)" 
                    :class="['flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-center border', u.est_bloque ? 'border-green-200 text-green-700 bg-green-50' : 'border-slate-200 text-slate-600 bg-slate-50']">
                    {{ u.est_bloque ? '✅ DÉBLOQUER' : '🚫 BLACKLISTER' }}
                 </button>
                 
                 <div class="flex gap-1 ml-auto">
                    <span :class="['text-[10px] font-bold px-2 py-1 rounded-full', u.email_verifie ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                        {{ u.email_verifie ? 'VÉRIFIÉ' : 'NON VÉRIFIÉ' }}
                    </span>
                    <span :class="['text-[10px] font-bold px-2 py-1 rounded-full', u.newsletter_acceptee ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400']">
                        {{ u.newsletter_acceptee ? 'NEWS' : 'NO NEWS' }}
                    </span>
                 </div>
            </div>
            
            <div v-if="u.est_bloque" class="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center -rotate-12 pointer-events-none opacity-50">
                <span class="text-4xl font-black text-red-600 border-4 border-red-600 px-4 py-1 rounded-xl uppercase tracking-widest">Blacklisté</span>
            </div>
        </div>
        
        <div v-if="utilisateurs.length === 0" class="text-center p-8 text-slate-400 italic">
            Aucun utilisateur trouvé.
        </div>
      </div>
    </div>

    <div v-if="modaleOuverte" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up mx-4">
        
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h3 class="text-xl font-serif font-bold text-[#0F172A]">
            {{ enEdition ? 'Modifier Utilisateur' : 'Créer Utilisateur' }}
          </h3>
          <button @click="fermerModale" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form @submit.prevent="soumettreFormulaire" class="p-6 space-y-6">
          
          <div v-if="!enEdition" class="flex gap-4 p-1 bg-slate-100 rounded-lg w-fit">
            <button type="button" @click="form.role = 'PARTICULIER'" 
              :class="['px-4 py-2 rounded-md text-sm font-bold transition-all', form.role === 'PARTICULIER' ? 'bg-white shadow text-[#0F172A]' : 'text-slate-500']">
              Particulier
            </button>
            <button type="button" @click="form.role = 'PRO'" 
              :class="['px-4 py-2 rounded-md text-sm font-bold transition-all', form.role === 'PRO' ? 'bg-[#0F172A] text-[#C5A059] shadow' : 'text-slate-500']">
              Professionnel
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <BaseInput v-model="form.email" label="Email" type="email" required class="md:col-span-2" />
             <BaseInput v-if="!enEdition" v-model="form.password" label="Mot de passe" type="password" required />
             <BaseInput v-else v-model="form.password" label="Nouveau Mot de passe (optionnel)" type="password" />
             
             <BaseInput v-model="form.adresse" label="Adresse" />
             <BaseInput v-model="form.ville" label="Ville" />
             <BaseInput v-model="form.code_postal" label="Code Postal" />
             <BaseInput v-model="form.pays" label="Pays" />

             <!-- Cases à cocher supprimées ici (Lecture seule uniquement, voir tableau) -->
          </div>

          <div v-if="form.role === 'PARTICULIER'" class="border-t border-slate-100 pt-4 mt-4">
            <h4 class="text-sm font-bold text-[#C5A059] uppercase tracking-wider mb-3">Infos Particulier</h4>
             <div class="grid grid-cols-2 gap-4">
                <BaseInput v-model="form.prenom" label="Prénom" />
                <BaseInput v-model="form.nom" label="Nom" />
                <BaseInput v-model.number="form.age" type="number" label="Âge" />
                <BaseInput v-model="form.photo_profil_url" label="URL Photo Profil" class="col-span-2 md:col-span-1" />
                
                <!-- Identité vérifiée en lecture seule uniquement -->
             </div>
          </div>

          <div v-if="form.role === 'PRO'" class="border-t border-slate-100 pt-4 mt-4 bg-slate-50 p-4 rounded-lg">
            <h4 class="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">Infos Pro</h4>
             <div class="grid grid-cols-2 gap-4">
                <BaseInput v-model="form.nom_entreprise" label="Nom Entreprise" required />
                <BaseInput v-model="form.siret" label="SIRET" required />
                <BaseInput v-model="form.site_web" label="Site Web" />
                <BaseInput v-model="form.kbis_url" label="URL K-Bis" />
                <BaseInput v-model="form.specialites" label="Spécialités" class="md:col-span-2" />
                
                <div class="col-span-2">
                     <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="form.assujetti_tva" class="w-4 h-4 rounded text-[#0F172A] focus:ring-[#0F172A]">
                        <span class="text-sm font-medium text-slate-700">Assujetti TVA</span>
                    </label>
                </div>
             </div>
          </div>

          <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" @click="fermerModale" class="px-5 py-2 rounded-lg text-slate-500 hover:bg-slate-50 font-medium text-sm">Annuler</button>
            <BaseButton type="submit" :loading="chargement" class="px-6 py-2 shadow-xl shadow-[#C5A059]/20">
              {{ enEdition ? 'Mettre à jour' : 'Créer' }}
            </BaseButton>
          </div>

        </form>
      </div>
    </div>

  </div>

     <!-- Modale Suppression -->
     <div v-if="modaleSuppressionOuverte" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
         
         <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 class="text-xl font-serif font-bold text-[#0F172A]">Confirmer la suppression</h3>
           <button @click="modaleSuppressionOuverte = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
         </div>
 
         <div class="p-6 text-center">
              <div class="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <p class="text-slate-600 mb-1">
                 Vous êtes sur le point de supprimer l'utilisateur
              </p>
              <p class="font-bold text-[#0F172A] text-lg mb-2">{{ utilisateurASupprimer?.email }}</p>
              <p class="text-xs text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 rounded px-2 py-1 inline-block">
                 ⚠️ Cette action est irréversible et supprimera toutes les données associées.
              </p>
         </div>
 
         <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
             <button @click="modaleSuppressionOuverte = false" class="px-5 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm font-medium text-sm transition-all">
                 Annuler
             </button>
             <BaseButton @click="effectuerSuppression" :loading="chargement" class="bg-[#C5A059] hover:bg-[#b08d4d] text-white px-6 py-2 rounded-lg shadow-lg shadow-[#C5A059]/20">
                 Supprimer Définitivement
             </BaseButton>
         </div>
 
       </div>
     </div>
 
     <!-- Modale Blacklist -->
     <div v-if="modaleBlacklistOuverte" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
         
         <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 class="text-xl font-serif font-bold text-[#0F172A]">
                {{ utilisateurABlacklister?.est_bloque ? 'Débloquer Utilisateur' : 'Blacklister Utilisateur' }}
           </h3>
           <button @click="modaleBlacklistOuverte = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
         </div>
 
         <div class="p-6 text-center">
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span class="text-3xl">{{ utilisateurABlacklister?.est_bloque ? '✅' : '🚫' }}</span>
              </div>
              <p class="text-slate-600 mb-1">
                 Vous allez {{ utilisateurABlacklister?.est_bloque ? 'débloquer' : 'blacklister' }} l'utilisateur
              </p>
              <p class="font-bold text-[#0F172A] text-lg mb-2">{{ utilisateurABlacklister?.email }}</p>
              <p v-if="!utilisateurABlacklister?.est_bloque" class="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1 inline-block">
                 ⚠️ L'utilisateur ne pourra plus se connecter à la plateforme.
              </p>
              <p v-else class="text-xs text-green-600 bg-green-50 border border-green-100 rounded px-2 py-1 inline-block">
                 L'utilisateur pourra à nouveau se connecter.
              </p>
         </div>
 
         <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
             <button @click="modaleBlacklistOuverte = false" class="px-5 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm font-medium text-sm transition-all">
                 Annuler
             </button>
             <BaseButton @click="effectuerBlacklist" :loading="chargement" class="bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-2 rounded-lg shadow-lg shadow-slate-200">
                 Confirmer
             </BaseButton>
         </div>
 
       </div>
     </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '../../components/BaseButton.vue' 
import BaseInput from '../../components/BaseInput.vue'

const utilisateurs = ref([])
const modaleOuverte = ref(false)
const modaleSuppressionOuverte = ref(false)
const modaleBlacklistOuverte = ref(false)
const utilisateurASupprimer = ref(null)
const utilisateurABlacklister = ref(null)
const enEdition = ref(false)
const chargement = ref(false)

const API_URL = 'http://localhost:3000/admin'

const form = reactive({
  id: null,
  role: 'PARTICULIER',
  email: '',
  password: '',
  adresse: '',
  ville: '',
  code_postal: '',
  pays: '',
  // Lecture seule pour ces champs désormais
  email_verifie: false,
  newsletter_acceptee: false,
  est_bloque: false,
  // Particulier
  prenom: '',
  nom: '',
  age: '',
  photo_profil_url: '',
  identite_verifiee: false,
  // Pro
  nom_entreprise: '',
  siret: '',
  site_web: '',
  kbis_url: '',
  specialites: '',
  assujetti_tva: false
})

const chargerUtilisateurs = async () => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs`)
    if(res.ok) {
        utilisateurs.value = await res.json()
    } else {
        alert('Erreur chargement utilisateurs')
    }
  } catch (e) {
    console.error('Erreur réseau', e)
  }
}

const ouvrirModaleCreation = () => {
  enEdition.value = false
  Object.assign(form, {
    id: null, role: 'PARTICULIER', email: '', password: '', adresse: '', ville: '', code_postal: '', pays: '',
    email_verifie: false, newsletter_acceptee: false,
    prenom: '', nom: '', age: '', photo_profil_url: '', identite_verifiee: false,
    nom_entreprise: '', siret: '', site_web: '', kbis_url: '', specialites: '', assujetti_tva: false
  })
  modaleOuverte.value = true
}

const editerUtilisateur = async (u) => {
    try {
        const res = await fetch(`${API_URL}/utilisateurs/${u.id}`)
        const details = await res.json()
        enEdition.value = true
        modaleOuverte.value = true
        
        form.id = details.id
        form.role = details.role
        form.email = details.email
        form.adresse = details.adresse
        form.ville = details.ville
        form.code_postal = details.code_postal
        form.pays = details.pays

        form.email_verifie = details.email_verifie
        form.newsletter_acceptee = details.newsletter_acceptee

        if(details.role === 'PARTICULIER') {
            form.prenom = details.prenom
            form.nom = details.nom
            form.age = details.age
            form.photo_profil_url = details.photo_profil_url
            form.identite_verifiee = details.identite_verifiee
        } else {
            form.nom_entreprise = details.nom_entreprise
            form.siret = details.siret
            form.site_web = details.site_web
            form.kbis_url = details.kbis_url
            form.specialites = details.specialites
            form.assujetti_tva = details.assujetti_tva
        }
    } catch(e) {
        alert('Erreur chargement détails')
    }
}

const soumettreFormulaire = async () => {
  chargement.value = true
  try {
    const url = enEdition.value ? `${API_URL}/utilisateurs/${form.id}` : `${API_URL}/utilisateurs`
    const method = enEdition.value ? 'PUT' : 'POST'
    const payload = { ...form }
    
    // Si pas de mdp en édition, on l'enlève pour pas écraser avec vide
    if(enEdition.value && !payload.password) delete payload.password 
    if(!enEdition.value && !payload.password) { alert('Mot de passe obligatoire'); chargement.value=false; return; } 

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if(res.ok) {
        modaleOuverte.value = false
        chargerUtilisateurs()
    } else {
        const err = await res.json()
        alert('Erreur: ' + JSON.stringify(err))
    }
  } catch (e) {
      alert("Erreur système")
  } finally {
      chargement.value = false
  }
}

const confirmerSuppression = (u) => {
    utilisateurASupprimer.value = u
    modaleSuppressionOuverte.value = true
}

const effectuerSuppression = async () => {
    if (!utilisateurASupprimer.value) return
    chargement.value = true
    try {
        const res = await fetch(`${API_URL}/utilisateurs/${utilisateurASupprimer.value.id}`, { method: 'DELETE' })
        if(res.ok) {
            chargerUtilisateurs()
            modaleSuppressionOuverte.value = false
        }
        else alert('Erreur suppression')
    } catch(e) {
        alert('Erreur réseau')
    } finally {
        chargement.value = false
        utilisateurASupprimer.value = null
    }
}

const ouvrirModaleBlacklist = (u) => {
    utilisateurABlacklister.value = u
    modaleBlacklistOuverte.value = true
}

const effectuerBlacklist = async () => {
    if(!utilisateurABlacklister.value) return;
    chargement.value = true
    
    const u = utilisateurABlacklister.value
    
    try {
        const resDetail = await fetch(`${API_URL}/utilisateurs/${u.id}`)
        const fullUser = await resDetail.json()
        
        fullUser.est_bloque = !fullUser.est_bloque
        
        const res = await fetch(`${API_URL}/utilisateurs/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullUser)
        })
        
        if(res.ok) {
            chargerUtilisateurs()
            modaleBlacklistOuverte.value = false
        } else {
            alert("Erreur blacklist")
        }
    } catch(e) {
        alert("Erreur connectivité")
    } finally {
        chargement.value = false
        utilisateurABlacklister.value = null
    }
}

const fermerModale = () => {
    modaleOuverte.value = false
}

onMounted(() => {
    chargerUtilisateurs()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
