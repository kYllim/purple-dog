<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto py-12 px-6 mt-12">
      <div v-if="loading" class="text-center py-20">
         <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i>
         <p class="mt-4 text-gray-500">Chargement de l'annonce...</p>
      </div>

      <div v-else-if="object" class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h1 class="text-2xl font-bold text-text">Modifier l'annonce</h1>
           <button @click="$router.go(-1)" class="text-gray-500 hover:text-text">
             <i class="fa-solid fa-xmark text-xl"></i>
           </button>
        </div>

        <form @submit.prevent="submitUpdate" class="p-8 space-y-8">
            
            <!-- Images Management -->
            <div class="space-y-4">
                <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Photos</label>
                
                <!-- Liste des photos existantes -->
                <div v-if="existingPhotos.length > 0" class="flex flex-wrap gap-4 mb-4">
                    <div v-for="(photo, index) in existingPhotos" :key="index" class="relative group w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img :src="photo" class="w-full h-full object-cover">
                        <button type="button" @click="removeExistingPhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Upload nouvelles photos -->
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input type="file" multiple accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                    <p class="text-gray-500 text-sm">Cliquez ou glissez pour ajouter de nouvelles photos</p>
                </div>

                <!-- Previews des nouvelles photos -->
                <div v-if="newPhotoPreviews.length > 0" class="flex flex-wrap gap-4 mt-4">
                     <div v-for="(preview, index) in newPhotoPreviews" :key="'new-' + index" class="relative group w-32 h-32 rounded-lg overflow-hidden border border-green-400">
                        <img :src="preview" class="w-full h-full object-cover">
                        <button type="button" @click="removeNewPhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                         <span class="absolute bottom-0 w-full bg-green-500 text-white text-xs text-center py-1">Nouvelle</span>
                    </div>
                </div>
            </div>

            <!-- Titre & Description -->
            <div class="space-y-6">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Titre de l'annonce</label>
                    <input v-model="form.titre" type="text" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Description détaillée</label>
                    <textarea v-model="form.description" rows="6" required class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors resize-none"></textarea>
                </div>
            </div>

            <!-- Dimensions & Poids -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Poids (kg)</label>
                    <input v-model.number="form.poids_kg" type="number" step="0.1" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" />
                </div>
                <!-- Dimensions composite -->
                 <div class="flex flex-col gap-2 col-span-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Dimensions (L x l x h en cm)</label>
                    <div class="flex gap-4">
                        <input v-model.number="form.dimensions.longueur" placeholder="L" type="number" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" />
                        <input v-model.number="form.dimensions.largeur" placeholder="l" type="number" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" />
                        <input v-model.number="form.dimensions.hauteur" placeholder="h" type="number" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" />
                    </div>
                </div>
            </div>

            <!-- Prix -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Prix souhaité (€)</label>
                    <input v-model.number="form.prix_souhaite" type="number" min="0" class="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-accent transition-colors" />
                    <p class="text-xs text-gray-400">Le prix que vous espérez en obtenir (informatif)</p>
                </div>

                <div class="flex flex-col gap-2">
                     <label class="text-sm font-bold uppercase tracking-wide text-gray-500">Type de vente</label>
                     <div class="w-full p-4 bg-gray-100 rounded-lg border border-gray-200 text-gray-600 cursor-not-allowed">
                        {{ object?.type_vente === 'ENCHERE' ? 'Enchère' : 'Vente Directe' }}
                     </div>
                </div>
            </div>

            <div class="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" @click="$router.go(-1)" class="px-6 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                    Annuler
                </button>
                <button type="submit" :disabled="saving" class="px-8 py-3 bg-accent text-white rounded-lg font-bold shadow-md hover:bg-black transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="!saving">Enregistrer les modifications</span>
                    <span v-else><i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Sauvegarde...</span>
                </button>
            </div>

        </form>
      </div>
      
      <div v-else class="text-center py-20 text-red-500">
          <i class="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
          <p>Impossible de charger l'objet.</p>
          <button @click="$router.go(-1)" class="mt-4 underline">Retour</button>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { objectService } from '../services/objectService';
import PublicLayout from '../layouts/PublicLayout.vue';

const route = useRoute();
const router = useRouter();
const objectId = route.params.id;

const loading = ref(true);
const saving = ref(false);
const object = ref(null);

const existingPhotos = ref([]);
const newPhotos = ref([]);
const newPhotoPreviews = ref([]);

const form = reactive({
    titre: '',
    description: '',
    prix_souhaite: null,
    poids_kg: null,
    dimensions: {
        longueur: '',
        largeur: '',
        hauteur: ''
    }
});

onMounted(async () => {
    try {
        const data = await objectService.getObjectById(objectId);
        object.value = data;
        
        // Populate form
        form.titre = data.titre;
        form.description = data.description;
        form.prix_souhaite = data.prix_souhaite;
        form.poids_kg = data.poids_kg;
        
        if (data.dimensions) {
            try {
                const dims = typeof data.dimensions === 'string' ? JSON.parse(data.dimensions) : data.dimensions;
                 if (dims) {
                    form.dimensions.longueur = dims.longueur || '';
                    form.dimensions.largeur = dims.largeur || '';
                    form.dimensions.hauteur = dims.hauteur || '';
                 }
            } catch(e) {}
        }
        
        // Photos
        if (data.photos_urls) {
             try {
                 existingPhotos.value = typeof data.photos_urls === 'string' ? JSON.parse(data.photos_urls) : data.photos_urls;
                 if (!Array.isArray(existingPhotos.value)) existingPhotos.value = [];
             } catch(e) { existingPhotos.value = []; }
        }

    } catch (error) {
        console.error("Erreur chargement objet", error);
    } finally {
        loading.value = false;
    }
});

const removeExistingPhoto = (index) => {
    existingPhotos.value.splice(index, 1);
};

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    newPhotos.value = [...newPhotos.value, ...files];
    
    // Generate previews
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            newPhotoPreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
};

const removeNewPhoto = (index) => {
    newPhotos.value.splice(index, 1);
    newPhotoPreviews.value.splice(index, 1);
};

const submitUpdate = async () => {
    saving.value = true;
    try {
        const formData = new FormData();
        formData.append('titre', form.titre);
        formData.append('description', form.description);
        if (form.prix_souhaite) formData.append('prix_souhaite', form.prix_souhaite);
        if (form.poids_kg) formData.append('poids_kg', form.poids_kg);
        
        formData.append('dimensions', JSON.stringify(form.dimensions));
        formData.append('existing_photos', JSON.stringify(existingPhotos.value));
        
        newPhotos.value.forEach(file => {
            formData.append('photos', file);
        });

        await objectService.updateObject(objectId, formData);
        
        // Pas d'alert, redirection directe
        router.go(-1); // Retour au dashboard
    } catch (error) {
        console.error("Erreur update", error);
        alert("Erreur lors de la modification.");
    } finally {
        saving.value = false;
    }
};
</script>
