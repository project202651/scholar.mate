'use client';

import React from 'react';
import { 
  GraduationCap, LogOut, User as UserIcon, 
  Cpu, Sun, Moon, Target, Bot, BookOpen, FileCheck2, Award, Layers, BarChart3, Clock, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  onOpenEmergencyModal?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenAISettings,
  theme = 'dark',
  onToggleTheme,
}: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'exam_center', label: 'Exam Center', icon: Target },
    { id: 'nexa', label: 'Nexa AI', icon: Bot },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: FileCheck2 },
    { id: 'mock_exams', label: 'Mock Exams', icon: Award },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'progress', label: 'Analytics', icon: BarChart3 },
    { id: 'focus', label: 'Focus', icon: Clock },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-slate-950/75 backdrop-blur-2xl transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-md shadow-emerald-500/20">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Scholar<span className="text-emerald-500">Mate</span>
                </span>
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  2.0
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 rounded-full bg-slate-100/80 dark:bg-white/[0.04] p-1 border border-slate-200/60 dark:border-white/5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-600/25"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* AI Config */}
            <button
              onClick={onOpenAISettings}
              title="Configure AI Engine"
              className="flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden md:inline">AI Config</span>
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title="Toggle Theme"
                className="p-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                {theme === 'light' ? (
                  <Moon className="h-3.5 w-3.5 text-indigo-500" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                )}
              </button>
            )}

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-xs font-bold text-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (iOS style) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-lg">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
