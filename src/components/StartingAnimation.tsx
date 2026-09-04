"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles, Brain, Cpu, CheckCircle } from "lucide-react";

interface StartingAnimationProps {
  onComplete: () => void;
}

export default function StartingAnimation({ onComplete }: StartingAnimationProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    "Initializing ScholarMate Neural Engine...",
    "Loading 3D WebGL Spatial Mesh...",
    "Calibrating Polytechnic Syllabus Knowledge Base...",
    "ScholarMate AI Ready — Welcome, Student!",
  ];

  useEffect(() => {
    // Progress bar runner
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        const next = prev + 2;
        if (next > 75) setStep(3);
        else if (next > 50) setStep(2);
        else if (next > 25) setStep(1);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4 text-center select-none overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-purple-600/20 blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Animated 3D Logo Orb */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer rotating dashed ring */}
          <motion.div
            className="absolute h-32 w-32 rounded-full border-2 border-dashed border-cyan-400/60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />

          {/* Reverse rotating outer ring */}
          <motion.div
            className="absolute h-40 w-40 rounded-full border border-indigo-500/40"
            animate={{ rotate: -360, scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />

          {/* Glowing central cube/badge */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[2px] shadow-[0_0_35px_rgba(56,189,248,0.5)]"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <GraduationCap className="h-10 w-10 text-cyan-400 animate-bounce" />
            </div>
          </motion.div>
        </div>

        {/* Brand Titles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span>Final Year Project (2026-2027)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-1">
            Scholar<span className="text-cyan-400">Mate</span>
          </h1>

          <p className="text-xs font-semibold text-cyan-300 tracking-wider">
            AANM & VVRSR POLYTECHNIC COLLEGE
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-1">
            Department of Artificial Intelligence & Machine Learning (AI & ML)
          </p>
          <div className="mt-2 inline-block rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-[10px] text-indigo-300">
            <span>Dev Team: </span>
            <strong className="text-white">Vastav</strong> (Lead) • <strong className="text-white">Vishnu</strong> • <strong className="text-white">Nikhileswar</strong> • <strong className="text-white">Sathvik</strong>
          </div>
        </motion.div>

        {/* Dynamic Progress Indicator */}
        <div className="w-full mt-10 space-y-3">
          {/* Progress bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_15px_#38bdf8]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              {progress === 100 ? (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              )}
              {loadingSteps[step]}
            </span>
            <span className="font-mono font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="mt-8 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-semibold"
        >
          Skip Intro →
        </button>
      </div>
    </motion.div>
  );
}
