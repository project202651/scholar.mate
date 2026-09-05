'use client';

import React, { useState } from 'react';
import { 
  Flame, X, Clock, AlertTriangle, CheckCircle, Sparkles, RefreshCw, 
  ArrowRight, ShieldAlert, Zap, FileText, Ban 
} from 'lucide-react';

interface EmergencyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartEmergencySprint?: (topic: string) => void;
}

interface SurvivalPlan {
  subject: string;
  hoursRemaining: number;
  strategySummary: string;
  hourByHourPlan: Array<{
    hourSlot: string;
    topic: string;
    actionType: 'Mastery' | 'Practice' | 'Revision' | 'Sleep/Break';
    instructions: string;
  }>;
  guaranteedTopics: Array<{
    topic: string;
    expectedMarks: number;
    whyGuaranteed: string;
  }>;
  formulaCheatSheet: string[];
  doNotWasteTimeOn: string[];
}

export default function EmergencyModeModal({
  isOpen,
  onClose,
  onStartEmergencySprint
}: EmergencyModeModalProps) {
  const [subject, setSubject] = useState('Operating Systems');
  const [hoursLeft, setHoursLeft] = useState<number>(24);
  const [targetGoal, setTargetGoal] = useState<'Pass (40-50%)' | 'High Yield (70%+)' | 'Maximum Coverage'>('High Yield (70%+)');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<SurvivalPlan | null>(null);

  if (!isOpen) return null;

  const handleGenerateSurvivalPlan = async () => {
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch('/api/ai/survival', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          hoursRemaining: hoursLeft,
          weakTopics: ['Paging Algorithms', 'Deadlocks', 'File Allocation Table'],
          syllabusOverview: 'Process Management, CPU Scheduling, Synchronization, Memory Management, Storage'
        })
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-rose-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative text-white">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-orange-700 p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 animate-pulse">
              <Flame className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">24-Hour Emergency Mode</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/30 border border-white/20 text-rose-100">
                  SURVIVAL SPRINT
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Exam tomorrow? ScholarMate discards low-yield topics and builds an aggressive 80/20 sprint plan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Config Controls */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Exam Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="e.g. Operating Systems"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Hours Until Exam
                </label>
                <div className="flex gap-2">
                  {[12, 24, 36].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setHoursLeft(hrs)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hoursLeft === hrs
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Survival Target
                </label>
                <select
                  value={targetGoal}
                  onChange={(e: any) => setTargetGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Pass (40-50%)">Guaranteed Pass (40-50%)</option>
                  <option value="High Yield (70%+)">High Yield (70%+ Score)</option>
                  <option value="Maximum Coverage">Maximum Aggressive Coverage</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateSurvivalPlan}
              disabled={loading || !subject.trim()}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing High-Yield Survival Blueprint...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Generate Emergency Survival Plan ({hoursLeft} Hours)</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Plan Output */}
          {plan && (
            <div className="space-y-6">
              {/* Strategy Alert */}
              <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-rose-300">Executive Survival Strategy</div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {plan.strategySummary}
                  </p>
                </div>
              </div>

              {/* Top Guaranteed Topics */}
              {plan.guaranteedTopics && (
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-300 tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Top High-Yield Guaranteed Questions (80/20 Pareto Rule)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {plan.guaranteedTopics.map((gt, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{gt.topic}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            ~{gt.expectedMarks} Marks
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {gt.whyGuaranteed}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hour by Hour Schedule */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-300 tracking-wider">
                  <Clock className="w-4 h-4" />
                  Hour-by-Hour Blitz Timetable
                </div>

                <div className="space-y-2">
                  {plan.hourByHourPlan?.map((slot, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-black text-rose-400 shrink-0 w-24">
                          {slot.hourSlot}
                        </span>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{slot.topic}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {slot.actionType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {slot.instructions}
                          </p>
                        </div>
                      </div>

                      {onStartEmergencySprint && slot.actionType !== 'Sleep/Break' && (
                        <button
                          onClick={() => {
                            onStartEmergencySprint(slot.topic);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                        >
                          <span>Start Block</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2-Column: Formula Cheat Sheet vs Do Not Waste Time On */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cheat Sheet */}
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Must-Memorize Formulae & Concepts
                  </div>
                  <ul className="space-y-1">
                    {plan.formulaCheatSheet?.map((f, idx) => (
                      <li key={idx} className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-700/60 font-mono">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Anti-List */}
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <div className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5" /> Do Not Waste Time On (Skip)
                  </div>
                  <ul className="space-y-1">
                    {plan.doNotWasteTimeOn?.map((d, idx) => (
                      <li key={idx} className="text-xs text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-700/60 line-through">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
