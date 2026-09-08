'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogIn, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import ThreeBackground from '@/components/ThreeBackground';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/app');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    try {
      localStorage.setItem('scholarmate_demo_mode', 'true');
    } catch (e) {}
    router.push('/app?demo=true');
  };

  return (
    <div className="relative min-h-screen bg-[#0b1220] text-[#f5f7fb] flex flex-col justify-between selection:bg-[#54d6c7] selection:text-slate-950 font-sans">
      <ThreeBackground theme="dark" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">ScholarMate</span>
              <span className="block text-[10px] text-slate-400 font-medium leading-none">AI Exam Preparation</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="rounded-xl border border-[#54d6c7]/40 bg-[#54d6c7]/10 px-4 py-2 text-xs font-bold text-[#54d6c7] hover:bg-[#54d6c7]/20 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#111c2e]/95 p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7]/20 to-[#8b5cf6]/20 border border-[#54d6c7]/30 text-[#54d6c7] mb-1">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Welcome Back</h1>
              <p className="text-xs text-slate-400">
                Log in to access your personalized exam plan and AI coach
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Student Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black py-3 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#111c2e] px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Or Continue As
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 text-xs transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#54d6c7]" />
              <span>Explore as Guest / Try Demo</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            AANM & VVRSR Polytechnic Academic Final Year Project (2026-2027)
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs text-slate-400">
        ScholarMate AI • Developed by Vastav, Vishnu, Nikhileswar, Sathvik
      </footer>
    </div>
  );
}
