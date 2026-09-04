"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Bot, User, BookOpen, Copy, Check, CornerDownLeft, Key, AlertCircle } from "lucide-react";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatTutorViewProps {
  onOpenAISettings?: () => void;
}

export default function ChatTutorView({ onOpenAISettings }: ChatTutorViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your ScholarMate AI Doubt Solver. Ask me any question, theory derivation, or problem from your subjects, and I will give you a detailed, step-by-step solution.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [isAIConfigured, setIsAIConfigured] = useState(true);
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
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: q }];
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
            content: `⚠️ **AI Engine Notification**:\n\n${errorMsg}`,
          },
        ]);
      }
    } catch (networkErr: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `⚠️ **Connection Error**:\n\n${networkErr?.message || "Failed to reach AI service."}`,
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

  const suggestions = [
    "Explain Semaphore and Critical Section in Operating Systems",
    "Explain Normalization in DBMS (1NF, 2NF, 3NF)",
    "What is the difference between TCP and UDP?",
    "Give 5-Mark Exam Questions for Computer Networks",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-4 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI Doubt Solver Tutor
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Grounded in polytechnic syllabus & uploaded materials
            </p>
          </div>
        </div>

        {/* Document Context Selector */}
        {documents.length > 0 && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">General Knowledge (All Subjects)</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  Context: {d.title} ({d.subject})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Key Setup Banner if not configured */}
      {!isAIConfigured && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Real Google Gemini AI:</strong> Enter your free API key to activate instant AI answers.
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm mt-1">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-800/90 border border-slate-700/80 text-slate-200 shadow-md"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">{m.content}</div>

              {m.role === "assistant" && (
                <div className="mt-3 flex items-center justify-end border-t border-slate-700/50 pt-2 text-[11px] text-slate-400">
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-sm mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && <AILoadingPulse message="ScholarMate AI is formulating the solution..." />}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      {messages.length < 4 && (
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" /> Fast prompts:
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
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
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
            placeholder="Type your exam question, doubt, or topic here..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
