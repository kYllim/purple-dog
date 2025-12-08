<template>
  <div>
    <HeaderPublic />

    <main class="container">
      <slot />
    </main>

    <FooterPublic />
  </div>
</template>

<script setup>
import HeaderPublic from '../components/HeaderPublic.vue';
import FooterPublic from '../components/FooterPublic.vue';
</script>
