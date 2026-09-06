'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import SmartNotesView from './SmartNotesView';
import DocHubView from './DocHubView';
import StudyScheduleView from './StudyScheduleView';
import DailyTasksView from './DailyTasksView';

interface StudyLibraryViewProps {
  initialSubject?: string;
  initialTopic?: string;
  initialDocId?: string;
  onSelectDocument?: (docId: string, title?: string, subject?: string) => void;
  setActiveMainTab?: (tab: string) => void;
}

export default function StudyLibraryView({
  initialSubject,
  initialTopic,
  initialDocId,
  onSelectDocument,
  setActiveMainTab,
}: StudyLibraryViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'docs' | 'schedule' | 'tasks'>('notes');

  const subTabs = [
    { id: 'notes', label: 'AI Revision Notes', icon: BookOpen, desc: 'Executive summaries & 5/10M model notes' },
    { id: 'docs', label: 'Textbook & Doc Hub', icon: FileText, desc: 'Upload PDF notes & syllabus files' },
    { id: 'schedule', label: 'Exam Timetable', icon: Calendar, desc: 'AI-generated balanced revision schedule' },
    { id: 'tasks', label: 'Daily Study Tasks', icon: CheckSquare, desc: 'Track daily chapter milestones' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Study Library</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Knowledge Repository
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Access your AI study notes, uploaded PDF textbooks, exam revision timetable, and daily task checklist.
          </p>
        </div>

        {/* Sub-Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {subTabs.map((st) => {
            const Icon = st.icon;
            const isActive = activeSubTab === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveSubTab(st.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-View */}
      <div>
        {activeSubTab === 'notes' && <SmartNotesView initialDocId={initialDocId} />}
        {activeSubTab === 'docs' && (
          <DocHubView
            setActiveTab={setActiveMainTab}
            onSelectDocument={(docId, title, subject) => {
              if (onSelectDocument) onSelectDocument(docId, title, subject);
            }}
            onNavigateToNotes={() => setActiveSubTab('notes')}
          />
        )}
        {activeSubTab === 'schedule' && <StudyScheduleView />}
        {activeSubTab === 'tasks' && <DailyTasksView />}
      </div>
    </div>
  );
}
