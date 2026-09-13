'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import type { Plant, WeeklyTask, WeeklyAnalysis } from '@/lib/types';
import {
  Sprout,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  Circle,
  Camera,
  Sparkles,
  ArrowLeft,
  Loader2,
  Trash2,
  AlertTriangle,
  Upload,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [analyses, setAnalyses] = useState<WeeklyAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Modal Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/plants/${id}`)
      .then(r => {
        if (!r.ok) {
          router.push('/plants');
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) {
          setPlant(data.plant);
          setTasks(data.tasks);
          setAnalyses(data.analyses);
          setLoading(false);
        }
      });
  }, [id, router]);

  const toggleTask = async (taskId: string, isDone: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_done: !isDone } : t));
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: !isDone }),
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleUploadAndAnalyze = async () => {
    if (!photoFile || !plant) return;
    setUploading(true);

    try {
      // 1. Upload foto ke server
      const formData = new FormData();
      formData.append('file', photoFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Gagal mengunggah foto');
      const uploadData = await uploadRes.json();
      const photoUrl = uploadData.url;

      setUploading(false);
      setAnalyzing(true);

      // 2. Kirim ke AI untuk analisis visi berkesinambungan
      const completedTasks = tasks.filter(t => t.is_done).map(t => t.task);

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_id: plant.id,
          week_number: plant.current_week,
          photo_url: photoUrl,
          completed_tasks: completedTasks,
          plant_info: {
            name: plant.name,
            variety: plant.variety_name,
            category: plant.category,
          }
        }),
      });

      if (!analyzeRes.ok) throw new Error('Gagal menganalisis foto');

      // Refresh data tanaman
      const refreshRes = await fetch(`/api/plants/${id}`);
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setPlant(refreshed.plant);
        setTasks(refreshed.tasks);
        setAnalyses(refreshed.analyses);
      }

      setPhotoPreview(null);
      setPhotoFile(null);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleDeletePlant = async () => {
    if (!plant) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/plants');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4 animate-pulse">
          <div className="h-44 rounded-3xl" style={{ backgroundColor: 'var(--bg-card-subtle)' }} />
          <div className="h-28 rounded-3xl" style={{ backgroundColor: 'var(--bg-card-subtle)' }} />
        </div>
      </AppShell>
    );
  }

  if (!plant) return null;

  const currentAnalysis = analyses.find(a => a.week_number === plant.current_week - 1);
  const doneTasks = tasks.filter(t => t.is_done).length;

  return (
    <AppShell title={plant.name} rightSlot={
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 flex items-center justify-center transition-colors shadow-sm"
          title="Hapus Tanaman"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <Link 
          href="/plants" 
          className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    }>
      <div className="space-y-5">
        {/* Plant Profil Card */}
        <div className="rounded-3xl border overflow-hidden backdrop-blur-md shadow-sm relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
          {plant.cover_photo_url ? (
            <div className="h-52 w-full overflow-hidden relative">
              <img src={plant.cover_photo_url} className="w-full h-full object-cover" alt={plant.name} />
              <div className="absolute inset-0 bg-black/40" />
              <span className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-mono  border border-white/20 flex items-center gap-1">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>Foto Profil Terbaru (Mg {plant.current_week - 1 > 0 ? plant.current_week - 1 : 1})</span>
              </span>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center border-b" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}>
              <Sprout className="w-12 h-12 stroke-[1.6]" />
            </div>
          )}
          <div className="p-5 relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span 
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block mb-1"
                  style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                >
                  {plant.category}
                </span>
                <h1 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{plant.name}</h1>
                <p className="text-xs mt-0.5 font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Tag className="w-3 h-3 text-emerald-500" />
                  <span>Varietas {plant.variety_name}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600  text-xs font-bold rounded-full shadow-sm" style={{ color: "var(--text-main)" }}>
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Minggu Ke-{plant.current_week}</span>
                </span>
                <p className="text-[10px] mt-1.5 flex items-center justify-end gap-1 font-medium" style={{ color: 'var(--text-dim)' }}>
                  <Calendar className="w-3 h-3 text-amber-500" />
                  <span>Mulai {new Date(plant.planted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card Minggu Ini */}
        {currentAnalysis?.ai_summary && (
          <div 
            className="p-5 rounded-3xl border space-y-2 backdrop-blur-md shadow-sm"
            style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Evaluasi AI Berkelanjutan</span>
            </div>
            <p className="text-xs leading-relaxed opacity-95">
              {currentAnalysis.ai_summary}
            </p>
          </div>
        )}

        {/* Tasks Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                Tugas Rawat Minggu Ke-{plant.current_week}
              </h2>
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
              {doneTasks}/{tasks.length} Selesai
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id, task.is_done)}
                className="w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.98] shadow-sm"
                style={{
                  backgroundColor: task.is_done ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                  borderColor: 'var(--border-card-subtle)',
                  opacity: task.is_done ? 0.7 : 1
                }}
              >
                {task.is_done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[1.8]" />
                )}
                <span 
                  className={`text-xs leading-relaxed font-bold ${task.is_done ? 'line-through' : ''}`}
                  style={{ color: task.is_done ? 'var(--text-dim)' : 'var(--text-main)' }}
                >
                  {task.task}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Form Upload Foto Mingguan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
              Setiap Minggu Foto Baru ➔ Auto Profil &amp; Audit AI
            </h2>
          </div>
          <div className="rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Setiap kali Anda mengunggah foto baru, foto profil tanaman di atas akan <strong style={{ color: 'var(--text-main)' }}>otomatis diperbarui</strong> dan AI akan membaca riwayat foto minggu sebelumnya untuk mendeteksi perubahan fisik (pertumbuhan tunas/gejala daun menguning).
            </p>

            <input
              type="file"
              id="weekly-photo-camera"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <input
              type="file"
              id="weekly-photo-gallery"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="space-y-3">
                <div className="h-48 rounded-2xl overflow-hidden relative border" style={{ borderColor: 'var(--border-card)' }}>
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                    className="absolute top-2 right-2 px-3 py-1 bg-black/70 text-white rounded-full text-xs font-bold"
                  >
                    Ulangi Foto
                  </button>
                </div>

                <button
                  onClick={handleUploadAndAnalyze}
                  disabled={uploading || analyzing}
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah Foto Spesimen...</span>
                    </>
                  ) : analyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AI Menganalisis Foto Minggu Ke-{plant.current_week}...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 stroke-[2.8]" />
                      <span>Kirim &amp; Dapatkan Tugas Minggu Depan</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <label
                  htmlFor="weekly-photo-camera"
                  className="py-3.5 px-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                >
                  <Camera className="w-5 h-5 text-emerald-500" />
                  <span>Ambil Kamera HP</span>
                </label>

                <label
                  htmlFor="weekly-photo-gallery"
                  className="py-3.5 px-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                >
                  <Upload className="w-5 h-5 text-amber-500" />
                  <span>Pilih dari Galeri</span>
                </label>
              </div>
            )}
          </div>
        </section>

        {/* Timeline Transformasi Berantai */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                Timeline Transformasi Mingguan
              </h2>
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
              {analyses.length} Foto Tercatat
            </span>
          </div>

          {analyses.length === 0 ? (
            <div className="p-5 rounded-3xl border text-center text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}>
              Belum ada foto mingguan yang diunggah. Unggah foto pertamamu di atas!
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-500/30">
              {analyses.map(a => (
                <div key={a.id} className="relative">
                  <div className="absolute -left-6 top-3 w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center text-[10px] font-black shadow-md">
                    {a.week_number}
                  </div>
                  <div className="p-4 rounded-2xl border space-y-2 backdrop-blur-md shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>Minggu Ke-{a.week_number}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                        {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {a.photo_url && (
                      <div className="h-32 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-card-subtle)' }}>
                        <img src={a.photo_url} className="w-full h-full object-cover" alt={`Pekan ${a.week_number}`} />
                      </div>
                    )}

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {a.ai_summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal Hapus */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border p-6 space-y-4 shadow-2xl text-center"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black" style={{ color: 'var(--text-main)' }}>Hapus Spesimen Ini?</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Apakah Anda yakin ingin menghapus <strong style={{ color: 'var(--text-main)' }}>"{plant.name}"</strong>? Seluruh data rekam jejak pertumbuhan dan fotonya akan dihapus dari kebun.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full border font-bold text-xs transition-all"
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeletePlant}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50"
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
