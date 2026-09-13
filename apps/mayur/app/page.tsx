'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Store, 
  Building2, 
  Sprout, 
  Info,
  ChevronRight,
  ShieldAlert,
  Apple,
  Salad,
  Layers,
  Flame,
  Flower2
} from 'lucide-react';

interface PriceItem {
  id: string;
  commodity_id: string;
  commodity_name: string;
  category_id: string;
  category: string;
  unit: string;
  growth_days: number;
  base_cost_per_kg: number;
  region: string;
  market_name: string;
  farmer_price: number;
  wholesale_price: number;
  consumer_price: number;
  trend: 'up' | 'down' | 'stable';
  volatility: 'low' | 'medium' | 'high';
  date: string;
}

const CATEGORY_TABS = [
  { id: 'semua', label: 'Semua Komoditas', icon: Sprout },
  { id: 'buah', label: 'Buah-buahan', icon: Apple },
  { id: 'sayur', label: 'Sayuran', icon: Salad },
  { id: 'umbi', label: 'Umbi-umbian', icon: Layers },
  { id: 'rempah', label: 'Rempah & Herbal', icon: Flame },
  { id: 'hias', label: 'Tanaman Hias & Bibit', icon: Flower2 },
];

export default function HomePage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPrices();
  }, [activeTab, searchQuery]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'semua') params.append('category_id', activeTab);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`/api/prices?${params.toString()}`);
      const json = await res.json();
      if (json.ok) {
        setPrices(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Grouping by Category when 'Semua' is active
  const groupedPrices = prices.reduce((acc: Record<string, PriceItem[]>, item) => {
    const cat = item.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <AppShell title="AgriRadar" subtitle="Katalog Lengkap Harga Komoditas Pangan & Pertanian">
      <div className="space-y-4">
        {/* Banner Info Ringkas */}
        <div 
          className="p-4 rounded-2xl border space-y-1 shadow-sm transition-colors duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
            <Info className="w-4 h-4 shrink-0" />
            <span>Katalog Harga Pasar Transparan Terlengkap</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Memantau harga harian 50+ komoditas dari tingkat <strong style={{ color: 'var(--text-primary)' }}>Kebun Petani</strong>, <strong style={{ color: 'var(--text-primary)' }}>Pasar Induk</strong>, hingga <strong style={{ color: 'var(--text-primary)' }}>Eceran</strong>.
          </p>
        </div>

        {/* Search Bar Pintar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari komoditas (contoh: Mangga, Alpukat, Jeruk, Cabai, Jahe, Monstera...)"
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
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

        {/* Category Filter Tabs (Horizontally Scrollable on Mobile, Wrap on Desktop) */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hidden">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-dim)',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-card)',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Konten Daftar Komoditas */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl border animate-pulse space-y-2.5"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
              >
                <div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--border-card)' }} />
                <div className="h-10 rounded w-full" style={{ backgroundColor: 'var(--border-card-subtle)' }} />
              </div>
            ))}
          </div>
        ) : prices.length === 0 ? (
          <div 
            className="p-8 rounded-2xl border text-center space-y-2 shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <ShieldAlert className="w-8 h-8 mx-auto" style={{ color: 'var(--text-dim)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Komoditas Tidak Ditemukan</h3>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : activeTab === 'semua' && !searchQuery ? (
          /* Tampilan Berdasarkan Kategori Lengkap (Section-by-Section) */
          <div className="space-y-6">
            {Object.entries(groupedPrices).map(([categoryName, items]) => (
              <div key={categoryName} className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: 'var(--border-card)' }}>
                  <h2 className="text-sm font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                    <span>{categoryName}</span>
                    <span className="text-[11px] font-normal" style={{ color: 'var(--text-dim)' }}>({items.length} komoditas)</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((item) => renderPriceCard(item, formatRupiah))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tampilan Grid Filter Aktif */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {prices.map((item) => renderPriceCard(item, formatRupiah))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function renderPriceCard(item: PriceItem, formatRupiah: (val: number) => string) {
  const marginFarmerToRetail = Math.round(((item.consumer_price - item.farmer_price) / item.farmer_price) * 100);

  return (
    <div
      key={item.id}
      className="p-4 rounded-2xl border hover:scale-[1.01] transition-all space-y-3 shadow-sm flex flex-col justify-between"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 border-b pb-2.5" style={{ borderColor: 'var(--border-card-subtle)' }}>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span 
                className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border"
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
              >
                {item.category}
              </span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
                • {item.region}
              </span>
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.commodity_name}</h3>
          </div>

          {/* Badge Trend */}
          <div className="shrink-0 text-right">
            {item.trend === 'up' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <TrendingUp className="w-3 h-3" /> Naik
              </span>
            ) : item.trend === 'down' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-500 border border-rose-500/30">
                <TrendingDown className="w-3 h-3" /> Anjlok
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border"
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
              >
                <Minus className="w-3 h-3" /> Stabil
              </span>
            )}
          </div>
        </div>

        {/* Perbandingan 3 Tingkat Harga */}
        <div className="grid grid-cols-3 gap-2 text-center mt-3">
          <div className="p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
            <span className="text-[9px] block font-medium flex items-center justify-center gap-1" style={{ color: 'var(--accent-primary)' }}>
              <Sprout className="w-3 h-3" /> Kebun
            </span>
            <strong className="text-xs font-bold font-mono block mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {formatRupiah(item.farmer_price)}
            </strong>
          </div>

          <div className="p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
            <span className="text-[9px] block font-medium flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
              <Building2 className="w-3 h-3" /> Induk
            </span>
            <strong className="text-xs font-bold font-mono block mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {formatRupiah(item.wholesale_price)}
            </strong>
          </div>

          <div className="p-2 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
            <span className="text-[9px] block font-medium flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
              <Store className="w-3 h-3" /> Eceran
            </span>
            <strong className="text-xs font-bold font-mono block mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {formatRupiah(item.consumer_price)}
            </strong>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] pt-2 border-t font-medium" style={{ borderColor: 'var(--border-card-subtle)', color: 'var(--text-dim)' }}>
        <span>Selisih Kebun ke Eceran: <strong style={{ color: 'var(--accent-primary)' }}>+{marginFarmerToRetail}%</strong></span>
        <span className="flex items-center font-bold" style={{ color: 'var(--accent-primary)' }}>
          {item.market_name} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
