export function getInitialTasks(category: string, _locationType: string): string[] {
  const base = [
    'Foto tanaman untuk dokumentasi awal minggu pertama',
    'Siram tanaman setiap pagi — cukup sampai tanah lembab, jangan sampai becek',
    'Pastikan lokasi mendapat sinar matahari yang cukup',
    'Amati daun dan batang — catat jika ada perubahan warna atau bentuk',
    'Cek kondisi media tanam — longgarkan jika terlalu padat',
  ];

  const byCategory: Record<string, string[]> = {
    'Buah-buahan': [
      'Foto tanaman untuk dokumentasi awal minggu pertama',
      'Siram setiap pagi — tanah harus lembab tapi tidak becek',
      'Pastikan lokasi mendapat sinar matahari minimal 6 jam sehari',
      'Amati daun — catat jika ada bercak atau perubahan warna',
      'Cek akar tidak keluar dari lubang drainase pot secara berlebihan',
    ],
    'Sayuran Daun': [
      'Foto tanaman untuk dokumentasi awal',
      'Siram 2x sehari pagi dan sore — sayuran daun butuh air lebih banyak',
      'Pastikan tidak ada genangan air di pot atau bedengan',
      'Cek apakah ada hama kecil di bawah daun',
      'Beri pupuk organik cair tipis-tipis jika ada',
    ],
    'Sayuran Buah': [
      'Foto tanaman untuk dokumentasi awal',
      'Siram setiap pagi — jaga kelembaban tanah konsisten',
      'Pasang ajir/tiang penyangga sejak awal agar batang tidak roboh',
      'Pastikan sinar matahari penuh minimal 6-8 jam',
      'Amati titik tumbuh pucuk — harus tampak segar dan hijau',
    ],
    'Rempah & Herbal': [
      'Foto tanaman untuk dokumentasi awal',
      'Siram secukupnya — rempah tidak suka tanah terlalu basah',
      'Pastikan drainase pot bagus, air tidak menggenang',
      'Cek apakah daun tampak layu — tanda kurang atau kelebihan air',
      'Letakkan di tempat yang mendapat sinar matahari pagi',
    ],
    'Umbi-umbian': [
      'Foto tanaman untuk dokumentasi awal',
      'Siram setiap 2 hari sekali — umbi tidak suka terlalu basah',
      'Pastikan media tanam gembur dan tidak padat',
      'Tandai tanggal tanam agar tahu kapan bisa panen',
      'Amati tunas yang muncul dari permukaan tanah',
    ],
    'Kacang-kacangan': [
      'Foto tanaman untuk dokumentasi awal',
      'Siram setiap pagi — tanah harus lembab merata',
      'Pasang ajir atau rambatan agar tanaman merambat dengan baik',
      'Pastikan lokasi mendapat sinar matahari penuh',
      'Amati bintil akar jika sempat — tanda bakteri baik sudah aktif',
    ],
  };

  return byCategory[category] ?? base;
}

export const CATEGORIES = [
  { label: 'Buah-buahan', emoji: '🍎' },
  { label: 'Sayuran Daun', emoji: '🥬' },
  { label: 'Sayuran Buah', emoji: '🍅' },
  { label: 'Rempah & Herbal', emoji: '🌿' },
  { label: 'Umbi-umbian', emoji: '🥔' },
  { label: 'Kacang-kacangan', emoji: '🫘' },
];

// Komoditas per kategori (level tengah: kategori → komoditas → varietas)
export const COMMODITIES: Record<string, { name: string; emoji: string; description: string }[]> = {
  'Buah-buahan': [
    { name: 'Mangga',      emoji: '🥭', description: 'Raja buah tropis. Banyak varietas genjah cocok tabulampot.' },
    { name: 'Alpukat',     emoji: '🥑', description: 'Buah kaya lemak sehat. Cocok dataran rendah & menengah.' },
    { name: 'Stroberi',    emoji: '🍓', description: 'Cocok dataran tinggi & rooftop. Butuh suhu sejuk.' },
    { name: 'Kelengkeng',  emoji: '🍈', description: 'Manis, genjah, cocok iklim tropis panas.' },
    { name: 'Jambu',       emoji: '🍐', description: 'Jambu kristal & jambu air, mudah ditanam di pot.' },
    { name: 'Pepaya',      emoji: '🍈', description: 'Cepat berbuah, produktif, sangat cocok pemula.' },
    { name: 'Pisang',      emoji: '🍌', description: 'Tumbuh cepat, tidak butuh banyak perawatan.' },
    { name: 'Jeruk',       emoji: '🍊', description: 'Jeruk nipis, lemon, jeruk manis. Cocok pot & pekarangan.' },
    { name: 'Anggur',      emoji: '🍇', description: 'Butuh rambatan, cocok iklim kering-lembab bergantian.' },
    { name: 'Semangka',    emoji: '🍉', description: 'Cocok lahan terbuka & iklim panas. Panen 60-70 hari.' },
    { name: 'Nanas',       emoji: '🍍', description: 'Sangat tahan panas, cocok pekarangan & lahan terbuka.' },
    { name: 'Sirsak',      emoji: '🍏', description: 'Tumbuh subur di dataran rendah tropis.' },
    { name: 'Rambutan',    emoji: '🍒', description: 'Cocok dataran rendah lembab, butuh lahan cukup.' },
    { name: 'Durian',      emoji: '🟡', description: 'Raja buah. Butuh lahan luas & perawatan intensif.' },
    { name: 'Belimbing',   emoji: '⭐', description: 'Produktif, cocok pot besar & pekarangan.' },
  ],
  'Sayuran Daun': [
    { name: 'Kangkung',       emoji: '🌿', description: 'Paling mudah, panen 21-30 hari.' },
    { name: 'Bayam',          emoji: '🥬', description: 'Kaya nutrisi, panen 25-30 hari.' },
    { name: 'Pakcoy',         emoji: '🥬', description: 'Populer, tumbuh cepat, cocok pot kecil.' },
    { name: 'Selada',         emoji: '🥗', description: 'Cocok pot dangkal, bisa indoor.' },
    { name: 'Sawi',           emoji: '🥬', description: 'Toleran panas, panen 35-40 hari.' },
    { name: 'Kemangi',        emoji: '🌱', description: 'Harum, bisa dipanen berkali-kali.' },
    { name: 'Kelor',          emoji: '🌿', description: 'Superfood, sangat mudah tumbuh di tropis.' },
    { name: 'Daun Bawang',    emoji: '🧅', description: 'Cepat panen, bisa tumbuh dari sisa dapur.' },
  ],
  'Sayuran Buah': [
    { name: 'Cabai',    emoji: '🌶️', description: 'Produktif, butuh sinar penuh. Banyak varietas.' },
    { name: 'Tomat',    emoji: '🍅', description: 'Genjah, sangat cocok pot. Banyak varietas.' },
    { name: 'Terong',   emoji: '🍆', description: 'Mudah tumbuh, produktif, cocok tropis.' },
    { name: 'Timun',    emoji: '🥒', description: 'Merambat, butuh ajir, produktif dan cepat.' },
    { name: 'Pare',     emoji: '🥬', description: 'Tahan panas, butuh sinar penuh.' },
    { name: 'Labu',     emoji: '🎃', description: 'Merambat luas, cocok lahan terbuka.' },
    { name: 'Oyong',    emoji: '🥒', description: 'Merambat, tahan panas, produktif.' },
  ],
  'Rempah & Herbal': [
    { name: 'Jahe',       emoji: '🫚', description: 'Mudah di pot besar, panen 8-10 bulan.' },
    { name: 'Kunyit',     emoji: '🟡', description: 'Sangat mudah, tumbuh di pot, panen 9-12 bulan.' },
    { name: 'Serai',      emoji: '🌾', description: 'Tumbuh rumpun, bisa dipanen berkali-kali.' },
    { name: 'Kencur',     emoji: '🫚', description: 'Cocok pot dangkal, tumbuh di tempat teduh.' },
    { name: 'Temulawak',  emoji: '🟠', description: 'Tahan kondisi ekstrem, sangat mudah pemula.' },
    { name: 'Lengkuas',   emoji: '🫚', description: 'Tumbuh rumpun, cocok pot besar atau tanah.' },
    { name: 'Daun Mint',  emoji: '🌿', description: 'Cocok pot kecil, bisa indoor, tumbuh cepat.' },
  ],
  'Umbi-umbian': [
    { name: 'Singkong',     emoji: '🪵', description: 'Paling mudah, ditancap langsung tumbuh.' },
    { name: 'Ubi Jalar',    emoji: '🍠', description: 'Merambat, cantik, panen 3-4 bulan.' },
    { name: 'Kentang',      emoji: '🥔', description: 'Cocok dataran menengah, panen 90-100 hari.' },
    { name: 'Talas',        emoji: '🫚', description: 'Tahan teduh, cocok pot besar.' },
    { name: 'Bawang Merah', emoji: '🧅', description: 'Panen cepat 60-70 hari, cocok pot dangkal.' },
    { name: 'Bawang Putih', emoji: '🧄', description: 'Butuh suhu sejuk, cocok dataran menengah.' },
  ],
  'Kacang-kacangan': [
    { name: 'Kacang Panjang', emoji: '🫘', description: 'Sangat mudah, cepat berbuah, butuh rambatan.' },
    { name: 'Edamame',        emoji: '🫘', description: 'Kacang kedelai Jepang, panen 65-75 hari.' },
    { name: 'Buncis',         emoji: '🫘', description: 'Tegak atau merambat, cocok pot, panen 50-60 hari.' },
    { name: 'Kacang Tanah',   emoji: '🥜', description: 'Tumbuh di tanah gembur, panen 90-100 hari.' },
  ],
};

// Varietas per komoditas (level terdalam)
// Setiap komoditas buah min 10 varietas: 8 cocok (emerald/amber) + 2 kurang cocok (rose) berdasarkan data klimatologi
export const VARIETIES: Record<string, { name: string; description: string; optimal_temp_c?: number; min_elevation_m?: number; max_elevation_m?: number; sunlight_hours?: number; fungus_resistance?: 'Low' | 'Medium' | 'High' }[]> = {
  // MANGGA — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Mangga': [
    { name: 'Chokanan', description: 'Genjah & manis, cocok tabulampot. Panen 3-4 bulan setelah pemangkasan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Harumanis', description: 'Aroma harum kuat, populer di Indonesia. Cocok dataran rendah panas.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Gedong Gincu', description: 'Warna merah cantik, rasa manis-asam segar. Cocok Jawa Barat.', optimal_temp_c: 26, min_elevation_m: 100, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Irwin', description: 'Merah gelap, daging tebal, cocok tabulampot rooftop.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Garifta Merah', description: 'Super genjah, bisa panen 2x setahun. Cocok pot kecil.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Lalijiwo', description: 'Manis legit khas Jawa, produktif di dataran rendah.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Agri Gardina', description: 'Varietas baru, sangat genjah, cocok lahan sempit.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Nam Doc Mai', description: 'Varietas Thailand, daging tebal tanpa serat, cocok pot & kebun.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Medium' },
    // Kurang direkomendasikan
    { name: 'Kweni', description: 'Aroma kuat khas, rasa unik. Butuh lahan luas & waktu panen lama (5-7 tahun).', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 300, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Pelipisan', description: 'Varietas langka Kalimantan, rasa asam-manis. Sulit adaptasi luar habitat aslinya.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 200, sunlight_hours: 8, fungus_resistance: 'Low' },
  ],
  // ALPUKAT — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Alpukat': [
    { name: 'Miki', description: 'Buah besar, daging tebal, cocok tabulampot. Relatif mudah.', optimal_temp_c: 24, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Kendil', description: 'Bentuk bulat seperti kendil, rasa gurih, cocok dataran menengah.', optimal_temp_c: 22, min_elevation_m: 300, max_elevation_m: 1200, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Aligator', description: 'Kulit tebal hijau, daging creamy, populer untuk ekspor.', optimal_temp_c: 23, min_elevation_m: 200, max_elevation_m: 900, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Hass', description: 'Kulit ungu-hitam saat matang, rasa premium. Butuh suhu sejuk.', optimal_temp_c: 20, min_elevation_m: 500, max_elevation_m: 1500, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Mega Murapi', description: 'Varietas lokal Sumbar, produktif di dataran menengah.', optimal_temp_c: 22, min_elevation_m: 300, max_elevation_m: 1100, sunlight_hours: 6, fungus_resistance: 'High' },
    { name: 'Mentega', description: 'Daging kuning keemasan, rasa gurih manis, cocok pekarangan.', optimal_temp_c: 24, min_elevation_m: 150, max_elevation_m: 900, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Wina', description: 'Genjah, bisa berbuah di pot besar, produktif sepanjang tahun.', optimal_temp_c: 23, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 6, fungus_resistance: 'High' },
    { name: 'Pluwang', description: 'Lokal Jawa Tengah, buah besar, adaptif dataran menengah-tinggi.', optimal_temp_c: 21, min_elevation_m: 400, max_elevation_m: 1300, sunlight_hours: 6, fungus_resistance: 'High' },
    // Kurang direkomendasikan
    { name: 'Bacon', description: 'Varietas impor California, kulit tipis mudah rusak. Butuh suhu sangat sejuk, sulit di dataran rendah.', optimal_temp_c: 18, min_elevation_m: 800, max_elevation_m: 2000, sunlight_hours: 6, fungus_resistance: 'Low' },
    { name: 'Fuerte', description: 'Varietas Meksiko-Guatemala, sangat sensitif kelembaban tinggi & jamur. Sulit adaptasi iklim tropis basah.', optimal_temp_c: 19, min_elevation_m: 700, max_elevation_m: 1800, sunlight_hours: 6, fungus_resistance: 'Low' },
  ],
  // STROBERI — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Stroberi': [
    { name: 'California', description: 'Paling populer, cocok pot dan rooftop dingin.', optimal_temp_c: 18, min_elevation_m: 700, max_elevation_m: 1500, sunlight_hours: 6, fungus_resistance: 'Low' },
    { name: 'Earlibrite', description: 'Buah besar, manis, tahan suhu agak lebih panas.', optimal_temp_c: 20, min_elevation_m: 500, max_elevation_m: 1400, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Sweet Charlie', description: 'Super manis, cocok pot kecil, genjah.', optimal_temp_c: 18, min_elevation_m: 600, max_elevation_m: 1500, sunlight_hours: 6, fungus_resistance: 'Low' },
    { name: 'Dorit', description: 'Varietas lokal, lebih toleran dataran rendah dibanding varietas lain.', optimal_temp_c: 22, min_elevation_m: 400, max_elevation_m: 1200, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Festival', description: 'Tahan penyakit, produksi tinggi, cocok pot dataran menengah.', optimal_temp_c: 20, min_elevation_m: 500, max_elevation_m: 1300, sunlight_hours: 6, fungus_resistance: 'High' },
    { name: 'Albion', description: 'Day-neutral, bisa berbuah sepanjang tahun, cocok pot dingin.', optimal_temp_c: 18, min_elevation_m: 700, max_elevation_m: 1600, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Camarosa', description: 'Buah besar merah cerah, keras, tahan distribusi.', optimal_temp_c: 19, min_elevation_m: 600, max_elevation_m: 1400, sunlight_hours: 6, fungus_resistance: 'Medium' },
    { name: 'Oso Grande', description: 'Ukuran sangat besar, rasa seimbang manis-asam, produktif.', optimal_temp_c: 19, min_elevation_m: 600, max_elevation_m: 1400, sunlight_hours: 6, fungus_resistance: 'Medium' },
    // Kurang direkomendasikan
    { name: 'Chandler', description: 'Varietas California klasik, sangat rentan jamur di iklim lembab tropis Indonesia.', optimal_temp_c: 16, min_elevation_m: 900, max_elevation_m: 1800, sunlight_hours: 6, fungus_resistance: 'Low' },
    { name: 'Seascape', description: 'Day-neutral premium, butuh suhu sangat dingin konsisten. Hampir tidak cocok di bawah 900 mdpl.', optimal_temp_c: 15, min_elevation_m: 1000, max_elevation_m: 2000, sunlight_hours: 6, fungus_resistance: 'Low' },
  ],
  // KELENGKENG — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Kelengkeng': [
    { name: 'New Kristal', description: 'Genjah & manis. Cocok dataran rendah, buah besar.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Pingpong', description: 'Buah sebesar bola pingpong, daging tebal, favorit pasar.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Itoh', description: 'Asal Thailand, sangat produktif, panen di luar musim.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Diamond River', description: 'Kulit tipis, daging tebal, rasa sangat manis.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Hawai', description: 'Buah besar lonjong, daging kenyal manis, genjah 2-3 tahun.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Merah', description: 'Kulit merah unik, rasa manis premium, nilai jual tinggi.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Batu Satu', description: 'Berbiji satu kecil, daging penuh, sangat manis.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Aroma Durian', description: 'Aroma unik mirip durian, populer pasar premium lokal.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    // Kurang direkomendasikan
    { name: 'Lengkeng Lokal Biasa', description: 'Varietas tua, pohon sangat besar, butuh lahan minimal 10x10m. Tidak cocok pot atau pekarangan sempit.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Kohala', description: 'Varietas Hawaii, butuh perbedaan suhu siang-malam ekstrem untuk berbunga. Jarang berhasil di dataran rendah tropis Indonesia.', optimal_temp_c: 22, min_elevation_m: 600, max_elevation_m: 1200, sunlight_hours: 8, fungus_resistance: 'Low' },
  ],
  // JAMBU — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Jambu': [
    { name: 'Kristal', description: 'Tanpa biji, renyah, sangat mudah ditanam di pot.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Air Merah Delima', description: 'Warna merah cantik, manis, cocok tabulampot.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Biji Nona', description: 'Jambu biji merah, kaya vitamin C, sangat mudah tumbuh.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 6, fungus_resistance: 'High' },
    { name: 'Bangkok', description: 'Jambu air besar, rasa segar, produktif sepanjang tahun.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Madu Deli', description: 'Jambu biji kuning, super manis, daging putih tebal.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Citra', description: 'Jambu air hijau putih, renyah, sangat produktif sepanjang tahun.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Bol Merah', description: 'Warna merah tua, rasa manis legit, cocok pekarangan luas.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Sukun', description: 'Jambu air tanpa biji, daging tebal, populer Jawa Timur.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    // Kurang direkomendasikan
    { name: 'Semarang', description: 'Varietas tua, buah kecil-sedang, rasa biasa. Kalah produktif dibanding varietas modern.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 7, fungus_resistance: 'Low' },
    { name: 'Lilin', description: 'Buah kecil, rasa kurang manis, nilai ekonomi rendah. Lebih cocok tanaman hias saja.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 6, fungus_resistance: 'Low' },
  ],
  // PEPAYA
  'Pepaya': [
    { name: 'California', description: 'Paling populer, berbuah rendah, sangat mudah pemula.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Bangkok', description: 'Buah besar, manis, cocok lahan terbuka.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Red Lady', description: 'Tipe hermafrodit, pasti berbuah, daging merah oranye.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'High' },
  ],
  // PISANG
  'Pisang': [
    { name: 'Cavendish', description: 'Paling populer dunia, produktif, cocok lahan luas.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 7, fungus_resistance: 'Low' },
    { name: 'Raja Bulu', description: 'Manis legit, cocok dikonsumsi langsung & olahan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Kepok', description: 'Cocok diolah, tahan penyakit, sangat produktif.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Barangan', description: 'Manis, ukuran sedang, cocok pekarangan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
  // JERUK — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Jeruk': [
    { name: 'Nipis', description: 'Sangat mudah, cocok pot, berbuah sepanjang tahun.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Lemon California', description: 'Populer, cocok pot besar & tabulampot.', optimal_temp_c: 24, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Siam Banjar', description: 'Manis segar, cocok dataran rendah-menengah.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Purut', description: 'Daun & kulit dipakai masak, sangat mudah tumbuh.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 6, fungus_resistance: 'High' },
    { name: 'Keprok Batu 55', description: 'Manis legit, kulit mudah dikupas, produktif dataran rendah-menengah.', optimal_temp_c: 25, min_elevation_m: 100, max_elevation_m: 900, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Pamelo Magetan', description: 'Jeruk besar/bali, rasa manis segar, cocok pekarangan luas.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Mandarin Pontianak', description: 'Aroma kuat, rasa manis, populer pasar lokal-ekspor.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'RGL (Rough Lemon)', description: 'Batang bawah kuat, tahan penyakit akar, cocok pot & pekarangan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    // Kurang direkomendasikan
    { name: 'Navel Orange', description: 'Jeruk impor California, butuh suhu dingin konsisten. Sangat sulit berbuah di dataran rendah tropis.', optimal_temp_c: 18, min_elevation_m: 700, max_elevation_m: 1500, sunlight_hours: 7, fungus_resistance: 'Low' },
    { name: 'Blood Orange', description: 'Jeruk darah premium Mediterania. Butuh fluktuasi suhu musim yang tidak ada di Indonesia tropis.', optimal_temp_c: 17, min_elevation_m: 800, max_elevation_m: 1800, sunlight_hours: 7, fungus_resistance: 'Low' },
  ],
  // ANGGUR — 10 varietas: 8 recommended + 2 kurang direkomendasikan
  'Anggur': [
    { name: 'Ninel', description: 'Anggur merah berbiji kecil, cocok iklim tropis lembab.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Jupiter Seedless', description: 'Tanpa biji, manis, tahan penyakit jamur.', optimal_temp_c: 25, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Prabu Bestari', description: 'Varietas lokal Indonesia, adaptif iklim tropis basah.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Muscat', description: 'Aroma harum khas, butuh manajemen air ketat.', optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 800, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Isabella', description: 'Anggur hitam manis, sangat tahan penyakit, cocok iklim tropis.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Red Globe', description: 'Buah besar merah, daging renyah, cocok pot & pergola.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Akademik', description: 'Asal Ukraina, adaptasi baik tropik, rasa manis-asam segar.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Transgura Biru', description: 'Tanpa biji, produksi tinggi, tahan cuaca ekstrem.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'High' },
    // Kurang direkomendasikan
    { name: 'Chardonnay', description: 'Varietas wine Perancis, sangat sensitif kelembaban & jamur. Hampir tidak bisa berbuah berkualitas di iklim tropis lembab.', optimal_temp_c: 20, min_elevation_m: 400, max_elevation_m: 1200, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Cabernet Sauvignon', description: 'Varietas wine premium, butuh musim kering panjang. Tidak cocok daerah curah hujan tinggi di Indonesia.', optimal_temp_c: 21, min_elevation_m: 300, max_elevation_m: 1000, sunlight_hours: 8, fungus_resistance: 'Low' },
  ],
  // SEMANGKA
  'Semangka': [
    { name: 'New Dragon', description: 'Kulit bergaris, daging merah, panen 65 hari.', optimal_temp_c: 29, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Quality F1', description: 'Daging merah gelap, rasa sangat manis, produktif.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Inul', description: 'Tanpa biji, daging renyah, populer petani.', optimal_temp_c: 29, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 8, fungus_resistance: 'Medium' },
  ],
  // NANAS
  'Nanas': [
    { name: 'Smooth Cayenne', description: 'Buah besar, daging kuning, cocok ekspor.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Queen', description: 'Buah kecil-sedang, manis, cocok konsumsi segar.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Madu', description: 'Super manis, populer di Subang & Pemalang.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'High' },
  ],
  // SIRSAK
  'Sirsak': [
    { name: 'Ratu', description: 'Buah besar, daging tebal, manis-asam, sangat produktif.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Jumbo', description: 'Ukuran sangat besar, cocok lahan terbuka.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
  // RAMBUTAN
  'Rambutan': [
    { name: 'Binjai', description: 'Manis, biji kecil, populer di Sumatra.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Rapiah', description: 'Daging tebal, kering, premium. Cocok dataran rendah lembab.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Antalagi', description: 'Varietas Kalimantan, sangat manis, daging kenyal.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 400, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  // DURIAN
  'Durian': [
    { name: 'Monthong', description: 'Daging tebal, biji kecil, populer ekspor. Butuh lahan luas.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Musang King', description: 'Premium Malaysia, daging creamy pahit-manis.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'Low' },
    { name: 'Bawor', description: 'Varietas lokal Banyumas, genjah, cocok dataran rendah.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 8, fungus_resistance: 'Medium' },
  ],
  // BELIMBING
  'Belimbing': [
    { name: 'Demak', description: 'Manis, ukuran besar, cocok tabulampot.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Filipina', description: 'Super manis, produktif, sangat cocok pekarangan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  // CABAI
  'Cabai': [
    { name: 'Merah Besar', description: 'Produktif, tahan lama. Butuh sinar matahari penuh.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Rawit Putih', description: 'Super pedas, sangat produktif, tahan kering.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 8, fungus_resistance: 'High' },
    { name: 'Keriting', description: 'Populer pasar, panen mulai 75-80 hari.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 8, fungus_resistance: 'Medium' },
    { name: 'Paprika Merah', description: 'Tidak pedas, manis, cocok pot & greenhouse.', optimal_temp_c: 24, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 7, fungus_resistance: 'Low' },
  ],
  // TOMAT
  'Tomat': [
    { name: 'Cherry', description: 'Ukuran kecil, genjah, sangat cocok untuk pot.', optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 900, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Beef', description: 'Buah besar, daging tebal, cocok masak & jus.', optimal_temp_c: 23, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Permata', description: 'Varietas lokal, tahan panas, cocok dataran rendah.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  // TERONG
  'Terong': [
    { name: 'Ungu Panjang', description: 'Paling umum, mudah tumbuh, produktif iklim tropis.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Hijau', description: 'Rasa lebih pahit, cocok masak, sangat tahan panas.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Jepang', description: 'Ukuran kecil ramping, kulit tipis, rasa manis.', optimal_temp_c: 25, min_elevation_m: 100, max_elevation_m: 800, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
  // TIMUN
  'Timun': [
    { name: 'Jepang', description: 'Panjang, renyah, sangat produktif dengan ajir.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Venus', description: 'Ukuran sedang, tahan penyakit, cocok lahan terbuka.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  // KANGKUNG
  'Kangkung': [
    { name: 'Darat', description: 'Cocok pot & tanah biasa, panen 21-25 hari.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Air', description: 'Ditanam di air/lahan basah, sangat produktif.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 500, sunlight_hours: 5, fungus_resistance: 'High' },
  ],
  // BAYAM
  'Bayam': [
    { name: 'Merah', description: 'Kaya antioksidan, panen 25-30 hari.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Hijau', description: 'Paling umum, cepat panen, cocok semua media.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
  ],
  // SELADA
  'Selada': [
    { name: 'Keriting Hijau', description: 'Cocok pot dangkal & indoor, renyah.', optimal_temp_c: 22, min_elevation_m: 200, max_elevation_m: 1200, sunlight_hours: 5, fungus_resistance: 'Medium' },
    { name: 'Romaine', description: 'Tegak, cocok pot, rasa lebih pahit segar.', optimal_temp_c: 21, min_elevation_m: 300, max_elevation_m: 1300, sunlight_hours: 5, fungus_resistance: 'Medium' },
    { name: 'Butterhead', description: 'Daun lembut, rasa mild, cocok hidroponik.', optimal_temp_c: 20, min_elevation_m: 400, max_elevation_m: 1500, sunlight_hours: 5, fungus_resistance: 'Low' },
  ],
  // JAHE
  'Jahe': [
    { name: 'Emprit', description: 'Ukuran kecil, aroma kuat, cocok pot besar.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Gajah', description: 'Umbi besar, produktif, cocok lahan terbuka.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Merah', description: 'Khasiat tinggi, rasa pedas kuat, cocok pot.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'Medium' },
  ],
  // Fallback untuk komoditas lain yang belum punya varietas spesifik
  'Pakcoy': [
    { name: 'Hijau', description: 'Populer, tumbuh cepat, panen 25-30 hari.', optimal_temp_c: 25, min_elevation_m: 0, max_elevation_m: 1000, sunlight_hours: 5, fungus_resistance: 'Medium' },
    { name: 'Putih', description: 'Batang putih renyah, rasa lebih manis.', optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 1000, sunlight_hours: 5, fungus_resistance: 'Medium' },
  ],
  'Sawi': [
    { name: 'Hijau', description: 'Toleran panas, panen 35-40 hari.', optimal_temp_c: 26, min_elevation_m: 0, max_elevation_m: 900, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Putih', description: 'Lebih renyah, cocok tumis & acar.', optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 1000, sunlight_hours: 5, fungus_resistance: 'Medium' },
  ],
  'Kemangi': [
    { name: 'Lokal', description: 'Harum khas, bisa dipanen berkali-kali, cocok pot kecil.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 6, fungus_resistance: 'High' },
  ],
  'Kunyit': [
    { name: 'Kuning', description: 'Paling umum, panen 9-12 bulan, sangat mudah.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
    { name: 'Putih', description: 'Lebih langka, khasiat tinggi, cocok pot besar.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 5, fungus_resistance: 'High' },
  ],
  'Serai': [
    { name: 'Wangi', description: 'Tumbuh rumpun, bisa dipanen berkali-kali, sangat mudah.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 6, fungus_resistance: 'High' },
  ],
  'Singkong': [
    { name: 'Karet', description: 'Produksi tinggi, cocok lahan terbuka.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Gajah', description: 'Umbi sangat besar, cocok konsumsi langsung.', optimal_temp_c: 28, min_elevation_m: 0, max_elevation_m: 600, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  'Ubi Jalar': [
    { name: 'Ungu', description: 'Kaya antosianin, merambat cantik, panen 3-4 bulan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Cilembu', description: 'Manis legit saat dipanggang, populer Jawa Barat.', optimal_temp_c: 26, min_elevation_m: 200, max_elevation_m: 900, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
  'Kacang Panjang': [
    { name: 'Hijau', description: 'Sangat mudah, cepat berbuah, butuh rambatan.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
    { name: 'Merah', description: 'Warna unik, rasa sama, cocok pot.', optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 700, sunlight_hours: 7, fungus_resistance: 'High' },
  ],
  'Edamame': [
    { name: 'Ryokkoh', description: 'Varietas Jepang, biji besar, panen 65-70 hari.', optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 900, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
  'Buncis': [
    { name: 'Tegak', description: 'Tidak butuh rambatan, cocok pot, panen 50-60 hari.', optimal_temp_c: 24, min_elevation_m: 200, max_elevation_m: 1200, sunlight_hours: 7, fungus_resistance: 'Medium' },
    { name: 'Merambat', description: 'Produktif, butuh ajir, cocok lahan terbuka.', optimal_temp_c: 23, min_elevation_m: 300, max_elevation_m: 1300, sunlight_hours: 7, fungus_resistance: 'Medium' },
  ],
};

export const LOCATION_TYPES = [
  { value: 'pot', label: 'Pot / Polybag', emoji: '🪴', desc: 'Ditanam dalam pot atau kantong plastik' },
  { value: 'ground', label: 'Tanah Langsung', emoji: '🌍', desc: 'Ditanam langsung di tanah pekarangan' },
  { value: 'rooftop', label: 'Rooftop / Atap', emoji: '☀️', desc: 'Di atas atap atau teras lantai atas' },
  { value: 'indoor', label: 'Indoor / Dalam Rumah', emoji: '🏠', desc: 'Di dalam ruangan dengan cahaya terbatas' },
];
