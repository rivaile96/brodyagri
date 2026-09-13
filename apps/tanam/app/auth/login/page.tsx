'use client';

import { useState, useEffect } from 'react';
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
  ShieldCheck
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

  return (
    <div 
      className="min-h-dvh flex flex-col justify-center items-center px-4 py-6 relative overflow-hidden font-sans transition-colors duration-250 selection:bg-emerald-500/30 selection:text-emerald-900"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Background Soft Glow Subtle */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-[300px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={toggleTheme}
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
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm relative z-10 space-y-4"
      >
        {/* Brand Header Minimalis */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm ring-1 ring-emerald-500/20">
            <Sprout className="w-6 h-6 stroke-[2.4]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            BrodyAgri
          </h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            Modul Tanam • Akses Khusus Pemilik
          </p>
        </div>

        {/* Visual Banner Estetik Bersih (Foto Bibit Komunitas) */}
        <div 
          className="h-28 sm:h-32 w-full rounded-3xl overflow-hidden relative border shadow-sm"
          style={{ borderColor: 'var(--border-card)' }}
        >
          <img 
            src="/images/community-seedling.jpg" 
            alt="Bibit Tanaman Bersama"
            className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-black/40" />
          <span className="absolute bottom-2.5 left-3.5 text-[11px] font-bold text-white drop-shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Kebun Mandiri</span>
          </span>
        </div>

        {/* Card Form Login Bersih */}
        <div 
          className="rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm backdrop-blur-md transition-all duration-200"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-card)' 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                Masuk ke Akun
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                Akses kebun &amp; checklist tugas mingguan
              </p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Privat</span>
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Input Email */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                Email Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rifaimanudin@gmail.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase font-bold" style={{ color: 'var(--text-dim)' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-main)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border cursor-pointer accent-emerald-600"
                />
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Ingat sesi login</span>
              </label>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Kebunku</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Registrasi publik dinonaktifkan (Mode Privat)</span>
        </div>
      </motion.div>
    </div>
  );
}
