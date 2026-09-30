"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const DotBackground = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Static dot grid - darker/more visible dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Animated glow that drifts across the grid, lighting dots up as it passes */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
        animate={{
          x: ["-20%", "120%", "-20%"],
          y: ["10%", "70%", "10%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Fade the dot grid out toward the edges so it blends with the section */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, black 100%)",
          maskImage:
            "radial-gradient(ellipse at center, transparent 40%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, transparent 40%, black 100%)",
        }}
      />
    </div>
  );
};

export default DotBackground;