<template>
  <div>
    <HeaderProfessionnel />

    <main class="w-full min-h-screen bg-background text-text">
      <slot />
    </main>

    <FooterPublic />
  </div>
</template>

<script setup>
import HeaderProfessionnel from '../components/HeaderProfessionnel.vue';
import FooterPublic from '../components/FooterPublic.vue';
</script>
