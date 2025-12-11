import api from './api';

const serviceAdmin = {

    async recupererUtilisateurs() {
        return api.get('/admin/utilisateurs');
    },

    async recupererUtilisateur(id) {
        return api.get(`/admin/utilisateurs/${id}`);
    },

    async creerUtilisateur(data) {
        return api.post('/admin/utilisateurs', data);
    },

    async modifierUtilisateur(id, data) {
        return api.put(`/admin/utilisateurs/${id}`, data);
    },

    async supprimerUtilisateur(id) {
        return api.delete(`/admin/utilisateurs/${id}`);
    },


    async recupererObjets() {
        return api.get('/admin/objets');
    },

    async supprimerObjet(id) {
        return api.delete(`/admin/objets/${id}`);
    },

    async recupererFinance() {
        return api.get('/admin/finance');
    }
};

export default serviceAdmin;
