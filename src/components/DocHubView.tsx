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
  Camera,
  Image as ImageIcon,
  FileSearch
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
  "Extracting raw optical text and mathematical equations...",
  "Running OCR neural parsing on handwritten notes & tables...",
  "Clustering concepts into 3-Mark, 7-Mark & 10-Mark question modules...",
  "Synthesizing active recall flashcards & executive revision digests...",
  "Finalizing structured knowledge index..."
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
  const [uploadMode, setUploadMode] = useState<"file" | "ocr" | "paste">("file");

  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

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
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setOcrImagePreview(url);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!titleInput) setTitleInput(file.name.replace(/\.[^/.]+$/, ""));
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setOcrImagePreview(url);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === "file" && !selectedFile) return;
    if (uploadMode === "ocr" && !selectedFile && !ocrImagePreview) return;
    if (uploadMode === "paste" && !rawTextInput.trim()) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadStep(0);

    const stepInterval = setInterval(() => {
      setUploadStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 450);

    const formData = new FormData();
    if ((uploadMode === "file" || uploadMode === "ocr") && selectedFile) {
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
        setUploadSuccess(`Successfully indexed "${data.document.title}" into your study plan!`);
        setSelectedFile(null);
        setOcrImagePreview(null);
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

  const handleSeedSample = () => {
    setTitleInput("Operating Systems Unit 3 - Paging & Virtual Memory");
    setSubjectInput("Operating Systems");
    setRawTextInput(`UNIT 3: MEMORY MANAGEMENT
1. Paging Architecture: Logical address split into Page Number (p) and Offset (d). Physical Address = (Frame Number * Page Size) + Offset.
2. Translation Lookaside Buffer (TLB): High-speed hardware cache. Effective Access Time (EAT) = Hit_Ratio * (TLB_access + Mem_access) + (1 - Hit_Ratio) * (TLB_access + 2 * Mem_access).
3. Page Replacement Algorithms: FIFO, Optimal (Belady's Min), and Least Recently Used (LRU). Belady's Anomaly occurs in FIFO.
4. Thrashing: Excessive paging activity caused when sum of working sets exceeds total physical memory frames.`);
    setUploadMode("paste");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Document Ingestion &amp; OCR Synthesis Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Study Library &amp; OCR Ingestion
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Upload PDF textbooks, handwritten notebook photos, Word documents, or past question papers. ScholarMate extracts concepts, maps question patterns, and generates exam-ready answers automatically.
          </p>
        </div>
      </div>

      {/* Upload Zone & Method Switcher */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="text-sm sm:text-base font-extrabold text-white">
            Ingest Study Materials
          </h2>

          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 text-xs font-bold">
            <button
              onClick={() => setUploadMode("file")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                uploadMode === "file" ? "bg-[#54d6c7] text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              PDF &amp; Word Docs
            </button>
            <button
              onClick={() => setUploadMode("ocr")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                uploadMode === "ocr" ? "bg-[#54d6c7] text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Handwritten OCR</span>
            </button>
            <button
              onClick={() => setUploadMode("paste")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                uploadMode === "paste" ? "bg-[#54d6c7] text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Paste Syllabus
            </button>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Document / Chapter Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Operating Systems Chapter 4 - Memory Management"
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

          {/* Standard File Upload */}
          {uploadMode === "file" && (
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
          )}

          {/* Handwritten Notes OCR Mode */}
          {uploadMode === "ocr" && (
            <div
              onClick={() => ocrInputRef.current?.click()}
              className="border-2 border-dashed border-[#54d6c7]/40 bg-[#54d6c7]/5 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all hover:bg-[#54d6c7]/10"
            >
              <input
                ref={ocrInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7]">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {selectedFile ? selectedFile.name : "Upload or snap photo of handwritten notebook pages"}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    AI OCR neural vision extracts handwriting, board formulas, and hand-drawn architecture sketches
                  </p>
                </div>

                {ocrImagePreview && (
                  <div className="mt-3 p-2 rounded-2xl border border-white/10 bg-black/50 max-w-xs">
                    <img src={ocrImagePreview} alt="Handwritten Note Preview" className="rounded-xl max-h-48 object-cover mx-auto" />
                    <span className="text-[10px] text-[#54d6c7] font-bold block mt-1">Photo Attached • Ready for OCR Processing</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paste Text Mode */}
          {uploadMode === "paste" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Paste Text Excerpt / Chapter Notes</label>
                <button
                  type="button"
                  onClick={handleSeedSample}
                  className="text-[11px] text-[#54d6c7] hover:underline font-bold cursor-pointer"
                >
                  Paste Sample Operating Systems Notes
                </button>
              </div>
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
              disabled={uploading || (uploadMode === "file" && !selectedFile) || (uploadMode === "ocr" && !selectedFile) || (uploadMode === "paste" && !rawTextInput.trim())}
              className="flex items-center gap-2 rounded-2xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-40 text-slate-950 font-black px-7 py-3 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{uploading ? "Synthesizing Document..." : "Process & Generate Exam Plan"}</span>
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
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-8 text-center text-xs text-slate-400 space-y-3">
            <FolderOpen className="h-10 w-10 text-slate-500 mx-auto" />
            <p className="font-bold text-white text-sm">No documents indexed yet</p>
            <p className="text-xs max-w-md mx-auto">Upload your textbook chapters, handwritten notebook photos, or past question papers above to start generating AI study notes.</p>
            <button
              type="button"
              onClick={handleSeedSample}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#54d6c7]/15 text-[#54d6c7] font-bold hover:bg-[#54d6c7]/25 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Load Sample Operating Systems Syllabus</span>
            </button>
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
