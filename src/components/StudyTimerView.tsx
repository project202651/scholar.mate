'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Edit2,
  Check,
  Flame,
  Volume2,
  VolumeX
} from "lucide-react";
import confetti from "canvas-confetti";

interface StudyTimerViewProps {
  initialTopic?: string;
  onNavigateToPractice?: (topic: string) => void;
}

export default function StudyTimerView({ initialTopic, onNavigateToPractice }: StudyTimerViewProps) {
  const [topic, setTopic] = useState(initialTopic || "Engineering Exam Preparation");
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editInputMinutes, setEditInputMinutes] = useState("25");
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setCompletedSessions((prev) => prev + 1);

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes: customMinutes })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const adjustMinutes = (delta: number) => {
    const nextMin = Math.max(1, Math.min(180, customMinutes + delta));
    setCustomMinutes(nextMin);
    setEditInputMinutes(nextMin.toString());
    if (!isRunning) {
      setTimeLeft(nextMin * 60);
    } else {
      setTimeLeft((prev) => Math.max(0, prev + delta * 60));
    }
  };

  const handleSetPreset = (mins: number) => {
    setIsRunning(false);
    setCustomMinutes(mins);
    setEditInputMinutes(mins.toString());
    setTimeLeft(mins * 60);
    setIsEditingTime(false);
  };

  const saveCustomTime = () => {
    const parsed = parseInt(editInputMinutes, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 180) {
      setCustomMinutes(parsed);
      setTimeLeft(parsed * 60);
      setIsRunning(false);
    }
    setIsEditingTime(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = customMinutes * 60;
  const progressPercent = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-emerald-100 border border-white/20">
            <Clock className="h-3.5 w-3.5" />
            <span>Active Study Focus Clock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Focus & Deep Work Timer
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Customizable Pomodoro intervals designed for deep revision, derivation proofs, and mock drills.
          </p>
        </div>
      </div>

      {/* Main Timer Display Panel */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-8 sm:p-12 backdrop-blur-2xl shadow-xl flex flex-col items-center text-center space-y-8">
        {/* Topic Input Bar */}
        <div className="w-full max-w-md">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Focus Topic / Objective
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Operating Systems: Banker's Algorithm"
            className="w-full text-center px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>

        {/* Large Countdown Clock */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="text-6xl sm:text-8xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
            {formatTime(timeLeft)}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Session Goal: {customMinutes} Minutes</span>
            {!isRunning && (
              <button
                onClick={() => setIsEditingTime(!isEditingTime)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>
        </div>

        {/* Editable Inline Minute Form */}
        {isEditingTime && !isRunning && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Set Minutes:</span>
            <input
              type="number"
              min="1"
              max="180"
              value={editInputMinutes}
              onChange={(e) => setEditInputMinutes(e.target.value)}
              className="w-20 px-2 py-1 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white text-center"
            />
            <button
              onClick={saveCustomTime}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Set
            </button>
          </div>
        )}

        {/* Quick Increment / Decrement Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => adjustMinutes(-5)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            -5m
          </button>
          <button
            onClick={() => adjustMinutes(-1)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            -1m
          </button>
          <button
            onClick={() => adjustMinutes(+1)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            +1m
          </button>
          <button
            onClick={() => adjustMinutes(+5)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            +5m
          </button>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all cursor-pointer ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:scale-105'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Modes */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-200/60 dark:border-white/5 w-full">
          <span className="text-xs text-slate-400 mr-2">Presets:</span>
          {[
            { label: "15m Sprint", mins: 15 },
            { label: "25m Pomodoro", mins: 25 },
            { label: "45m Derivation", mins: 45 },
            { label: "60m Mock Test", mins: 60 },
            { label: "90m Deep Work", mins: 90 },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => handleSetPreset(preset.mins)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                customMinutes === preset.mins
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
