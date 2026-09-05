'use client';

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
  Target,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface StudyTimerViewProps {
  initialTopic?: string;
  onNavigateToPractice?: (topic: string) => void;
}

type TimerMode = "pomodoro" | "deep" | "exam" | "custom";
type SessionType = "focus" | "shortBreak" | "longBreak";

const PRESET_SUBJECTS = [
  "Operating Systems",
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Computer Networks",
  "Engineering Mathematics",
  "Theory of Computation",
];

const MOTIVATIONAL_QUOTES = [
  "Focus is the bridge between goals and exam excellence.",
  "25 minutes of deep focus on your weak topic transforms your exam score.",
  "One concept at a time. Eliminate the weakness before exam day.",
  "Your future self will thank you for the focus you put in right now.",
  "Master the derivations first, practice the problems second.",
  "Consistency beats intensity. Keep the study streak alive!",
];

export default function StudyTimerView({ initialTopic, onNavigateToPractice }: StudyTimerViewProps) {
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [selectedSubject, setSelectedSubject] = useState(PRESET_SUBJECTS[0]);
  const [targetTopic, setTargetTopic] = useState(initialTopic || "Deadlock Banker's Algorithm");
  
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
  
  // Post-session checkpoint
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [comprehensionScore, setComprehensionScore] = useState<number | null>(null);

  // Audio states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<"none" | "white" | "binaural">("none");
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<any>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (initialTopic) {
      setTargetTopic(initialTopic);
    }
  }, [initialTopic]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
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

  useEffect(() => {
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
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.03;
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
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();
        gain.gain.value = 0.04;

        oscLeft.frequency.value = 210;
        oscRight.frequency.value = 220;

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

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
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
        setShowCheckpoint(true);

        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        if ((completedSessions + 1) % 4 === 0) {
          setSessionType("longBreak");
          setTimeLeft(longBreakDuration * 60);
        } else {
          setSessionType("shortBreak");
          setTimeLeft(shortBreakDuration * 60);
        }
      } else {
        setSessionType("focus");
        if (timerMode === "pomodoro") setTimeLeft(25 * 60);
        else if (timerMode === "deep") setTimeLeft(50 * 60);
        else if (timerMode === "exam") setTimeLeft(examDuration * 60);
        else setTimeLeft(focusDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, timerMode, completedSessions, focusDuration, shortBreakDuration, longBreakDuration, examDuration]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isZenMode
          ? "fixed inset-0 z-50 bg-slate-950/98 p-6 sm:p-12 overflow-y-auto flex flex-col justify-between"
          : "pb-12"
      }`}
    >
      {/* Top Header & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md text-white">
              <Clock className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Weakness-Targeted <span className="text-indigo-600 dark:text-indigo-400">Focus & Pomodoro</span>
            </h1>
            <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/60 px-2.5 py-0.5 text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-300">
              Exam Sprint Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Eliminate exam weaknesses with disciplined focus sprints, ambient white noise, and post-session retention checkpoints.
          </p>
        </div>

        {/* Top Control Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Chime sound enabled" : "Chime sound muted"}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              soundEnabled
                ? "border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300"
                : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500"
            }`}
          >
            {soundEnabled ? <Bell className="h-4 w-4 text-indigo-500" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">Chime</span>
          </button>

          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            {isZenMode ? <Minimize2 className="h-4 w-4 text-cyan-500" /> : <Maximize2 className="h-4 w-4 text-cyan-500" />}
            <span className="hidden sm:inline">{isZenMode ? "Exit Zen" : "Zen Mode"}</span>
          </button>
        </div>
      </div>

      {/* Target Weakness Focus Bar */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-cyan-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
              Current Weakness Focus Objective
            </span>
            <input
              type="text"
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              placeholder="Enter specific topic or problem to conquer in this sprint..."
              className="bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none w-full border-b border-indigo-300 dark:border-indigo-700 focus:border-indigo-600 pb-0.5"
            />
          </div>
        </div>

        {onNavigateToPractice && (
          <button
            onClick={() => onNavigateToPractice(targetTopic)}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <span>Practice 5/10M for this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timer Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          
          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 relative z-10">
            <button
              onClick={() => {
                setTimerMode("pomodoro");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(25 * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                timerMode === "pomodoro"
                  ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                timerMode === "deep"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              ⚡ Deep Sprint (50/10m)
            </button>
            <button
              onClick={() => {
                setTimerMode("exam");
                setSessionType("focus");
                setIsRunning(false);
                setTimeLeft(examDuration * 60);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                timerMode === "exam"
                  ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              📝 Exam Simulation (60m)
            </button>
          </div>

          {/* Session Phase Tag */}
          <div className="mb-4 relative z-10 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                sessionType === "focus"
                  ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
              }`}
            >
              {sessionType === "focus" ? (
                <>
                  <Flame className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
                  <span>Deep Focus Block</span>
                </>
              ) : (
                <>
                  <Coffee className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Rest & Refresh</span>
                </>
              )}
            </span>
          </div>

          {/* Circular SVG Ring Countdown */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-72 h-72 sm:w-80 sm:h-80 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={strokeRadius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
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
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="mt-2 text-xs font-semibold text-slate-500 max-w-[190px] truncate">
                {targetTopic}
              </span>
              <span className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                Sprint #{completedSessions + 1}
              </span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 relative z-10">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                isRunning
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
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
                  <span>Start Focus Sprint</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Reset Timer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleSkip}
              title="Skip Session"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Post Session Checkpoint Modal */}
          {showCheckpoint && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 w-full max-w-md space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Sprint Complete! Quick Retention Check
                </span>
                <button 
                  onClick={() => setShowCheckpoint(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-emerald-900 dark:text-emerald-200">
                How well did you master <strong>{targetTopic}</strong> during this block?
              </p>
              <div className="flex gap-2">
                {[
                  { label: 'Confused', score: 1 },
                  { label: 'Partially Understood', score: 2 },
                  { label: 'Exam Ready', score: 3 }
                ].map((item) => (
                  <button
                    key={item.score}
                    onClick={() => {
                      setComprehensionScore(item.score);
                      setShowCheckpoint(false);
                    }}
                    className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quote */}
          <div className="mt-8 text-center max-w-md border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-xs italic text-slate-400">
              &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex]}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Audio Ambience & Session Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ambient Sound Suite */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-indigo-500" />
                <span>Ambient Noise Generator</span>
              </span>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                Web Audio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synthesized real-time focus sound to drown out ambient noise and study distractions.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setAmbientSound("none")}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === "none"
                    ? "border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400"
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => setAmbientSound("white")}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === "white"
                    ? "border border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400"
                }`}
              >
                Pink Noise
              </button>
              <button
                onClick={() => setAmbientSound("binaural")}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === "binaural"
                    ? "border border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400"
                }`}
              >
                10Hz Alpha
              </button>
            </div>
          </div>

          {/* Today's Focus Stats */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Today's Study Session Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{completedSessions}</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 font-bold">
                  Sprints Completed
                </span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-center">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalFocusedMinutes}m</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 font-bold">
                  Total Focus Time
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Study minutes are logged directly into your Exam Readiness score!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
