# Purple Dog Project

Bienvenue sur le projet **Purple Dog**. Ce projet est une application web composée d'un backend Node.js (Express), d'un frontend Vue.js et d'une base de données PostgreSQL.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

* [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour lancer le projet avec Docker)

## Installation

Clonez le dépôt du projet sur votre machine locale :

```bash
git clone <url-du-repository>
cd purple-dog
```

## Lancer le projet avec Docker (Recommandé)

C'est la méthode la plus simple pour lancer l'ensemble de l'application (Base de données + Backend + Frontend + Adminer).

1. Assurez-vous que Docker Desktop est lancé.
2. À la racine du projet, exécutez la commande suivante :

```bash
docker-compose up --build
```

Cette commande va :

* Construire les images Docker pour le backend et le frontend.
* Lancer les conteneurs PostgreSQL, Backend, Frontend et Adminer.

**Accès aux services :**

* **Frontend :** [http://localhost:5173](http://localhost:5173)
* **Backend API :** [http://localhost:3000](http://localhost:3000)
* **Adminer (Gestion BDD) :** [http://localhost:8080](http://localhost:8080)

## Lancer le projet Manuellement

Si vous préférez lancer chaque service individuellement (utile pour le développement).

### 1. Base de données (PostgreSQL)

Vous devez avoir une instance PostgreSQL locale en cours d'exécution. Mettez à jour vos variables d'environnement (`.env`) avec vos identifiants PostgreSQL locaux si nécessaire.

Alternativement, vous pouvez lancer uniquement la base de données via Docker :

```bash
docker-compose up -d postgres
```

### 2. Backend

1. Accédez au dossier `backend` :

    ```bash
    cd backend
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Configurez les variables d'environnement :
    Créez un fichier `.env` dans le dossier `backend` (inspirez-vous des variables dans `docker-compose.yml` ou demandez le fichier `.env` de référence). Exemple minimal :

    ```env
    PORT=3000
    DATABASE_URL=postgres://postgres:password@localhost:5432/purple_dog
    JWT_SECRET=votre_secret_jwt
    FRONTEND_URL=http://localhost:5173
    ```

### 3. Frontend

1. Accédez au dossier `frontend` :

    ```bash
    cd frontend
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Lancez l'application :

    ```bash
    npm run dev
    ```

## Initialisation et Seed de la Base de Données

Une fois le projet lancé (Docker ou Manuel), vous pouvez initialiser et remplir la base de données avec des données de test.

Ouvrez un nouveau terminal et allez dans le dossier `backend` :

1. **Initialiser la structure de la BDD :**

    ```bash
    npm run init-db
    ```

    *Note : Cette commande exécute le script `src/scripts/init-db.js` qui supprime et recrée les tables.*

2. **Remplir la BDD (Seed) :**
    Si vous avez un script de seed (ex: `src/scripts/seed-db.js`), vous pouvez l'exécuter avec :

    ```bash
    node src/scripts/seed-db.js
    ```

## Structure du Projet

* `/backend` : Code source de l'API Node.js/Express.
  * `src/models` : Modèles Sequelize.
  * `src/routes` : Définition des routes de l'API.
  * `src/controllers` : Logique métier.
  * `src/middleware` : Middlewares (auth, upload, etc.).
* `/frontend` : Code source de l'application React/Vue.js.
  * `src/components` : Composants réutilisables.
  * `src/pages` : Pages de l'application.
  * `src/services` : Appels API (Axios).
* `docker-compose.yml` : Configuration pour Docker.
