import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, MapPinIcon, ShoppingBagIcon, CogIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addresses: user.addresses || []
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authAPI.updateProfile(profileData);
      updateUser(profileData);
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-8">
            Vous devez être connecté pour accéder à votre profil
          </p>
          <Link to="/connexion" className="btn-primary">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Mon profil', icon: UserIcon },
    { id: 'addresses', name: 'Adresses', icon: MapPinIcon },
    { id: 'orders', name: 'Commandes', icon: ShoppingBagIcon },
    { id: 'settings', name: 'Paramètres', icon: CogIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon compte</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">
                  {user?.name?.[0] || 'U'}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
              
              {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.includes('succès') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <input
                      type="text"
                      value={user?.role || 'client'}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mes adresses</h2>
                <button className="btn-primary">
                  Ajouter une adresse
                </button>
              </div>

              {profileData.addresses.length > 0 ? (
                <div className="space-y-4">
                  {profileData.addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-gray-600">{address.city}</p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Adresse par défaut
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Modifier
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucune adresse enregistrée</p>
                  <button className="btn-primary">
                    Ajouter une adresse
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Mes commandes</h2>
              
              <Link to="/commandes" className="btn-primary">
                Voir toutes mes commandes
              </Link>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Paramètres</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                      <span className="ml-2">Notifications par email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                      <span className="ml-2">Notifications WhatsApp</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Sécurité</h3>
                  <div className="space-y-3">
                    <button className="text-blue-600 hover:text-blue-700">
                      Changer le mot de passe
                    </button>
                    <br />
                    <button className="text-blue-600 hover:text-blue-700">
                      Activer l'authentification à deux facteurs
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <button className="text-red-600 hover:text-red-700">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
