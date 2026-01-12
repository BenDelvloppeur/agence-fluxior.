import React, { useState } from "react";
import { Star, Plus, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialTestimonials = [
  {
    name: "Thomas D.",
    role: "Fondateur, L'Atelier Bois",
    content: "Fluxior a transformé notre image. Notre nouveau site nous apporte 3x plus de demandes de devis qualifiés par mois. L'équipe est réactive et très pro.",
    rating: 5
  },
  {
    name: "Sarah M.",
    role: "CEO, Kaly Mode",
    content: "Enfin une agence qui comprend le e-commerce ! La migration vers notre nouvelle boutique s'est faite sans douleur et nos ventes ont décollé grâce à la rapidité du site.",
    rating: 5
  },
  {
    name: "Marc L.",
    role: "Architecte",
    content: "Le design minimaliste qu'ils ont créé met parfaitement en valeur mes projets. C'est exactement ce que je recherchais : simple, efficace et élégant.",
    rating: 5
  }
];

export const Testimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        
        {/* Placeholder for future testimonials */}
        <div className="hidden md:block"></div>

        {/* Card: Leave a Review - Centered */}
        <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-surfaceHighlight/30 border border-dashed border-white/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-surfaceHighlight/50 hover:border-primary/50 transition-all cursor-pointer h-full min-h-[300px]"
        >
            <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all mb-6">
                <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Votre avis compte</h3>
            <p className="text-gray-400 text-sm px-4">
                Vous avez travaillé avec nous ? Partagez votre expérience avec la communauté.
            </p>
        </button>

        <div className="hidden md:block"></div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl z-10"
                >
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h3 className="text-2xl font-bold text-white mb-2">Laisser un avis</h3>
                    <p className="text-gray-400 text-sm mb-6">Votre témoignage sera examiné par notre équipe avant publication.</p>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Merci ! Votre avis a été envoyé."); setIsModalOpen(false); }}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300">Prénom</label>
                                <input type="text" className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50" placeholder="John" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300">Nom</label>
                                <input type="text" className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50" placeholder="Doe" required />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300">Entreprise / Rôle</label>
                            <input type="text" className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50" placeholder="CEO, Company Inc." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300">Note</label>
                            <div className="flex gap-2 text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-6 h-6 hover:fill-current focus:fill-current" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300">Votre message</label>
                            <textarea rows={4} className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50 resize-none" placeholder="Racontez votre expérience..." required></textarea>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                            Envoyer mon avis <Send className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};
