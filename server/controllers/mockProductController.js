const { mockProducts } = require('../mockData');

// Obtenir tous les produits
exports.getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    let filteredProducts = [...mockProducts];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (available !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.available === (available === 'true'));
    }
    
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = mockProducts.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit', error: error.message });
  }
};

// Créer un nouveau produit (admin seulement)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      _id: Date.now().toString(),
      marketPrice: req.body.price,
      lastPriceUpdate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProducts.push(productData);
    res.status(201).json(productData);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
};

// Mettre à jour un produit (admin seulement)
exports.updateProduct = async (req, res) => {
  try {
    const index = mockProducts.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...req.body,
      lastPriceUpdate: new Date(),
      updatedAt: new Date()
    };
    
    res.json(mockProducts[index]);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
  }
};

// Supprimer un produit (admin seulement)
exports.deleteProduct = async (req, res) => {
  try {
    const index = mockProducts.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    mockProducts.splice(index, 1);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
};

// Mettre à jour les prix du marché
exports.updateMarketPrices = async (req, res) => {
  try {
    const { priceUpdates } = req.body;
    
    priceUpdates.forEach(({ productId, newPrice }) => {
      const index = mockProducts.findIndex(p => p._id === productId);
      if (index !== -1) {
        mockProducts[index].marketPrice = newPrice;
        mockProducts[index].price = newPrice;
        mockProducts[index].lastPriceUpdate = new Date();
        mockProducts[index].updatedAt = new Date();
      }
    });
    
    res.json(mockProducts);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour des prix', error: error.message });
  }
};
