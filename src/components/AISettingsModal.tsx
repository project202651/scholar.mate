"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Key, CheckCircle, AlertCircle, Cpu, ExternalLink, ShieldCheck } from "lucide-react";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AISettingsModal({ isOpen, onClose }: AISettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");

  useEffect(() => {
    if (isOpen) {
      checkCurrentStatus();
    }
  }, [isOpen]);

  const checkCurrentStatus = async () => {
    try {
      const res = await fetch("/api/ai/save-key");
      if (res.ok) {
        const data = await res.json();
        setIsConfigured(data.isConfigured);
        setMaskedKey(data.maskedKey || "");
      }
    } catch {}
  };

  if (!isOpen) return null;

  const handleSaveAndVerify = async () => {
    if (!apiKey.trim()) {
      setStatus({ status: "error", message: "Please enter your Gemini API key from Google AI Studio." });
      return;
    }

    setTesting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/ai/save-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          status: "success",
          message: data.message,
          model: data.model,
        });
        setIsConfigured(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("scholarmate_gemini_key", apiKey.trim());
        }
        checkCurrentStatus();
      } else {
        setStatus({
          status: "error",
          message: data.error || "Failed to verify key with Google Gemini servers.",
        });
      }
    } catch (e: any) {
      setStatus({ status: "error", message: e.message || "Network error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Gemini AI Engine</h3>
            <p className="text-xs text-slate-400">Accurate Real-Time Academic Intelligence</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Status Badge */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-xs text-slate-400">Current AI Status:</span>
            {isConfigured ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Connected ({maskedKey})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Key Required</span>
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <Key className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Free key from Google:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline inline-flex items-center gap-0.5 font-medium"
              >
                Get Gemini Key at Google AI Studio <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
          </div>

          {status && (
            <div
              className={`rounded-xl border p-3 text-xs ${
                status.status === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {status.status === "success" ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{status.message}</p>
                  {status.model && (
                    <p className="text-[10px] opacity-80 mt-0.5">Verified Model: {status.model}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-cyan-300 block mb-0.5 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Genuine AI Generation
            </strong>
            ScholarMate connects directly to Google Gemini models (Gemini 2.5 Flash / 2.0 Flash) to provide exact, scientifically and technically accurate answers to every question you ask.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveAndVerify}
              disabled={testing}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{testing ? "Verifying with Google..." : "Save & Verify Key"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
