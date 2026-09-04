"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClickWave {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function ClickEffect() {
  const [waves, setWaves] = useState<ClickWave[]>([]);

  useEffect(() => {
    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#f43f5e"];

    const handleClick = (e: MouseEvent) => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newWave: ClickWave = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
      };

      setWaves((prev) => [...prev.slice(-5), newWave]);

      setTimeout(() => {
        setWaves((prev) => prev.filter((w) => w.id !== newWave.id));
      }, 750);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {waves.map((wave) => (
          <React.Fragment key={wave.id}>
            {/* Primary Harmonic Shockwave Ring */}
            <motion.span
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 3.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                left: wave.x - 24,
                top: wave.y - 24,
                borderColor: wave.color,
                boxShadow: `0 0 20px ${wave.color}`,
              }}
              className="absolute h-12 w-12 rounded-full border-2 bg-transparent"
            />

            {/* Secondary Soft Ambient Wave */}
            <motion.span
              initial={{ scale: 0.2, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                left: wave.x - 16,
                top: wave.y - 16,
                backgroundColor: `${wave.color}25`,
              }}
              className="absolute h-8 w-8 rounded-full blur-sm"
            />
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}
