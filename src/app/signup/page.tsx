'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, UserPlus, ArrowRight, Lock, Mail, User, School, Sparkles, CheckCircle2 } from 'lucide-react';
import ThreeBackground from '@/components/ThreeBackground';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: 'AANM & VVRSR Polytechnic College',
    department: 'Artificial Intelligence & Machine Learning (AI & ML)',
    year: 'Final Year (2026-2027)'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Automatically route to /app with onboarding flag
      router.push('/app?onboarding=true');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#111c2e]/95 p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7]/20 to-[#8b5cf6]/20 border border-[#54d6c7]/30 text-[#54d6c7] mb-1">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Create Student Account</h1>
              <p className="text-xs text-slate-400">
                Join ScholarMate to generate your personalized AI exam strategy
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vastav"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Student Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vastav@student.aanm.edu"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="•••••••• (Min. 6 characters)"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Department / Branch</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2.5 text-xs text-white focus:border-[#54d6c7] focus:outline-none"
                  >
                    <option value="Artificial Intelligence & Machine Learning (AI & ML)">Artificial Intelligence & ML</option>
                    <option value="Computer Science & Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Comm.</option>
                    <option value="Mechanical Engineering">Mechanical Engg.</option>
                    <option value="Civil Engineering">Civil Engg.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Academic Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2.5 text-xs text-white focus:border-[#54d6c7] focus:outline-none"
                  >
                    <option value="Final Year (2026-2027)">Final Year (2026-2027)</option>
                    <option value="3rd Year (Semester 5/6)">3rd Year</option>
                    <option value="2nd Year (Semester 3/4)">2nd Year</option>
                    <option value="1st Year (Semester 1/2)">1st Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Institution / College</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1220] pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#54d6c7] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black py-3.5 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Setting up your profile...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Create Account & Start Onboarding</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
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
