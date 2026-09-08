'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import AISettingsModal from '@/components/AISettingsModal';
import EmergencyModeModal from '@/components/EmergencyModeModal';
import ThreeBackground from '@/components/ThreeBackground';
import NexaFloatingButton from '@/components/NexaFloatingButton';

// 9 Core Blueprint Views
import DashboardView from '@/components/DashboardView';
import ExamCenterView from '@/components/ExamCenterView';
import NexaCoachView from '@/components/NexaCoachView';
import StudyLibraryView from '@/components/StudyLibraryView';
import PracticeAnswerView from '@/components/PracticeAnswerView';
import MockExamSimulatorView from '@/components/MockExamSimulatorView';
import FlashcardsView from '@/components/FlashcardsView';
import ProgressAndWeaknessView from '@/components/ProgressAndWeaknessView';
import StudyTimerView from '@/components/StudyTimerView';

import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Shared active focus context for inter-view transitions
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>('');

  const handleDocumentSelect = (docId: string, title?: string, subject?: string) => {
    setSelectedDocId(docId);
    if (title) {
      setSelectedDocTitle(title);
      setSelectedTopic(title);
    }
    if (subject) setSelectedSubject(subject);
  };

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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }
    }
  }, [theme]);

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
    <div className={`relative min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-white ${
      theme === 'dark' ? 'dark bg-[#060a12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 3D WebGL Background */}
      <ThreeBackground theme={theme} />

      {/* Subtle Ambient Refractive Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[140px] animate-orb-1 bg-emerald-500/10 dark:bg-emerald-500/15" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] animate-orb-2 bg-cyan-500/10 dark:bg-cyan-500/15" />
      </div>

      {/* Navigation Header */}
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

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                setActiveTab={setActiveTab}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                onSelectTopic={handleTopicSelect}
                theme={theme}
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
                initialDocumentId={selectedDocId}
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
                initialDocId={selectedDocId}
                onSelectDocument={handleDocumentSelect}
                setActiveMainTab={setActiveTab}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeAnswerView
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                initialDocumentId={selectedDocId}
              />
            )}

            {activeTab === 'mock_exams' && (
              <MockExamSimulatorView
                initialDocumentId={selectedDocId}
                initialSubject={selectedSubject}
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

            {activeTab === 'flashcards' && (
              <FlashcardsView
                initialDocumentId={selectedDocId}
                initialSubject={selectedSubject}
                initialTopic={selectedTopic}
              />
            )}

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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Floating Nexa AI Assistant (accessible on all tabs) */}
      <NexaFloatingButton
        activeTopic={selectedTopic}
        activeSubject={selectedSubject}
        activeDocId={selectedDocId}
        activeDocTitle={selectedDocTitle}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      <EmergencyModeModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onStartEmergencySprint={(topic) => {
          setSelectedTopic(topic);
          setActiveTab('focus');
        }}
      />

      {/* Institutional Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">ScholarMate 2.0</span>
            <span>• AANM & VVRSR Polytechnic College</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Final Year Major Project • Computer Engineering
          </div>
        </div>
      </footer>
    </div>
  );
}
