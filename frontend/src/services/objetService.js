import api from './api';

const objetService = {
  async creerObjet(data) {
  const payload = {
    titre: data.titre,
    description: data.description || '',
    categorie: data.categorie_id ? String(data.categorie_id) : '',
    type_vente: data.type_vente === "INSTANTANE" ? "Vente rapide" : "Encheres",
    prix_souhaite: data.prix_souhaite ? Number(data.prix_souhaite) : null,
    prix_depart: data.prix_depart ? Number(data.prix_depart) : null,
    prix_achat_immediat: data.prix_achat_immediat ? Number(data.prix_achat_immediat) : null,
    photos: Array.isArray(data.photos) ? data.photos : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
  };

  console.log('Payload envoyé au backend :', payload);

  return api.post('/objets', payload);
},

  async listerObjets(filters) {
    const response = await api.get('/objets', { params: filters });
    return response.data;
  },

  async voirObjet(id) {
    const response = await api.get(`/objets/${id}`);
    return response.data;
  },
};

export default objetService;
