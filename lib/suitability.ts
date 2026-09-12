/**
 * Suitability Engine — Presisi Berbasis Historis 3 Tahun + Real-Time Telemetry
 * Menghitung skor kesesuaian varietas tanaman berdasarkan iklim multi-tahun & penempatan
 */

export type ClimateData = {
  avg_temp_c: number;          // Rata-rata suhu 3 tahun (°C)
  current_temp_c: number;      // Suhu real-time hari ini (°C)
  current_weather: string;     // Status cuaca hari ini
  avg_humidity_pct: number;    // Rata-rata kelembaban 3 tahun (%)
  annual_rainfall_mm: number;  // Rata-rata curah hujan tahunan (mm/tahun)
  dry_months_count: number;    // Rata-rata bulan kering (<60mm/bln) per tahun
  sunshine_hours_day: number;  // Rata-rata sinar matahari harian (jam/hari)
  avg_wind_speed_kmh: number;  // Rata-rata kecepatan angin (km/jam)
  elevation_m: number;         // Ketinggian lokasi di atas permukaan laut (mdpl)
  climate_zone?: string;       // Zona agroklimat (misal: Tropis Basah Dataran Rendah)
  historical_years?: string;   // Periode arsip data (cth: "2023 - 2025")
};

export type VarietyMeta = {
  name: string;
  description: string;
  category: string;
  optimal_temp_c?: number;
  min_elevation_m?: number;
  max_elevation_m?: number;
  sunlight_hours?: number;
  fungus_resistance?: 'Low' | 'Medium' | 'High';
};

export type SuitabilityResult = {
  name: string;
  score: number;
  level: string;
  badge: 'emerald' | 'amber' | 'rose';
  advantages: string[];
  challenges: string[];
  media: string;
  description: string;
};

const PLACEMENT_LABELS: Record<string, string> = {
  rooftop: 'Rooftop / Dak Atas',
  terrace: 'Halaman / Teras',
  yard: 'Pekarangan Tanah',
  field: 'Kebun / Lahan Terbuka',
  wetland: 'Sawah / Lahan Basah',
};

export function getMediaRecommendation(placement: string): string {
  switch (placement) {
    case 'rooftop':
      return 'Media Pot Ringan: 40% Sekam Bakar + 30% Cocopeat + 30% Kompos Matang (beban ringan untuk dak).';
    case 'terrace':
      return 'Pot Teras/Balkon: 50% Tanah Subur + 30% Kompos + 20% Sekam Lapuk dengan drainase lancar.';
    case 'wetland':
      return 'Lahan Basah/Genangan: Tanah liat berhumus + kompos jerami, genangan air terkontrol.';
    default:
      return 'Tanah Pekarangan/Kebun: Tanah Asli + Kompos 3-5 kg per lubang tanam + Taburan Kapur Dolomit.';
  }
}

export function evaluateSuitability(
  variety: VarietyMeta,
  climate: ClimateData,
  placement: string
): SuitabilityResult {
  let score = 100;
  const advantages: string[] = [];
  const challenges: string[] = [];

  const {
    avg_temp_c,
    elevation_m,
    avg_humidity_pct,
    annual_rainfall_mm,
    dry_months_count = 3,
    sunshine_hours_day = 6.5
  } = climate;

  const placementLabel = PLACEMENT_LABELS[placement] ?? 'Area Kebun';

  // 1. Evaluasi Elevasi Ketinggian (Sangat Krusial)
  if (variety.min_elevation_m != null && variety.max_elevation_m != null) {
    if (elevation_m < variety.min_elevation_m) {
      const diff = variety.min_elevation_m - elevation_m;
      score -= Math.min(35, Math.round((diff / 100) * 10));
      challenges.push(`Elevasi lokasi (${elevation_m} mdpl) terlalu rendah untuk varietas ini (ideal min ${variety.min_elevation_m} mdpl).`);
    } else if (elevation_m > variety.max_elevation_m) {
      const diff = elevation_m - variety.max_elevation_m;
      score -= Math.min(35, Math.round((diff / 100) * 10));
      challenges.push(`Elevasi lokasi (${elevation_m} mdpl) terlalu dingin/tinggi (ideal max ${variety.max_elevation_m} mdpl).`);
    } else {
      advantages.push(`Ketinggian wilayah (${elevation_m} mdpl) sangat tepat untuk habitat varietas ini.`);
    }
  }

  // 2. Evaluasi Suhu Rata-rata 3 Tahun
  if (variety.optimal_temp_c) {
    const tempDiff = Math.abs(avg_temp_c - variety.optimal_temp_c);
    if (tempDiff > 5) {
      score -= 25;
      challenges.push(`Suhu historis (${avg_temp_c}°C) cukup jauh dari suhu optimal tanaman (${variety.optimal_temp_c}°C).`);
    } else if (tempDiff > 2.5) {
      score -= 10;
      challenges.push(`Suhu rata-rata (${avg_temp_c}°C) sedikit di luar titik optimal (${variety.optimal_temp_c}°C).`);
    } else {
      advantages.push(`Suhu tahunan stabil (${avg_temp_c}°C) sangat ideal untuk metabolisme dan pembuahan.`);
    }
  }

  // 3. Evaluasi Intensitas Jam Matahari vs Kebutuhan Tanaman
  const reqSun = variety.sunlight_hours ?? 6;
  if (sunshine_hours_day >= reqSun) {
    advantages.push(`Paparan sinar surya (${sunshine_hours_day} jam/hari) mencukupi kebutuhan fotosintesis tanaman.`);
  } else if (sunshine_hours_day < reqSun - 1.5) {
    score -= 15;
    challenges.push(`Wilayah ini rata-rata mendapat sinar matahari ${sunshine_hours_day} jam/hari (kurang dari syarat ${reqSun} jam/hari).`);
  }

  // 4. Evaluasi Curah Hujan & Bulan Kering vs Ketahanan Jamur
  if (variety.fungus_resistance === 'Low') {
    if (avg_humidity_pct > 80 || annual_rainfall_mm > 2400) {
      score -= 20;
      challenges.push(`Kelembaban tinggi (${avg_humidity_pct}%) & curah hujan (${annual_rainfall_mm}mm) berisiko jamur pada daun.`);
    }
  } else if (variety.fungus_resistance === 'High') {
    advantages.push(`Varietas ini sangat tangguh menghadapi kelembaban lokal (${avg_humidity_pct}%).`);
  }

  // Khusus tanaman buah tertentu yang butuh masa kering untuk induksi bunga (cth: Mangga, Kelengkeng)
  if (['Mangga', 'Kelengkeng', 'Jeruk'].includes(variety.category) || variety.description.toLowerCase().includes('bunga')) {
    if (dry_months_count >= 2) {
      advantages.push(`Adanya musim kering (${dry_months_count} bulan/thn) sangat menguntungkan untuk memicu pembungaan serempak.`);
    }
  }

  // 5. Dampak Area Penempatan
  if (placement === 'rooftop') {
    if (variety.category === 'Sayuran Daun') {
      score -= 12;
      challenges.push('Sayuran daun rentan layu di atap panas. Wajib pasang jaring paranet 50% dan penyiraman rutin.');
    } else {
      advantages.push('Penempatan rooftop memberikan intensitas sinar penuh tanpa halangan gedung/pohon.');
    }
  } else if (placement === 'terrace') {
    if (reqSun > 6) {
      score -= 10;
      challenges.push('Teras ternaungi berpotensi mengurangi pembuahan pada varietas yang butuh sinar penuh.');
    }
  } else if (placement === 'wetland') {
    if (!['Sayuran Daun'].includes(variety.category)) {
      score -= 20;
      challenges.push('Lahan basah berisiko membusukkan perakaran tanaman buah.');
    }
  } else {
    advantages.push(`Area ${placementLabel} memberikan ruang ekspansi akar yang leluasa.`);
  }

  // Clamp Skor Akhir (35 - 99%)
  score = Math.max(35, Math.min(99, score));

  let level = 'Sangat Direkomendasikan';
  let badge: 'emerald' | 'amber' | 'rose' = 'emerald';

  if (score < 70) {
    level = 'Perlu Perlakuan Khusus';
    badge = 'rose';
  } else if (score < 85) {
    level = 'Cukup Cocok (Adaptif)';
    badge = 'amber';
  }

  return {
    name: variety.name,
    score,
    level,
    badge,
    advantages,
    challenges,
    media: getMediaRecommendation(placement),
    description: variety.description,
  };
}
