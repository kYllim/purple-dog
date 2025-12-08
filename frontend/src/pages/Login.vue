<template>
  <PublicLayout>
    <h2>Connexion</h2>
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mot de passe" />
      <button>Se connecter</button>
    </form>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue';
</script>
