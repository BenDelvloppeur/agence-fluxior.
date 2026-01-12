import React from "react";
import { clsx } from "clsx";

export const Meteors = ({ number = 20 }: { number?: number }) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={clsx(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-white shadow-[0_0_0_1px_#ffffff10]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[150px] before:h-[1px] before:bg-gradient-to-r before:from-white before:to-transparent",
          )}
          style={{
            // Position de départ large pour couvrir l'écran
            left: Math.floor(Math.random() * (1200 - -400) + -400) + "px",
            top: Math.floor(Math.random() * (-100 - -300) + -300) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (8 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};
