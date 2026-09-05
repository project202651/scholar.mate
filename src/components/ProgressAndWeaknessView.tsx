'use client';

import React, { useState } from 'react';
import { 
  BarChart3, ShieldAlert, CheckCircle2, Flame, Brain, Target, 
  ArrowRight, RefreshCw, AlertTriangle, Sparkles, BookOpen, Clock, Zap, HelpCircle
} from 'lucide-react';

interface ProgressAndWeaknessViewProps {
  onNavigateToNexa?: (topic: string) => void;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToFocus?: (topic: string) => void;
}

interface WeaknessItem {
  id: string;
  topic: string;
  subject: string;
  taxonomyType: 'Conceptual Gap' | 'Memory Failure' | 'Exam Trap' | 'Calculation Slip' | 'Time Pressure';
  severity: 'High' | 'Medium' | 'Low';
  lastEncountered: string;
  description: string;
  recommendedAction: string;
}

export default function ProgressAndWeaknessView({
  onNavigateToNexa,
  onNavigateToPractice,
  onNavigateToFocus
}: ProgressAndWeaknessViewProps) {
  // 6 Metrics with Blueprint Weightings
  const [metrics, setMetrics] = useState({
    syllabusCoverage: 72,      // 25% weight
    practiceAccuracy: 68,      // 20% weight
    mockExamAverage: 75,       // 20% weight
    revisionFreshness: 60,     // 15% weight
    weaknessClearance: 55,     // 10% weight
    timeInvestment: 80         // 10% weight
  });

  const [weaknesses, setWeaknesses] = useState<WeaknessItem[]>([
    {
      id: 'w1',
      topic: 'Deadlock Banker’s Algorithm Safety Check',
      subject: 'Operating Systems',
      taxonomyType: 'Conceptual Gap',
      severity: 'High',
      lastEncountered: 'Mock Exam #2 (Section C)',
      description: 'Struggles with calculating Need Matrix (Max - Allocation) and iterating through Work + Allocation vectors.',
      recommendedAction: '8-Part Nexa masterclass with step-by-step table derivation'
    },
    {
      id: 'w2',
      topic: 'Eigenvalue Cayley-Hamilton Theorem',
      subject: 'Engineering Mathematics',
      taxonomyType: 'Memory Failure',
      severity: 'High',
      lastEncountered: '5-Mark Practice Drills',
      description: 'Frequently forgets inverse matrix computation formula A^-1 = -1/|A| * adj(A).',
      recommendedAction: 'Spaced repetition flashcards drill (7-day interval)'
    },
    {
      id: 'w3',
      topic: 'TCP Congestion Window Additive Increase / Multiplicative Decrease (AIMD)',
      subject: 'Computer Networks',
      taxonomyType: 'Exam Trap',
      severity: 'Medium',
      lastEncountered: 'Practice Question 10M',
      description: 'Confused threshold reset on 3 Dup ACKs vs Timeout drop to 1 MSS.',
      recommendedAction: 'Examiner Traps review with visual state diagram'
    },
    {
      id: 'w4',
      topic: 'B-Tree Node Splitting on Insert',
      subject: 'Data Structures',
      taxonomyType: 'Calculation Slip',
      severity: 'Medium',
      lastEncountered: 'Quiz Unit 3',
      description: 'Minor index arithmetic error when promoting median key to parent node.',
      recommendedAction: 'Targeted 10-Mark step-by-step practice'
    }
  ]);

  // Compute 6-Metric Weighted Score
  const computeReadinessScore = () => {
    const weighted = 
      metrics.syllabusCoverage * 0.25 +
      metrics.practiceAccuracy * 0.20 +
      metrics.mockExamAverage * 0.20 +
      metrics.revisionFreshness * 0.15 +
      metrics.weaknessClearance * 0.10 +
      metrics.timeInvestment * 0.10;
    return Math.round(weighted);
  };

  const readinessScore = computeReadinessScore();

  const getReadinessTier = (score: number) => {
    if (score >= 85) return { label: '🎯 Exam Ready (90%+ Predicted)', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (score >= 70) return { label: '⚡ Building Mastery (70-85%)', color: 'text-blue-500', bg: 'bg-blue-500' };
    if (score >= 50) return { label: '⚠️ Needs Reinforcement (50-70%)', color: 'text-amber-500', bg: 'bg-amber-500' };
    return { label: '🚨 Critical Danger Zone (<50%)', color: 'text-rose-500', bg: 'bg-rose-500' };
  };

  const tier = getReadinessTier(readinessScore);

  const getTaxonomyBadge = (type: WeaknessItem['taxonomyType']) => {
    switch (type) {
      case 'Conceptual Gap':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200';
      case 'Memory Failure':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200';
      case 'Exam Trap':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200';
      case 'Calculation Slip':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200';
      case 'Time Pressure':
        return 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Brain className="w-3.5 h-3.5" /> 6-Metric Exam Readiness Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Exam Diagnostic & Weakness Hunter
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              ScholarMate continuously evaluates your syllabus coverage, mock scores, flashcard retention, and mistakes to calculate your exact readiness probability.
            </p>
          </div>

          {/* Readiness Gauge Hero */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-6 shadow-2xl">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-slate-700"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * readinessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{readinessScore}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Ready</span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</div>
              <div className={`text-sm font-bold ${tier.color}`}>{tier.label}</div>
              <div className="text-[11px] text-slate-400">
                {weaknesses.length} critical weaknesses flagged for clearance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Metric Diagnostic Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Syllabus Coverage', val: metrics.syllabusCoverage, weight: '25%', color: 'from-blue-500 to-cyan-500' },
          { label: 'Practice Accuracy', val: metrics.practiceAccuracy, weight: '20%', color: 'from-emerald-500 to-teal-500' },
          { label: 'Mock Exam Avg', val: metrics.mockExamAverage, weight: '20%', color: 'from-violet-500 to-purple-500' },
          { label: 'Revision Freshness', val: metrics.revisionFreshness, weight: '15%', color: 'from-amber-500 to-orange-500' },
          { label: 'Weakness Cleared', val: metrics.weaknessClearance, weight: '10%', color: 'from-rose-500 to-pink-500' },
          { label: 'Study Investment', val: metrics.timeInvestment, weight: '10%', color: 'from-indigo-500 to-blue-600' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400 truncate">{item.label}</span>
              <span className="text-[10px] font-bold text-slate-400">({item.weight})</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {item.val}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weakness Hunter & Mistake Taxonomy Hub */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Weakness Hunter & Mistake Taxonomy
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Targeted remediation based on error classification: Conceptual Gaps, Memory Failures, Exam Traps, and Calculation Slips.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 rounded-full border border-rose-200 self-start">
            {weaknesses.length} Weaknesses Requiring Attention
          </span>
        </div>

        {/* Weakness Cards List */}
        <div className="space-y-3.5">
          {weaknesses.map((w) => (
            <div 
              key={w.id} 
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTaxonomyBadge(w.taxonomyType)}`}>
                    {w.taxonomyType}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{w.subject}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">• {w.topic}</span>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  Source: {w.lastEncountered}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {w.description}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Fix Plan: {w.recommendedAction}</span>
                </div>

                {/* Direct Action Remediation Buttons */}
                <div className="flex items-center gap-2">
                  {onNavigateToNexa && (
                    <button
                      onClick={() => onNavigateToNexa(w.topic)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" /> Teach Me
                    </button>
                  )}

                  {onNavigateToPractice && (
                    <button
                      onClick={() => onNavigateToPractice(w.topic)}
                      className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> 5/10M Drill
                    </button>
                  )}

                  {onNavigateToFocus && (
                    <button
                      onClick={() => onNavigateToFocus(w.topic)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> Focus Block
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
