'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { 
  Compass, 
  MapPin, 
  Maximize2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
} from 'lucide-react';

interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  growth_days: number;
  season_optimal: string;
  harvest_month_name: string;
  current_farmer_price: number;
  projected_farmer_price: number;
  score: number;
  total_est_kg: number;
  est_revenue: number;
  est_cost: number;
  est_net_profit: number;
  pros: string[];
  cons: string[];
}

export default function AdvisorPage() {
  const [region, setRegion] = useState('Jawa Barat & Jabodetabek');
  const [areaM2, setAreaM2] = useState(100);
  const [duration, setDuration] = useState<'cepat' | 'sedang' | 'panjang'>('sedang');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          area_m2: areaM2,
          target_duration: duration,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setResult(json.data);
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
    <AppShell title="Konsultan AI" subtitle="Rekomendasi Bibit Komoditas Menguntungkan">
      <div className="space-y-4">
        {/* Header Form Input */}
        <div 
          className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
            <Compass className="w-4 h-4 shrink-0" />
            <span>Asisten Keputusan Tanam Petani</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Lokasi */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Wilayah / Daerah Kebun:
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                <option value="Jawa Barat & Jabodetabek">Jawa Barat &amp; Jabodetabek</option>
                <option value="Jawa Tengah & DIY">Jawa Tengah &amp; DIY</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Sumatera & Luar Jawa">Sumatera &amp; Luar Jawa</option>
              </select>
            </div>

            {/* Luas Lahan */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Luas Lahan / Pot:
                </span>
                <span className="font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>{areaM2} m²</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full accent-amber-500 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[9px] font-mono" style={{ color: 'var(--text-dim)' }}>
                <span>10 m² (Pekarangan)</span>
                <span>500 m² (Sedang)</span>
                <span>1000 m² (Lahan)</span>
              </div>
            </div>

            {/* Target Perputaran Panen */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Target Durasi Panen:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['cepat', 'sedang', 'panjang'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className="py-2 rounded-xl text-[11px] font-bold border transition-all"
                    style={{
                      backgroundColor: duration === d ? 'var(--accent-primary)' : 'var(--bg-card-subtle)',
                      borderColor: duration === d ? 'var(--accent-primary)' : 'var(--border-card)',
                      color: duration === d ? '#ffffff' : 'var(--text-dim)',
                    }}
                  >
                    {d === 'cepat' ? '< 45 Hari' : d === 'sedang' ? '45-80 Hari' : '> 80 Hari'}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-2 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}
            >
              <Compass className="w-4 h-4" />
              <span>{loading ? 'Hitung Analisis...' : 'Dapatkan Rekomendasi Tanam'}</span>
            </button>
          </div>
        </div>

        {/* Output Rekomendasi (Responsive 1 kolom mobile, 2 kolom desktop) */}
        {result && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
              Rekomendasi Komoditas Terbaik (Hasil Analisis AI):
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.top_recommendations.map((item: RecommendationItem, idx: number) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl border space-y-3 shadow-sm flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b pb-2.5" style={{ borderColor: 'var(--border-card-subtle)' }}>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span 
                            className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                            style={{ backgroundColor: 'var(--accent-badge-bg)', borderColor: 'var(--accent-badge-border)', color: 'var(--accent-badge-text)' }}
                          >
                            Peringkat #{idx + 1}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
                            Panen {item.harvest_month_name}
                          </span>
                        </div>
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold block" style={{ color: 'var(--accent-primary)' }}>
                          Skor {item.score}/100
                        </span>
                        <span className="text-[9px] block" style={{ color: 'var(--text-dim)' }}>Kesesuaian Pasar</span>
                      </div>
                    </div>

                    {/* Estimasi Hasil Panen & Profit */}
                    <div className="grid grid-cols-2 gap-2 text-center mt-3">
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span className="text-[9px] block font-medium" style={{ color: 'var(--text-dim)' }}>Estimasi Panen</span>
                        <strong className="text-sm font-bold font-mono block mt-0.5" style={{ color: 'var(--text-primary)' }}>
                          {item.total_est_kg} kg
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--accent-badge-bg)', borderColor: 'var(--accent-badge-border)' }}>
                        <span className="text-[9px] block font-bold" style={{ color: 'var(--accent-badge-text)' }}>Proyeksi Bersih</span>
                        <strong className="text-sm font-black font-mono block mt-0.5" style={{ color: 'var(--accent-badge-text)' }}>
                          {formatRupiah(item.est_net_profit)}
                        </strong>
                      </div>
                    </div>

                    {/* Alasan & Poin Keunggulan */}
                    <div className="space-y-1.5 pt-3">
                      {item.pros.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                          <span className="leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
