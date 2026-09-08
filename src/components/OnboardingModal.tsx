'use client';

import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, Calendar, Target, Clock, 
  BookOpen, GraduationCap, X, Check, UploadCloud, FileText, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (planData: any) => void;
}

const POPULAR_BRANCHES = [
  "Computer Engineering",
  "Artificial Intelligence & ML",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering"
];

const PRESET_SUBJECTS = [
  "Operating Systems & System Software",
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Computer Networks & Protocols",
  "Artificial Intelligence & Machine Learning",
  "Cloud Computing & DevOps"
];

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [examName, setExamName] = useState("Semester End University Examination");
  const [examDate, setExamDate] = useState("2026-10-15");
  const [branch, setBranch] = useState("Artificial Intelligence & ML");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Operating Systems & System Software",
    "Data Structures & Algorithms",
    "Artificial Intelligence & Machine Learning"
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [targetGrade, setTargetGrade] = useState("Distinction (85-95%)");
  const [targetScore, setTargetScore] = useState(90);
  const [dailyHours, setDailyHours] = useState("2.5");
  
  // Confidence matrix for each selected subject: 'low' | 'medium' | 'high'
  const [confidenceMap, setConfidenceMap] = useState<Record<string, 'low' | 'medium' | 'high'>>({
    "Operating Systems & System Software": "medium",
    "Data Structures & Algorithms": "low",
    "Artificial Intelligence & Machine Learning": "high"
  });

  const [studyMaterialText, setStudyMaterialText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [generating, setGenerating] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(prev => prev.filter(s => s !== sub));
      const nextMap = { ...confidenceMap };
      delete nextMap[sub];
      setConfidenceMap(nextMap);
    } else {
      setSelectedSubjects(prev => [...prev, sub]);
      setConfidenceMap(prev => ({ ...prev, [sub]: "medium" }));
    }
  };

  const addCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjects(prev => [...prev, trimmed]);
      setConfidenceMap(prev => ({ ...prev, [trimmed]: "medium" }));
      setCustomSubjectInput("");
    }
  };

  const setSubjectConfidence = (sub: string, level: 'low' | 'medium' | 'high') => {
    setConfidenceMap(prev => ({ ...prev, [sub]: level }));
  };

  const calculateDaysRemaining = () => {
    try {
      const exam = new Date(examDate).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 14;
    } catch {
      return 14;
    }
  };

  const handleFinish = () => {
    setGenerating(true);
    setTimeout(() => {
      const daysRemaining = calculateDaysRemaining();
      const hoursNum = parseFloat(dailyHours);
      const hoursInt = Math.floor(hoursNum);
      const minsInt = Math.round((hoursNum % 1) * 60);

      const plan = {
        examName,
        examDate,
        daysRemaining,
        branch,
        subjects: selectedSubjects,
        confidenceMap,
        targetGrade,
        targetScore,
        dailyHours: hoursNum,
        recommendedHoursPerDay: `${hoursInt}h ${minsInt > 0 ? `${minsInt}m` : ''}`.trim(),
        uploadedMaterial: uploadedFileName || (studyMaterialText ? "Syllabus Notes / Past Topics" : "Standard University Blueprint"),
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('scholarmate_student_plan', JSON.stringify(plan));
      } catch (e) {}

      setGenerating(false);
      onComplete(plan);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Build Study Plan and Exam Target"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0f172a] text-slate-100 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close study plan"
          title="Close study plan"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar Indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-[#54d6c7]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Exam Date & Target Name */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Step 1 of 4 · Exam Timeline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                When is your upcoming exam?
              </h2>
              <p className="text-xs text-slate-400">
                ScholarMate aligns your daily study blocks and revision countdown to your exact deadline.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Examination</label>
                <input
                  type="text"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  placeholder="e.g. 6th Semester University Board Exam / Mid-term"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-xs text-white focus:outline-none focus:border-[#54d6c7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-xs text-white focus:outline-none focus:border-[#54d6c7]"
                  />
                </div>

                <div className="rounded-xl border border-[#54d6c7]/30 bg-[#54d6c7]/5 p-3 flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Preparation Window</span>
                  <span className="text-lg font-black text-[#54d6c7]">
                    {calculateDaysRemaining()} Days Remaining
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-bold px-6 py-2.5 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Continue to Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Subjects & Target Grade */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Step 2 of 4 · Subjects & Target</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Select your exam subjects & target
              </h2>
              <p className="text-xs text-slate-400">
                Choose the course subjects to include in your personalized readiness track.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {PRESET_SUBJECTS.map(s => {
                  const isSelected = selectedSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#54d6c7] bg-[#54d6c7]/15 text-[#54d6c7]'
                          : 'border-white/10 bg-slate-800/80 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={e => setCustomSubjectInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSubject())}
                  placeholder="Add custom subject (e.g. Embedded Systems)..."
                  className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#54d6c7]"
                />
                <button
                  type="button"
                  onClick={addCustomSubject}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Target Grade / Percentage */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Target Score: {targetScore}%</label>
                  <span className="text-xs font-bold text-[#54d6c7]">{targetGrade}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={targetScore}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setTargetScore(val);
                    if (val >= 85) setTargetGrade("Distinction (85-98%)");
                    else if (val >= 70) setTargetGrade("First Class (70-84%)");
                    else setTargetGrade("Second Class / Pass (60-69%)");
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#54d6c7]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={selectedSubjects.length === 0}
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Daily Study Time & Confidence Per Subject */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <Target className="w-3.5 h-3.5" />
                <span>Step 3 of 4 · Confidence & Time</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                How confident do you feel in each subject?
              </h2>
              <p className="text-xs text-slate-400">
                Low confidence subjects will automatically receive more practice drills and early revision slots.
              </p>
            </div>

            {/* Subject Confidence Matrix */}
            <div className="space-y-2 max-h-44 overflow-y-auto p-1">
              {selectedSubjects.map(sub => {
                const conf = confidenceMap[sub] || 'medium';
                return (
                  <div key={sub} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-800/60">
                    <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[260px]">{sub}</span>
                    <div className="flex items-center gap-1">
                      {(['low', 'medium', 'high'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSubjectConfidence(sub, lvl)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            conf === lvl
                              ? lvl === 'low'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : lvl === 'medium'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-700/50 text-slate-400 border border-transparent hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Hours Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#54d6c7]" />
                <span>Daily Available Study Time</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1.5 Hours", val: "1.5" },
                  { label: "2.5 Hours", val: "2.5" },
                  { label: "4.0 Hours", val: "4.0" }
                ].map(t => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setDailyHours(t.val)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      dailyHours === t.val
                        ? 'border-[#54d6c7] bg-[#54d6c7]/15 text-[#54d6c7]'
                        : 'border-white/10 bg-slate-800/80 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-bold px-6 py-2.5 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Materials & Instant Generation */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Step 4 of 4 · Syllabus & Materials</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Upload your syllabus, notes, or past papers
              </h2>
              <p className="text-xs text-slate-400">
                Optional: Upload a document or paste topics to customize your questions and answers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-800/40 p-4 text-center">
                <input
                  type="file"
                  id="syllabus-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedFileName(file.name);
                  }}
                />
                <label htmlFor="syllabus-upload" className="cursor-pointer block space-y-1.5">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#54d6c7]/10 text-[#54d6c7]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-white block">
                    {uploadedFileName ? uploadedFileName : "Click to select syllabus PDF, Word doc, or past paper"}
                  </span>
                  <span className="text-[10px] text-slate-400 block">PDF, DOCX, TXT (Up to 25MB)</span>
                </label>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={studyMaterialText}
                  onChange={e => setStudyMaterialText(e.target.value)}
                  placeholder="Or paste syllabus topic names / chapter outlines here..."
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#54d6c7]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={generating}
                onClick={handleFinish}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#70d6a8] hover:opacity-95 text-slate-950 font-black px-6 py-3 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? "Calibrating Your Plan..." : "Generate My Study Plan"}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
