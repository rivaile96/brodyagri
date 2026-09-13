'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  TrendingUp, 
  Lock, 
  Globe, 
  ArrowRight, 
  LayoutGrid, 
  Sun, 
  Moon, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Stethoscope, 
  FlaskConical, 
  LineChart, 
  Compass, 
  Store 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OdooHomeLauncher() {
  const [currentTheme, setCurrentTheme] = useState<string>('pearl');

  useEffect(() => {
    const saved = localStorage.getItem('brodyagri-theme') || 'pearl';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'pearl' ? 'forest' : 'pearl';
    setCurrentTheme(nextTheme);
    localStorage.setItem('brodyagri-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div 
      className="min-h-dvh flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden font-sans transition-colors duration-250 selection:bg-emerald-500/30 selection:text-emerald-900"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Bar Header */}
      <header className="w-full max-w-3xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-black shadow-md border border-zinc-700/50">
            <LayoutGrid className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight block leading-none" style={{ color: 'var(--text-main)' }}>
              Agri Suite Hub
            </span>
            <span className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-dim)' }}>
              Portal Ekosistem Pertanian
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          title="Ganti Tema Cepat"
          className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
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
      </header>

      {/* Main Content: Odoo Style Grid Apps */}
      <main className="w-full max-w-3xl my-auto py-10 z-10 space-y-8">
        {/* Title Brief */}
        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border" style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--border-card)', color: 'var(--accent-primary)' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pilih Modul Aplikasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Agri Suite Hub
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Satu portal terpadu untuk manajemen kebun mandiri dan pemantauan intelijen harga pasar komoditas pangan.
          </p>
        </div>

        {/* 2 Main Apps Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* MENU 1: MODUL TANAM (BRODYAGRI) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="rounded-3xl border p-6 flex flex-col justify-between space-y-6 shadow-sm backdrop-blur-md relative overflow-hidden group transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
            }}
          >
            {/* Header Badge & Icon */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <Sprout className="w-8 h-8 stroke-[2.4]" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-3 h-3" />
                  <span>Wajib Login</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                    Menu 1: Modul Tanam
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  BrodyAgri (Personal Garden)
                </span>
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-dim)' }}>
                  Asisten panduan berkebun pribadi, checklist harian, AI dokter tanaman, dan formulasi nutrisi pupuk.
                </p>
              </div>

              {/* Sub Feature Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <BookOpen className="w-3 h-3 text-emerald-500" />
                  <span>Jadwal Rawat</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <Stethoscope className="w-3 h-3 text-emerald-500" />
                  <span>Dokter AI</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <FlaskConical className="w-3 h-3 text-emerald-500" />
                  <span>Formulasi</span>
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <Link
              href="/today"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              <span>Masuk ke Modul Tanam</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </motion.div>

          {/* MENU 2: MODUL PASAR (AGRIRADAR) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="rounded-3xl border p-6 flex flex-col justify-between space-y-6 shadow-sm backdrop-blur-md relative overflow-hidden group transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
            }}
          >
            {/* Header Badge & Icon */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-8 h-8 stroke-[2.4]" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Globe className="w-3 h-3" />
                  <span>Terbuka Publik</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                    Menu 2: Modul Pasar
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                  AgriRadar (Market Intelligence)
                </span>
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-dim)' }}>
                  Monitoring harga komoditas pasar 3 level, prediksi panen AI, dan bursa langsung dari petani.
                </p>
              </div>

              {/* Sub Feature Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <LineChart className="w-3 h-3 text-amber-500" />
                  <span>53+ Komoditas</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <Compass className="w-3 h-3 text-amber-500" />
                  <span>Prediksi AI</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <Store className="w-3 h-3 text-amber-500" />
                  <span>Bursa Tani</span>
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <a
              href="https://mayur.brody.my.id"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              <span>Pantau Pasar Langsung (Bebas Akses)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl border-t pt-4 text-center z-10 flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-card-subtle)', color: 'var(--text-dim)' }}>
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Agri Suite Monorepo v2.0</span>
        </div>
        <span className="font-mono text-[10px]">
          Powered by OpenAgentic &amp; Brody
        </span>
      </footer>
    </div>
  );
}
