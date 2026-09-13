'use client';

import React, { useEffect, useState } from 'react';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';
import { Sprout, Sun, Moon, Settings as SettingsIcon, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AppShellProps {
  title?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function AppShell({ title, rightSlot, children, hideNav = false }: AppShellProps) {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<string>('pearl');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('brodyagri-theme') || 'pearl';
    setCurrentTheme(saved);
  }, []);

  const toggleQuickTheme = () => {
    // Quick toggle between Clean Pearl (White) & Forest Obsidian (Hengker Dark)
    const nextTheme = currentTheme === 'pearl' ? 'forest' : 'pearl';
    setCurrentTheme(nextTheme);
    localStorage.setItem('brodyagri-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleQuickLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <div 
      className="min-h-[100dvh] flex flex-col relative overflow-x-hidden font-sans transition-colors duration-250 selection:bg-emerald-500/30 selection:text-emerald-900" 
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 shadow-sm"
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderColor: 'var(--border-card-subtle)' 
        }}
      >
        <div className="flex items-center justify-between h-15 px-4 max-w-lg mx-auto">
          <Link href="/today" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-zinc-950 shadow-sm ring-1 ring-emerald-400/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight leading-none" style={{ color: 'var(--text-main)' }}>
                  {title ?? 'BrodyAgri'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-dim)' }}>
                Sahabat Tani Pemula
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Quick Theme Switcher Button */}
            <button
              onClick={toggleQuickTheme}
              title="Ganti Tema Cepat"
              className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
                color: 'var(--accent-primary)'
              }}
            >
              {currentTheme === 'pearl' ? (
                <Moon className="w-4 h-4 text-emerald-800" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Settings Link Button */}
            <Link
              href="/settings"
              title="Pengaturan"
              className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-main)'
              }}
            >
              <SettingsIcon className="w-4 h-4" />
            </Link>

            {/* Direct Logout Button */}
            <button
              onClick={handleQuickLogout}
              title="Keluar / Logout"
              disabled={loggingOut}
              className="w-9 h-9 rounded-2xl flex items-center justify-center border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 stroke-[2.2]" />
            </button>

            {rightSlot}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-5 pb-36 relative z-10">
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
