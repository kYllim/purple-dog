<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F1F5F9] font-sans">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C5A059]/10 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-2 bg-[#C5A059]"></div>
      <div class="text-center relative z-10">
        <h2 class="mt-2 text-4xl font-serif font-bold text-[#0F172A] tracking-widest uppercase">Connexion</h2>
        <p class="mt-2 text-sm text-gray-500 font-sans">Espace Purple Dog</p>
      </div>

      <form class="space-y-6 relative z-10" @submit.prevent="connexion">
        <BaseInput v-model="f.email" type="email" label="Email" requis :erreur="e.email" placeholder="erkant.yildiz@mail.com" />
        
        <div class="space-y-1">
          <BaseInput v-model="f.mdp" type="password" label="Mot de passe" requis :erreur="e.mdp" placeholder="••••••••" />
          <div class="flex justify-end">
            <a href="#" class="text-xs text-[#C5A059] hover:underline">Mot de passe oublié ?</a>
          </div>
        </div>

        <div class="pt-4">
          <BaseButton type="submit" class="w-full py-3 text-lg" :desactive="chargement">
             <template #prefix>
                <span v-if="!chargement"></span>
             </template>
            {{ chargement ? '...' : 'Se connecter' }}
          </BaseButton>
        </div>
        
        <p class="text-center text-sm text-gray-500">
          Pas de compte ? <router-link to="/register" class="font-medium text-[#C5A059]">S'inscrire</router-link>
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
const chargement = ref(false)
const e = reactive({})

const f = reactive({
  email: '',
  mdp: ''
})

const valider = () => {
  Object.keys(e).forEach(k => delete e[k])
  let ok = true
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { e.email = 'Invalide'; ok = false }
  if (!f.mdp) { e.mdp = 'Requis'; ok = false }
  return ok
}

const connexion = async () => {
  if (!valider()) return
  chargement.value = true
  try {
    const res = await axios.post('http://localhost:3000/auth/login', { email: f.email, password: f.mdp })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    router.push('/')
  } catch (err) {
    alert(err.response?.data?.error || 'Erreur')
  } finally {
    chargement.value = false
  }
}
</script>
