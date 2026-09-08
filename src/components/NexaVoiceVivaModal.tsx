'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, Award, RotateCcw, 
  ChevronRight, CheckCircle2, AlertCircle, Play, Pause, X, 
  Brain, Send, Loader2, BookOpen, FlaskConical, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VivaQuestion {
  id: string;
  question: string;
  expectedKeywords: string[];
  modelAnswer: string;
  marksWeight: number;
  hint?: string;
}

interface VivaEvaluation {
  score: number;
  rating: string;
  keywordsHit: string[];
  keywordsMissed: string[];
  feedback: string;
  modelOralAnswer?: string;
}

interface NexaVoiceVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialTopic?: string;
  onPracticeQuestion?: (topic: string, questionText: string) => void;
}

export default function NexaVoiceVivaModal({
  isOpen,
  onClose,
  initialSubject = '',
  initialTopic = '',
  onPracticeQuestion
}: NexaVoiceVivaModalProps) {
  const [subject, setSubject] = useState(initialSubject || '');
  const [topic, setTopic] = useState(initialTopic || '');
  const [vivaMode, setVivaMode] = useState<'theory' | 'lab_practical' | 'rapid_fire'>('theory');

  // Viva Session State
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student answer state
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<VivaEvaluation | null>(null);
  const [allEvaluations, setAllEvaluations] = useState<Array<{ question: VivaQuestion; eval: VivaEvaluation }>>([]);
  const [showScorecard, setShowScorecard] = useState(false);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialTopic) setTopic(initialTopic);
  }, [initialSubject, initialTopic]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsSpeaking(false);
    setIsRecording(false);
  };

  const speakText = (text: string) => {
    if (voiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (engVoice) utterance.voice = engVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startVivaSession = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setEvaluation(null);
    setAllEvaluations([]);
    setShowScorecard(false);
    setCurrentIndex(0);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/viva', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'generate',
          subject: subject.trim(),
          topic: topic.trim() || undefined,
          mode: vivaMode
        })
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSessionStarted(true);
        setTimeout(() => {
          speakText(data.questions[0].question);
        }, 400);
      }
    } catch (err) {
      console.error('Failed to load viva questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. You can type your answer in the box below!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpokenTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleEvaluateAnswer = async () => {
    if (!spokenTranscript.trim() || evaluating) return;
    stopRecording();
    setEvaluating(true);

    const activeQ = questions[currentIndex];

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/viva', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'evaluate',
          question: activeQ.question,
          expectedKeywords: activeQ.expectedKeywords,
          studentAnswer: spokenTranscript.trim(),
          subject: subject.trim()
        })
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setAllEvaluations(prev => [...prev, { question: activeQ, eval: data.evaluation }]);
        
        if (data.evaluation.feedback) {
          setTimeout(() => {
            speakText(data.evaluation.feedback);
          }, 200);
        }
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    stopAudio();
    setEvaluation(null);
    setSpokenTranscript('');
    
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => {
        speakText(questions[nextIdx].question);
      }, 300);
    } else {
      setShowScorecard(true);
    }
  };

  const calculateFinalTotal = () => {
    const totalPossible = questions.length * 5;
    const scored = allEvaluations.reduce((acc, curr) => acc + curr.eval.score, 0);
    const percentage = totalPossible > 0 ? Math.round((scored / totalPossible) * 100) : 0;
    return { scored, totalPossible, percentage };
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Nexa AI Oral Viva Voce Simulator"
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative text-white"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 p-5 sm:p-6 flex items-center justify-between relative overflow-hidden border-b border-white/10">
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/25 shadow-inner">
              <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">Nexa AI Voice Viva Voce</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-black/30 border border-white/20 text-emerald-200">
                  AI EXTERNAL EXAMINER
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Interactive spoken examination with real-time audio questioning, keyword scoring, and verbal feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              title={voiceMuted ? "Unmute Voice Examiner" : "Mute Voice Examiner"}
              className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-all cursor-pointer border border-white/10"
            >
              {voiceMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-200" />}
            </button>
            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              title="Close Viva Simulator"
              className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-all cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!sessionStarted ? (
            /* Setup Phase */
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <Brain className="w-3.5 h-3.5" /> Ready Your Viva Prep
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Choose Your Viva Voce Parameters</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Simulate external university lab examinations, project defenses, or rapid-fire oral theory drills.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Data Structures, DBMS, Physics"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Specific Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Binary Search Trees, Paging, Fourier"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">
                    Examination Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setVivaMode('theory')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        vivaMode === 'theory'
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 mb-1">
                        <BookOpen className="w-4 h-4" /> Theory Defense
                      </div>
                      <p className="text-[11px] text-slate-400">
                        5 core theoretical questions evaluating concepts & governing laws.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVivaMode('lab_practical')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        vivaMode === 'lab_practical'
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-400 mb-1">
                        <FlaskConical className="w-4 h-4" /> Lab Practical
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Pinouts, circuit components, code syntax, and troubleshooting.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVivaMode('rapid_fire')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        vivaMode === 'rapid_fire'
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-400 mb-1">
                        <Zap className="w-4 h-4" /> Rapid-Fire (3 Min)
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Fast, crisp 15-second definitions under time pressure.
                      </p>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startVivaSession}
                  disabled={loading || !subject.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Examiner is Preparing Questions...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Voice Viva Session</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : showScorecard ? (
            /* Final Scorecard */
            <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-emerald-500/20">
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white">Viva Voce Examination Completed</h3>
                <p className="text-xs text-slate-400">
                  Official evaluation by Nexa AI University External Examiner
                </p>
              </div>

              {(() => {
                const { scored, totalPossible, percentage } = calculateFinalTotal();
                return (
                  <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-5 text-center shadow-xl">
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-5xl font-black text-emerald-400">{scored}</span>
                      <span className="text-xl font-bold text-slate-400">/ {totalPossible} Marks</span>
                    </div>

                    <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      {percentage >= 80 ? '🏆 Distinction (Exam-Ready)' : percentage >= 60 ? '⭐ First Class' : '⚠️ Revision Required'}
                    </div>

                    <div className="space-y-3 text-left pt-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Question-by-Question Breakdown:</h4>
                      {allEvaluations.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-200 block">Q{idx + 1}: {item.question.question}</span>
                            <p className="text-[11px] text-slate-400 italic">Feedback: "{item.eval.feedback}"</p>
                          </div>
                          <span className={`font-black shrink-0 px-2 py-1 rounded-md text-xs ${
                            item.eval.score >= 4 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {item.eval.score} / 5 M
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => {
                          setSessionStarted(false);
                          setShowScorecard(false);
                        }}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" /> Start New Viva
                      </button>
                      <button
                        onClick={() => {
                          stopAudio();
                          onClose();
                        }}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Finish & Exit
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Active Viva Question Screen */
            <div className="space-y-5 max-w-3xl mx-auto">
              {/* Question Progress Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">Question {currentIndex + 1} of {questions.length}</span>
                  <span className="text-slate-600">•</span>
                  <span>{currentQ?.marksWeight || 5} Marks</span>
                </div>
                <div className="flex gap-1.5">
                  {questions.map((_, qIdx) => (
                    <div
                      key={qIdx}
                      className={`h-1.5 w-6 rounded-full transition-all ${
                        qIdx === currentIndex
                          ? 'bg-emerald-400'
                          : qIdx < currentIndex
                          ? 'bg-emerald-700'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Examiner Question Box with Soundwave */}
              <div className="bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-700 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Examiner Question
                      </span>
                      {isSpeaking && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" /> Speaking aloud...
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {currentQ?.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => speakText(currentQ?.question || '')}
                    title="Repeat Question Aloud"
                    className="p-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white shrink-0 border border-slate-600 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>

                {/* Animated Waveform when speaking or recording */}
                {(isSpeaking || isRecording) && (
                  <div className="flex items-center justify-center gap-1 py-1">
                    {[0.6, 1.2, 0.4, 1.5, 0.8, 1.8, 0.5, 1.4, 0.7, 1.1].map((scale, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ['8px', `${scale * 20}px`, '8px'] }}
                        transition={{ repeat: Infinity, duration: 0.8 + (i * 0.05), ease: 'easeInOut' }}
                        className={`w-1 rounded-full ${isRecording ? 'bg-rose-400' : 'bg-emerald-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Student Response Area */}
              <div className="bg-slate-800/60 rounded-3xl p-5 sm:p-6 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" /> Your Oral Answer:
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Speak into mic or type your answer
                  </span>
                </div>

                {/* Live Transcript Input */}
                <textarea
                  value={spokenTranscript}
                  onChange={(e) => setSpokenTranscript(e.target.value)}
                  placeholder="Click 'Start Speaking' and state your answer clearly, or type here if in a noisy environment..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
                />

                {/* Microphone Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-emerald-200" />
                        <span>Start Speaking</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md animate-pulse cursor-pointer"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop Speaking</span>
                      </button>
                    )}

                    {spokenTranscript.trim() && (
                      <button
                        type="button"
                        onClick={() => setSpokenTranscript('')}
                        className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer ml-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !spokenTranscript.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Examiner is Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Oral Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Evaluation Card Result */}
              {evaluation && (
                <div className="bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-emerald-500/40 space-y-4 animate-fadeIn shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-lg font-black px-3 py-1 rounded-xl ${
                        evaluation.score >= 4 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {evaluation.score} / 5 Marks
                      </span>
                      <span className="text-xs font-bold text-slate-300 uppercase">
                        {evaluation.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => speakText(evaluation.feedback)}
                      title="Hear Examiner Feedback Again"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Replay Feedback
                    </button>
                  </div>

                  {/* Examiner Verbal Feedback */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs sm:text-sm leading-relaxed text-slate-200 italic">
                    "{evaluation.feedback}"
                  </div>

                  {/* Keywords Hit & Missed */}
                  <div className="space-y-2 text-xs">
                    {evaluation.keywordsHit && evaluation.keywordsHit.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-emerald-400">Keywords Spoken:</span>
                        {evaluation.keywordsHit.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px]">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    {evaluation.keywordsMissed && evaluation.keywordsMissed.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-400">Keywords Missed:</span>
                        {evaluation.keywordsMissed.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px]">
                            ✗ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Model Spoken Answer */}
                  {evaluation.modelOralAnswer && (
                    <div className="pt-2 border-t border-slate-700 text-xs text-slate-400">
                      <span className="font-bold text-slate-300 block mb-0.5">Ideal Oral Model Answer:</span>
                      <p className="text-slate-300">{evaluation.modelOralAnswer}</p>
                    </div>
                  )}

                  {/* Next Question CTA */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'Next Viva Question' : 'View Viva Scorecard'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
