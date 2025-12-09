<template>
  <div>
    <Navbar />

    <!-- HERO -->
    <section class="relative bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h1 class="text-5xl font-extrabold text-gray-900">
          Votre Espace Particulier
        </h1>

        <p class="mt-4 text-gray-700 text-lg max-w-xl mx-auto">
          Gérez vos objets, publiez de nouvelles ventes et suivez vos activités facilement.
        </p>

        <!-- CTA BUTTON -->
        <RouterLink
          to="/particulier/vendre"
          class="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-full shadow-lg text-lg font-semibold transition"
        >
          + Créer une nouvelle vente
        </RouterLink>
      </div>

      <!-- Decorative blobs -->
      <div class="absolute top-10 left-10 w-40 h-40 bg-white/50 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-56 h-56 bg-indigo-200/40 rounded-full blur-2xl"></div>
    </section>

    <!-- MES OBJETS -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-5xl mx-auto px-6">

        <h2 class="text-3xl font-bold text-gray-900 mb-8">
          Vos objets en vente
        </h2>

        <!-- Si aucun objet -->
        <div
          v-if="mesObjets.length === 0"
          class="p-10 bg-white rounded-3xl shadow text-center text-gray-500"
        >
          Vous n’avez encore ajouté aucun objet à la vente.
          <br />
          <RouterLink
            to="/particulier/vendre"
            class="text-indigo-600 font-semibold hover:underline"
          >
            Ajouter mon premier objet →
          </RouterLink>
        </div>

        <!-- Liste des objets -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-8">

          <div
            v-for="obj in mesObjets"
            :key="obj.id"
            class="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition"
          >
            <img
              :src="obj.image"
              class="w-full h-48 object-cover rounded-2xl mb-4"
              alt="objet"
            />

            <h3 class="text-xl font-bold text-gray-800">
              {{ obj.nom }}
            </h3>

            <p class="text-gray-600 mt-1 line-clamp-2">
              {{ obj.description }}
            </p>

            <div class="mt-4 font-semibold text-indigo-600">
              {{ obj.prix }} €
            </div>

            <RouterLink
              :to="`/dashboard/particulier/mes-objets/${obj.id}`"
              class="mt-3 inline-block text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              Voir détails →
            </RouterLink>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../../components/layout/NavBar.vue";

// ⛔ En vrai tu vas fetch depuis ton backend
const mesObjets = ref([]);

// Exemple test pour voir le rendu
onMounted(() => {
  // Simule quelques objets pour le design
  mesObjets.value = [
    {
      id: 1,
      nom: "Lampe vintage en cuivre",
      description: "Très bon état, fonctionne parfaitement.",
      prix: 45,
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800",
    },
    {
      id: 2,
      nom: "Chaise scandinave",
      description: "Bois clair, excellent état.",
      prix: 89,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
    },
  ];
});
</script>
