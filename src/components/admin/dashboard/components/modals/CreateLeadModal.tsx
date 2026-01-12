import React from 'react';
import { UserPlus, X } from 'lucide-react';
import type { Lead } from '../types';

interface CreateLeadModalProps {
    onClose: () => void;
    onCreated: () => void;
    createAction: (lead: Partial<Lead>) => Promise<boolean>;
}

export const CreateLeadModal = ({ onClose, onCreated, createAction }: CreateLeadModalProps) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const dealAmountStr = formData.get('deal_amount') as string;
        const dealAmount = dealAmountStr ? parseFloat(dealAmountStr) : undefined;

        const newLead: Partial<Lead> = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            company: formData.get('company') as string,
            project_type: formData.get('project_type') as string,
            // On stocke le montant aussi dans 'budget' (string) pour l'affichage liste si besoin
            budget: dealAmount ? `${dealAmount}€` : undefined, 
            deal_amount: dealAmount, 
            message: formData.get('message') as string, // Note à ajouter
            source: 'contact_form',
            status: 'new',
            created_at: new Date().toISOString()
        };

        const success = await createAction(newLead);
        if (success) {
            onCreated();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserPlus size={20} className="text-primary" /> Nouveau Lead</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Nom complet *</label>
                            <input name="name" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Email *</label>
                            <input name="email" type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Téléphone</label>
                            <input name="phone" type="tel" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Entreprise</label>
                            <input name="company" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Type de projet</label>
                            <select name="project_type" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none appearance-none">
                                <option value="Site Vitrine">Site Vitrine</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Application Web">Application Web</option>
                                <option value="SEO / Marketing">SEO / Marketing</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Budget estimé (€)</label>
                            <input name="deal_amount" type="number" placeholder="Ex: 2000" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none text-right font-mono" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 ml-1">Note à ajouter</label>
                        <textarea name="message" placeholder="Détails supplémentaires, contexte..." className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none h-20 resize-none" />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-sm mt-4 transition-all">
                        Créer le lead
                    </button>
                </form>
            </div>
        </div>
    );
};
