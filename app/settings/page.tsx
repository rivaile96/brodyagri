'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import type { AISettings } from '@/lib/types';
import { Eye, EyeOff, Loader2, LogOut, Save, ShieldCheck, Cpu, Sliders, Palette, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI Core', placeholder: 'gpt-4o-mini' },
  { value: 'anthropic', label: 'Anthropic Claude', placeholder: 'claude-haiku-3-5' },
  { value: 'custom', label: 'Custom / Lokal', placeholder: 'model-name' },
];

const THEMES = [
  {
    id: 'pearl',
    name: 'Clean White Pearl',
    desc: 'Dominasi putih bersih & modern ala iOS/Apple (seperti di foto contoh)',
    bgPreview: '#f6f8f7',
    cardPreview: '#ffffff',
    borderPreview: '#d8e6df',
    textPreview: '#0c1a14',
    badgePreview: '#10b981',
  },
  {
    id: 'forest',
    name: 'Forest Obsidian',
    desc: 'Mode hengker hijau rimba gelap, hemat baterai layar OLED',
    bgPreview: '#0c1410',
    cardPreview: '#14231b',
    borderPreview: '#10b981',
    textPreview: '#f0fdf4',
    badgePreview: '#34d399',
  },
  {
    id: 'midnight',
    name: 'Midnight Carbon',
    desc: 'Hitam pekat murni (True Black) dengan kontras tinggi',
    bgPreview: '#090a0a',
    cardPreview: '#131517',
    borderPreview: '#262b30',
    textPreview: '#f8fafc',
    badgePreview: '#22c55e',
  },
  {
    id: 'terracotta',
    name: 'Warm Terracotta',
    desc: 'Nuansa krem pasir hangat & tanah organik natural',
    bgPreview: '#f7f3ee',
    cardPreview: '#ffffff',
    borderPreview: '#e3d9cb',
    textPreview: '#2a2118',
    badgePreview: '#ea580c',
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>('pearl');
  const [aiSettings, setAiSettings] = useState<Partial<AISettings>>({
    provider: 'openai',
    api_key_encrypted: '',
    model: 'gpt-4o-mini',
    custom_endpoint: '',
    is_active: false,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('brodyagri-theme') || 'pearl';
    setActiveTheme(savedTheme);

    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setAiSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem('brodyagri-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
            <Palette className="w-3.5 h-3.5" />
            <span>Kustomisasi Tampilan &amp; Preferensi</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Pengaturan &amp; Tema
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Sesuaikan palet warna visual aplikasi (White Clean, Dark Hengker, Midnight, Terracotta) dan manajemen kunci integrasi AI.
          </p>
        </div>

        {/* THEME PRESET SELECTOR */}
        <section 
          className="rounded-3xl p-5 border shadow-sm space-y-4 backdrop-blur-md transition-all duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                Paduan Warna Tema (Theme Presets)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
              Live Switch
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {THEMES.map(t => {
              const isSelected = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={cn(
                    "p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group relative overflow-hidden",
                    isSelected ? "ring-2 shadow-md scale-[1.01]" : "hover:border-emerald-500/50"
                  )}
                  style={{
                    backgroundColor: t.bgPreview,
                    borderColor: isSelected ? t.badgePreview : t.borderPreview,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch Mini Preview */}
                    <div 
                      className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: t.cardPreview, borderColor: t.borderPreview }}
                    >
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.badgePreview }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-black tracking-tight" style={{ color: t.textPreview }}>
                          {t.name}
                        </strong>
                        {isSelected && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full" style={{ backgroundColor: t.badgePreview, color: t.id === 'pearl' || t.id === 'terracotta' ? '#ffffff' : '#000000' }}>
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] line-clamp-1 leading-snug mt-0.5 opacity-80" style={{ color: t.textPreview }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm" style={{ backgroundColor: t.badgePreview }}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-28 rounded-3xl" style={{ backgroundColor: 'var(--bg-card-subtle)' }} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Account Card */}
            <section 
              className="rounded-3xl border p-5 backdrop-blur-md shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider block mb-3" style={{ color: 'var(--text-dim)' }}>
                Sesi Terotentikasi
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Status Operator Aktif</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--accent-primary)' }}>Enkripsi Token Valid</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 font-bold text-xs py-2 px-3.5 rounded-full transition-all active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </section>

            {/* AI Engine Settings */}
            <section 
              className="rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                    Modul Analisis Visi AI
                  </span>
                </div>
                <button
                  onClick={() => setAiSettings(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                    aiSettings.is_active ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200',
                      aiSettings.is_active ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Provider Selection */}
                <div>
                  <label className="text-xs font-mono uppercase font-semibold block mb-2" style={{ color: 'var(--text-dim)' }}>
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
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                        )}
                        style={{
                          backgroundColor: aiSettings.provider === p.value ? 'var(--badge-bg)' : 'var(--bg-card-subtle)'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="text-xs font-mono uppercase font-semibold block mb-1.5" style={{ color: 'var(--text-dim)' }}>
                    Kredensial API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={aiSettings.api_key_encrypted ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, api_key_encrypted: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full border rounded-xl px-3.5 py-2.5 pr-10 text-xs font-mono placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        borderColor: 'var(--border-card)',
                        color: 'var(--text-main)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Endpoint & Model */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-mono uppercase font-semibold block mb-1" style={{ color: 'var(--text-dim)' }}>
                      Model Target
                    </label>
                    <input
                      type="text"
                      value={aiSettings.model ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="gemini-3.8-flash-high"
                      className="w-full border rounded-xl px-3 py-2 text-xs font-mono placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        borderColor: 'var(--border-card)',
                        color: 'var(--text-main)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase font-semibold block mb-1" style={{ color: 'var(--text-dim)' }}>
                      Base Endpoint
                    </label>
                    <input
                      type="text"
                      value={aiSettings.custom_endpoint ?? ''}
                      onChange={e => setAiSettings(prev => ({ ...prev, custom_endpoint: e.target.value }))}
                      placeholder="https://api..."
                      className="w-full border rounded-xl px-3 py-2 text-xs font-mono placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        borderColor: 'var(--border-card)',
                        color: 'var(--text-main)'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveAI}
                  disabled={saving}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Preferensi AI Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>Simpan Konfigurasi AI</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
