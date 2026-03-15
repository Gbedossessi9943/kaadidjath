const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'votre_jwt_secret_securise_ici';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Données mock
const products = [
  {
    _id: '1',
    name: 'Tomates fraîches',
    description: 'Tomates locales de qualité, cueillies ce matin',
    category: 'légumes',
    price: 500,
    unit: 'kg',
    image: '',
    available: true,
    stock: 50,
    origin: 'Bénin',
    marketPrice: 500,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Oignons rouges',
    description: 'Oignons rouges de Grand Popo',
    category: 'légumes',
    price: 300,
    unit: 'kg',
    image: '',
    available: true,
    stock: 100,
    origin: 'Bénin',
    marketPrice: 300,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Bananes plantain',
    description: 'Bananes plantain mûres et prêtes à consommer',
    category: 'fruits',
    price: 800,
    unit: 'pièce',
    image: '',
    available: true,
    stock: 30,
    origin: 'Bénin',
    marketPrice: 800,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Carottes fraîches',
    description: 'Carottes croquantes et sucrées',
    category: 'légumes',
    price: 400,
    unit: 'kg',
    image: '',
    available: true,
    stock: 25,
    origin: 'Bénin',
    marketPrice: 400,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Ananas Victoria',
    description: 'Ananas juteux et sucrés du sud Bénin',
    category: 'fruits',
    price: 1500,
    unit: 'pièce',
    image: '',
    available: true,
    stock: 15,
    origin: 'Bénin',
    marketPrice: 1500,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    name: 'Riz local',
    description: 'Riz blanc de qualité supérieure',
    category: 'céréales',
    price: 1200,
    unit: 'kg',
    image: '',
    available: true,
    stock: 200,
    origin: 'Bénin',
    marketPrice: 1200,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let users = [
  {
    _id: '1',
    name: 'Admin Kadidjath',
    email: 'admin@kadidjath.bj',
    phone: '+22997000000',
    password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ',
    role: 'admin',
    isActive: true,
    addresses: [
      { street: 'Avenue Jean Paul II', city: 'Cotonou', isDefault: true }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let orders = [];
let orderId = 1;
let userId = 2;

// Partenaires locaux (vendeurs)
const partners = [
  {
    _id: '1',
    name: 'Ferme des Collines',
    location: 'Abomey-Calavi',
    specialty: 'légumes',
    phone: '+22997000001',
    email: 'ferme@collines.bj',
    rating: 4.5,
    products: ['1', '2', '4'] // IDs des produits
  },
  {
    _id: '2',
    name: 'Fruiterie Tropicale',
    location: 'Cotonou',
    specialty: 'fruits',
    phone: '+22997000002',
    email: 'fruits@tropicale.bj',
    rating: 4.8,
    products: ['3', '5']
  },
  {
    _id: '3',
    name: 'Céréales du Bénin',
    location: 'Porto-Novo',
    specialty: 'céréales',
    phone: '+22997000003',
    email: 'cereales@benin.bj',
    rating: 4.2,
    products: ['6']
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur Kadidjath opérationnel',
    timestamp: new Date(),
    mode: 'Complete Mock avec authentification'
  });
});

// Routes Authentification
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer le nouvel utilisateur
    const user = {
      _id: (userId++).toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'client',
      isActive: true,
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(user);
    
    // Générer le token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe (pour le demo, admin password = "admin123")
    let passwordMatch = false;
    if (email === 'admin@kadidjath.bj' && password === 'admin123') {
      passwordMatch = true;
    } else {
      passwordMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }
    
    // Générer le token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});

app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u._id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses || [],
    createdAt: user.createdAt
  });
});

// Routes Produits
app.get('/api/products', (req, res) => {
  const { category, available } = req.query;
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (available !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.available === (available === 'true'));
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  res.json(product);
});

// Mise à jour des prix en temps réel
app.put('/api/products/market-prices', (req, res) => {
  const { priceUpdates } = req.body;
  
  priceUpdates.forEach(({ productId, newPrice }) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      product.marketPrice = newPrice;
      product.price = newPrice;
      product.lastPriceUpdate = new Date();
    }
  });
  
  res.json({ message: 'Prix mis à jour avec succès', products });
});

// Routes Commandes
app.post('/api/orders', authenticateToken, (req, res) => {
  const order = {
    _id: (orderId++).toString(),
    customer: req.body.customer,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    paymentMethod: req.body.paymentMethod,
    status: 'en attente',
    paymentStatus: 'en attente',
    deliveryInfo: req.body.deliveryInfo,
    orderSource: 'site_web',
    userId: req.user.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', authenticateToken, (req, res) => {
  let userOrders = orders;
  
  // Si ce n'est pas un admin, ne montrer que les commandes de l'utilisateur
  if (req.user.role !== 'admin') {
    userOrders = orders.filter(o => o.userId === req.user.userId);
  }
  
  res.json(userOrders);
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  // Vérifier que l'utilisateur a le droit de voir cette commande
  if (req.user.role !== 'admin' && order.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  res.json(order);
});

// Mise à jour du statut de commande (admin seulement)
app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  
  const order = orders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  order.status = req.body.status;
  order.updatedAt = new Date();
  
  res.json(order);
});

// Routes Partenaires
app.get('/api/partners', (req, res) => {
  res.json(partners);
});

app.get('/api/partners/:id', (req, res) => {
  const partner = partners.find(p => p._id === req.params.id);
  if (!partner) {
    return res.status(404).json({ message: 'Partenaire non trouvé' });
  }
  res.json(partner);
});

// Routes WhatsApp (simulation)
app.post('/api/whatsapp/send-order', (req, res) => {
  const { order, customerPhone } = req.body;
  
  // Simuler l'envoi WhatsApp
  console.log(`📱 WhatsApp: Nouvelle commande #${order._id} envoyée à ${customerPhone}`);
  console.log(`Détails: ${order.items.length} articles, Total: ${order.totalAmount} FCFA`);
  
  res.json({ 
    success: true, 
    message: 'Commande envoyée via WhatsApp avec succès',
    whatsappId: `WA${order._id}${Date.now()}`
  });
});

// Routes Paiement Mobile Money (simulation)
app.post('/api/payment/mobile-money', (req, res) => {
  const { amount, phone, operator, orderId } = req.body;
  
  // Simuler le paiement Mobile Money
  console.log(`💳 Paiement Mobile Money: ${amount} FCFA via ${operator}`);
  console.log(`Téléphone: ${phone}, Commande: ${orderId}`);
  
  // Simuler une réponse de paiement réussie
  setTimeout(() => {
    console.log(`✅ Paiement réussi pour la commande ${orderId}`);
  }, 2000);
  
  res.json({
    success: true,
    transactionId: `MM${Date.now()}`,
    message: 'Paiement initié avec succès'
  });
});

// Routes Livraison
app.post('/api/delivery/calculate', (req, res) => {
  const { city, items } = req.body;
  
  let deliveryCost = 0;
  let estimatedTime = '';
  
  if (city === 'Abomey-Calavi') {
    deliveryCost = 500;
    estimatedTime = '2-3 heures';
  } else if (city === 'Cotonou') {
    deliveryCost = 1000;
    estimatedTime = '3-4 heures';
  } else {
    deliveryCost = 2000;
    estimatedTime = '4-6 heures';
  }
  
  res.json({
    deliveryCost,
    estimatedTime,
    message: `Livraison à ${city} prévue dans ${estimatedTime}`
  });
});

app.post('/api/delivery/track/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.find(o => o._id === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  // Simuler le suivi de livraison
  const trackingSteps = [
    { status: 'en attente', message: 'Commande en attente de validation', time: order.createdAt },
    { status: 'confirmée', message: 'Commande confirmée, préparation en cours', time: new Date() },
    { status: 'en livraison', message: 'Livreur en route', time: new Date(Date.now() + 3600000) },
    { status: 'livrée', message: 'Commande livrée', time: new Date(Date.now() + 7200000) }
  ];
  
  const currentStep = trackingSteps.find(step => step.status === order.status) || trackingSteps[0];
  
  res.json({
    orderId: order._id,
    currentStatus: order.status,
    tracking: trackingSteps,
    estimatedDelivery: trackingSteps[3].time
  });
});

// Servir les fichiers statiques
app.use(express.static('.'));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur Kadidjath complet démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur: http://localhost:${PORT}/api`);
  console.log(`🌐 Interface web sur: http://localhost:${PORT}/index.html`);
  console.log('');
  console.log('🚀 Fonctionnalités complètes:');
  console.log('  ✅ Authentification JWT');
  console.log('  ✅ Catalogue produits');
  console.log('  ✅ Commandes avec suivi');
  console.log('  ✅ Paiement Mobile Money (simulé)');
  console.log('  ✅ Livraison avec tracking');
  console.log('  ✅ Partenaires locaux');
  console.log('  ✅ WhatsApp Business (simulé)');
  console.log('');
  console.log('📱 Compte de test:');
  console.log('  Email: admin@kadidjath.bj');
  console.log('  Mot de passe: admin123');
  console.log('');
});
