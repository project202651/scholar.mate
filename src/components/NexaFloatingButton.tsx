'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, FileText, ChevronUp, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NexaFloatingButtonProps {
  activeTopic?: string;
  activeSubject?: string;
  activeDocId?: string;
  activeDocTitle?: string;
  onNavigateToTab?: (tab: string) => void;
}

export default function NexaFloatingButton({
  activeTopic,
  activeSubject,
  activeDocId,
  activeDocTitle,
  onNavigateToTab
}: NexaFloatingButtonProps) {
  const [manualTopic, setManualTopic] = useState(activeTopic || '');
  const [manualSubject, setManualSubject] = useState(activeSubject || '');
  const [isEditingContext, setIsEditingContext] = useState(false);

  useEffect(() => {
    if (activeTopic) setManualTopic(activeTopic);
  }, [activeTopic]);

  useEffect(() => {
    if (activeSubject) setManualSubject(activeSubject);
  }, [activeSubject]);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; options?: string[] }>>([
    {
      role: 'assistant',
      text: "👋 Hi! I'm **Nexa AI**, your personal study assistant and exam coach.\n\nTell me what you need help with:\n• 📖 *Need an intuitive explanation of any concept?*\n• ⚡ *Want a quick 60-second revision summary?*\n• 📝 *Need 3-mark, 7-mark, or 10-mark exam questions and answers?*\n• ❓ *Have a specific doubt or problem to solve?*",
      options: [
        "📖 Explain a concept simply",
        "⚡ 60-second revision summary",
        "📝 3M, 7M & 10M exam questions",
        "🔢 Step-by-step problem solution",
        "⚠️ Common examiner traps"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendQuery = async (queryText: string, mode?: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    let detectedMode = mode || 'general';
    if (!mode) {
      const lower = textToSend.toLowerCase();
      if (lower.includes('simpler') || lower.includes('explain')) detectedMode = 'explain';
      else if (lower.includes('summary') || lower.includes('60-second')) detectedMode = 'summary';
      else if (lower.includes('question') || lower.includes('3m') || lower.includes('7m') || lower.includes('10m')) detectedMode = 'questions';
      else if (lower.includes('solve') || lower.includes('proof') || lower.includes('step')) detectedMode = 'solve';
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

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
          mode: detectedMode,
          documentId: activeDocId || undefined,
          subject: manualSubject.trim() || activeSubject || undefined,
          topic: manualTopic.trim() || activeTopic || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        const finalAnswer = data.answer || data.reply || data.response || data.text || "Here is the explanation for your query.";
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: finalAnswer,
          options: [
            "📖 Explain this in simpler terms",
            "⚡ Give a 60-second summary & formulas",
            "📝 Show 3M, 7M & 10M exam questions",
            "🔢 Step-by-step problem solution",
            "⚠️ Top examiner traps to avoid"
          ]
        }]);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: errData.error || "I couldn't complete that response right now. Please verify your connection or AI key." }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Connection error. Please try asking again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (opt: string) => {
    let mode = 'general';
    let query = opt;
    const lower = opt.toLowerCase();

    if (lower.includes('simpler') || lower.includes('explain')) {
      mode = 'explain';
      query = 'Please explain this concept in simpler terms with clear, intuitive real-world analogies.';
    } else if (lower.includes('summary') || lower.includes('60-second')) {
      mode = 'summary';
      query = 'Give me a high-yield 60-second revision summary and formula cheat-sheet for this.';
    } else if (lower.includes('question') || lower.includes('3m') || lower.includes('7m') || lower.includes('10m')) {
      mode = 'questions';
      query = 'Show the top 3-mark, 7-mark, and 10-mark university exam questions with answers for this.';
    } else if (lower.includes('trap') || lower.includes('mistake')) {
      mode = 'general';
      query = 'What are the top examiner traps and common student mistakes for this topic?';
    } else if (lower.includes('step') || lower.includes('solve') || lower.includes('problem')) {
      mode = 'solve';
      query = 'Walk me step-by-step through the mathematical derivation or solved problem for this.';
    }

    handleSendQuery(query, mode);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendQuery(input);
  };

  return (
    <>
      {/* Floating Action Button - Positioned safely above mobile bottom bar */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              aria-label="Ask Nexa AI exam coach"
              title="Ask Nexa AI exam coach"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-3.5 sm:px-4 sm:py-3 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none cursor-pointer border border-white/20 backdrop-blur-md"
            >
              <div className="relative">
                <Bot className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </div>
              <span className="hidden sm:inline font-semibold text-xs tracking-wide">
                Ask Nexa AI
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Drawer / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Nexa AI Exam Coach Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl ${
              isExpanded
                ? 'inset-4 sm:inset-10'
                : 'bottom-20 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[80vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-4 py-3 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Nexa AI</h3>
                    <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                    {activeDocTitle ? `Context: ${activeDocTitle}` : 'Full Academic Exam Coach'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? "Minimize chat drawer" : "Maximize chat drawer"}
                  title={isExpanded ? "Minimize" : "Maximize"}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Nexa AI assistant"
                  title="Close Nexa AI assistant"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Context Notice Tag */}
            {activeDocTitle && (
              <div className="flex items-center gap-1.5 bg-cyan-500/10 px-4 py-1.5 border-b border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-300">
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">Grounded in: <strong>{activeDocTitle}</strong></span>
              </div>
            )}

            {/* User-Controlled Topic Context Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-slate-800/60 text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] font-bold text-slate-400">Target:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[210px]">
                  {manualTopic || manualSubject || "Any Subject / Topic (Manual)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingContext(!isEditingContext)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 transition-all cursor-pointer shrink-0"
              >
                {isEditingContext ? "Done" : "Set Subject/Topic"}
              </button>
            </div>

            {/* Context Manual Input Panel */}
            {isEditingContext && (
              <div className="p-2.5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-white/10 space-y-2 animate-fadeIn">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualSubject}
                    onChange={(e) => setManualSubject(e.target.value)}
                    placeholder="Subject (e.g., Mathematics, AI)"
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={manualTopic}
                    onChange={(e) => setManualTopic(e.target.value)}
                    placeholder="Topic (e.g., Normalization, Calculus)"
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Custom context gives you laser-focused exam answers.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setManualSubject('');
                      setManualTopic('');
                    }}
                    className="text-rose-500 hover:underline cursor-pointer font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans leading-relaxed">{m.text}</div>
                    
                    {/* Interactive follow-up options directly inside the message bubble */}
                    {m.options && m.options.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-1.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                          What type of answer do you need next?
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {m.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleOptionClick(opt)}
                              className="text-[10px] bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                    <span>Nexa is analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto border-t border-slate-200/60 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/60 text-[11px] no-scrollbar">
              <span className="text-slate-400 dark:text-slate-500 shrink-0 font-medium">Quick:</span>
              <button
                type="button"
                onClick={() => {
                  const target = manualTopic || activeTopic;
                  if (target) {
                    handleSendQuery(`Explain ${target} in simple terms with an everyday analogy`, 'explain');
                  } else {
                    handleSendQuery('Explain this concept in simple terms with an everyday analogy', 'explain');
                  }
                }}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer font-medium"
              >
                📖 Explain simply
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = manualTopic || activeTopic;
                  if (target) {
                    handleSendQuery(`Give me a 60-second summary and formula cheat-sheet for ${target}`, 'summary');
                  } else {
                    handleSendQuery('Give me a 60-second summary and formula cheat-sheet for this', 'summary');
                  }
                }}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 transition-all cursor-pointer font-medium"
              >
                ⚡ 60s Summary
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = manualTopic || activeTopic;
                  if (target) {
                    handleSendQuery(`What are the top 3-mark, 7-mark, and 10-mark university exam questions for ${target}?`, 'questions');
                  } else {
                    handleSendQuery('What are the top 3-mark, 7-mark, and 10-mark university exam questions for this topic?', 'questions');
                  }
                }}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 transition-all cursor-pointer font-medium"
              >
                📝 Exam Questions
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = manualTopic || activeTopic;
                  if (target) {
                    handleSendQuery(`What are the top examiner traps and common student mistakes in ${target}?`, 'general');
                  } else {
                    handleSendQuery('What are the top examiner traps and common student mistakes for this topic?', 'general');
                  }
                }}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 transition-all cursor-pointer font-medium"
              >
                ⚠️ Examiner Traps
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="border-t border-slate-200 dark:border-white/10 p-2.5 bg-slate-50/50 dark:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/90 px-3 py-1.5 border border-slate-200 dark:border-white/10 shadow-inner">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a doubt, formula derivation, or concept..."
                  className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
