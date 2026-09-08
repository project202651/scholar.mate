'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, Sparkles, CheckSquare, AlertCircle, Edit3, Send, RefreshCw, 
  HelpCircle, ChevronRight, Award, Zap, BookOpen, CheckCircle, XCircle,
  ListFilter, Target, Layers, FileText, Check
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
  simpleExplanation: string;
  idealAnswer: string;
  keyPoints: string[];
  diagramText: string;
  commonMistakes: string[];
  markingScheme: Array<{ criterion: string; marksAllocated: number; description: string }>;
  quickRevision: string;
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
  const [selectedMarks, setSelectedMarks] = useState<5 | 10>(10);
  const [activeTab, setActiveTab] = useState<
    'simple' | 'exam' | 'keypoints' | 'diagram' | 'mistakes' | 'marking' | 'revision' | 'compare'
  >('exam');

  const [loading, setLoading] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Model Question Data State
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBankItem>({
    id: "q_demo",
    marks: 10,
    category: "10-Mark Comprehensive Question",
    question: "Explain the concept of Database Normalization with 1NF, 2NF, 3NF, and BCNF with a suitable schema example.",
    simpleExplanation: "Normalization is like organizing your study desk: you separate your textbooks, notebooks, and pens into different dedicated drawers so you don't repeat the same item and avoid messy clutter.",
    idealAnswer: `### 1. Definition of Normalization
Database Normalization is the systematic technique of organizing relational tables to minimize data redundancy and prevent insertion, update, and deletion anomalies.

### 2. First Normal Form (1NF)
- **Rule:** Every column must contain atomic (indivisible) values. No repeating groups.
- **Example:** Split multi-valued \`Phone_Numbers\` into separate rows.

### 3. Second Normal Form (2NF)
- **Rule:** Must be in 1NF AND have no partial dependency (every non-prime attribute must depend on the whole candidate key).

### 4. Third Normal Form (3NF)
- **Rule:** Must be in 2NF AND have no transitive dependency ($X \\rightarrow Y, Y \\rightarrow Z$).

### 5. Boyce-Codd Normal Form (BCNF)
- **Rule:** For every functional dependency $X \\rightarrow Y$, $X$ must be a super key.`,
    keyPoints: [
      "Atomicity of attributes (1NF)",
      "Removal of partial functional dependencies (2NF)",
      "Removal of transitive dependencies (3NF)",
      "Determinant must be a Super Key (BCNF)"
    ],
    diagramText: `[Unnormalized Relation] 
         │ (Eliminate repeating groups)
         ▼
       [1NF] ──► (Remove Partial Dependencies) 
         │
         ▼
       [2NF] ──► (Remove Transitive Dependencies)
         │
         ▼
       [3NF] ──► (Strict Determinant Superkey Check)
         │
         ▼
      [BCNF]`,
    commonMistakes: [
      "Forgetting to state that 2NF applies only when candidate key is composite.",
      "Confusing transitive dependency with partial dependency.",
      "Omitting the formal definition of functional dependency $X \\rightarrow Y$."
    ],
    markingScheme: [
      { criterion: "Formal definition of Normalization & anomalies", marksAllocated: 2, description: "State insertion, deletion, and update anomalies." },
      { criterion: "1NF, 2NF & 3NF definitions with rules", marksAllocated: 4, description: "Detail atomic values, partial & transitive dependency." },
      { criterion: "BCNF explanation & strict superkey constraint", marksAllocated: 2, description: "Explain why BCNF is stronger than 3NF." },
      { criterion: "Schema breakdown / diagrammatic transition", marksAllocated: 2, description: "Clear flow diagram or schema transformation." }
    ],
    quickRevision: "1NF = Atomic values · 2NF = 1NF + No Partial Dependency · 3NF = 2NF + No Transitive Dependency · BCNF = For $X \\rightarrow Y$, $X$ is Superkey.",
    examinerTip: "Always write the formal functional dependency arrow notation $X \\rightarrow Y$."
  });

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSubject) setSubject(initialSubject);
  }, [initialTopic, initialSubject]);

  const handleGenerateAnswer = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setEvaluation(null);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic,
          subject,
          marks: selectedMarks,
          mode: 'single',
          documentId: initialDocumentId || undefined,
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.practice) {
          const p = data.practice;
          setCurrentQuestion({
            id: `q_${Date.now()}`,
            marks: selectedMarks,
            category: `${selectedMarks}-Mark University Question`,
            question: p.question || `${selectedMarks}-Mark Question on ${topic}`,
            simpleExplanation: `Intuitive explanation: ${topic} functions to ensure systematic consistency, efficiency, and predictable execution across all standard operations.`,
            idealAnswer: p.idealAnswer || "Complete structured model answer.",
            keyPoints: p.keyPoints || ["Core Definition", "Operational Rule", "Derivation Steps"],
            diagramText: `[Input System State] ──► [Processing / Algorithm] ──► [Verified Output State]`,
            commonMistakes: p.commonMistakes || ["Omitting schematic diagram", "Skipping intermediate mathematical steps"],
            markingScheme: p.examinerChecklist || [
              { criterion: "Technical Definition & Principle", marksAllocated: selectedMarks * 0.3, description: "Formal accurate definition" },
              { criterion: "Derivation / Working Steps", marksAllocated: selectedMarks * 0.5, description: "Step-by-step logic" },
              { criterion: "Applications & Boxed Summary", marksAllocated: selectedMarks * 0.2, description: "Industrial applications" }
            ],
            quickRevision: `Key summary: Master definition, draw labeled schematic, and highlight boxed final result.`,
            examinerTip: "Draw labeled block diagrams for full presentation marks."
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareAnswer = async () => {
    if (!studentAnswer.trim()) return;
    setEvaluating(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: currentQuestion.question,
          studentAnswer,
          maxMarks: currentQuestion.marks,
          checklist: currentQuestion.markingScheme
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.evaluation) {
          setEvaluation(data.evaluation);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const tabsList = [
    { id: 'simple', label: 'Simple Explanation' },
    { id: 'exam', label: 'Exam Answer' },
    { id: 'keypoints', label: 'Key Points' },
    { id: 'diagram', label: 'Diagram' },
    { id: 'mistakes', label: 'Common Mistakes' },
    { id: 'marking', label: 'Marking Scheme' },
    { id: 'revision', label: 'Quick Revision' },
    { id: 'compare', label: 'Compare My Answer' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <Award className="h-3.5 w-3.5" />
            <span>AI Answer Engine & Marking Scheme</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Exam Answer Generator & Evaluator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Generate 5-mark and 10-mark model answers structured across 7 dedicated learning tabs. Compare your written answer against the official examiner marking scheme.
          </p>
        </div>
      </div>

      {/* Input Control Box */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0b1220] text-xs text-white"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Banker's Algorithm, Normalization..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0b1220] text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Format</label>
            <div className="flex items-center gap-1 rounded-xl bg-[#0b1220] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setSelectedMarks(5)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMarks === 5 ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                5 Marks
              </button>
              <button
                type="button"
                onClick={() => setSelectedMarks(10)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMarks === 10 ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                10 Marks
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={handleGenerateAnswer}
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-50 text-slate-950 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Answer Workspace */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Question Header */}
        <div className="space-y-1.5 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#54d6c7]">
              {subject} · {currentQuestion.category}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white font-mono">
              {currentQuestion.marks} Marks
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 7 Learning Tabs Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-2 no-scrollbar">
          {tabsList.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#54d6c7] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Simple Explanation */}
        {activeTab === 'simple' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#54d6c7] uppercase">Intuitive Plain-English Explanation</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQuestion.simpleExplanation}
            </p>
          </div>
        )}

        {/* Tab 2: Exam Answer (5M / 10M) */}
        {activeTab === 'exam' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
              <span className="font-bold text-[#54d6c7]">Official Full-Marks Model Answer ({currentQuestion.marks}M)</span>
              <span>{currentQuestion.examinerTip}</span>
            </div>
            <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
              {currentQuestion.idealAnswer}
            </div>
          </div>
        )}

        {/* Tab 3: Key Points */}
        {activeTab === 'keypoints' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#54d6c7] uppercase">Key Evaluator Checkpoints</h3>
            <ul className="space-y-2">
              {currentQuestion.keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="h-4 w-4 text-[#54d6c7] shrink-0 mt-0.5" />
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 4: Diagram */}
        {activeTab === 'diagram' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#6ea8fe] uppercase">Architectural Schematic Diagram</h3>
            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-[#54d6c7] overflow-x-auto whitespace-pre leading-relaxed">
              {currentQuestion.diagramText}
            </pre>
          </div>
        )}

        {/* Tab 5: Common Mistakes */}
        {activeTab === 'mistakes' && (
          <div className="rounded-2xl border border-[#f47c7c]/20 bg-[#f47c7c]/5 p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#f47c7c] uppercase">Top Student Mistakes & Traps</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentQuestion.commonMistakes.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#f47c7c] font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 6: Marking Scheme */}
        {activeTab === 'marking' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#f6c85f] uppercase">Official Marking Scheme Rubric</h3>
            <div className="space-y-2">
              {currentQuestion.markingScheme.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-white">{item.criterion}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                  <span className="font-mono font-bold text-[#54d6c7]">+{item.marksAllocated}M</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Quick Revision */}
        {activeTab === 'revision' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#70d6a8] uppercase">60-Second Flash Summary</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              {currentQuestion.quickRevision}
            </p>
          </div>
        )}

        {/* Tab 8: Compare My Answer Feature */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4 text-[#54d6c7]" />
                  <span>Submit Your Handwritten/Typed Answer to Compare</span>
                </label>
                <span className="text-[10px] text-slate-400">Evaluates against 4 marking criteria</span>
              </div>

              <textarea
                rows={6}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your answer here to receive mark-by-mark scoring and examiner feedback..."
                className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#54d6c7]"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleCompareAnswer}
                  disabled={evaluating || !studentAnswer.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-40 text-slate-950 font-black px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
                >
                  {evaluating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Compare & Score My Answer</span>
                </button>
              </div>
            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <div className="rounded-2xl border border-[#54d6c7]/30 bg-[#54d6c7]/10 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-white">Scored: {evaluation.scoreObtained} / {evaluation.maxMarks} Marks ({evaluation.percentage}%)</span>
                  <span className="text-xs text-[#54d6c7] font-bold">Examiner Feedback</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{evaluation.feedback}</p>
                <div className="text-xs text-[#f6c85f]">
                  💡 <strong>Tip:</strong> {evaluation.improvementTip}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
