import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold">Kadidjath</span>
            </div>
            <p className="text-gray-300 mb-4">
              Votre plateforme de confiance pour l'achat de produits frais et locaux au Bénin. 
              Des produits de qualité directement du producteur à votre assiette.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <PhoneIcon className="h-5 w-5" />
                <span>+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <EnvelopeIcon className="h-5 w-5" />
                <span>contact@kadidjath.bj</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPinIcon className="h-5 w-5" />
                <span>Abomey-Calavi, Bénin</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produits" className="text-gray-300 hover:text-primary-400">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-primary-400">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/livraison" className="text-gray-300 hover:text-primary-400">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/commande-whatsapp" className="text-gray-300 hover:text-primary-400">
                  Commande par WhatsApp
                </Link>
              </li>
              <li>
                <Link to="/paiement" className="text-gray-300 hover:text-primary-400">
                  Modes de paiement
                </Link>
              </li>
              <li>
                <Link to="/suivi-commande" className="text-gray-300 hover:text-primary-400">
                  Suivi de commande
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-primary-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Informations de livraison */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-8 w-8 text-primary-500" />
              <div>
                <h4 className="font-semibold">Horaires de livraison</h4>
                <p className="text-gray-300 text-sm">Lun-Sam: 7h-18h</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-8 w-8 text-primary-500" />
              <div>
                <h4 className="font-semibold">Zones de livraison</h4>
                <p className="text-gray-300 text-sm">Abomey-Calavi & Cotonou</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-8 w-8 text-primary-500" />
              <div>
                <h4 className="font-semibold">Support client</h4>
                <p className="text-gray-300 text-sm">24/7 WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Kadidjath. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
