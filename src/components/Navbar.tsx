"use client";

import React from "react";
import { GraduationCap, Flame, Clock, LogOut, User as UserIcon, Sparkles, Cpu, Sun, Moon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  department?: string;
  year?: string;
  streakCount?: number;
  studyMinutes?: number;
}

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAISettings: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenAISettings,
  theme = "dark",
  onToggleTheme,
}: NavbarProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "chat", label: "Nexa AI Bot" },
    { id: "timer", label: "Study Timer" },
    { id: "notes", label: "Smart Notes" },
    { id: "flashcards", label: "3D Flashcards" },
    { id: "quiz", label: "AI Quiz Arena" },
    { id: "schedule", label: "Study Plan" },
    { id: "tasks", label: "Daily Tasks" },
    { id: "docs", label: "Doc Hub" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & College Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                <GraduationCap className="h-5 w-5 text-cyan-400 transition-transform group-hover:rotate-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  Scholar<span className="text-cyan-400">Mate</span>
                </span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                  AI & ML 2026-27
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                AANM & VVRSR Polytechnic • Dept. of AI & ML
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs (Desktop) */}
        {user && (
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-slate-900/60 p-1 border border-white/10 backdrop-blur-xl shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.6)] font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right Section: Stats & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Engine Status & Key Button */}
          <button
            onClick={onOpenAISettings}
            title="Configure Google Gemini AI & Connection"
            className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all shadow-[0_0_10px_rgba(56,189,248,0.15)]"
          >
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">AI Engine</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-white active:scale-95 transition-all"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 text-xs font-semibold text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.streakCount || 1}d Streak</span>
              </div>

              {/* Study Time Badge */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>{((user.studyMinutes || 60) / 60).toFixed(1)} hrs</span>
              </div>

              {/* Student Profile dropdown / badge */}
              <div className="flex items-center gap-2 pl-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-xs font-bold text-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[110px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {user.department || "Polytechnic"}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Student Login / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      {user && (
        <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/60 no-scrollbar gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
