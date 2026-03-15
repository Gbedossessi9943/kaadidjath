# Kadidjath - Plateforme E-commerce pour Produits Frais

Plateforme e-commerce moderne pour la vente de produits frais au Bénin, avec intégration WhatsApp et Mobile Money.

## 🚀 Fonctionnalités

### 🛒 E-commerce
- Catalogue de produits avec prix en temps réel
- Panier d'achat persistant
- Système de commandes complet
- Calcul automatique des frais de livraison

### 📱 Communication
- Intégration WhatsApp Business API
- Notifications par SMS/WhatsApp
- Support client 24/7

### 💳 Paiement
- Mobile Money (MTN, Moov)
- Paiement à la livraison
- Transactions sécurisées

### 🎨 Design
- Interface moderne avec TailwindCSS
- Responsive design
- Expérience utilisateur optimisée

## 🛠️ Technologies

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification
- **WhatsApp Business API** - Communication

### Frontend
- **React 18** - Interface utilisateur
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Heroicons** - Icônes
- **Axios** - Client HTTP

## 📋 Prérequis

- Node.js 16+
- MongoDB 4.4+
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd kadidjath
```

### 2. Installer les dépendances
```bash
# Installer les dépendances du serveur
npm install

# Installer les dépendances du client
cd client
npm install
cd ..
```

### 3. Configurer les variables d'environnement
```bash
# Copier le fichier .env exemple
cp .env.example .env

# Éditer le fichier .env avec vos configurations
nano .env
```

### 4. Démarrer MongoDB
```bash
# Sur Windows
mongod

# Sur macOS/Linux
sudo systemctl start mongod
```

### 5. Démarrer l'application
```bash
# Démarrer le serveur et le client en même temps
npm run dev

# Ou séparément
npm run server  # Port 5000
npm run client  # Port 3000
```

## 🌐 Accès à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Documentation API**: http://localhost:5000/api-docs

## 📁 Structure du projet

```
kadidjath/
├── server/                 # Backend Node.js
│   ├── controllers/        # Contrôleurs API
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes Express
│   ├── middleware/        # Middlewares
│   └── server.js          # Point d'entrée serveur
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Contextes React
│   │   ├── services/      # Services API
│   │   └── App.js         # Point d'entrée client
│   └── public/            # Fichiers statiques
├── package.json           # Dépendances du projet
├── .env                   # Variables d'environnement
└── README.md             # Documentation
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/kadidjath
DB_NAME=kadidjath

# Serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=votre_jwt_secret_ici

# WhatsApp
WHATSAPP_WEBHOOK_URL=https://votre-webhook-url
WHATSAPP_TOKEN=votre_token_whatsapp

# Paiement Mobile Money
MTN_MONEY_API_KEY=votre_api_key_mtn
MOOV_MONEY_API_KEY=votre_api_key_moov

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe
```

## 📱 Utilisation

### 1. Créer un compte administrateur
```bash
# Via l'interface ou directement dans MongoDB
db.users.insertOne({
  name: "Admin",
  email: "admin@kadidjath.bj",
  password: "$2a$10$...", # Hash du mot de passe
  role: "admin",
  isActive: true
});
```

### 2. Ajouter des produits
- Connectez-vous en tant qu'administrateur
- Accédez au panneau d'administration
- Ajoutez vos produits avec prix et stock

### 3. Configurer WhatsApp
- Créez un compte WhatsApp Business
- Configurez le webhook dans `.env`
- Testez l'intégration

## 🔄 Scripts disponibles

```bash
# Développement
npm run dev          # Démarrer serveur + client
npm run server       # Serveur uniquement
npm run client       # Client uniquement

# Production
npm run build        # Builder le client
npm start            # Démarrer en production

# Utilitaires
npm install-deps     # Installer toutes les dépendances
```

## 🧪 Tests

```bash
# Tests backend
npm test

# Tests frontend
cd client && npm test
```

## 📚 API Documentation

### Produits
- `GET /api/products` - Lister les produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Mettre à jour un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Lister les commandes
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut

### Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/profile` - Profil utilisateur

## 🚨 Sécurité

- Authentification JWT
- Validation des entrées
- Protection contre les injections
- HTTPS en production
- Rate limiting

## 📈 Déploiement

### Production avec PM2
```bash
# Installer PM2
npm install -g pm2

# Démarrer en production
pm2 start ecosystem.config.js
```

### Docker
```bash
# Builder et démarrer
docker-compose up -d
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour les détails.

## 📞 Support

- Email: contact@kadidjath.bj
- Téléphone: +229 XX XX XX XX
- WhatsApp: +229 XX XX XX XX

## 🙏 Remerciements

- À la communauté React et Node.js
- Aux contributeurs open source
- À nos clients béninois
