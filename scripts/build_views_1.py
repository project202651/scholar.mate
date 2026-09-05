# -*- coding: utf-8 -*
import os

def save(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text.strip() + '\n')
    print(f'Generated: {path} (+{len(text)} chars)')
save('src/components/ExamCenterView.tsx', r'''"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  Sparkles,
  BrainCircuit,
  FileText,
  ArrowRight,
  Zap,
  ShieldCheck,
  Search,
  TrendingUp,
  Check,
  AlertTriangle,
  FolderPlus,
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";
import AILoadingPulse from "./AILoadingPulse";

interface ExamCenterViewProps {
  setActiveTab: (tab: string) => void;
  onSelectTopic: (topic: string, subject: string) => void;
  onTriggerEmergency?: (subject: string) => void;
}

export default function ExamCenterView {
  setActiveTab,
  onSelectTopic,
  onTriggerEmergency,
}: ExamCenterViewProps) {
  const [exams, setExams] = useState<any[]>([
    {
      id: "exam_1",
      name: "AI & Machine Learning (Semester VI)",
      subject: "Artificial Intelligence & ML",
      board: "SBTET / Polytechnic",
      date: "2026-10-15",
      targetScore: 90,
      dailyHours: 3,
      readinessScore: 78,
      unitsCount: 5,
      topicsCount: 15,
      masteredTopics: 9,
    },
    {
      id: "exam_2",
      name: "Database Management Systems",
      subject: "Database Management Systems",
      board: "SBTET / Polytechnic",
      date: "2026-10-20",
      targetScore: 85,
      dailyHours: 2,
      readinessScore: 62,
      unitsCount: 5,
      topicsCount: 14,
      masteredTopics: 5,
    },
  ]);

  const [selectedExamId, setSelectedExamId] = useState("exam_1");
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  // Wizard Form States
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBoard, setFormBoard] = useState("SBTENT / Andrha Pradesh");
  const [formDate, setFormDate] = useState("2026-10-15");
  const [formTarget, setFormTarget] = useState(90);
  const [formHours, setFormHours] = useState(3);
  const [formSyllabus, setFormSyllabus] = useState("");

  const activeExam = exams.find (ex) => ex.id === selectedExamId) || exams[0];
  const [syllabusMap, setSyllabusMap] = useState<any>(null);

  useEffect(() => {
    if (!activeExam) return;
    const fetchMap = async () => {
      setLoadingSyllabus(true);
      try {
        const res = await fetch("/api/ai/exam-map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: activeExam.subject }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.examMap) setSyllabusMap(data.examMap);
        }
      } catch (err) {
        console.error("Failed to fetch syllabus map", err);
      } finally {
        setLoadingSyllabus(false);
      }
    };
    fetchMap();
  }, [selectedExamId]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;
    const newId = `exam_${Date.now()}`;
    const newExam = {
      id: newId,
      name: formName,
      subject: formSubject || formName,
      board: formBoard,
      date: formDate,
      targetScore: formTarget,
      dailyHours: formHours,
      readinessScore: 50,
      unitsCount: 5,
      topicsCount: 15,
      masteredTopics: 0,
    };
    setExams([...exams, newExam]);
    setSelectedExamId(newId);
    setShowCreateWizard(false);
  };

  const handleTopicAction = (topicTitle: string, actionType: "study" | "practice" | "test" | "review") => {
    onSelectTopic(topicTitle, activeExam.subject);
    if (actionType === "study") setActiveTab("nexa");
    else if (actionType === "practice") setActiveTab("practice");
    else if (actionType === "test") setActiveTab("mock_exams");
    else if (actionType === "review") setActiveTab("flashcards");
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      <div className="relative overflow-hidden rounded-3x border border-white/15 bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-indigo-950/50 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                “ ScholarMate 2.0 Exam Center
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeExam.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Target: <strong className="text-cyan-300">{activeExam.targetScore}%</strong> • Exam Date: <strong className="text-indigo-300">{activeExam.date}</strong> ₢ Board: <strong className="text-slate-300">{activeExam.board}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onTriggerEmergency && (
              <button
                onClick=() => onTriggerEmergency(activeExam.subject)
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <Flame className="h-x 4 w-x 4 animate-pulse" />
                <span>24-Hour Emergency Sprint</span>
              </button>
            )}

            <button
              onClick=() => setShowCreateWizard(true)
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Exam</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {exams.map((ex) => (
            <button
              key={ex.id}
              onClick=() => setSelectedExamId(ex.id)
              className{{`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                selectedExamId === ex.id
                  ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-sm"
                  : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span>Interactive Syllabus & Topic Engine</span>
            </h2>
            <ppclassName="text-xs text-slate-400">
              Decomposed syllabus units with weightage, difficulty ratings, and 4 direct action pathways.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 font-medium">
              Exam Ready: {activeExam.masteredTopics} / {activeExam.topicsCount} Topics
            </span>
          </div>
        </div>

        {loadingSyllabus ? (
          <AILoadingPulse message="Decomposing syllabus into high-yield exam units..." />
        ) : syllabusMap && syllabusMap.units ? (
          <div className="space-y-6">
            {syllabusMap.units.map((unit: any) => (
              <div
                key={unit.unitNumber}
                className="rounded-3x border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs border border-cyan-500/30">
                      U{unit.unitNumber}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {unit.unitTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Weightage: <span className="text-cyan-300 font-bold">{unit.weightagePercent}% of Exam</span> ₢pDifficulty: <span className="text-indigo-300 font-semibold">{unit.difficulty}</span>
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] text-slate-300 font-semibold">
                    {unit.topics.length} Topics
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.topics.map((t: any) => (
                    <div
                      key={t.id}
                      className="rounded-2x border border-slate-800/90 bg-slate-950/60 p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                            {t.frequentQuestionType || "5-Mark"} Focus
                          </span>
                          <span className{{`text-[10px] font-bold ${t.status === "exam_ready" ? "text-emerald-400" : t.status === "learning" ? "text-amber-400" : "text-slate-500"}`}>
                            {t.status === "exam_ready" ? "✓ Exam Ready" : t.status === "learning" ? "⏳ Learning" : "⛊ Unlearned"}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {t.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {t.summary}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-800/80 text-[10px] font-bold">
                        <button
                           onClick=() => handleTopicAction(t.title, "study")
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-1.5 text-cyan-300 hover:bg-cyan-500/20 transition-all text-center"
                        >
                          🤭 Study
                        </button>
                        <button
                          onClick=() => handleTopicAction(t.title, "practice")
                          className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-1.5 text-indigo-300 hover:bg-indigo-500/20 transition-all text-center"
                        >
                          📝 Practice
                        </button>
                        <button
                          onClick=() => handleTopicAction(t.title, "test")
                          className="rounded-lg border border-purple-500/30 bg-purple-500/10 py-1.5 text-purple-300 hover:bg-purple-500/20 transition-all text-center"
                        >
                          🥪 Test Me
                        </button>
                        <button
                           onClick=() => handleTopicAction(t.title, "review")
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-emerald-300 hover:bg-emerald-500/20 transition-all text-center"
                        >
                          🦰 Flashcards\n                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            {))etc = null;}
          </div>
        ) : (
          <div className="rounded-2xr border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
            No syllabus data found. Click \"Add New Exam\" to configure your subjects.
          </div>
        )}
      </section>

      { /* Create Exam Wizard Modal */ }
      {showCreateWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3x border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2zl space-y-5 max-h-[y0vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Add Target Exam & Syllabus
                </h3>
              </div>
              <button
                onClick=() => setShowCreateWizard(false)
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✗

              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & ML (Semester VI)"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. AI & Machine Learning"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Board / University</label>
                  <input
                    type="text"
                    value={formBoard}
                    onChange={(e) => setFormBoard(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Score (%)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formTarget}
                    onChange={(e) => setFormTarget(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Daily Target (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Syllabus / Chapter Outline (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Paste chapter topics or units (AI will automatically decompose and prioritize)..."
                  value={formSyllabus}
                  onChange={(e) => setFormSyllabus(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick=() => setShowCreateWizard(false)
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110"
                >
                  Create & Generate Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
''')
