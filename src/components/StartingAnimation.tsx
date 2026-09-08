'use client';

import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartingAnimationProps {
  onComplete: () => void;
}

export default function StartingAnimation({ onComplete }: StartingAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => {
      try {
        localStorage.setItem('has_seen_intro', 'true');
      } catch (e) {}
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md space-y-6">
        {/* Animated Brand Icon */}
        <motion.div
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/30 border border-white/20"
        >
          <GraduationCap className="h-10 w-10 text-white" />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black tracking-tight"
          >
            Scholar<span className="text-emerald-400">Mate</span>
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm text-slate-400 font-medium"
          >
            AI-Powered Academic Exam Operating System
          </motion.p>
        </div>

        {/* Status ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-emerald-400"
        >
          <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          <span>
            {step === 0 && "Connecting AI Engine..."}
            {step === 1 && "Indexing Syllabus Units..."}
            {step >= 2 && "Welcome, Scholar!"}
          </span>
        </motion.div>

        {/* Skip button */}
        <button
          onClick={() => {
            try {
              localStorage.setItem('has_seen_intro', 'true');
            } catch (e) {}
            onComplete();
          }}
          className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          Skip Intro →
        </button>
      </div>
    </motion.div>
  );
}
