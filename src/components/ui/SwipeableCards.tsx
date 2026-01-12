import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableCardsProps {
  children: React.ReactNode[];
  className?: string;
  cardClassName?: string;
  desktopGridCols?: string; // Pour personnaliser la grille desktop (ex: "md:grid-cols-2")
}

export const SwipeableCards: React.FC<SwipeableCardsProps> = ({
  children,
  className = '',
  cardClassName = '',
  desktopGridCols = 'md:grid-cols-3',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canSwipeLeft, setCanSwipeLeft] = useState(false);
  const [canSwipeRight, setCanSwipeRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  const totalCards = children.length;

  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth);
      }
    };
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  useEffect(() => {
    setCanSwipeLeft(currentIndex > 0);
    setCanSwipeRight(currentIndex < totalCards - 1);
  }, [currentIndex, totalCards]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalCards) {
      setCurrentIndex(index);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const threshold = 50; // Distance minimale pour déclencher le swipe
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 && canSwipeLeft) {
        goToSlide(currentIndex - 1);
      } else if (info.offset.x < 0 && canSwipeRight) {
        goToSlide(currentIndex + 1);
      }
    }
  };

  const nextSlide = () => {
    if (canSwipeRight) {
      goToSlide(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (canSwipeLeft) {
      goToSlide(currentIndex - 1);
    }
  };

  if (totalCards === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Desktop: Grille normale */}
      <div className={`hidden md:grid ${desktopGridCols} gap-6 auto-rows-[300px]`}>
        {children}
      </div>

      {/* Mobile: Carousel Swipeable */}
      <div ref={containerRef} className="md:hidden relative w-full overflow-hidden" style={{ touchAction: 'pan-x' }}>
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{
            x: slideWidth > 0 ? -currentIndex * slideWidth : `-${currentIndex * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          style={{
            width: `${totalCards * 100}%`,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${cardClassName}`}
              style={{
                width: `${100 / totalCards}%`,
              }}
            >
              {child}
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows (optionnel, pour accessibilité) */}
        {canSwipeLeft && (
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Card précédente"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canSwipeRight && (
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Card suivante"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Indicateurs de pagination (Dots) */}
        {totalCards > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Aller à la card ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
