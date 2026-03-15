import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MinusIcon, PlusIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !product.available || product.stock === 0) return;
    
    setAddingToCart(true);
    try {
      addToCart(product, quantity);
      // Optionnel: afficher une notification de succès
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
        <p className="text-gray-600 mb-4">
          Le produit que vous cherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/produits" className="btn-primary">
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Accueil
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/produits" className="text-gray-500 hover:text-gray-700">
              Produits
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-96 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary-200 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-4xl">
                {product.name[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-500">(4.0)</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-primary-600">
                {product.price} FCFA
              </span>
              <span className="ml-2 text-gray-500">/{product.unit}</span>
            </div>
            <div className="text-sm text-gray-500">
              Stock: {product.stock} {product.unit}{product.stock > 1 ? 's' : ''}
            </div>
          </div>

          {/* Product Features */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Caractéristiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Origine:</span>
                <span className="font-medium">{product.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Catégorie:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disponibilité:</span>
                <span className={`font-medium ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                  {product.available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière mise à jour:</span>
                <span className="font-medium">
                  {new Date(product.lastPriceUpdate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {product.available && product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantité:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.stock} {product.unit}{product.stock > 1 ? 's' : ''} disponibles)
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Ajout...' : 'Ajouter au panier'}
                </button>
                <Link
                  to="/panier"
                  className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                >
                  Voir le panier
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                {product.available ? 'Rupture de stock' : 'Produit indisponible'}
              </p>
            </div>
          )}

          {/* Delivery Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900">Informations de livraison</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Livraison à Abomey-Calavi: 2-3 heures</li>
              <li>• Livraison à Cotonou: 4-6 heures</li>
              <li>• Frais de livraison: 500-1000 FCFA</li>
              <li>• Commande possible via WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
