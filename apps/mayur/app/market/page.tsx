'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { 
  Store, 
  Plus, 
  Calendar, 
  Phone, 
  Coins, 
  X,
  Send,
} from 'lucide-react';

interface ListingItem {
  id: string;
  farmer_name: string;
  phone: string;
  region: string;
  commodity_name: string;
  category: string;
  unit: string;
  estimated_kg: number;
  ready_date: string;
  asking_price: number | null;
  notes: string | null;
  created_at: string;
}

export default function MarketPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Jawa Barat & Jabodetabek');
  const [commodityId, setCommodityId] = useState('cabai-rawit-merah');
  const [estimatedKg, setEstimatedKg] = useState('');
  const [readyDate, setReadyDate] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market');
      const json = await res.json();
      if (json.ok) {
        setListings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !phone || !estimatedKg || !readyDate) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: farmerName,
          phone,
          region,
          commodity_id: commodityId,
          estimated_kg: Number(estimatedKg),
          ready_date: readyDate,
          asking_price: askingPrice ? Number(askingPrice) : null,
          notes,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setShowModal(false);
        setFarmerName('');
        setPhone('');
        setEstimatedKg('');
        setReadyDate('');
        setAskingPrice('');
        setNotes('');
        fetchListings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AppShell title="Papan Panen" subtitle="Jual Langsung Ke Pembeli Tanpa Tengkulak">
      <div className="space-y-4">
        {/* Banner Ajak Petani */}
        <div 
          className="p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-colors duration-200"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
              <Store className="w-4 h-4 shrink-0" />
              <span>Titip Pasokan Siap Panen</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              Daftarkan jadwal panen kebun Anda agar pembeli (katering, warung, restoran) bisa langsung memesan.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}
          >
            <Plus className="w-4 h-4" />
            <span>Pasang</span>
          </button>
        </div>

        {/* List Pasokan Petani (Responsive 1 kolom HP, 2 kolom Desktop) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl border animate-pulse space-y-2"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
              >
                <div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--border-card)' }} />
                <div className="h-3 rounded w-2/3" style={{ backgroundColor: 'var(--border-card-subtle)' }} />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div 
            className="p-8 rounded-2xl border text-center space-y-2 shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <Store className="w-8 h-8 mx-auto" style={{ color: 'var(--text-dim)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Belum Ada Daftar Panen Aktif</h3>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Jadilah petani pertama yang mendaftarkan panen minggu ini!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {listings.map((item) => (
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
                          style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}
                        >
                          {item.category}
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
                          • {item.region}
                        </span>
                      </div>
                      <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.commodity_name}</h3>
                      <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-dim)' }}>Petani: {item.farmer_name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono block" style={{ color: 'var(--accent-primary)' }}>
                        {item.estimated_kg} {item.unit}
                      </span>
                      <span className="text-[9px] block" style={{ color: 'var(--text-dim)' }}>Estimasi Volume</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div className="p-2 rounded-xl border flex items-center gap-2" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                      <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <span className="text-[9px] block font-medium" style={{ color: 'var(--text-dim)' }}>Siap Petik / Kirim</span>
                        <strong className="text-[11px] block" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(item.ready_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </strong>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl border flex items-center gap-2" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                      <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[9px] block font-medium" style={{ color: 'var(--text-dim)' }}>Harga Penawaran</span>
                        <strong className="text-[11px] block" style={{ color: 'var(--text-secondary)' }}>
                          {item.asking_price ? `${formatRupiah(item.asking_price)} / kg` : 'Nego Terbuka'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] p-2.5 rounded-xl border mt-3 leading-relaxed" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--text-secondary)' }}>
                      Catatan Kebun: {item.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
                  <a
                    href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Halo%20Pak%20${encodeURIComponent(item.farmer_name)},%20saya%20tertarik%20dengan%20pasokan%20${encodeURIComponent(item.commodity_name)}%20${item.estimated_kg}kg%20di%20AgriRadar`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border shadow-sm"
                    style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-primary)' }}
                  >
                    <Phone className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    <span>Hubungi Petani Langsung</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Pasang Panen */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3">
          <div 
            className="w-full max-w-md border rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Store className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <span>Daftarkan Pasokan Siap Panen</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--text-dim)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Nama Petani / Kelompok Tani:</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Contoh: Pak Herman (Poktan Sukamaju)"
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Nomor WhatsApp Petani:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Komoditas Yang Ditanam:</label>
                <select
                  value={commodityId}
                  onChange={(e) => setCommodityId(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                >
                  <option value="cabai-rawit-merah">Cabai Rawit Merah</option>
                  <option value="cabai-merah-keriting">Cabai Merah Keriting</option>
                  <option value="bawang-merah-brebes">Bawang Merah Lokal</option>
                  <option value="tomat-sayur">Tomat Sayur / TW</option>
                  <option value="pakcoy-hidroponik">Pakcoy / Sawi Daging</option>
                  <option value="kentang-granola">Kentang Granola</option>
                  <option value="terong-ungu">Terong Ungu</option>
                  <option value="timun-lalap">Timun Lalap</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Estimasi Hasil (Kg):</label>
                  <input
                    type="number"
                    required
                    value={estimatedKg}
                    onChange={(e) => setEstimatedKg(e.target.value)}
                    placeholder="Contoh: 150"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Tanggal Siap Petik:</label>
                  <input
                    type="date"
                    required
                    value={readyDate}
                    onChange={(e) => setReadyDate(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Harga Penawaran / Kg (Opsional / Nego):</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="Contoh: 28000"
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium" style={{ color: 'var(--text-secondary)' }}>Catatan Kondisi Kebun (Opsional):</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kualitas super grade A, bebas pestisida kimia."
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 mt-2"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : 'Tayangkan di Papan Panen'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
