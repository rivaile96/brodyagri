'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import {
 BookOpen,
 ArrowLeft,
 Sun,
 Thermometer,
 Mountain,
 Clock,
 Shovel,
 Sprout,
 Scissors,
 Bug,
 Sparkles,
 ChevronRight,
 Plus,
 ShieldCheck,
 CheckCircle2,
 AlertCircle,
 TreePine,
 Share2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GuideDetailPage() {
 const { slug } = useParams<{ slug: string }>();
 const router = useRouter();

 const [guide, setGuide] = useState<any | null>(null);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'overview' | 'vegetative' | 'generative' | 'pests'>('overview');

 useEffect(() => {
 fetch(`/api/guides/${slug}`)
 .then(r => {
 if (!r.ok) {
 router.push('/guide');
 return null;
 }
 return r.json();
 })
 .then(data => {
 if (data) {
 setGuide(data);
 setLoading(false);
 }
 });
 }, [slug, router]);

 if (loading) return (
 <AppShell>
 <div className="space-y-4 animate-pulse">
 <div className="h-44 rounded-3xl" />
 <div className="h-28 rounded-3xl" />
 </div>
 </AppShell>
 );

 if (!guide) return null;

 const media = guide.media_recipe || {};
 const vegSteps = guide.vegetative_steps || [];
 const genSteps = guide.generative_steps || [];
 const pests = guide.pests_diseases || [];
 const tips = guide.pro_tips || [];

 return (
 <AppShell title={guide.title} rightSlot={
 <Link href="/guide" className="w-9 h-9 rounded-full border flex items-center justify-center  hover:text-white transition-colors">
 <ArrowLeft className="w-4 h-4" />
 </Link>
 }>
 <div className="space-y-5">
 {/* Header Title Card */}
 <div className="rounded-3xl border p-6 space-y-4 backdrop-blur-md shadow-sm">
 <div className="space-y-2">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[10px] font-mono  uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
 {guide.category}
 </span>
 <span className="text-[10px] font-bold  bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-800/40">
 {guide.difficulty}
 </span>
 </div>
 <h1 className="text-xl font-black  tracking-tight leading-snug" style={{ color: "var(--text-main)" }}>
 {guide.title}
 </h1>
 <p className="text-xs /90 leading-relaxed">
 {guide.summary}
 </p>
 </div>

 {/* Key Metrics Grid */}
 <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs border-t /60">
 <div className="p-3 rounded-2xl border flex items-center gap-2.5">
 <Clock className="w-4 h-4 text-amber-400 shrink-0" />
 <div>
 <span className="text-[9px] text-emerald-400/80 font-mono block">Estimasi Panen</span>
 <strong className=" text-[11px] block" style={{ color: "var(--text-main)" }}>{guide.harvest_time}</strong>
 </div>
 </div>

 <div className="p-3 rounded-2xl border flex items-center gap-2.5">
 <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
 <div>
 <span className="text-[9px] text-emerald-400/80 font-mono block">Sinar Surya</span>
 <strong className=" text-[11px] block" style={{ color: "var(--text-main)" }}>{guide.sunlight_req}</strong>
 </div>
 </div>

 <div className="p-3 rounded-2xl border flex items-center gap-2.5">
 <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
 <div>
 <span className="text-[9px] text-emerald-400/80 font-mono block">Suhu Optimal</span>
 <strong className=" text-[11px] block" style={{ color: "var(--text-main)" }}>{guide.optimal_temp}</strong>
 </div>
 </div>

 <div className="p-3 rounded-2xl border flex items-center gap-2.5">
 <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
 <div>
 <span className="text-[9px] text-emerald-400/80 font-mono block">Elevasi Ideal</span>
 <strong className=" text-[11px] block" style={{ color: "var(--text-main)" }}>{guide.optimal_elevation}</strong>
 </div>
 </div>
 </div>

 {/* Action CTA Button */}
 <Link
 href="/wizard"
 className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
 >
 <Plus className="w-4 h-4 stroke-[3]" />
 <span>Mulai Tanam Spesies Ini di Kebunku</span>
 </Link>
 </div>

 {/* Tab Switcher Playbook 4 Pilar */}
 <div className="flex border p-1.5 rounded-3xl backdrop-blur-md shadow-md text-xs font-bold">
 <button
 onClick={() => setActiveTab('overview')}
 className={cn(
 "flex-1 py-2 rounded-2xl transition-all text-center",
 activeTab === 'overview' ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" : "/70 hover:text-white"
 )}
 >
 Media
 </button>

 <button
 onClick={() => setActiveTab('vegetative')}
 className={cn(
 "flex-1 py-2 rounded-2xl transition-all text-center",
 activeTab === 'vegetative' ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" : "/70 hover:text-white"
 )}
 >
 Vegetatif
 </button>

 <button
 onClick={() => setActiveTab('generative')}
 className={cn(
 "flex-1 py-2 rounded-2xl transition-all text-center",
 activeTab === 'generative' ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" : "/70 hover:text-white"
 )}
 >
 Pembuahan
 </button>

 <button
 onClick={() => setActiveTab('pests')}
 className={cn(
 "flex-1 py-2 rounded-2xl transition-all text-center",
 activeTab === 'pests' ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" : "/70 hover:text-white"
 )}
 >
 Hama
 </button>
 </div>

 {/* Content Tabs */}
 <AnimatePresence mode="wait">
 {/* TAB 1: MEDIA TANAM */}
 {activeTab === 'overview' && (
 <motion.div
 key="overview-tab"
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="space-y-4"
 >
 <div className="rounded-3xl border p-5 space-y-4 shadow-md">
 <div className="flex items-center gap-2 border-b pb-3">
 <Shovel className="w-5 h-5 text-emerald-400" />
 <h2 className="text-sm font-black  uppercase tracking-wider" style={{ color: "var(--text-main)" }}>Persiapan Pot &amp; Media Ideal</h2>
 </div>

 {media.pot_size && (
 <div className="p-3 rounded-2xl border text-xs">
 <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">Rekomendasi Wadah:</span>
 <strong className="" style={{ color: "var(--text-main)" }}>{media.pot_size}</strong>
 </div>
 )}

 {media.formula && (
 <div className="p-3 rounded-2xl border text-xs">
 <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">Rumus Takaran Media:</span>
 <strong className=" leading-relaxed block" style={{ color: "var(--text-main)" }}>{media.formula}</strong>
 {media.ph_target && (
 <span className="text-[10px] /70 block mt-1">Target pH Tanah: {media.ph_target}</span>
 )}
 </div>
 )}

 {media.drainage_note && (
 <div className="p-3.5 rounded-2xl border text-xs  leading-relaxed">
 <strong className=" block font-bold mb-0.5">Catatan Drainase:</strong>
 {media.drainage_note}
 </div>
 )}
 </div>

 {/* Tips Pro */}
 {tips.length > 0 && (
 <div className="rounded-3xl border p-5 space-y-3 shadow-md">
 <div className="flex items-center gap-2  font-bold text-xs">
 <Sparkles className="w-4 h-4 text-amber-400" />
 <span>Trik Rahasia Petani Pakar:</span>
 </div>
 <div className="space-y-2">
 {tips.map((tip: string, idx: number) => (
 <div key={idx} className="p-3 rounded-2xl border text-xs /90 flex items-start gap-2.5">
 <span className="w-5 h-5 rounded-full bg-amber-500/20  text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
 ✓
 </span>
 <span className="leading-relaxed">{tip}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 </motion.div>
 )}

 {/* TAB 2: VEGETATIF & PERCABANGAN */}
 {activeTab === 'vegetative' && (
 <motion.div
 key="vegetative-tab"
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="space-y-4"
 >
 <div className="rounded-3xl border p-5 space-y-4 shadow-md">
 <div className="flex items-center gap-2 border-b pb-3">
 <Sprout className="w-5 h-5 text-emerald-400" />
 <h2 className="text-sm font-black  uppercase tracking-wider" style={{ color: "var(--text-main)" }}>Fase Vegetatif &amp; Bentuk Percabangan</h2>
 </div>

 <div className="space-y-3">
 {vegSteps.map((step: any, idx: number) => (
 <div key={idx} className="p-4 rounded-2xl border space-y-1.5">
 <div className="flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">
 {idx + 1}
 </span>
 <h3 className="text-xs font-black " style={{ color: "var(--text-main)" }}>{step.title}</h3>
 </div>
 <p className="text-xs /90 leading-relaxed pl-8">
 {step.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {/* TAB 3: PEMBUAHAN & PRUNING */}
 {activeTab === 'generative' && (
 <motion.div
 key="generative-tab"
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="space-y-4"
 >
 <div className="rounded-3xl border p-5 space-y-4 shadow-md">
 <div className="flex items-center gap-2 border-b pb-3">
 <Scissors className="w-5 h-5 text-amber-400" />
 <h2 className="text-sm font-black  uppercase tracking-wider" style={{ color: "var(--text-main)" }}>Fase Generatif &amp; Jurus Pembuahan</h2>
 </div>

 <div className="space-y-3">
 {genSteps.map((step: any, idx: number) => (
 <div key={idx} className="p-4 rounded-2xl border space-y-1.5">
 <div className="flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">
 {idx + 1}
 </span>
 <h3 className="text-xs font-black " style={{ color: "var(--text-main)" }}>{step.title}</h3>
 </div>
 <p className="text-xs /90 leading-relaxed pl-8">
 {step.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {/* TAB 4: HAMA & PENYAKIT */}
 {activeTab === 'pests' && (
 <motion.div
 key="pests-tab"
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="space-y-4"
 >
 <div className="rounded-3xl border p-5 space-y-4 shadow-md">
 <div className="flex items-center gap-2 border-b pb-3">
 <Bug className="w-5 h-5 text-rose-400" />
 <h2 className="text-sm font-black  uppercase tracking-wider" style={{ color: "var(--text-main)" }}>Penanganan Hama &amp; Penyakit Spesifik</h2>
 </div>

 <div className="space-y-3">
 {pests.map((item: any, idx: number) => (
 <div key={idx} className="p-4 rounded-2xl border space-y-2">
 <div className="flex items-center gap-2 text-rose-400">
 <AlertCircle className="w-4 h-4 shrink-0" />
 <h3 className="text-xs font-black " style={{ color: "var(--text-main)" }}>{item.name}</h3>
 </div>

 <p className="text-xs /80">
 <strong className="">Gejala Fisik:</strong> {item.symptoms}
 </p>

 <div className="p-3 rounded-xl border text-xs ">
 <strong className=" block font-mono text-[10px] uppercase mb-0.5">Solusi Penanganan:</strong>
 {item.solution}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Link ke Dokter AI */}
 <div className="p-4 rounded-3xl border flex items-center justify-between">
 <div>
 <h3 className="text-xs font-bold " style={{ color: "var(--text-main)" }}>Tanaman Mengalami Gejala Lain?</h3>
 <p className="text-[10px] /60">Foto spesimen &amp; dapatkan diagnosa dari Dokter AI</p>
 </div>
 <Link
 href="/doctor"
 className="px-3.5 py-2 rounded-full bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-1 shrink-0"
 >
 <span>Cek AI</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </AppShell>
 );
}