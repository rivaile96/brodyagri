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
  Sparkles,
  TreePine,
  Apple,
  Salad,
  Flame,
  Wheat,
  Mountain,
  ArrowRight,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Playbook Budidaya Lengkap</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kamus Tani &amp; Budidaya</h1>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Panduan komprehensif hulu ke hilir untuk setiap spesies tanaman: dari pemilihan bibit, pembentukan tajuk cabang, trik pembuahan, hingga penanganan hama.
          </p>
        </div>

        {/* Search Bar Pintar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari tanaman (contoh: Anggur, Mangga, Cabai, Monstera...)"
            className="w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full"
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
                  "shrink-0 px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                    : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
                )}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* List of Plant Playbooks */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#14231b]/60 border border-emerald-900/40 rounded-3xl p-5 animate-pulse space-y-2">
                <div className="h-4 bg-emerald-950 rounded w-1/2" />
                <div className="h-3 bg-emerald-950 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div className="rounded-3xl bg-[#14231b]/60 border border-emerald-800/40 p-8 text-center space-y-3 backdrop-blur-md">
            <Sprout className="w-10 h-10 text-emerald-500 mx-auto stroke-[1.5]" />
            <h3 className="text-sm font-bold text-white">Spesies Belum Tersedia</h3>
            <p className="text-xs text-emerald-200/60 max-w-xs mx-auto">
              Kamus Tani terus diperkaya secara berkala melalui AI &amp; botani updater. Coba kata kunci lainnya.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {guides.map(item => {
              const CatIcon = CATEGORY_ICONS[item.category] || TreePine;
              return (
                <Link key={item.id} href={`/guide/${item.slug}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-5 rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 hover:border-emerald-500/60 transition-all space-y-3 shadow-md backdrop-blur-md group"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-emerald-900/80 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                            {item.category}
                          </span>
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
                            {item.difficulty}
                          </span>
                        </div>
                        <h2 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </h2>
                      </div>
                      <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                        <CatIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs text-emerald-100/80 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-emerald-300/80 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.harvest_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.sunlight_req}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-emerald-900/60 text-xs font-bold text-emerald-400">
                      <span>Buka Playbook Budidaya Lengkap</span>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
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
