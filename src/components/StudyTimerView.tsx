"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  Bell,
  Coffee,
  BrainCircuit,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

type TimerMode = "pomodoro" | "deep" | "exam" | "custom";
type SessionType = "focus" | "shortBreak" | "longBreak";

const PRESET_SUBJECTS = [
  "Artificial Intelligence & ML",
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Applied Mathematics",
  "Final Year Project Work",
];

const MOTIVATIONAL_QUOTES = [
  "Focus is the bridge between goals and polytechnic excellence.",
  "Small daily improvements over time lead to stunning semester results.",
  "Deep work in AI & ML builds the skills of tomorrow.",
  "Your future self will thank you for the focus you put in today.",
  "One concept at a time. Master the fundamentals first.",
  "Consistency beats intensity. Keep the study streak alive!",
];

export default function StudyTimerView() {
  // Timer settings
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [selectedSubject, setSelectedSubject] = useState(PRESET_SUBJECTS[0]);
  
  // Durations in minutes
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [examDuration, setExamDuration] = useState(60);

  // Active state
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusedMinutes, setTotalFocusedMinutes] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  
  // Audio states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<"none" | "white" | "binaural">("none");
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<any>(null);

  // Motivational quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Sync timeLeft when mode changes and timer is not running
  useEffect(() => {
    if (!isRunning) {
      if (sessionType === "focus") {
        if (timerMode === "pomodoro") setTimeLeft(25 * 60);
        else if (timerMode === "deep") setTimeLeft(50 * 60);
        else if (timerMode === "exam") setTimeLeft(examDuration * 60);
        else setTimeLeft(focusDuration * 60);
      } else if (sessionType === "shortBreak") {
        setTimeLeft(shortBreakDuration * 60);
      } else if (sessionType === "longBreak") {
        setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [timerMode, sessionType, focusDuration, shortBreakDuration, longBreakDuration, examDuration, isRunning]);

  // Rotate motivational quote every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio chime for timer finish
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.65);
      });
    } catch (e) {
      console.error("Audio chime error", e);
    }
  };

  // Ambient sound synthesizer using Web Audio API
  useEffect(() => {
    // Stop any existing ambient node
    if (ambientNodeRef.current) {
      try {
        ambientNodeRef.current.stop();
        ambientNodeRef.current.disconnect();
      } catch (e) {}
      ambientNodeRef.current = null;
    }

    if (ambientSound === "none") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (ambientSound === "white") {
        // Generate smooth soft pink/white noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.03; // Soft soothing pink noise
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;
        whiteNoise.connect(filter);
        filter.connect(ctx.destination);
        whiteNoise.start();
        ambientNodeRef.current = whiteNoise;
      } else if (ambientSound === "binaural") {
        // Generate 10Hz Alpha Waves (focus & learning brainwave)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();
        gain.gain.value = 0.04;

        oscLeft.frequency.value = 210; // Base carrier
        oscRight.frequency.value = 220; // 10Hz difference for Alpha state focus

        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscLeft.start();
        oscRight.start();
        ambientNodeRef.current = {
          stop: () => {
            oscLeft.stop();
            oscRight.stop();
          },
          disconnect: () => {
            merger.disconnect();
            gain.disconnect();
          },
        };
      }
    } catch (e) {
      console.warn("Ambient audio error", e);
    }

    return () => {
      if (ambientNodeRef.current) {
        try {
          ambientNodeRef.current.stop();
          ambientNodeRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, [ambientSound]);

  // Record completed focus session to database
  const recordSession = async (minutes: number) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, subject: selectedSubject }),
      });
    } catch (err) {
      console.error("Failed to sync study minutes", err);
    }
  };

  // Main countdown timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
      // Session finished!
      playCompletionChime();
      setIsRunning(false);

      if (sessionType === "focus") {
        const sessionMins =
          timerMode === "pomodoro"
            ? 25
            : timerMode === "deep"
            ? 50
            : timerMode === "exam"
            ? examDuration
            : focusDuration;

        setCompletedSessions((prev) => prev + 1);
        setTotalFocusedMinutes((prev) => prev + sessionMins);
        recordSession(sessionMins);

        // Confetti burst on completing focus
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        // Auto switch to break
        if ((completedSessions + 1) % 4 === 0) {
          setSessionType("longBreak");
          setTimeLeft(longBreakDuration * 60);
        } else {
          setSessionType("shortBreak");
          setTimeLeft(shortBreakDuration * 60);
        }
      } else {
        // Break finished, ready for focus
        setSessionType("focus");
        if (timerMode === "pomodoro") setTimeLeft(25 * 60);
        else if (timerMode === "deep") setTimeLeft(50 * 60);
        else if (timerMode === "exam") setTimeLeft(examDuration * 60);
        else setTimeLeft(focusDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, timerMode, completedSessions, focusDuration, shortBreakDuration, longBreakDuration, examDuration]);

  // Formatting helpers
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate percentage of timer completed
  const getTotalDurationSeconds = () => {
    if (sessionType === "focus") {
      if (timerMode === "pomodoro") return 25 * 60;
      if (timerMode === "deep") return 50 * 60;
      if (timerMode === "exam") return examDuration * 60;
      return focusDuration * 60;
    }
    if (sessionType === "shortBreak") return shortBreakDuration * 60;
    return longBreakDuration * 60;
  };

  const totalSecs = getTotalDurationSeconds();
  const progressPercent = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;
  const strokeRadius = 140;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSecs);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (sessionType === "focus") {
      setSessionType("shortBreak");
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setSessionType("focus");
      if (timerMode === "pomodoro") setTimeLeft(25 * 60);
      else if (timerMode === "deep") setTimeLeft(50 * 60);
      else if (timerMode === "exam") setTimeLeft(examDuration * 60);
      else setTimeLeft(focusDuration * 60);
    }
  };

  const handleAddFiveMinutes = () => {
    setTimeLeft((prev) => prev + 300);
  };

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isZenMode
          ? "fixed inset-0 z-50 bg-slate-950/98 p-6 sm:p-12 overflow-y-auto flex flex-col justify-between"
          : "pb-12"
      }`}
    >
      {/* Top Header & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/25 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Student Study <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Timer & Focus</span>
            </h1>
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
              Active Recall Suite
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Boost retention with scientific Pomodoro intervals, exam simulation, and deep work intervals.
          </p>
        </div>

        {/* Top Control Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Chime sound enabled" : "Chime sound muted"}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              soundEnabled
                ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                : "border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300"
            }`}
          >
            {soundEnabled ? <Bell className="h-4 w-4 text-indigo-400" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">Chime</span>
          </button>

          {/* Zen Fullscreen Mode Toggle */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            title={isZenMode ? "Exit Zen Mode" : "Distraction-Free Zen Mode"}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            {isZenMode ? <Minimize2 className="h-4 w-4 text-cyan-400" /> : <Maximize2 className="h-4 w-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isZenMode ? "Exit Zen" : "Zen Focus"}</span>
          </button>
        </div>
      </div>

      {/* Timer Modes & Subject Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timer Control Card */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div
            className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
              sessionType === "focus" ? "bg-cyan-500/10" : "bg-emerald-500/10"
            }`}
          />
          <div
            className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
              sessionType === "focus" ? "bg-indigo-500/10" : "bg-amber-500/10"
            }`}
          />

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 relative z-10">
            <button
              onClick={() => {
                setTimerMode("pomodoro");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(25 * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                timerMode === "pomodoro"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
              }`}
            >
              🍅 Pomodoro (25/5m)
            </button>
            <button
              onClick={() => {
                setTimerMode("deep");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(50 * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                timerMode === "deep"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
              }`}
            >
              ⚡ Deep Study (50/10m)
            </button>
            <button
              onClick={() => {
                setTimerMode("exam");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(examDuration * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                timerMode === "exam"
                  ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
              }`}
            >
              📝 Exam Simulation
            </button>
            <button
              onClick={() => {
                setTimerMode("custom");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(focusDuration * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                timerMode === "custom"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
              }`}
            >
              ⚙️ Custom Timer
            </button>
          </div>

          {/* Session Phase Tag */}
          <div className="mb-4 relative z-10 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm ${
                sessionType === "focus"
                  ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                  : sessionType === "shortBreak"
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-purple-500/40 bg-purple-500/15 text-purple-300"
              }`}
            >
              {sessionType === "focus" ? (
                <>
                  <Flame className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  <span>Focus Session</span>
                </>
              ) : sessionType === "shortBreak" ? (
                <>
                  <Coffee className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Short Break (Rest Eyes)</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Long Refreshment Break</span>
                </>
              )}
            </span>
          </div>

          {/* Circular SVG Ring Countdown Display */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-72 h-72 sm:w-80 sm:h-80 transform -rotate-90">
              {/* Background track */}
              <circle
                cx="50%"
                cy="50%"
                r={strokeRadius}
                className="stroke-slate-800/70"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated progress stroke */}
              <circle
                cx="50%"
                cy="50%"
                r={strokeRadius}
                stroke={sessionType === "focus" ? "url(#timerGlowFocus)" : "url(#timerGlowBreak)"}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
              {/* Gradients */}
              <defs>
                <linearGradient id="timerGlowFocus" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="timerGlowBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Clock Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">
                {formatTime(timeLeft)}
              </span>
              <span className="mt-2 text-xs font-semibold text-slate-400 max-w-[190px] truncate">
                {selectedSubject}
              </span>
              <span className="mt-1 text-[11px] text-cyan-400/90 font-medium">
                Cycle #{completedSessions + 1}
              </span>
            </div>
          </div>

          {/* Primary Interactive Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 relative z-10">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl transition-all transform active:scale-95 ${
                isRunning
                  ? "bg-gradient-to-r from-amber-500 to-rose-600 shadow-amber-500/30 hover:brightness-110"
                  : "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 shadow-cyan-500/30 hover:brightness-110"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-white" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-white" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Reset Timer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleSkip}
              title="Skip to Next Session"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <button
              onClick={handleAddFiveMinutes}
              title="Add 5 Minutes to Clock"
              className="flex items-center gap-1 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-3 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>5m</span>
            </button>
          </div>

          {/* Motivational Rotating Quote */}
          <div className="mt-8 text-center max-w-md border-t border-slate-800/80 pt-4 relative z-10">
            <p className="text-xs italic text-slate-400">
              &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex]}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Settings, Subjects & Audio Suite */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Subject Selector */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>Subject Being Studied</span>
              </label>
              <span className="text-[11px] text-cyan-400 font-semibold">AI & ML Branch</span>
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-medium"
            >
              {PRESET_SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Ambient Study Audio Generator */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-indigo-400" />
                <span>Focus Audio Ambience</span>
              </span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                Web Audio
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synthesized background frequencies to drown out distractions.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setAmbientSound("none")}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  ambientSound === "none"
                    ? "border border-slate-700 bg-slate-800 text-white shadow-sm"
                    : "border border-slate-800/80 bg-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => setAmbientSound("white")}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  ambientSound === "white"
                    ? "border border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "border border-slate-800/80 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                Pink Noise
              </button>
              <button
                onClick={() => setAmbientSound("binaural")}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  ambientSound === "binaural"
                    ? "border border-purple-500/50 bg-purple-500/20 text-purple-300 shadow-sm"
                    : "border border-slate-800/80 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                10Hz Alpha
              </button>
            </div>
          </div>

          {/* Today's Study Stats Card */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-indigo-950/30 p-5 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Today's Study Session Stats</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                <span className="text-2xl font-black text-white">{completedSessions}</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 font-semibold">
                  Sessions Done
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                <span className="text-2xl font-black text-cyan-400">{totalFocusedMinutes}m</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 font-semibold">
                  Focus Time
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Completed focus time is automatically saved to your student profile!</span>
            </div>
          </div>

          {/* Exam Simulation Preset selector (if in Exam mode) */}
          {timerMode === "exam" && (
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-amber-400" />
                <span>Select Exam Paper Duration</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setExamDuration(mins);
                      if (!isRunning) setTimeLeft(mins * 60);
                    }}
                    className={`rounded-xl py-2 text-xs font-bold transition-all ${
                      examDuration === mins
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                        : "border border-amber-500/20 bg-slate-900/60 text-amber-200"
                    }`}
                  >
                    {mins} Mins
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom mode slider (if in Custom mode) */}
          {timerMode === "custom" && (
            <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Custom Focus: {focusDuration} min</span>
                <span className="text-emerald-400">Break: {shortBreakDuration} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={focusDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFocusDuration(val);
                  if (!isRunning && sessionType === "focus") setTimeLeft(val * 60);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5m</span>
                <span>30m</span>
                <span>60m</span>
                <span>120m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
