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
  CloudSun,
  Stethoscope,
  BookOpen,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Leaf
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
    <div className="min-h-dvh w-full relative flex items-center justify-center lg:justify-between px-4 py-8 lg:px-16 overflow-hidden bg-[#0a1810] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Natural Plantation Ambience with Sunlight Glow & Foliage Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[800px] h-[500px] bg-gradient-to-br from-emerald-500/25 via-amber-500/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-emerald-700/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-emerald-900/30 blur-[150px] rounded-full" />

        <div className="absolute top-6 left-8 opacity-20 text-emerald-400">
          <Leaf className="w-32 h-32 -rotate-45" />
        </div>
        <div className="absolute bottom-10 left-1/4 opacity-15 text-emerald-300">
          <Leaf className="w-40 h-40 rotate-12" />
        </div>
        <div className="absolute top-12 right-12 opacity-15 text-amber-400">
          <Leaf className="w-36 h-36 rotate-45" />
        </div>
      </div>

      {/* Quick Theme Toggle */}
      <div className="absolute top-5 right-5 z-30">
        <button
          onClick={toggleTheme}
          title="Ganti Tema Cepat"
          className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-lg bg-emerald-950/80 border-emerald-700/50 text-emerald-300 hover:text-white hover:scale-105 backdrop-blur-md"
        >
          {currentTheme === 'pearl' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-300" />
          )}
        </button>
      </div>

      {/* LEFT COLUMN: Brand Identity (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between max-w-xl z-20 space-y-12 pr-8 text-white">
        <div className="space-y-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300/40">
              <Sprout className="w-7 h-7 stroke-[2.6]" />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tight text-white block">
                BrodyAgri
              </span>
              <span className="text-xs text-emerald-300/80 font-mono tracking-wider font-semibold">
                URBAN FARMING AI ASSISTANT
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Mulai Perjalanan Tani Cerdas Anda Hari Ini
            </h2>
            <p className="text-sm text-emerald-100/70 leading-relaxed max-w-lg font-medium">
              Daftar gratis untuk mulai mencatat tanaman, audit kesehatan daun via AI, dan panduan pupuk organik dapur.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-emerald-200/90 pt-2 border-t border-emerald-800/60">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/40 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pantau Kebun</span>
            </div>
            <span className="text-emerald-700 font-bold">|</span>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/40 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>Iklim 3 Tahun</span>
            </div>
            <span className="text-emerald-700 font-bold">|</span>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/40 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dokter Visi AI</span>
            </div>
          </div>
        </div>

        <div className="pt-8 opacity-80">
          <p className="font-serif italic text-emerald-300 text-sm tracking-wide">
            "Dari Lahan Rumahan untuk Masa Depan yang Lebih Hijau &amp; Mandiri"
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Floating Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md z-20"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl p-7 sm:p-9 text-zinc-900 border border-emerald-950/10 space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#184334]/10 text-[#184334] flex items-center justify-center mx-auto mb-1">
              <Sprout className="w-7 h-7 stroke-[2.4]" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-[#112920]">
              Buat Akun Baru
            </h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Daftar gratis dan langsung terhubung dengan stasiun kendali iklim lokal Anda.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase font-bold text-zinc-500">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#184334]/30 focus:border-[#184334] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase font-bold text-zinc-500">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#184334]/30 focus:border-[#184334] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase font-bold text-zinc-500">
                Ulangi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Ketik ulang password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#184334]/30 focus:border-[#184334] transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#184334] focus:ring-[#184334] border-zinc-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-zinc-600 cursor-pointer text-[11px] font-medium leading-tight">
                Saya menyetujui Ketentuan Layanan &amp; Kebijakan Privasi
              </label>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#184334] hover:bg-[#123327] active:scale-[0.99] text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#184334]/25 disabled:opacity-50 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 font-medium pt-1">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="text-[#184334] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
