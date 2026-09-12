'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import type { Plant, WeeklyTask } from '@/lib/types';
import {
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Sprout,
  CheckCircle2,
  Circle,
  ChevronRight,
  Plus,
  Sparkles,
  HeartPulse,
  BookOpen,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
  AlertCircle,
  Camera,
  ArrowRight,
  ShieldAlert,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function TodayDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDay());

  // Tanggal 7 hari sepekan
  const todayObj = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayObj);
    const dayDiff = i - todayObj.getDay();
    d.setDate(todayObj.getDate() + dayDiff);
    return {
      dayName: DAYS_OF_WEEK[d.getDay()],
      dateNum: d.getDate(),
      dayIndex: d.getDay(),
      isToday: d.getDay() === todayObj.getDay(),
    };
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
          setPlants(data.active_plants || []);
        }

        // Fetch tasks untuk tanaman aktif
        const plantRes = await fetch('/api/plants');
        if (plantRes.ok) {
          const plantList: Plant[] = await plantRes.json();
          const active = plantList.filter(p => p.status === 'active');
          const allTasks: WeeklyTask[] = [];
          for (const plant of active) {
            const r = await fetch(`/api/plants/${plant.id}`);
            if (!r.ok) continue;
            const d = await r.json();
            const weekTasks = (d.tasks as WeeklyTask[]).filter(t => t.week_number === plant.current_week);
            allTasks.push(...weekTasks);
          }
          setTasks(allTasks);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleTask = async (taskId: string, isDone: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_done: !isDone } : t));
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: !isDone }),
    });
  };

  const doneTasks = tasks.filter(t => t.is_done).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const weather = dashboardData?.weather || {
    temp_c: 29,
    humidity_pct: 72,
    wind_kmh: 8,
    condition: 'Cerah Berawan',
    location: 'Kebun Saya',
    alert: 'Kondisi cuaca ideal untuk aktivitas penyiraman pagi.',
  };

  const stats = dashboardData?.stats || {
    active_count: plants.length,
    harvested_count: 0,
    completion_rate: progressPercent,
    health_index: 95,
  };

  const needActionPlants = dashboardData?.need_action || [];

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Welcome Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{getGreeting()}, Baginda</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Stasiun Kendali Kebun
            </h1>
            <p className="text-xs text-emerald-200/70">
              {loading ? 'Menghubungkan telemetri...' : `${plants.length} tanaman aktif dalam siklus perawatan`}
            </p>
          </div>

          <Link
            href="/wizard"
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all"
            title="Tanam Baru"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </Link>
        </div>

        {/* 1. 🌤️ WIDGET TELEMETRI CUACA REAL-TIME & ALERT */}
        <div className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  Telemetri Cuaca • {weather.location}
                </span>
                <span className="text-xs font-black text-white">{weather.condition}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-white font-mono">{weather.temp_c}°C</span>
            </div>
          </div>

          {/* Grid Sensor Mikro */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#0c1410]/70 p-2.5 rounded-2xl border border-emerald-900/60">
              <span className="text-[9px] text-emerald-300/70 font-semibold block flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-400" /> Suhu
              </span>
              <strong className="text-white font-mono block text-sm mt-0.5">{weather.temp_c}°C</strong>
            </div>

            <div className="bg-[#0c1410]/70 p-2.5 rounded-2xl border border-emerald-900/60">
              <span className="text-[9px] text-emerald-300/70 font-semibold block flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" /> Kelembaban
              </span>
              <strong className="text-white font-mono block text-sm mt-0.5">{weather.humidity_pct}%</strong>
            </div>

            <div className="bg-[#0c1410]/70 p-2.5 rounded-2xl border border-emerald-900/60">
              <span className="text-[9px] text-emerald-300/70 font-semibold block flex items-center justify-center gap-1">
                <Wind className="w-3 h-3 text-emerald-400" /> Angin
              </span>
              <strong className="text-white font-mono block text-sm mt-0.5">{weather.wind_kmh} km/h</strong>
            </div>
          </div>

          {/* Indeks Peringatan Penyiraman */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1b3628] to-[#14281e] border border-emerald-600/40 text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block font-bold mb-0.5">Rekomendasi Aksi Cuaca AI:</strong>
              {weather.alert}
            </div>
          </div>
        </div>

        {/* 2. 📊 GARDEN ANALYTICS & HEALTH INDEX */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 space-y-2 backdrop-blur-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Indeks Kesehatan AI</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{stats.health_index}%</p>
            <span className="text-[10px] text-emerald-300/70 block">
              {stats.health_index >= 90 ? 'Kebun Sangat Prima' : 'Perlu Pemantauan'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 space-y-2 backdrop-blur-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Kedisiplinan Rawat</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{progressPercent}%</p>
            <span className="text-[10px] text-emerald-300/70 block">
              {doneTasks}/{totalTasks} Tugas Selesai
            </span>
          </div>
        </div>

        {/* 3. 🚨 SPOTLIGHT / TANAMAN BUTUH PERHATIAN (Photo Upload Due) */}
        {needActionPlants.length > 0 && (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#2a2215] to-[#1c1810] border border-amber-600/40 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Waktunya Upload Foto Mingguan!</span>
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Tanaman berikut telah memasuki pekan baru dan membutuhkan foto terbaru agar AI bisa memberikan rekomendasi tugas lanjutan.
            </p>
            <div className="space-y-2">
              {needActionPlants.slice(0, 2).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/plants/${p.id}`}
                  className="p-3 rounded-2xl bg-[#0c1410]/80 border border-amber-500/30 flex items-center justify-between hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                      <span className="text-[10px] text-amber-300/70">Minggu Ke-{p.current_week}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 flex items-center gap-1">
                    Foto Sekarang <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 4. 📅 DATE STRIP KALENDER MINGGUAN INTERAKTIF */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Jadwal Kalender Pekan Ini
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {weekDates.find(w => w.dayIndex === selectedDate)?.dayName}, {weekDates.find(w => w.dayIndex === selectedDate)?.dateNum}
            </span>
          </div>

          <div className="flex justify-between items-center gap-1.5 p-2 rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 backdrop-blur-md">
            {weekDates.map(w => {
              const isSelected = selectedDate === w.dayIndex;
              return (
                <button
                  key={w.dayIndex}
                  onClick={() => setSelectedDate(w.dayIndex)}
                  className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-500 to-green-600 text-zinc-950 font-black shadow-md scale-105'
                      : w.isToday
                      ? 'bg-emerald-950 border border-emerald-600/50 text-emerald-300 font-bold'
                      : 'text-emerald-200/60 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] uppercase font-mono">{w.dayName}</span>
                  <span className="text-sm font-black mt-0.5">{w.dateNum}</span>
                  {w.isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ⚡ PINTASAN CEPAT (QUICK ACTIONS) */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/doctor"
            className="p-3.5 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-700/40 hover:border-emerald-500/60 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Dokter AI Tanaman</span>
              <span className="text-[10px] text-emerald-200/60">Diagnosa Penyakit</span>
            </div>
          </Link>

          <Link
            href="/recipes"
            className="p-3.5 rounded-2xl bg-gradient-to-br from-[#272a1c] to-[#1c2016] border border-amber-700/40 hover:border-amber-500/60 transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Formulasi Pupuk</span>
              <span className="text-[10px] text-amber-200/60">Resep &amp; Dosis Pot</span>
            </div>
          </Link>
        </div>

        {/* 6. 📝 CHECKLIST TUGAS HARIAN */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Instruksi Rawat Harian
            </h2>
            <span className="text-xs font-bold text-emerald-400">
              {doneTasks}/{totalTasks} Selesai
            </span>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map(task => {
                const plant = plants.find(p => p.id === task.plant_id);
                return (
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
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium leading-relaxed ${task.is_done ? 'line-through text-emerald-300/40' : 'text-emerald-50'}`}>
                        {task.task}
                      </p>
                      {plant && (
                        <p className="text-[10px] text-emerald-400/80 mt-1 font-semibold flex items-center gap-1">
                          <Sprout className="w-3 h-3" />
                          <span>{plant.name} · Minggu {task.week_number}</span>
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#14231b]/60 border border-emerald-800/40 p-6 text-center space-y-3">
              <p className="text-xs text-emerald-200/70">Belum ada tugas perawatan untuk hari ini.</p>
              <Link href="/wizard" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline">
                <Plus className="w-4 h-4" /> Tanam Spesies Baru
              </Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
