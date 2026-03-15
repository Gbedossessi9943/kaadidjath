const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      enum: ['Abomey-Calavi', 'Cotonou', 'Autre']
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['en attente', 'confirmée', 'en préparation', 'en livraison', 'livrée', 'annulée'],
    default: 'en attente'
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'carte_bancaire', 'espèces', 'à la livraison'],
    default: 'à la livraison'
  },
  paymentStatus: {
    type: String,
    enum: ['en attente', 'payé', 'échoué'],
    default: 'en attente'
  },
  deliveryInfo: {
    method: {
      type: String,
      enum: ['livraison', 'retrait'],
      default: 'livraison'
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedTime: {
      type: String
    }
  },
  orderSource: {
    type: String,
    enum: ['site_web', 'whatsapp', 'téléphone'],
    default: 'site_web'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
