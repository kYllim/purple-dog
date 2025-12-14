<template>
  <div>
    <HeaderParticulier />

    <main class="w-full min-h-screen bg-background text-text">
      <slot />
    </main>

    <FooterPublic />
  </div>
</template>

<script setup>
import HeaderParticulier from '../components/HeaderParticulier.vue';
import FooterPublic from '../components/FooterPublic.vue';
</script>
