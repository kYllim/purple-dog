<template>
  <div class="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
    
    <div class="mb-8">
      <h1 class="text-3xl font-serif font-bold text-[#0F172A]">Gestion des Utilisateurs</h1>
      <p class="text-slate-500 mt-1">Administrez les comptes particuliers et professionnels.</p>
    </div>

    <div class="animate-fade-in-up">
      
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-xl font-bold text-slate-700">Liste des Comptes</h2>
        <BaseButton @click="ouvrirModaleCreation" class="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2 rounded-lg shadow-lg shadow-slate-200 text-sm">
          + Nouvel Utilisateur
        </BaseButton>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th class="p-4">Rôle</th>
              <th class="p-4">Email / Identité</th>
              <th class="p-4">Détails</th>
              <th class="p-4">Créé le</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="u in utilisateurs" :key="u.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="p-4">
                <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', u.role === 'PRO' ? 'bg-[#0F172A] text-[#C5A059]' : 'bg-slate-100 text-slate-600']">
                  {{ u.role }}
                </span>
              </td>
              <td class="p-4">
                <div class="font-bold text-slate-800">{{ u.email }}</div>
                <div class="text-xs text-slate-400">ID: {{ u.id.substring(0,8) }}...</div>
              </td>
              <td class="p-4 text-slate-600">
                 <div v-if="u.role === 'PRO'">
                   <span class="block font-medium">{{ u.nom_entreprise }}</span>
                   <span class="text-xs">SIRET: {{ u.siret }}</span>
                 </div>
                 <div v-else>
                   <span class="block font-medium">{{ u.prenom }} {{ u.nom }}</span>
                   <span class="text-xs">{{ u.age ? u.age + ' ans' : '-' }}</span>
                 </div>
              </td>
              <td class="p-4 text-slate-500">
                {{ new Date(u.cree_le).toLocaleDateString() }}
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>

    <div v-if="modaleOuverte" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
        
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
             <BaseInput v-model="form.adresse" label="Adresse" />
             <BaseInput v-model="form.ville" label="Ville" />
             <BaseInput v-model="form.code_postal" label="Code Postal" />
             <BaseInput v-model="form.pays" label="Pays" />
          </div>

          <div v-if="form.role === 'PARTICULIER'" class="border-t border-slate-100 pt-4 mt-4">
            <h4 class="text-sm font-bold text-[#C5A059] uppercase tracking-wider mb-3">Infos Particulier</h4>
            <div class="grid grid-cols-2 gap-4">
               <BaseInput v-model="form.prenom" label="Prénom" />
               <BaseInput v-model="form.nom" label="Nom" />
               <BaseInput v-model.number="form.age" type="number" label="Âge" />
            </div>
          </div>

          <div v-if="form.role === 'PRO'" class="border-t border-slate-100 pt-4 mt-4 bg-slate-50 p-4 rounded-lg">
            <h4 class="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">Infos Pro</h4>
            <div class="grid grid-cols-2 gap-4">
               <BaseInput v-model="form.nom_entreprise" label="Nom Entreprise" required />
               <BaseInput v-model="form.siret" label="SIRET" required />
               <BaseInput v-model="form.site_web" label="Site Web" />
               <BaseInput v-model="form.specialites" label="Spécialités" class="md:col-span-2" />
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '../../components/BaseButton.vue' 
import BaseInput from '../../components/BaseInput.vue'

const utilisateurs = ref([])
const modaleOuverte = ref(false)
const modaleSuppressionOuverte = ref(false)
const utilisateurASupprimer = ref(null)
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
  prenom: '',
  nom: '',
  age: '',
  nom_entreprise: '',
  siret: '',
  site_web: '',
  specialites: ''
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
    prenom: '', nom: '', age: '', nom_entreprise: '', siret: '', site_web: '', specialites: ''
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
        form.country = details.pays

        if(details.role === 'PARTICULIER') {
            form.prenom = details.prenom
            form.nom = details.nom
            form.age = details.age
        } else {
            form.nom_entreprise = details.nom_entreprise
            form.siret = details.siret
            form.site_web = details.site_web
            form.specialites = details.specialites
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
    if(enEdition.value) delete payload.password 

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
