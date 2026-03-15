const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Webhook pour recevoir les messages WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const { From, Body } = req.body;
    
    // Traitement des commandes via WhatsApp
    if (Body.toLowerCase().includes('commande') || Body.toLowerCase().includes('commander')) {
      // Logique pour traiter une commande WhatsApp
      await handleWhatsAppOrder(From, Body);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur webhook WhatsApp:', error);
    res.status(500).send('Erreur');
  }
});

// Fonction pour traiter les commandes WhatsApp
async function handleWhatsAppOrder(phone, message) {
  try {
    // Extraire les informations de la commande du message
    // Format attendu: "commande: produit1 quantité1, produit2 quantité2"
    
    const orderData = parseWhatsAppMessage(message);
    
    if (orderData) {
      // Créer la commande
      const order = new Order({
        customer: {
          name: orderData.name || 'Client WhatsApp',
          phone: phone.replace('+', ''),
          address: orderData.address || 'À confirmer',
          city: orderData.city || 'Abomey-Calavi'
        },
        items: orderData.items,
        orderSource: 'whatsapp',
        notes: `Commande via WhatsApp: ${message}`
      });
      
      await order.save();
      
      // Envoyer une confirmation
      await sendWhatsAppConfirmation(phone, order);
    }
  } catch (error) {
    console.error('Erreur traitement commande WhatsApp:', error);
  }
}

// Parser le message WhatsApp
function parseWhatsAppMessage(message) {
  // Implémentation simple du parsing
  // À améliorer selon les besoins réels
  return {
    items: [],
    name: 'Client WhatsApp',
    address: 'À confirmer',
    city: 'Abomey-Calavi'
  };
}

// Envoyer une confirmation WhatsApp
async function sendWhatsAppConfirmation(phone, order) {
  // Implémentation avec l'API WhatsApp Business
  const message = `Votre commande #${order._id} a été reçue. Total: ${order.totalAmount} FCFA. Nous vous contactons bientôt pour confirmation.`;
  
  // Ici vous intégreriez l'appel à l'API WhatsApp
  console.log(`Message envoyé à ${phone}: ${message}`);
}

// Route pour envoyer des notifications
router.post('/send-notification', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    // Logique d'envoi via WhatsApp Business API
    await sendWhatsAppMessage(phone, message);
    
    res.json({ success: true, message: 'Notification envoyée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la notification', error: error.message });
  }
});

async function sendWhatsAppMessage(phone, message) {
  // Implémentation avec WhatsApp Business API
  console.log(`Envoi WhatsApp à ${phone}: ${message}`);
}

module.exports = router;
