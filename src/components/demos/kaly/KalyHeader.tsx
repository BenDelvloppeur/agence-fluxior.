import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartCount, toggleCart } from '../../../lib/cartStore';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';

export const KalyHeader = () => {
  const count = useStore(cartCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-14 z-40 transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wide">
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Nouveautés</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Vêtements</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Accessoires</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="text-pink-600">Soldes</a>
          </div>
        </div>

        <div 
          onClick={scrollTo('body')}
          className="text-3xl font-['Playfair_Display'] font-black italic tracking-tighter text-pink-600 absolute left-1/2 -translate-x-1/2 cursor-pointer"
        >
          Kaly<span className="text-black not-italic">.</span>
        </div>

        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-pink-600 transition-colors" />
          <div className="relative hidden md:block cursor-pointer hover:text-pink-600 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">2</span>
          </div>
          <button onClick={toggleCart} className="relative cursor-pointer hover:text-pink-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-pink-600 text-white text-[10px] flex items-center justify-center rounded-full animate-in zoom-in duration-200">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-6 space-y-4 font-bold text-lg">
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Nouveautés</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Vêtements</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="hover:text-pink-600 transition-colors">Accessoires</a>
            <a href="#collection" onClick={scrollTo('#collection')} className="text-pink-600">Soldes</a>
          </nav>
        </div>
      )}
    </header>
  );
};
