'use client';

import React from 'react';
import { LayoutDashboard, BookOpen, Bot, FileCheck2, FolderOpen, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'exam_center', label: 'Blueprint', icon: BookOpen },
    { id: 'nexa', label: 'Nexa AI', icon: Bot, isSpecial: true },
    { id: 'practice', label: 'Practice', icon: FileCheck2 },
    { id: 'library', label: 'Library', icon: FolderOpen },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-white/10 bg-[#0b1220]/95 backdrop-blur-2xl px-2 py-1.5 shadow-2xl safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label="Ask Nexa AI"
                className="relative -top-4 flex flex-col items-center justify-center p-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none rounded-full"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] via-[#2dd4bf] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/30 hover:scale-105 active:scale-95 transition-transform">
                  <Icon className="h-6 w-6 font-black" />
                </div>
                <span className="text-[10px] font-extrabold text-[#54d6c7] mt-0.5">Nexa AI</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-1 flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none ${
                isActive
                  ? 'text-[#54d6c7]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-[#54d6c7]' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
