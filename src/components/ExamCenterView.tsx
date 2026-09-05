'use client';

import React, { useState, useEffect } from "react";
import {
  Target,
  Sparkles,
  Layers,
  BookOpen,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  FolderPlus,
  Compass,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import AILoadingPulse from "./AILoadingPulse";

interface ExamCenterViewProps {
  setActiveTab?: (tab: string) => void;
  onSelectTopic?: (topic: string, subject?: string) => void;
  onSelectTopicAction?: (topic: string, action: "study" | "practice" | "test" | "review") => void;
  onTriggerEmergency?: (subject: string) => void;
}

export default function ExamCenterView({
  setActiveTab,
  onSelectTopic,
  onSelectTopicAction,
  onTriggerEmergency,
}: ExamCenterViewProps) {
  const [exams, setExams] = useState<any[]>([
    {
      id: "exam_1",
      name: "Operating Systems & System Software",
      subject: "Operating Systems",
      board: "University / Polytechnic",
      date: "2026-10-15",
      targetScore: 90,
      dailyHours: 3,
      readinessScore: 78,
      unitsCount: 5,
      topicsCount: 15,
      units: [
        {
          id: "u1",
          unitNumber: 1,
          name: "Unit 1: Process Management & CPU Scheduling",
          weightagePercentage: 25,
          topics: [
            {
              id: "t1",
              title: "Process States & PCB Structure",
              difficulty: "Easy",
              marksWeight: "5-Mark",
              frequentQuestionType: "5-Mark",
              status: "exam_ready",
              summary: "State transition diagram, PCB components, Context Switching overhead.",
            },
            {
              id: "t2",
              title: "CPU Scheduling Algorithms (FCFS, SJF, Round Robin)",
              difficulty: "Medium",
              marksWeight: "10-Mark",
              frequentQuestionType: "10-Mark",
              status: "learning",
              summary: "Gantt chart calculation, Turnaround Time, Waiting Time comparison.",
            },
            {
              id: "t3",
              title: "Process Synchronization & Semaphores",
              difficulty: "Hard",
              marksWeight: "10-Mark",
              frequentQuestionType: "10-Mark",
              status: "unlearned",
              summary: "Critical Section Problem, Peterson's Solution, Counting vs Binary Semaphores.",
            },
          ],
        },
        {
          id: "u2",
          unitNumber: 2,
          name: "Unit 2: Deadlocks & Prevention",
          weightagePercentage: 25,
          topics: [
            {
              id: "t4",
              title: "Deadlock 4 Necessary Conditions & RAG",
              difficulty: "Easy",
              marksWeight: "5-Mark",
              frequentQuestionType: "5-Mark",
              status: "exam_ready",
              summary: "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
            },
            {
              id: "t5",
              title: "Banker's Algorithm for Deadlock Avoidance",
              difficulty: "Hard",
              marksWeight: "10-Mark",
              frequentQuestionType: "10-Mark",
              status: "learning",
              summary: "Safety Algorithm, Resource Request Algorithm, Need Matrix calculation.",
            },
          ],
        },
        {
          id: "u3",
          unitNumber: 3,
          name: "Unit 3: Memory Management & Virtual Memory",
          weightagePercentage: 30,
          topics: [
            {
              id: "t6",
              title: "Paging, Segmentation & TLB Hit Ratio",
              difficulty: "Medium",
              marksWeight: "10-Mark",
              frequentQuestionType: "10-Mark",
              status: "learning",
              summary: "Logical to Physical Address Translation, Page Table structure, TLB effective access time.",
            },
            {
              id: "t7",
              title: "Page Replacement Algorithms (FIFO, LRU, Optimal)",
              difficulty: "Medium",
              marksWeight: "10-Mark",
              frequentQuestionType: "10-Mark",
              status: "unlearned",
              summary: "Belady's Anomaly, Hit and Miss ratios, Page Fault rate calculations.",
            },
          ],
        },
        {
          id: "u4",
          unitNumber: 4,
          name: "Unit 4: Storage & File Systems",
          weightagePercentage: 20,
          topics: [
            {
              id: "t8",
              title: "Disk Scheduling (SSTF, SCAN, C-SCAN)",
              difficulty: "Easy",
              marksWeight: "5-Mark",
              frequentQuestionType: "5-Mark",
              status: "exam_ready",
              summary: "Total head movement calculation, Seek time comparison.",
            },
            {
              id: "t9",
              title: "File Allocation Methods (Contiguous, Linked, Indexed)",
              difficulty: "Medium",
              marksWeight: "5-Mark",
              frequentQuestionType: "5-Mark",
              status: "unlearned",
              summary: "Internal/external fragmentation in disk storage, Inode structure in UNIX.",
            },
          ],
        },
      ],
    },
  ]);

  const [activeExamIndex, setActiveExamIndex] = useState(0);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Form states for creating new exam
  const [examName, setExamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [targetScore, setTargetScore] = useState(90);
  const [syllabusOverview, setSyllabusOverview] = useState("");

  const currentExam = exams[activeExamIndex] || exams[0];

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !subjectName) return;

    setLoadingAI(true);
    setShowCreateWizard(false);

    try {
      const res = await fetch("/api/ai/exam-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectName,
          examName,
          syllabusOverview: syllabusOverview || `${subjectName} standard curriculum`,
          examDate: examDate || "2026-11-01",
          targetScore: Number(targetScore) || 90,
        }),
      });

      const data = await res.json();
      if (res.ok && data.examMap) {
        const newExamObj = {
          id: `exam_${Date.now()}`,
          name: data.examMap.examName || examName,
          subject: data.examMap.subject || subjectName,
          board: "SBTET / Polytechnic",
          date: examDate || "2026-11-01",
          targetScore: Number(targetScore) || 90,
          dailyHours: 3,
          readinessScore: 60,
          unitsCount: data.examMap.units?.length || 0,
          topicsCount: data.examMap.units?.reduce((acc: number, u: any) => acc + (u.topics?.length || 0), 0) || 0,
          units: data.examMap.units || [],
        };
        setExams([newExamObj, ...exams]);
        setActiveExamIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
      setExamName("");
      setSubjectName("");
      setSyllabusOverview("");
    }
  };

  const handleTopicAction = (topicTitle: string, action: "study" | "practice" | "test" | "review") => {
    if (onSelectTopicAction) {
      onSelectTopicAction(topicTitle, action);
    } else {
      if (onSelectTopic) onSelectTopic(topicTitle, currentExam.subject);
      if (setActiveTab) {
        if (action === "study") setActiveTab("nexa");
        else if (action === "practice") setActiveTab("practice");
        else if (action === "test") setActiveTab("mock_exams");
        else if (action === "review") setActiveTab("flashcards");
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Target className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Exam Center & Syllabus Map
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Deconstruct your semester syllabus into structured units, high-yield topics, and mark distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateWizard(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Target Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Pulse */}
      {loadingAI && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
          <AILoadingPulse message="Nexa AI is decomposing the syllabus into high-yield 5M & 10M units..." />
        </div>
      )}

      {/* Active Exam Switcher Pills */}
      {exams.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {exams.map((exam, idx) => (
            <button
              key={exam.id || idx}
              onClick={() => setActiveExamIndex(idx)}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeExamIndex === idx
                  ? "border-emerald-500 bg-emerald-950/60 text-white shadow-md shadow-emerald-500/20"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>
      )}

      {/* Current Exam Overview Card */}
      {currentExam && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Subject</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 block truncate">
                {currentExam.subject}
              </span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Goal</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 mt-1 block">
                {currentExam.targetScore}% (Distinction)
              </span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Units Identified</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-400 mt-1 block">
                {currentExam.units?.length || currentExam.unitsCount} Units
              </span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Predicted Readiness</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 mt-1 block">
                {currentExam.readinessScore}% Ready
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Syllabus Unit Tree */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>Structured Syllabus Map</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click any topic to trigger Study, Practice, Test, or Flashcards
          </span>
        </div>

        {currentExam?.units && currentExam.units.length > 0 ? (
          <div className="space-y-6">
            {currentExam.units.map((unit: any, uIdx: number) => (
              <div
                key={unit.id || uIdx}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                      {unit.unitNumber || uIdx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{unit.name}</h3>
                  </div>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-emerald-400 border border-slate-700 self-start sm:self-auto">
                    Weight: {unit.weightagePercentage || 20}% of Total Paper
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unit.topics?.map((t: any, tIdx: number) => (
                    <div
                      key={t.id || tIdx}
                      className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                            {t.frequentQuestionType || "5-Mark"} Focus
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              t.status === "exam_ready"
                                ? "text-emerald-400"
                                : t.status === "learning"
                                ? "text-amber-400"
                                : "text-slate-500"
                            }`}
                          >
                            {t.status === "exam_ready"
                              ? "✓ Exam Ready"
                              : t.status === "learning"
                              ? "⏳ Learning"
                              : "⛊ Unlearned"}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {t.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {t.summary}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-800/80 text-[10px] font-bold">
                        <button
                          onClick={() => handleTopicAction(t.title, "study")}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-emerald-300 hover:bg-emerald-500/20 transition-all text-center cursor-pointer"
                        >
                          📖 Study
                        </button>
                        <button
                          onClick={() => handleTopicAction(t.title, "practice")}
                          className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-1.5 text-indigo-300 hover:bg-indigo-500/20 transition-all text-center cursor-pointer"
                        >
                          📝 Practice
                        </button>
                        <button
                          onClick={() => handleTopicAction(t.title, "test")}
                          className="rounded-lg border border-purple-500/30 bg-purple-500/10 py-1.5 text-purple-300 hover:bg-purple-500/20 transition-all text-center cursor-pointer"
                        >
                          🧪 Test Me
                        </button>
                        <button
                          onClick={() => handleTopicAction(t.title, "review")}
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-1.5 text-cyan-300 hover:bg-cyan-500/20 transition-all text-center cursor-pointer"
                        >
                          ⚡ Flashcards
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
            No syllabus data found. Click "Add New Target Exam" to configure your syllabus map.
          </div>
        )}
      </section>

      {/* Create Exam Wizard Modal */}
      {showCreateWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold">Add Target Exam & Syllabus</h3>
              </div>
              <button
                onClick={() => setShowCreateWizard(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Database Systems Midterm & Final Exam"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Subject / Branch</label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Database Management Systems (DBMS)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target Score %</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Syllabus Units or Chapter Names (Optional)
                </label>
                <textarea
                  rows={4}
                  value={syllabusOverview}
                  onChange={(e) => setSyllabusOverview(e.target.value)}
                  placeholder="Paste your syllabus units, e.g. Unit 1: ER Models, Unit 2: Relational Algebra & SQL, Unit 3: Normalization 1NF-BCNF, Unit 4: Transactions & Concurrency..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWizard(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 font-bold text-white shadow-md cursor-pointer"
                >
                  Decompose with AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
