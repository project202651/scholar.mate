'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import AISettingsModal from '@/components/AISettingsModal';
import EmergencyModeModal from '@/components/EmergencyModeModal';
import OnboardingModal from '@/components/OnboardingModal';
import MistakeNotebookModal from '@/components/MistakeNotebookModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import ThreeBackground from '@/components/ThreeBackground';
import NexaFloatingButton from '@/components/NexaFloatingButton';

// 9 Core Blueprint Views + Superpowers
import DashboardView from '@/components/DashboardView';
import ExamCenterView from '@/components/ExamCenterView';
import NexaCoachView from '@/components/NexaCoachView';
import DocHubView from '@/components/DocHubView';
import StudyLibraryView from '@/components/StudyLibraryView';
import PracticeAnswerView from '@/components/PracticeAnswerView';
import MockExamSimulatorView from '@/components/MockExamSimulatorView';
import FlashcardsView from '@/components/FlashcardsView';
import ProgressAndWeaknessView from '@/components/ProgressAndWeaknessView';
import StudyTimerView from '@/components/StudyTimerView';
import PaperPredictorView from '@/components/PaperPredictorView';
import NexaVoiceVivaModal from '@/components/NexaVoiceVivaModal';
import PocketRevisionModal from '@/components/PocketRevisionModal';

import { motion, AnimatePresence } from 'framer-motion';

function StudentWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMistakeNotebookOpen, setIsMistakeNotebookOpen] = useState(false);
  const [isVoiceVivaOpen, setIsVoiceVivaOpen] = useState(false);
  const [isPocketSheetOpen, setIsPocketSheetOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [is3DDisabled, setIs3DDisabled] = useState(false);
  const [isDemoBannerDismissed, setIsDemoBannerDismissed] = useState(false);

  // Shared active focus context for inter-view transitions (user-driven, no forced defaults)
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
      const stored3D = localStorage.getItem('scholarmate_disable_3d') === 'true';
      if (stored3D) setIs3DDisabled(true);
    } catch (e) {}

    const requestedTab = searchParams.get('tab');
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
    const requestedTopic = searchParams.get('topic');
    if (requestedTopic) {
      setSelectedTopic(requestedTopic);
    }
    const requestedSubject = searchParams.get('subject');
    if (requestedSubject) {
      setSelectedSubject(requestedSubject);
    }

    const shouldOnboard = searchParams.get('onboarding') === 'true';
    if (shouldOnboard) {
      setIsOnboardingOpen(true);
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Sync database study plan if available
            try {
              const planRes = await fetch('/api/user/plan');
              if (planRes.ok) {
                const planData = await planRes.json();
                if (planData && planData.plan) {
                  localStorage.setItem('scholarmate_student_plan', JSON.stringify(planData.plan));
                }
              }
            } catch {}

            const hasPlan = localStorage.getItem('scholarmate_student_plan');
            if (!hasPlan && !shouldOnboard) setIsOnboardingOpen(true);
          }
        } else {
          const hasPlan = localStorage.getItem('scholarmate_student_plan');
          if (!hasPlan) setIsOnboardingOpen(true);
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    };
    checkAuth();
  }, [searchParams]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
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

  const toggle3D = () => {
    const next = !is3DDisabled;
    setIs3DDisabled(next);
    try {
      localStorage.setItem('scholarmate_disable_3d', String(next));
      window.dispatchEvent(new CustomEvent('scholarmate:toggle-3d', { detail: { disabled: next } }));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handleTopicSelect = (topic: string, subject?: string) => {
    setSelectedTopic(topic);
    if (subject) setSelectedSubject(subject);
  };

  const handleReTestMistake = (topic: string, subject: string) => {
    setSelectedTopic(topic);
    setSelectedSubject(subject);
    setActiveTab('practice');
  };

  return (
    <div className={`relative min-h-screen font-sans antialiased selection:bg-[#54d6c7] selection:text-slate-950 ${
      theme === 'dark' ? 'bg-[#0b1220] text-[#f5f7fb]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* 3D WebGL Particle Field */}
      <ThreeBackground theme={theme} />

      {/* Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenMistakeNotebook={() => setIsMistakeNotebookOpen(true)}
        onOpenVoiceViva={() => setIsVoiceVivaOpen(true)}
        onOpenPocketSheet={() => setIsPocketSheetOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        is3DDisabled={is3DDisabled}
        onToggle3D={toggle3D}
      />

      {/* Guest Demo Mode Notification Banner */}
      {!user && !isDemoBannerDismissed && (
        <div className="relative z-30 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/15 via-[#111c2e] to-[#54d6c7]/10 px-4 py-2.5 text-xs text-slate-200 shadow-md">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="font-bold text-amber-300">Guest Demo Environment:</span>
              <span className="text-slate-300">
                You are exploring ScholarMate with preloaded university sample tracks. Changes are stored locally in your browser.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-lg bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-black px-3.5 py-1 text-[11px] shadow-sm transition-all cursor-pointer"
              >
                Sign Up to Sync Across Devices
              </button>
              <button
                onClick={() => setIsDemoBannerDismissed(true)}
                aria-label="Dismiss banner"
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 relative z-10 pb-28 lg:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                setActiveTab={setActiveTab}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onOpenMistakeNotebook={() => setIsMistakeNotebookOpen(true)}
                onOpenVoiceViva={() => setIsVoiceVivaOpen(true)}
                onOpenPocketSheet={() => setIsPocketSheetOpen(true)}
                onSelectTopic={handleTopicSelect}
                theme={theme}
              />
            )}

            {activeTab === 'exam_center' && (
              <ExamCenterView
                onSelectTopicAction={(topic: string, action: 'study' | 'practice' | 'test' | 'review') => {
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
                onNavigateToPractice={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('practice');
                }}
                onNavigateToMock={() => setActiveTab('mock_exams')}
              />
            )}

            {activeTab === 'dochub' && (
              <DocHubView
                setActiveTab={setActiveTab}
                onSelectDocument={handleDocumentSelect}
                onNavigateToNotes={(docId: string) => {
                  setSelectedDocId(docId);
                  setActiveTab('library');
                }}
                onNavigateToFlashcards={(docId: string) => {
                  setSelectedDocId(docId);
                  setActiveTab('flashcards');
                }}
                onNavigateToMock={(docId: string) => {
                  setSelectedDocId(docId);
                  setActiveTab('mock_exams');
                }}
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
                onNavigateToNexa={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('nexa');
                }}
                onNavigateToPractice={(topic: string) => {
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
                onNavigateToNexa={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('nexa');
                }}
                onNavigateToPractice={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('practice');
                }}
                onNavigateToFocus={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('timer');
                }}
              />
            )}

            {(activeTab === 'timer' || activeTab === 'focus') && (
              <StudyTimerView
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                onNavigateToPractice={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('practice');
                }}
              />
            )}

            {activeTab === 'predictor' && (
              <PaperPredictorView
                initialSubject={selectedSubject}
                onNavigateToPractice={(topic: string, question: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('practice');
                }}
                onNavigateToNexa={(topic: string) => {
                  setSelectedTopic(topic);
                  setActiveTab('nexa');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Nexa AI Assistant (Desktop) */}
      <div className="hidden lg:block">
        <NexaFloatingButton
          activeTopic={selectedTopic}
          activeSubject={selectedSubject}
          activeDocId={selectedDocId}
          activeDocTitle={selectedDocTitle}
          onNavigateToTab={setActiveTab}
        />
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
          setIsOnboardingOpen(true);
        }}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      <EmergencyModeModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onStartEmergencySprint={(topic: string) => {
          setSelectedTopic(topic);
          setIsEmergencyModalOpen(false);
          setActiveTab('nexa');
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          setActiveTab('dashboard');
        }}
      />

      <MistakeNotebookModal
        isOpen={isMistakeNotebookOpen}
        onClose={() => setIsMistakeNotebookOpen(false)}
        onReTestQuestion={handleReTestMistake}
      />

      <NexaVoiceVivaModal
        isOpen={isVoiceVivaOpen}
        onClose={() => setIsVoiceVivaOpen(false)}
        initialSubject={selectedSubject}
        initialTopic={selectedTopic}
        onPracticeQuestion={(topic, questionText) => {
          setSelectedTopic(topic);
          setIsVoiceVivaOpen(false);
          setActiveTab('practice');
        }}
      />

      <PocketRevisionModal
        isOpen={isPocketSheetOpen}
        onClose={() => setIsPocketSheetOpen(false)}
        initialSubject={selectedSubject}
      />
    </div>
  );
}

export default function StudentWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center text-white text-xs">
        Loading ScholarMate Student Workspace...
      </div>
    }>
      <StudentWorkspaceContent />
    </Suspense>
  );
}
