"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Sparkles, Clock, CheckCircle2, BookOpen, ChevronRight, Plus } from "lucide-react";
import AILoadingPulse from "./AILoadingPulse";
import { aiFetch } from "@/lib/clientFetch";

export default function StudyScheduleView() {
  const [targetExam, setTargetExam] = useState("State Board Diploma Final Exams 2026-2027");
  const [examDate, setExamDate] = useState("2026-11-20");
  const [subjects, setSubjects] = useState(
    "Data Structures, Operating Systems, Computer Networks, Software Engineering"
  );
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<any>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/ai/schedule");
      if (res.ok) {
        const data = await res.json();
        if (data.schedules && data.schedules.length > 0) {
          setSchedules(data.schedules);
          setCurrentSchedule(data.schedules[0]);
        } else {
          setSchedules([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateNewSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiFetch("/api/ai/schedule", {
        method: "POST",
        body: JSON.stringify({
          targetExam,
          examDate,
          subjects,
        }),
      });
      const data = await res.json();
      if (res.ok && data.schedule) {
        setSchedules([data.schedule, ...schedules]);
        setCurrentSchedule(data.schedule);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <span>AI Study Timetable & Exam Countdown</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Optimized, balanced revision schedule customized for your upcoming board examination
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Exam Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Configure Exam Plan</span>
            </h3>

            <form onSubmit={handleCreateNewSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Exam
                </label>
                <input
                  type="text"
                  required
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  placeholder="e.g. Diploma Board Semester Exam"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Exam Start Date
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subjects to Cover (comma-separated)
                </label>
                <textarea
                  rows={3}
                  required
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g. Operating Systems, Computer Networks, DBMS"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? "Generating Plan..." : "Generate AI Timetable"}</span>
              </button>
            </form>
          </div>

          {/* Countdown Card */}
          {currentSchedule && (
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/90 p-5 shadow-xl backdrop-blur-md text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Exam Countdown
              </span>
              <div className="my-2">
                <span className="text-4xl font-extrabold text-white">
                  {currentSchedule.daysRemaining || 45}
                </span>
                <span className="text-xs text-emerald-400 font-bold ml-1">Days Left</span>
              </div>
              <p className="text-xs text-slate-300">{currentSchedule.targetExam}</p>
              <p className="text-[11px] text-slate-500 mt-1">Target Date: {currentSchedule.examDate}</p>
            </div>
          )}
        </div>

        {/* Right Column: Timetable Days */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-12 shadow-xl flex items-center justify-center min-h-[380px]">
              <AILoadingPulse message="AI is calculating syllabus pacing and scheduling revision slots..." />
            </div>
          ) : currentSchedule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Structured Day-by-Day Study Routine</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {currentSchedule.plan?.length || 0} Revision Blocks
                </span>
              </div>

              <div className="space-y-4">
                {currentSchedule.plan?.map((block: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                          {block.day}
                        </span>
                        <h4 className="text-sm font-bold text-white">{block.focusSubject}</h4>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{block.durationMinutes} Minutes</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium mb-3">
                      🎯 <strong className="text-white">Core Topic:</strong> {block.topic}
                    </p>

                    <div className="space-y-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Recommended Milestone Tasks:
                      </span>
                      {block.tasks?.map((task: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
              <p>Configure your target exam on the left to generate your custom timetable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
