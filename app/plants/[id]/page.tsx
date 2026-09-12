'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import type { Plant, WeeklyTask, WeeklyAnalysis } from '@/lib/types';
import {
  CheckCircle2,
  Circle,
  Camera,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
  Calendar,
  Sprout,
  Sparkles,
  Upload,
  Clock,
  Leaf,
  Tag,
  History,
  X,
  TrendingUp,
  Activity,
  GitCommit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [plant, setPlant] = useState<Plant | null>(null);
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [analyses, setAnalyses] = useState<WeeklyAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/plants/${id}`)
      .then(r => { if (!r.ok) { router.push('/plants'); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        setPlant(data.plant);
        setTasks((data.tasks as WeeklyTask[]).filter((t: WeeklyTask) => t.week_number === data.plant.current_week));
        setAnalyses(data.analyses);
        setLoading(false);
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    e.target.value = '';
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile || !plant) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('plant_id', plant.id);
      formData.append('week_number', String(plant.current_week));
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const { photo_url } = await uploadRes.json();

      setUploading(false);
      setAnalyzing(true);

      const completedTasks = tasks.filter(t => t.is_done).map(t => t.task);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_id: plant.id,
          week_number: plant.current_week,
          photo_url,
          completed_tasks: completedTasks,
          plant_info: { name: plant.name, variety: plant.variety_name, category: plant.category, current_week: plant.current_week },
        }),
      });

      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        const refreshRes = await fetch(`/api/plants/${plant.id}`);
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          setPlant(freshData.plant);
          setTasks((freshData.tasks as WeeklyTask[]).filter((t: WeeklyTask) => t.week_number === freshData.plant.current_week));
          setAnalyses(freshData.analyses);
        }
      }
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch {
      setError('Gagal mengirimkan foto. Coba lagi dalam beberapa saat.');
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

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      next.has(week) ? next.delete(week) : next.add(week);
      return next;
    });
  };

  const currentAnalysis = analyses.find(a => a.week_number === plant?.current_week);
  const doneTasks = tasks.filter(t => t.is_done).length;
  const sortedAnalyses = [...analyses].sort((a, b) => b.week_number - a.week_number);

  if (loading) return (
    <AppShell>
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-[#14231b]/60 rounded-3xl" />
        <div className="h-28 bg-[#14231b]/60 rounded-3xl" />
      </div>
    </AppShell>
  );
  if (!plant) return null;

  return (
    <AppShell title={plant.name} rightSlot={
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-9 h-9 rounded-full bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-colors"
          title="Hapus Tanaman"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <Link href="/plants" className="w-9 h-9 rounded-full bg-[#14231b] border border-emerald-800/40 flex items-center justify-center text-emerald-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    }>
      <div className="space-y-5">
        {/* Plant Profil Card */}
        <div className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 overflow-hidden backdrop-blur-md shadow-md relative">
          {plant.cover_photo_url ? (
            <div className="h-52 w-full overflow-hidden relative">
              <img src={plant.cover_photo_url} className="w-full h-full object-cover" alt={plant.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14231b] via-[#14231b]/30 to-transparent" />
              <span className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-emerald-300 border border-white/10 flex items-center gap-1">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>Foto Profil Terbaru (Mg {plant.current_week - 1 > 0 ? plant.current_week - 1 : 1})</span>
              </span>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center bg-gradient-to-br from-[#183124] to-[#13281d] border-b border-emerald-900/60 text-emerald-400">
              <Sprout className="w-12 h-12 stroke-[1.6]" />
            </div>
          )}
          <div className="p-5 relative z-10 -mt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-block mb-1">
                  {plant.category}
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">{plant.name}</h1>
                <p className="text-xs text-emerald-200/80 mt-0.5 font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-400" />
                  <span>Varietas {plant.variety_name}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 text-xs font-black rounded-full shadow-md">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Minggu Ke-{plant.current_week}</span>
                </span>
                <p className="text-[10px] text-emerald-300/70 mt-1.5 flex items-center justify-end gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Mulai {new Date(plant.planted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card Minggu Ini */}
        {currentAnalysis?.ai_summary && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 space-y-2 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Evaluasi AI Berkelanjutan</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {currentAnalysis.ai_summary}
            </p>
          </div>
        )}

        {/* Tasks Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Tugas Rawat Minggu Ke-{plant.current_week}
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {doneTasks}/{tasks.length} Selesai
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id, task.is_done)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.98] ${
                  task.is_done
                    ? 'bg-[#14231b]/30 border-emerald-950 text-emerald-300/40'
                    : 'bg-[#14231b]/90 border-emerald-800/40 hover:border-emerald-500/50 text-white shadow-sm'
                }`}
              >
                {task.is_done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/40 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[1.8]" />
                )}
                <span className={`text-xs leading-relaxed ${task.is_done ? 'line-through text-emerald-300/40' : 'text-emerald-50'}`}>
                  {task.task}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Form Upload Foto Mingguan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Setiap Minggu Foto Baru ➔ Auto Profil &amp; Audit AI
            </h2>
          </div>
          <div className="rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 p-5 space-y-4 backdrop-blur-md">
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Setiap kali Anda mengunggah foto baru, foto profil tanaman di atas akan <strong>otomatis diperbarui</strong> dan AI akan membaca riwayat foto minggu sebelumnya untuk mendeteksi perubahan fisik (pertumbuhan tunas/gejala daun menguning).
            </p>

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileChange}
            />
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-700 aspect-video">
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                  className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1 border border-white/20"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Batal / Hapus Foto</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl border border-emerald-700/50 hover:border-emerald-500 bg-[#1d3527] hover:bg-[#23402f] flex flex-col items-center justify-center gap-2 transition-all group shadow-sm active:scale-95 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Ambil Foto</span>
                    <span className="text-[10px] text-emerald-300/70">Kamera HP (Minggu Ke-{plant.current_week})</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-4 rounded-2xl border border-amber-700/50 hover:border-amber-500 bg-[#272a1c] hover:bg-[#313524] flex flex-col items-center justify-center gap-2 transition-all group shadow-sm active:scale-95 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Pilih Galeri</span>
                    <span className="text-[10px] text-amber-200/70">Upload dari HP</span>
                  </div>
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-amber-300 bg-amber-950/40 p-3 rounded-xl border border-amber-700/40">
                {error}
              </p>
            )}

            {selectedFile && (
              <button
                onClick={handleUploadAndAnalyze}
                disabled={uploading || analyzing}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.98]"
              >
                {(uploading || analyzing) && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{uploading ? 'Mengunggah Foto...' : analyzing ? 'Menghubungkan Riwayat & Analisis AI...' : 'Proses Verifikasi AI'}</span>
              </button>
            )}
          </div>
        </section>

        {/* TIMELINE HISTORY KONTINUITAS */}
        {sortedAnalyses.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Timeline Transformasi Perkembangan ({sortedAnalyses.length} Pekan)
                </h2>
              </div>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-emerald-700 before:to-emerald-950">
              {sortedAnalyses.map((analysis) => {
                const isExpanded = expandedWeeks.has(analysis.week_number);
                return (
                  <div key={analysis.id} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0c1410] shadow-md flex items-center justify-center text-[9px] font-black text-zinc-950 z-10" />

                    <div className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 overflow-hidden shadow-md backdrop-blur-md">
                      <div
                        onClick={() => toggleWeek(analysis.week_number)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-900/20 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          {analysis.photo_url ? (
                            <img src={analysis.photo_url} className="w-14 h-14 rounded-2xl object-cover border border-emerald-700/60 shadow-sm shrink-0" alt={`Minggu ${analysis.week_number}`} />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                              <Sprout className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                              Pekan Ke-{analysis.week_number}
                            </span>
                            <h3 className="text-sm font-black text-white mt-0.5">
                              {analysis.photo_url ? 'Dokumentasi Visual Tersimpan' : 'Catatan Perawatan Pekan ini'}
                            </h3>
                            <p className="text-[10px] text-emerald-300/60 font-medium mt-0.5">
                              {new Date(analysis.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-emerald-900/60 bg-[#0c1410]/60 space-y-3">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-700/40 text-xs text-emerald-100 leading-relaxed">
                            <strong className="text-emerald-300 block font-bold text-[11px] mb-1">
                              🧠 Catatan Evaluasi AI Pekan Ke-{analysis.week_number}:
                            </strong>
                            {analysis.ai_summary}
                          </div>

                          {analysis.tasks_for_next_week && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                                Instruksi Hasil Evaluasi Pekan Ini:
                              </span>
                              <div className="space-y-1">
                                {(Array.isArray(analysis.tasks_for_next_week) ? analysis.tasks_for_next_week : (typeof analysis.tasks_for_next_week === 'string' ? JSON.parse(analysis.tasks_for_next_week) : [])).map((t: string, idx: number) => (
                                  <div key={idx} className="text-xs text-emerald-100/90 flex items-start gap-2">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>{t}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Tanaman */}
      <AnimatePresence>
        {showDeleteModal && (
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
                <h3 className="text-base font-black text-white">Hapus Tanaman Ini?</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong>"{plant.name}"</strong>? Seluruh data tugas dan riwayat foto transformasinya akan dihapus permanen.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-[#0c1410] border border-emerald-800 text-emerald-300 font-bold text-xs hover:text-white transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeletePlant}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}