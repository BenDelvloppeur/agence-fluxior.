import React from 'react';
import { StaggerContainer, StaggerItem } from '../ui/Motion';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Monitor, ShoppingBag, BarChart3, Layers } from 'lucide-react';

interface ServiceCard {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
  span?: number;
}

const services: ServiceCard[] = [
  {
    icon: Monitor,
    iconColor: 'text-primary',
    title: 'Sites Vitrines Premium',
    description: 'Design unique, animations fluides (60fps) et compatibilité mobile parfaite. Nous créons des expériences qui marquent les esprits et renforcent votre image de marque.',
    span: 2,
  },
  {
    icon: Layers,
    iconColor: 'text-pink-500',
    title: 'Maintenance',
    description: 'Sécurité, mises à jour et backups quotidiens pour une tranquillité d\'esprit totale.',
  },
  {
    icon: BarChart3,
    iconColor: 'text-emerald-500',
    title: 'SEO & Performance',
    description: 'Optimisation technique (Core Web Vitals) pour atteindre la 1ère page Google.',
  },
  {
    icon: ShoppingBag,
    iconColor: 'text-secondary',
    title: 'E-commerce Sur-Mesure',
    description: 'Des boutiques ultra-rapides conçues pour la conversion. Pas d\'abonnement mensuel coûteux, pas de limite technique. Une liberté totale pour votre business.',
    span: 2,
  },
];

export const ServicesDesktop: React.FC = () => {
  return (
    <StaggerContainer client:visible className="grid grid-cols-3 gap-6 auto-rows-[300px]">
      {services.map((service) => {
        const IconComponent = service.icon;
        return (
          <StaggerItem key={service.title} className={service.span === 2 ? 'col-span-2' : ''}>
            <SpotlightCard className="h-full">
              <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-surfaceHighlight border border-white/10 flex items-center justify-center ${service.iconColor} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className={`font-bold text-white mb-4 ${service.span === 2 ? 'text-3xl' : 'text-2xl'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-gray-400 ${service.span === 2 ? 'max-w-lg text-lg' : 'text-sm leading-relaxed'}`}>
                    {service.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
};
