'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import type { AISettings } from '@/lib/types';
import { Eye, EyeOff, Loader2, LogOut, Save, ShieldCheck, Cpu, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI Core', placeholder: 'gpt-4o-mini' },
  { value: 'anthropic', label: 'Anthropic Claude', placeholder: 'claude-haiku-3-5' },
  { value: 'custom', label: 'Custom / Lokal', placeholder: 'model-name' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [aiSettings, setAiSettings] = useState<Partial<AISettings>>({
    provider: 'openai',
    api_key_encrypted: '',
    model: 'gpt-4o-mini',
    custom_endpoint: '',
    is_active: false,
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setAiSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSaveAI = async () => {
    setSaving(true);
    setSaved(false);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aiSettings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <AppShell title="Konfigurasi Sistem">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-400 block">
            System Preferences
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Pengaturan</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Manajemen integrasi model analitik visi komputer dan preferensi sesi pengguna.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-28 bg-zinc-900/60 rounded-3xl" />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Account Card */}
            <section className="rounded-3xl bg-zinc-900/60 border border-white/[0.08] p-5 backdrop-blur-md">
              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
                Sesi Terotentikasi
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">Status Operator Aktif</p>
                  <p className="text-xs text-emerald-400 mt-0.5 font-mono">Enkripsi Token Valid</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs py-2 px-3.5 rounded-full transition-all active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </section>

            {/* AI Engine Settings */}
            <section className="rounded-3xl bg-zinc-900/60 border border-white/[0.08] p-5 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Modul Analisis Visi AI
                  </span>
                </div>
                <button
                  onClick={() => setAiSettings(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                    aiSettings.is_active ? 'bg-emerald-400' : 'bg-zinc-800 border border-zinc-700'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-zinc-950 rounded-full shadow-md transition-transform duration-200',
                      aiSettings.is_active ? 'translate-x-5 bg-zinc-950' : 'translate-x-0 bg-zinc-400'
                    )}
                  />
                </button>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Provider Selection */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-300 font-semibold block mb-2">
                    Infrastruktur AI
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PROVIDERS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setAiSettings(prev => ({
                          ...prev,
                          provider: p.value as AISettings['provider'],
                          model: p.placeholder
                        }))}
                        className={cn(
                          'py-2 px-1 rounded-xl text-xs font-bold border transition-all truncate',
                          aiSettings.provider === p.value
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                            : 'bg-zinc-800/60 border-white/[0.06] text-zinc-400 hover:border-zinc-600'
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-300 font-semibold block mb-1.5">
                    Kredensial API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={aiSettings.api_key_encrypted ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, api_key_encrypted: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-white text-xs font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Endpoint & Model */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-300 font-semibold block mb-1">
                      Model Target
                    </label>
                    <input
                      type="text"
                      value={aiSettings.model ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="gemini-3.8-flash-high"
                      className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-300 font-semibold block mb-1">
                      Base Endpoint
                    </label>
                    <input
                      type="text"
                      value={aiSettings.custom_endpoint ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, custom_endpoint: e.target.value }))}
                      placeholder="https://api..."
                      className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveAI}
                  disabled={saving}
                  className="w-full mt-2 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.25)] transition-all active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saved ? 'Pengaturan Tersimpan' : 'Simpan Parameter'}</span>
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}