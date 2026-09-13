'use client';

import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterClosedPage() {
  return (
    <div 
      className="min-h-dvh flex flex-col justify-center items-center px-4 py-6 relative overflow-hidden font-sans transition-colors duration-250"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border p-6 text-center space-y-4 shadow-sm backdrop-blur-md"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-7 h-7 stroke-[2.3]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Registrasi Ditutup
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Sistem BrodyAgri saat ini berada dalam mode <strong>Privat Eksklusif</strong>. Pendaftaran akun publik telah dinonaktifkan secara permanen.
          </p>
        </div>

        <div className="p-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Sistem Terproteksi Penuh</span>
        </div>

        <Link
          href="/auth/login"
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Kembali ke Halaman Login</span>
        </Link>
      </motion.div>
    </div>
  );
}
