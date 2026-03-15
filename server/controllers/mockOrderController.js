const { mockProducts } = require('../mockData');

// Stockage mock des commandes
let mockOrders = [];

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes } = req.body;
    
    // Vérifier la disponibilité des produits et calculer le total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = mockProducts.find(p => p._id === item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.product} non trouvé` });
      }
      
      if (!product.available || product.stock < item.quantity) {
        return res.status(400).json({ message: `Produit ${product.name} non disponible ou stock insuffisant` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      // Mettre à jour le stock
      product.stock -= item.quantity;
    }
    
    // Calculer les frais de livraison
    const deliveryCost = customer.city === 'Abomey-Calavi' ? 500 : 1000;
    totalAmount += deliveryCost;
    
    const order = {
      _id: Date.now().toString(),
      customer,
      items: orderItems.map(item => ({
        ...item,
        product: mockProducts.find(p => p._id === item.product)
      })),
      totalAmount,
      status: 'en attente',
      paymentMethod: paymentMethod || 'à la livraison',
      paymentStatus: 'en attente',
      deliveryInfo: {
        method: 'livraison',
        cost: deliveryCost,
        estimatedTime: customer.city === 'Abomey-Calavi' ? '2-3 heures' : '4-6 heures'
      },
      orderSource: 'site_web',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockOrders.push(order);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
};

// Obtenir toutes les commandes (admin)
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filteredOrders = [...mockOrders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    res.json(filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = mockOrders.find(o => o._id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
  }
};

// Mettre à jour le statut d'une commande (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const index = mockOrders.findIndex(o => o._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    mockOrders[index].status = status;
    mockOrders[index].updatedAt = new Date();
    
    res.json(mockOrders[index]);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const index = mockOrders.findIndex(o => o._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    const order = mockOrders[index];
    
    if (order.status !== 'en attente' && order.status !== 'confirmée') {
      return res.status(400).json({ message: 'Impossible d\'annuler cette commande' });
    }
    
    // Remettre les produits en stock
    for (const item of order.items) {
      const product = mockProducts.find(p => p._id === item.product._id);
      if (product) {
        product.stock += item.quantity;
      }
    }
    
    order.status = 'annulée';
    order.updatedAt = new Date();
    
    res.json({ message: 'Commande annulée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande', error: error.message });
  }
};

// Confirmer le paiement
exports.confirmPayment = async (req, res) => {
  try {
    const index = mockOrders.findIndex(o => o._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    mockOrders[index].paymentStatus = 'payé';
    mockOrders[index].updatedAt = new Date();
    
    res.json(mockOrders[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la confirmation du paiement', error: error.message });
  }
};
