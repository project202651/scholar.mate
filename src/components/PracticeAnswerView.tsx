'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, Sparkles, CheckSquare, AlertCircle, Edit3, Send, RefreshCw, 
  HelpCircle, ChevronRight, Award, Zap, BookOpen, CheckCircle, XCircle 
} from 'lucide-react';

interface PracticeAnswerViewProps {
  initialTopic?: string;
  initialSubject?: string;
}

interface ExaminerChecklistItem {
  criterion: string;
  marksAllocated: number;
  description: string;
}

interface MarkAnswerData {
  topic: string;
  subject: string;
  marks: number;
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  examinerChecklist: ExaminerChecklistItem[];
  commonMistakes: string[];
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

export default function PracticeAnswerView({ initialTopic, initialSubject }: PracticeAnswerViewProps) {
  const [topic, setTopic] = useState(initialTopic || 'Database Normalization (1NF, 2NF, 3NF, BCNF)');
  const [subject, setSubject] = useState(initialSubject || 'Database Management Systems');
  const [marks, setMarks] = useState<number>(10);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerData, setAnswerData] = useState<MarkAnswerData | null>(null);

  // Student Evaluation Sandbox
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleGenerateQuestionAndAnswer = async () => {
    if (!topic.trim()) return;
    setLoadingAnswer(true);
    setAnswerData(null);
    setEvaluation(null);
    setStudentAnswer('');

    try {
      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, marks })
      });
      const data = await res.json();
      if (data.practice) {
        setAnswerData(data.practice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleEvaluateStudentAnswer = async () => {
    if (!answerData || !studentAnswer.trim()) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: answerData.question,
          studentAnswer,
          maxMarks: answerData.marks,
          checklist: answerData.examinerChecklist
        })
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <FileCheck2 className="w-8 h-8 text-violet-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">5/10-Mark Answer Engine</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-400/30 border border-violet-200/40 text-violet-100">
                  Examiner Checklist AI
                </span>
              </div>
              <p className="text-violet-100 text-sm mt-0.5">
                Generate high-scoring exam model answers and get your own answers graded against official marking schemes.
              </p>
            </div>
          </div>

          {/* Mark Selector Pill */}
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            {[1, 2, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => setMarks(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  marks === m
                    ? 'bg-white text-violet-900 shadow-md scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {m} Mark{m > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g. Operating Systems)"
            className="md:w-1/4 px-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-xs text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic to practice (e.g., Page Replacement Algorithms, Merge Sort, Transformer Architecture)"
            className="flex-1 px-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-sm text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          />
          <button
            onClick={handleGenerateQuestionAndAnswer}
            disabled={loadingAnswer || !topic.trim()}
            className="px-6 py-2.5 bg-white text-violet-900 hover:bg-violet-50 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loadingAnswer ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-violet-700" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>Generate Model Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {answerData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Question & Model Answer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Exam Question Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  {answerData.subject} • Official Question Style
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                  {answerData.marks} Marks
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {answerData.question}
              </h2>
            </div>

            {/* Model Answer Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                  <Award className="w-5 h-5 text-amber-500" />
                  Ideal Model Answer (100% Score Standard)
                </h3>
              </div>

              {/* Answer Content */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="prose dark:prose-invert text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                  {answerData.idealAnswer}
                </div>
              </div>

              {/* Key Bullet Points */}
              {answerData.keyPoints && answerData.keyPoints.length > 0 && (
                <div className="bg-violet-50/50 dark:bg-violet-950/20 p-4 rounded-xl border border-violet-200/60 dark:border-violet-800/40">
                  <h4 className="text-xs font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-violet-600" />
                    Crucial Keywords & High-Yield Bullets
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {answerData.keyPoints.map((kp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-violet-900 dark:text-violet-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-violet-100 dark:border-slate-800">
                        <span className="font-bold text-violet-600">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Pitfalls */}
              {answerData.commonMistakes && answerData.commonMistakes.length > 0 && (
                <div className="bg-rose-50/60 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-800/40">
                  <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Where Students Lose Marks
                  </h4>
                  <ul className="space-y-1">
                    {answerData.commonMistakes.map((cm, idx) => (
                      <li key={idx} className="text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                        <span className="text-rose-500 font-bold">✗</span>
                        <span>{cm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Examiner Marking Scheme & AI Grader (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Examiner Marking Scheme Checklist */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  Official Examiner Marking Scheme
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                  Total: {answerData.marks}M
                </span>
              </div>

              <div className="space-y-2">
                {answerData.examinerChecklist?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.criterion}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-black px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-md">
                      +{item.marksAllocated}M
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Answer & AI Evaluator Sandbox */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <Edit3 className="w-4 h-4 text-violet-500" />
                  Test Yourself: Write & AI Grade
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write your handwritten or typed answer below. Nexa will grade it against the examiner checklist and identify your missing keywords.
              </p>

              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your exam answer here. Include your definitions, bullet points, equations, and explanations..."
                rows={7}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none font-sans"
              />

              <button
                onClick={handleEvaluateStudentAnswer}
                disabled={evaluating || !studentAnswer.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Grading with Examiner AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Grade My Answer</span>
                  </>
                )}
              </button>

              {/* Evaluation Report */}
              {evaluation && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-violet-200 dark:border-violet-900/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Examiner Scorecard
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-violet-600 dark:text-violet-400">
                        {evaluation.scoreObtained} / {evaluation.maxMarks}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold">
                        {evaluation.percentage}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {evaluation.feedback}
                  </p>

                  {/* Criteria Breakdown */}
                  <div className="space-y-1.5">
                    {evaluation.checklistMatches?.map((cm, cIdx) => (
                      <div key={cIdx} className="flex items-start justify-between text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-start gap-2">
                          {cm.awarded ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <span className="text-slate-800 dark:text-slate-200">{cm.criterion}</span>
                        </div>
                        <span className={`font-bold shrink-0 text-[11px] ${cm.awarded ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {cm.marksAwarded}M
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Missing Keywords */}
                  {evaluation.missingKeywords && evaluation.missingKeywords.length > 0 && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/40 text-[11px]">
                      <span className="font-bold text-amber-800 dark:text-amber-300">Missing Key Terms: </span>
                      <span className="text-amber-900 dark:text-amber-200">
                        {evaluation.missingKeywords.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Pro-tip */}
                  {evaluation.improvementTip && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>To get full marks:</strong> {evaluation.improvementTip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-950/60 rounded-2xl flex items-center justify-center mx-auto text-violet-600 dark:text-violet-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ready to Master {marks}-Mark Questions?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your marks target and click <strong>Generate Model Answer</strong> above to see full answers, marking schemes, and test your own writing against the AI examiner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
