-- Données de test

-- Catégories
INSERT INTO CATEGORIES (id, nom, slug, taux_commission_acheteur, taux_commission_vendeur)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Art & Peinture', 'art-peinture', 5, 8),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mobilier', 'mobilier', 5, 8),
  ('550e8400-e29b-41d4-a716-446655440003', 'Bijoux', 'bijoux', 10, 15);

-- Utilisateurs avec mot de passe 'password123' hashé
INSERT INTO UTILISATEURS (id, email, mot_de_passe_hash, role, adresse, ville, code_postal, pays, email_verifie)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440011', 'vendeur@test.fr', '$2a$10$YIX5R8VZNmG/i1ZqTb.aOO3tMJnEH8Mk5RfW9N4e5v9q8Zk2K7V5K', 'PARTICULIER', '123 rue Test', 'Paris', '75000', 'France', true),
  ('550e8400-e29b-41d4-a716-446655440012', 'acheteur@test.fr', '$2a$10$YIX5R8VZNmG/i1ZqTb.aOO3tMJnEH8Mk5RfW9N4e5v9q8Zk2K7V5K', 'PARTICULIER', '456 rue Test', 'Lyon', '69000', 'France', true);

-- Détails particulier
INSERT INTO DETAILS_PARTICULIER (utilisateur_id, prenom, nom, age, identite_verifiee, cgv_acceptees)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440011', 'Jean', 'Dupont', 45, true, true),
  ('550e8400-e29b-41d4-a716-446655440012', 'Marie', 'Martin', 35, true, true);

-- Objets
INSERT INTO OBJETS (id, vendeur_id, categorie_id, titre, description, statut, type_vente, prix_achat_immediat, prix_souhaite, photos_urls)
VALUES 
  -- VENTE RAPIDE 1 (ACHAT)
  ('550e8400-e29b-41d4-a716-446655440021', 
   '550e8400-e29b-41d4-a716-446655440011',
   '550e8400-e29b-41d4-a716-446655440001',
   'Tableau abstrait moderne',
   'Huile sur toile, excellent état. Ce tableau représente une fusion harmonieuse de couleurs et de formes géométriques.',
   'VENDU',
   'INSTANTANE',
   1500,
   1500,
   ARRAY[
     'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1561214115-6d2f1b0c0052?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1578052177622-260ae8517603?w=800&h=800&fit=crop'
   ]),
  
  -- VENTE RAPIDE 2 (PROPOSITION)
  ('550e8400-e29b-41d4-a716-446655440025', 
   '550e8400-e29b-41d4-a716-446655440011',
   '550e8400-e29b-41d4-a716-446655440001',
   'Sculpture en marbre blanc',
   'Sculpture figurative d''époque classique, très bon état. Pièce authentique de grande qualité.',
   'PUBLIE',
   'INSTANTANE',
   3500,
   3500,
   ARRAY[
     'https://images.unsplash.com/photo-1578887981597-2ac03c9a9a32?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1578887981597-2ac03c9a9a32?w=800&h=800&fit=crop'
   ]),
  
  -- ENCHÈRE ACTIVE (ENCHÈRES PARTICIPÉES)
  ('550e8400-e29b-41d4-a716-446655440022',
   '550e8400-e29b-41d4-a716-446655440011',
   '550e8400-e29b-41d4-a716-446655440002',
   'Bureau vintage en bois',
   'Mobilier des années 1960, très bon état. Ce bureau en bois massif offre un style rétro authentique avec ses tiroirs spacieux et sa surface de travail généreuse.',
   'PUBLIE',
   'ENCHERE',
   NULL,
   800,
   ARRAY[
     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop'
   ]),
  
  -- BIJOUX ACHETÉ
  ('550e8400-e29b-41d4-a716-446655440023',
   '550e8400-e29b-41d4-a716-446655440011',
   '550e8400-e29b-41d4-a716-446655440003',
   'Collier en or 18 carats',
   'Chaîne fine, poids 5g',
   'VENDU',
   'INSTANTANE',
   2200,
   2200,
   ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop']),
  
  -- ENCHÈRE PERDUE
  ('550e8400-e29b-41d4-a716-446655440024',
   '550e8400-e29b-41d4-a716-446655440011',
   '550e8400-e29b-41d4-a716-446655440003',
   'Montre de gousset ancienne',
   'Montre de gousset en or blanc, mécanisme suisse, début du XXème siècle.',
   'VENDU',
   'ENCHERE',
   NULL,
   3000,
   ARRAY[
     'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
     'https://images.unsplash.com/photo-1524592094714-0c6655c9674d?w=800&h=800&fit=crop'
   ]);

-- Enchères
INSERT INTO ENCHERES (id, objet_id, date_debut, date_fin, prix_actuel, pas_enchere_min, statut)
VALUES 
  -- Enchère active (Bureau vintage)
  ('550e8400-e29b-41d4-a716-446655440031',
   '550e8400-e29b-41d4-a716-446655440022',
   NOW(),
   NOW() + INTERVAL '7 days',
   600,
   50,
   'ACTIVE'),
  
  -- Enchère perdue (Montre de gousset) - TERMINEE
  ('550e8400-e29b-41d4-a716-446655440033',
   '550e8400-e29b-41d4-a716-446655440024',
   NOW() - INTERVAL '7 days',
   NOW() - INTERVAL '1 day',
   3500,
   100,
   'TERMINEE');

-- Offres d'achat (PROPOSITIONS - uniquement sur INSTANTANE)
INSERT INTO OFFRES_ACHAT (id, objet_id, acheteur_id, montant, statut, cree_le)
VALUES 
  -- Proposition sur Sculpture (025)
  ('650e8400-e29b-41d4-a716-446655440041',
   '550e8400-e29b-41d4-a716-446655440025',
   '550e8400-e29b-41d4-a716-446655440012',
   3000,
   'EN_ATTENTE',
   NOW());

-- Enchères offres (ENCHÈRES PARTICIPÉES)
INSERT INTO ENCHERES_OFFRES (id, enchere_id, encherisseur_id, montant, montant_max_auto, cree_le)
VALUES 
  -- Enchère active (031 - Bureau)
  ('750e8400-e29b-41d4-a716-446655440051',
   '550e8400-e29b-41d4-a716-446655440031',
   '550e8400-e29b-41d4-a716-446655440012',
   650,
   1000,
   NOW()),
  
  -- Enchère perdue (033 - Montre) - l'acheteur a participé mais a perdu
  ('750e8400-e29b-41d4-a716-446655440053',
   '550e8400-e29b-41d4-a716-446655440033',
   '550e8400-e29b-41d4-a716-446655440012',
   3200,
   3500,
   NOW() - INTERVAL '2 days');

-- Commandes (ACHATS)
INSERT INTO COMMANDES (id, objet_id, acheteur_id, vendeur_id, montant_total, commission_acheteur, commission_vendeur, statut_paiement, statut_livraison, cree_le)
VALUES 
  -- Achat du collier (023)
  ('850e8400-e29b-41d4-a716-446655440061',
   '550e8400-e29b-41d4-a716-446655440023',
   '550e8400-e29b-41d4-a716-446655440012',
   '550e8400-e29b-41d4-a716-446655440011',
   2200,
   110,
   176,
   'PAYE',
   'LIVRE',
   NOW() - INTERVAL '10 days'),
  
  -- Achat du tableau (021)
  ('850e8400-e29b-41d4-a716-446655440062',
   '550e8400-e29b-41d4-a716-446655440021',
   '550e8400-e29b-41d4-a716-446655440012',
   '550e8400-e29b-41d4-a716-446655440011',
   1500,
   75,
   120,
   'PAYE',
   'LIVRE',
   NOW() - INTERVAL '5 days');

-- Favoris
INSERT INTO FAVORIS (utilisateur_id, objet_id)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440021');