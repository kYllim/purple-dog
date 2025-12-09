<template>
    <Navbar />
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 class="text-2xl font-bold mb-6">Mettre un objet en vente</h1>

      <VendreObjetForm />
    </div>
</template>

<script setup>
import NavBar from "../../components/layout/NavBar.vue";
import VendreObjetForm from "../../components/objet/VendreObjetForm.vue";
</script>
