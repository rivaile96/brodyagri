'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { CATEGORIES, COMMODITIES, VARIETIES } from '@/lib/tasks';
import { evaluateSuitability, type ClimateData, type SuitabilityResult } from '@/lib/suitability';
import {
 ChevronLeft,
 ChevronRight,
 Check,
 MapPin,
 Loader2,
 RefreshCw,
 Thermometer,
 Droplets,
 Wind,
 CloudRain,
 Mountain,
 Plus,
 Sparkles,
 Compass,
 Layers,
 Sun,
 ShieldAlert,
 Calendar,
 TreePine,
 CheckCircle2,
 AlertCircle,
 Info,
 Building2,
 Home,
 Shovel,
 Trees,
 Waves,
 Apple,
 Salad,
 Flame,
 Wheat,
 Cherry,
 Tag,
 History,
 ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEMENTS = [
 {
 value: 'rooftop',
 label: 'Rooftop / Dak Atas',
 desc: 'Panas terik langsung & angin kencang. Wajib pot ringan & naungan peneduh.',
 icon: Building2,
 iconColor: 'text-amber-400',
 iconBg: 'bg-amber-400/15 border-amber-400/30',
 },
 {
 value: 'terrace',
 label: 'Halaman / Teras',
 desc: 'Matahari sebagian, terlindung tempias hujan. Cocok untuk pot sedang/balkon.',
 icon: Home,
 iconColor: 'text-emerald-400',
 iconBg: 'bg-emerald-400/15 border-emerald-400/30',
 },
 {
 value: 'yard',
 label: 'Pekarangan Tanah',
 desc: 'Tanah langsung, perakaran bebas tanpa batas pot. Paling fleksibel untuk semua jenis.',
 icon: Shovel,
 iconColor: 'text-amber-500',
 iconBg: 'bg-amber-500/15 border-amber-500/30',
 },
 {
 value: 'field',
 label: 'Kebun / Lahan Terbuka',
 desc: 'Sinar matahari penuh seharian, ruang luas untuk pohon buah besar & kanopi lebar.',
 icon: Trees,
 iconColor: 'text-green-400',
 iconBg: 'bg-green-400/15 border-green-400/30',
 },
 {
 value: 'wetland',
 label: 'Sawah / Lahan Basah',
 desc: 'Air melimpah / genangan terkontrol. Khusus sayur air (kangkung, genjer, talas).',
 icon: Waves,
 iconColor: 'text-cyan-400',
 iconBg: 'bg-cyan-400/15 border-cyan-400/30',
 },
];

const CATEGORY_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
 'Buah-buahan': { icon: Apple, color: 'text-amber-400', bg: 'bg-amber-400/15 border-amber-400/30' },
 'Sayuran Daun': { icon: Salad, color: 'text-emerald-400', bg: 'bg-emerald-400/15 border-emerald-400/30' },
 'Sayuran Buah': { icon: Cherry, color: 'text-rose-400', bg: 'bg-rose-400/15 border-rose-400/30' },
 'Rempah & Herbal': { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/15 border-orange-400/30' },
 'Umbi-umbian': { icon: Shovel, color: 'text-yellow-600', bg: 'bg-yellow-600/15 border-yellow-600/30' },
 'Kacang-kacangan': { icon: Wheat, color: 'text-lime-400', bg: 'bg-lime-400/15 border-lime-400/30' },
};

type WizardState = {
 location: { name: string; lat: number; lon: number } | null;
 climate: ClimateData | null;
 placement: string;
 category: string;
 commodity: string;
 variety: string;
 name: string;
 planted_at: string;
};

export default function WizardPage() {
 const router = useRouter();
 const [step, setStep] = useState(1);
 const [locating, setLocating] = useState(false);
 const [locError, setLocError] = useState('');
 const [submitting, setSubmitting] = useState(false);

 const today = new Date().toISOString().split('T')[0];
 const [state, setState] = useState<WizardState>({
 location: null,
 climate: null,
 placement: 'yard',
 category: '',
 commodity: '',
 variety: '',
 name: '',
 planted_at: today,
 });

 const [showCustomInput, setShowCustomInput] = useState(false);
 const [customVarietyName, setCustomVarietyName] = useState('');
 const [customResult, setCustomResult] = useState<(SuitabilityResult & { ai_note?: string }) | null>(null);
 const [customError, setCustomError] = useState('');
 const [loadingCustom, setLoadingCustom] = useState(false);

 const update = <K extends keyof WizardState>(k: K, v: WizardState[K]) =>
 setState(prev => ({ ...prev, [k]: v }));

 const detectLocation = () => {
 if (!navigator.geolocation) {
 setLocError('Geolocation tidak didukung di peramban ini.');
 return;
 }
 setLocating(true);
 setLocError('');
 navigator.geolocation.getCurrentPosition(
 async pos => {
 const { latitude: lat, longitude: lon } = pos.coords;
 try {
 const res = await fetch(`/api/climate?lat=${lat}&lon=${lon}`);
 if (!res.ok) throw new Error();
 const data = await res.json();
 update('location', { name: data.location_name, lat, lon });
 update('climate', data.climate);
 } catch {
 setLocError('Gagal menarik data iklim 3 tahun. Pastikan jaringan stabil.');
 } finally {
 setLocating(false);
 }
 },
 () => {
 setLocError('Izin lokasi ditolak. Silakan aktifkan izin GPS di pengaturan browser.');
 setLocating(false);
 },
 { timeout: 15000, enableHighAccuracy: true }
 );
 };

 const handleEvaluateCustom = async () => {
 if (!customVarietyName.trim() || !state.climate || !state.placement) return;
 setLoadingCustom(true);
 setCustomError('');
 setCustomResult(null);
 try {
 const res = await fetch('/api/evaluate-variety', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 variety_name: customVarietyName.trim(),
 commodity: state.commodity,
 category: state.category,
 climate: state.climate,
 placement: state.placement,
 }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error ?? 'Gagal menganalisis varietas');
 setCustomResult(data);
 update('variety', customVarietyName.trim());
 } catch (e: any) {
 setCustomError(e.message ?? 'Gagal menganalisis varietas');
 } finally {
 setLoadingCustom(false);
 }
 };

 const rawVarieties = (state.commodity && VARIETIES[state.commodity]) || [];
 const varietiesWithScore = state.climate
 ? rawVarieties
 .map(v => evaluateSuitability({ ...v, category: state.category }, state.climate!, state.placement))
 .sort((a, b) => b.score - a.score)
 : [];

 const selectedPlacement = PLACEMENTS.find(p => p.value === state.placement);

 const canNext = () => {
 if (step === 1) return !!state.climate;
 if (step === 2) return !!state.placement;
 if (step === 3) return !!state.category;
 if (step === 4) return !!state.commodity;
 if (step === 5) return !!state.variety;
 if (step === 6) return !!state.name.trim();
 return false;
 };

 const handleSubmit = async () => {
 if (!canNext()) return;
 setSubmitting(true);
 try {
 const res = await fetch('/api/plants', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 name: state.name.trim(),
 variety_name: state.variety,
 crop_name: state.commodity,
 category: state.category,
 location_type: state.placement,
 planted_at: state.planted_at,
 // Simpan telemetry & history 1-4 secara utuh ke database
 location_name: state.location?.name,
 latitude: state.location?.lat,
 longitude: state.location?.lon,
 avg_temp_c: state.climate?.avg_temp_c,
 current_temp_c: state.climate?.current_temp_c,
 avg_humidity_pct: state.climate?.avg_humidity_pct,
 annual_rainfall_mm: state.climate?.annual_rainfall_mm,
 dry_months_count: state.climate?.dry_months_count,
 sunshine_hours_day: state.climate?.sunshine_hours_day,
 elevation_m: state.climate?.elevation_m,
 climate_zone: state.climate?.climate_zone,
 }),
 });
 if (!res.ok) throw new Error();
 const plant = await res.json();
 router.push(`/plants/${plant.id}`);
 } catch {
 setSubmitting(false);
 }
 };

 return (
 <AppShell title="Perencanaan Tanam">
 <div className="space-y-5">
 {/* Step Indicator Header */}
 <div className="space-y-2">
 <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-300">
 <span>TAHAP {step} DARI 6</span>
 <span className="text-emerald-400 font-bold">
 {step === 1 && 'Audit Iklim 3 Tahun'}
 {step === 2 && 'Area Penempatan'}
 {step === 3 && 'Kategori Tanam'}
 {step === 4 && 'Pilihan Komoditas'}
 {step === 5 && 'Ranking Varietas AI'}
 {step === 6 && 'Profil Tanaman'}
 </span>
 </div>
 <div className="w-full h-1.5 rounded-full overflow-hidden border p-0.5">
 <motion.div
 className="h-full bg-emerald-500 rounded-full"
 initial={{ width: '16.6%' }}
 animate={{ width: `${(step / 6) * 100}%` }}
 transition={{ duration: 0.3 }}
 />
 </div>
 </div>

 {/* ── RANTAI RIWAYAT KEPUTUSAN / HISTORY CHAIN (PERSISTENT BREADCRUMB 1 -> 2 -> 3 -> 4) ── */}
 {step > 1 && state.climate && (
 <div className="p-3.5 rounded-2xl border shadow-sm space-y-2 backdrop-blur-md">
 <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300">
 <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
 <History className="w-3.5 h-3.5 text-amber-400" />
 <span>Rantai Riwayat Analisis Terpadu</span>
 </span>
 <span className="text-emerald-400/70 font-mono">Tersambung ke AI</span>
 </div>

 <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hidden text-[11px]">
 {/* Badge 1: Location & 3Y Climate */}
 <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl border text-emerald-200">
 <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
 <span className="font-bold truncate max-w-[110px]">{state.location?.name?.split(',')[0]}</span>
 <span className="text-[9px] text-emerald-400/70 font-mono">({state.climate.avg_temp_c}°C · {state.climate.elevation_m}m)</span>
 </div>

 {/* Arrow */}
 <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />

 {/* Badge 2: Placement */}
 <div className={cn(
 "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all",
 step >= 2 ? " text-emerald-200" : "bg-zinc-900/40 border-zinc-800 text-zinc-500"
 )}>
 {selectedPlacement && <selectedPlacement.icon className="w-3 h-3 text-amber-400 shrink-0" />}
 <span className="font-semibold">{selectedPlacement?.label.split('/')[0].trim()}</span>
 </div>

 {/* Arrow */}
 {step >= 3 && (
 <>
 <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
 {/* Badge 3: Category */}
 <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl border text-emerald-200">
 <TreePine className="w-3 h-3 text-green-400 shrink-0" />
 <span className="font-semibold">{state.category || 'Pilih Kategori'}</span>
 </div>
 </>
 )}

 {/* Arrow */}
 {step >= 4 && state.commodity && (
 <>
 <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
 {/* Badge 4: Commodity */}
 <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl border text-emerald-200">
 <Tag className="w-3 h-3 text-cyan-400 shrink-0" />
 <span className="font-semibold">{state.commodity}</span>
 </div>
 </>
 )}
 </div>
 </div>
 )}

 {/* Step Contents */}
 <AnimatePresence mode="wait">
 <motion.div
 key={step}
 initial={{ opacity: 0, x: 12 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -12 }}
 transition={{ duration: 0.25, ease: 'easeOut' }}
 className="space-y-5"
 >
 {/* STEP 1: AUDIT IKLIM 3 TAHUN & REALTIME */}
 {step === 1 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 1: Telemetry &amp; Historical Climate
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Audit Iklim Wilayah (3 Tahun)</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 AI membaca riwayat cuaca 3 tahun lokasi Anda untuk dasar kecocokan jenis varietas.
 </p>
 </div>

 {!state.climate ? (
 <div className="rounded-3xl border p-8 text-center space-y-4 backdrop-blur-md shadow-md">
 <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
 <Compass className="w-7 h-7 stroke-[2]" />
 </div>
 <div className="space-y-1 max-w-xs mx-auto">
 <p className="text-sm font-black text-white">Sinkronisasi GPS &amp; Stasiun Cuaca</p>
 <p className="text-xs text-emerald-200/60">Tekan tombol di bawah untuk menarik telemetri elevasi dan riwayat cuaca 3 tahun lokasi Anda.</p>
 </div>

 {locError && (
 <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-800/40">
 {locError}
 </p>
 )}

 <button
 onClick={detectLocation}
 disabled={locating}
 className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-sm active:scale-95 transition-all disabled:opacity-60"
 >
 {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 stroke-[2.5]" />}
 <span>{locating ? 'Mengambil Arsip Iklim 3 Tahun...' : 'Deteksi Iklim Wilayah Saya'}</span>
 </button>
 </div>
 ) : (
 <div className="space-y-3">
 {/* Header Lokasi */}
 <div className="rounded-3xl border p-5 space-y-3 shadow-md">
 <div className="flex items-start justify-between gap-3 border-b pb-3">
 <div>
 <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold block mb-0.5">
 Lokasi Geografis Terverifikasi
 </span>
 <p className="text-sm font-black text-white">{state.location?.name}</p>
 <span className="text-[10px] text-emerald-300/80 font-medium block mt-0.5">
 Zona: {state.climate.climate_zone ?? 'Tropis Dataran Rendah'}
 </span>
 </div>
 <button
 onClick={detectLocation}
 className="text-emerald-400 hover:text-white p-2 rounded-xl bg-emerald-950/50 border transition-colors shrink-0"
 title="Refresh data iklim"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>

 {/* Status Banner AI */}
 <div className="p-3 rounded-2xl border text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2.5">
 <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
 <div>
 <strong className="text-emerald-300 block font-bold mb-0.5">Data Iklim Tersimpan Sebagai Basis History:</strong>
 Rerata suhu {state.climate.avg_temp_c}°C, elevasi {state.climate.elevation_m} mdpl, curah hujan {state.climate.annual_rainfall_mm} mm/thn, dan sinar {state.climate.sunshine_hours_day ?? 6.8} jam/hari akan otomatis dikunci ke langkah 2, 3, 4, dan evaluasi varietas.
 </div>
 </div>

 {/* Grid Matriks Telemetri 3 Tahun + Realtime */}
 <div className="grid grid-cols-2 gap-2.5 pt-1">
 <div className="p-3.5 rounded-2xl border space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] text-emerald-300/70 font-semibold">Suhu Rerata 3 Thn</span>
 <Thermometer className="w-4 h-4 text-amber-400" />
 </div>
 <p className="text-lg font-black text-white">{state.climate.avg_temp_c}°C</p>
 <span className="text-[9px] text-emerald-400 block font-medium">Hari ini: {state.climate.current_temp_c}°C ({state.climate.current_weather})</span>
 </div>

 <div className="p-3.5 rounded-2xl border space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] text-emerald-300/70 font-semibold">Elevasi / Ketinggian</span>
 <Mountain className="w-4 h-4 text-emerald-400" />
 </div>
 <p className="text-lg font-black text-white">{state.climate.elevation_m} mdpl</p>
 <span className="text-[9px] text-emerald-300/80 block font-medium">
 {state.climate.elevation_m > 700 ? 'Dataran Tinggi' : state.climate.elevation_m > 400 ? 'Dataran Menengah' : 'Dataran Rendah'}
 </span>
 </div>

 <div className="p-3.5 rounded-2xl border space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] text-emerald-300/70 font-semibold">Curah Hujan Tahunan</span>
 <CloudRain className="w-4 h-4 text-cyan-400" />
 </div>
 <p className="text-lg font-black text-white">{state.climate.annual_rainfall_mm} mm</p>
 <span className="text-[9px] text-cyan-300 block font-medium">± {state.climate.dry_months_count ?? 3} bulan kemarau/thn</span>
 </div>

 <div className="p-3.5 rounded-2xl border space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] text-emerald-300/70 font-semibold">Penyinaran Surya</span>
 <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
 </div>
 <p className="text-lg font-black text-white">{state.climate.sunshine_hours_day ?? 6.8} jam/hari</p>
 <span className="text-[9px] text-amber-300 block font-medium">Kelembaban {state.climate.avg_humidity_pct}%</span>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* STEP 2: PENEMPATAN / MEDIA */}
 {step === 2 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 2: Wadah &amp; Paparan Sinar
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Area Penanaman di Rumah</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 Setiap area memiliki suhu mikro, terpaan angin, dan kapasitas volume media tanah yang berbeda.
 </p>
 </div>

 <div className="space-y-2.5">
 {PLACEMENTS.map(p => {
 const isSelected = state.placement === p.value;
 const IconComp = p.icon;
 return (
 <button
 key={p.value}
 onClick={() => update('placement', p.value)}
 className={`w-full p-4 rounded-3xl text-left border transition-all active:scale-[0.98] flex items-start gap-3.5 ${
 isSelected
 ? ' border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30'
 : ' hover:border-emerald-700 text-emerald-100'
 }`}
 >
 <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5", p.iconBg)}>
 <IconComp className={cn("w-5 h-5", p.iconColor)} />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1">
 <p className="text-sm font-black tracking-tight text-white">{p.label}</p>
 {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
 </div>
 <p className="text-xs text-emerald-200/70 leading-relaxed">{p.desc}</p>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* STEP 3: KATEGORI */}
 {step === 3 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 3: Kelompok Komoditas
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Kategori Tanaman</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 Pilih rumpun tanaman yang ingin dibudidayakan di kebun Anda.
 </p>
 </div>

 <div className="grid grid-cols-2 gap-2.5">
 {CATEGORIES.map(cat => {
 const isSelected = state.category === cat.label;
 const catMeta = CATEGORY_ICONS[cat.label] || { icon: TreePine, color: 'text-emerald-400', bg: 'bg-emerald-400/15 border-emerald-400/30' };
 const CatIcon = catMeta.icon;
 return (
 <button
 key={cat.label}
 onClick={() => {
 update('category', cat.label);
 update('commodity', '');
 update('variety', '');
 }}
 className={`p-4 rounded-3xl text-left border transition-all active:scale-[0.96] flex flex-col justify-between h-32 ${
 isSelected
 ? ' border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30'
 : ' hover:border-emerald-700 text-emerald-100'
 }`}
 >
 <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border", catMeta.bg)}>
 <CatIcon className={cn("w-5 h-5", catMeta.color)} />
 </div>
 <div>
 <p className="text-xs font-black tracking-tight text-white">{cat.label}</p>
 <span className="text-[9px] text-emerald-400/70 font-medium block mt-0.5">Pilih Rumpun</span>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* STEP 4: KOMODITAS */}
 {step === 4 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 4: Spesies Pilihan
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Pilih Jenis Spesies {state.category}</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 Spesies dalam rumpun <span className="text-emerald-400 font-bold">{state.category}</span> yang akan dievaluasi dengan iklim 3 tahun.
 </p>
 </div>

 <div className="grid grid-cols-2 gap-2.5">
 {(COMMODITIES[state.category] || []).map(cmd => {
 const isSelected = state.commodity === cmd.name;
 return (
 <button
 key={cmd.name}
 onClick={() => {
 update('commodity', cmd.name);
 update('variety', '');
 }}
 className={`p-4 rounded-3xl text-left border transition-all active:scale-[0.96] flex flex-col justify-between h-28 ${
 isSelected
 ? ' border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30'
 : ' hover:border-emerald-700 text-emerald-100'
 }`}
 >
 <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
 <Tag className="w-4 h-4" />
 </div>
 <div>
 <p className="text-xs font-black tracking-tight text-white">{cmd.name}</p>
 <p className="text-[10px] text-emerald-200/60 line-clamp-1 mt-0.5">{cmd.description}</p>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* STEP 5: RANKING VARIETAS HASIL SINTESIS 1 + 2 + 3 + 4 */}
 {step === 5 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 5: Sintesis Akurasi AI
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Kesesuaian Varietas {state.commodity}</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 AI menghitung kesesuaian biologis dengan mensintesiskan seluruh data dari langkah 1 sampai 4.
 </p>
 </div>

 {/* Penjelasan Transparan Sintesis AI */}
 <div className="p-4 rounded-3xl border space-y-2.5 shadow-sm">
 <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
 <Sparkles className="w-4 h-4 text-amber-400" />
 <span>Perhitungan Presisi AI Berdasarkan 4 Parameter:</span>
 </div>
 <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-100/90">
 <div className="p-2.5 rounded-2xl border ">
 <span className="text-emerald-400/80 font-mono text-[9px] block">1. IKLIM 3 TAHUN</span>
 <strong>{state.location?.name?.split(',')[0]}</strong>
 <p className="text-[10px] text-emerald-300/70">{state.climate?.avg_temp_c}°C · {state.climate?.elevation_m} mdpl</p>
 </div>
 <div className="p-2.5 rounded-2xl border ">
 <span className="text-emerald-400/80 font-mono text-[9px] block">2. PENEMPATAN</span>
 <strong>{selectedPlacement?.label}</strong>
 <p className="text-[10px] text-emerald-300/70">Wadah pot &amp; intensitas cahaya</p>
 </div>
 <div className="p-2.5 rounded-2xl border ">
 <span className="text-emerald-400/80 font-mono text-[9px] block">3. RUMPUN</span>
 <strong>{state.category}</strong>
 <p className="text-[10px] text-emerald-300/70">Sifat fotosintesis famili</p>
 </div>
 <div className="p-2.5 rounded-2xl border ">
 <span className="text-emerald-400/80 font-mono text-[9px] block">4. SPESIES</span>
 <strong>{state.commodity}</strong>
 <p className="text-[10px] text-emerald-300/70">Kebutuhan jam sinar &amp; air</p>
 </div>
 </div>
 </div>

 <div className="space-y-2.5">
 {varietiesWithScore.map((v, i) => {
 const isSelected = state.variety === v.name;
 return (
 <button
 key={v.name}
 onClick={() => {
 update('variety', v.name);
 setCustomResult(null);
 }}
 className={`w-full p-4 rounded-3xl text-left border transition-all space-y-3 active:scale-[0.98] ${
 isSelected
 ? ' border-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30'
 : ' hover:border-emerald-700 text-emerald-100'
 }`}
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-mono font-bold text-emerald-500">#{i + 1}</span>
 <p className="text-sm font-black text-white tracking-tight">{v.name}</p>
 </div>
 <span className={cn(
 'text-[9px] font-bold uppercase tracking-wider mt-0.5 inline-block',
 v.badge === 'emerald' ? 'text-emerald-400' : v.badge === 'amber' ? 'text-amber-400' : 'text-rose-400'
 )}>
 {v.level}
 </span>
 </div>

 <div className="text-right shrink-0">
 <span className={cn(
 'text-xl font-black font-mono',
 v.badge === 'emerald' ? 'text-emerald-400' : v.badge === 'amber' ? 'text-amber-400' : 'text-rose-400'
 )}>
 {v.score}%
 </span>
 <span className="text-[8px] font-mono uppercase tracking-wider text-emerald-300/60 block">Kesesuaian</span>
 </div>
 </div>

 {/* Skor Bar */}
 <div className="w-full h-1.5 rounded-full overflow-hidden">
 <div
 className={cn('h-full rounded-full transition-all', v.badge === 'emerald' ? 'bg-emerald-500' : v.badge === 'amber' ? 'bg-amber-400' : 'bg-rose-400')}
 style={{ width: `${v.score}%` }}
 />
 </div>

 <p className="text-xs text-emerald-200/80 leading-relaxed">{v.description}</p>

 <div className="space-y-1 pt-1">
 {v.advantages.map((adv, j) => (
 <div key={j} className="flex items-start gap-1.5 text-[11px] text-emerald-300">
 <span className="text-emerald-400 font-bold shrink-0">✓</span>
 <span>{adv}</span>
 </div>
 ))}
 {v.challenges.map((ch, j) => (
 <div key={j} className="flex items-start gap-1.5 text-[11px] text-amber-300">
 <span className="text-amber-400 font-bold shrink-0">!</span>
 <span>{ch}</span>
 </div>
 ))}
 </div>

 <div className="p-2.5 rounded-2xl border text-[11px] text-emerald-200/90">
 <strong className="text-emerald-300 block mb-0.5">Rekomendasi Racikan Media:</strong>
 {v.media}
 </div>
 </button>
 );
 })}
 </div>

 {/* Custom Variety Input Drawer */}
 <div className="pt-2 border-t ">
 {!showCustomInput ? (
 <button
 onClick={() => {
 setShowCustomInput(true);
 setCustomResult(null);
 setCustomError('');
 }}
 className="w-full py-3.5 px-4 rounded-3xl border border-dashed hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all /40"
 >
 <Plus className="w-4 h-4 text-emerald-400" />
 <span>Input Varietas Sendiri (Diuji terhadap 4 Parameter)</span>
 </button>
 ) : (
 <div className="rounded-3xl /95 border p-5 space-y-3">
 <div className="flex items-center gap-2 text-emerald-300">
 <Sparkles className="w-4 h-4 text-amber-400" />
 <span className="text-xs font-bold uppercase tracking-wider">Uji Kesesuaian Varietas Custom</span>
 </div>

 <div className="flex gap-2">
 <input
 type="text"
 value={customVarietyName}
 onChange={e => {
 setCustomVarietyName(e.target.value);
 setCustomResult(null);
 setCustomError('');
 }}
 placeholder="Ketik nama varietas (cth: Mangga Irwin, Red Globe...)"
 className="flex-1 border rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-500"
 />
 <button
 onClick={handleEvaluateCustom}
 disabled={!customVarietyName.trim() || loadingCustom}
 className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
 >
 {loadingCustom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
 <span>Uji AI</span>
 </button>
 </div>

 {customError && (
 <p className="text-xs text-rose-300">{customError}</p>
 )}

 {customResult && (
 <div 
 className="p-4 rounded-3xl border space-y-3 shadow-sm transition-all"
 style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-mono font-bold text-emerald-500">★ Custom</span>
 <p className="text-sm font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
 {customResult.name || customVarietyName}
 </p>
 </div>
 <span className={cn(
 'text-[9px] font-bold uppercase tracking-wider mt-0.5 inline-block',
 customResult.badge === 'emerald' ? 'text-emerald-500' : customResult.badge === 'amber' ? 'text-amber-500' : 'text-rose-500'
 )}>
 {customResult.level || 'Hasil Evaluasi AI'}
 </span>
 </div>

 <div className="text-right shrink-0">
 <span className={cn(
 'text-xl font-black font-mono',
 customResult.badge === 'emerald' ? 'text-emerald-500' : customResult.badge === 'amber' ? 'text-amber-500' : 'text-rose-500'
 )}>
 {customResult.score}%
 </span>
 <span className="text-[8px] font-mono uppercase tracking-wider block" style={{ color: 'var(--text-dim)' }}>
 Kesesuaian
 </span>
 </div>
 </div>

 {/* Progress Bar Kesesuaian */}
 <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-card-subtle)' }}>
 <div
 className={cn(
 'h-full rounded-full transition-all',
 customResult.badge === 'emerald' ? 'bg-emerald-500' : customResult.badge === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
 )}
 style={{ width: `${customResult.score}%` }}
 />
 </div>

 {/* Deskripsi Lengkap Varietas Custom */}
 <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
 {customResult.description || customResult.ai_note}
 </p>

 {/* Advantages & Challenges */}
 {customResult.advantages && customResult.advantages.length > 0 && (
 <div className="space-y-1 pt-1">
 {customResult.advantages.map((adv: string, j: number) => (
 <div key={j} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--accent-primary)' }}>
 <Check className="w-3.5 h-3.5 shrink-0" />
 <span>{adv}</span>
 </div>
 ))}
 {customResult.challenges && customResult.challenges.map((chl: string, j: number) => (
 <div key={j} className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500">
 <AlertCircle className="w-3.5 h-3.5 shrink-0" />
 <span>{chl}</span>
 </div>
 ))}
 </div>
 )}

 {/* Rekomendasi Media Tanam */}
 {customResult.media && (
 <div 
 className="p-3 rounded-2xl border text-[11px] leading-relaxed"
 style={{ 
 backgroundColor: 'var(--badge-bg)', 
 borderColor: 'var(--badge-border)', 
 color: 'var(--badge-text)' 
 }}
 >
 <strong className="block mb-0.5 font-bold">Rekomendasi Racikan Media:</strong>
 <span>{customResult.media}</span>
 </div>
 )}

 {/* Tombol Pilih Varietas Custom */}
 <button
 onClick={() => {
 update('variety', customVarietyName.trim());
 }}
 className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
 >
 <Check className="w-4 h-4 stroke-[3]" />
 <span>Gunakan Varietas Ini ({customVarietyName.trim()})</span>
 </button>
 </div>
 )}

 <button
 onClick={() => setShowCustomInput(false)}
 className="text-[11px] text-emerald-400/60 hover:text-emerald-300 block"
 >
 Batal / Tutup
 </button>
 </div>
 )}
 </div>
 </div>
 )}

 {/* STEP 6: PENAMAAN & FINALISASI */}
 {step === 6 && (
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
 Pijakan 6: Identitas &amp; Penguncian Database
 </span>
 <h2 className="text-xl font-black text-white tracking-tight">Beri Nama Tanamanmu</h2>
 <p className="text-xs text-emerald-200/70 leading-relaxed">
 Seluruh riwayat telemetri iklim 3 tahun &amp; penempatan akan diarsip permanen dengan tanaman ini.
 </p>
 </div>

 <div className="rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-md">
 <div>
 <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-1.5">
 Nama Panggilan Tanaman
 </label>
 <input
 type="text"
 value={state.name}
 onChange={e => update('name', e.target.value)}
 placeholder="Contoh: Tabulampot Mangga Chokanan Depan Rumah"
 className="w-full border rounded-2xl px-4 py-3 text-sm text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-500"
 />
 </div>

 <div>
 <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-1.5">
 Tanggal Mulai Tanam
 </label>
 <input
 type="date"
 value={state.planted_at}
 onChange={e => update('planted_at', e.target.value)}
 className="w-full border rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
 />
 </div>

 {/* Summary Box History Chain */}
 <div className="p-4 rounded-2xl border space-y-2 text-xs text-emerald-100">
 <div className="flex justify-between items-center">
 <span className="text-emerald-400/70">1. Wilayah &amp; Iklim:</span>
 <strong className="text-white font-mono">{state.location?.name?.split(',')[0]} ({state.climate?.avg_temp_c}°C)</strong>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-emerald-400/70">2. Area Penempatan:</span>
 <strong className="text-white">{selectedPlacement?.label}</strong>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-emerald-400/70">3. Rumpun Kategori:</span>
 <strong className="text-white">{state.category}</strong>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-emerald-400/70">4. Spesies Komoditas:</span>
 <strong className="text-white">{state.commodity}</strong>
 </div>
 <div className="flex justify-between items-center pt-1 border-t ">
 <span className="text-emerald-400/70">5. Varietas Terpilih:</span>
 <strong className="text-emerald-300 font-bold">{state.variety}</strong>
 </div>
 </div>
 </div>
 </div>
 )}
 </motion.div>
 </AnimatePresence>

 {/* Bottom Navigation Buttons */}
 <div className="flex items-center justify-between gap-3 pt-4 border-t ">
 {step > 1 ? (
 <button
 onClick={() => setStep(s => s - 1)}
 className="px-5 py-3 rounded-full border text-emerald-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
 >
 <ChevronLeft className="w-4 h-4" />
 <span>Sebelumnya</span>
 </button>
 ) : <div />}

 {step < 6 ? (
 <button
 onClick={() => setStep(s => s + 1)}
 disabled={!canNext()}
 className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm active:scale-95"
 >
 <span>Lanjutkan</span>
 <ChevronRight className="w-4 h-4 stroke-[3]" />
 </button>
 ) : (
 <button
 onClick={handleSubmit}
 disabled={!canNext() || submitting}
 className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm active:scale-95"
 >
 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
 <span>Simpan &amp; Kunci Database</span>
 </button>
 )}
 </div>
 </div>
 </AppShell>
 );
}