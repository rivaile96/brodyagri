'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, LineChart, Compass, Store, RefreshCw, Sun, Moon, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Harga Pasar', icon: TrendingUp },
  { href: '/forecast', label: 'Prediksi Panen', icon: LineChart },
  { href: '/advisor', label: 'Tanam Apa?', icon: Compass },
  { href: '/market', label: 'Papan Panen', icon: Store },
  { href: 'https://tanam.brody.my.id', label: 'Kebunku', icon: Sprout, external: true },
];

interface AppShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('agriradar-theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('agriradar-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-amber-500/20 selection:text-amber-500 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Top Bar Header (Desktop & Mobile Responsive) */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 shadow-sm"
        style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-card)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm shadow-sm">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {title ?? 'AgriRadar'}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <span className="text-[11px] block font-medium" style={{ color: 'var(--text-dim)' }}>
                {subtitle ?? 'Intelijen Pasar & Prediksi Tanam'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-900/50 p-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)' }}>
            {navItems.map(({ href, label, icon: Icon, external }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                    isActive
                      ? 'shadow-sm'
                      : 'hover:opacity-80'
                  )}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-badge-bg)' : 'transparent',
                    color: isActive ? 'var(--accent-badge-text)' : 'var(--text-dim)',
                    border: isActive ? '1px solid var(--accent-badge-border)' : '1px solid transparent',
                  }}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Theme Toggle & Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--accent-primary)' }}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area (Auto-width: compact on mobile, spacious grid on desktop) */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-28 md:pb-12 transition-colors duration-200">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Visible on mobile, hidden on desktop md:hidden) */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t px-2 py-2 transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-card)' }}
      >
        <nav className="max-w-md mx-auto flex items-center justify-around gap-1">
          {navItems.map(({ href, label, icon: Icon, external }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all'
                )}
                style={{
                  backgroundColor: isActive ? 'var(--accent-badge-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-badge-text)' : 'var(--text-dim)',
                  border: isActive ? '1px solid var(--accent-badge-border)' : '1px solid transparent',
                  fontWeight: isActive ? '700' : '500',
                }}
              >
                <Icon className={cn('w-4 h-4 mb-1', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
                <span className="text-[10px] tracking-tight truncate max-w-[64px]">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
