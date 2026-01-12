import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, addToCart, removeFromCart, updateQuantity, toggleCart, isCartOpen, cartCount } from '../../../lib/cartStore';
import { ShoppingBasket, X, Minus, Plus, ChefHat, Star } from 'lucide-react';

// --- DATA ---
const PRODUCTS = [
  { id: 'm1', name: "Côte de Bœuf Maturée", price: 45.00, category: 'Boucherie', image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=2070&auto=format&fit=crop", description: "Maturée 45 jours sur os. Race Aubrac." },
  { id: 'm2', name: "Filet Mignon de Porc", price: 18.50, category: 'Boucherie', image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop", description: "Porc fermier élevé en plein air." },
  { id: 'm3', name: "Pâté en Croûte Maison", price: 12.00, category: 'Traiteur', image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop", description: "Pistaches, foie gras et volaille." },
  { id: 'm4', name: "Poulet Rôti Fermier", price: 22.00, category: 'Rôtisserie', image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=2000&auto=format&fit=crop", description: "Label Rouge, cuit à la broche." },
  { id: 'm5', name: "Saucisson Sec Artisanal", price: 8.90, category: 'Charcuterie', image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=2070&auto=format&fit=crop", description: "Séché naturellement 6 semaines." },
  { id: 'm6', name: "Gigot d'Agneau", price: 32.00, category: 'Boucherie', image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2070&auto=format&fit=crop", description: "Agneau de lait des Pyrénées." },
];

// --- HEADER ---
export const MaisonHeader = () => {
  const count = useStore(cartCount);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-14 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[#e5e5e5]">
        
        {/* Left Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-[#a3a3a3]">
          <a href="#boucherie" className="hover:text-[#d4af37] transition-colors">La Boucherie</a>
          <a href="#traiteur" className="hover:text-[#d4af37] transition-colors">Traiteur</a>
        </div>

        {/* Logo */}
        <a href="#" className="text-2xl md:text-3xl font-['Cinzel'] font-bold text-center leading-none group">
          Maison <span className="text-[#d4af37] block text-sm md:text-base font-sans tracking-[0.3em] mt-1 group-hover:tracking-[0.4em] transition-all">TRADITION</span>
        </a>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider">Click & Collect</span>
            <span className="text-xs font-bold text-[#d4af37]">01 23 45 67 89</span>
          </div>
          <button 
            onClick={toggleCart}
            className="relative p-2 hover:text-[#d4af37] transition-colors group"
          >
            <ShoppingBasket className="w-6 h-6" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-[#1a1a1a] text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- HERO ---
export const MaisonHero = () => {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop" 
          alt="Boucherie Tradition" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#1a1a1a]"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6 text-[#d4af37]">
            <Star className="w-4 h-4 fill-current" />
            <span className="uppercase tracking-[0.2em] text-sm">Depuis 1985</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
          <h1 className="font-['Cinzel'] text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            L'Excellence <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fbfbc8]">Du Goût</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Artisans bouchers passionnés. Nous sélectionnons les meilleures bêtes directement chez les éleveurs de nos régions.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button onClick={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} className="bg-[#d4af37] text-[#1a1a1a] px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white transition-all duration-300">
              Commander
            </button>
            <button className="border border-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
              Notre Histoire
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- PRODUCT GRID ---
export const MaisonProducts = () => {
  const [activeCategory, setActiveCategory] = useState('Tout');
  const categories = ['Tout', 'Boucherie', 'Traiteur', 'Charcuterie'];

  const filteredProducts = activeCategory === 'Tout' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] font-serif italic text-xl">Notre Sélection</span>
          <h2 className="font-['Cinzel'] text-4xl md:text-5xl mt-2 mb-8">À la Carte</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full border border-[#d4af37]/30 text-sm tracking-wider uppercase transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#d4af37] text-[#1a1a1a] font-bold' 
                    : 'text-[#a3a3a3] hover:border-[#d4af37] hover:text-[#d4af37]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="group bg-[#262626] rounded-sm overflow-hidden border border-white/5 hover:border-[#d4af37]/50 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <button 
                    onClick={() => addToCart({ ...product, quantity: 1 })}
                    className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#d4af37]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-[#e5e5e5]">{product.name}</h3>
                    <span className="font-bold text-[#d4af37]">{product.price.toFixed(2)}€</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center text-xs text-[#737373] uppercase tracking-wider">
                    <span>{product.category}</span>
                    <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" /> Fait Maison</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// --- CART DRAWER ---
export const MaisonCart = () => {
  const $isOpen = useStore(isCartOpen);
  const $items = useStore(cartItems);
  const $total = useStore(cartTotal);
  const itemsList = Object.values($items);

  const handleCheckout = () => {
    if (itemsList.length === 0) return;
    
    // Create Mock Order
    const newOrder = {
      id: '#M' + Math.floor(1000 + Math.random() * 9000).toString(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      customer: 'Client Maison',
      total: $total,
      status: 'En attente',
      items: itemsList
    };

    // Save
    const existingOrders = JSON.parse(localStorage.getItem('maison_orders') || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem('maison_orders', JSON.stringify(existingOrders));

    // Clear
    cartItems.set({});
    toggleCart();
    
    // Notify
    alert('Commande réservée ! Elle est prête à être préparée par nos bouchers.');
    window.dispatchEvent(new Event('storage-maison'));
  };

  return (
    <AnimatePresence>
      {$isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#1a1a1a] border-l border-[#d4af37]/20 shadow-2xl z-[70] flex flex-col text-[#e5e5e5]"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-[#262626]">
              <div>
                <h2 className="font-['Cinzel'] text-2xl font-bold text-[#d4af37]">Votre Panier</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Click & Collect</p>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {itemsList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBasket className="w-16 h-16 opacity-20" />
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                itemsList.map(item => (
                  <div key={item.id} className="flex gap-4 bg-[#262626] p-4 rounded-sm border border-white/5">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-sm" alt={item.name} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-serif">{item.name}</h3>
                        <span className="text-[#d4af37] font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                      <div className="flex items-center gap-3 bg-black/30 w-fit px-2 py-1 rounded-sm border border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-[#d4af37]"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-[#d4af37]"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 self-start"><X className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>

            {itemsList.length > 0 && (
              <div className="p-8 bg-[#262626] border-t border-white/10">
                <div className="flex justify-between mb-6 text-xl font-['Cinzel'] font-bold">
                  <span>Total</span>
                  <span className="text-[#d4af37]">{$total.toFixed(2)}€</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-4 bg-[#d4af37] text-[#1a1a1a] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Valider la commande
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
