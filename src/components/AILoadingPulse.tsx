"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Cpu, BookOpen } from "lucide-react";

interface AILoadingPulseProps {
  message?: string;
  steps?: string[];
}

export default function AILoadingPulse({
  message = "ScholarMate AI is thinking...",
  steps = [
    "Analyzing study syllabus...",
    "Extracting core concepts & formulas...",
    "Formulating high-yield exam insights...",
    "Polishing structured study deck...",
  ],
}: AILoadingPulseProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!steps || steps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Outer pulsing ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-500/30 to-indigo-600/30 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
        />

        {/* 3D Rotating Ring */}
        <motion.div
          className="h-16 w-16 rounded-full border-2 border-dashed border-cyan-400/80 border-t-indigo-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />

        {/* Center glowing icon */}
        <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-indigo-500/40 shadow-[0_0_15px_#6366f1]">
          <Brain className="h-5 w-5 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-base font-semibold text-slate-100 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          {message}
        </h4>
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-1 text-sm text-slate-400"
        >
          {steps[currentStep]}
        </motion.p>
      </div>

      {/* Futuristic Progress Bar */}
      <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800 border border-slate-700/50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
