'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, AlertTriangle, Lightbulb, 
  BookOpen, HelpCircle, ArrowRight, RefreshCw, 
  Target, CheckCircle, Clock, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeQuestion {
  marks: number;
  question: string;
  answerHint: string;
}

interface TeachingLesson {
  topic: string;
  subject: string;
  coreConcept: string;
  intuitiveAnalogy: string;
  realWorldApplication: string;
  formulaOrRule: string;
  stepByStepDerivation: string;
  examinerTraps: string[];
  sixtySecondSummary: string;
  practiceQuestions: PracticeQuestion[];
}

interface Message {
  id: string;
  sender: 'user' | 'nexa';
  text?: string;
  lesson?: TeachingLesson;
  timestamp: string;
}

interface NexaCoachViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialDocumentId?: string;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToMock?: () => void;
}

function getFallbackLesson(topic: string, subject: string): TeachingLesson {
  return {
    topic: topic || "Core Engineering Principles",
    subject: subject || "Engineering & Technology",
    coreConcept: `**${topic}** represents a fundamental foundational principle in ${subject}. It governs the structured flow of processes, resource management, and state transformations in standard system architectures.`,
    intuitiveAnalogy: `Think of ${topic} like an automated airport air traffic control tower: every process or packet must receive explicit scheduling clearance, state allocation, and validation before executing to prevent collision or deadlocks.`,
    realWorldApplication: `Widely utilized in high-concurrency cloud microservices, low-latency operating system kernels, distributed consensus networks, and embedded automotive ECUs.`,
    formulaOrRule: `State Transition Matrix / Governing Rule:
∑ Resources(Allocated) + Resources(Available) = Resources(Total)
Ensure: SafetyCondition(S_i) <= Available(State) ∀ i ∈ [0, N-1]`,
    stepByStepDerivation: `1. Initialize the system state vectors [Available, Max, Allocation, Need].
2. Calculate Need[i, j] = Max[i, j] - Allocation[i, j].
3. Search for index 'i' satisfying Need[i] <= Available and Finish[i] == False.
4. If found, simulate process completion: Available += Allocation[i]; Finish[i] = True.
5. Repeat iteratively until all processes satisfy the execution criteria.`,
    examinerTraps: [
      "Failing to explicitly define base boundary cases and zero-index conditions.",
      "Confusing safety states with immediate deadlock prevention states.",
      "Omitting standard SI units and dimensional sanity checks in final numerical answers."
    ],
    sixtySecondSummary: `Master the state definition, memorize the four necessary Coffman/system criteria, always show the formula before substituting values, and highlight your final result with an examiner-friendly answer box.`,
    practiceQuestions: [
      {
        marks: 2,
        question: `Define ${topic} and state its primary engineering purpose.`,
        answerHint: "State the formal definition, primary system function, and one real-world use case."
      },
      {
        marks: 5,
        question: `Explain the working principle of ${topic} with a clean state-transition diagram.`,
        answerHint: "Draw clear block diagrams, label all inputs/outputs, and detail the 4 operational phases."
      },
      {
        marks: 10,
        question: `Derive the comprehensive mathematical model / algorithmic proof for ${topic} with a solved numerical example.`,
        answerHint: "Show initial conditions, step-by-step state matrices, safety verification, and examiner scoring checkpoints."
      }
    ]
  };
}

export default function NexaCoachView({
  initialTopic,
  initialSubject,
  initialDocumentId,
  onNavigateToPractice,
  onNavigateToMock
}: NexaCoachViewProps) {
  const [topicInput, setTopicInput] = useState('');
  const [subjectInput, setSubjectInput] = useState(initialSubject || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState<TeachingLesson | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'nexa',
      text: `👋 Greetings! I am **Nexa 2.0**, your elite Academic Exam Coach.

Enter any syllabus topic or question below, and I will generate an **8-part mastery lesson** with:
1. Plain-English Intuitive Core Concept
2. Memorable Real-World Analogy
3. Practical Application
4. Key Formula / Law / Rule
5. Step-by-Step Derivation & Solved Proof
6. Top Deadly Examiner Traps
7. 60-Second High-Yield Revision Summary
8. 3-Mark, 7-Mark & 10-Mark Practice Exam Questions`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopicInput(initialTopic);
      if (initialSubject) setSubjectInput(initialSubject);
      handleTeachTopic(initialTopic, initialSubject || 'Engineering');
    }
  }, [initialTopic, initialSubject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleTeachTopic = async (topicToTeach?: string, subjectToTeach?: string) => {
    const topic = (topicToTeach || topicInput).trim();
    const subject = (subjectToTeach || subjectInput).trim() || 'General';
    if (!topic) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `Teach me "${topic}" (${subject}) using the 8-part mastery framework.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/teaching', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          topic, 
          subject, 
          apiKey: customKey || undefined,
          examType: 'University Semester & Competitive' 
        })
      });

      let lessonData: TeachingLesson;
      if (res.ok) {
        const data = await res.json();
        lessonData = data.lesson || getFallbackLesson(topic, subject);
      } else {
        lessonData = getFallbackLesson(topic, subject);
      }

      setActiveLesson(lessonData);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        lesson: lessonData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("Nexa teaching network fallback:", err);
      const fallback = getFallbackLesson(topic, subject);
      setActiveLesson(fallback);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        lesson: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTopicInput('');
    }
  };

  const handleQuickChip = (chipType: string) => {
    const targetTopic = topicInput.trim() || activeLesson?.topic || 'Operating Systems: Deadlock Handling';
    if (chipType === '8part') {
      handleTeachTopic(targetTopic, subjectInput);
    } else if (chipType === 'traps') {
      handleCustomPrompt(`What are the top 5 deadliest examiner traps and trick questions for "${targetTopic}"?`);
    } else if (chipType === 'analogy') {
      handleCustomPrompt(`Explain "${targetTopic}" using a funny, unforgettable real-world analogy.`);
    } else if (chipType === 'summary') {
      handleCustomPrompt(`Give me a 60-second high-yield revision summary and cheat sheet for "${targetTopic}".`);
    } else if (chipType === 'derivation') {
      handleCustomPrompt(`Walk me step-by-step through the standard proof or derivation for "${targetTopic}".`);
    }
  };

  const handleCustomPrompt = async (promptText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/teaching', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          topic: promptText, 
          subject: subjectInput || 'Engineering',
          apiKey: customKey || undefined,
          examType: 'University'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lesson) {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: 'nexa',
            lesson: data.lesson,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          return;
        }
      }
      
      const fallback = getFallbackLesson(promptText, subjectInput || 'Engineering');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        lesson: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      const fallback = getFallbackLesson(promptText, subjectInput || 'Engineering');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        lesson: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <Bot className="w-8 h-8 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Nexa 2.0 AI Coach</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 border border-white/30 text-white">
                  8-Part Blueprint
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Proactive syllabus teaching, examiner traps, analogies, and derivations.
              </p>
            </div>
          </div>

          {activeLesson && (
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs">
              <span className="text-emerald-300 font-medium">Currently Teaching:</span>
              <span className="font-bold text-white max-w-[180px] truncate">{activeLesson.topic}</span>
            </div>
          )}
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/15">
          <span className="text-xs text-emerald-100 self-center font-medium mr-1">Quick Coach:</span>
          <button 
            onClick={() => handleQuickChip('8part')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" /> 8-Part Deep Lesson
          </button>
          <button 
            onClick={() => handleQuickChip('traps')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-rose-300" /> Examiner Traps
          </button>
          <button 
            onClick={() => handleQuickChip('analogy')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-cyan-300" /> Real-World Analogy
          </button>
          <button 
            onClick={() => handleQuickChip('summary')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3 h-3 text-emerald-300" /> 60s Summary
          </button>
          <button 
            onClick={() => handleQuickChip('derivation')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-indigo-300" /> Step-by-Step Proof
          </button>
        </div>
      </div>

      {/* Main Conversation & Lesson Flow */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl flex flex-col overflow-hidden min-h-[550px]">
        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[700px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3.5 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'nexa' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs' 
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5 rounded-tl-xs'
              }`}>
                {msg.text && (
                  <div className="whitespace-pre-wrap font-sans space-y-2">{msg.text}</div>
                )}

                {/* 8-Part Structured Lesson Card */}
                {msg.lesson && (
                  <div className="space-y-4 text-slate-800 dark:text-slate-100">
                    <div className="border-b border-slate-200/80 dark:border-white/10 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {msg.lesson.subject}
                      </span>
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {msg.lesson.topic}
                      </h2>
                    </div>

                    {/* 1. Core Concept */}
                    <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/60 p-3.5 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                        <span>1. Core Concept (Plain English)</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        {msg.lesson.coreConcept}
                      </p>
                    </div>

                    {/* 2 & 3: Analogy & Application Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 text-xs">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>2. Intuitive Analogy</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {msg.lesson.intuitiveAnalogy}
                        </p>
                      </div>

                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-cyan-600 dark:text-cyan-400 text-xs">
                          <Target className="w-3.5 h-3.5" />
                          <span>3. Real-World Application</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {msg.lesson.realWorldApplication}
                        </p>
                      </div>
                    </div>

                    {/* 4. Formula / Rule */}
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2 font-sans font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                        <Zap className="w-3.5 h-3.5" />
                        <span>4. Governing Formula / Law</span>
                      </div>
                      <pre className="whitespace-pre-wrap p-2.5 rounded-lg bg-white/80 dark:bg-slate-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 overflow-x-auto text-xs">
                        {msg.lesson.formulaOrRule}
                      </pre>
                    </div>

                    {/* 5. Derivation */}
                    <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/60 p-3.5 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>5. Step-by-Step Proof / Derivation</span>
                      </div>
                      <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 text-xs leading-relaxed space-y-1 font-mono">
                        {msg.lesson.stepByStepDerivation}
                      </div>
                    </div>

                    {/* 6. Examiner Traps */}
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>6. Top Deadly Examiner Traps to Avoid</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {msg.lesson.examinerTraps.map((trap, tIdx) => (
                          <li key={tIdx}>{trap}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 7. 60-Second Summary */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>7. 60-Second High-Yield Summary</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                        {msg.lesson.sixtySecondSummary}
                      </p>
                    </div>

                    {/* 8. Practice Exam Questions */}
                    {msg.lesson.practiceQuestions && msg.lesson.practiceQuestions.length > 0 && (
                      <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-100/60 dark:bg-slate-950/40 p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>8. Practice Exam Questions (2M / 5M / 10M)</span>
                          </div>
                          {onNavigateToPractice && (
                            <button
                              onClick={() => onNavigateToPractice(msg.lesson?.topic || '')}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <span>Practice in Arena</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {msg.lesson.practiceQuestions.map((pq, qIdx) => (
                            <div key={qIdx} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-white/5 text-xs flex items-start justify-between gap-3">
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white">Q{qIdx + 1}: {pq.question}</span>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5 italic">Scoring Tip: {pq.answerHint}</p>
                              </div>
                              <span className="shrink-0 font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {pq.marks}M
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shrink-0 animate-pulse shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/90 border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl rounded-tl-xs text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Nexa is structuring your 8-part breakdown with examiner traps...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-white/10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleTeachTopic();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Subject"
              className="w-1/4 max-w-[130px] px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="What topic do you want to master today? (e.g., Deadlock Avoidance, Fourier Transform)"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !topicInput.trim()}
              className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Teach</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
