"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle, Flame, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function DailyTasksView() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("DCME");
  const [newPriority, setNewPriority] = useState("high");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          subject: newSubject,
          priority: newPriority,
        }),
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks([data.task, ...tasks]);
        setNewTitle("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: any) => {
    const nextCompleted = !task.completed;
    const updated = tasks.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t));
    setTasks(updated);

    // If all tasks are completed, celebrate!
    const allCompleted = updated.every((t) => t.completed);
    if (nextCompleted && allCompleted) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          completed: nextCompleted,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    try {
      await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-400" />
            <span>Daily Study Tasks & Habit Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build consistent study habits every day for guaranteed examination distinction
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-bounce" />
          <span>Active Streak Habit</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-300">
            Today's Completion: {completedCount} of {tasks.length} Tasks
          </span>
          <span className="text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-cyan-400" />
          <span>Add New Study Task</span>
        </h3>

        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Practice 5-Mark Question on Banker's Algorithm"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject (e.g. DCME)"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <button
              type="submit"
              disabled={loading || !newTitle.trim()}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-md backdrop-blur-md transition-all ${
              task.completed
                ? "border-emerald-500/30 bg-emerald-950/20 opacity-75"
                : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
            }`}
          >
            <button
              onClick={() => handleToggleTask(task)}
              className="flex items-center gap-3 text-left flex-1 group"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              )}

              <div>
                <p
                  className={`text-xs sm:text-sm font-semibold transition-all ${
                    task.completed ? "line-through text-slate-400" : "text-white"
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    {task.subject}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      task.priority === "high"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : task.priority === "medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500 text-xs">
            No active tasks. Add your first study task above to track your daily progress!
          </div>
        )}
      </div>
    </div>
  );
}
