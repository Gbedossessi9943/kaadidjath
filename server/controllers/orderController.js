const Order = require('../models/Order');
const Product = require('../models/Product');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes } = req.body;
    
    // Vérifier la disponibilité des produits et calculer le total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
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
      await product.save();
    }
    
    // Calculer les frais de livraison
    const deliveryCost = customer.city === 'Abomey-Calavi' ? 500 : 1000;
    totalAmount += deliveryCost;
    
    const order = new Order({
      customer,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'à la livraison',
      deliveryInfo: {
        cost: deliveryCost,
        estimatedTime: customer.city === 'Abomey-Calavi' ? '2-3 heures' : '4-6 heures'
      },
      notes
    });
    
    await order.save();
    await order.populate('items.product');
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
};

// Obtenir toutes les commandes (admin)
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    
    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
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
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    if (order.status !== 'en attente' && order.status !== 'confirmée') {
      return res.status(400).json({ message: 'Impossible d\'annuler cette commande' });
    }
    
    // Remettre les produits en stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
    
    order.status = 'annulée';
    await order.save();
    
    res.json({ message: 'Commande annulée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande', error: error.message });
  }
};

// Confirmer le paiement
exports.confirmPayment = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'payé' },
      { new: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la confirmation du paiement', error: error.message });
  }
};
