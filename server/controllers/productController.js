const Product = require('../models/Product');

// Obtenir tous les produits
exports.getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
      marketPrice: req.body.price, // Prix du marché initial
      lastPriceUpdate: new Date()
    };
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
};

// Mettre à jour un produit (admin seulement)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        lastPriceUpdate: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
  }
};

// Supprimer un produit (admin seulement)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
};

// Mettre à jour les prix du marché
exports.updateMarketPrices = async (req, res) => {
  try {
    const { priceUpdates } = req.body; // [{ productId, newPrice }]
    
    const updatePromises = priceUpdates.map(async ({ productId, newPrice }) => {
      return Product.findByIdAndUpdate(
        productId,
        { 
          marketPrice: newPrice,
          price: newPrice, // Mettre à jour le prix de vente aussi
          lastPriceUpdate: new Date()
        },
        { new: true }
      );
    });
    
    const updatedProducts = await Promise.all(updatePromises);
    res.json(updatedProducts);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour des prix', error: error.message });
  }
};
