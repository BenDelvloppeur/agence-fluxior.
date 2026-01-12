import React from 'react';
import { Heart } from 'lucide-react';
import { addToCart } from '../../../lib/cartStore';
import { motion } from 'framer-motion';

const products = [
  { 
    id: "p1",
    name: "Robe Soirée Satin", 
    price: 129, 
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2583&auto=format&fit=crop", 
    tag: "New",
    size: "M"
  },
  { 
    id: "p2",
    name: "Blazer Chic Noir", 
    price: 89, 
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2536&auto=format&fit=crop",
    size: "L"
  },
  { 
    id: "p3",
    name: "Sac Cuir Camel", 
    price: 245, 
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2535&auto=format&fit=crop", 
    tag: "-30%",
    size: "Unique"
  },
  { 
    id: "p4",
    name: "Escarpins Nude", 
    price: 110, 
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2600&auto=format&fit=crop",
    size: "38"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const ProductGrid = () => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden mb-4 aspect-[3/4]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              
              {product.tag && (
                <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white ${product.tag === 'New' ? 'bg-black' : 'bg-pink-600'}`}>
                  {product.tag}
                </div>
              )}
              
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:text-pink-600 transition-colors z-10">
                <Heart className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur py-0 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex flex-col">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-4 text-sm font-medium uppercase tracking-wide hover:bg-pink-600 hover:text-white transition-colors"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1 font-['Playfair_Display'] group-hover:text-pink-600 transition-colors">{product.name}</h3>
              <p className="text-gray-500 font-medium">{product.price}€</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
