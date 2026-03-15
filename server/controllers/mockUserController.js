const { mockUsers } = require('../mockData');
const jwt = require('jsonwebtoken');

// Stockage mock pour les nouveaux utilisateurs
let users = [...mockUsers];

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou ce téléphone existe déjà' });
    }
    
    // Créer le nouvel utilisateur
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'client',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(user);
    
    // Générer le token
    const token = generateToken(user._id);
    
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
    res.status(400).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur (mock - pas de vérification de mot de passe)
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }
    
    // Générer le token
    const token = generateToken(user._id);
    
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
};

// Obtenir le profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = users.find(u => u._id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      ...user,
      password: undefined,
      orders: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const index = users.findIndex(u => u._id === req.userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    users[index] = {
      ...users[index],
      name: name || users[index].name,
      phone: phone || users[index].phone,
      updatedAt: new Date()
    };
    
    res.json(users[index]);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};

// Ajouter une adresse
exports.addAddress = async (req, res) => {
  try {
    const { street, city, isDefault } = req.body;
    
    const index = users.findIndex(u => u._id === req.userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (!users[index].addresses) {
      users[index].addresses = [];
    }
    
    // Si c'est l'adresse par défaut, désactiver les autres
    if (isDefault) {
      users[index].addresses.forEach(addr => addr.isDefault = false);
    }
    
    users[index].addresses.push({ 
      street, 
      city, 
      isDefault: isDefault || false 
    });
    users[index].updatedAt = new Date();
    
    res.json(users[index].addresses);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'adresse', error: error.message });
  }
};

// Obtenir tous les utilisateurs (admin)
exports.getUsers = async (req, res) => {
  try {
    const usersWithoutPassword = users.map(u => ({
      ...u,
      password: undefined
    }));
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};
