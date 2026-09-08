'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  BookOpen,
  Sparkles,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  Eye,
  RefreshCw,
  File,
  Check,
  Zap,
  ListOrdered
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Document {
  id: string;
  title: string;
  subject: string;
  fileType: string;
  createdAt: string;
  textPreview?: string;
}

interface DocHubViewProps {
  setActiveTab?: (tab: string) => void;
  onSelectDocument?: (docId: string, title?: string, subject?: string) => void;
  onNavigateToNotes?: (docId: string) => void;
  onNavigateToFlashcards?: (docId: string) => void;
  onNavigateToMock?: (docId: string) => void;
}

const PROCESSING_STEPS = [
  "Reading document & tokenizing pages",
  "Detecting course subjects & modules",
  "Extracting core syllabus topics & formulas",
  "Creating 15-question active recall bank",
  "Building personalized study plan"
];

export default function DocHubView({
  onSelectDocument,
  onNavigateToNotes,
  onNavigateToFlashcards,
  onNavigateToMock
}: DocHubViewProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const [titleInput, setTitleInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [rawTextInput, setRawTextInput] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "paste">("file");

  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await fetch("/api/documents/upload");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!titleInput) setTitleInput(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!titleInput) setTitleInput(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === "file" && !selectedFile) return;
    if (uploadMode === "paste" && !rawTextInput.trim()) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadStep(0);

    // Simulated step progression for user feedback
    const stepInterval = setInterval(() => {
      setUploadStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 450);

    const formData = new FormData();
    if (uploadMode === "file" && selectedFile) {
      formData.append("file", selectedFile);
    } else {
      formData.append("rawText", rawTextInput);
    }
    formData.append("title", titleInput.trim() || (selectedFile ? selectedFile.name : "Study Material"));
    formData.append("subject", subjectInput.trim() || "Computer Engineering");

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(stepInterval);
      setUploadStep(4);

      if (res.ok) {
        const data = await res.json();
        setUploadSuccess(`Successfully processed "${data.document.title}" into your study plan!`);
        setSelectedFile(null);
        setTitleInput("");
        setSubjectInput("");
        setRawTextInput("");
        fetchDocuments();

        if (onSelectDocument) {
          onSelectDocument(data.document.id, data.document.title, data.document.subject);
        }
      } else {
        const errData = await res.json();
        setUploadError(errData.error || "Failed to upload document. Please login first.");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setUploadError(err.message || "Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Document Ingestion & AI Synthesis Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Study Library & Document Upload
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Upload PDF textbooks, handwritten notes, Word documents, or past question papers. ScholarMate automatically extracts topics, builds active recall flashcards, and structures 10-mark model answers.
          </p>
        </div>
      </div>

      {/* Upload Zone & Method Switcher */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-sm sm:text-base font-extrabold text-white">
            Ingest Study Materials
          </h2>
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 text-xs font-bold">
            <button
              onClick={() => setUploadMode("file")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                uploadMode === "file" ? "bg-[#54d6c7] text-slate-950" : "text-slate-400"
              }`}
            >
              Upload Files
            </button>
            <button
              onClick={() => setUploadMode("paste")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                uploadMode === "paste" ? "bg-[#54d6c7] text-slate-950" : "text-slate-400"
              }`}
            >
              Paste Text / Notes
            </button>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Operating Systems Chapter 4 - Memory"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0b1220] text-xs sm:text-sm text-white focus:outline-none focus:border-[#54d6c7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Course</label>
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="e.g. Operating Systems, Machine Learning"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0b1220] text-xs sm:text-sm text-white focus:outline-none focus:border-[#54d6c7]"
              />
            </div>
          </div>

          {uploadMode === "file" ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#54d6c7] bg-[#54d6c7]/10"
                  : "border-white/15 bg-[#0b1220]/70 hover:border-white/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 rounded-2xl bg-[#54d6c7]/10 text-[#54d6c7]">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {selectedFile ? selectedFile.name : "Drag & drop your textbook, notes, or past papers here"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PDF, Word (.docx), Images, and TXT files (Max 50MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Paste Text Excerpt / Syllabus</label>
              <textarea
                rows={6}
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="Paste chapter notes, syllabus bullet points, or past exam questions..."
                className="w-full p-4 rounded-2xl border border-white/10 bg-[#0b1220] text-xs sm:text-sm text-white focus:outline-none focus:border-[#54d6c7]"
              />
            </div>
          )}

          {/* 5-Step Processing Progress Workflow State */}
          {uploading && (
            <div className="rounded-2xl border border-[#54d6c7]/30 bg-[#54d6c7]/5 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#54d6c7] font-bold">
                <span>AI Ingestion Workflow Active</span>
                <span>Step {uploadStep + 1} of 5</span>
              </div>

              <div className="space-y-2">
                {PROCESSING_STEPS.map((stepText, idx) => {
                  const isDone = uploadStep > idx;
                  const isCurrent = uploadStep === idx;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-[#70d6a8] shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-[#54d6c7] shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className={isCurrent ? "font-bold text-white" : isDone ? "text-slate-400" : "text-slate-600"}>
                        {stepText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-[#70d6a8]/15 border border-[#70d6a8]/30 text-xs text-[#70d6a8] flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-2xl bg-[#f47c7c]/15 border border-[#f47c7c]/30 text-xs text-[#f47c7c] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || (uploadMode === "file" && !selectedFile) || (uploadMode === "paste" && !rawTextInput.trim())}
              className="flex items-center gap-2 rounded-2xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-40 text-slate-950 font-black px-7 py-3 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{uploading ? "Synthesizing Document..." : "Upload & Generate Study Plan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Your Indexed Documents ({documents.length})
          </h3>
          <button onClick={fetchDocuments} className="text-xs text-[#54d6c7] hover:underline flex items-center gap-1 cursor-pointer">
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </button>
        </div>

        {loadingDocs ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading your library...</div>
        ) : documents.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-8 text-center text-xs text-slate-400 space-y-2">
            <FolderOpen className="h-8 w-8 text-slate-500 mx-auto" />
            <p className="font-bold text-white">No documents uploaded yet</p>
            <p className="text-[11px]">Upload your textbook chapters or past question papers above to start generating AI study notes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-3 hover:border-[#54d6c7]/40 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 text-[#54d6c7]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] rounded px-2 py-0.5 bg-white/5 text-slate-400 font-mono">
                    {doc.fileType.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{doc.title}</h4>
                  <p className="text-[11px] text-[#54d6c7] font-medium">{doc.subject}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs">
                  <button
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc.id, doc.title, doc.subject);
                      if (onNavigateToNotes) onNavigateToNotes(doc.id);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] transition-all cursor-pointer text-center"
                  >
                    View Notes
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc.id, doc.title, doc.subject);
                      if (onNavigateToFlashcards) onNavigateToFlashcards(doc.id);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[#54d6c7]/15 hover:bg-[#54d6c7]/25 text-[#54d6c7] font-bold text-[11px] transition-all cursor-pointer text-center"
                  >
                    Flashcards
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
