'use client';

import React from 'react';
import { 
  GraduationCap, Flame, Clock, LogOut, User as UserIcon, Sparkles, 
  Cpu, Sun, Moon, Target, Bot, BookOpen, FileCheck2, Award, Layers, BarChart3, Zap 
} from 'lucide-react';

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
  onOpenEmergencyModal,
  theme = 'dark',
  onToggleTheme,
}: NavbarProps) {
  // 9 Core Views matching Blueprint
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'exam_center', label: 'Exam Center', icon: Target },
    { id: 'nexa', label: 'Nexa AI', icon: Bot },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: FileCheck2 },
    { id: 'mock_exams', label: 'Mock Exams', icon: Award },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'focus', label: 'Focus', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5">
        {/* Logo & College Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Scholar<span className="text-emerald-500">Mate</span>
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block leading-none">
                AI Exam Coach • AANM & VVRSR
              </p>
            </div>
          </button>
        </div>

        {/* 9-View Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-0.5 rounded-full bg-slate-100 dark:bg-slate-900/90 p-1 border border-slate-200 dark:border-slate-800 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Emergency Button & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 24-Hour Emergency Mode Quick Button */}
          {onOpenEmergencyModal && (
            <button
              onClick={onOpenEmergencyModal}
              title="24-Hour Exam Survival Sprint"
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-600 to-orange-600 px-2.5 sm:px-3 py-1 text-xs font-black text-white shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">24H Survival</span>
            </button>
          )}

          {/* AI Settings Trigger */}
          <button
            onClick={onOpenAISettings}
            title="Configure AI Engine"
            className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden md:inline">AI Config</span>
          </button>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="h-3.5 w-3.5 text-indigo-500" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              )}
            </button>
          )}

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
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Header Horizontal Scroller for Medium & Small Screens */}
      <div className="xl:hidden flex items-center overflow-x-auto px-3 py-1.5 border-t border-slate-200 dark:border-slate-800/80 no-scrollbar gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
