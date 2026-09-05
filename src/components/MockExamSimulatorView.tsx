'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, Clock, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, 
  Flag, RefreshCw, Sparkles, BookOpen, Layers, XCircle, ArrowRight, BarChart3, Zap 
} from 'lucide-react';

interface MockExamSimulatorViewProps {
  onNavigateToNexa?: (topic: string) => void;
  onNavigateToPractice?: (topic: string) => void;
}

interface Question {
  id: string;
  section: string;
  marks: number;
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  modelAnswer?: string;
  explanation: string;
  topicTag: string;
}

interface MockExamData {
  examTitle: string;
  subject: string;
  totalMarks: number;
  timeLimitMinutes: number;
  instructions: string[];
  sections: Array<{
    name: string;
    description: string;
    totalMarks: number;
    questions: Question[];
  }>;
}

export default function MockExamSimulatorView({
  onNavigateToNexa,
  onNavigateToPractice
}: MockExamSimulatorViewProps) {
  const [subject, setSubject] = useState('Operating Systems & System Software');
  const [examType, setExamType] = useState('Midterm & Final Pattern');
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState<MockExamData | null>(null);

  // Exam Simulation State
  const [examState, setExamState] = useState<'idle' | 'running' | 'submitted'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Student Responses
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (examState === 'running' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, secondsRemaining]);

  const handleStartExamGeneration = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mock-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          examType,
          topics: ['Process Synchronization', 'Deadlocks', 'Memory Management', 'Paging & Segmentation', 'File Systems']
        })
      });
      const data = await res.json();
      if (data.mockExam) {
        setExam(data.mockExam);
        setExamState('running');
        setSecondsRemaining((data.mockExam.timeLimitMinutes || 30) * 60);
        setCurrentSectionIdx(0);
        setCurrentQuestionIdx(0);
        setMcqAnswers({});
        setWrittenAnswers({});
        setFlaggedQuestions({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = () => {
    setExamState('submitted');
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to flat-index all questions
  const allQuestions: Question[] = exam 
    ? exam.sections.flatMap(s => s.questions) 
    : [];

  const currentSection = exam?.sections[currentSectionIdx];
  const currentQuestion = currentSection?.questions[currentQuestionIdx];

  // Scorecard Computation
  const computeScore = () => {
    if (!exam) return { score: 0, total: 0, percentage: 0, topicWeaknesses: [] as string[] };
    let score = 0;
    let total = 0;
    const topicMistakes: Record<string, number> = {};

    exam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        total += q.marks;
        if (q.options && q.correctOptionIndex !== undefined) {
          if (mcqAnswers[q.id] === q.correctOptionIndex) {
            score += q.marks;
          } else {
            topicMistakes[q.topicTag || 'General'] = (topicMistakes[q.topicTag || 'General'] || 0) + 1;
          }
        } else {
          // Subjective answer heuristic: award proportional marks if answered
          const ans = writtenAnswers[q.id] || '';
          if (ans.length > 50) {
            score += Math.round(q.marks * 0.85); // good effort credit
          } else if (ans.length > 10) {
            score += Math.round(q.marks * 0.5);
          } else {
            topicMistakes[q.topicTag || 'General'] = (topicMistakes[q.topicTag || 'General'] || 0) + 1;
          }
        }
      });
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const topicWeaknesses = Object.keys(topicMistakes);
    return { score, total, percentage, topicWeaknesses };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Idle / Generator Screen */}
      {examState === 'idle' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" /> Full Exam Simulation Environment
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Simulated Mock Examination
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed">
                Take a strict, real-time mock exam with timed sections (Section A: Short/MCQ, Section B: 5M Analytical, Section C: 10M Comprehensive). Receive a diagnostic readiness report right after.
              </p>
            </div>
          </div>

          {/* Setup Card */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Configure Mock Paper
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  Subject / Syllabus
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  Exam Pattern / Target
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="University Semester Final (30 Marks Fast-Track)">University Semester Final (30 Marks Fast-Track)</option>
                  <option value="Midterm Sprint (20 Marks)">Midterm Sprint (20 Marks)</option>
                  <option value="Competitive MCQ & Derivation Standard">Competitive MCQ & Derivation Standard</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Exam Rules:
                </div>
                <p>• 3 Sections: Section A (MCQs/Short), Section B (5M), Section C (10M).</p>
                <p>• Automatic timer countdown with diagnostic mistake classification at end.</p>
              </div>

              <button
                onClick={handleStartExamGeneration}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Sectional Paper with AI...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Start Mock Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Running Exam Screen */}
      {examState === 'running' && exam && currentSection && currentQuestion && (
        <div className="space-y-6">
          {/* Header with Title & Live Timer */}
          <div className="bg-slate-900 text-white p-4 md:px-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg sticky top-4 z-20">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                {exam.subject}
              </span>
              <h2 className="text-base font-bold truncate max-w-md">{exam.examTitle}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
                <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                <span className={`font-mono text-sm font-bold ${secondsRemaining < 300 ? 'text-rose-400' : 'text-white'}`}>
                  {formatTimer(secondsRemaining)}
                </span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Section Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {exam.sections.map((sec, sIdx) => (
              <button
                key={sIdx}
                onClick={() => {
                  setCurrentSectionIdx(sIdx);
                  setCurrentQuestionIdx(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  currentSectionIdx === sIdx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {sec.name} ({sec.totalMarks}M)
              </button>
            ))}
          </div>

          {/* Question Interface & Navigation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Question (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
                    Question {currentQuestionIdx + 1} of {currentSection.questions.length}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {currentQuestion.marks} Marks
                  </span>
                </div>

                <button
                  onClick={() => {
                    setFlaggedQuestions(prev => ({
                      ...prev,
                      [currentQuestion.id]: !prev[currentQuestion.id]
                    }));
                  }}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    flaggedQuestions[currentQuestion.id]
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged for Review' : 'Flag'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.questionText}
              </div>

              {/* Options (MCQ) or Textarea (Subjective) */}
              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setMcqAnswers(prev => ({ ...prev, [currentQuestion.id]: oIdx }))}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        mcqAnswers[currentQuestion.id] === oIdx
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        mcqAnswers[currentQuestion.id] === oIdx ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {mcqAnswers[currentQuestion.id] === oIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">
                    Your Written Response ({currentQuestion.marks} Mark Standard)
                  </label>
                  <textarea
                    value={writtenAnswers[currentQuestion.id] || ''}
                    onChange={(e) => setWrittenAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    placeholder="Type your structured exam answer here..."
                    rows={8}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  onClick={() => {
                    if (currentQuestionIdx < currentSection.questions.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else if (currentSectionIdx < exam.sections.length - 1) {
                      setCurrentSectionIdx(prev => prev + 1);
                      setCurrentQuestionIdx(0);
                    }
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer shadow-md"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Question Navigation Palette (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {currentSection.questions.map((q, idx) => {
                  const isAnswered = q.options 
                    ? mcqAnswers[q.id] !== undefined 
                    : (writtenAnswers[q.id]?.length || 0) > 0;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = currentQuestionIdx === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-9 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                        isCurrent
                          ? 'ring-2 ring-blue-500 scale-105'
                          : ''
                      } ${
                        isFlagged
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-600" /> <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-200" /> <span>Flagged for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800" /> <span>Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Diagnostic Scorecard */}
      {examState === 'submitted' && exam && (
        <div className="space-y-6">
          {(() => {
            const { score, total, percentage, topicWeaknesses } = computeScore();
            return (
              <>
                {/* Scorecard Hero Banner */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold border border-white/20">
                        Exam Complete • Diagnostic Scorecard
                      </span>
                      <h2 className="text-3xl font-extrabold">{exam.examTitle}</h2>
                      <p className="text-emerald-100 text-xs">
                        Evaluation complete. Nexa analyzed your accuracy across MCQ and subjective answers.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                      <div className="text-center">
                        <div className="text-3xl font-black">{score} / {total}</div>
                        <div className="text-[11px] uppercase tracking-wider text-emerald-200">Total Marks</div>
                      </div>
                      <div className="h-10 w-px bg-white/20" />
                      <div className="text-center">
                        <div className="text-3xl font-black">{percentage}%</div>
                        <div className="text-[11px] uppercase tracking-wider text-emerald-200">Readiness Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weakness Targeting Alert */}
                {topicWeaknesses.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Identified Weakness Areas in this Mock
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      You lost marks on the following topics. Click below to immediately trigger an 8-Part Nexa Coach masterclass or 5/10M practice drill.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {topicWeaknesses.map((tw, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-slate-800 text-xs shadow-sm">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{tw}</span>
                          {onNavigateToNexa && (
                            <button
                              onClick={() => onNavigateToNexa(tw)}
                              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                            >
                              Teach <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section-by-Section Detailed Review */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Full Paper Solutions & Model Explanations
                  </h3>

                  <div className="space-y-4">
                    {exam.sections.flatMap(s => s.questions).map((q, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            Q{idx + 1} ({q.marks} Marks) • {q.topicTag}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {q.questionText}
                        </p>

                        {q.options && q.correctOptionIndex !== undefined ? (
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-bold text-emerald-600">Correct Option: </span>
                            {String.fromCharCode(65 + q.correctOptionIndex)}. {q.options[q.correctOptionIndex]}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-blue-600">Ideal Marking Guide: </span>
                            {q.modelAnswer || q.explanation}
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          💡 Nexa Note: {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setExamState('idle')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow"
                    >
                      Back to Simulator Hub
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
