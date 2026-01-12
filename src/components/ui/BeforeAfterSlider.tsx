import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
}

export const BeforeAfterSlider = ({ beforeImage, afterImage, alt, className = "" }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = (event as React.MouseEvent).clientX;
    }

    const position = ((clientX - containerRect.left) / containerRect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  // Handle global mouse up to stop dragging even outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const position = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setSliderPosition(Math.min(100, Math.max(0, position)));
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-ew-resize select-none ${className}`}
      onMouseMove={(e) => !isDragging && handleMove(e)} // Optional: Move on hover too? No, usually drag or hover. Let's stick to drag or just mouse move if we want strict follow.
      // Better UX: Drag interaction
      onMouseDown={handleMouseDown}
      onTouchMove={handleMove}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background - Full Visible) */}
      <img 
        src={afterImage} 
        alt={`${alt} Après`} 
        className="absolute inset-0 w-full h-full object-cover" 
        draggable={false}
      />
      
      {/* Label After */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white z-10 pointer-events-none">
        Après
      </div>

      {/* Before Image (Clipped on top) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt={`${alt} Avant`} 
          className="absolute inset-0 w-full h-full object-cover" 
          draggable={false}
        />
        
        {/* Label Before */}
        <div className="absolute top-4 left-4 bg-yellow-600/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white z-10 pointer-events-none">
            Avant
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-900">
            <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
};
