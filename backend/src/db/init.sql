
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE role_enum AS ENUM ('ADMIN', 'PRO', 'PARTICULIER');
CREATE TYPE statut_objet_enum AS ENUM ('BROUILLON', 'PUBLIE', 'VENDU', 'CLOS');
CREATE TYPE type_vente_enum AS ENUM ('ENCHERE', 'INSTANTANE');
CREATE TYPE statut_enchere_enum AS ENUM ('EN_ATTENTE', 'ACTIVE', 'TERMINEE', 'ANNULEE');
CREATE TYPE statut_offre_enum AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REJETEE', 'EXPIREE');
CREATE TYPE statut_paiement_enum AS ENUM ('EN_ATTENTE', 'PAYE', 'REMBOURSE');
CREATE TYPE statut_livraison_enum AS ENUM ('EN_ATTENTE', 'EXPEDIE', 'LIVRE', 'CONFIRME');
CREATE TYPE type_abonnement_enum AS ENUM ('GRATUIT_1_MOIS', 'PAYANT_ILLIMITE');

-- Tables

CREATE TABLE IF NOT EXISTS UTILISATEURS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role role_enum NOT NULL,
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(20),
    pays VARCHAR(100),
    email_verifie BOOLEAN DEFAULT FALSE,
    newsletter_acceptee BOOLEAN DEFAULT FALSE,
    token_verification VARCHAR(255),
    token_verification_expire TIMESTAMP,
    token_reset_password VARCHAR(255),
    token_reset_password_expire TIMESTAMP,
    est_bloque BOOLEAN DEFAULT FALSE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS DETAILS_PRO (
    utilisateur_id UUID PRIMARY KEY REFERENCES UTILISATEURS(id) ON DELETE CASCADE,
    nom_entreprise VARCHAR(255) NOT NULL,
    siret VARCHAR(50),
    kbis_url TEXT,
    site_web TEXT,
    specialites TEXT,
    assujetti_tva BOOLEAN DEFAULT FALSE,
    cgv_acceptees BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS DETAILS_PARTICULIER (
    utilisateur_id UUID PRIMARY KEY REFERENCES UTILISATEURS(id) ON DELETE CASCADE,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    age INT,
    photo_profil_url TEXT,
    identite_verifiee BOOLEAN DEFAULT FALSE,
    cgv_acceptees BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ABONNEMENTS_PRO (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES UTILISATEURS(id) ON DELETE CASCADE,
    type type_abonnement_enum NOT NULL,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP,
    est_actif BOOLEAN DEFAULT TRUE,
    stripe_subscription_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS CATEGORIES (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    taux_commission_acheteur FLOAT,
    taux_commission_vendeur FLOAT
);

CREATE TABLE IF NOT EXISTS OBJETS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendeur_id UUID REFERENCES UTILISATEURS(id),
    categorie_id UUID REFERENCES CATEGORIES(id),
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    dimensions JSONB, -- {longueur, largeur, hauteur, unite}
    poids_kg FLOAT,
    photos_urls TEXT[],
    documents_urls TEXT[],
    statut statut_objet_enum DEFAULT 'BROUILLON',
    type_vente type_vente_enum NOT NULL,
    prix_souhaite DECIMAL(10, 2),
    prix_depart DECIMAL(10, 2),
    prix_reserve DECIMAL(10, 2),
    prix_achat_immediat DECIMAL(10, 2),
    vente_rapide_active BOOLEAN DEFAULT FALSE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS FAVORIS (
    utilisateur_id UUID REFERENCES UTILISATEURS(id) ON DELETE CASCADE,
    objet_id UUID REFERENCES OBJETS(id) ON DELETE CASCADE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilisateur_id, objet_id)
);

CREATE TABLE IF NOT EXISTS ENCHERES (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objet_id UUID REFERENCES OBJETS(id) ON DELETE CASCADE,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    prix_actuel DECIMAL(10, 2),
    pas_enchere_min DECIMAL(10, 2),
    statut statut_enchere_enum DEFAULT 'EN_ATTENTE'
);

CREATE TABLE IF NOT EXISTS ENCHERES_OFFRES (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enchere_id UUID REFERENCES ENCHERES(id) ON DELETE CASCADE,
    encherisseur_id UUID REFERENCES UTILISATEURS(id),
    montant DECIMAL(10, 2) NOT NULL,
    montant_max_auto DECIMAL(10, 2),
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS OFFRES_ACHAT (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objet_id UUID REFERENCES OBJETS(id) ON DELETE CASCADE,
    acheteur_id UUID REFERENCES UTILISATEURS(id),
    montant DECIMAL(10, 2) NOT NULL,
    statut statut_offre_enum DEFAULT 'EN_ATTENTE',
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TRANSPORTEURS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    url_suivi_template TEXT,
    actif BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS COMMANDES (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objet_id UUID REFERENCES OBJETS(id),
    acheteur_id UUID REFERENCES UTILISATEURS(id),
    vendeur_id UUID REFERENCES UTILISATEURS(id),
    transporteur_id UUID REFERENCES TRANSPORTEURS(id),
    montant_total DECIMAL(10, 2) NOT NULL,
    commission_acheteur DECIMAL(10, 2),
    commission_vendeur DECIMAL(10, 2),
    frais_livraison DECIMAL(10, 2),
    stripe_payment_intent_id VARCHAR(255),
    statut_paiement statut_paiement_enum DEFAULT 'EN_ATTENTE',
    statut_livraison statut_livraison_enum DEFAULT 'EN_ATTENTE',
    numero_suivi VARCHAR(255),
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    livre_le TIMESTAMP
);

CREATE TABLE IF NOT EXISTS AVIS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auteur_id UUID REFERENCES UTILISATEURS(id),
    note INT CHECK (note >= 0 AND note <= 10),
    commentaire TEXT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
