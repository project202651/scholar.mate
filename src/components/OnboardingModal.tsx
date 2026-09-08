'use client';

import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, Calendar, Target, Clock, 
  BookOpen, GraduationCap, X, Check
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
  "Operating Systems",
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Computer Networks",
  "Theory of Computation",
  "Cloud Computing & DevOps",
  "Machine Learning Foundations",
  "Software Engineering"
];

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState("Computer Engineering");
  const [semester, setSemester] = useState("6th Semester (Final Year)");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Operating Systems",
    "Data Structures & Algorithms",
    "Database Management Systems"
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [examDate, setExamDate] = useState("2026-10-15");
  const [targetScore, setTargetScore] = useState(90);
  const [dailyHours, setDailyHours] = useState("2.5");
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const addCustomSubject = () => {
    if (customSubjectInput.trim() && !selectedSubjects.includes(customSubjectInput.trim())) {
      setSelectedSubjects(prev => [...prev, customSubjectInput.trim()]);
      setCustomSubjectInput("");
    }
  };

  const handleFinish = () => {
    setGenerating(true);
    setTimeout(() => {
      const plan = {
        branch,
        semester,
        subjects: selectedSubjects,
        examDate,
        targetScore,
        dailyHours: parseFloat(dailyHours),
        daysRemaining: 18,
        recommendedHoursPerDay: `${Math.floor(parseFloat(dailyHours))}h ${Math.round((parseFloat(dailyHours) % 1) * 60)}m`,
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('scholarmate_student_plan', JSON.stringify(plan));
      } catch (e) {}

      setGenerating(false);
      onComplete(plan);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0f172a] text-slate-100 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar Indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-[#54d6c7]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Branch & Semester */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Step 1 of 3 · Course Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                What are you studying?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tell ScholarMate your branch and current semester so we can configure your syllabus standards.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Branch / Engineering Discipline</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_BRANCHES.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranch(b)}
                      className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        branch === b
                          ? 'border-[#54d6c7] bg-[#54d6c7]/10 text-white'
                          : 'border-white/5 bg-slate-800/60 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Current Semester</label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#54d6c7]"
                >
                  <option>1st Semester</option>
                  <option>2nd Semester</option>
                  <option>3rd Semester</option>
                  <option>4th Semester</option>
                  <option>5th Semester</option>
                  <option>6th Semester (Final Year)</option>
                  <option>7th Semester</option>
                  <option>8th Semester (Final Year)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-bold px-6 py-3 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Subjects Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Step 2 of 3 · Subject Selection</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Select your current semester subjects
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose the subjects you need to prepare for board and university exams.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
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
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={e => setCustomSubjectInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSubject())}
                  placeholder="Or add custom subject (e.g. Embedded Systems)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#54d6c7]"
                />
                <button
                  type="button"
                  onClick={addCustomSubject}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Add
                </button>
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
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-50 text-slate-950 font-bold px-6 py-3 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Exam Target & Study Time */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#54d6c7]/10 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
                <Target className="w-3.5 h-3.5" />
                <span>Step 3 of 3 · Target & Goals</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Set your exam schedule & target
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                ScholarMate will calibrate daily study hours, active recall intervals, and mock exams to hit your target score.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#54d6c7]" />
                    <span>Target Exam Date</span>
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-xs text-white focus:outline-none focus:border-[#54d6c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#f6c85f]" />
                    <span>Target Score Goal: {targetScore}%</span>
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={targetScore}
                    onChange={e => setTargetScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#54d6c7]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Pass (60%)</span>
                    <span>First Class (75%)</span>
                    <span>Distinction (90%+)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6ea8fe]" />
                  <span>Available Daily Study Time</span>
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
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
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
                <span>{generating ? "Building Plan..." : "Generate My Exam Plan"}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
