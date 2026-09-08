'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, AlertTriangle, Lightbulb, 
  BookOpen, HelpCircle, ArrowRight, RefreshCw, 
  Target, CheckCircle, Clock, Zap, MessageSquare, FileText, ChevronRight
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
  suggestedPrompts?: string[];
}

interface NexaCoachViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialDocumentId?: string;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToMock?: () => void;
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
  const [activeMode, setActiveMode] = useState<'chat' | 'explain' | 'summary' | 'questions' | 'solve'>('chat');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'nexa',
      text: `👋 Hi! I am **Nexa AI**, your personal study tutor and academic exam coach inside ScholarMate.

I'm here to give you exactly what you need for your exams:
• 📖 **Intuitive Explanations**: Ask any concept or doubt to have it broken down simply with real-world examples.
• ⚡ **High-Yield Summaries**: Get a quick 60-second revision cheat-sheet with key takeaways and formulas.
• 📝 **Exam Questions & Solutions**: Get 3-mark, 7-mark, and 10-mark questions with model answers and examiner scoring criteria.
• 🔢 **Problem Solving**: Walk step-by-step through any mathematical derivation or numerical.

What topic or question would you like to work on right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Explain Deadlock Avoidance simply',
        'Summarize Cache Memory hierarchy in 3 bullets',
        'Give me 3-mark and 7-mark questions on Fourier Transform',
        'What are the top examiner traps in Database Normalization?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopicInput(initialTopic);
      if (initialSubject) setSubjectInput(initialSubject);
      handleSendMessage(`Explain ${initialTopic} in ${initialSubject || 'Engineering'} with key concepts and exam points.`, 'explain');
    }
  }, [initialTopic, initialSubject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string, modeOverride?: string) => {
    const textToSend = (customPrompt || topicInput).trim();
    if (!textToSend || isLoading) return;

    let mode = modeOverride || activeMode;
    if (!modeOverride) {
      const lower = textToSend.toLowerCase();
      if (lower.includes('simpler') || lower.includes('explain')) mode = 'explain';
      else if (lower.includes('summary') || lower.includes('60-second')) mode = 'summary';
      else if (lower.includes('question') || lower.includes('mark') || lower.includes('3m') || lower.includes('7m') || lower.includes('10m')) mode = 'questions';
      else if (lower.includes('solve') || lower.includes('proof') || lower.includes('step')) mode = 'solve';
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setTopicInput('');

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: textToSend,
          question: textToSend,
          mode: mode,
          subject: subjectInput.trim() || undefined,
          documentId: initialDocumentId || undefined,
          apiKey: customKey || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        const answerText = data.answer || data.reply || data.response || data.text || "Here is the explanation for your query.";
        
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'nexa',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: [
            `📖 Explain this in simpler terms with everyday examples`,
            `⚡ 60-second revision summary & key formulas`,
            `📝 3-mark, 7-mark & 10-mark exam questions with answers`,
            `🔢 Step-by-step problem solution and proof`,
            `⚠️ Common examiner traps & mistakes to avoid`
          ]
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'nexa',
          text: errData.error || "I encountered an issue generating that response. Please try asking again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'nexa',
        text: "Connection error. Please check your network or AI key in configuration and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickChip = (chipType: string) => {
    const currentTopic = topicInput.trim() || initialTopic || '';
    if (!currentTopic) {
      const actionVerb = chipType === 'explain' 
        ? 'explain simply' 
        : chipType === 'summary' 
        ? 'summarize' 
        : chipType === 'questions' 
        ? 'generate 3M/7M/10M exam questions for' 
        : chipType === 'traps'
        ? 'find examiner traps for'
        : 'solve step-by-step';
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'nexa',
        text: `What topic or concept would you like me to ${actionVerb}? Please type your topic in the input box below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    if (chipType === 'explain') {
      setActiveMode('explain');
      handleSendMessage(`Explain "${currentTopic}" intuitively with clear real-world examples and core principles.`, 'explain');
    } else if (chipType === 'summary') {
      setActiveMode('summary');
      handleSendMessage(`Give me a high-yield 60-second summary and formula cheat-sheet for "${currentTopic}".`, 'summary');
    } else if (chipType === 'questions') {
      setActiveMode('questions');
      handleSendMessage(`Provide the top 3-mark, 7-mark, and 10-mark university exam questions with model answers for "${currentTopic}".`, 'questions');
    } else if (chipType === 'traps') {
      handleSendMessage(`What are the top 5 deadliest examiner traps and student mistakes for "${currentTopic}"?`, 'general');
    } else if (chipType === 'solve') {
      setActiveMode('solve');
      handleSendMessage(`Walk me step-by-step through the mathematical derivation or solved problem for "${currentTopic}".`, 'solve');
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
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Nexa AI Tutor & Exam Coach</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 border border-white/30 text-white">
                  Interactive Mode
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Personalized explanations, quick summaries, exam questions, and problem solving.
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              💬 Ask Anything
            </button>
            <button
              onClick={() => setActiveMode('explain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'explain' ? 'bg-white text-slate-900 shadow-sm' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              📖 Explanation
            </button>
            <button
              onClick={() => setActiveMode('summary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              ⚡ Summary
            </button>
            <button
              onClick={() => setActiveMode('questions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'questions' ? 'bg-white text-slate-900 shadow-sm' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              📝 Exam Questions
            </button>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/15">
          <span className="text-xs text-emerald-100 self-center font-medium mr-1">Quick Actions:</span>
          <button 
            onClick={() => handleQuickChip('explain')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-cyan-300" /> Intuitive Explanation
          </button>
          <button 
            onClick={() => handleQuickChip('summary')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3 h-3 text-emerald-300" /> 60s Summary
          </button>
          <button 
            onClick={() => handleQuickChip('questions')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" /> 3M, 7M & 10M Questions
          </button>
          <button 
            onClick={() => handleQuickChip('traps')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-rose-300" /> Examiner Traps
          </button>
          <button 
            onClick={() => handleQuickChip('solve')}
            className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-indigo-300" /> Step-by-Step Proof
          </button>
        </div>
      </div>

      {/* Main Conversation Flow */}
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
                  <div className="whitespace-pre-wrap font-sans space-y-3 leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/* Interactive Suggested Follow-Up Prompts */}
                {msg.sender === 'nexa' && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                      Suggested Next Steps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedPrompts.map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(promptText)}
                          className="text-[11px] font-medium bg-white dark:bg-slate-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{promptText}</span>
                          <ChevronRight className="w-3 h-3 text-emerald-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] mt-2.5 ${msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
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
                <span>Nexa is analyzing and formulating your answer...</span>
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
              handleSendMessage();
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
              placeholder={
                activeMode === 'summary' 
                  ? "What topic do you want summarized? (e.g., Fourier Transform, Normalization, Thermodynamics)"
                  : activeMode === 'questions'
                  ? "What topic do you want 3M, 7M & 10M questions for?"
                  : activeMode === 'explain'
                  ? "What concept do you want explained simply?"
                  : "Ask Nexa AI anything... (doubt, concept, summary, or exam question)"
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !topicInput.trim()}
              className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Ask Nexa</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
