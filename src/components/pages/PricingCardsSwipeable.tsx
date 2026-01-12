import React from 'react';
import { SwipeableCards } from '../ui/SwipeableCards';
import { Monitor, ShoppingBag, Rocket, CheckCircle2 } from 'lucide-react';

interface PricingCard {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isPopular?: boolean;
  borderColor: string;
  bgGradient?: string;
  buttonStyle: 'primary' | 'secondary';
}

const pricingCards: PricingCard[] = [
  {
    icon: Monitor,
    iconColor: 'text-primary',
    title: 'Site Vitrine',
    description: 'Pour les artisans et professionnels exigeants.',
    price: '700€',
    priceUnit: '/mois',
    features: [
      'Livraison sous 2 à 3 jours',
      'Design Premium sur-mesure',
      'Optimisation Mobile & Tablette',
      'SEO Technique (Google)',
      'Formulaire de contact sécurisé',
      'Hébergement haute vitesse',
    ],
    ctaText: 'Demander un devis',
    ctaHref: '/contact',
    isPopular: true,
    borderColor: 'border-primary/50',
    buttonStyle: 'primary',
  },
  {
    icon: ShoppingBag,
    iconColor: 'text-secondary',
    title: 'E-commerce',
    description: 'Vendez vos produits sans limites.',
    price: '1500€',
    features: [
      'Livraison sous 5 à 7 jours',
      'Boutique ultra-rapide',
      'Paiements sécurisés (Stripe/PayPal)',
      'Gestion des stocks & commandes',
      'Pas de commissions sur les ventes',
      'Formation admin incluse',
    ],
    ctaText: 'Lancer ma boutique',
    ctaHref: '/contact',
    borderColor: 'border-white/10',
    bgGradient: 'from-secondary/5',
    buttonStyle: 'secondary',
  },
  {
    icon: Rocket,
    iconColor: 'text-pink-500',
    title: 'Sur-Mesure',
    description: 'SaaS, App Web, Outils métiers...',
    price: 'Sur devis',
    features: [
      'Architecture complexe & Scalable',
      'Click & Collect / Marketplace',
      'Tableau de bord administrateur',
      'Espace membre / Auth',
      'APIs & Intégrations',
      'Maintenance dédiée',
    ],
    ctaText: 'Parler de mon projet',
    ctaHref: '/contact',
    borderColor: 'border-white/10',
    bgGradient: 'from-pink-500/5',
    buttonStyle: 'secondary',
  },
];

export const PricingCardsSwipeable: React.FC = () => {
  const cards = pricingCards.map((card, index) => {
    const IconComponent = card.icon;

    return (
      <div
        key={index}
        className={`h-full p-8 rounded-3xl border ${card.borderColor} ${
          card.isPopular
            ? 'bg-surface/50 backdrop-blur-md shadow-[0_0_50px_-20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_-20px_rgba(99,102,241,0.4)]'
            : card.iconColor === 'text-secondary'
            ? 'bg-surface/30 backdrop-blur-sm hover:border-secondary/30'
            : 'bg-surface/30 backdrop-blur-sm hover:border-pink-500/30'
        } transition-all duration-300 flex flex-col group relative overflow-hidden`}
      >
        {card.isPopular && (
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
            POPULAIRE
          </div>
        )}

        {card.bgGradient && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
        )}

        <div
          className={`w-14 h-14 rounded-2xl ${
            card.isPopular ? 'bg-surfaceHighlight' : card.iconColor === 'text-secondary' ? 'bg-secondary/20' : 'bg-surfaceHighlight'
          } flex items-center justify-center ${card.iconColor} mb-6 relative z-10`}
        >
          <IconComponent className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{card.title}</h3>
        <p className="text-gray-400 text-sm mb-6 relative z-10">{card.description}</p>

        <div className="text-3xl font-bold text-white mb-8 relative z-10">
          {card.price === 'Sur devis' ? card.price : `À partir de ${card.price}`}{' '}
          {card.priceUnit && <span className="text-sm font-normal text-gray-500">{card.priceUnit}</span>}
        </div>

        <div className="space-y-4 mb-8 flex-grow relative z-10">
          {card.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-start gap-3 text-gray-300 text-sm">
              <CheckCircle2 className={`w-5 h-5 ${card.iconColor} shrink-0`} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <a
          href={card.ctaHref}
          className={`w-full py-3 rounded-xl font-bold text-center transition-all relative z-10 ${
            card.buttonStyle === 'primary'
              ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
              : 'bg-surfaceHighlight border border-white/10 text-white hover:bg-white hover:text-black'
          }`}
        >
          {card.ctaText}
        </a>
      </div>
    );
  });

  return (
    <SwipeableCards className="w-full" cardClassName="h-full" desktopGridCols="md:grid-cols-3">
      {cards}
    </SwipeableCards>
  );
};
