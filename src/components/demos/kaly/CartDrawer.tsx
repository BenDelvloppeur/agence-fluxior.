import React from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity, toggleCart } from '../../../lib/cartStore';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const $isOpen = useStore(isCartOpen);
  const $items = useStore(cartItems);
  const $total = useStore(cartTotal);
  const itemsList = Object.values($items);

  const handleCheckout = () => {
    if (itemsList.length === 0) return;

    // Création de la commande simulée
    const newOrder = {
      id: '#' + Math.floor(1000 + Math.random() * 9000).toString(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      customer: 'Client Démo',
      total: $total,
      status: 'En attente',
      items: itemsList
    };

    // Sauvegarde dans le localStorage pour l'admin
    const existingOrders = JSON.parse(localStorage.getItem('kaly_orders') || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem('kaly_orders', JSON.stringify(existingOrders));

    // Vider le panier
    cartItems.set({});
    
    // Fermer le drawer
    toggleCart();

    // Feedback utilisateur
    alert('Merci pour votre commande ! Elle est maintenant visible dans le panneau d\'administration (Accès Admin en bas de page).');
    
    // Dispatch event pour que l'admin se mette à jour s'il est ouvert (optionnel mais propre)
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AnimatePresence>
      {$isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold flex items-center gap-2">
                Mon Panier <span className="text-sm font-sans font-normal text-gray-500">({itemsList.length} articles)</span>
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {itemsList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-200" />
                  <p className="text-lg">Votre panier est vide</p>
                  <button onClick={toggleCart} className="mt-4 text-pink-600 font-medium hover:underline">
                    Continuer mes achats
                  </button>
                </div>
              ) : (
                itemsList.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">{item.size || 'Taille unique'}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-gray-200 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:text-pink-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:text-pink-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {itemsList.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-bold text-lg">{$total.toFixed(2)}€</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 text-center">Frais de port et taxes calculés à l'étape suivante</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 group"
                >
                  Commander
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
