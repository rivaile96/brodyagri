'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, X, Sprout, TrendingUp, Lock, Globe, ExternalLink, Sparkles, BookOpen, Stethoscope, FlaskConical, LineChart, Compass, Store } from 'lucide-react';
import Link from 'next/link';

interface OdooAppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: 'tanam' | 'mayur';
}

export default function OdooAppLauncher({ isOpen, onClose, currentApp }: OdooAppLauncherProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Odoo Style Launcher Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
            className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden relative z-10 font-sans"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-main)',
            }}
          >
            {/* Header */}
            <div 
              className="p-4 sm:p-5 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-card-subtle)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-zinc-100 flex items-center justify-center border border-zinc-700">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                    Agri Suite Apps
                  </h3>
                  <p className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
                    Pilih modul ekosistem pertanian &amp; pasar
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-dim)',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Apps Grid (Odoo Style) */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* APP 1: BRODYAGRI (TANAM) */}
                <a
                  href="https://tanam.brody.my.id"
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-200 group flex flex-col justify-between ${
                    currentApp === 'tanam'
                      ? 'ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                      : 'hover:border-emerald-500/60'
                  }`}
                  style={{
                    backgroundColor: currentApp === 'tanam' ? 'var(--badge-bg)' : 'var(--bg-card-subtle)',
                    borderColor: currentApp === 'tanam' ? '#10b981' : 'var(--border-card)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        <Sprout className="w-6 h-6 stroke-[2.4]" />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Perlu Login</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                      BrodyAgri (Tanam)
                    </h4>
                    <p className="text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: 'var(--text-dim)' }}>
                      Panduan berkebun, checklist harian, AI dokter tanaman &amp; formulasi nutrisi.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-bold" style={{ borderColor: 'var(--border-card-subtle)' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>
                      {currentApp === 'tanam' ? 'Sedang Aktif' : 'Buka Aplikasi ➔'}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <BookOpen className="w-3 h-3" />
                      <Stethoscope className="w-3 h-3" />
                      <FlaskConical className="w-3 h-3" />
                    </div>
                  </div>
                </a>

                {/* APP 2: AGRIRADAR (PASAR) */}
                <a
                  href="https://mayur.brody.my.id"
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-200 group flex flex-col justify-between ${
                    currentApp === 'mayur'
                      ? 'ring-2 ring-amber-500 shadow-md scale-[1.01]'
                      : 'hover:border-amber-500/60'
                  }`}
                  style={{
                    backgroundColor: currentApp === 'mayur' ? 'var(--badge-bg)' : 'var(--bg-card-subtle)',
                    borderColor: currentApp === 'mayur' ? '#f59e0b' : 'var(--border-card)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                        <TrendingUp className="w-6 h-6 stroke-[2.4]" />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Globe className="w-2.5 h-2.5" />
                        <span>Terbuka Publik</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                      AgriRadar (Pasar)
                    </h4>
                    <p className="text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: 'var(--text-dim)' }}>
                      Monitoring harga pasar 3 level, prediksi panen AI &amp; bursa panen petani.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-bold" style={{ borderColor: 'var(--border-card-subtle)' }}>
                    <span className="text-amber-500">
                      {currentApp === 'mayur' ? 'Sedang Aktif' : 'Buka Aplikasi ➔'}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <LineChart className="w-3 h-3" />
                      <Compass className="w-3 h-3" />
                      <Store className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              </div>

              {/* Quick Info Box */}
              <div 
                className="p-3.5 rounded-2xl border text-xs flex items-center gap-2.5"
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)' }}
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  <strong>Modul Tanam</strong> menyimpan data kebun pribadi kamu, sementara <strong>Modul Pasar</strong> dapat diakses siapa saja secara langsung tanpa login.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
