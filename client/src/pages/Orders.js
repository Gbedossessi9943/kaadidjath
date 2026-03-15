import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await ordersAPI.getOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'en attente': 'bg-yellow-100 text-yellow-800',
      'confirmée': 'bg-blue-100 text-blue-800',
      'en préparation': 'bg-purple-100 text-purple-800',
      'en livraison': 'bg-indigo-100 text-indigo-800',
      'livrée': 'bg-green-100 text-green-800',
      'annulée': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-8">
            Vous devez être connecté pour voir vos commandes
          </p>
          <Link to="/connexion" className="btn-primary">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
        <Link to="/produits" className="btn-primary">
          Nouvelle commande
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {['all', 'en attente', 'confirmée', 'en préparation', 'en livraison', 'livrée', 'annulée'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Toutes' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Commande #{order._id.slice(-8)}</h3>
                    <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-semibold text-primary-600 mt-2">
                      {order.totalAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Client:</span> {order.customer.name}
                    </div>
                    <div>
                      <span className="font-medium">Téléphone:</span> {order.customer.phone}
                    </div>
                    <div>
                      <span className="font-medium">Adresse:</span> {order.customer.address}
                    </div>
                    <div>
                      <span className="font-medium">Ville:</span> {order.customer.city}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Articles:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p>Mode de paiement: {order.paymentMethod}</p>
                    <p>Source: {order.orderSource}</p>
                    {order.deliveryInfo && (
                      <p>Frais de livraison: {order.deliveryInfo.cost} FCFA</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/commande/${order._id}`}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                    >
                      Voir détails
                    </Link>
                    {order.status === 'en attente' && (
                      <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 text-sm">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Aucune commande' : `Aucune commande ${filter}`}
          </h3>
          <p className="text-gray-600 mb-8">
            {filter === 'all' 
              ? 'Vous n\'avez pas encore passé de commande'
              : `Vous n'avez aucune commande ${filter}`
            }
          </p>
          <Link to="/produits" className="btn-primary">
            Passer une commande
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
