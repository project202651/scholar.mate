"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Key,
  Flame,
  Lightbulb,
  FileCheck,
  Code,
  Zap,
} from "lucide-react";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatTutorViewProps {
  onOpenAISettings?: () => void;
}

export default function ChatTutorView({ onOpenAISettings }: ChatTutorViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **Nexa**, your ScholarMate AI Study Companion & Academic Mentor 🤖✨\n\nAsk me any doubt, syllabus topic, 5/10-mark exam question, numerical derivation, or code snippet. Select a study mode below or choose an uploaded document for deep textbook context!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [isAIConfigured, setIsAIConfigured] = useState(true);
  const [studyMode, setStudyMode] = useState<"standard" | "exam" | "eli5" | "stepbystep" | "code">("standard");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Gemini API key is configured
    const checkAIKey = async () => {
      try {
        const res = await fetch("/api/ai/save-key");
        if (res.ok) {
          const data = await res.json();
          setIsAIConfigured(data.isConfigured);
        }
      } catch {}
    };
    checkAIKey();

    // Load documents for context dropdown
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documents/upload");
        if (res.ok) {
          const data = await res.json();
          if (data.documents) setDocuments(data.documents);
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const rawQ = (questionText || input).trim();
    if (!rawQ || loading) return;

    setInput("");

    // Enrich question based on chosen Nexa study mode
    let q = rawQ;
    if (studyMode === "exam") {
      q = `[EXAM ANSWER FORMAT: Structure this response as a high-scoring 5-mark / 10-mark semester exam answer with clear headings, definitions, labeled diagrams/ASCII schemas where helpful, and key points]:\n${rawQ}`;
    } else if (studyMode === "eli5") {
      q = `[EXPLAIN LIKE I'M 5 / INTUITIVE ANALOGY: Explain this concept using simple, visual real-world analogies, beginner-friendly language, and zero overwhelming jargon]:\n${rawQ}`;
    } else if (studyMode === "stepbystep") {
      q = `[STEP-BY-STEP DERIVATION / NUMERICAL: Solve this step-by-step with all formulas, substituted values, and clear intermediate reasoning]:\n${rawQ}`;
    } else if (studyMode === "code") {
      q = `[CODE & IMPLEMENTATION: Provide clean, well-commented code, line-by-line explanation, time/space complexity analysis, and sample inputs/outputs]:\n${rawQ}`;
    }

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: rawQ }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await aiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          question: q,
          documentId: selectedDocId || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        const errorMsg =
          data.error ||
          "Could not get an answer from Gemini. Please make sure your Gemini API key is configured in the AI Engine settings (top bar).";
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `⚠️ **Nexa AI Notification**:\n\n${errorMsg}`,
          },
        ]);
      }
    } catch (networkErr: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `⚠️ **Connection Error**:\n\n${networkErr?.message || "Failed to reach Nexa AI service."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared! I'm **Nexa**, ready for your next study topic or exam question. What would you like to explore?",
      },
    ]);
  };

  const suggestions = [
    "Explain Supervised vs Unsupervised Learning in AI & ML",
    "Explain Semaphore and Critical Section in OS (5 Marks)",
    "Explain Normalization in DBMS with 1NF, 2NF, 3NF examples",
    "Difference between TCP and UDP with header formats",
    "Write Python code for Linear Regression gradient descent",
  ];

  const modes = [
    { id: "standard", label: "Standard", icon: Sparkles },
    { id: "exam", label: "Exam 5/10 Marks", icon: FileCheck },
    { id: "eli5", label: "Intuitive / Simple", icon: Lightbulb },
    { id: "stepbystep", label: "Step-by-Step Proof", icon: Zap },
    { id: "code", label: "Code & Logic", icon: Code },
  ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[620px] rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-cyan-500/25">
            <Bot className="h-6 w-6 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Nexa <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
              </h2>
              <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                24/7 AI Doubt Solver
              </span>
              <span className="hidden sm:inline-block rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                AI & ML Dept.
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded in polytechnic & engineering syllabus • Google Gemini 3 Powered
            </p>
          </div>
        </div>

        {/* Action controls & Document Context Selector */}
        <div className="flex items-center gap-2">
          {documents.length > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none max-w-[180px] truncate"
              >
                <option value="">All Subjects (General)</option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    Doc: {d.title} ({d.subject})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleResetChat}
            title="Clear Chat"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Subheader */}
      <div className="flex items-center gap-1.5 px-6 py-2 border-b border-slate-800/60 bg-slate-950/40 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap mr-1">
          Nexa Mode:
        </span>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = studyMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setStudyMode(m.id)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`h-3 w-3 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Key Setup Banner if not configured */}
      {!isAIConfigured && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Real Google Gemini AI:</strong> Enter your free API key to activate instant Nexa responses.
            </span>
          </div>
          {onOpenAISettings && (
            <button
              onClick={onOpenAISettings}
              className="rounded-lg bg-amber-500 px-3 py-1 font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Enter Gemini API Key
            </button>
          )}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20 mt-1">
                <Bot className="h-5 w-5" />
              </div>
            )}

            <div
              className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20 font-medium"
                  : "bg-slate-800/90 border border-slate-700/80 text-slate-200 shadow-md"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">{m.content}</div>

              {m.role === "assistant" && (
                <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2 text-[11px] text-slate-400">
                  <span className="text-[10px] text-cyan-400/80 font-medium">Nexa AI Response</span>
                  <button
                    onClick={() => handleCopy(m.content, idx)}
                    className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                  >
                    {copiedId === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Solution</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {m.role === "user" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 shadow-sm mt-1">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}

        {loading && <AILoadingPulse message="Nexa AI is formulating your solution..." />}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      {messages.length < 5 && (
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" /> Quick questions:
          </span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              disabled={loading}
              className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300 hover:border-cyan-500 hover:text-cyan-300 hover:bg-slate-800 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Nexa AI about any topic, derivation, code, or exam question (${modes.find(m => m.id === studyMode)?.label} mode)...`}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
