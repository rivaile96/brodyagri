'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import type { Plant } from '@/lib/types';
import { Plus, ChevronRight, Sprout, Calendar, ArrowRight, Tag, CheckCircle2, AlertCircle, Trash2, Loader2, AlertTriangle, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LABEL: Record<string, { label: string; class: string; icon: any }> = {
  active: { label: 'Aktif Tumbuh', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Sprout },
  harvested: { label: 'Panen Selesai', class: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: CheckCircle2 },
  dead: { label: 'Gagal Tumbuh', class: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: AlertCircle },
};

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  // State Hapus Tanaman
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/plants')
      .then(r => r.json())
      .then(data => { setPlants(data); setLoading(false); });
  }, []);

  const confirmDelete = (e: React.MouseEvent, plant: Plant) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(plant.id);
    setDeletingName(plant.name);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/plants/${deletingId}`, { method: 'DELETE' });
      if (res.ok) {
        setPlants(prev => prev.filter(p => p.id !== deletingId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeletingName('');
    }
  };

  return (
    <AppShell title="Koleksi Kebunku" rightSlot={
      <Link href="/wizard"
        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-black text-xs py-2 px-3.5 rounded-full shadow-md shadow-emerald-950/40 active:scale-95 transition-all">
        <Plus className="w-4 h-4 stroke-[2.8]" />
        <span>Tanam Baru</span>
      </Link>
    }>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#14231b]/60 border border-emerald-900/40 rounded-3xl p-4 animate-pulse">
              <div className="h-4 bg-emerald-950 rounded w-1/2 mb-2" />
              <div className="h-3 bg-emerald-950 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : plants.length === 0 ? (
        <div className="rounded-3xl bg-[#14231b]/60 border border-emerald-800/40 p-8 text-center space-y-4 my-8 backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1 max-w-xs mx-auto">
            <h2 className="text-base font-black text-white">Belum Ada Tanaman Terdaftar</h2>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Mulai menanam dan catat progres mingguan tanaman kesayanganmu di sini.
            </p>
          </div>
          <Link href="/wizard" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 font-black text-xs px-6 py-3.5 rounded-full shadow-lg shadow-emerald-950/40 active:scale-95 transition-all">
            <span>Tanam Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {plants.map(plant => {
            const status = STATUS_LABEL[plant.status] ?? STATUS_LABEL.active;
            const StatusIcon = status.icon;
            return (
              <div key={plant.id} className="relative group">
                <Link href={`/plants/${plant.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 hover:border-emerald-500/60 transition-all flex items-center gap-3.5 backdrop-blur-md shadow-md"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 overflow-hidden">
                      {plant.cover_photo_url ? (
                        <img src={plant.cover_photo_url} className="w-full h-full object-cover" alt={plant.name} />
                      ) : (
                        <Sprout className="w-6 h-6 stroke-[2]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-black text-white truncate group-hover:text-emerald-300 transition-colors">
                          {plant.name}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${status.class}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/70 truncate flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{plant.variety_name} ({plant.crop_name})</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-emerald-300/80">
                        <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                          Minggu Ke-{plant.current_week}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>Tanam {new Date(plant.planted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tombol Hapus Tanaman */}
                    <button
                      onClick={(e) => confirmDelete(e, plant)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-rose-950/40 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-800/40 transition-all z-10"
                      title="Hapus / Berikan ke orang lain"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-[#14231b] border border-emerald-700/60 p-6 space-y-4 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Hapus dari Kebunku?</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong>"{deletingName}"</strong>? Data tanaman dan riwayat fotonya akan dihapus (misal bibit sudah dihadiahkan ke orang lain).
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-[#0c1410] border border-emerald-800 text-emerald-300 font-bold text-xs hover:text-white transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>{isDeleting ? 'Hapus...' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}