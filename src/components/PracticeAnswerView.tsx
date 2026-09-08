'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, Sparkles, CheckSquare, AlertCircle, Edit3, Send, RefreshCw, 
  HelpCircle, ChevronRight, Award, Zap, BookOpen, CheckCircle, XCircle,
  ListFilter, Target, Layers, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeAnswerViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialDocumentId?: string;
}

interface QuestionBankItem {
  id: string;
  marks: number;
  category: string;
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  examinerTip: string;
}

interface EvaluationResult {
  scoreObtained: number;
  maxMarks: number;
  percentage: number;
  feedback: string;
  checklistMatches: Array<{
    criterion: string;
    awarded: boolean;
    marksAwarded: number;
    comment: string;
  }>;
  missingKeywords: string[];
  improvementTip: string;
}

export default function PracticeAnswerView({
  initialTopic,
  initialSubject,
  initialDocumentId,
}: PracticeAnswerViewProps) {
  const [topic, setTopic] = useState(initialTopic || 'Database Normalization (1NF, 2NF, 3NF, BCNF)');
  const [subject, setSubject] = useState(initialSubject || 'Database Management Systems');
  const [selectedDocId, setSelectedDocId] = useState(initialDocumentId || '');
  const [documents, setDocuments] = useState<any[]>([]);

  // 15-Question Bank
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>([]);
  const [loadingBank, setLoadingBank] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | '2m' | '5m' | '10m'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBankItem | null>(null);

  // Student Evaluation Sandbox
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);

  useEffect(() => {
    fetchDocs();
    handleGenerateBank(topic, subject);
  }, []);

  useEffect(() => {
    if (initialDocumentId) setSelectedDocId(initialDocumentId);
    if (initialSubject) setSubject(initialSubject);
    if (initialTopic) {
      setTopic(initialTopic);
      handleGenerateBank(initialTopic, initialSubject || subject);
    }
  }, [initialDocumentId, initialSubject, initialTopic]);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents/upload');
      if (res.ok) {
        const data = await res.json();
        if (data.documents) {
          setDocuments(data.documents);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateBank = async (customTopic?: string, customSubject?: string) => {
    const targetTopic = (customTopic || topic).trim();
    const targetSubject = (customSubject || subject).trim();
    if (!targetTopic) return;

    setLoadingBank(true);
    setEvaluation(null);
    setShowIdealAnswer(false);
    setStudentAnswer('');

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic: targetTopic,
          subject: targetSubject,
          mode: 'bank',
          documentId: selectedDocId || undefined,
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.bank && Array.isArray(data.bank.questions) && data.bank.questions.length > 0) {
          setQuestionBank(data.bank.questions);
          setSelectedQuestion(data.bank.questions[0]);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load question bank:", err);
    } finally {
      setLoadingBank(false);
    }
  };

  const handleEvaluateStudentAnswer = async () => {
    if (!selectedQuestion || !studentAnswer.trim()) return;
    setEvaluating(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: selectedQuestion.question,
          studentAnswer,
          maxMarks: selectedQuestion.marks,
          checklist: [
            { criterion: "Definition & Technical Accuracy", marksAllocated: selectedQuestion.marks * 0.3 },
            { criterion: "Diagram / Working Formula / Step-by-Step", marksAllocated: selectedQuestion.marks * 0.5 },
            { criterion: "Real-World Application & Summary", marksAllocated: selectedQuestion.marks * 0.2 }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.evaluation) {
          setEvaluation(data.evaluation);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const filteredQuestions = questionBank.filter(q => {
    if (activeFilter === '2m') return q.marks === 2;
    if (activeFilter === '5m') return q.marks === 5;
    if (activeFilter === '10m') return q.marks === 10;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-emerald-100 border border-white/20">
            <Award className="h-3.5 w-3.5" />
            <span>Examiner Scoring & Answer Mastery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Practice Question Bank & AI Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
            Access 15–20 high-yield exam questions (2M, 5M, 10M), practice writing your answers in the sandbox, and receive real-time mark evaluation and examiner scoring tips.
          </p>
        </div>
      </div>

      {/* Topic & Document Selector Control Bar */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateBank();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Topic / Chapter</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Deadlock Banker's Algorithm, Normalization..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loadingBank || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {loadingBank ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Generate 15 Questions</span>
            </button>
          </div>
        </form>
      </div>

      {/* Question Bank & Answer Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 15-Question Bank Navigation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Question Bank ({questionBank.length})
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-0.5 rounded ${activeFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('2m')}
                className={`px-2 py-0.5 rounded ${activeFilter === '2m' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
              >
                2M
              </button>
              <button
                onClick={() => setActiveFilter('5m')}
                className={`px-2 py-0.5 rounded ${activeFilter === '5m' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500'}`}
              >
                5M
              </button>
              <button
                onClick={() => setActiveFilter('10m')}
                className={`px-2 py-0.5 rounded ${activeFilter === '10m' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
              >
                10M
              </button>
            </div>
          </div>

          {loadingBank ? (
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-8 text-center space-y-3">
              <RefreshCw className="h-6 w-6 animate-spin text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-500">Generating 15 structured exam questions...</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {filteredQuestions.map((q, idx) => {
                const isSelected = selectedQuestion?.id === q.id;
                return (
                  <div
                    key={q.id || idx}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setEvaluation(null);
                      setShowIdealAnswer(false);
                    }}
                    className={`rounded-xl border p-3.5 transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-sm'
                        : 'border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                        q.marks === 2 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                        q.marks === 5 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' :
                        'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                      }`}>
                        {q.marks} Marks
                      </span>
                      <span className="text-[10px] text-slate-400">Q{idx + 1}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {q.question}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-white/5">
                      <span className="truncate max-w-[200px]">{q.examinerTip}</span>
                      <ChevronRight className="h-3 w-3 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Question Sandbox & Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedQuestion ? (
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-2xl shadow-xl space-y-5">
              {/* Question Header */}
              <div className="space-y-2 border-b border-slate-200/80 dark:border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {selectedQuestion.category}
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Max Marks: {selectedQuestion.marks}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {selectedQuestion.question}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Examiner Rubric: {selectedQuestion.examinerTip}</span>
                </div>
              </div>

              {/* Student Answer Writing Sandbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Your Answer Sandbox</span>
                  </label>
                  <button
                    onClick={() => setShowIdealAnswer(!showIdealAnswer)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {showIdealAnswer ? "Hide Model Answer" : "View Model Answer"}
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Type your exam response here (include definitions, equations, steps)..."
                  className="w-full p-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={handleEvaluateStudentAnswer}
                    disabled={evaluating || !studentAnswer.trim()}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-4 py-2 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    {evaluating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    <span>Evaluate My Answer</span>
                  </button>
                </div>
              </div>

              {/* Evaluation Results Feedback Box */}
              <AnimatePresence>
                {evaluation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          AI Examiner Evaluation
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          Score: {evaluation.scoreObtained} / {evaluation.maxMarks} ({evaluation.percentage}%)
                        </h4>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm">
                        {evaluation.scoreObtained}M
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {evaluation.feedback}
                    </p>

                    {/* Criteria matches */}
                    {evaluation.checklistMatches && evaluation.checklistMatches.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Mark Breakdown:
                        </span>
                        {evaluation.checklistMatches.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/60 dark:border-white/5">
                            <div className="flex items-center gap-2">
                              {item.awarded ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-rose-500" />}
                              <span className="text-slate-800 dark:text-slate-200">{item.criterion}</span>
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">+{item.marksAwarded}M</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      💡 <strong>Examiner Improvement Tip:</strong> {evaluation.improvementTip}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Model Ideal Answer Accordion */}
              <AnimatePresence>
                {showIdealAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      <BookOpen className="h-4 w-4" />
                      <span>Model Ideal Answer (Full Marks Reference)</span>
                    </div>
                    <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 overflow-x-auto">
                      {selectedQuestion.idealAnswer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-12 text-center text-slate-500 text-xs space-y-2">
              <FileCheck2 className="h-8 w-8 text-slate-400 mx-auto" />
              <p>Select a question from the bank to start your practice sandbox.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
