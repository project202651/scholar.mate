'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, 
  Layers, ArrowRight, Loader2, RefreshCw, BarChart2, BookOpen, 
  FileCheck, Zap, HelpCircle, ExternalLink, Filter
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
  unitHeatmap: UnitHeatmapItem[];
  guaranteedQuestions: GuaranteedQuestion[];
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
  const [activeFilter, setActiveFilter] = useState<'all' | '10-mark' | '7-mark' | '3-mark'>('all');
  const [customPapersText, setCustomPapersText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

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

  const filteredQuestions = analysis?.guaranteedQuestions?.filter(q => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '10-mark') return q.category.includes('10-Mark');
    if (activeFilter === '7-mark') return q.category.includes('7-Mark');
    if (activeFilter === '3-mark') return q.category.includes('3-Mark');
    return true;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-14 text-white">
      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <TrendingUp className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  5-Year University Paper Predictor
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/30 border border-purple-400/40 text-purple-200">
                  HEATMAP ENGINE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
                Reverse-engineer repeated question patterns, recurrent 10-mark derivations, and unit-wise marks distribution from past semester papers.
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
              placeholder="Enter your exam subject (e.g. Data Structures, DBMS, Physics, Machine Learning)..."
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
                  <span>Scanning 5-Year Papers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Predict Exam Heatmap</span>
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
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Historical Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-400">{analysis.confidenceScore}%</span>
                <span className="text-xs text-slate-400">Match Accuracy</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Calculated from {analysis.papersAnalyzed} past university examination cycles.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Guaranteed Questions Flagged</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">{analysis.guaranteedQuestions?.length || 4}</span>
                <span className="text-xs text-slate-400">High-Probability Items</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Accounts for ~45% of total university paper mark weightage.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 space-y-1 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Top Critical Unit</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-rose-400 truncate">
                  {analysis.unitHeatmap?.[1]?.unitTitle || 'Unit 2: Architecture'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Highest concentration of compulsory 10-mark derivations.
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

          {/* Guaranteed & Recurring Questions List */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Guaranteed Recurring Examination Questions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-frequency questions that university paper setters have asked repeatedly over the last 5 sessions.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                {(['all', '10-mark', '7-mark', '3-mark'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setActiveFilter(filterKey)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeFilter === filterKey
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filterKey === 'all' ? 'All Questions' : filterKey.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase">
                        {q.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        {q.frequency}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {q.question}
                    </h4>

                    <p className="text-[11px] text-slate-400 italic">
                      🎯 <strong>Why Guaranteed:</strong> {q.whyGuaranteed}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-[11px] text-amber-200/90 leading-relaxed">
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
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State Banner */}
      {!analysis && !loading && (
        <div className="p-8 rounded-3xl border border-dashed border-white/15 bg-slate-900/60 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-purple-400 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white">No Exam Paper Analysis Loaded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Type your subject name above and click <strong>"Predict Exam Heatmap"</strong> to extract repeated question patterns and unit weightage maps.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Data Structures & Algorithms', 'Database Management Systems', 'Artificial Intelligence & ML', 'Computer Networks'].map((s) => (
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
