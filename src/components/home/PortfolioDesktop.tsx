import React from 'react';
import { StaggerContainer, StaggerItem } from '../ui/Motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface DemoCard {
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

interface PortfolioDesktopProps {
  demos: DemoCard[];
}

export const PortfolioDesktop: React.FC<PortfolioDesktopProps> = ({ demos }) => {
  const cards = demos.map((demo, index) => (
    <StaggerItem key={index}>
      <a
        href={demo.link}
        className="group block h-full relative rounded-3xl overflow-hidden border border-white/10 bg-surface/30 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Preview Window Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-2 z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto px-4 py-1 rounded-full bg-white/5 text-[10px] text-gray-500 font-mono hidden sm:block">
            fluxior-demo.app/{demo.link.split('/').pop()}
          </div>
        </div>

        {/* Visual Representation */}
        <div className="h-80 w-full relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
          <img
            src={demo.image}
            alt={demo.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <span className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
              Voir la démo en live <ExternalLink className="w-4 h-4" />
            </span>
          </div>

          {/* Floating Title Inside Visual */}
          <div className="absolute bottom-8 left-8 text-4xl font-bold text-white font-display drop-shadow-lg">
            {demo.title}
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-2 mb-4 flex-wrap">
            {demo.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 rounded-full bg-surfaceHighlight border border-white/5 text-xs text-gray-400 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{demo.category}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{demo.description}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-white transition-colors ml-4 shrink-0">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </a>
    </StaggerItem>
  ));

  return (
    <StaggerContainer client:visible className="grid grid-cols-2 gap-6">
      {cards}
    </StaggerContainer>
  );
};
