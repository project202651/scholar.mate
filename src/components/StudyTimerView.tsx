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
  VolumeX,
  Coffee,
  Utensils,
  BookOpen,
  ArrowRight,
  TrendingUp,
  History,
  Calendar,
  Layers,
  Award,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface StudyTimerViewProps {
  initialTopic?: string;
  initialSubject?: string;
  onNavigateToPractice?: (topic: string) => void;
}

interface SessionRecord {
  id: string;
  topic: string;
  subject: string;
  durationMinutes: number;
  mode: 'focus' | 'short_break' | 'meal_break';
  timestamp: string;
}

// Process Time Limit Recommendations based on syllabus exam question types
interface ProcessSuggestion {
  id: string;
  title: string;
  minutes: number;
  category: string;
  badge: string;
  badgeColor: string;
  desc: string;
  examContext: string;
}

const PROCESS_SUGGESTIONS: ProcessSuggestion[] = [
  {
    id: "derivation",
    title: "10-Mark Core Derivation / Numerical",
    minutes: 45,
    category: "Deep Analytical",
    badge: "Recommended: 45 Mins",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    desc: "Optimal cognitive flow state for complex derivations, Gantt scheduling proofs, and multi-step algorithm traces.",
    examContext: "Banker's Algorithm, Page Replacement, QuickSort, Subnetting"
  },
  {
    id: "architecture",
    title: "7-Mark Architecture & Diagram Scheme",
    minutes: 25,
    category: "Standard Pomodoro",
    badge: "Recommended: 25 Mins",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    desc: "Classic high-focus Pomodoro interval for schematic architecture diagrams, block layouts, and comparative matrices.",
    examContext: "OS Process States, OSI 7-Layer, ER Diagrams, Microprocessor Pins"
  },
  {
    id: "definitions",
    title: "3-Mark Definitions & Formula Sprint",
    minutes: 15,
    category: "Active Recall",
    badge: "Recommended: 15 Mins",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    desc: "High-intensity rapid recall drill to memorize definitions, key equations, theorem statements, and acronyms.",
    examContext: "Deadlock Conditions, Thrashing, ACID Properties, Nyquist Rate"
  },
  {
    id: "mock",
    title: "University Timed Section / Mock Exam",
    minutes: 60,
    category: "Exam Simulation",
    badge: "Recommended: 60 Mins",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    desc: "Strict simulation of 1-hour continuous exam section under real university time pressure without distractions.",
    examContext: "Mid-Term Test Part B, End-Semester Question 1-4 Drills"
  },
  {
    id: "unit_deep",
    title: "Complete Unit Deep Mastery & Synthesis",
    minutes: 90,
    category: "Cognitive Immersion",
    badge: "Recommended: 90 Mins",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    desc: "Extended deep revision block to cover an entire syllabus module from fundamental concepts to solved papers.",
    examContext: "Full Unit Review: Memory Management, Normalization, TCP/IP"
  },
  {
    id: "eating_break",
    title: "Meal, Nutrition & Cognitive Rest",
    minutes: 30,
    category: "Recharge & Rest",
    badge: "Recommended: 30 Mins",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    desc: "Scheduled eating & hydration recharge to replenish brain glucose and prevent late-session mental fatigue.",
    examContext: "Lunch/Dinner break, physical stretching, brain relaxation"
  }
];

export default function StudyTimerView({
  initialTopic,
  initialSubject,
  onNavigateToPractice
}: StudyTimerViewProps) {
  const [topic, setTopic] = useState(initialTopic || "Engineering Exam Preparation");
  const [subject, setSubject] = useState(initialSubject || "Operating Systems");
  
  // Modes: 'focus' | 'short_break' | 'meal_break'
  const [mode, setMode] = useState<'focus' | 'short_break' | 'meal_break'>('focus');

  // Time settings per mode
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [mealBreakMinutes, setMealBreakMinutes] = useState(30);

  // Active timer state
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editInputMinutes, setEditInputMinutes] = useState("25");

  // Analytics & History
  const [completedSessions, setCompletedSessions] = useState(0);
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [streakCount, setStreakCount] = useState(7);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>("architecture");

  // Keep topic/subject in sync if props change
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
  }, [initialSubject]);

  // Load saved session history and stats from localStorage & API
  useEffect(() => {
    try {
      const stored = localStorage.getItem("scholarmate_focus_history");
      if (stored) {
        const parsed: SessionRecord[] = JSON.parse(stored);
        setHistory(parsed);
        const totalMins = parsed.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        setTodayStudyMinutes(totalMins);
        setCompletedSessions(parsed.length);
      }
    } catch {}

    // Fetch live user progress
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.progress) {
          if (data.progress.streakCount) setStreakCount(data.progress.streakCount);
        }
      })
      .catch(() => {});
  }, []);

  // Web Audio chime generator (No external MP3 file needed, 100% reliable offline & in all browsers)
  const playChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      };

      playTone(587.33, 0.0, 0.4); // D5
      playTone(880.0, 0.25, 0.6); // A5
    } catch (e) {
      console.warn("Web audio unavailable:", e);
    }
  };

  // Timer Tick Hook
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    playChime();

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    const newRecord: SessionRecord = {
      id: Date.now().toString(),
      topic: topic || "Focus Session",
      subject: subject || "Engineering Core",
      durationMinutes: customMinutes,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [newRecord, ...history].slice(0, 15);
    setHistory(updatedHistory);
    setCompletedSessions((prev) => prev + 1);
    setTodayStudyMinutes((prev) => prev + customMinutes);

    try {
      localStorage.setItem("scholarmate_focus_history", JSON.stringify(updatedHistory));
    } catch {}

    // Only sync study minutes to DB for focus sessions (breaks don't inflate study logs)
    if (mode === 'focus') {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes: customMinutes })
        });
      } catch (e) {
        console.error("Progress sync error:", e);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleSwitchMode = (targetMode: 'focus' | 'short_break' | 'meal_break') => {
    setIsRunning(false);
    setMode(targetMode);
    let mins = focusMinutes;
    if (targetMode === 'short_break') mins = shortBreakMinutes;
    if (targetMode === 'meal_break') mins = mealBreakMinutes;

    setCustomMinutes(mins);
    setEditInputMinutes(mins.toString());
    setTimeLeft(mins * 60);
    setIsEditingTime(false);
  };

  const adjustMinutes = (delta: number) => {
    const nextMin = Math.max(1, Math.min(180, customMinutes + delta));
    setCustomMinutes(nextMin);
    setEditInputMinutes(nextMin.toString());

    if (mode === 'focus') setFocusMinutes(nextMin);
    else if (mode === 'short_break') setShortBreakMinutes(nextMin);
    else setMealBreakMinutes(nextMin);

    if (!isRunning) {
      setTimeLeft(nextMin * 60);
    } else {
      setTimeLeft((prev) => Math.max(0, prev + delta * 60));
    }
  };

  const saveCustomTime = () => {
    const parsed = parseInt(editInputMinutes, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 180) {
      setCustomMinutes(parsed);
      setTimeLeft(parsed * 60);
      setIsRunning(false);

      if (mode === 'focus') setFocusMinutes(parsed);
      else if (mode === 'short_break') setShortBreakMinutes(parsed);
      else setMealBreakMinutes(parsed);
    }
    setIsEditingTime(false);
  };

  // Convert Process to Time Limit Suggestion
  const applyProcessSuggestion = (item: ProcessSuggestion) => {
    setSelectedProcessId(item.id);
    setIsRunning(false);

    if (item.id === "eating_break") {
      setMode('meal_break');
      setMealBreakMinutes(item.minutes);
      setTopic("Nutrition & Mental Refreshment Break");
    } else {
      setMode('focus');
      setFocusMinutes(item.minutes);
      setTopic(`${subject}: ${item.title}`);
    }

    setCustomMinutes(item.minutes);
    setEditInputMinutes(item.minutes.toString());
    setTimeLeft(item.minutes * 60);
    setIsEditingTime(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = customMinutes * 60;
  const progressPercent = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header Banner with Live Subject Context */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <Clock className="h-3.5 w-3.5" />
            <span>Intelligent Process Study Clock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Focus Timer &amp; Process Time Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Convert complex engineering study processes into scientifically backed time blocks with custom intervals, eating/meal rest settings, and real-time exam tracking.
          </p>
        </div>

        {/* Audio Sound & Quick Toggles */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              soundEnabled
                ? "bg-[#54d6c7]/20 text-[#54d6c7] border-[#54d6c7]/40 shadow-sm"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
            title="Toggle Chime Sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? "Chime On" : "Chime Muted"}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Focus Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Today's Focus Time</span>
            <Clock className="h-4 w-4 text-[#54d6c7]" />
          </div>
          <div className="text-2xl font-black text-white">
            {todayStudyMinutes} <span className="text-xs font-medium text-slate-400">mins</span>
          </div>
          <p className="text-[10px] text-[#54d6c7] font-bold">
            {(todayStudyMinutes / 60).toFixed(1)} hrs total study
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Completed Blocks</span>
            <CheckCircle2 className="h-4 w-4 text-[#70d6a8]" />
          </div>
          <div className="text-2xl font-black text-white">{completedSessions}</div>
          <p className="text-[10px] text-slate-400">Target: 4-6 sessions/day</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Focus Streak</span>
            <Flame className="h-4 w-4 text-[#f6c85f]" />
          </div>
          <div className="text-2xl font-black text-white">
            {streakCount} <span className="text-xs font-medium text-slate-400">days</span>
          </div>
          <p className="text-[10px] text-[#f6c85f] font-bold">Active consistency</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Retention Impact</span>
            <TrendingUp className="h-4 w-4 text-[#8b5cf6]" />
          </div>
          <div className="text-2xl font-black text-white">
            +{Math.min(25, Math.max(5, Math.round(todayStudyMinutes * 0.15)))}%
          </div>
          <p className="text-[10px] text-[#8b5cf6] font-bold">SM-2 Spaced Recall boost</p>
        </div>
      </div>

      {/* Main Timer Layout: Left Side Clock & Settings, Right Side Process Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timer Control Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 backdrop-blur-2xl shadow-xl flex flex-col items-center text-center space-y-6">
          
          {/* Mode Selector Tabs: Focus vs Short Break vs Meal/Long Break ("eating time settings") */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 w-full max-w-md justify-between">
            <button
              onClick={() => handleSwitchMode('focus')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'focus'
                  ? 'bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Focus Study</span>
            </button>

            <button
              onClick={() => handleSwitchMode('short_break')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'short_break'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="h-3.5 w-3.5" />
              <span>Short Break</span>
            </button>

            <button
              onClick={() => handleSwitchMode('meal_break')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'meal_break'
                  ? 'bg-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Meal / Rest</span>
            </button>
          </div>

          {/* Topic & Subject Input */}
          <div className="w-full max-w-md space-y-1.5 text-left">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {mode === 'focus' ? 'Focus Target / Concept' : 'Break Objective / Refreshment'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems: Banker's Algorithm"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-xs sm:text-sm font-semibold text-white focus:border-[#54d6c7] focus:outline-hidden transition-all"
            />
          </div>

          {/* Circular Countdown Progress Ring */}
          <div className="relative flex flex-col items-center justify-center my-2">
            <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50%"
                cy="50%"
                r="110"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
                fill="transparent"
              />
              {/* Animated Progress ring */}
              <circle
                cx="50%"
                cy="50%"
                r="110"
                stroke="currentColor"
                strokeWidth="8"
                className={
                  mode === 'focus'
                    ? 'text-[#54d6c7] transition-all duration-1000 ease-linear'
                    : mode === 'short_break'
                    ? 'text-teal-400 transition-all duration-1000 ease-linear'
                    : 'text-orange-400 transition-all duration-1000 ease-linear'
                }
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Clock Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white drop-shadow-md">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase mt-1 text-slate-400">
                {isRunning ? (mode === 'focus' ? 'Session In Progress' : 'Break In Progress') : 'Session Ready'}
              </span>
            </div>
          </div>

          {/* Edit Time Settings & Steppers */}
          <div className="space-y-3 w-full max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>Goal: {customMinutes} Minutes</span>
              {!isRunning && (
                <button
                  onClick={() => setIsEditingTime(!isEditingTime)}
                  className="text-[#54d6c7] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>{isEditingTime ? "Cancel Edit" : "Custom Minutes"}</span>
                </button>
              )}
            </div>

            {/* Custom Minutes Input Box */}
            {isEditingTime && !isRunning && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-[#54d6c7]/30">
                <span className="text-xs font-semibold text-slate-300">Set Minutes:</span>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={editInputMinutes}
                  onChange={(e) => setEditInputMinutes(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg border border-white/20 bg-black/40 text-xs font-bold text-white text-center"
                />
                <button
                  onClick={saveCustomTime}
                  className="px-3 py-1 rounded-lg bg-[#54d6c7] hover:bg-[#43bdaf] text-slate-950 text-xs font-black transition-all cursor-pointer"
                >
                  Apply Limit
                </button>
              </div>
            )}

            {/* Quick Increment / Decrement Stepper Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[-10, -5, -1, 1, 5, 10].map((delta) => (
                <button
                  key={delta}
                  onClick={() => adjustMinutes(delta)}
                  className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {delta > 0 ? `+${delta}m` : `${delta}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Controls (Play / Pause / Reset) */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={resetTimer}
              title="Reset Timer"
              className="p-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-sm text-slate-950 shadow-xl transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-400/25'
                  : 'bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 shadow-[#54d6c7]/30 hover:scale-105'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 text-slate-950" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-slate-950 text-slate-950" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Process Time Limit Converter Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#54d6c7]" />
                  <span>Process Time Limit Suggestions</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select your study task to automatically convert &amp; set the ideal duration.
                </p>
              </div>
            </div>

            {/* List of Smart Process Suggestions */}
            <div className="space-y-2.5">
              {PROCESS_SUGGESTIONS.map((item) => {
                const isSelected = selectedProcessId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => applyProcessSuggestion(item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                      isSelected
                        ? 'border-[#54d6c7] bg-[#54d6c7]/10 shadow-md'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white leading-tight">
                        {item.title}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-normal">
                      {item.desc}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span className="italic truncate max-w-[200px]">Ex: {item.examContext}</span>
                      <span className="text-[#54d6c7] font-bold flex items-center gap-0.5 shrink-0">
                        {isSelected ? "Active Preset" : "Apply & Convert"}
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Focus Sessions History Log ("display data") */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#54d6c7]" />
            <h2 className="text-base font-black text-white">
              Completed Focus Sessions &amp; History Log
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {history.length} recent sessions tracked
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-white/10 bg-slate-900/40">
            <Clock className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-slate-300">No focus sessions logged yet today</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start your first Pomodoro or Process Derivation block above. Your completed sessions, study minutes, and retention boost will display here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Session Objective / Topic</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-all">
                    <td className="py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {record.mode === 'focus' ? (
                          <Zap className="h-3.5 w-3.5 text-[#54d6c7] shrink-0" />
                        ) : record.mode === 'short_break' ? (
                          <Coffee className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        ) : (
                          <Utensils className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                        )}
                        <span className="line-clamp-1">{record.topic}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 capitalize">
                      {record.mode.replace('_', ' ')}
                    </td>
                    <td className="py-3 font-mono font-bold text-[#54d6c7]">
                      {record.durationMinutes} mins
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {record.timestamp}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed (+{record.durationMinutes} XP)</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
