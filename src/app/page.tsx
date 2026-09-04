"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import AISettingsModal from "@/components/AISettingsModal";
import StartingAnimation from "@/components/StartingAnimation";
import CustomCursor from "@/components/CustomCursor";
import ClickEffect from "@/components/ClickEffect";
import ThreeBackground from "@/components/ThreeBackground";
import DashboardView from "@/components/DashboardView";
import ChatTutorView from "@/components/ChatTutorView";
import SmartNotesView from "@/components/SmartNotesView";
import FlashcardsView from "@/components/FlashcardsView";
import QuizArenaView from "@/components/QuizArenaView";
import StudyScheduleView from "@/components/StudyScheduleView";
import StudyTimerView from "@/components/StudyTimerView";
import DailyTasksView from "@/components/DailyTasksView";
import DocHubView from "@/components/DocHubView";
import { GraduationCap, Play, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [showStartingAnimation, setShowStartingAnimation] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check saved theme
    try {
      const savedTheme = localStorage.getItem("scholarmate_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {}

    // Check session on load
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    };
    checkAuth();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("scholarmate_theme", next);
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setActiveTab("dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`relative min-h-screen ${
        theme === "light" ? "light-theme" : "dark"
      } bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans transition-colors duration-200`}
    >
      {/* 3D WebGL ambient background & Cursor animations */}
      <ThreeBackground />
      <CustomCursor />
      <ClickEffect />

      {/* Ambient Glassmorphic Color Orbs for Frosted Refraction */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-transparent blur-[120px] animate-orb-1" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-600/20 via-indigo-600/15 to-transparent blur-[130px] animate-orb-2" />
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-transparent blur-[140px] animate-orb-3" />
      </div>

      {/* Starting Animation Splash Screen */}
      <AnimatePresence>
        {showStartingAnimation && (
          <StartingAnimation onComplete={() => setShowStartingAnimation(false)} />
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 relative z-10">
        {activeTab === "dashboard" && (
          <DashboardView
            user={user}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === "chat" && (
          <ChatTutorView onOpenAISettings={() => setIsAISettingsOpen(true)} />
        )}

        {activeTab === "timer" && <StudyTimerView />}

        {activeTab === "notes" && (
          <SmartNotesView onOpenAISettings={() => setIsAISettingsOpen(true)} />
        )}

        {activeTab === "flashcards" && <FlashcardsView />}

        {activeTab === "quiz" && <QuizArenaView />}

        {activeTab === "schedule" && <StudyScheduleView />}

        {activeTab === "tasks" && <DailyTasksView />}

        {activeTab === "docs" && <DocHubView setActiveTab={setActiveTab} />}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold text-slate-300">ScholarMate</span>
              <span>• Final Year Project (2026-2027)</span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-cyan-400 font-medium text-[11px]">
              AI & ML: Vastav (026), Vishnu (020), Nikhileswar (051), Sathvik (022)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-slate-400">
              AANM & VVRSR Polytechnic College
            </p>
            <button
              onClick={() => setShowStartingAnimation(true)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Replay Intro Animation</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
