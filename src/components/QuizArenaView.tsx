"use client";

import React, { useState, useEffect } from "react";
import { Award, Sparkles, Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight, Brain } from "lucide-react";
import confetti from "canvas-confetti";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

export default function QuizArenaView() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Artificial Intelligence & Machine Learning (AI & ML)");
  const [loading, setLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds

  const QUIZ_PRESETS = [
    { topic: "Machine Learning Foundations & Supervised Algorithms", subject: "Machine Learning (AI & ML)" },
    { topic: "Neural Networks, Backprop & Optimization", subject: "Deep Learning (AI & ML)" },
    { topic: "Computer Vision & CNN Feature Extraction", subject: "Computer Vision (AI & ML)" },
    { topic: "NLP, Sentiment Analysis & Transformer Models", subject: "Natural Language Processing (AI & ML)" },
  ];

  const handleCreateWithPreset = async (presetTopic: string, presetSubject: string) => {
    setLoading(true);
    try {
      const res = await aiFetch("/api/ai/quiz", {
        method: "POST",
        body: JSON.stringify({
          topic: presetTopic,
          subject: presetSubject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.quiz) {
        startQuizWithData(data.quiz);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentQuiz || isQuizFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuiz, isQuizFinished, timeLeft]);

  const handleCreateCustomQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await aiFetch("/api/ai/quiz", {
        method: "POST",
        body: JSON.stringify({
          topic,
          subject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.quiz) {
        startQuizWithData(data.quiz);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startQuizWithData = (quiz: any) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserScore(0);
    setIsQuizFinished(false);
    setTimeLeft(300);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered || isQuizFinished) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const q = currentQuiz.questions[currentQuestionIdx];
    if (optionIdx === q.answer) {
      setUserScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsQuizFinished(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    // Submit score to database
    if (currentQuiz?.id) {
      try {
        await fetch("/api/ai/quiz", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: currentQuiz.id,
            score: userScore,
            totalQuestions: currentQuiz.questions.length,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentQ = currentQuiz?.questions?.[currentQuestionIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            <span>AI Speed Quiz Arena</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test and measure your retention with automated exam MCQs and instant grading
          </p>
        </div>

        {currentQuiz && !isQuizFinished && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>
              Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 shadow-2xl flex items-center justify-center min-h-[380px]">
          <AILoadingPulse message="AI is generating multiple choice test questions..." />
        </div>
      ) : isQuizFinished ? (
        /* Quiz Finished Screen with Confetti & Score Card */
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-indigo-600 shadow-xl shadow-amber-500/20">
            <Award className="h-10 w-10 text-white" />
          </div>

          <div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              Quiz Completed!
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-3">
              Your Score: {userScore} / {currentQuiz?.questions?.length || 5}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Score Percentage:{" "}
              <strong className="text-cyan-400">
                {Math.round((userScore / (currentQuiz?.questions?.length || 5)) * 100)}%
              </strong>
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-left text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Performance Insight:</span>
            </p>
            <p>
              {userScore >= 4
                ? "🌟 Outstanding preparation! You have solid conceptual clarity on this unit."
                : userScore >= 3
                ? "👍 Good attempt! Revise the high-yield bullet points in Smart Notes to reach 100%."
                : "💡 Recommended: Revisit the 3D Flashcards and AI Doubt Solver before retesting."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startQuizWithData(currentQuiz)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake This Quiz</span>
            </button>
            <button
              onClick={() => {
                setTopic("");
                setCurrentQuiz(null);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110"
            >
              <Brain className="h-4 w-4" />
              <span>Create New Quiz Topic</span>
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Question Display */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Question progress */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">{currentQuiz.title}</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Current Score: <strong className="text-emerald-400">{userScore}</strong>
            </span>
          </div>

          {/* Question text */}
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;

              let style = "border-slate-800 bg-slate-800/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800";
              if (isAnswered) {
                if (isCorrect) {
                  style = "border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md shadow-emerald-500/10";
                } else if (isSelected && !isCorrect) {
                  style = "border-rose-500 bg-rose-500/20 text-rose-200";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left text-xs sm:text-sm font-medium transition-all ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="h-5 w-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 text-xs text-slate-300 space-y-1">
              <strong className="text-indigo-300 block font-semibold">Answer Explanation:</strong>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>
                  {currentQuestionIdx + 1 === currentQuiz.questions.length
                    ? "Complete Quiz"
                    : "Next Question"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Create New Quiz Form */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span>Generate Customized Practice Quiz</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Generates 8 to 10 comprehensive diploma exam questions with instant grading and explanations.
          </p>

          {/* 1-Click AI & ML Presets */}
          <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3.5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>Instant AI & ML Quizzes (1-Click Start)</span>
            </span>
            <div className="space-y-1.5">
              {QUIZ_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleCreateWithPreset(p.topic, p.subject)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-left text-xs font-medium text-slate-200 hover:border-amber-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <span className="line-clamp-1">{p.topic}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateCustomQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Quiz Topic / Chapter
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Microprocessors 8086 Instruction Set"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. DCME / Computer Engineering"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Generate 5-Question Speed Quiz</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
