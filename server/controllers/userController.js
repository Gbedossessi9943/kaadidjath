const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou ce téléphone existe déjà' });
    }
    
    // Créer le nouvel utilisateur
    const user = new User({
      name,
      email,
      phone,
      password
    });
    
    await user.save();
    
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
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
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
    const user = await User.findById(req.userId).select('-password').populate('orders');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, addresses },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};

// Ajouter une adresse
exports.addAddress = async (req, res) => {
  try {
    const { street, city, isDefault } = req.body;
    
    const user = await User.findById(req.userId);
    
    // Si c'est l'adresse par défaut, désactiver les autres
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ street, city, isDefault });
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'adresse', error: error.message });
  }
};

// Obtenir tous les utilisateurs (admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};
