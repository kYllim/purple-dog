# Cahier des charges - PURPLE DOG

## Objectif
Créer une plateforme de vente d'objets de valeur entre vendeurs (particuliers ou professionnels) et acheteurs (professionnels uniquement).

## Acteurs
- **Particuliers**: Vendent des objets uniquement.
- **Professionnels**: Achètent et vendent des objets.
- **Administrateurs (Nous)**: Gestion de la plateforme via Back Office.

## Fonctionnalités Principales

### Homepage
- Modulable, orientée marketing.
- Header: Logo, Connexion, Inscription.
- Bandeau: Carrousel (5 images), descriptifs, résultats passés.
- Catégories: Grille 5x2.
- Présentation: "LA plateforme pour vendre mieux vos objets de valeurs à des tiers de confiance".
- Newsletter: Inscription.
- Footer: Mentions Légales, Qui Sommes-Nous, Contact.

### Inscription & Connexion
- **Particuliers**:
    - Champs: Nom, Prénom, Photo, Email, Adresse, MDP, Âge (>18), Newsletter/RGPD.
    - Anonymat: Seul le prénom est visible pour les pros.
    - Validation email.
    - *Challenge*: Anonymisation contact, Validation identité (CNI).
- **Professionnels**:
    - Champs: Nom, Prénom, Email, Entité, SIRET, Document (K-Bis), Adresse, MDP, Site web, Spécialités, Newsletter/RGPD, Mandat.
    - Validation email.
    - *Challenge*: Validation API Gouv SIRET.
- **Forfaits**:
    - Particulier: Gratuit.
    - Pro: 1 mois gratuit puis 49€/mois (Accès illimité).
    - *Challenge*: Modèle évolutif "déblocage features".

### Dashboards

#### 1. Dashboard Professionnel (Acheteur/Vendeur)
- **Feature 1: Vendre un objet**
    - Formulaire: Nom, Catégorie, Dimensions, Poids, Description, Docs (Certificat), Photos (10 min), Prix souhaité.
    - Modes: "Enchères" (défaut 1 semaine, départ -10%) ou "Vente rapide".
    - *Challenge*: IA estimation prix.
- **Feature 2: Mes objets en vente**
    - Liste objets publiés/vendus.
    - Offres reçues, Messages.
    - Notifications (Mail + Pastille).
    - Passage mode Enchère/Vente rapide si pas d'offre.
    - *Challenge*: IA modération messages (anti-démarchage).
- **Feature 3: Favoris / Historique**
    - Objets likés, Offres faites, Enchères, Historique achats/pertes.
- **Feature 4: Recherche d'objet**
    - Filtres: Prix, Type vente, Catégorie, Statut.
    - Recherche textuelle.
    - *Challenge*: Suggestion auto, Notifications avancées (Surenchère, Fin enchère).
    - Enchères: Voir montant en cours, Enchérir (Paliers auto).
    - Vente rapide: Liker, Faire offre (1ère offre au prix gagne).
    - Validation achat sous 24h.
- **Feature 5: Profil**
    - Gestion infos perso.
- **Feature 6: Avis**
    - Note (étoiles/NPS) + Commentaire.

#### 2. Dashboard Particulier (Vendeur uniquement)
- **Feature 1: Vendre un objet** (Idem Pro)
    - *Challenge*: Voir tendances.
- **Feature 2: Mes objets en vente** (Idem Pro)
- **Feature 3: Profil**
- **Feature 4: Avis**

#### 3. Dashboard Back Office
- Commissions (Global/Catégorie).
- Formulaires dépôt.
- Catégories.
- Gestion Utilisateurs (Création/Blocage).
- Ventes en cours/terminées.
- Compta / Stripe / Livraison.
- Avis.

### Paiement & Logistique
- **Paiement**: Stripe (Mode Test).
- **Flux**:
    1. Acheteur valide achat -> Paiement (Bloqué).
    2. Vendeur notifié -> Prépare colis.
    3. Transporteur récupère -> Livre.
    4. Acheteur valide réception -> Fonds débloqués (3-5 jours).
- **Transport**: Choix liste transporteurs (Gérés par Admin).
    - *Challenge*: Mock API Transporteurs (Adapter Pattern).
- **Commissions**:
    - Acheteur: Prix + Livraison + 3% comm.
    - Vendeur: Prix - 2% comm.

## Contraintes Techniques
1.  **Type**: Web App Responsive (PWA). Pas de mobile natif.
2.  **Infra**: VPS, Dockerisé (Web, API, DB).
    - *Note*: Usage de Docker Compose.
3.  **IA**: **OLLAMA OBLIGATOIRE** (Container Docker). Pas d'API externes (OpenAI/Gemini interdits).
4.  **Paiement**: Stripe (Test).
5.  **Livraison**: Mocks avec Pattern **Adapter**.
6.  **Real-time**: SSE ou WebSockets. Polling interdit.
7.  **Tech Stack**: Libre (à documenter).

## Système d'Enchères (Règles spécifiques)
- Durée: 1 semaine défaut.
- Prolongation: +10min si enchère à H-1 (règle "H-1" ou "dernières minutes"? À vérifier, texte dit "à h-1 de la fin").
- Paliers: 10€ (<100€), 50€ (100-500€), etc.
- Enchère automatique (Max bid).
