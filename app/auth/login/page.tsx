'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Loader2,
  Sprout,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Stethoscope,
  BookOpen,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-250 selection:bg-emerald-500/30 selection:text-emerald-900"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Background Soft Glow Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-emerald-500/15 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-[350px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 -left-20 w-[350px] h-[350px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Header Quick Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          title="Ganti Tema Cepat"
          className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm hover:scale-105"
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

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Brand Hero Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-amber-400 flex items-center justify-center text-zinc-950 mx-auto shadow-xl shadow-emerald-600/30 ring-4 ring-emerald-400/20 scale-105">
            <Sprout className="w-9 h-9 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                BrodyAgri
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}>
                v2.5 AI
              </span>
            </div>
            <p className="text-xs max-w-xs mx-auto leading-relaxed font-medium" style={{ color: 'var(--text-dim)' }}>
              Stasiun Kendali Kebun &amp; Asisten Visi AI Urban Farming Rumahan
            </p>
          </div>
        </div>

        {/* 3 Pillar Informative Highlight Banner */}
        <div 
          className="rounded-3xl border p-4 backdrop-blur-md shadow-sm space-y-2.5"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--accent-primary)' }}>
            ✨ Fitur Unggulan Sistem:
          </span>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-2xl border flex flex-col items-center justify-center space-y-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span className="font-bold leading-tight" style={{ color: 'var(--text-main)' }}>Iklim 3 Tahun</span>
            </div>

            <div className="p-2 rounded-2xl border flex flex-col items-center justify-center space-y-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              <span className="font-bold leading-tight" style={{ color: 'var(--text-main)' }}>Dokter Visi AI</span>
            </div>

            <div className="p-2 rounded-2xl border flex flex-col items-center justify-center space-y-1" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="font-bold leading-tight" style={{ color: 'var(--text-main)' }}>Kamus Budidaya</span>
            </div>
          </div>
        </div>

        {/* Form Login Card */}
        <div 
          className="rounded-3xl border p-6 space-y-5 shadow-lg backdrop-blur-md transition-all duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
            <div>
              <h2 className="text-base font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                Masuk ke Otentikasi
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                Akses stasiun perawatan &amp; kebun aktif Anda
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                className="w-full border rounded-2xl px-4 py-3 text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase font-semibold" style={{ color: 'var(--text-dim)' }}>
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border rounded-2xl px-4 py-3 pr-12 text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-main)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3 text-xs text-rose-500 font-medium flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Kebun</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Button */}
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
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
          Belum memiliki akun operator?{' '}
          <Link href="/auth/register" className="font-bold underline hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-primary)' }}>
            Daftar Akun Baru Sekarang ➔
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
