"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileText, Sparkles, BookOpen, Brain, Award, CheckCircle2, AlertCircle, Layers, Zap } from "lucide-react";
import AILoadingPulse from "./AILoadingPulse";

interface DocHubViewProps {
  setActiveTab?: (tab: string) => void;
  onSelectDocument?: (docId: string, title?: string, subject?: string) => void;
  onNavigateToNotes?: () => void;
}

export default function DocHubView({ setActiveTab, onSelectDocument, onNavigateToNotes }: DocHubViewProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("DCME - Core Polytechnic");
  const [rawText, setRawText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !rawText.trim()) {
      setError("Please choose a file or paste syllabus text");
      return;
    }

    setLoading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (rawText.trim()) formData.append("rawText", rawText);
      formData.append("title", title || (selectedFile ? selectedFile.name : "Study Material"));
      formData.append("subject", subject);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadSuccess(true);
      setTitle("");
      setRawText("");
      setSelectedFile(null);
      
      // Fast optimistic update: immediately update state and notify listeners
      if (data.document) {
        setDocuments(prev => [data.document, ...prev.filter(d => d.id !== data.document.id)]);
        onSelectDocument?.(data.document.id, data.document.title, data.document.subject);
      }
      fetchDocs();
    } catch (err: any) {
      setError(err.message || "Failed to process document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <span>Document Hub & Textbook Upload</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Upload PDF lecture notes, syllabi, textbooks, and handwritten notes for instant AI study workflows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Uploader */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Upload className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              <span>Upload Study Material</span>
            </h3>

            {uploadSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Textbook indexed successfully! Instant study actions:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab?.("flashcards")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                  >
                    ⚡ Study 20+ Flashcards
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToNotes ? onNavigateToNotes() : setActiveTab?.("library")}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                  >
                    📚 10-Part Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab?.("mock_exams")}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                  >
                    🏆 University Exam
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document / Chapter Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unit 3 - Memory Management & Paging"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. DCME - Operating Systems"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select File (PDF, TXT, DOCX, Note Photo)
                </label>
                <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-center hover:border-cyan-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
                    id="fileUpload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer block">
                    <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {selectedFile ? selectedFile.name : "Click to choose or drag & drop"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">PDF, Text files, or Images</p>
                  </label>
                </div>
              </div>

              {/* Or paste syllabus text directly */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste Text / Chapter Excerpt
                </label>
                <textarea
                  rows={3}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste lecture notes, definitions, or textbook content directly..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>{loading ? "Processing Document..." : "Upload & Extract Text"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Uploaded Documents Library */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <span>Uploaded Library & Knowledge Base ({documents.length})</span>
            </h3>

            {loading && <AILoadingPulse message="Extracting and parsing document contents..." />}

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {doc.subject} • Format: <span className="uppercase text-slate-800 dark:text-slate-300 font-semibold">{doc.fileType}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fast Action Buttons Across All Platforms */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <button
                      onClick={() => {
                        onSelectDocument?.(doc.id, doc.title, doc.subject);
                        setActiveTab?.("flashcards");
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                    >
                      <Layers className="h-3 w-3" />
                      <span>Study Flashcards</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectDocument?.(doc.id, doc.title, doc.subject);
                        setActiveTab?.("mock_exams");
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
                    >
                      <Award className="h-3 w-3" />
                      <span>Mock University Exam</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectDocument?.(doc.id, doc.title, doc.subject);
                        setActiveTab?.("practice");
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 px-3 py-1.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-500/25 transition-colors cursor-pointer"
                    >
                      <Zap className="h-3 w-3" />
                      <span>5/10M Model Answers</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectDocument?.(doc.id, doc.title, doc.subject);
                        setActiveTab?.("nexa");
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-colors cursor-pointer"
                    >
                      <Brain className="h-3 w-3" />
                      <span>Ask Nexa Tutor</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectDocument?.(doc.id, doc.title, doc.subject);
                        if (onNavigateToNotes) onNavigateToNotes();
                        else setActiveTab?.("library");
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>AI Revision Notes</span>
                    </button>
                  </div>
                </div>
              ))}

              {documents.length === 0 && !loading && (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No documents uploaded yet. Upload your first textbook chapter or lecture notes on the left!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
