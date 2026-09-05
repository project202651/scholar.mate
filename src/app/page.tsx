'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import AISettingsModal from '@/components/AISettingsModal';
import EmergencyModeModal from '@/components/EmergencyModeModal';
import StartingAnimation from '@/components/StartingAnimation';
import CustomCursor from '@/components/CustomCursor';
import ClickEffect from '@/components/ClickEffect';
import ThreeBackground from '@/components/ThreeBackground';

// 9 Blueprint Views
import DashboardView from '@/components/DashboardView';
import ExamCenterView from '@/components/ExamCenterView';
import NexaCoachView from '@/components/NexaCoachView';
import StudyLibraryView from '@/components/StudyLibraryView';
import PracticeAnswerView from '@/components/PracticeAnswerView';
import MockExamSimulatorView from '@/components/MockExamSimulatorView';
import FlashcardsView from '@/components/FlashcardsView';
import ProgressAndWeaknessView from '@/components/ProgressAndWeaknessView';
import StudyTimerView from '@/components/StudyTimerView';

import { GraduationCap, Play, Sparkles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [showStartingAnimation, setShowStartingAnimation] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Shared active focus context for inter-view transitions
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('scholarmate_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {}

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    };
    checkAuth();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('scholarmate_theme', next);
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setActiveTab('dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleTopicSelect = (topic: string, subject?: string) => {
    setSelectedTopic(topic);
    if (subject) setSelectedSubject(subject);
  };

  return (
    <div
      className={`relative min-h-screen ${
        theme === 'light'
          ? 'light-theme bg-gradient-to-br from-white via-sky-50/80 to-blue-50/60 text-slate-900'
          : 'dark bg-slate-950 text-slate-100'
      } selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200`}
    >
      {/* 3D WebGL ambient background & Cursor animations */}
      <ThreeBackground />
      <CustomCursor />
      <ClickEffect />

      {/* Ambient Glassmorphic Color Orbs for Rich Frosted Refraction */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] animate-orb-1 ${
            theme === 'light'
              ? 'bg-gradient-to-tr from-emerald-400/20 via-teal-400/20 to-transparent'
              : 'bg-gradient-to-tr from-emerald-500/25 via-teal-600/20 to-transparent'
          }`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full blur-[140px] animate-orb-2 ${
            theme === 'light'
              ? 'bg-gradient-to-bl from-purple-400/20 via-indigo-400/20 to-transparent'
              : 'bg-gradient-to-bl from-indigo-500/25 via-purple-600/20 to-transparent'
          }`}
        />
        <div
          className={`absolute top-2/3 -left-20 w-[550px] h-[550px] rounded-full blur-[130px] animate-orb-3 ${
            theme === 'light'
              ? 'bg-gradient-to-tr from-cyan-400/20 via-sky-400/20 to-transparent'
              : 'bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-transparent'
          }`}
        />
      </div>

      {/* Starting Animation Splash Screen */}
      <AnimatePresence>
        {showStartingAnimation && (
          <StartingAnimation onComplete={() => setShowStartingAnimation(false)} />
        )}
      </AnimatePresence>

      {/* Navigation Bar (9 Views) */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main App Container */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onSelectTopic={handleTopicSelect}
          />
        )}

        {activeTab === 'exam_center' && (
          <ExamCenterView
            onSelectTopicAction={(topic, action) => {
              setSelectedTopic(topic);
              if (action === 'study') setActiveTab('nexa');
              else if (action === 'practice') setActiveTab('practice');
              else if (action === 'test') setActiveTab('mock_exams');
              else if (action === 'review') setActiveTab('flashcards');
            }}
          />
        )}

        {activeTab === 'nexa' && (
          <NexaCoachView
            initialTopic={selectedTopic}
            initialSubject={selectedSubject}
            onNavigateToPractice={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('practice');
            }}
            onNavigateToMock={() => setActiveTab('mock_exams')}
          />
        )}

        {activeTab === 'library' && (
          <StudyLibraryView
            initialSubject={selectedSubject}
            initialTopic={selectedTopic}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeAnswerView
            initialTopic={selectedTopic}
            initialSubject={selectedSubject}
          />
        )}

        {activeTab === 'mock_exams' && (
          <MockExamSimulatorView
            onNavigateToNexa={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('nexa');
            }}
            onNavigateToPractice={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('practice');
            }}
          />
        )}

        {activeTab === 'flashcards' && <FlashcardsView />}

        {activeTab === 'progress' && (
          <ProgressAndWeaknessView
            onNavigateToNexa={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('nexa');
            }}
            onNavigateToPractice={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('practice');
            }}
            onNavigateToFocus={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('focus');
            }}
          />
        )}

        {activeTab === 'focus' && (
          <StudyTimerView
            initialTopic={selectedTopic}
            onNavigateToPractice={(topic) => {
              setSelectedTopic(topic);
              setActiveTab('practice');
            }}
          />
        )}
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

      {/* 24-Hour Emergency Mode Modal */}
      <EmergencyModeModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onStartEmergencySprint={(topic) => {
          setSelectedTopic(topic);
          setActiveTab('focus');
        }}
      />

      {/* Institutional Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-300">ScholarMate 2.0</span>
              <span>• Final Year Major Project (2026-2027)</span>
            </div>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              AI & ML: Vastav (026), Vishnu (020), Nikhileswar (051), Sathvik (022)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              AANM & VVRSR Polytechnic College
            </p>
            <button
              onClick={() => setShowStartingAnimation(true)}
              className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Play className="h-3 w-3" />
              <span>Replay Intro</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
