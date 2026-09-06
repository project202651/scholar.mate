'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, RotateCcw, Check, Sparkles, ChevronLeft, ChevronRight, 
  Award, Plus, Brain, Clock, Zap, CheckCircle2, AlertCircle, BookOpen, Lightbulb, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AILoadingPulse from './AILoadingPulse';
import { aiFetch } from '@/lib/clientFetch';

interface Flashcard {
  id?: string;
  front: string;
  back: string;
  humanExplanation?: string;
  analogy?: string;
  examinerTip?: string;
  example?: string;
  category?: string;
  mastered?: boolean;
  intervalDays?: number;
  lastReviewed?: string;
  confidenceScore?: number;
}

interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
}

interface FlashcardsViewProps {
  initialDocumentId?: string;
  initialSubject?: string;
  initialTopic?: string;
}

export default function FlashcardsView({
  initialDocumentId,
  initialSubject,
  initialTopic,
}: FlashcardsViewProps) {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTopic, setNewTopic] = useState(initialTopic || '');
  const [newSubject, setNewSubject] = useState(initialSubject || 'Engineering & Polytechnic');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocumentId || '');
  const [showHumanBreakdown, setShowHumanBreakdown] = useState(true);

  const FLASHCARD_PRESETS = [
    { topic: 'Process Scheduling & Deadlock Conditions', subject: 'Operating Systems' },
    { topic: 'B-Trees, AVL Balancing & Heap Operations', subject: 'Data Structures & Algorithms' },
    { topic: 'TCP/IP 4-Layer Model & Subnetting CIDR', subject: 'Computer Networks' },
    { topic: 'Relational Algebra, SQL Joins & Normalization', subject: 'Database Management' },
  ];

  useEffect(() => {
    fetchDecks();
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (initialDocumentId) {
      setSelectedDocId(initialDocumentId);
    }
    if (initialSubject) setNewSubject(initialSubject);
    if (initialTopic) setNewTopic(initialTopic);
  }, [initialDocumentId, initialSubject, initialTopic]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents/upload');
      if (res.ok) {
        const data = await res.json();
        if (data.documents) {
          setDocuments(data.documents);
          if (!selectedDocId && initialDocumentId) {
            setSelectedDocId(initialDocumentId);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/ai/flashcards');
      if (res.ok) {
        const data = await res.json();
        if (data.decks && data.decks.length > 0) {
          setDecks(data.decks);
        } else if (initialDocumentId) {
          // Auto-generate for the active textbook
          handleCreateWithDocument(initialDocumentId, initialSubject, initialTopic);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateWithPreset = async (presetTopic: string, presetSubject: string) => {
    setLoading(true);
    try {
      const res = await aiFetch('/api/ai/flashcards', {
        method: 'POST',
        body: JSON.stringify({
          topic: presetTopic,
          subject: presetSubject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.deck) {
        setDecks(prev => [data.deck, ...prev]);
        setCurrentDeckIndex(0);
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWithDocument = async (docId?: string, docSubject?: string, docTitle?: string) => {
    const targetDocId = docId || selectedDocId;
    if (!targetDocId) return;
    const doc = documents.find(d => d.id === targetDocId);
    const title = docTitle || doc?.title || newTopic || 'Textbook Active Recall';
    const subject = docSubject || doc?.subject || newSubject || 'Engineering';

    setLoading(true);
    setShowCreateModal(false);
    try {
      const res = await aiFetch('/api/ai/flashcards', {
        method: 'POST',
        body: JSON.stringify({
          documentId: targetDocId,
          topic: title,
          subject: subject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.deck) {
        setDecks(prev => [data.deck, ...prev]);
        setCurrentDeckIndex(0);
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() && !selectedDocId) return;

    setLoading(true);
    setShowCreateModal(false);
    try {
      const res = await aiFetch('/api/ai/flashcards', {
        method: 'POST',
        body: JSON.stringify({
          topic: newTopic || 'Textbook Recall Deck',
          subject: newSubject,
          documentId: selectedDocId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.deck) {
        setDecks([data.deck, ...decks]);
        setCurrentDeckIndex(0);
        setCardIndex(0);
        setIsFlipped(false);
        setNewTopic('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentDeck = decks[currentDeckIndex] || null;
  const cards = currentDeck?.cards || [];
  const currentCard = cards[cardIndex] || null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Spaced Repetition Rating Handler (SM-2 inspired)
  const handleRateCard = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard || !currentDeck) return;

    let intervalDays = 1;
    let confidence = 50;

    switch (rating) {
      case 'again':
        intervalDays = 0;
        confidence = 20;
        break;
      case 'hard':
        intervalDays = 1;
        confidence = 50;
        break;
      case 'good':
        intervalDays = 3;
        confidence = 80;
        break;
      case 'easy':
        intervalDays = 7;
        confidence = 100;
        break;
    }

    const updatedCards = [...cards];
    updatedCards[cardIndex] = {
      ...currentCard,
      mastered: rating === 'easy' || rating === 'good',
      intervalDays,
      confidenceScore: confidence,
      lastReviewed: new Date().toISOString()
    };

    const updatedDeck = { ...currentDeck, cards: updatedCards };
    const updatedDecks = [...decks];
    updatedDecks[currentDeckIndex] = updatedDeck;
    setDecks(updatedDecks);

    // Persist
    try {
      await fetch('/api/ai/flashcards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: currentDeck.id,
          cards: updatedCards,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    // Auto Advance
    handleNext();
  };

  const masteredCount = cards.filter((c: any) => c.mastered).length;
  const progressPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">Spaced Repetition Flashcards 2.0</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 border border-white/20">
                SM-2 RECALL ENGINE
              </span>
            </div>
            <p className="text-xs text-purple-100">
              Active recall cards calibrated to forgetfulness curves. Rate each card to schedule automatic reviews.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 text-purple-700" />
            <span>Generate Deck</span>
          </button>
        </div>

        {/* 1-Click Presets */}
        <div className="mt-5 pt-4 border-t border-white/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200 block mb-2">
            ⚡ Quick Generate by Subject:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {FLASHCARD_PRESETS.map((p, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleCreateWithPreset(p.topic, p.subject)}
                className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-left text-xs font-medium text-white hover:bg-white/20 active:scale-95 disabled:opacity-50 transition-all group backdrop-blur-md"
              >
                <span className="text-[10px] uppercase font-bold text-amber-300 block mb-0.5">
                  {p.subject}
                </span>
                <span className="line-clamp-1 group-hover:text-white transition-colors">
                  {p.topic}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Textbook Source Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Active Knowledge Source</span>
            <select
              value={selectedDocId}
              onChange={(e) => {
                const docId = e.target.value;
                setSelectedDocId(docId);
                const matched = documents.find(d => d.id === docId);
                if (matched) {
                  setNewSubject(matched.subject);
                  setNewTopic(matched.title);
                }
              }}
              className="mt-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white outline-none max-w-[280px] sm:max-w-[340px] truncate"
            >
              <option value="">-- Custom Topic (No Textbook) --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.title} ({doc.subject})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedDocId ? (
          <button
            onClick={() => handleCreateWithDocument(selectedDocId)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Deck From Textbook</span>
          </button>
        ) : (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Custom Topic Deck</span>
          </button>
        )}
      </div>

      {/* Deck Selector Tabs */}
      {decks.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {decks.map((deck, idx) => (
            <button
              key={deck.id || idx}
              onClick={() => {
                setCurrentDeckIndex(idx);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                currentDeckIndex === idx
                  ? 'border-purple-500 bg-purple-950/60 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {deck.title}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 shadow-2xl flex items-center justify-center min-h-[360px]">
          <AILoadingPulse message="Nexa AI is synthesizing high-yield active recall cards with derivations..." />
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Progress bar & Retention Metric */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 shadow-sm backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Deck Mastery: {masteredCount} of {cards.length} Cards Mastered
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {currentCard.intervalDays !== undefined && (
              <div className="shrink-0 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-purple-600 dark:text-purple-300 uppercase font-bold block">Next Review</span>
                <span className="text-xs font-black text-purple-700 dark:text-purple-200">
                  {currentCard.intervalDays === 0 ? 'Today' : `in ${currentCard.intervalDays}d`}
                </span>
              </div>
            )}
          </div>

          {/* 3D Animated Card */}
          <div className="relative min-h-[380px] sm:min-h-[430px] w-full [perspective:1200px]">
            <motion.div
              onClick={handleFlip}
              className="relative h-full w-full cursor-pointer [transform-style:preserve-3d] transition-all duration-700"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50 p-6 sm:p-8 shadow-xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-100 dark:bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    {currentCard.category || currentDeck.subject}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Card {cardIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-auto text-center px-2 sm:px-4 py-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 block">
                    Exam Concept / Active Question
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                    <RotateCcw className="h-3.5 w-3.5" /> Click anywhere to flip & see answer
                  </span>
                  {currentCard.mastered && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* BACK OF CARD (Answer, Human Explanation, Analogy & Tips) */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-purple-400/50 bg-gradient-to-br from-white via-purple-50 to-indigo-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                    Authoritative Answer & Derivation
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Card {cardIndex + 1} of {cards.length}
                  </span>
                </div>

                {/* Scrollable Rich Breakdown Container */}
                <div className="my-auto text-left px-2 sm:px-4 overflow-y-auto max-h-[250px] space-y-3 no-scrollbar py-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                      Core Answer & Formula:
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                      {currentCard.back}
                    </p>
                  </div>

                  {currentCard.humanExplanation && (
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 mb-1">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>Plain-English Human Explanation:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentCard.humanExplanation}
                      </p>
                    </div>
                  )}

                  {currentCard.analogy && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                      <span className="font-bold text-cyan-700 dark:text-cyan-300 block mb-0.5">
                        💭 Real-World Analogy:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentCard.analogy}
                      </p>
                    </div>
                  )}

                  {currentCard.examinerTip && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                        🎯 Examiner Scoring Tip:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentCard.examinerTip}
                      </p>
                    </div>
                  )}

                  {currentCard.example && (
                    <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                        🔬 Concrete Application:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentCard.example}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <RotateCcw className="h-3.5 w-3.5" /> Click to flip back
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    Rate recall below ↓
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Spaced Repetition Rating Buttons (Visible when flipped or ready) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              Spaced Repetition Feedback (Schedules Next Recall)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleRateCard('again')}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Again (<span className="underline">&lt;10m</span>)</span>
                <span className="text-[10px] font-normal text-rose-500">Reset Interval</span>
              </button>

              <button
                onClick={() => handleRateCard('hard')}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Hard (1 day)</span>
                <span className="text-[10px] font-normal text-amber-500">Review Tomorrow</span>
              </button>

              <button
                onClick={() => handleRateCard('good')}
                className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Good (3 days)</span>
                <span className="text-[10px] font-normal text-blue-500">On Track</span>
              </button>

              <button
                onClick={() => handleRateCard('easy')}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Easy (7 days)</span>
                <span className="text-[10px] font-normal text-emerald-500">Mastered</span>
              </button>
            </div>
          </div>

          {/* Simple Navigation Toolbar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleFlip}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center text-slate-400">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Flashcard Decks Available</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 cursor-pointer"
          >
            Create Your First Deck
          </button>
        </div>
      )}

      {/* Modal for Creating New Deck */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Generate AI Flashcard Deck</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter any syllabus topic to generate 10-15 active recall cards with formula derivations and models.
            </p>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              {documents.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select From Uploaded Textbooks
                  </label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => {
                      const docId = e.target.value;
                      setSelectedDocId(docId);
                      const matched = documents.find(d => d.id === docId);
                      if (matched) {
                        setNewSubject(matched.subject);
                        setNewTopic(matched.title);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">-- Or Enter Custom Topic Below --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        📄 {doc.title} ({doc.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Chapter Name
                </label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Relational Database Keys & Normal Forms"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Branch
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Operating Systems / DBMS"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Generate Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
