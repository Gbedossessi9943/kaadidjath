import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, TruckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { productsAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getProducts({ available: true, limit: 8 });
        setFeaturedProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Légumes', image: '/images/vegetables.jpg', count: 24 },
    { name: 'Fruits', image: '/images/fruits.jpg', count: 18 },
    { name: 'Céréales', image: '/images/grains.jpg', count: 12 },
    { name: 'Autres', image: '/images/others.jpg', count: 8 }
  ];

  const features = [
    {
      icon: TruckIcon,
      title: 'Livraison rapide',
      description: 'Livraison dans les 2-4h à Abomey-Calavi et Cotonou'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Produits garantis',
      description: 'Produits frais et de qualité garantie'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Support 24/7',
      description: 'Assistance client disponible via WhatsApp'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Produits Frais du Bénin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Commandez en ligne et recevez directement chez vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/produits" className="btn-secondary text-lg px-8 py-3">
                Voir nos produits
              </Link>
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
                Commander par WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nos catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/produits?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-xl">
                        {category.name[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.count} produits</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Produits populaires</h2>
            <Link to="/produits" className="text-primary-600 hover:text-primary-700 font-medium">
              Voir tout →
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/produits/${product._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <div className="w-20 h-20 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-2xl">
                          {product.name[0]}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary-600">
                          {product.price} FCFA/{product.unit}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-green-600 text-sm">En stock</span>
                        ) : (
                          <span className="text-red-600 text-sm">Rupture</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commander des produits frais ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Rejoignez des centaines de clients satisfaits à Abomey-Calavi et Cotonou
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/produits" className="btn-secondary text-lg px-8 py-3">
              Commencer maintenant
            </Link>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
              Contacter nous
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
