const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de démarrage
console.log('🚀 Démarrage du serveur Kadidjath (mode Mock)...');

// Routes API mock
app.use('/api', require('./server/routes/mockRoutes'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur Kadidjath opérationnel',
    timestamp: new Date(),
    mode: 'Mock (sans MongoDB)'
  });
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur: http://localhost:${PORT}/api`);
  console.log(`🏠 Mode: Mock (données de test)`);
  console.log(`🌐 Frontend devrait être sur: http://localhost:3000`);
  console.log('');
  console.log('Routes disponibles:');
  console.log('  GET  /api/health - Vérifier le statut');
  console.log('  GET  /api/products - Lister les produits');
  console.log('  GET  /api/products/:id - Détails produit');
  console.log('  POST /api/orders - Créer une commande');
  console.log('  POST /api/users/login - Connexion');
  console.log('  POST /api/users/register - Inscription');
  console.log('');
});
