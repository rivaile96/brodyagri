'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { 
  LineChart, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
} from 'lucide-react';

interface ForecastItem {
  commodity_id: string;
  commodity_name: string;
  category: string;
  unit: string;
  growth_days: number;
  base_cost_per_kg: number;
  current_farmer_price: number;
  current_consumer_price: number;
  target_harvest_date: string;
  harvest_month_name: string;
  projected_farmer_price: number;
  profit_estimate_per_kg: number;
  outlook: 'bullish' | 'bearish' | 'stable';
  confidence_pct: number;
  reasoning: string;
}

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forecast');
      const json = await res.json();
      if (json.ok) {
        setForecasts(json.data);
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

  return (
    <AppShell title="Prediksi Panen" subtitle="Proyeksi Harga Saat Masa Petik">
      <div className="space-y-4">
        {/* Banner Penjelasan Penyeimbang Panen */}
        <div 
          className="p-4 rounded-2xl border space-y-1 shadow-sm transition-colors duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
            <LineChart className="w-4 h-4 shrink-0" />
            <span>Kecerdasan AI Prediksi Harga Masa Depan</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Menghitung estimasi harga kebun saat hari panen tiba (sesuai umur biologis tanaman) agar petani tidak terjebak banjir stok.
          </p>
        </div>

        {/* List Forecast Cards (Responsive 1 kolom mobile, 2 kolom desktop) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl border animate-pulse space-y-3"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
              >
                <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--border-card)' }} />
                <div className="h-12 rounded" style={{ backgroundColor: 'var(--border-card-subtle)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {forecasts.map((item) => {
              const diffPercent = Math.round(
                ((item.projected_farmer_price - item.current_farmer_price) / item.current_farmer_price) * 100
              );

              return (
                <div 
                  key={item.commodity_id} 
                  className="p-4 rounded-2xl border space-y-3 shadow-sm flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div>
                    {/* Header Title */}
                    <div className="flex items-start justify-between gap-2 border-b pb-2.5" style={{ borderColor: 'var(--border-card-subtle)' }}>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span 
                            className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                            style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
                          >
                            {item.category}
                          </span>
                          <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                            <Clock className="w-3 h-3 text-amber-500" />
                            Umur {item.growth_days} Hari
                          </span>
                        </div>
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.commodity_name}</h3>
                      </div>

                      {/* Proyeksi Outlook Badge */}
                      <div className="text-right shrink-0">
                        {item.outlook === 'bullish' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            <TrendingUp className="w-3.5 h-3.5" /> Potensi Naik
                          </span>
                        ) : item.outlook === 'bearish' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded bg-rose-500/15 text-rose-500 border border-rose-500/30">
                            <TrendingDown className="w-3.5 h-3.5" /> Risiko Banjir
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded border"
                            style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
                          >
                            <Minus className="w-3.5 h-3.5" /> Stabil
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visual Perbandingan Harga Sekarang vs Proyeksi Panen */}
                    <div className="grid grid-cols-2 gap-2.5 text-center mt-3">
                      <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span className="text-[9px] block font-medium" style={{ color: 'var(--text-dim)' }}>Harga Kebun Hari Ini</span>
                        <strong className="text-sm font-bold font-mono block mt-0.5" style={{ color: 'var(--text-primary)' }}>
                          {formatRupiah(item.current_farmer_price)}
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--accent-badge-bg)', borderColor: 'var(--accent-badge-border)' }}>
                        <span className="text-[9px] block font-bold flex items-center justify-center gap-1" style={{ color: 'var(--accent-badge-text)' }}>
                          <Calendar className="w-3 h-3" /> Panen ({item.harvest_month_name})
                        </span>
                        <strong className="text-base font-black font-mono block mt-0.5" style={{ color: 'var(--accent-badge-text)' }}>
                          {formatRupiah(item.projected_farmer_price)}
                        </strong>
                        <span className={`text-[9px] font-bold block ${diffPercent >= 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {diffPercent >= 0 ? `+${diffPercent}% dari sekarang` : `${diffPercent}% dari sekarang`}
                        </span>
                      </div>
                    </div>

                    {/* Penjelasan Alasan AI */}
                    <div className="p-3 rounded-xl border space-y-1 text-xs mt-3" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                      <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                        Analisis Data ({item.confidence_pct}% Tingkat Keyakinan):
                      </span>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
