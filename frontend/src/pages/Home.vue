<template>
  <PublicLayout>
    <div class="flex flex-col bg-background text-text">
      <Background 
        :title="heroData.title"
        :subtitle="heroData.subtitle"
        :background-image="heroData.backgroundImage"
      >
        <div class="flex flex-row gap-6 justify-center mt-6">
          <router-link 
            to="/auctions" 
            class="bg-accent hover:bg-[#b08d4d] text-white text-sm font-bold uppercase tracking-widest py-4 px-10 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Voir les enchères
          </router-link>
          <router-link 
            to="/estimate" 
            class="bg-transparent border border-white text-white hover:bg-white hover:text-text text-sm font-bold uppercase tracking-widest py-4 px-10 transition-all"
          >
            Mettre en vente
          </router-link>
        </div>
      </Background>

      <NotreHistoire 
        :description="historyData.description"
        :stats="historyData.stats"
      />

      <Carousel 
        :title="carouselData.title"
        :images="carouselData.images"
      />

      <Newsletter 
        :title="newsletterData.title" 
        :description="newsletterData.description"
      />
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import Background from '../components/home/Background.vue';
import Carousel from '../components/home/Carousel.vue';
import NotreHistoire from '../components/home/NotreHistoire.vue';
import Newsletter from '../components/home/Newsletter.vue';

import imgObjet1 from '/src/assets/img/objet1.jpg';
import imgObjet2 from '/src/assets/img/objet2.jpg';
import imgObjet3 from '/src/assets/img/objet3.jpg';
import imgObjet4 from '/src/assets/img/objet4.jpg';
import imgObjet5 from '/src/assets/img/objet5.jpg';

const heroData = ref({
  title: 'Objets de collection',
  subtitle: 'L\'excellence et la passion des objets d\'exception',
  backgroundImage: '/src/assets/img/illustration.jpg' 
});

const carouselData = ref({
  title: 'ENCHÈRES À LA UNE',
  images: [
    {
      src: imgObjet1,
      title: 'Discophone',
      description: 'Pour du hardrock'
    },
    {
      src: imgObjet2,
      title: 'Pièces d\'argent',
      description: 'Quincaillerie'
    },
    {
      src: imgObjet3,
      title: 'Montre de Poche',
      description: 'Horlogerie'
    },
    {
      src: imgObjet4,
      title: 'Livre ancien',
      description: 'Art Moderne'
    },
    {
      src: imgObjet5,
      title: 'Coffret surprise',
      description: 'Erkanter'
    }
  ]
});

const historyData = ref({
  description: `Depuis 1985, PurpleDog s'impose comme une référence incontournable dans le monde des enchères. Fondée par des passionnés d'art et d'histoire, notre maison a su traverser les époques en alliant tradition et innovation.
  
  Nous mettons un point d'honneur à sélectionner des pièces uniques et à offrir une expertise transparente et rigoureuse.`,
  stats: [
    { value: '35+', label: 'Années' },
    { value: '150M€', label: 'Volume' },
    { value: '12k', label: 'Lots' },
    { value: '100%', label: 'Passion' }
  ]
});

const newsletterData = ref({
  title: 'REJOIGNEZ LE CERCLE',
  description: 'Recevez en avant-première nos catalogues de vente et nos actualités exclusives.'
});

</script>
