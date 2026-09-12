'use client';

import React from 'react';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';
import { Sprout, Sparkles, SunMedium } from 'lucide-react';

interface AppShellProps {
  title?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function AppShell({ title, rightSlot, children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-[100dvh] bg-[#0c1410] text-emerald-50 flex flex-col relative overflow-x-hidden font-sans selection:bg-emerald-600/30 selection:text-emerald-200">
      {/* Background Soft Natural Amber/Green Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-700/15 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] bg-amber-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0c1410]/85 backdrop-blur-xl border-b border-emerald-950/80 transition-all duration-300">
        <div className="flex items-center justify-between h-15 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/20">
              <Sprout className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white leading-none">
                  {title ?? 'BrodyAgri'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-medium tracking-wide text-emerald-300/70">
                Sahabat Tani Pemula
              </span>
            </div>
          </div>
          {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-5 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Bottom Nav */}
      {!hideNav && <BottomNav />}
    </div>
  );
}