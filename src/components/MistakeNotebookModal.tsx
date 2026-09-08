'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookMarked, X, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, 
  Sparkles, Trash2, Filter, Target, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MistakeEntry {
  id: string;
  topic: string;
  subject: string;
  question: string;
  marks: number;
  missingKeywords: string[];
  examinerTrap: string;
  scoreObtained: number;
  dateLogged: string;
}

interface MistakeNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReTestQuestion: (topic: string, subject: string) => void;
}

export default function MistakeNotebookModal({
  isOpen,
  onClose,
  onReTestQuestion
}: MistakeNotebookModalProps) {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([
    {
      id: 'm1',
      topic: 'Banker\'s Algorithm for Deadlock Avoidance',
      subject: 'Operating Systems',
      question: 'Explain the safety verification algorithm and calculate Need Matrix for 5 processes.',
      marks: 10,
      missingKeywords: ['Work vector initialization', 'Need <= Available check', 'Allocation release'],
      examinerTrap: 'Students often forget to update Available = Available + Allocation[i] after marking a process Finish[i] = true.',
      scoreObtained: 6,
      dateLogged: '2 days ago'
    },
    {
      id: 'm2',
      topic: 'AVL Tree Rotations (LL, RR, LR, RL) & B-Trees',
      subject: 'Data Structures & Algorithms',
      question: 'Perform double rotation (LR) after inserting key 45 into an unbalanced AVL subtree.',
      marks: 7,
      missingKeywords: ['Balance factor recalculation', 'Pivot node selection', 'Left rotation on child followed by Right rotation on root'],
      examinerTrap: 'Confusing LR rotation with RL rotation order; remember LR means Left rotate the Left child first!',
      scoreObtained: 3,
      dateLogged: 'Yesterday'
    },
    {
      id: 'm3',
      topic: 'First-Order Logic & Resolution Refutation',
      subject: 'Artificial Intelligence & ML',
      question: 'Convert the knowledge base into Conjunctive Normal Form (CNF) and apply resolution proof.',
      marks: 3,
      missingKeywords: ['Skolemization of existential quantifiers', 'Unification algorithm'],
      examinerTrap: 'Omitting standard variable renaming before unification causes accidental circular bindings.',
      scoreObtained: 1,
      dateLogged: 'Today'
    }
  ]);

  const [filterSubject, setFilterSubject] = useState<string>('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('scholarmate_mistake_notebook');
      if (stored) {
        setMistakes(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleResolveMistake = (id: string) => {
    const updated = mistakes.filter(m => m.id !== id);
    setMistakes(updated);
    try {
      localStorage.setItem('scholarmate_mistake_notebook', JSON.stringify(updated));
    } catch (e) {}
  };

  if (!isOpen) return null;

  const filteredMistakes = filterSubject === 'all' 
    ? mistakes 
    : mistakes.filter(m => m.subject.toLowerCase().includes(filterSubject.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Mistake Notebook & Error Vault"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] text-slate-100 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-bold text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Weakness Repair Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookMarked className="h-6 w-6 text-[#54d6c7]" />
              <span>Mistake Notebook</span>
            </h2>
            <p className="text-xs text-slate-400">
              Review lost marks, missing keywords, and examiner traps before test day.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Mistake Notebook"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 py-3 shrink-0 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Filter:</span>
          {['all', 'Operating Systems', 'Data Structures', 'Artificial Intelligence'].map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterSubject === sub
                  ? 'bg-[#54d6c7] text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>

        {/* Mistake List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {filteredMistakes.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-slate-900/50 space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Unresolved Mistakes Found!</h3>
              <p className="text-xs text-slate-400">
                You have resolved all flagged exam questions for this subject.
              </p>
            </div>
          ) : (
            filteredMistakes.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-rose-500/20 bg-gradient-to-br from-[#17253a]/80 to-[#111c2e] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.marks}-Mark Lost ({item.scoreObtained}/{item.marks})
                      </span>
                      <span className="text-xs font-bold text-white">{item.topic}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-medium">&ldquo;{item.question}&rdquo;</p>
                  </div>

                  <span className="text-[10px] text-slate-500 shrink-0">{item.dateLogged}</span>
                </div>

                {/* Missing Keywords */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Missing Key Points:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        • {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Examiner Trap */}
                <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/90 text-[11px] text-slate-300 space-y-0.5">
                  <span className="text-[10px] uppercase font-black text-[#54d6c7] block">Examiner Trap Advice:</span>
                  <p>{item.examinerTrap}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleResolveMistake(item.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Resolved</span>
                  </button>

                  <button
                    onClick={() => {
                      onReTestQuestion(item.topic, item.subject);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#70d6a8] hover:opacity-95 text-slate-950 font-black px-4 py-2 text-xs shadow-md shadow-[#54d6c7]/20 transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Re-Test Question Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
