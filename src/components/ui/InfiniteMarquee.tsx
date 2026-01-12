import React from "react";
import { motion } from "framer-motion";

export const InfiniteMarquee = ({ 
  children, 
  direction = "left", 
  speed = 50,
  className = "" 
}: { 
  children: React.ReactNode; 
  direction?: "left" | "right"; 
  speed?: number;
  className?: string;
}) => {
  return (
    <div className={`flex overflow-hidden relative z-0 ${className}`}>
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
        className="flex flex-shrink-0 gap-10 py-4 pr-10"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};
