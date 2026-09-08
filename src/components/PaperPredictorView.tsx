'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, 
  Layers, ArrowRight, Loader2, RefreshCw, BarChart2, BookOpen, 
  FileCheck, Zap, HelpCircle, ExternalLink, Filter, Search, Printer, Copy, Check, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuaranteedQuestion {
  id: string;
  question: string;
  frequency: string;
  probability: number;
  category: string;
  unit: number;
  whyGuaranteed: string;
  examinerTip: string;
  priority?: 'high' | 'less';
}

interface UnitHeatmapItem {
  unit: number;
  unitTitle: string;
  appearanceCount: number;
  percentage: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

interface PaperAnalysisData {
  subject: string;
  papersAnalyzed: number;
  confidenceScore: number;
  highPriorityCount?: number;
  lessPriorityCount?: number;
  totalQuestionsCount?: number;
  unitHeatmap: UnitHeatmapItem[];
  guaranteedQuestions: GuaranteedQuestion[];
  highPriorityQuestions?: GuaranteedQuestion[];
  lessPriorityQuestions?: GuaranteedQuestion[];
  highProbabilityTopics: Array<{ topic: string; frequency: string; expectedMarks: number }>;
  repeatedQuestions: string[];
}

interface PaperPredictorViewProps {
  initialSubject?: string;
  onNavigateToPractice?: (topic: string, question: string) => void;
  onNavigateToNexa?: (topic: string) => void;
}

export default function PaperPredictorView({
  initialSubject = '',
  onNavigateToPractice,
  onNavigateToNexa
}: PaperPredictorViewProps) {
  const [subject, setSubject] = useState(initialSubject || '');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PaperAnalysisData | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high-priority' | 'less-priority' | '10-mark' | '7-mark' | '3-mark'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPapersText, setCustomPapersText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (initialSubject && !subject) setSubject(initialSubject);
  }, [initialSubject]);

  const handleAnalyzePapers = async (overrideSubject?: string) => {
    const targetSub = (overrideSubject || subject).trim();
    if (!targetSub) return;

    setLoading(true);
    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const paperTexts = customPapersText.trim() 
        ? [customPapersText.trim()] 
        : [`${targetSub} Past 5 Semester Board Examination Question Papers`];

      const res = await fetch('/api/ai/paper-analysis', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subject: targetSub,
          paperTexts
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to run paper analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // 50+ Questions Filter Logic
  const allQuestions = analysis?.guaranteedQuestions || [];
  const highPriorityQuestions = allQuestions.filter(q => q.priority === 'high' || q.probability >= 88);
  const lessPriorityQuestions = allQuestions.filter(q => q.priority === 'less' || q.probability < 88);

  const filteredQuestions = allQuestions.filter(q => {
    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.question.toLowerCase().includes(query) ||
                        q.category.toLowerCase().includes(query) ||
                        q.whyGuaranteed?.toLowerCase().includes(query) ||
                        q.examinerTip?.toLowerCase().includes(query);
      if (!matchText) return false;
    }

    // 2. Category & Priority Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high-priority') return q.priority === 'high' || q.probability >= 88;
    if (activeFilter === 'less-priority') return q.priority === 'less' || q.probability < 88;
    if (activeFilter === '10-mark') return q.category.includes('10-Mark');
    if (activeFilter === '7-mark') return q.category.includes('7-Mark');
    if (activeFilter === '3-mark') return q.category.includes('3-Mark') || q.category.includes('5-Mark');
    return true;
  });

  const handleCopyAllQuestions = () => {
    if (!allQuestions.length) return;

    let text = `# ${analysis?.subject || subject} — 5-Year Predicted 50+ Question Bank\n`;
    text += `Confidence Score: ${analysis?.confidenceScore || 94}% | Total Questions: ${allQuestions.length}\n\n`;
    
    text += `==========================================================\n`;
    text += `🔥 20 HIGH-PRIORITY QUESTIONS (90-100% Guaranteed Probability)\n`;
    text += `==========================================================\n\n`;
    highPriorityQuestions.forEach((q, idx) => {
      text += `${idx + 1}. [${q.category} | Unit ${q.unit}] ${q.question}\n`;
      text += `   Frequency: ${q.frequency} | Probability: ${q.probability}%\n`;
      text += `   Why Guaranteed: ${q.whyGuaranteed}\n`;
      text += `   Examiner Tip: ${q.examinerTip}\n\n`;
    });

    text += `==========================================================\n`;
    text += `⚡ 30 LESS-PRIORITY QUESTIONS (60-80% Supplementary Probability)\n`;
    text += `==========================================================\n\n`;
    lessPriorityQuestions.forEach((q, idx) => {
      text += `${idx + 1}. [${q.category} | Unit ${q.unit}] ${q.question}\n`;
      text += `   Frequency: ${q.frequency} | Probability: ${q.probability}%\n`;
      text += `   Why Guaranteed: ${q.whyGuaranteed}\n`;
      text += `   Examiner Tip: ${q.examinerTip}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  const handlePrintQuestionBank = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-14 text-white">
      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <TrendingUp className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  5-Year University Paper Predictor
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/30 border border-purple-400/40 text-purple-200">
                  50+ QUESTIONS ENGINE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  20 High + 30 Less Priority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
                Statistically predicts 50+ exam questions from past university papers: 20 high-priority guaranteed derivations &amp; 30 secondary questions for complete exam mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
            >
              {isCustomMode ? 'Use Automatic Past Papers' : '✍️ Paste Custom Papers'}
            </button>
          </div>
        </div>

        {/* Search Bar / Input Controls */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your exam subject (e.g. Operating Systems, Data Structures, DBMS, Physics)..."
              className="flex-1 px-4 py-3 bg-slate-900/90 border border-purple-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400 outline-none shadow-inner"
            />
            <button
              onClick={() => handleAnalyzePapers()}
              disabled={loading || !subject.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating 50+ Predicted Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Predict 50+ Exam Questions</span>
                </>
              )}
            </button>
          </div>

          {/* Custom Papers Collapsible Textarea */}
          {isCustomMode && (
            <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-purple-500/30 space-y-2 animate-fadeIn">
              <label className="block text-[11px] font-bold text-purple-300 uppercase">
                Paste Previous Question Paper Questions or Transcripts (Optional):
              </label>
              <textarea
                value={customPapersText}
                onChange={(e) => setCustomPapersText(e.target.value)}
                placeholder="Paste previous questions from Nov 2022, May 2023, Nov 2023, etc... ScholarMate AI will cluster them and predict frequency."
                rows={4}
                className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Metric Cards (Highlighting 50+ Questions breakdown) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Historical Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-400">{analysis.confidenceScore}%</span>
                <span className="text-xs text-slate-400">Match Accuracy</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Calculated across {analysis.papersAnalyzed} past university cycles.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">Total Questions Generated</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{allQuestions.length}</span>
                <span className="text-xs text-purple-300 font-bold">50+ Questions Ready</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                20 High-Priority + 30 Less-Priority.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> High-Priority Pool
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">{highPriorityQuestions.length}</span>
                <span className="text-xs text-amber-300 font-bold">90-100% Probability</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Compulsory 10M &amp; 7M core questions.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">Less-Priority Pool</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-300">{lessPriorityQuestions.length}</span>
                <span className="text-xs text-cyan-200 font-bold">60-80% Probability</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                3M definitions &amp; supplementary questions.
              </p>
            </div>
          </div>

          {/* Unit Weightage Heatmap */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Unit-by-Unit Examination Marks Heatmap</h3>
              </div>
              <span className="text-xs text-slate-400">5-Session Weightage Distribution</span>
            </div>

            <div className="space-y-3 pt-2">
              {analysis.unitHeatmap?.map((item) => (
                <div key={item.unit} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.unitTitle}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                        item.riskLevel === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.riskLevel === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.riskLevel} Frequency
                      </span>
                    </div>
                    <span className="font-black text-purple-300">{item.percentage}% of marks</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage * 2.8}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        item.riskLevel === 'critical'
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                          : item.riskLevel === 'high'
                          ? 'bg-gradient-to-r from-amber-500 to-purple-500'
                          : 'bg-gradient-to-r from-purple-500 to-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 50+ Questions Master Bank */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 space-y-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>50+ Predicted Examination Questions</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Showing {filteredQuestions.length} of {allQuestions.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Structured into 20 High-Priority (Guaranteed Blueprint) and 30 Less-Priority (Supplementary) questions.
                </p>
              </div>

              {/* Action Buttons (Copy & Print) */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyAllQuestions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{copiedAll ? '50 Questions Copied!' : 'Copy 50 Questions'}</span>
                </button>

                <button
                  onClick={handlePrintQuestionBank}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print Question Bank</span>
                </button>
              </div>
            </div>

            {/* Filter Controls & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
                {[
                  { id: 'all', label: `All (${allQuestions.length})` },
                  { id: 'high-priority', label: `🔥 20 High Priority` },
                  { id: 'less-priority', label: `⚡ 30 Less Priority` },
                  { id: '10-mark', label: '10-Mark' },
                  { id: '7-mark', label: '7-Mark' },
                  { id: '3-mark', label: '3M & 5M' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === tab.id
                        ? tab.id === 'high-priority'
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : tab.id === 'less-priority'
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                          : 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Keyword Search Input */}
              <div className="relative flex items-center min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 50+ questions by keyword..."
                  className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredQuestions.map((q, idx) => {
                const isHigh = q.priority === 'high' || q.probability >= 88;
                return (
                  <div
                    key={q.id || `q_${idx}`}
                    className={`p-5 rounded-2xl transition-all flex flex-col justify-between space-y-4 shadow-md ${
                      isHigh
                        ? 'bg-gradient-to-br from-slate-900 via-[#171a2e] to-slate-900 border border-amber-500/30 hover:border-amber-400/60 shadow-amber-500/5'
                        : 'bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {isHigh ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-400" /> High Priority
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase">
                              Less Priority
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Unit {q.unit}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {q.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            isHigh 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {q.probability}% Chance
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {q.question}
                      </h4>

                      <p className="text-[11px] text-slate-400 italic">
                        🎯 <strong>Why Included:</strong> {q.whyGuaranteed}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-200/90 leading-relaxed">
                        💡 <strong>Examiner Tip:</strong> {q.examinerTip}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => {
                          if (onNavigateToPractice) onNavigateToPractice(subject, q.question);
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" /> Practice in Arena
                      </button>
                      <button
                        onClick={() => {
                          if (onNavigateToNexa) onNavigateToNexa(q.question);
                        }}
                        className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ask Nexa</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No questions found matching your filter criteria. Try selecting "All Questions" or clearing your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial Empty State Banner */}
      {!analysis && !loading && (
        <div className="p-8 rounded-3xl border border-dashed border-white/15 bg-slate-900/60 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-purple-400 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white">No Exam Paper Analysis Loaded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Type your subject name above and click <strong>"Predict 50+ Exam Questions"</strong> to generate 20 high-priority and 30 less-priority exam questions with unit heatmaps.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Operating Systems', 'Data Structures & Algorithms', 'Database Management Systems', 'Computer Networks'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSubject(s);
                  handleAnalyzePapers(s);
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                + Try {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
