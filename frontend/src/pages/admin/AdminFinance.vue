<template>
  <div class="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
    
    <div class="mb-8">
      <h1 class="text-3xl font-serif font-bold text-[#0F172A]">Finance & Commissions</h1>
      <p class="text-slate-500 mt-1">Vue d'ensemble des revenus et transactions de la plateforme.</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
    </div>

    <div v-else class="animate-fade-in-up space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <p class="text-slate-500 text-sm font-bold uppercase tracking-wider relative z-10">Volume Ventes Total</p>
          <div class="text-3xl font-black text-[#0F172A] mt-2 relative z-10">{{ formatPrice(stats.total_volume) }}</div>
          <div class="text-xs text-slate-400 mt-1 relative z-10">Montant total transité</div>
        </div>

        <div class="bg-[#0F172A] p-6 rounded-2xl shadow-lg shadow-slate-200 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#C5A059]/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <p class="text-[#C5A059] text-sm font-bold uppercase tracking-wider relative z-10">Revenu Net (Commissions)</p>
          <div class="text-3xl font-black text-white mt-2 relative z-10">{{ formatPrice(stats.total_revenue) }}</div>
          <div class="text-xs text-slate-400 mt-1 relative z-10">Cumul Acheteur + Vendeur</div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <p class="text-slate-500 text-sm font-bold uppercase tracking-wider relative z-10">Commissions Acheteurs (3%)</p>
          <div class="text-3xl font-black text-green-600 mt-2 relative z-10">{{ formatPrice(stats.total_comm_acheteur) }}</div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <p class="text-slate-500 text-sm font-bold uppercase tracking-wider relative z-10">Commissions Vendeurs (2%)</p>
          <div class="text-3xl font-black text-orange-600 mt-2 relative z-10">{{ formatPrice(stats.total_comm_vendeur) }}</div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-700 mb-4">Dernières Transactions (50)</h2>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th class="p-4 w-32">Date</th>
                            <th class="p-4">Objet</th>
                            <th class="p-4">Vendeur / Acheteur</th>
                            <th class="p-4 text-right">Montant</th>
                            <th class="p-4 text-right text-green-600">Comm. Ach.</th>
                            <th class="p-4 text-right text-orange-600">Comm. Vend.</th>
                            <th class="p-4 text-right">Statut</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr v-for="t in transactions" :key="t.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4 text-slate-500 font-mono text-xs">{{ formatDate(t.date) }}</td>
                            <td class="p-4 font-bold text-slate-700">{{ t.objet_titre }}</td>
                            <td class="p-4">
                                <div class="text-xs">
                                    <span class="font-bold text-slate-600">V:</span> {{ t.vendeur_email }}<br>
                                    <span class="font-bold text-slate-600">A:</span> {{ t.acheteur_email }}
                                </div>
                            </td>
                            <td class="p-4 text-right font-bold text-slate-800">{{ formatPrice(t.montant_total) }}</td>
                            <td class="p-4 text-right font-medium text-green-600">+{{ formatPrice(t.commission_acheteur) }}</td>
                            <td class="p-4 text-right font-medium text-orange-600">+{{ formatPrice(t.commission_vendeur) }}</td>
                            <td class="p-4 text-right">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                    {{ t.statut_paiement }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="transactions.length === 0">
                            <td colspan="7" class="p-8 text-center text-slate-400 italic">Aucune transaction enregistrée.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import serviceAdmin from '../../services/adminService';

const loading = ref(true);
const stats = ref({
    total_volume: 0,
    total_comm_acheteur: 0,
    total_comm_vendeur: 0,
    total_revenue: 0,
    total_transactions: 0
});
const transactions = ref([]);

const loadData = async () => {
    loading.value = true;
    try {
        const res = await serviceAdmin.recupererFinance();
        if (res.data) {
            stats.value = res.data.stats;
            transactions.value = res.data.transactions;
        }
    } catch (e) {
        console.error("Erreur chargement finance", e);
    } finally {
        loading.value = false;
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
