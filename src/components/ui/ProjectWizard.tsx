import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Check, Monitor, ShoppingBag, 
  Rocket, Search, Palette, Globe, Layers, Clock, CreditCard 
} from "lucide-react";

// Types
type FormData = {
  name: string;
  email: string;
  phone?: string;
  company: string;
  projectType: string;
  goals: string[];
  features: string[];
  budget: string;
  deadline: string;
  designStyle: string;
  details: string;
};

const INITIAL_DATA: FormData = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  goals: [],
  features: [],
  budget: "",
  deadline: "",
  designStyle: "",
  details: "",
};

const PROJECT_TYPES = [
  { id: "vitrine", label: "Site Vitrine", icon: Monitor, desc: "Présenter mon activité" },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag, desc: "Vendre en ligne" },
  { id: "custom", label: "Sur-Mesure", icon: Rocket, desc: "SaaS / App Métier" },
  { id: "redesign", label: "Refonte", icon: Layers, desc: "Améliorer l'existant" },
];

const GOALS = [
  "Plus de visibilité", "Générer des leads", "Vendre des produits", 
  "Moderniser l'image", "Recruter", "Automatiser des tâches"
];

const STYLES = [
  { id: "minimal", label: "Minimaliste & Épuré", color: "bg-gray-100" },
  { id: "bold", label: "Audacieux & Coloré", color: "bg-purple-500" },
  { id: "corporate", label: "Corporate & Sérieux", color: "bg-blue-800" },
  { id: "luxury", label: "Luxe & Premium", color: "bg-black" },
];

export const ProjectWizard = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const totalSteps = 5;

  const updateData = (field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'goals' | 'features', item: string) => {
    setData(prev => {
      const current = prev[field];
      const updated = current.includes(item) 
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0A0F1E] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col md:flex-row">
      
      {/* Sidebar (Progress & Info) */}
      <div className="w-full md:w-1/3 bg-surfaceHighlight/30 p-8 flex flex-col justify-between border-r border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white">
              {step}
            </div>
            <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">Étape {step}/{totalSteps}</span>
          </div>
          
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            {step === 1 && "Faisons connaissance"}
            {step === 2 && "Votre Projet"}
            {step === 3 && "Vos Objectifs"}
            {step === 4 && "Style & Délais"}
            {step === 5 && "Derniers détails"}
          </h2>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            {step === 1 && "Dites-nous qui vous êtes pour que nous puissions personnaliser notre approche."}
            {step === 2 && "Quel type de site correspond le mieux à vos besoins actuels ?"}
            {step === 3 && "Quels sont les résultats concrets que vous attendez de ce nouveau site ?"}
            {step === 4 && "Aidez-nous à visualiser l'esthétique et les contraintes temporelles."}
            {step === 5 && "Laissez-nous vos coordonnées pour recevoir votre proposition."}
          </p>
        </div>

        <div className="mt-8">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
      </div>

      {/* Main Content (Form) */}
      <div className="w-full md:w-2/3 p-8 md:p-12 relative">
        <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-5">
            <Globe className="w-64 h-64 text-primary" />
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="relative z-10 h-full flex flex-col">
            <div className="flex-grow">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Votre Prénom & Nom</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Téléphone</label>
                                    <input 
                                        type="tel" 
                                        value={data.phone || ''}
                                        onChange={(e) => updateData('phone', e.target.value)}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nom de l'entreprise</label>
                                <input 
                                    type="text" 
                                    value={data.company}
                                    onChange={(e) => updateData('company', e.target.value)}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="Mon Entreprise SAS"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PROJECT TYPE */}
                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {PROJECT_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        updateData('projectType', type.id);
                                        nextStep();
                                    }}
                                    className={`p-6 rounded-2xl border text-left transition-all duration-300 group flex flex-col gap-4 ${
                                        data.projectType === type.id 
                                        ? "bg-primary/20 border-primary text-white" 
                                        : "bg-surface/30 border-white/10 text-gray-400 hover:border-white/30 hover:bg-surface/50"
                                    }`}
                                >
                                    <type.icon className={`w-8 h-8 ${data.projectType === type.id ? "text-primary" : "text-gray-500 group-hover:text-white"}`} />
                                    <div>
                                        <div className="font-bold text-lg text-white mb-1">{type.label}</div>
                                        <div className="text-xs opacity-70">{type.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* STEP 3: GOALS */}
                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <label className="text-sm font-medium text-gray-300 mb-4 block">Sélectionnez vos objectifs principaux :</label>
                            <div className="flex flex-wrap gap-3">
                                {GOALS.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => toggleArrayItem('goals', goal)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                            data.goals.includes(goal)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-surface/30 text-gray-400 border-white/10 hover:border-white/30"
                                        }`}
                                    >
                                        {goal}
                                        {data.goals.includes(goal) && <Check className="w-3 h-3 inline-block ml-2" />}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-8 space-y-2">
                                <label className="text-sm font-medium text-gray-300">Autre chose à préciser ?</label>
                                <textarea 
                                    value={data.details}
                                    onChange={(e) => updateData('details', e.target.value)}
                                    rows={3}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors resize-none"
                                    placeholder="Fonctionnalités spécifiques, concurrents, inspirations..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: STYLE & BUDGET */}
                    {step === 4 && (
                        <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-4 block">Quelle ambiance recherchez-vous ?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {STYLES.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => updateData('designStyle', style.id)}
                                            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                                                data.designStyle === style.id
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 bg-surface/30 hover:border-white/30"
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border border-white/20 ${style.color}`}></div>
                                            <span className="text-white text-sm font-medium">{style.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Budget Estimé
                                    </label>
                                    <select 
                                        value={data.budget}
                                        onChange={(e) => updateData('budget', e.target.value)}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="700-1200€">700€ - 1200€</option>
                                        <option value="1200-2000€">1200€ - 2000€</option>
                                        <option value="+ 2000€">+ 2000€</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Délai Souhaité
                                    </label>
                                    <select 
                                        value={data.deadline}
                                        onChange={(e) => updateData('deadline', e.target.value)}
                                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="urgent">Urgent (&lt; 1 semaine)</option>
                                        <option value="normal">Standard (1-2 semaines)</option>
                                        <option value="flexible">Pas de date fixe</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: FINAL CONTACT */}
                    {step === 5 && (
                        <motion.div 
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            <h3 className="text-2xl font-bold text-white">Dernière étape !</h3>
                            <p className="text-gray-400">Où pouvons-nous vous envoyer votre estimation et la suite des étapes ?</p>
                            
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-medium text-gray-300">Email Professionnel</label>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={(e) => updateData('email', e.target.value)}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="vous@entreprise.com"
                                    required
                                />
                            </div>

                            <button 
                                onClick={async () => {
                                    try {
                                        const { supabase } = await import('../../lib/supabase');
                                        
                                        const payload = {
                                            name: data.name,
                                            email: data.email,
                                            company: data.company,
                                            phone: data.phone,
                                            project_type: data.projectType,
                                            budget: data.budget,
                                            source: 'wizard',
                                            status: 'new',
                                            details: {
                                                goals: data.goals,
                                                features: data.features,
                                                deadline: data.deadline,
                                                designStyle: data.designStyle,
                                                additional_details: data.details
                                            }
                                        };

                                        const { error } = await supabase.from('leads').insert([payload]);
                                        
                                        if (error) throw error;
                                        window.location.href = "/merci";
                                    } catch (error) {
                                        console.error('Error submitting form:', error);
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                }}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-5 h-5" />
                                Envoyer ma demande de projet
                            </button>
                            
                            <p className="text-xs text-gray-500 mt-4">
                                En cliquant, vous acceptez d'être recontacté pour votre projet.
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/5">
                {step > 1 ? (
                    <button 
                        onClick={prevStep}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                ) : (
                    <div></div>
                )}

                {step < totalSteps && (
                    <button 
                        onClick={nextStep}
                        className="bg-white text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        Suivant <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};
