# 🚀 Déploiement de Kadidjath sur GitHub

## 📋 Prérequis

1. **Compte GitHub** : Créez un compte sur https://github.com
2. **Git installé** : Téléchargez et installez Git depuis https://git-scm.com/
3. **Éditeur de code** : VS Code recommandé avec extension Git

## 🔧 Étapes de Déploiement

### 1. Initialiser le Repository Git

```bash
# Ouvrir un terminal dans le dossier du projet
cd c:\Users\ordi\Desktop\kaadidjath

# Initialiser Git
git init

# Configurer Git (première fois seulement)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 2. Créer le Repository sur GitHub

1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nom : `kadidjath-platform`
4. Description : `Plateforme e-commerce pour produits frais du Bénin`
5. Public (recommandé pour la visibilité)
6. NE PAS cocher "Add README" (nous en avons déjà un)
7. Cliquez sur "Create repository"

### 3. Ajouter les Fichiers au Repository

```bash
# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Kadidjath Platform Complete"

# Ajouter le repository distant
git remote add origin https://github.com/VOTRE_USERNAME/kadidjath-platform.git

# Pousser sur GitHub
git push -u origin main
```

### 4. Activer GitHub Pages (Déploiement Automatique)

1. Allez sur votre repository GitHub
2. Cliquez sur "Settings"
3. Dans la barre latérale gauche, cliquez sur "Pages"
4. Source : "Deploy from a branch"
5. Branch : "main"
6. Folder : "/ (root)"
7. Cliquez sur "Save"

### 5. Attendre le Déploiement

GitHub Pages va déployer votre site. Patientez 2-5 minutes.

Votre site sera disponible à : `https://VOTRE_USERNAME.github.io/kadidjath-platform/`

## 🌐 Configuration pour le Déploiement

### Mettre à jour les URLs dans le code

Modifiez les fichiers suivants pour utiliser les URLs GitHub Pages :

#### Dans `simple-server.js` (ligne 511) :
```javascript
// Servir les fichiers statiques
app.use(express.static('.'));
```

#### Dans `index-complete.html` (ligne 626) :
```javascript
const API_URL = 'https://votre-backend-url.herokuapp.com/api'; // Pour le backend
```

### Options de Déploiement du Backend

#### Option 1 : Heroku (Recommandé)
1. Créez un compte sur https://signup.heroku.com/
2. Installez Heroku CLI
3. Déployez avec :
```bash
heroku create kadidjath-backend
git push heroku main
```

#### Option 2 : Railway
1. Allez sur https://railway.app/
2. Connectez votre compte GitHub
3. Importez le repository `kadidjath-platform`
4. Configurez les variables d'environnement

#### Option 3 : Vercel
1. Allez sur https://vercel.com/
2. Importez votre repository GitHub
3. Configurez le projet

## 📝 Fichiers à Exclure (.gitignore)

Créez un fichier `.gitignore` à la racine :

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Build outputs
build/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
```

## 🚀 Déploiement Automatisé avec GitHub Actions

Créez un fichier `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: echo "No build needed for static site"
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📱 Test du Déploiement

1. Vérifiez que le site fonctionne localement :
```bash
node simple-server.js
# Ouvrir http://localhost:5001/index-complete.html
```

2. Testez toutes les fonctionnalités :
   - Connexion/Inscription
   - Panier et commande
   - Suivi de livraison
   - Paiement simulé

3. Déployez et testez en ligne

## 🔍 Dépannage

### Problèmes Communs

1. **Erreur 404 sur GitHub Pages**
   - Vérifiez que `index-complete.html` est bien à la racine
   - Attendez 5-10 minutes après le déploiement

2. **API ne fonctionne pas en ligne**
   - L'API Node.js ne fonctionne pas sur GitHub Pages
   - Utilisez Heroku, Railway ou Vercel pour le backend

3. **CORS Error**
   - Ajoutez votre domaine GitHub Pages dans la configuration CORS

4. **Images ne s'affichent pas**
   - Utilisez des URLs absolues pour les images

### Support

- GitHub Support : https://support.github.com/
- Heroku Documentation : https://devcenter.heroku.com/
- Vercel Documentation : https://vercel.com/docs

## 🎉 Félicitations !

Une fois déployé, votre plateforme Kadidjath sera accessible au monde entier !

**URL finale** : `https://VOTRE_USERNAME.github.io/kadidjath-platform/`

N'oubliez pas de partager votre plateforme sur les réseaux sociaux pour atteindre vos clients à Abomey-Calavi et Cotonou !
