# fluxi-back
**Fluxi** est une **API backend** pour une application **CRM/ERP** spécialement conçue pour les entreprises du secteur **agroalimentaire**.
Son objectif est d’optimiser la **gestion commerciale**, **logistique** et **administrative** grâce à un outil **complet, intuitif et moderne**.

---

## ✨ Fonctionnalités principales
- **Gestion commerciale** :
  - Gestion des **clients**, **commandes** et **productions**.
  - Suivi des transactions et historique des interactions.
- **Suivi logistique** :
  - Gestion des **stocks** et des **commandes**.
- **Sécurité et authentification** :
  - Authentification sécurisée avec **JWT** (JsonWebToken).
  - Chiffrement des mots de passe avec **bcrypt**.
- **Architecture moderne** :
  - API RESTful avec **Express**.
  - Base de données **MongoDB** (via **Mongoose**).
  - Middlewares pour la gestion des authentifications

---

## 🛠 Technologies utilisées
| Technologie       | Version       | Rôle                                                                 |
|-------------------|---------------|----------------------------------------------------------------------|
| **Node.js**       | (version LTS) | Environnement d'exécution JavaScript côté serveur.                   |
| **Express**       | ^5.1.0        | Framework pour construire l'API RESTful.                             |
| **Mongoose**      | ^8.16.4       | ODM (Object Data Modeling) pour interagir avec **MongoDB**.          |
| **MongoDB**       | -             | Base de données NoSQL pour le stockage des données.                  |
| **JsonWebToken**  | ^9.0.2        | Génération et vérification des tokens d'authentification (JWT).      |
| **bcrypt**        | ^6.0.0        | Chiffrement sécurisé des mots de passe.                              |
| **cors**          | ^2.8.5        | Middleware pour gérer les requêtes **cross-origin**.                 |
| **dotenv**        | ^17.2.0       | Chargement des variables d'environnement depuis un fichier `.env`.   |
| **morgan**        | ~1.9.1        | Middleware pour le logging des requêtes HTTP.                        |
| **uid2**          | ^1.0.0        | Génération d'identifiants uniques (pour les sessions ou tokens).     |
| **debug**         | ~2.6.9        | Utilitaire pour le débogage.                                         |
| **jest**          | ^30.0.5       | Framework pour exécuter des **tests unitaires et d’intégration**     |
| **supertest**     | ^7.1.4        | Bibliothèque pour tester les **endpoints HTTP**                      |

---

## 🚀 Installation et configuration

### Prérequis
- Node.js (version LTS recommandée)
- MongoDB (local ou cloud, ex: MongoDB Atlas)
- Un fichier `.env` pour les variables d'environnement (voir `.env.example`).

### Étapes
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/fluxi-back.git
   cd fluxi-back


---

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/LMR13/fluxi-back.git
   cd fluxi-front
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer l’application**
   ```bash
   npm start
   ```

---

## 📂 Structure du projet

```
fluxi-back/
├── bin/              # Point d'entrée de l'application
│   ├──www
├── controllers/      # Logique métier des routes
│   ├──customersController.js
│   ├──ordersController.js
│   ├──productionController.js
│   ├──productsController.js
│   ├──suppliersController.js
├── middleware/      
│   ├──authMiddleware.js
├── models/           # Modèles Mongoose 
│   ├──brutProduct.js
│   ├──connection.js
│   ├──customer.js
│   ├──finalProduct.js
│   ├──orders.js
│   ├──production.js
│   ├──suppliers.js
│   ├──users.js
├── modules/          # fonctions de contrôles
│   ├──checkbody.js
│   ├──generateToken.js
├── routes/           # Routes de l'API (ex: /clients, /orders)
│   ├──api/
│   │   ├──customersRoutes.js
│   │   ├──ordersRoutes.js
│   │   ├──productionsRoutes.js
│   │   ├──productsRoutes.js
│   │   ├──suppliersRoutes.js
│   ├──apiRouter.js
│   ├──authRouter.js
├── .env              # Variables d'environnement (non versionné)
├── app.js            # Point centrale de l'application (initialisation et configuaration d'express, cors,...)
├── package.json      # Manifeste du projet
└── seed.js           # Simulateur de données dans la base de donnée pour tester l'API
```
## 🔒 variables d'environnement

MONGODB_URI=mongodb+srv://.../fluxi
JWT_SECRET=votre_cle_secrete_ici

---

## 🧪 Tests

Pour lancer les tests unitaires :
```bash
npm test
# ou
yarn test
```

---

## 👥 Auteurs

- **Lucas Meyer**  
- **Ludovic Lafforgue**  
- **Mattis Bueno**

---

## 📄 Licence

Ce projet est **privé** et non destiné à un usage public.
# fluxi-backdep
