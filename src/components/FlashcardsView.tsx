"use client";

import React, { useState, useEffect } from "react";
import { Layers, RotateCcw, Check, Sparkles, ChevronLeft, ChevronRight, Award, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

export default function FlashcardsView() {
  const [decks, setDecks] = useState<any[]>([]);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubject, setNewSubject] = useState("Artificial Intelligence & Machine Learning (AI & ML)");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const FLASHCARD_PRESETS = [
    { topic: "Machine Learning Algorithms & Loss Functions", subject: "Machine Learning (AI & ML)" },
    { topic: "Neural Networks & Activation Functions", subject: "Deep Learning (AI & ML)" },
    { topic: "Convolutional Neural Networks & Computer Vision", subject: "Computer Vision (AI & ML)" },
    { topic: "NLP, Word Embeddings & Transformers", subject: "Natural Language Processing (AI & ML)" },
  ];

  const handleCreateWithPreset = async (presetTopic: string, presetSubject: string) => {
    setLoading(true);
    try {
      const res = await aiFetch("/api/ai/flashcards", {
        method: "POST",
        body: JSON.stringify({
          topic: presetTopic,
          subject: presetSubject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.deck) {
        setDecks([data.deck, ...decks]);
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

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await fetch("/api/ai/flashcards");
      if (res.ok) {
        const data = await res.json();
        if (data.decks && data.decks.length > 0) {
          setDecks(data.decks);
        } else {
          setDecks([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setLoading(true);
    setShowCreateModal(false);
    try {
      const res = await aiFetch("/api/ai/flashcards", {
        method: "POST",
        body: JSON.stringify({
          topic: newTopic,
          subject: newSubject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.deck) {
        setDecks([data.deck, ...decks]);
        setCurrentDeckIndex(0);
        setCardIndex(0);
        setIsFlipped(false);
        setNewTopic("");
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

  const toggleMastered = async () => {
    if (!currentCard || !currentDeck) return;

    const updatedCards = [...cards];
    updatedCards[cardIndex] = {
      ...currentCard,
      mastered: !currentCard.mastered,
    };

    const updatedDeck = { ...currentDeck, cards: updatedCards };
    const updatedDecks = [...decks];
    updatedDecks[currentDeckIndex] = updatedDeck;
    setDecks(updatedDecks);

    try {
      await fetch("/api/ai/flashcards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId: currentDeck.id,
          cards: updatedCards,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const masteredCount = cards.filter((c: any) => c.mastered).length;
  const progressPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-400" />
            <span>3D Interactive Flashcards</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active recall with 3D card flips — strengthen memory retention for polytechnic exams
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Flashcard Deck</span>
        </button>
      </div>

      {/* 1-Click AI & ML Flashcard Presets */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Instant AI & ML Flashcard Decks (12-16 Active Recall Cards)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">1-Click Generate with Real Gemini AI</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {FLASHCARD_PRESETS.map((p, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleCreateWithPreset(p.topic, p.subject)}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-left text-xs font-medium text-slate-200 hover:border-purple-500/60 hover:bg-slate-800/90 active:scale-95 disabled:opacity-50 transition-all group"
            >
              <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">
                {p.subject.split("(")[0]}
              </span>
              <span className="line-clamp-1 group-hover:text-white transition-colors">
                {p.topic}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deck Selector Tabs */}
      {decks.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {decks.map((deck, idx) => (
            <button
              key={deck.id || idx}
              onClick={() => {
                setCurrentDeckIndex(idx);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                currentDeckIndex === idx
                  ? "border-purple-500 bg-purple-950/50 text-white shadow-sm"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              {deck.title}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 shadow-2xl flex items-center justify-center min-h-[360px]">
          <AILoadingPulse message="AI is generating high-yield active recall flashcards..." />
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">
                Deck Mastery: {masteredCount} of {cards.length} Cards
              </span>
              <span className="text-purple-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3D Animated Card */}
          <div className="relative h-[340px] sm:h-[380px] w-full [perspective:1200px]">
            <motion.div
              onClick={handleFlip}
              className="relative h-full w-full cursor-pointer [transform-style:preserve-3d] transition-all duration-700"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 p-8 shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
                    {currentCard.category || currentDeck.subject}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Card {cardIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-auto text-center px-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                    Question / Concept
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                  <span className="flex items-center gap-1 text-purple-400">
                    <RotateCcw className="h-3.5 w-3.5" /> Click anywhere to flip
                  </span>
                  {currentCard.mastered && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="h-3.5 w-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* BACK OF CARD (Answer) */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-indigo-500/50 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/60 p-8 shadow-2xl backdrop-blur-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                    Model Explanation & Formula
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Card {cardIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <RotateCcw className="h-3.5 w-3.5" /> Click to flip back
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered();
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                      currentCard.mastered
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{currentCard.mastered ? "Mastered" : "Mark Mastered"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls Bottom Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleFlip}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
          <p className="text-sm font-semibold text-slate-300">No Flashcard Decks Available</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
          >
            Create Your First Deck
          </button>
        </div>
      )}

      {/* Modal for Creating New Deck */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Generate AI Flashcard Deck</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter any polytechnic diploma subject or chapter to create active recall flashcards.
            </p>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic / Chapter
                </label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Relational Database Keys & Normal Forms"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject / Branch
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. DBMS / DCME"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110"
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
