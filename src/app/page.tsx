'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import AISettingsModal from '@/components/AISettingsModal';
import EmergencyModeModal from '@/components/EmergencyModeModal';
import OnboardingModal from '@/components/OnboardingModal';
import ThreeBackground from '@/components/ThreeBackground';
import NexaFloatingButton from '@/components/NexaFloatingButton';
import StartingAnimation from '@/components/StartingAnimation';

// 9 Core Blueprint Views
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

import { GraduationCap, Play, ShieldCheck, FileText, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState<'privacy' | 'terms' | 'data' | 'support'>('privacy');
  const [showStartingAnimation, setShowStartingAnimation] = useState(false);
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
      const hasSeen = localStorage.getItem('has_seen_intro');
      if (!hasSeen) {
        setShowStartingAnimation(true);
      }
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
          if (data.user) {
            setUser(data.user);
            const hasPlan = localStorage.getItem('scholarmate_student_plan');
            if (!hasPlan) setIsOnboardingOpen(true);
          }
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
    <div className={`relative min-h-screen font-sans antialiased selection:bg-[#54d6c7] selection:text-slate-950 ${
      theme === 'dark' ? 'bg-[#0b1220] text-[#f5f7fb]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* 3D WebGL Particle Field */}
      <ThreeBackground theme={theme} />

      {/* Starting Splash Animation */}
      <AnimatePresence>
        {showStartingAnimation && (
          <StartingAnimation onComplete={() => setShowStartingAnimation(false)} />
        )}
      </AnimatePresence>

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
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 relative z-10">
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

            {activeTab === 'dochub' && (
              <DocHubView
                setActiveTab={setActiveTab}
                onSelectDocument={handleDocumentSelect}
                onNavigateToNotes={() => setActiveTab('library')}
                onNavigateToFlashcards={(docId) => {
                  setSelectedDocId(docId);
                  setActiveTab('flashcards');
                }}
                onNavigateToMock={(docId) => {
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

      {/* Persistent Floating Nexa AI Assistant (hidden when on full Nexa Coach view) */}
      {activeTab !== 'nexa' && (
        <NexaFloatingButton
          activeTopic={selectedTopic}
          activeSubject={selectedSubject}
          activeDocId={selectedDocId}
          activeDocTitle={selectedDocTitle}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setIsOnboardingOpen(true);
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(plan) => {
          setIsOnboardingOpen(false);
        }}
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

      {/* Institutional Privacy & Compliance Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            role="dialog"
            aria-modal="true"
            aria-label="Institutional Trust and Policy Center"
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] text-slate-100 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsInfoModalOpen(false)}
              aria-label="Close institutional policy modal"
              title="Close institutional policy modal"
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
                { id: 'terms', label: 'Terms of Use', icon: FileText },
                { id: 'data', label: 'Data Handling', icon: Lock },
                { id: 'support', label: 'College Attribution', icon: GraduationCap },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = infoModalTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInfoModalTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#54d6c7] text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {infoModalTab === 'privacy' && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white">Student Data Privacy Policy</h3>
                  <p>ScholarMate is built on strict academic privacy principles. We process uploaded PDFs, notes, and study prompts solely to generate personalized study plans, 10-mark model answers, and flashcard queues.</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>No Data Reselling:</strong> We never sell, monetize, or transfer your academic materials to third parties.</li>
                    <li><strong>Ephemeral Inference:</strong> Text submitted for AI analysis is sent securely to Google Gemini APIs and is not retained to train public models.</li>
                    <li><strong>Account Isolation:</strong> Uploaded materials are linked strictly to your authenticated student account and never leaked to peers.</li>
                  </ul>
                </div>
              )}

              {infoModalTab === 'terms' && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white">Academic Terms of Use</h3>
                  <p>ScholarMate is an academic study companion created to help engineering and diploma students master their syllabus curricula and revise efficiently.</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Revision Aid:</strong> Model answers, marking rubrics, and diagnostic readiness indexes are assistive educational tools.</li>
                    <li><strong>Institutional Integrity:</strong> Students are encouraged to use ScholarMate for conceptual mastery and ethical examination preparation.</li>
                  </ul>
                </div>
              )}

              {infoModalTab === 'data' && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white">Document Retention & Security</h3>
                  <p>How ScholarMate manages documents and AI credentials:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Private Session Storage:</strong> Document indexes and user metrics are stored securely in your private SQLite database.</li>
                    <li><strong>Client-Side AI Keys:</strong> Custom Gemini API keys entered in AI Config are saved in your local browser storage (`localStorage`).</li>
                    <li><strong>Instant Deletion:</strong> You can delete any uploaded PDF or note at any time from the Textbook & Doc Hub.</li>
                  </ul>
                </div>
              )}

              {infoModalTab === 'support' && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white">AANM & VVRSR Polytechnic College</h3>
                  <p><strong>Department of Computer Engineering (2026–2027)</strong></p>
                  <p>ScholarMate is the Final Year Major Capstone Project created by:</p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {["Vastav", "Vishnu", "Nikhileswar", "Sathvik"].map((dev) => (
                      <div key={dev} className="p-2.5 rounded-xl border border-white/10 bg-white/5 font-semibold text-white text-xs">
                        🚀 {dev} · Core Architect
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Expanded Footer with Compliance & Support Links */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#0b1220] py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-black text-white text-sm">ScholarMate</span>
              <span className="text-slate-400">• AANM & VVRSR Polytechnic College</span>
            </div>

            {/* Compliance & Policy Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-300">
              <button
                onClick={() => {
                  setInfoModalTab('privacy');
                  setIsInfoModalOpen(true);
                }}
                className="hover:text-[#54d6c7] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  setInfoModalTab('terms');
                  setIsInfoModalOpen(true);
                }}
                className="hover:text-[#54d6c7] transition-colors cursor-pointer"
              >
                Terms of Use
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  setInfoModalTab('data');
                  setIsInfoModalOpen(true);
                }}
                className="hover:text-[#54d6c7] transition-colors cursor-pointer"
              >
                Data Handling
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  setInfoModalTab('support');
                  setIsInfoModalOpen(true);
                }}
                className="hover:text-[#54d6c7] transition-colors cursor-pointer"
              >
                Project Architects
              </button>
              <span>·</span>
              <button
                onClick={() => setShowStartingAnimation(true)}
                className="flex items-center gap-1 text-[#54d6c7] hover:underline cursor-pointer"
              >
                <Play className="h-3 w-3" />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
            Final Year Major Project · Developed by Vastav, Vishnu, Nikhileswar, Sathvik · Computer Engineering
          </div>
        </div>
      </footer>
    </div>
  );
}
