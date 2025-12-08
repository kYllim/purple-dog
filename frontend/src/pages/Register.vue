<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F1F5F9] font-sans">
    <div class="max-w-4xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C5A059]/10 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-2 bg-[#C5A059]"></div>
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-3xl"></div>

      <div class="text-center relative z-10">
        <h2 class="mt-2 text-4xl font-serif font-bold text-[#0F172A] tracking-widest uppercase">
          Rejoignez Purple Dog
        </h2>
        <p class="mt-2 text-sm text-gray-500 font-sans">
          La plateforme d'excellence pour la vente d'objets de valeur.
        </p>
      </div>

      <div class="flex justify-center mb-8 relative z-10">
        <div class="relative bg-gray-200/50 backdrop-blur-sm p-1 rounded-full flex w-80 shadow-inner border border-white/40">
          <div 
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            :class="role === 'PARTICULIER' ? 'translate-x-0' : 'translate-x-full'"
          >
            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white/80 to-transparent opacity-50"></div>
          </div>
          <button @click="role = 'PARTICULIER'" class="relative flex-1 py-2.5 rounded-full text-sm font-medium z-10 font-sans" :class="role === 'PARTICULIER' ? 'text-[#0F172A]' : 'text-gray-500'">Particulier</button>
          <button @click="role = 'PRO'" class="relative flex-1 py-2.5 rounded-full text-sm font-medium z-10 font-sans" :class="role === 'PRO' ? 'text-[#0F172A]' : 'text-gray-500'">Professionnel</button>
        </div>
      </div>

      <form class="space-y-6 relative z-10" @submit.prevent="soumettre">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="f.prenom" label="Prénom" required :error="e.prenom" placeholder="Erkant" />
          <BaseInput v-model="f.nom" label="Nom" required :error="e.nom" placeholder="YILDIZ" />
        </div>

        <BaseInput v-model="f.email" type="email" label="Email" required :error="e.email" placeholder="erkant.yildiz@gmail.com" />
        <BaseInput v-model="f.mdp" type="password" label="Mot de passe" required :error="e.mdp" placeholder="••••••••" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="f.adresse" label="Adresse" class="md:col-span-2" required :error="e.adresse" placeholder="10 Rue de la Paix" />
          <BaseInput v-model="f.ville" label="Ville" required :error="e.ville" placeholder="Paris" />
          <BaseInput v-model="f.codePostal" label="Code Postal" required :error="e.codePostal" placeholder="75001" />
          <BaseInput v-model="f.pays" label="Pays" required :error="e.pays" placeholder="France" />
        </div>

        <div v-if="role === 'PARTICULIER'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
             <BaseInput v-model.number="f.age" type="number" label="Âge" required :error="e.age" placeholder="25" />
          </div>
        </div>

        <div v-if="role === 'PRO'" class="space-y-6">
          <div class="border-t border-gray-100 pt-6">
            <h3 class="text-lg font-serif font-medium text-[#0F172A] mb-4 tracking-wider">Informations Entreprise</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="f.entreprise" label="Nom de l'entreprise" required :error="e.entreprise" placeholder="Purple Dog SAS" />
              <BaseInput v-model="f.siret" label="Numéro SIRET" required :error="e.siret" placeholder="123 456 789 00012" />
              <BaseInput v-model="f.kbis" label="URL K-Bis" required :error="e.kbis" placeholder="https://..." />
              <BaseInput v-model="f.site" label="Site Web" required :error="e.site" placeholder="https://..." />
              <BaseInput v-model="f.specialites" label="Spécialités" :error="e.specialites" placeholder="Luxe, Art..." class="md:col-span-2" />
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <label class="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" v-model="f.newsletter" class="mt-1 w-4 h-4 text-[#C5A059] border-gray-300 rounded focus:ring-[#C5A059]">
             <span class="text-sm text-gray-600">Newsletter</span>
          </label>
           <label class="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" v-model="f.cgv" required class="mt-1 w-4 h-4 text-[#C5A059] border-gray-300 rounded focus:ring-[#C5A059]">
             <span class="text-sm text-gray-600">J'accepte les <a href="#" class="text-[#C5A059] underline">CGV</a>.</span>
          </label>
           <p v-if="e.cgv" class="text-xs text-red-500 ml-7">{{ e.cgv }}</p>
        </div>

        <div class="pt-4">
          <BaseButton type="submit" class="w-full py-3 text-lg" :disabled="chargement">
            {{ chargement ? '...' : 'Créer mon compte' }}
          </BaseButton>
        </div>
        
        <p class="text-center text-sm text-gray-500">
          Déjà membre ? <router-link to="/login" class="font-medium text-[#C5A059]">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const role = ref('PARTICULIER')
const chargement = ref(false)
const e = reactive({})

const f = reactive({
  prenom: '',
  nom: '',
  email: '',
  mdp: '',
  adresse: '',
  ville: '',
  codePostal: '',
  pays: '',
  newsletter: false,
  cgv: false,
  age: '',
  entreprise: '',
  siret: '',
  kbis: '',
  site: '',
  specialites: ''
})

const valider = () => {
  Object.keys(e).forEach(k => delete e[k])
  let valid = true

  if (!f.prenom) { e.prenom = 'Requis'; valid = false }
  if (!f.nom) { e.nom = 'Requis'; valid = false }
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { e.email = 'Email invalide'; valid = false }
  if (!f.mdp || f.mdp.length < 6) { e.mdp = 'Min 6 car.'; valid = false }
  if (!f.adresse) { e.adresse = 'Requis'; valid = false }
  if (!f.ville) { e.ville = 'Requis'; valid = false }
  if (!f.codePostal) { e.codePostal = 'Requis'; valid = false }
  if (!f.pays) { e.pays = 'Requis'; valid = false }
  if (!f.cgv) { e.cgv = 'Requis'; valid = false }

  if (role.value === 'PARTICULIER') {
    if (!f.age || f.age < 18) { e.age = 'Majeur requis'; valid = false }
  } else {
    if (!f.entreprise) { e.entreprise = 'Requis'; valid = false }
    if (!f.siret) { e.siret = 'Requis'; valid = false }
    if (!f.kbis) { e.kbis = 'Requis'; valid = false }
    if (!f.site) { e.site = 'Requis'; valid = false }
  }
  return valid
}

const soumettre = async () => {
  if (!valider()) return
  chargement.value = true
  
  try {
    const url = `http://localhost:3000/auth/register/${role.value === 'PRO' ? 'pro' : 'individual'}`
    const data = role.value === 'PRO' 
      ? {
        email: f.email,
        password: f.mdp,
        company_name: f.entreprise,
        siret: f.siret,
        kbis_url: f.kbis,
        site_web: f.site,
        specialites: f.specialites,
        address: f.adresse,
        city: f.ville,
        zip_code: f.codePostal,
        country: f.pays
      }
      : {
        email: f.email,
        password: f.mdp,
        first_name: f.prenom,
        last_name: f.nom,
        age: f.age,
        address: f.adresse,
        city: f.ville,
        zip_code: f.codePostal,
        country: f.pays
      }

      await axios.post(url, data)
      router.push('/login')
  } catch (err) {
    if (err.response?.data?.error) alert(JSON.stringify(err.response.data.error))
    else alert('Erreur')
  } finally {
    chargement.value = false
  }
}
</script>
