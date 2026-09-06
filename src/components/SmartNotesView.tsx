"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, FileText, Check, Copy, List, HelpCircle, Layers, Plus, Key } from "lucide-react";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

interface SmartNotesViewProps {
  onOpenAISettings?: () => void;
  initialDocId?: string;
}

export default function SmartNotesView({ onOpenAISettings, initialDocId }: SmartNotesViewProps) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Artificial Intelligence & Machine Learning (AI & ML)");
  const [rawContent, setRawContent] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId || "");
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"summary" | "bullets" | "questions">("summary");
  const [questionFilter, setQuestionFilter] = useState<string>("all");
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [isAIConfigured, setIsAIConfigured] = useState(true);

  const AIML_PRESETS = [
    { topic: "Supervised vs Unsupervised Learning & Loss Functions", subject: "Machine Learning (AI & ML)" },
    { topic: "Neural Networks & Backpropagation Algorithm", subject: "Deep Learning (AI & ML)" },
    { topic: "Convolutional Neural Networks (CNN) Architecture & Pooling", subject: "Computer Vision (AI & ML)" },
    { topic: "Natural Language Processing (NLP) & Tokenization", subject: "NLP & AI (AI & ML)" },
    { topic: "Python for AI: NumPy, Pandas & Model Evaluation Metrics", subject: "Python Programming (AI & ML)" },
  ];

  useEffect(() => {
    fetchSavedNotes();
    fetchDocuments();

    // Check key
    fetch("/api/ai/save-key")
      .then((r) => r.json())
      .then((d) => setIsAIConfigured(d.isConfigured))
      .catch(() => {});
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents/upload");
      if (res.ok) {
        const data = await res.json();
        if (data.documents) setDocuments(data.documents);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSavedNotes = async () => {
    try {
      const res = await fetch("/api/ai/notes");
      if (res.ok) {
        const data = await res.json();
        if (data.notes && data.notes.length > 0) {
          setSavedNotes(data.notes);
          setCurrentNote(data.notes[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic && !selectedDocId && !rawContent) return;

    setLoading(true);
    setNoteError(null);
    try {
      const res = await aiFetch("/api/ai/notes", {
        method: "POST",
        body: JSON.stringify({
          topic: topic || "Course Module",
          subject: subject,
          documentId: selectedDocId || undefined,
          rawContent: rawContent || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.note) {
        setCurrentNote(data.note);
        setSavedNotes([data.note, ...savedNotes]);
        setTopic("");
        setRawContent("");
      } else {
        setNoteError(data.error || "Failed to generate AI notes. Please verify your Gemini API key in the AI Engine settings.");
      }
    } catch (err: any) {
      setNoteError(err?.message || "Failed to generate AI notes");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-400" />
            <span>Smart Notes & Exam Summarizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Auto-extract bullet points, concise chapter summaries, and high-yield 5-mark & 10-mark questions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Generator & History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Generate New AI Notes</span>
            </h3>

            {!isAIConfigured && (
              <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Enter Gemini API key to activate AI notes</span>
                </span>
                {onOpenAISettings && (
                  <button
                    type="button"
                    onClick={onOpenAISettings}
                    className="rounded bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-slate-950"
                  >
                    Setup Key
                  </button>
                )}
              </div>
            )}

            {noteError && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {noteError}
              </div>
            )}

            {/* Quick 1-Click AI & ML Presets */}
            <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                <span>AI & ML Exam Presets (1-Click Fill)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AIML_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(p.topic);
                      setSubject(p.subject);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-300 active:scale-95 transition-all text-left"
                  >
                    {p.topic.split("&")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Choose from uploaded documents */}
              {documents.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Or choose uploaded document:
                  </label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => {
                      setSelectedDocId(e.target.value);
                      const d = documents.find((doc) => doc.id === e.target.value);
                      if (d) {
                        setTopic(d.title);
                        setSubject(d.subject);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">-- Manual Topic Input --</option>
                    {documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic or Chapter Title
                </label>
                <input
                  type="text"
                  required={!selectedDocId}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Process Scheduling & Round Robin Algorithm"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems / Computer Networks"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {!selectedDocId && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Paste Lecture Text / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    placeholder="Paste rough lecture notes or textbook excerpts for deeper analysis..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/90 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? "Generating Smart Notes..." : "Generate AI Study Deck"}</span>
              </button>
            </form>
          </div>

          {/* Saved Notes List */}
          {savedNotes.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Saved Study Units ({savedNotes.length})</span>
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {savedNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setCurrentNote(n)}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      currentNote?.id === n.id
                        ? "border-indigo-500 bg-indigo-950/40 shadow-sm"
                        : "border-slate-800 bg-slate-800/50 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{n.subject}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Note Display */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-12 shadow-xl backdrop-blur-md flex items-center justify-center min-h-[400px]">
              <AILoadingPulse message="Extracting high-yield concepts & exam questions..." />
            </div>
          ) : currentNote ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-5">
              {/* Note Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/30">
                    {currentNote.subject}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{currentNote.title}</h3>
                </div>

                {/* Subtabs: Summary vs Bullet Points vs Questions */}
                <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
                  <button
                    onClick={() => setActiveSubTab("summary")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeSubTab === "summary"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Summary</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("bullets")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeSubTab === "bullets"
                        ? "bg-cyan-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>Bullet Points ({currentNote.bulletPoints?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("questions")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeSubTab === "questions"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Exam Q&A ({currentNote.importantQuestions?.length || 0})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Deep Data Analysis & Summary */}
              {activeSubTab === "summary" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Deep Data Analysis & 10-Part Comprehensive Summary</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentNote.summary, "summary")}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    >
                      {copiedSection === "summary" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedSection === "summary" ? "Copied!" : "Copy Full Analysis"}</span>
                    </button>
                  </div>

                  {/* Executive Overview Card */}
                  <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-slate-950/60 to-slate-900/60 p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Executive Overview</span>
                    </div>
                    {currentNote.summary}
                  </div>

                  {/* 10 Structured Analytical Sections if available */}
                  {currentNote.summarySections && currentNote.summarySections.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        10-Point Data Breakdown & Chapter Synthesis
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentNote.summarySections.map((sec: any, sIdx: number) => (
                          <div
                            key={sIdx}
                            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5 hover:border-indigo-500/30 transition-all"
                          >
                            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                                {sIdx + 1}
                              </span>
                              <span>{sec.sectionTitle}</span>
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed pl-6 whitespace-pre-line">
                              {sec.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Bullet Points */}
              {activeSubTab === "bullets" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      High-Yield Fast-Revision Bullet Points ({currentNote.bulletPoints?.length || 0})
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          currentNote.bulletPoints.map((b: string) => `• ${b}`).join("\n"),
                          "bullets"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedSection === "bullets" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedSection === "bullets" ? "Copied!" : "Copy All Bullets"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {currentNote.bulletPoints.map((point: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs sm:text-sm text-slate-200 hover:border-cyan-500/30 transition-colors"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-bold text-cyan-400">
                          {idx + 1}
                        </span>
                        <p className="leading-normal">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Important Exam Questions & Answers */}
              {activeSubTab === "questions" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      High-Yield Exam Questions ({currentNote.importantQuestions?.length || 0})
                    </span>

                    {/* Mark filter tabs */}
                    <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-1 border border-slate-700">
                      {["all", "10", "5", "3"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setQuestionFilter(filter)}
                          className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            questionFilter === filter
                              ? "bg-purple-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {filter === "all" ? "All Marks" : `${filter} Marks`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentNote.importantQuestions
                      .filter((q: any) =>
                        questionFilter === "all" ? true : String(q.marks) === questionFilter
                      )
                      .map((qObj: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 hover:border-purple-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-purple-400">
                              Question #{idx + 1}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                qObj.marks === 10
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                  : qObj.marks === 5
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                              }`}
                            >
                              {qObj.marks || 5} Marks Question
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white">{qObj.question}</p>
                          <div className="border-t border-slate-800 pt-2 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg">
                            <strong className="text-emerald-400 block mb-1">
                              Model Answer (Polytechnic Standard):
                            </strong>
                            <div className="whitespace-pre-wrap">{qObj.answer}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400 min-h-[350px] flex flex-col items-center justify-center">
              <BookOpen className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No Study Notes Selected</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter a topic or pick an uploaded document on the left to generate structured notes,
                summaries, and exam questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
