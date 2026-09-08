'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, LogOut, User as UserIcon, 
  Cpu, Target, Bot, BookOpen, FileCheck2, Award, Layers, BarChart3, Clock,
  Sparkles, ChevronDown, Menu, X, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onOpenOnboarding?: () => void;
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
  onOpenOnboarding,
  theme = 'dark',
  onToggleTheme,
}: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // 5 Core Focused Navigation Groups
  const navGroups = [
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      items: [
        { id: 'nexa', label: 'Nexa AI Tutor', desc: 'Ask doubts & concept breakdowns', icon: Bot },
        { id: 'exam_center', label: 'Syllabus Blueprint', desc: '5-unit mark weightage maps', icon: Target },
      ]
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: FileCheck2,
      items: [
        { id: 'practice', label: 'Practice Questions', desc: '15-question bank with AI scoring', icon: FileCheck2 },
        { id: 'mock_exams', label: 'Mock Simulator', desc: 'Full-length timed examinations', icon: Award },
        { id: 'flashcards', label: 'Active Recall', desc: 'Spaced repetition memory deck', icon: Layers },
      ]
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      items: [
        { id: 'progress', label: 'Exam Readiness', desc: 'Study streak & score breakdown', icon: BarChart3 },
        { id: 'focus', label: 'Focus Timer', desc: 'Custom Pomodoro study intervals', icon: Clock },
      ]
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
    setIsMobileDrawerOpen(false);
  };

  const isCurrentGroupActive = (items: { id: string }[]) => {
    return items.some(item => item.id === activeTab);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-2xl transition-colors duration-200 ${
        isDark 
          ? 'border-white/[0.08] bg-[#0b1220]/95 text-white' 
          : 'border-slate-200/80 bg-white/95 text-slate-900 shadow-sm'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] via-[#2dd4bf] to-[#8b5cf6] shadow-md shadow-[#54d6c7]/20">
                <GraduationCap className="h-5 w-5 text-slate-950 font-black" />
              </div>
              <div>
                <span className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Scholar<span className="text-[#0d9488] dark:text-[#54d6c7]">Mate</span>
                </span>
                <p className={`text-[10px] leading-none hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  AI Exam Preparation System
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Focused Navigation (Today, Learn, Practice, Progress, Library) */}
          <nav className={`hidden lg:flex items-center gap-1 rounded-full p-1 border transition-colors ${
            isDark 
              ? 'bg-[#111c2e]/90 border-white/10' 
              : 'bg-slate-100/90 border-slate-200'
          }`}>
            {/* Today (Home) */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0d9488] text-white dark:bg-[#54d6c7] dark:text-slate-950 shadow-sm'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Today
            </button>

            {/* Dropdown Groups: Learn, Practice, Progress */}
            {navGroups.map((grp) => {
              const isActive = isCurrentGroupActive(grp.items);
              const isOpen = openDropdown === grp.id;
              const GrpIcon = grp.icon;

              return (
                <div 
                  key={grp.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(grp.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : grp.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#17253a] text-[#54d6c7] border border-[#54d6c7]/30'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <GrpIcon className="w-3.5 h-3.5" />
                    <span>{grp.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full left-0 mt-1.5 w-60 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1 ${
                          isDark 
                            ? 'border-white/10 bg-[#111c2e]' 
                            : 'border-slate-200 bg-white shadow-slate-300/40'
                        }`}
                      >
                        {grp.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isItemActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                isItemActive
                                  ? isDark
                                    ? 'bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/20'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isDark
                                  ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                isDark ? 'bg-white/5 text-[#54d6c7]' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                <ItemIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold">{item.label}</div>
                                <div className={`text-[10px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {item.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Library direct link */}
            <button
              onClick={() => handleNavClick('library')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-[#0d9488] text-white dark:bg-[#54d6c7] dark:text-slate-950 shadow-sm'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Build / Edit Study Plan Trigger */}
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                title="Build or Edit Your Personalized Study Plan"
                className={`hidden sm:flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'border-[#54d6c7]/30 bg-[#54d6c7]/10 text-[#54d6c7] hover:bg-[#54d6c7]/20'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Build Study Plan</span>
              </button>
            )}

            {/* AI Config */}
            <button
              onClick={onOpenAISettings}
              title="Configure AI Engine Keys"
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-[#111c2e] text-slate-300 hover:bg-white/10'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Cpu className={`h-3.5 w-3.5 ${isDark ? 'text-[#54d6c7]' : 'text-emerald-600'}`} />
              <span className="hidden md:inline">AI Config</span>
            </button>

            {/* Modern Pill Theme Toggle Switch */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className={`relative flex items-center justify-between w-14 h-8 px-1.5 rounded-full border transition-all cursor-pointer shadow-inner focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none ${
                  isDark
                    ? 'border-white/10 bg-[#111c2e] hover:border-[#54d6c7]/40'
                    : 'border-slate-300 bg-slate-100 hover:border-emerald-500'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 transition-colors z-10 ${isDark ? 'text-slate-500' : 'text-amber-500'}`} />
                <Moon className={`w-3.5 h-3.5 transition-colors z-10 ${isDark ? 'text-[#54d6c7]' : 'text-slate-400'}`} />
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 600, damping: 35 }}
                  className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${
                    isDark 
                      ? 'right-1 bg-gradient-to-tr from-[#54d6c7] to-[#2dd4bf]' 
                      : 'left-1 bg-white border border-slate-200'
                  }`}
                />
              </button>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-xs font-black text-slate-950 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-[#f47c7c] transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 rounded-full bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 px-4 py-1.5 text-xs font-black shadow-md shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-white/10 bg-[#111c2e] text-slate-300 hover:text-white' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isMobileDrawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden fixed top-14 left-0 right-0 z-40 border-b p-4 space-y-4 shadow-2xl backdrop-blur-2xl ${
              isDark 
                ? 'border-white/10 bg-[#0b1220]/98 text-white' 
                : 'border-slate-200 bg-white/98 text-slate-900'
            }`}
          >
            {/* Mobile Theme Toggle Row */}
            {onToggleTheme && (
              <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {isDark ? <Moon className="w-4 h-4 text-[#54d6c7]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>{isDark ? 'Dark Theme Active' : 'Light Theme Active'}</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-[#54d6c7] text-slate-950 shadow-sm"
                >
                  Switch to {isDark ? 'Light' : 'Dark'}
                </button>
              </div>
            )}

            <div className="space-y-3">
              {navGroups.map((grp) => (
                <div key={grp.id} className="space-y-1.5">
                  <div className={`text-[11px] font-bold uppercase tracking-wider px-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {grp.label}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {grp.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isActive
                              ? isDark
                                ? 'bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/30'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isDark
                              ? 'text-slate-300 hover:bg-white/5'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isDark ? 'text-[#54d6c7]' : 'text-emerald-600'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar (Today, Learn, Practice, Progress, Library) */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-2xl transition-colors ${
        isDark 
          ? 'border-white/10 bg-[#0b1220]/95 text-white' 
          : 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-300/30'
      }`}>
        {[
          { id: 'dashboard', label: 'Today', icon: GraduationCap },
          { id: 'nexa', label: 'Learn', icon: Bot },
          { id: 'practice', label: 'Practice', icon: FileCheck2 },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
          { id: 'library', label: 'Library', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? isDark
                    ? 'text-[#54d6c7] font-bold'
                    : 'text-[#0d9488] font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
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
