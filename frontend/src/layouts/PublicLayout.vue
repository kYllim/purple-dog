<template>
  <div>
    <HeaderPublic />

    <main class="w-full min-h-screen bg-background text-text">
      <slot />
    </main>

    <FooterPublic />
  </div>
</template>

<script setup>
import HeaderPublic from '../components/HeaderPublic.vue';
import FooterPublic from '../components/FooterPublic.vue';
</script>
