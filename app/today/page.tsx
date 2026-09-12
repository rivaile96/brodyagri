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
  Leaf,
  FlaskConical,
  Settings as SettingsIcon
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
    health_index: plants.length === 0 ? 0 : 95,
  };

  const needActionPlants = dashboardData?.need_action || [];

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Welcome Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ 
                backgroundColor: 'var(--badge-bg)', 
                borderColor: 'var(--badge-border)', 
                color: 'var(--badge-text)' 
              }}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{getGreeting()}, Baginda</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Stasiun Kendali Kebun
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {loading ? 'Menghubungkan telemetri...' : `${plants.length} tanaman aktif dalam siklus perawatan`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/wizard"
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-zinc-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Tanam Baru"
            >
              <Plus className="w-5 h-5 stroke-[2.8]" />
            </Link>
          </div>
        </div>

        {/* 1. 🌤️ WIDGET TELEMETRI CUACA REAL-TIME & ALERT */}
        <div 
          className="rounded-3xl border p-5 space-y-3.5 shadow-sm backdrop-blur-md transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-card)' 
          }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                  Telemetri Cuaca • {weather.location}
                </span>
                <span className="text-xs font-black" style={{ color: 'var(--text-main)' }}>{weather.condition}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-black font-mono" style={{ color: 'var(--text-main)' }}>{weather.temp_c}°C</span>
            </div>
          </div>

          {/* Grid Sensor Mikro */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div 
              className="p-2.5 rounded-2xl border"
              style={{ 
                backgroundColor: 'var(--bg-card-subtle)', 
                borderColor: 'var(--border-card-subtle)' 
              }}
            >
              <span className="text-[9px] font-semibold flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Thermometer className="w-3 h-3 text-amber-500" /> Suhu
              </span>
              <strong className="font-mono block text-sm mt-0.5" style={{ color: 'var(--text-main)' }}>{weather.temp_c}°C</strong>
            </div>

            <div 
              className="p-2.5 rounded-2xl border"
              style={{ 
                backgroundColor: 'var(--bg-card-subtle)', 
                borderColor: 'var(--border-card-subtle)' 
              }}
            >
              <span className="text-[9px] font-semibold flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Droplets className="w-3 h-3 text-cyan-500" /> Kelembaban
              </span>
              <strong className="font-mono block text-sm mt-0.5" style={{ color: 'var(--text-main)' }}>{weather.humidity_pct}%</strong>
            </div>

            <div 
              className="p-2.5 rounded-2xl border"
              style={{ 
                backgroundColor: 'var(--bg-card-subtle)', 
                borderColor: 'var(--border-card-subtle)' 
              }}
            >
              <span className="text-[9px] font-semibold flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Wind className="w-3 h-3 text-emerald-500" /> Angin
              </span>
              <strong className="font-mono block text-sm mt-0.5" style={{ color: 'var(--text-main)' }}>{weather.wind_kmh} km/h</strong>
            </div>
          </div>

          {/* Indeks Peringatan Penyiraman */}
          <div 
            className="p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5"
            style={{ 
              backgroundColor: 'var(--badge-bg)', 
              borderColor: 'var(--badge-border)', 
              color: 'var(--badge-text)' 
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Rekomendasi Aksi Cuaca AI:</strong>
              <p className="opacity-90 leading-normal">{weather.alert}</p>
            </div>
          </div>
        </div>

        {/* 2. 📊 GARDEN ANALYTICS & HEALTH INDEX */}
        <div className="grid grid-cols-2 gap-2.5">
          <div 
            className="p-4 rounded-3xl border space-y-2 backdrop-blur-md shadow-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-card)' 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--accent-primary)' }}>Indeks Kesehatan AI</span>
              <Activity className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <p className="text-2xl font-black font-mono" style={{ color: 'var(--text-main)' }}>
              {plants.length === 0 ? '0%' : `${stats.health_index}%`}
            </p>
            <span className="text-[10px] block" style={{ color: 'var(--text-dim)' }}>
              {plants.length === 0 ? 'Belum Ada Tanaman' : stats.health_index >= 90 ? 'Kebun Sangat Prima' : 'Perlu Pemantauan'}
            </span>
          </div>

          <div 
            className="p-4 rounded-3xl border space-y-2 backdrop-blur-md shadow-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-card)' 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--accent-primary)' }}>Kedisiplinan Rawat</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black font-mono" style={{ color: 'var(--text-main)' }}>{progressPercent}%</p>
            <span className="text-[10px] block" style={{ color: 'var(--text-dim)' }}>
              {plants.length === 0 ? '0 Tugas Aktif' : `${doneTasks}/${totalTasks} Tugas Selesai`}
            </span>
          </div>
        </div>

        {/* 3. 🚨 SPOTLIGHT / TANAMAN BUTUH PERHATIAN (Photo Upload Due) */}
        {needActionPlants.length > 0 && (
          <div 
            className="p-4 rounded-3xl border space-y-3 shadow-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: '#f59e0b' 
            }}
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Waktunya Upload Foto Mingguan!</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Tanaman berikut telah memasuki pekan baru dan membutuhkan foto terbaru agar AI bisa memberikan rekomendasi tugas lanjutan.
            </p>
            <div className="space-y-2">
              {needActionPlants.slice(0, 2).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/plants/${p.id}`}
                  className="p-3 rounded-2xl border flex items-center justify-between transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-card-subtle)', 
                    borderColor: 'var(--border-card)' 
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold line-clamp-1" style={{ color: 'var(--text-main)' }}>{p.name}</p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Minggu Ke-{p.current_week}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <span>Audit Foto</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 4. 📅 KALENDER PEKAN INI (7-DAY STRIP) */}
        <div 
          className="p-4 rounded-3xl border space-y-3 backdrop-blur-md shadow-sm"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-card)' 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                Jadwal Rawat Sepekan
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
              {doneTasks}/{totalTasks} Selesai
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDates.map(item => {
              const isSelected = selectedDate === item.dayIndex;
              return (
                <button
                  key={item.dayIndex}
                  onClick={() => setSelectedDate(item.dayIndex)}
                  className="py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border"
                  style={{
                    backgroundColor: isSelected 
                      ? 'var(--accent-primary)' 
                      : item.isToday 
                        ? 'var(--badge-bg)' 
                        : 'var(--bg-card-subtle)',
                    borderColor: isSelected 
                      ? 'var(--accent-primary)' 
                      : item.isToday 
                        ? 'var(--badge-border)' 
                        : 'var(--border-card-subtle)',
                    color: isSelected 
                      ? '#ffffff' 
                      : item.isToday 
                        ? 'var(--accent-primary)' 
                        : 'var(--text-dim)',
                  }}
                >
                  <span className="text-[9px] font-bold uppercase">{item.dayName}</span>
                  <span className="text-xs font-black mt-0.5">{item.dateNum}</span>
                  {item.isToday && (
                    <span 
                      className="w-1 h-1 rounded-full mt-1" 
                      style={{ backgroundColor: isSelected ? '#ffffff' : 'var(--accent-primary)' }} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ✅ CHECKLIST TUGAS HARIAN KEBUN */}
        <div 
          className="rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-sm"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-card)' 
          }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-card-subtle)' }}>
            <div>
              <h2 className="text-sm font-black" style={{ color: 'var(--text-main)' }}>
                Tugas Perawatan Pekan Ini
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                Berdasarkan hasil analisis AI &amp; fase pertumbuhan
              </p>
            </div>
            <span 
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
              style={{ 
                backgroundColor: 'var(--badge-bg)', 
                borderColor: 'var(--badge-border)', 
                color: 'var(--badge-text)' 
              }}
            >
              {progressPercent}%
            </span>
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-2xl" style={{ backgroundColor: 'var(--bg-card-subtle)' }} />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <Sprout className="w-8 h-8 mx-auto" style={{ color: 'var(--accent-primary)' }} />
              <p className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                {plants.length === 0 ? 'Belum Ada Tanaman Didaftarkan' : 'Semua Tugas Beres!'}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                {plants.length === 0 
                  ? 'Mulai tanam bibit pertamamu melalui tombol Tanam Baru (+)' 
                  : 'Belum ada tugas perawatan tertunda untuk tanaman Anda saat ini.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.is_done)}
                  className="p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: task.is_done ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                    borderColor: 'var(--border-card-subtle)',
                    opacity: task.is_done ? 0.65 : 1
                  }}
                >
                  <button className="mt-0.5 shrink-0">
                    {task.is_done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                    )}
                  </button>
                  <div className="flex-1">
                    <p 
                      className={`text-xs font-semibold leading-snug ${task.is_done ? 'line-through' : ''}`}
                      style={{ color: task.is_done ? 'var(--text-dim)' : 'var(--text-main)' }}
                    >
                      {task.task}
                    </p>
                    <span className="text-[9px] font-mono block mt-1" style={{ color: 'var(--accent-primary)' }}>
                      Minggu Ke-{task.week_number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. 🚀 SHORTCUTS CEPAT */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/recipes"
            className="p-4 rounded-3xl border flex items-center gap-3 transition-all hover:scale-[1.02] shadow-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-card)' 
            }}
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: 'var(--text-main)' }}>Formulasi Pupuk</p>
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Resep Organik &amp; Dosis</span>
            </div>
          </Link>

          <Link
            href="/doctor"
            className="p-4 rounded-3xl border flex items-center gap-3 transition-all hover:scale-[1.02] shadow-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-card)' 
            }}
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: 'var(--text-main)' }}>Klinik Dokter AI</p>
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Diagnosa Foto Hama</span>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
