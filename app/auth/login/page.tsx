'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sprout,
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Stethoscope,
  BookOpen,
  Zap,
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTheme, setCurrentTheme] = useState<string>('pearl');

  useEffect(() => {
    const saved = localStorage.getItem('brodyagri-theme') || 'pearl';
    setCurrentTheme(saved);
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'pearl' ? 'forest' : 'pearl';
    setCurrentTheme(nextTheme);
    localStorage.setItem('brodyagri-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Email atau password salah');
      setLoading(false);
      return;
    }

    router.push('/today');
    router.refresh();
  };

  const fillDemoAccount = () => {
    setEmail('admin@brodyagri.com');
    setPassword('12345678');
  };

  return (
    <div 
      className="min-h-dvh w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans transition-colors duration-250 selection:bg-emerald-500/30 selection:text-emerald-900 overflow-x-hidden"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Background Soft Natural Amber/Green Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-emerald-500/15 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-[350px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 -left-20 w-[350px] h-[350px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Floating Theme Toggle Top Right */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={toggleTheme}
          title="Ganti Tema Cepat"
          className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm hover:scale-105 backdrop-blur-md"
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
      </div>

      {/* Main Unified Bento Container */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 grid grid-cols-1 lg:grid-cols-12 transition-all duration-200"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-card)' 
        }}
      >
        {/* LEFT COLUMN: Aesthetic Photographic Story & Mission (5 or 6 cols on desktop) */}
        <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col justify-between p-7 sm:p-10 lg:p-12 overflow-hidden min-h-[340px] lg:min-h-[620px]">
          {/* Background Image: Community Hands & Seedlings */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/community-seedling.jpg" 
              alt="Community Growing Plants"
              className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.82] contrast-[1.08]"
            />
            {/* Dark & Emerald Atmospheric Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
          </div>

          {/* Top Brand Header over photo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300/30">
                <Sprout className="w-6 h-6 stroke-[2.6]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white leading-none block">
                  BrodyAgri
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-300 font-bold uppercase mt-0.5 block">
                  Sahabat Tani Pemula
                </span>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Engine v2.5</span>
            </span>
          </div>

          {/* Bottom Emotional Story Quote over photo */}
          <div className="relative z-10 mt-auto pt-16 space-y-4 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Bertumbuh Bersama Dari Rumah</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Rawat Benih Harapan, Panen Kebahagiaan
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-md font-medium">
              Dari balkon sempit, rooftop, hingga pot teras rumah—setiap daun yang tumbuh adalah dedikasi kecil untuk masa depan yang lebih hijau.
            </p>

            {/* 3 Quick Aesthetic Feature Tags */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-medium text-emerald-200">
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                🌱 Panduan Mingguan
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                🩺 Dokter Tanaman AI
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                🧪 Pupuk Organik Dapur
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Clean, Modern & High-Contrast Form (7 or 5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 p-7 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--accent-primary)' }}>
              <span>Otentikasi Akun</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Selamat Datang
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              Masuk untuk memantau siklus pertumbuhan dan checklist perawatan tanamanmu pekan ini.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Field Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                Email Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-2xl text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 border rounded-2xl text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-main)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border cursor-pointer accent-emerald-600"
                />
                <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Ingat saya</span>
              </label>

              <button
                type="button"
                onClick={fillDemoAccount}
                className="font-bold hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                Isi otomatis?
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 text-xs mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Kebunku</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.6]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2.5 px-3 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] shadow-sm"
              style={{
                backgroundColor: 'var(--badge-bg)',
                borderColor: 'var(--badge-border)',
                color: 'var(--badge-text)'
              }}
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Gunakan Akun Operator Demo (1-Tap Fill)</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            Belum punya akun?{' '}
            <Link href="/auth/register" className="font-bold underline hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-primary)' }}>
              Daftar akun baru di sini ➔
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
