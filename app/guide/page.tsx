'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  BookOpen,
  Search,
  Sprout,
  Sun,
  Clock,
  ChevronRight,
  TreePine,
  Apple,
  Salad,
  Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Semua', 'Buah-buahan', 'Sayuran', 'Rempah & Herbal', 'Tanaman Hias'];

const CATEGORY_ICONS: Record<string, any> = {
  'Buah-buahan': Apple,
  'Sayuran': Salad,
  'Rempah & Herbal': Flame,
  'Tanaman Hias': Sprout,
};

export default function GuideIndexPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGuides();
  }, [selectedCategory, searchQuery]);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Semua') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`/api/guides?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (e) {
      console.error('Fetch guides failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Kamus Tani">
      <div className="space-y-4">
        {/* Header Ringkas */}
        <div className="space-y-1">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-semibold"
            style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Playbook Budidaya Lengkap</span>
          </div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Kamus Tani &amp; Budidaya
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Panduan hulu ke hilir: media, percabangan, pembuahan, dan hama.
          </p>
        </div>

        {/* Search Bar Pintar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari tanaman (contoh: Anggur, Mangga, Cabai, Monstera...)"
            className="w-full border rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-main)',
            }}
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--accent-primary)' }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hidden">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "border-transparent"
                )}
                style={{
                  backgroundColor: isSelected ? undefined : 'var(--bg-card)',
                  borderColor: isSelected ? undefined : 'var(--border-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-dim)',
                }}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* List of Plant Playbooks (Clean & Compact Cards) */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className="border rounded-2xl p-4 animate-pulse space-y-2"
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)' }}
              >
                <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--border-card)' }} />
                <div className="h-3 rounded w-3/4" style={{ backgroundColor: 'var(--border-card)' }} />
              </div>
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div 
            className="rounded-3xl border p-8 text-center space-y-3 backdrop-blur-md"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <Sprout className="w-10 h-10 mx-auto stroke-[1.5]" style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Spesies Belum Tersedia</h3>
            <p className="text-xs max-w-xs mx-auto" style={{ color: 'var(--text-dim)' }}>
              Kamus Tani terus diperkaya secara berkala melalui AI &amp; botani updater. Coba kata kunci lainnya.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {guides.map(item => {
              const CatIcon = CATEGORY_ICONS[item.category] || TreePine;
              return (
                <Link key={item.id} href={`/guide/${item.slug}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-3.5 rounded-2xl border hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 shadow-sm group"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}
                      >
                        <CatIcon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span 
                            className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border"
                            style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                          >
                            {item.category}
                          </span>
                          <span className="text-[9px] font-medium" style={{ color: 'var(--text-dim)' }}>
                            • {item.difficulty}
                          </span>
                        </div>
                        <h2 className="text-xs font-bold truncate leading-tight group-hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-main)' }}>
                          {item.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-1 text-[10px]" style={{ color: 'var(--text-dim)' }}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {item.harvest_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sun className="w-3 h-3 text-amber-500" />
                            {item.sunlight_req}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--text-dim)' }}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
