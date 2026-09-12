'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Heart,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Gagal mendaftar. Silakan coba kembali.');
      setLoading(false);
      return;
    }

    router.push('/today');
    router.refresh();
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
        {/* LEFT COLUMN: Aesthetic Photographic Story & Mission */}
        <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col justify-between p-7 sm:p-10 lg:p-12 overflow-hidden min-h-[340px] lg:min-h-[620px]">
          {/* Background Image: Community Hands & Seedlings */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/community-seedling.jpg" 
              alt="Community Growing Plants"
              className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.82] contrast-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
          </div>

          {/* Top Brand Header */}
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
              <span>Daftar Gratis</span>
            </span>
          </div>

          {/* Bottom Emotional Story Quote */}
          <div className="relative z-10 mt-auto pt-16 space-y-4 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Mulai Perjalanan Tani Cerdas</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Tanam Pertama Kali Tanpa Takut Gagal
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-md font-medium">
              Dapatkan rekomendasi varietas yang pas dengan suhu &amp; elevasi rumahmu, serta panduan tugas mingguan yang dipandu dokter tanaman AI.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-medium text-emerald-200">
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                ☀️ Sensor Iklim GPS
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                🪴 10+ Varietas Buah
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
                🌿 Resep Alami Dapur
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Clean Registration Form */}
        <div className="lg:col-span-6 xl:col-span-5 p-7 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--accent-primary)' }}>
              <span>Registrasi Member</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Buat Akun Baru
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              Gratis dan langsung terhubung dengan stasiun kendali iklim lokal Anda.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
              <label className="block text-[11px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
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

            {/* Field Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
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

            <div className="flex items-center gap-2 text-xs pt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border cursor-pointer accent-emerald-600"
              />
              <label htmlFor="terms" className="cursor-pointer text-[11px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
                Saya menyetujui Ketentuan Layanan &amp; Privasi
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 text-xs mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Baru</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.6]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="font-bold underline hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-primary)' }}>
              Masuk di sini ➔
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
