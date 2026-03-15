// Données mock pour tester sans MongoDB
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

const mockUsers = [
  {
    _id: '1',
    name: 'Admin Kadidjath',
    email: 'admin@kadidjath.bj',
    phone: '+22997000000',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  mockProducts,
  mockUsers
};
