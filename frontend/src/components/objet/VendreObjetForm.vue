<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">

    <!-- Titre -->
    <div>
      <label class="block font-medium mb-1">Titre de l'objet</label>
      <input
        v-model="form.titre"
        type="text"
        class="w-full border px-3 py-2 rounded"
        placeholder="Ex : Montre Omega vintage"
        required
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block font-medium mb-1">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        class="w-full border px-3 py-2 rounded"
        placeholder="Décrivez votre objet"
        required
      ></textarea>
    </div>

    <!-- Catégorie -->
    <div>
      <label class="block font-medium mb-1">Catégorie</label>
      <select v-model="form.categorie_id" class="w-full border px-3 py-2 rounded" required>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.nom }}
        </option>
      </select>
    </div>

    <!-- Dimensions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block font-medium mb-1">Longueur</label>
        <input v-model="form.dimensions.longueur" type="number" class="w-full border px-2 py-1 rounded" required />
      </div>
      <div>
        <label class="block font-medium mb-1">Largeur</label>
        <input v-model="form.dimensions.largeur" type="number" class="w-full border px-2 py-1 rounded" required />
      </div>
      <div>
        <label class="block font-medium mb-1">Hauteur</label>
        <input v-model="form.dimensions.hauteur" type="number" class="w-full border px-2 py-1 rounded" required />
      </div>
      <div>
        <label class="block font-medium mb-1">Unité</label>
        <select v-model="form.dimensions.unite" class="w-full border px-2 py-1 rounded">
          <option value="cm">cm</option>
          <option value="m">m</option>
        </select>
      </div>
    </div>

    <!-- Poids -->
    <div>
      <label class="block font-medium mb-1">Poids (kg)</label>
      <input v-model="form.poids_kg" type="number" step="0.01" class="w-full border px-3 py-2 rounded" required />
    </div>

    <!-- Photos -->
    <div>
      <label class="block font-medium mb-1">Photos (minimum 10)</label>
      <PhotosUploader v-model="form.photos_urls" />
    </div>

    <!-- Documents -->
    <div>
      <label class="block font-medium mb-1">Documents (certificat, facture)</label>
      <PhotosUploader v-model="form.documents_urls" :multiple="true" />
    </div>

    <!-- Type de vente -->
    <div>
      <label class="block font-medium mb-1">Type de vente</label>
      <select v-model="form.type_vente" class="w-full border px-3 py-2 rounded" required>
        <option value="ENCHERE">Enchère</option>
        <option value="INSTANTANE">Vente rapide</option>
      </select>
    </div>

    <!-- Prix -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block font-medium mb-1">Prix souhaité</label>
        <input v-model="form.prix_souhaite" type="number" class="w-full border px-3 py-2 rounded" required />
      </div>

      <div v-if="form.type_vente === 'ENCHERE'">
        <label class="block font-medium mb-1">Prix départ (-10%)</label>
        <input v-model="form.prix_depart" type="number" disabled class="w-full border px-3 py-2 rounded bg-gray-100" />
      </div>

      <div v-if="form.type_vente === 'INSTANTANE'">
        <label class="block font-medium mb-1">Prix vente rapide</label>
        <input v-model="form.prix_achat_immediat" type="number" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <button type="submit" class="bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition">
      Publier l'objet
    </button>

  </form>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import { api } from "../../services/api";
import PhotosUploader from "./PhotosUploader.vue";



// categories récupérées depuis ton backend
const categories = reactive([]);

onMounted(async () => {
  const res = await api.get("/objets/categories");
  categories.push(...res.data);
});

// formulaire
const form = reactive({
  titre: "",
  description: "",
  categorie_id: null,
  dimensions: { longueur: 0, largeur: 0, hauteur: 0, unite: "cm" },
  poids_kg: 0,
  photos_urls: [],
  documents_urls: [],
  type_vente: "INSTANTANE",
  prix_souhaite: 0,
  prix_depart: 0,
  prix_achat_immediat: 0
});

// Calcul automatique du prix de départ
watch(
  () => form.prix_souhaite,
  (value) => {
    if (form.type_vente === "ENCHERE") {
      form.prix_depart = value * 0.9;
    }
  }
);

// Soumission du formulaire
const handleSubmit = async () => {
  try {
    if (form.photos_urls.length < 10) {
      return alert("Vous devez ajouter au moins 10 photos.");
    }

    if (form.type_vente === "ENCHERE") {
      form.prix_depart = form.prix_souhaite * 0.9;
    }

    const res = await api.post("/objets", form, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    });

    alert("Objet publié !");
    console.log(res.data);

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Erreur lors de la création de l'objet");
  }
};
</script>
