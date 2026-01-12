import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Particles = ({ count = 20, className = "" }: { count?: number, className?: string }) => {
  // On utilise un state pour l'hydratation client uniquement
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      y: Math.random() * 100, // %
      size: Math.random() * 3 + 1, // px
      duration: Math.random() * 20 + 10, // s
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -100, 0], // Flotte vers le haut puis redescend
            x: [0, Math.random() * 50 - 25, 0], // Mouvement latéral léger
            opacity: [0.2, 0.8, 0.2], // Scintillement
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
