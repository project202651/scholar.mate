'use client';

import React, { useState, useEffect } from 'react';
import { 
  Printer, X, Sparkles, Download, BookOpen, AlertTriangle, 
  Zap, FileText, CheckCircle2, Loader2, ArrowRight, Share2, Copy
} from 'lucide-react';

interface FormulaItem {
  name: string;
  formula: string;
  explanation: string;
}

interface DefinitionItem {
  term: string;
  marks: number;
  definition: string;
}

interface DiagramItem {
  title: string;
  diagramAscii: string;
  stages: string[];
  tips: string;
}

interface TrapItem {
  trap: string;
  whatStudentsWrite: string;
  whatExaminersExpect: string;
}

interface DerivationItem {
  title: string;
  steps: string[];
  keyResult: string;
}

interface PocketSheetData {
  subject: string;
  examTitle: string;
  summaryQuote: string;
  formulaSheet: FormulaItem[];
  keyDefinitions: DefinitionItem[];
  coreDiagrams: DiagramItem[];
  examinerTraps: TrapItem[];
  tenMarkDerivations: DerivationItem[];
}

interface PocketRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

export default function PocketRevisionModal({
  isOpen,
  onClose,
  initialSubject = ''
}: PocketRevisionModalProps) {
  const [subject, setSubject] = useState(initialSubject || '');
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<PocketSheetData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSubject && !subject) setSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    if (isOpen && subject && !sheet) {
      handleGenerateSheet();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleGenerateSheet = async () => {
    if (!subject.trim()) return;
    setLoading(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/pocket-sheet', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subject: subject.trim()
        })
      });

      const data = await res.json();
      if (data.sheet) {
        setSheet(data.sheet);
      }
    } catch (err) {
      console.error('Failed to generate pocket sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyText = () => {
    if (!sheet) return;
    const plainText = `ScholarMate 1-Page Pocket Revision Sheet: ${sheet.subject}
${sheet.summaryQuote}

--- FORMULAS ---
${sheet.formulaSheet.map(f => `${f.name}: ${f.formula} (${f.explanation})`).join('\n')}

--- 3-MARK DEFINITIONS ---
${sheet.keyDefinitions.map(d => `${d.term} [${d.marks}M]: ${d.definition}`).join('\n')}

--- EXAMINER TRAPS TO AVOID ---
${sheet.examinerTraps.map(t => `• Trap: ${t.trap}\n  Common Error: ${t.whatStudentsWrite}\n  Correct: ${t.whatExaminersExpect}`).join('\n')}`;

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Print-specific style override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-pocket-sheet, #printable-pocket-sheet * {
            visibility: visible !important;
          }
          #printable-pocket-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 12px !important;
            background: white !important;
            color: #111827 !important;
            font-size: 11px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Exam-Morning Pocket Revision Sheet"
        className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl relative text-white"
      >
        {/* Header - Hidden in Print */}
        <div className="no-print bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 sm:p-6 flex items-center justify-between relative overflow-hidden border-b border-white/10">
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/25 shadow-inner">
              <FileText className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">1-Page Pocket Revision Sheet</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/30 border border-purple-400/30 text-purple-200">
                  EXAM-MORNING A4 CONDENSED
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                Laser-focused formulas, schematics, 3M definitions, and examiner traps formatted for A4 printing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            {sheet && (
              <>
                <button
                  onClick={handleCopyText}
                  title="Copy as plain text"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  title="Print or Save as PDF"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              title="Close Sheet"
              className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-all cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Subject Bar - Hidden in Print */}
        <div className="no-print p-4 bg-slate-800/80 border-b border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-xl">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Exam Subject (e.g. Data Structures, DBMS, Signals & Systems)..."
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={handleGenerateSheet}
              disabled={loading || !subject.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{sheet ? 'Regenerate' : 'Generate Sheet'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:block">
            Tip: Fits on a single double-sided sheet for quick outside-exam-hall revision.
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <span className="text-xs font-bold text-slate-300">
                Synthesizing high-density exam morning cheat-sheet for {subject}...
              </span>
            </div>
          ) : sheet ? (
            /* Printable Document Layout */
            <div 
              id="printable-pocket-sheet"
              className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 print:p-0 print:shadow-none print:rounded-none"
            >
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-wider text-purple-700">
                      ScholarMate 2.0 Academic Exam Series
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.2 rounded font-bold">
                      HIGH-YIELD CHEAT-SHEET
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {sheet.subject}
                  </h1>
                </div>
                <div className="text-left sm:text-right text-xs text-slate-600 font-medium">
                  <span className="block font-bold text-slate-900">{sheet.examTitle}</span>
                  <span className="text-[11px]">Recommended Reading Time: 12 Minutes</span>
                </div>
              </div>

              {/* Quote / Fast Strategy Banner */}
              <div className="p-3 bg-purple-50 border-l-4 border-purple-600 rounded-r-xl text-xs font-semibold text-purple-900 leading-relaxed">
                💡 <strong>Exam Hall Strategy:</strong> {sheet.summaryQuote}
              </div>

              {/* 2-Column Dense Academic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Column 1: Formulas & Derivations */}
                <div className="space-y-5">
                  {/* Formulas */}
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>1. Mandatory Formulas & State Relationships</span>
                    </div>
                    <div className="space-y-2.5">
                      {sheet.formulaSheet?.map((f, i) => (
                        <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-[11px]">{f.name}</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-purple-800 bg-purple-50/80 px-2 py-1 rounded">
                            {f.formula}
                          </div>
                          <p className="text-[10px] text-slate-600 leading-snug">{f.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 10-Mark Derivation Milestones */}
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. Compulsory 10-Mark Derivation Proof</span>
                    </div>
                    {sheet.tenMarkDerivations?.map((d, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                        <span className="font-bold text-slate-900 text-xs block">{d.title}</span>
                        <ul className="space-y-1 text-[11px] text-slate-700 pl-2">
                          {d.steps.map((s, sIdx) => (
                            <li key={sIdx} className="leading-tight">• {s}</li>
                          ))}
                        </ul>
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-bold text-emerald-900">
                          {d.keyResult}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Definitions, Diagrams & Examiner Traps */}
                <div className="space-y-5">
                  {/* High Frequency 3-Mark Definitions */}
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>3. High-Frequency 3-Mark Definitions</span>
                    </div>
                    <div className="space-y-2">
                      {sheet.keyDefinitions?.map((d, i) => (
                        <div key={i} className="p-2 bg-white border border-slate-200 rounded-lg">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="font-bold text-slate-900 text-[11px]">{d.term}</span>
                            <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                              {d.marks}M Compulsory
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-700 leading-snug">{d.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Architecture Schematic */}
                  <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Core Architecture & Signal Schematics</span>
                    </div>
                    {sheet.coreDiagrams?.map((diag, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                        <span className="font-bold text-slate-900 text-[11px] block">{diag.title}</span>
                        <pre className="text-[9px] bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto font-mono whitespace-pre-wrap">
                          {diag.diagramAscii}
                        </pre>
                        <p className="text-[10px] text-purple-900 italic font-medium">Tip: {diag.tips}</p>
                      </div>
                    ))}
                  </div>

                  {/* Examiner Traps & Lost Marks */}
                  <div className="border border-rose-200 rounded-xl p-4 bg-rose-50/40 space-y-3">
                    <div className="flex items-center gap-2 font-black text-rose-900 uppercase text-[11px] tracking-wider border-b border-rose-200 pb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>5. Top Examiner Traps & Mark Deductions</span>
                    </div>
                    <div className="space-y-2">
                      {sheet.examinerTraps?.map((t, i) => (
                        <div key={i} className="p-2 bg-white border border-rose-200 rounded-lg text-[10px] space-y-1">
                          <span className="font-bold text-rose-800 block">⚠️ {t.trap}</span>
                          <div className="text-slate-600">
                            <span className="font-bold text-rose-600">Common Mistake:</span> {t.whatStudentsWrite}
                          </div>
                          <div className="text-emerald-800 font-medium">
                            <span className="font-bold text-emerald-700">Examiner Expects:</span> {t.whatExaminersExpect}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>ScholarMate AI Exam Preparation Workspace • AANM & VVRSR Polytechnic</span>
                <span>Page 1 of 1 • Prepared for University Examination Success</span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-purple-400 opacity-60" />
              <p className="text-xs">Type your subject above and click "Generate Sheet" to create your 1-page pocket revision guide.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
