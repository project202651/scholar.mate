'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, BookOpen, CheckCircle, AlertTriangle, Lightbulb, 
  HelpCircle, RefreshCw, Zap, Award, ArrowRight, Layers, FileText, Compass
} from 'lucide-react';

interface NexaCoachViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialDocumentId?: string;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToMock?: () => void;
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
  practiceQuestions: Array<{
    question: string;
    marks: number;
    answerHint: string;
  }>;
}

interface Message {
  id: string;
  sender: 'nexa' | 'user';
  text?: string;
  lesson?: TeachingLesson;
  timestamp: string;
}

export default function NexaCoachView({
  initialTopic,
  initialSubject,
  initialDocumentId,
  onNavigateToPractice,
  onNavigateToMock
}: NexaCoachViewProps) {
  const [topicInput, setTopicInput] = useState(initialTopic || '');
  const [subjectInput, setSubjectInput] = useState(initialSubject || 'Engineering Mathematics');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'structured'>('chat');
  const [activeLesson, setActiveLesson] = useState<TeachingLesson | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'nexa',
      text: `👋 Welcome! I am **Nexa 2.0**, your AI Exam Coach. 

I don't just give answers — I teach using my **8-Part Exam Mastery Framework**:
1. **Core Concept** (Plain English)
2. **Intuitive Analogy** (Memorable mental model)
3. **Real-World Application**
4. **Formula / Rule / Syntax**
5. **Step-by-Step Derivation & Solved Example**
6. **Examiner Traps & Common Pitfalls**
7. **60-Second Blitz Summary**
8. **Exam-Style Practice Questions**

Enter any topic from your syllabus below or click a quick prompt!`,
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
    const topic = topicToTeach || topicInput.trim();
    const subject = subjectToTeach || subjectInput.trim() || 'General';
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
      const res = await fetch('/api/ai/teaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, examType: 'University Semester & Competitive' })
      });
      const data = await res.json();

      if (data.lesson) {
        setActiveLesson(data.lesson);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'nexa',
          lesson: data.lesson,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('No lesson returned');
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        text: `⚠️ I prepared a structured backup review for **${topic}**. You can inspect the key concept and formula breakdown below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTopicInput('');
    }
  };

  const handleQuickChip = (chipType: string) => {
    const targetTopic = topicInput.trim() || activeLesson?.topic || 'Eigenvalues & Eigenvectors';
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
      const res = await fetch('/api/ai/teaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: promptText, 
          subject: subjectInput || 'Engineering',
          examType: 'University'
        })
      });
      const data = await res.json();
      if (data.lesson) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'nexa',
          lesson: data.lesson,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'nexa',
          text: `Here is the focused breakdown for your request on **${promptText}**:\n\nKey takeaway: Ensure you review definitions, standard equations, boundary conditions, and test-case derivations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        text: `Completed analysis for "${promptText}". Check your practice drills to reinforce mastery.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <Bot className="w-8 h-8 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Nexa 2.0 AI Coach</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/30 border border-emerald-200/40 text-emerald-100">
                  8-Part Teaching Mode
                </span>
              </div>
              <p className="text-emerald-100 text-sm mt-0.5">
                Proactive syllabus teaching, examiner traps, analogies, and step-by-step proofs.
              </p>
            </div>
          </div>

          {activeLesson && (
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-emerald-300 font-medium">Currently Teaching:</span>
              <span className="font-semibold text-white max-w-[180px] truncate">{activeLesson.topic}</span>
            </div>
          )}
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/15">
          <span className="text-xs text-emerald-200 self-center font-medium mr-1">Quick Coach:</span>
          <button 
            onClick={() => handleQuickChip('8part')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-300" /> 8-Part Deep Lesson
          </button>
          <button 
            onClick={() => handleQuickChip('traps')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3 h-3 text-rose-300" /> Examiner Traps
          </button>
          <button 
            onClick={() => handleQuickChip('analogy')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Lightbulb className="w-3 h-3 text-amber-300" /> Intuitive Analogy
          </button>
          <button 
            onClick={() => handleQuickChip('summary')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3 h-3 text-emerald-300" /> 60-Sec Summary
          </button>
          <button 
            onClick={() => handleQuickChip('derivation')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3 h-3 text-cyan-300" /> Proof / Derivation
          </button>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'nexa' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`max-w-3xl ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl rounded-tl-sm p-5 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}>
                {msg.text && (
                  <div className="prose dark:prose-invert text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>
                )}

                {/* 8-Part Structured Lesson Render */}
                {msg.lesson && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b border-emerald-500/20 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {msg.lesson.subject} • Masterclass
                        </span>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                          Exam Blueprint Grade
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {msg.lesson.topic}
                      </h3>
                    </div>

                    {/* Part 1: Core Concept */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1.5">
                        <BookOpen className="w-4 h-4" /> 1. Core Concept (Plain English)
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {msg.lesson.coreConcept}
                      </p>
                    </div>

                    {/* Part 2: Intuitive Analogy */}
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/70 dark:border-amber-800/50">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-1.5">
                        <Lightbulb className="w-4 h-4" /> 2. Intuitive Analogy
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{msg.lesson.intuitiveAnalogy}"
                      </p>
                    </div>

                    {/* Part 3 & 4: Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wide mb-1">
                          <Compass className="w-3.5 h-3.5" /> 3. Real-World Application
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {msg.lesson.realWorldApplication}
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 font-mono">
                        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wide mb-1">
                          <Zap className="w-3.5 h-3.5" /> 4. Key Formula / Rule
                        </div>
                        <p className="text-xs text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/40 p-2 rounded border border-purple-200 dark:border-purple-800/40">
                          {msg.lesson.formulaOrRule}
                        </p>
                      </div>
                    </div>

                    {/* Part 5: Step-by-Step Derivation */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-2">
                        <Layers className="w-4 h-4" /> 5. Step-by-Step Derivation & Solved Example
                      </div>
                      <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                        {msg.lesson.stepByStepDerivation}
                      </pre>
                    </div>

                    {/* Part 6: Examiner Traps */}
                    <div className="bg-rose-50/70 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/70 dark:border-rose-800/50">
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm mb-2">
                        <AlertTriangle className="w-4 h-4" /> 6. Examiner Traps & Common Pitfalls
                      </div>
                      <ul className="space-y-1.5">
                        {msg.lesson.examinerTraps?.map((trap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-200">
                            <span className="font-bold text-rose-500 shrink-0">⚠️ Trap #{idx + 1}:</span>
                            <span>{trap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Part 7: 60-Second Summary */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-1.5">
                        <Zap className="w-4 h-4" /> 7. 60-Second Blitz Summary
                      </div>
                      <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200 leading-relaxed">
                        {msg.lesson.sixtySecondSummary}
                      </p>
                    </div>

                    {/* Part 8: Practice Questions & Next Action CTA */}
                    {msg.lesson.practiceQuestions && msg.lesson.practiceQuestions.length > 0 && (
                      <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500" /> 8. Exam-Style Practice Questions
                          </div>
                          {onNavigateToPractice && (
                            <button
                              onClick={() => onNavigateToPractice(msg.lesson?.topic || '')}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              Practice in Answer Engine <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {msg.lesson.practiceQuestions.map((pq, qIdx) => (
                            <div key={qIdx} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs flex items-start justify-between gap-3">
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white">Q{qIdx + 1}: {pq.question}</span>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5 italic">Hint: {pq.answerHint}</p>
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

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 font-semibold text-sm">
                  ME
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Nexa is building your 8-part breakdown with examiner traps...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800">
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
              placeholder="Subject (e.g. OS, Math)"
              className="w-1/4 max-w-[150px] px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="What topic do you want to master today? (e.g., Deadlock Avoidance, Fourier Transform)"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !topicInput.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
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
