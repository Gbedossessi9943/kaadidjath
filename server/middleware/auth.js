const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    // Vérifier si le token est dans les headers
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès non autorisé - Token manquant' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Trouver l'utilisateur
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ message: 'Compte désactivé' });
      }
      
      // Ajouter l'utilisateur à la requête
      req.userId = user._id;
      req.user = user;
      
      next();
    } catch (jwtError) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware admin
const adminAuth = async (req, res, next) => {
  try {
    // D'abord vérifier l'authentification
    await auth(req, res, () => {
      // Ensuite vérifier si c'est un admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
      }
      next();
    });
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { auth, adminAuth };
