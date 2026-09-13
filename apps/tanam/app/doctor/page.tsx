'use client';

import { useState, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Activity, Camera, ImageIcon, AlertTriangle, ShieldCheck, Sparkles, Loader2, RefreshCw, CheckCircle2, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DoctorPage() {
 const [photo, setPhoto] = useState<string | null>(null);
 const [symptoms, setSymptoms] = useState('');
 const [cropName, setCropName] = useState('');
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState<any | null>(null);
 const [error, setError] = useState('');

 const cameraInputRef = useRef<HTMLInputElement>(null);
 const galleryInputRef = useRef<HTMLInputElement>(null);

 const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 const reader = new FileReader();
 reader.onload = () => {
 setPhoto(reader.result as string);
 };
 reader.readAsDataURL(file);
 e.target.value = '';
 };

 const handleDiagnose = async () => {
 if (!photo && !symptoms.trim()) {
 setError('Mohon lampirkan foto spesimen atau tulis deskripsi keluhan.');
 return;
 }

 setLoading(true);
 setError('');
 setResult(null);

 try {
 const res = await fetch('/api/doctor/diagnose', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 crop_name: cropName.trim() || undefined,
 symptoms: symptoms.trim() || undefined,
 photo_base64: photo || undefined,
 }),
 });

 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'Gagal memproses diagnosa AI');
 setResult(data);
 } catch (err: any) {
 setError(err.message || 'Terjadi gangguan koneksi analisis.');
 } finally {
 setLoading(false);
 }
 };

 const resetForm = () => {
 setPhoto(null);
 setSymptoms('');
 setCropName('');
 setResult(null);
 setError('');
 };

 return (
 <AppShell title="Klinik AI Tanaman">
 <div className="space-y-6">
 {/* Header */}
 <div className="space-y-1">
 <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-400 block">
 Diagnostic Studio
 </span>
 <h1 className="text-2xl font-black  tracking-tight" style={{ color: "var(--text-main)" }}>Dokter Tanaman</h1>
 <p className="text-xs /70 leading-relaxed">
 Sistem visi komputer &amp; pakar agrikultur untuk identifikasi penyakit tanaman serta rekomendasi formulasi organik.
 </p>
 </div>

 {!result ? (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-4"
 >
 {/* Input Foto (Kamera + Galeri Terpisah) */}
 <div className="rounded-3xl border p-5 space-y-3.5 backdrop-blur-md shadow-md">
 <span className="text-xs font-bold  uppercase tracking-wider block">
 1. Foto Gejala / Bagian Sakit
 </span>

 {/* Hidden Inputs */}
 <input
 type="file"
 ref={cameraInputRef}
 accept="image/*"
 capture="environment"
 className="hidden"
 onChange={handlePhotoUpload}
 />
 <input
 type="file"
 ref={galleryInputRef}
 accept="image/*"
 className="hidden"
 onChange={handlePhotoUpload}
 />

 {photo ? (
 <div className="relative rounded-2xl overflow-hidden border border-emerald-700 aspect-video bg-black/40">
 <img src={photo} alt="Preview" className="w-full h-full object-cover" />
 <button
 type="button"
 onClick={() => setPhoto(null)}
 className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1 border border-white/20"
 >
 <X className="w-3.5 h-3.5 text-rose-400" />
 <span>Hapus / Ganti Foto</span>
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-2.5">
 <button
 type="button"
 onClick={() => cameraInputRef.current?.click()}
 className="p-4 rounded-2xl border hover:border-emerald-500 hover: flex flex-col items-center justify-center gap-2 transition-all group shadow-sm active:scale-95 text-center"
 >
 <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
 <Camera className="w-5 h-5 stroke-[2.2]" />
 </div>
 <div>
 <span className="text-xs font-black  block" style={{ color: "var(--text-main)" }}>Ambil Foto</span>
 <span className="text-[10px] /70">Buka Kamera Langsung</span>
 </div>
 </button>

 <button
 type="button"
 onClick={() => galleryInputRef.current?.click()}
 className="p-4 rounded-2xl border border-amber-700/50 hover:border-amber-500 hover: flex flex-col items-center justify-center gap-2 transition-all group shadow-sm active:scale-95 text-center"
 >
 <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
 <ImageIcon className="w-5 h-5 stroke-[2.2]" />
 </div>
 <div>
 <span className="text-xs font-black  block" style={{ color: "var(--text-main)" }}>Pilih Galeri</span>
 <span className="text-[10px] /70">Upload dari Memori HP</span>
 </div>
 </button>
 </div>
 )}
 </div>

 {/* Input Deskripsi */}
 <div className="rounded-3xl border p-5 space-y-3.5 backdrop-blur-md shadow-md">
 <span className="text-xs font-bold  uppercase tracking-wider block">
 2. Keterangan Spesimen
 </span>

 <div className="space-y-3">
 <div>
 <span className="text-xs /80 block mb-1 font-medium">Nama Tanaman (Opsional)</span>
 <input
 type="text"
 value={cropName}
 onChange={(e) => setCropName(e.target.value)}
 placeholder="Contoh: Mangga Chokanan, Cabai Rawit..."
 className="w-full border rounded-2xl px-4 py-2.5 text-xs text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-500"
 />
 </div>

 <div>
 <span className="text-xs /80 block mb-1 font-medium">Keluhan / Gejala Fisik</span>
 <textarea
 rows={3}
 value={symptoms}
 onChange={(e) => setSymptoms(e.target.value)}
 placeholder="Jelaskan kondisi tanaman (misal: daun bawah menguning dan rontok, ada bintik hitam...)"
 className="w-full border rounded-2xl p-3 text-xs text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-500 resize-none"
 />
 </div>
 </div>
 </div>

 {error && (
 <p className="text-xs  bg-rose-950/40 p-3 rounded-xl border border-rose-800/40">
 {error}
 </p>
 )}

 <button
 onClick={handleDiagnose}
 disabled={loading || (!photo && !symptoms.trim())}
 className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
 >
 {loading ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin" />
 <span>Dokter AI Sedang Menganalisis...</span>
 </>
 ) : (
 <>
 <Sparkles className="w-4 h-4" />
 <span>Jalankan Diagnosa Sekarang</span>
 </>
 )}
 </button>
 </motion.div>
 ) : (
 /* RESULT DISPLAY */
 <motion.div
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 className="space-y-4"
 >
 <div className="rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-md">
 <div className="flex items-start justify-between border-b pb-4">
 <div>
 <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Diagnosa Terverifikasi</span>
 <h2 className="text-lg font-black " style={{ color: "var(--text-main)" }}>{result.diagnosis}</h2>
 </div>
 <div className="text-right shrink-0">
 <span className={cn(
 "text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border",
 result.severity === 'Kritis' ? "bg-rose-500/20  border-rose-500/30" :
 result.severity === 'Sedang' ? "bg-amber-500/20  border-amber-500/30" :
 "bg-emerald-500/20  border-emerald-500/30"
 )}>
 Tingkat: {result.severity}
 </span>
 <p className="text-[9px] font-mono /60 mt-1">Akurasi {result.confidence || 85}%</p>
 </div>
 </div>

 {result.causes?.length > 0 && (
 <div className="space-y-1.5">
 <span className="text-[10px] font-mono uppercase /80 font-bold block">Faktor Penyebab:</span>
 <ul className="space-y-1">
 {result.causes.map((c: string, idx: number) => (
 <li key={idx} className="text-xs  flex items-start gap-2">
 <span className="text-rose-400 font-bold">•</span>
 <span>{c}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {result.home_remedy && (
 <div className="p-4 rounded-2xl border space-y-2">
 <div className="flex items-center gap-2 ">
 <ShieldCheck className="w-4 h-4 text-emerald-400" />
 <span className="text-xs font-bold uppercase tracking-wider">Solusi Dapur Alami (Direkomendasikan)</span>
 </div>
 <p className="text-xs font-bold " style={{ color: "var(--text-main)" }}>{result.home_remedy.title}</p>
 <div className="text-xs /90 leading-relaxed p-3 rounded-xl border space-y-1.5">
 <p className="font-semibold text-emerald-400 text-[11px]">Bahan Racikan:</p>
 <p className="">{result.home_remedy.recipe}</p>
 <p className="font-semibold text-emerald-400 text-[11px] pt-1">Instruksi Aplikasi:</p>
 <p className="">{result.home_remedy.instructions}</p>
 </div>
 </div>
 )}

 {result.chemical_remedy && (
 <div className="p-4 rounded-2xl border space-y-1.5">
 <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">Opsi Obat Toko Pertanian</span>
 <p className="text-xs ">
 <strong className="" style={{ color: "var(--text-main)" }}>Formulasi:</strong> {result.chemical_remedy.product}
 </p>
 <p className="text-xs /80">
 <strong className="">Dosis:</strong> {result.chemical_remedy.instructions}
 </p>
 </div>
 )}

 {result.preventions?.length > 0 && (
 <div className="space-y-1.5 pt-2 border-t ">
 <span className="text-[10px] font-mono uppercase /80 font-bold block">Pencegahan Agar Tidak Terulang:</span>
 <div className="space-y-1">
 {result.preventions.map((p: string, idx: number) => (
 <div key={idx} className="flex items-start gap-2 text-xs ">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
 <span>{p}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 <button
 onClick={resetForm}
 className="w-full py-3.5 rounded-full border hover:border-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
 >
 <RefreshCw className="w-4 h-4 text-emerald-400" />
 <span>Periksa Tanaman Lain</span>
 </button>
 </motion.div>
 )}
 </div>
 </AppShell>
 );
}