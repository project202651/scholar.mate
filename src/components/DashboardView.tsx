'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Flame,
  ArrowRight,
  Clock,
  Zap,
  Search,
  Target,
  FileCheck2,
  Bot,
  Check,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  UploadCloud,
  GraduationCap,
  Play,
  RotateCcw,
  Plus,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { motion } from 'framer-motion';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review';

interface StudyTaskItem {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  marksCategory: string;
  actionType: 'nexa' | 'practice' | 'flashcards' | 'mock_exams' | 'timer';
  status: TaskStatus;
  topicParam: string;
}

interface DashboardViewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenEmergencyModal?: () => void;
  onOpenOnboarding?: () => void;
  onSelectTopic?: (topic: string, subject?: string) => void;
  theme?: 'dark' | 'light';
}

export default function DashboardView({
  user,
  setActiveTab,
  onOpenAuth,
  onOpenEmergencyModal,
  onOpenOnboarding,
  onSelectTopic,
}: DashboardViewProps) {
  const [quickPrompt, setQuickPrompt] = useState('');

  // Real or default student exam plan
  const [studentPlan, setStudentPlan] = useState({
    branch: 'Artificial Intelligence & ML',
    examName: 'Semester End University Examination',
    subjects: [
      'Operating Systems & System Software',
      'Data Structures & Algorithms',
      'Artificial Intelligence & Machine Learning'
    ],
    subject: 'Operating Systems & System Software',
    examDate: '2026-10-15',
    daysRemaining: 18,
    targetGrade: 'Distinction (85-95%)',
    targetScore: 90,
    dailyHours: 2.5,
    recommendedHoursPerDay: '2h 30m',
    confidenceMap: {
      'Operating Systems & System Software': 'medium',
      'Data Structures & Algorithms': 'low',
      'Artificial Intelligence & Machine Learning': 'high'
    } as Record<string, 'low' | 'medium' | 'high'>,
    lastStudiedTopic: 'Memory Management & Paging Algorithms'
  });

  // Actionable Daily Tasks with Progress States
  const [tasks, setTasks] = useState<StudyTaskItem[]>([
    {
      id: 'task-1',
      title: 'Master Banker\'s Algorithm & Deadlock Avoidance',
      subject: 'Operating Systems',
      durationMinutes: 15,
      marksCategory: '10-Mark Core Derivation',
      actionType: 'nexa',
      status: 'in_progress',
      topicParam: 'Banker\'s Algorithm for Deadlock Avoidance'
    },
    {
      id: 'task-2',
      title: 'Review 12 Spaced Flashcards on Paging & TLB',
      subject: 'Operating Systems',
      durationMinutes: 10,
      marksCategory: 'Active Recall',
      actionType: 'flashcards',
      status: 'not_started',
      topicParam: 'Paging, Segmentation & TLB Effective Access Time'
    },
    {
      id: 'task-3',
      title: 'Practice 7-Mark Question: Gantt Chart CPU Scheduling',
      subject: 'Operating Systems',
      durationMinutes: 10,
      marksCategory: '7-Mark Drill',
      actionType: 'practice',
      status: 'not_started',
      topicParam: 'CPU Scheduling (Round Robin & Priority)'
    },
    {
      id: 'task-4',
      title: 'Fix Weakest Topic: AVL Tree Rotations (LL, RR, LR, RL)',
      subject: 'Data Structures & Algorithms',
      durationMinutes: 15,
      marksCategory: 'Weakness Repair',
      actionType: 'nexa',
      status: 'needs_review',
      topicParam: 'AVL Tree Rotations (LL, RR, LR, RL) & B-Trees'
    }
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('scholarmate_student_plan');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudentPlan(prev => ({
          ...prev,
          branch: parsed.branch || prev.branch,
          examName: parsed.examName || prev.examName,
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : prev.subjects,
          subject: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects[0] : prev.subject,
          examDate: parsed.examDate || prev.examDate,
          daysRemaining: parsed.daysRemaining || prev.daysRemaining,
          targetGrade: parsed.targetGrade || prev.targetGrade,
          targetScore: parsed.targetScore || prev.targetScore,
          dailyHours: parsed.dailyHours || prev.dailyHours,
          recommendedHoursPerDay: parsed.recommendedHoursPerDay || prev.recommendedHoursPerDay,
          confidenceMap: parsed.confidenceMap || prev.confidenceMap,
          lastStudiedTopic: parsed.lastStudiedTopic || prev.lastStudiedTopic
        }));
      }
    } catch (e) {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      if (onSelectTopic) onSelectTopic(quickPrompt, studentPlan.subject);
      setActiveTab('nexa');
    }
  };

  const handleTriggerAction = (task: StudyTaskItem) => {
    if (onSelectTopic) onSelectTopic(task.topicParam, task.subject);
    setActiveTab(task.actionType);
  };

  const cycleTaskStatus = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const order: TaskStatus[] = ['not_started', 'in_progress', 'completed', 'needs_review'];
      const currentIdx = order.indexOf(t.status);
      const nextStatus = order[(currentIdx + 1) % order.length];
      return { ...t, status: nextStatus };
    }));
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <RefreshCw className="h-3 w-3 text-amber-400 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span>Needs Review</span>
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-700/50 text-slate-300 border border-white/10">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Student Command Header & Quick Status Bar */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-1/4 -mt-20 w-80 h-80 rounded-full bg-[#54d6c7]/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Workspace · {user?.name || 'Active Scholar'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {studentPlan.examName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Target: <span className="text-[#54d6c7] font-bold">{studentPlan.targetGrade}</span> • Daily Schedule: <span className="text-white font-bold">{studentPlan.recommendedHoursPerDay}</span>
            </p>
          </div>

          {/* Quick Metrics & Plan Calibration Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 px-4 py-3 text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Countdown</span>
              <span className="text-xl font-black text-[#54d6c7]">{studentPlan.daysRemaining} Days</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/80 px-4 py-3 text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Score</span>
              <span className="text-xl font-black text-[#70d6a8]">{studentPlan.targetScore}%</span>
            </div>

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-2 rounded-2xl border border-[#54d6c7]/30 bg-[#54d6c7]/10 hover:bg-[#54d6c7]/20 px-4 py-3 text-xs font-bold text-[#54d6c7] transition-all cursor-pointer"
              >
                <Sliders className="h-4 w-4" />
                <span>Adjust Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Concept AI Query */}
        <form onSubmit={handleSearch} className="mt-6 max-w-xl">
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0b1220]/90 px-4 py-2.5 shadow-lg focus-within:border-[#54d6c7]">
            <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask Nexa AI any formula, concept, or exam question..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 flex items-center gap-1 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] px-3.5 py-1.5 text-xs font-black text-slate-950 transition-all cursor-pointer shrink-0"
            >
              <span>Ask AI</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Top High-Action Shortcuts (Obvious Direct Actions) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#54d6c7]" />
            <span>High-Priority Immediate Actions</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Click any action to start instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Action 1: Start 15-min session */}
          <button
            onClick={() => {
              if (onSelectTopic) onSelectTopic(tasks[0].topicParam, studentPlan.subject);
              setActiveTab('timer');
            }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#111c2e] to-[#17253a] hover:border-[#54d6c7] text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#54d6c7]/15 text-[#54d6c7] group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-[#54d6c7] uppercase">15 Mins</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight pt-1">
                Start 15-Minute Session
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                Focused study on Banker&apos;s Algorithm
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#54d6c7] pt-2">
              <span>Launch Focus Timer</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Action 2: Review 12 cards */}
          <button
            onClick={() => {
              if (onSelectTopic) onSelectTopic('Paging, Segmentation & TLB Effective Access Time', studentPlan.subject);
              setActiveTab('flashcards');
            }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-[#111c2e] hover:border-[#8b5cf6]/50 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8b5cf6]/15 text-[#8b5cf6] group-hover:scale-110 transition-transform">
                  <Layers className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-[#8b5cf6] uppercase">12 Cards</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight pt-1">
                Review 12 Flashcards
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                Memory retention on Paging &amp; TLB
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#8b5cf6] pt-2">
              <span>Start Flashcards</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Action 3: Practice 7-mark question */}
          <button
            onClick={() => {
              if (onSelectTopic) onSelectTopic('CPU Scheduling (Round Robin & Priority)', studentPlan.subject);
              setActiveTab('practice');
            }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-[#111c2e] hover:border-[#70d6a8]/50 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#70d6a8]/15 text-[#70d6a8] group-hover:scale-110 transition-transform">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-[#70d6a8] uppercase">7-Mark Drill</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight pt-1">
                Practice 7-Mark Question
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                Gantt Chart &amp; Turnaround Time
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#70d6a8] pt-2">
              <span>Write &amp; AI Grade</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Action 4: Fix weakest topic */}
          <button
            onClick={() => {
              if (onSelectTopic) onSelectTopic('AVL Tree Rotations (LL, RR, LR, RL) & B-Trees', 'Data Structures & Algorithms');
              setActiveTab('nexa');
            }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:border-rose-500/60 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-rose-400 uppercase">Priority</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight pt-1">
                Fix Weakest Topic
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                AVL Tree Balance Factor Rotations
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 pt-2">
              <span>Open AI Coach</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Action 5: Continue Last Studied Topic */}
          <button
            onClick={() => {
              if (onSelectTopic) onSelectTopic(studentPlan.lastStudiedTopic, studentPlan.subject);
              setActiveTab('nexa');
            }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-[#111c2e] hover:border-[#54d6c7]/50 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
                  <RotateCcw className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Resume</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight pt-1">
                Continue Memory Mgmt
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                Pick up where you left off
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 pt-2">
              <span>Resume Study</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </section>

      {/* 3. Today's Actionable Study Plan with Progress Toggles */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Actionable Tasks List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#54d6c7]" />
                  <span>Today&apos;s Study Tasks</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/30">
                  {completedCount}/{tasks.length} Completed ({progressPercent}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click task to open study module • Click status badge to toggle progress
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-[#54d6c7]">
              50 Mins Target
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTriggerAction(task)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#111c2e] hover:bg-[#17253a] hover:border-[#54d6c7]/40 transition-all cursor-pointer gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white group-hover:text-[#54d6c7] transition-colors">
                      {task.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-medium">
                      {task.marksCategory}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {task.subject} • {task.durationMinutes} Minutes
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => cycleTaskStatus(task.id, e)}
                    title="Click to cycle status: Not Started -> In Progress -> Completed -> Needs Review"
                    className="hover:scale-105 transition-transform cursor-pointer"
                  >
                    {getStatusBadge(task.status)}
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#54d6c7] transition-all" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Custom Task */}
          <button
            onClick={() => setActiveTab('exam_center')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#54d6c7]" />
            <span>Add Task from Exam Center Blueprint</span>
          </button>
        </div>

        {/* Right: Exam Readiness & Subject Confidence Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-[#8b5cf6]" />
              <span>Exam Readiness Matrix</span>
            </h2>
            <span className="text-xs font-bold text-[#8b5cf6]">Overall: 76%</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-5 space-y-4">
            <div className="space-y-3">
              {studentPlan.subjects.map((sub) => {
                const conf = studentPlan.confidenceMap[sub] || 'medium';
                const score = conf === 'high' ? 88 : conf === 'medium' ? 74 : 58;
                return (
                  <div key={sub} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[200px]">{sub}</span>
                      <span className={`text-[10px] font-black uppercase ${
                        conf === 'high' ? 'text-emerald-400' : conf === 'medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {conf} Confidence ({score}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          conf === 'high' ? 'bg-emerald-400' : conf === 'medium' ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Score: {studentPlan.targetScore}%</span>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-[#54d6c7] font-bold hover:underline cursor-pointer"
              >
                View Full Analytics →
              </button>
            </div>
          </div>

          {/* Quick Navigation to Key Views */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setActiveTab('exam_center')}
              className="p-3.5 rounded-2xl border border-white/10 bg-[#111c2e] hover:bg-[#17253a] text-left transition-all cursor-pointer group"
            >
              <BookOpen className="h-4 w-4 text-[#54d6c7] mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white">Syllabus Blueprint</span>
              <span className="text-[10px] text-slate-400">5 units per subject</span>
            </button>

            <button
              onClick={() => setActiveTab('mock_exams')}
              className="p-3.5 rounded-2xl border border-white/10 bg-[#111c2e] hover:bg-[#17253a] text-left transition-all cursor-pointer group"
            >
              <FileCheck2 className="h-4 w-4 text-[#8b5cf6] mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-bold text-white">Mock Simulator</span>
              <span className="text-[10px] text-slate-400">Timed exam tests</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
