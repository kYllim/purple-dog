import api from './api';

const serviceObjets = {
    async recupererTout(params = {}) {
        return api.get('/objets', { params });
    },

    async recupererParId(id) {
        return api.get(`/objets/${id}`);
    },

    async recupererCategories() {
        return api.get('/objets/categories');
    },

    async creer(donneesFormulaire) {
        return api.post('/objets', donneesFormulaire, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    async recupererObjetsUtilisateur(idUtilisateur) {
        return api.get(`/objets/user/${idUtilisateur}`);
    },

    async placerEnchere(idObjet, { montant, montant_max_auto }) {
        return api.post(`/objets/${idObjet}/encherir`, { montant, montant_max_auto });
    },

    async faireOffre(idObjet, montant) {
        return api.post(`/objets/${idObjet}/offres`, { montant });
    }
};

export default serviceObjets;
