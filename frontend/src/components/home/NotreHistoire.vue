<template>
  <section class="py-32 bg-background">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-20 items-center">
        
        <div class="space-y-8">
          <div class="inline-block px-4 py-1 border border-accent/50 rounded-full text-accent text-xs font-bold uppercase tracking-widest">
            À propos
          </div>
          <h2 class="text-4xl md:text-5xl font-serif text-text leading-tight">
            L'Art de la Vente <br />
            <span class="text-accent italic">depuis 1985</span>
          </h2>
          <div class="prose prose-lg text-slate-500 font-light leading-relaxed">
            <p class="whitespace-pre-line">
              {{ description }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="bg-white p-12 text-center group hover:bg-slate-50 transition-colors duration-500"
          >
            <div class="text-5xl font-serif text-accent mb-4 group-hover:scale-110 transition-transform duration-500">{{ stat.value }}</div>
            <div class="text-xs font-bold text-text uppercase tracking-[0.2em]">{{ stat.label }}</div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    required: true,
    default: 'Depuis sa création, PurpleDog s\'engage à offrir...'
  },
  stats: {
    type: Array,
    default: () => [
      { value: '10k+', label: 'Objets vendus' },
      { value: '98%', label: 'Satisfaction' },
      { value: '50', label: 'Experts' },
      { value: '24/7', label: 'Support' }
    ]
  }
})
</script>
