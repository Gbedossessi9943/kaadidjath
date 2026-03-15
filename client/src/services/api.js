import axios from 'axios';

// Données mock pour le déploiement statique
const mockProducts = [
  {
    _id: '1',
    name: 'Tomates fraîches',
    description: 'Tomates locales de qualité, cueillies ce matin',
    category: 'légumes',
    price: 500,
    unit: 'kg',
    image: '',
    available: true,
    stock: 50,
    origin: 'Bénin',
    marketPrice: 500,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Oignons rouges',
    description: 'Oignons rouges de Grand Popo',
    category: 'légumes',
    price: 300,
    unit: 'kg',
    image: '',
    available: true,
    stock: 100,
    origin: 'Bénin',
    marketPrice: 300,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Bananes plantain',
    description: 'Bananes plantain mûres et prêtes à consommer',
    category: 'fruits',
    price: 800,
    unit: 'pièce',
    image: '',
    available: true,
    stock: 30,
    origin: 'Bénin',
    marketPrice: 800,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Carottes fraîches',
    description: 'Carottes croquantes et sucrées',
    category: 'légumes',
    price: 400,
    unit: 'kg',
    image: '',
    available: true,
    stock: 25,
    origin: 'Bénin',
    marketPrice: 400,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Ananas Victoria',
    description: 'Ananas juteux et sucrés du sud Bénin',
    category: 'fruits',
    price: 1500,
    unit: 'pièce',
    image: '',
    available: true,
    stock: 15,
    origin: 'Bénin',
    marketPrice: 1500,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    name: 'Riz local',
    description: 'Riz blanc de qualité supérieure',
    category: 'céréales',
    price: 1200,
    unit: 'kg',
    image: '',
    available: true,
    stock: 200,
    origin: 'Bénin',
    marketPrice: 1200,
    lastPriceUpdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Créer une instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vérifier si on est en production (Netlify)
const isProduction = process.env.NODE_ENV === 'production';

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kadidjath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide, déconnecter l'utilisateur
      localStorage.removeItem('kadidjath_token');
      localStorage.removeItem('kadidjath_user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// API Produits
export const productsAPI = {
  getProducts: async (params = {}) => {
    if (isProduction) {
      // En production, utiliser les données mock
      let filteredProducts = [...mockProducts];
      
      if (params.category) {
        filteredProducts = filteredProducts.filter(p => p.category === params.category);
      }
      if (params.available !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.available === (params.available === 'true'));
      }
      
      return { data: filteredProducts };
    }
    return api.get('/products', { params });
  },
  getProduct: async (id) => {
    if (isProduction) {
      const product = mockProducts.find(p => p._id === id);
      if (product) {
        return { data: product };
      }
      throw new Error('Produit non trouvé');
    }
    return api.get(`/products/${id}`);
  },
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateMarketPrices: (data) => api.put('/products/market-prices/update', data)
};

// API Commandes
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  confirmPayment: (id) => api.put(`/orders/${id}/payment`)
};

// API Utilisateurs
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addAddress: (data) => api.post('/users/addresses', data),
  getUsers: () => api.get('/users')
};

// API WhatsApp
export const whatsappAPI = {
  sendNotification: (data) => api.post('/whatsapp/send-notification', data)
};

export default api;
