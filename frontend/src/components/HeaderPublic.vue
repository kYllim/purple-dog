<template>
  <header class="header">
    <h2>PurpleDog</h2>
    <nav>
      <router-link to="/">Accueil</router-link>
      <router-link to="/login">Se connecter</router-link>
      <router-link to="/register">S’inscrire</router-link>
    </nav>
  </header>
</template>

<script setup>
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
</style>
