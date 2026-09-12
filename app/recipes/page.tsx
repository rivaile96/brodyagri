'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  FlaskConical,
  BookOpen,
  Calculator,
  Droplets,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Shovel,
  Recycle,
  Layers,
  Sprout,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Info,
  Apple,
  Trash2,
  Clock,
  Beaker,
  Search,
  Zap,
  Scissors,
  Bug,
  HelpCircle,
  Wine,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 1. DAFTAR RACIKAN MEDIA TANAM RUMAHAN
const MEDIA_RECIPES = [
  {
    id: 'tabulampot-buah',
    title: 'Media Tabulampot Buah (Mangga, Jeruk, Jambu, Kelengkeng)',
    target: 'Pot Besar 45-60cm / Drum',
    difficulty: 'Mudah Diperoleh',
    ratio: '2 Bagian Tanah Subur : 1 Bagian Kompos Matang : 1 Bagian Sekam Bakar : 1/2 Bagian Cocopeat',
    characteristics: 'Poros namun mengikat hara, tidak becek, bobot stabil menahan angin.',
    why: 'Pohon buah butuh aerasi akar yang longgar agar akar tunggang tidak busuk, namun tetap butuh bahan organik tinggi untuk cadangan nutrisi saat pembungaan.',
    steps: [
      'Gunakan pecahan genteng atau arang kayu di dasar pot setinggi 3-5 cm untuk lubang drainase lancar.',
      'Campur tanah hitam, kompos lapuk, sekam bakar, dan cocopeat sampai merata.',
      'Taburkan 2 sendok makan Kapur Dolomit untuk menetralkan pH tanah (ideal pH 6.0 - 6.8).',
      'Diamkan media yang sudah dicampur di dalam pot selama 3-5 hari sebelum bibit ditanam.'
    ]
  },
  {
    id: 'anggur-super-poros',
    title: 'Media Super Poros Khusus Anggur Tropis (Anti Busuk Akar)',
    target: 'Pot 40-50cm / Planter Bag',
    difficulty: 'Sedang',
    ratio: '2 Bagian Sekam Bakar : 1 Bagian Sekam Lapuk : 1 Bagian Tanah Hitam : 1/2 Bagian Pasir Malang',
    characteristics: 'Sangat cepat mengalirkan air (porositas tinggi), tidak menggenang sedikitpun.',
    why: 'Akar anggur sangat rentan terhadap jamur akar jika tanah terlalu becek. Pasir Malang dan sekam bakar memberikan sirkulasi oksigen 100% aman untuk akar anggur.',
    steps: [
      'Pastikan planter bag memiliki lubang drainase samping yang banyak.',
      'Aduk rata sekam bakar, sekam mentah lapuk, tanah humus, dan pasir malang butiran sedang.',
      'Kucurkan larutan Fungsida nabati (air seduhan kunyit/bawang) sebelum bibit anggur ditanam.'
    ]
  },
  {
    id: 'rooftop-lightweight',
    title: 'Media Ultra-Ringan Khusus Rooftop & Balkon',
    target: 'Dak Atas / Gantungan / Pot Ringan',
    difficulty: 'Sangat Mudah',
    ratio: '40% Sekam Bakar : 30% Cocopeat Halus : 30% Kompos/Vermikompos',
    characteristics: 'Super ringan (beban dak aman), menyerap air tinggi, sirkulasi oksigen maksimal.',
    why: 'Rooftop memiliki beban struktur terbatas dan suhu panas menyengat. Cocopeat menjaga kelembaban agar pot tidak cepat kering terpanggang terik matahari.',
    steps: [
      'Cuci atau rendam cocopeat terlebih dahulu dengan air bersih untuk menghilangkan zat tanin alami yang pekat.',
      'Campurkan cocopeat dengan sekam bakar dan kompos matang hingga gembur.',
      'Lapisi bagian atas permukaan pot dengan mulsa sekam mentah/sabut kelapa untuk meredam penguapan air di siang hari.'
    ]
  },
  {
    id: 'sayuran-daun-cepat',
    title: 'Media Gembur Sayuran Daun & Herbal (Pakcoy, Selada, Bayam, Cabai)',
    target: 'Polybag 25-35cm / Tray Semai',
    difficulty: 'Sangat Mudah',
    ratio: '1 Bagian Tanah Halus : 1 Bagian Kompos Organik : 1 Bagian Sekam Lapuk/Arang Sekam',
    characteristics: 'Gembur, kaya unsur Nitrogen alami, akar halus mudah menembus media.',
    why: 'Sayuran berumur pendek (30-60 hari) membutuhkan media yang sangat empuk dan tidak padat agar perakaran serabut berkembang secepat mungkin.',
    steps: [
      'Ayak tanah agar gumpalan batu atau plastik terpisah.',
      'Campurkan kompos dan arang sekam hingga teksturnya terasa remah saat digenggam tangan.',
      'Siram media dengan air cucian beras 2 hari sebelum semaian dipindah tanam.'
    ]
  }
];

// 2. DAFTAR PEMBUATAN PUPUK & ZPT DARI SAMPAH RUMAHAN
const ORGANIC_WASTE_FERTILIZERS = [
  {
    id: 'zpt-bawang-merah',
    title: 'ZPT Alami Bawang Merah (Pemicu Rooting / Akar Bibit)',
    wasteSource: 'Sisa Bawang Merah & Kulit Bawang Dapur',
    category: 'ZPT Alami (Auksin & Vitamin B1)',
    difficulty: 'Sangat Mudah',
    time: 'Langsung Pakai / 12 Jam',
    materials: [
      '5 siung bawang merah (haluskan/blender)',
      '1 liter air mineral / air sumur',
      '1 sendok teh gula pasir'
    ],
    science: 'Bawang merah kaya akan zat pengatur tumbuh (ZPT) Auksin alami dan Rhizokalin yang secara agresif merangsang sel akar baru pada stek batang dan bibit tanaman.',
    howToMake: [
      'Haluskan bawang merah beserta kulitnya.',
      'Campurkan ke dalam 1 liter air hangat suam-suam kuku + gula pasir.',
      'Diamkan selama 3-6 jam hingga ekstrak terekstraksi sempurna.',
      'Saring ampang bawangnya.'
    ],
    usage: 'Rendam pangkal batang stek / akar bibit baru selama 30-60 menit sebelum ditanam ke tanah. Persentase hidup bibit naik hingga 90%!'
  },
  {
    id: 'zpt-air-kelapa',
    title: 'ZPT Sitokinin Air Kelapa Tua (Pemicu Tunas & Bunga)',
    wasteSource: 'Air Kelapa Tua Sisa Parutan Dapur/Pasar',
    category: 'ZPT Alami (Sitokinin & Hormon Tunas)',
    difficulty: 'Sangat Mudah',
    time: 'Langsung Pakai',
    materials: [
      '500ml air kelapa tua segar',
      '1 liter air bersih biasa'
    ],
    science: 'Air kelapa murni mengandung hormon Sitokinin, Gibberellin, serta kalium tinggi yang memicu pembelahan sel tunas baru dan mencegah pembentukan daun kerdil.',
    howToMake: [
      'Campurkan air kelapa tua dengan air bersih dengan perbandingan 1 : 2.',
      'Gunakan langsung tanpa perlu disimpan berhari-hari.'
    ],
    usage: 'Semprotkan ke seluruh bagian daun dan cabang tanaman pada pagi hari pukul 07.00 - 09.00 saat stomata daun terbuka lebar.'
  },
  {
    id: 'mol-nasi-basi',
    title: 'MOL Nasi Basi (Mikroorganisme Lokal Pengurai Super)',
    wasteSource: 'Sisa Nasi Kemarin / Basi yang Tidak Habis',
    category: 'Stater Mikroba & Pembenah Tanah',
    difficulty: 'Sangat Mudah',
    time: '5 - 7 Hari Fermentasi',
    materials: [
      'Kepalan nasi basi (2-3 mangkok)',
      '1 liter air mineral / air sumur',
      '2 sendok makan gula pasir / gula merah (makanan bakteri)'
    ],
    science: 'Nasi yang difermentasi menumbuhkan jamur *Trichoderma* dan *Rhizopus* yang sangat ampuh melindungi akar tanaman dari penyakit jamur patogen tanah.',
    howToMake: [
      'Kepalkan nasi basi, letakkan di wadah tertutup dan simpan di tempat gelap selama 3-4 hari sampai tumbuh jamur oranye/kuning keemasan.',
      'Larutkan gula merah/gula pasir ke dalam 1 liter air di dalam botol.',
      'Masukkan nasi berjamur ke dalam larutan gula, kocok perlahan, lalu tutup rapat (buka tutup botol sedikit setiap hari untuk buang gas).',
      'Setelah 5-7 hari, cairan akan beraroma fermentasi tapai manis. Saring airnya.'
    ],
    usage: 'Encerkan 100ml MOL ke dalam 1 liter air bersih. Siramkan ke pangkal tanaman atau semprotkan ke tumpukan sampah dapur untuk mempercepat kompos.'
  },
  {
    id: 'eco-enzyme-kulit-buah',
    title: 'Eco-Enzyme Multi-Manfaat Kulit Buah & Sayur',
    wasteSource: 'Kulit Jeruk, Nanas, Pepaya, Semangka, Sisa Sayur Mentah',
    category: 'Penyubur Daun & Desinfektan Alami',
    difficulty: 'Mudah',
    time: '3 Bulan Fermentasi Alami',
    materials: [
      '1 bagian Gula Merah / Molase (100 gram)',
      '3 bagian Sisa Kulit Buah/Sayur Mentah (300 gram)',
      '10 bagian Air Bersih (1 Liter Air)'
    ],
    science: 'Proses fermentasi anaerob menghasilkan enzim protease, amilase, serta asam asetat alami yang mengusir hama serangga perusak dan menyuburkan mikrobioma daun.',
    howToMake: [
      'Gunakan wadah plastik bermulut lebar (jangan gunakan botol kaca karena gas fermentasi kuat).',
      'Larutkan gula ke dalam air, lalu masukkan potongan kulit buah segar.',
      'Sisakan ruang udara 20% di bagian atas wadah, tutup rapat.',
      'Buka tutup wadah 1x sehari pada bulan pertama untuk melepaskan gas, lalu simpan di tempat teduh selama 3 bulan.',
      'Setelah 3 bulan, saring cairan yang berwarna cokelat harum segar.'
    ],
    usage: 'Encerkan dengan rasio 1ml Eco-Enzyme per 1 liter air (sangat hemat). Semprotkan ke daun dan batang 2 minggu sekali.'
  },
  {
    id: 'kalsium-cuka-cangkang',
    title: 'Kalsium Organik Instan (Cangkang Telur + Cuka Dapur)',
    wasteSource: 'Cangkang Telur Bekas Masak',
    category: 'Penguat Bunga & Anti Rontok Buah',
    difficulty: 'Sangat Cepat & Efektif',
    time: '24 Jam Reaksi Kimia Alami',
    materials: [
      '10 butir cangkang telur (cuci bersih & remas kasar)',
      '200ml Cuka Masak Dapur (Asam Asetat 5%)',
      'Wadah toples kaca terbuka'
    ],
    science: 'Asam asetat mengekstraksi Kalsium Karbonat padat ($CaCO_3$) menjadi Kalsium Asetat cair yang langsung bisa diserap oleh pembuluh tanaman tanpa menunggu berbulan-bulan.',
    howToMake: [
      'Sangrai sebentar cangkang telur agar kering dan mudah diremas.',
      'Masukkan remasan cangkang ke dalam toples kaca, lalu tuangkan cuka dapur (akan muncul gelembung gas $CO_2$ pertanda kalsium sedang larut).',
      'Biarkan selama 24-48 jam hingga gelembung berhenti dan air menjadi bening kekuningan.',
      'Saring cairan kalsium murni.'
    ],
    usage: 'Ambil 1 sendok makan (15ml) cairan kalsium, campurkan ke dalam 2 liter air. Semprotkan ke kuncup bunga cabai/tomat/mangga agar bunga tidak rontok.'
  },
  {
    id: 'poc-kulit-pisang-kopi',
    title: 'POC Kalium Super (Kulit Pisang + Ampas Kopi)',
    wasteSource: 'Kulit Pisang Matang & Ampas Kopi Bekas Seduh',
    category: 'Pemanis Rasa Buah & Pemicu Bunga',
    difficulty: 'Mudah',
    time: '3 - 5 Hari Perendaman',
    materials: [
      '4 buah kulit pisang cincang',
      '3 sendok makan ampas kopi bekas',
      '1.5 liter air kelapa tua atau air sumur'
    ],
    science: 'Kombinasi Kalium alami kulit pisang dan Nitrogen lambat dari ampas kopi memberikan dorongan energi saat tanaman memasuki fase generatif.',
    howToMake: [
      'Cincang kulit pisang, masukkan ke botol bersama ampas kopi.',
      'Tuangkan air kelapa/air sumur, tutup botol dan kocok rata.',
      'Simpan di tempat teduh selama 4 hari (buka tutup sesekali buang gas).',
      'Saring airnya.'
    ],
    usage: 'Kocorkan 250ml per pot tanaman buah atau cabai setiap 10 hari sekali saat mulai muncul bakal bunga.'
  }
];

// 3. DAFTAR PESTISIDA NABATI RUMAHAN
const PEST_CONTROL_RECIPES = [
  {
    id: 'white-oil-emulsion',
    title: 'Formulasi "White Oil" (Pestisida Pelapis Kutu Putih & Kebul)',
    category: 'Insektisida Kontak Murni Dapur',
    target: 'Kutu Putih (Mealybugs), Kutu Kebul, Kutu Daun (Aphids)',
    difficulty: 'Sangat Mudah',
    materials: [
      '1 cangkir Minyak Goreng Kelapa (200ml)',
      '1/4 cangkir Sabun Cuci Piring Cair (50ml)'
    ],
    science: 'Campuran minyak dan sabun membentuk emulsi putih pekat yang saat disemprotkan akan melapisi saluran napas (*spirakel*) hama serangga hingga lemas mati tanpa racun kimia.',
    howToMake: [
      'Campurkan minyak goreng dan sabun cuci piring ke dalam botol kecil.',
      'Kocok kuat-kuat selama 1-2 menit hingga cairan berubah menjadi emulsi putih susu kental (Stock White Oil).',
      'Simpan stock emulsi ini di wadah tertutup rapat (bisa bertahan hingga 6 bulan).'
    ],
    usage: 'Ambil 1 sendok makan (15ml) Stock White Oil, campurkan ke dalam 1 liter air hangat, kocok rata. Semprotkan langsung ke koloni kutu putih pada sore hari.'
  },
  {
    id: 'ekstrak-tembakau-nicotine',
    title: 'Ekstrak Tembakau Nikotin (Racun Kontak Ulat & Thrips)',
    category: 'Insektisida Saraf Alami',
    target: 'Ulat Grayak, Thrips Daun Keriting, Belalang',
    difficulty: 'Mudah',
    materials: [
      '50 gram Tembakau Murni / Puntung Rokok Bekas (20 puntung)',
      '1 liter air hangat',
      '1/2 sendok teh sabun cair'
    ],
    science: 'Alkaloid Nikotin dalam tembakau bekerja sebagai racun saraf serangga yang sangat cepat merusak fungsi pergerakan hama perusak daun.',
    howToMake: [
      'Rendam tembakau/puntung rokok ke dalam 1 liter air hangat selama 24 jam hingga air berwarna cokelat gelap seperti teh pekat.',
      'Saring cairan menggunakan kain halus agar serat tembakau terpisah.',
      'Tambahkan sabun cair sebagai perekat.'
    ],
    usage: 'Semprotkan tipis-tipis ke permukaan daun yang digerogoti ulat atau daun keriting akibat thrips di sore hari.'
  }
];

// 4. TIPS RAHASIA TABULAMPOT & PERAWATAN
const SECRET_GARDENING_TIPS = [
  {
    id: 'pruning-139',
    title: 'Teknik Pemangkasan 1-3-9 (Kanopi Rindang & Berbuah Lebat)',
    category: 'Arsitektur Batang Pohon Buah',
    desc: 'Metode membentuk struktur dahan pohon dalam pot agar berbentuk seperti mangkuk rimbun dan menerima sinar matahari secara merata.',
    steps: [
      'Batang Utama (1): Potong batang utama saat tingginya mencapai 60-80 cm dari permukaan tanah.',
      'Cabang Primer (3): Pelihara 3 cabang sehat yang tumbuh seimbang ke tiga arah yang berbeda.',
      'Cabang Sekunder (9): Saat cabang primer sepanjang 40 cm, potong ujungnya agar memicu pertumbuhan 3 cabang baru pada masing-masing cabang (total 9 cabang pembuahan).'
    ]
  },
  {
    id: 'stress-air',
    title: 'Teknik Stress Air (Memaksa Pohon Buah Berbunga Serempak)',
    category: 'Induksi Pembungaan Tabulampot',
    desc: 'Trik memicu hormon stres pada tanaman buah dewasa (Mangga, Jeruk, Kelengkeng) agar beralih dari fase daun ke pembuahan.',
    steps: [
      'Pastikan umur tanaman sudah cukup dewasa (tulang daun tua & tajuk cukup).',
      'Hentikan penyiraman total selama 4-7 hari sampai daun terlihat sedikit layu di sore hari (jangan sampai mati).',
      'Begitu daun terlihat layu, kucurkan air melimpah + beri pupuk Kalium (POC Pisang/NPK tinggi K).',
      'Tanaman akan merespons kejutan air ini dengan mengeluarkan kuncup bunga serempak dalam 2-3 minggu!'
    ]
  }
];

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState<'media' | 'waste' | 'pest' | 'tips' | 'calc'>('media');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculator State
  const [potSize, setPotSize] = useState<number>(30); // diameter cm
  const [phase, setPhase] = useState<'vegetative' | 'generative'>('vegetative');

  const calculateDose = () => {
    const doseGrams = Math.round((potSize / 30) * (phase === 'vegetative' ? 5 : 8));
    const waterLiter = Math.round((potSize / 30) * 1.5 * 10) / 10;
    return { doseGrams, waterLiter };
  };

  const { doseGrams, waterLiter } = calculateDose();

  // Filter Search
  const filterByQuery = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.target && item.target.toLowerCase().includes(q)) ||
      (item.wasteSource && item.wasteSource.toLowerCase().includes(q))
    );
  };

  return (
    <AppShell title="Kamus Nutrisi &amp; Formulasi">
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span>Kamus Agrikultur &amp; Organik Rumahan</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kamus Nutrisi &amp; Perawatan</h1>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Ensiklopedia lengkap meracik media tanam anti-gagal, pupuk organik limbah dapur, pestisida nabati, ZPT alami, dan trik membuahkan tabulampot.
          </p>
        </div>

        {/* Search Bar Interaktif */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari resep (cth: Kalsium, Bawang, Rooftop, Anggur, Kutu Putih...)"
            className="w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full"
            >
              Reset
            </button>
          )}
        </div>

        {/* Tab Navigation Menu Horizontal Scrollbar Hidden */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hidden">
          <button
            onClick={() => setActiveTab('media')}
            className={cn(
              "shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
              activeTab === 'media'
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
            )}
          >
            <Shovel className="w-3.5 h-3.5" />
            <span>Racik Media ({MEDIA_RECIPES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('waste')}
            className={cn(
              "shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
              activeTab === 'waste'
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
            )}
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>Pupuk &amp; ZPT Dapur ({ORGANIC_WASTE_FERTILIZERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pest')}
            className={cn(
              "shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
              activeTab === 'pest'
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
            )}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Pestisida Nabati ({PEST_CONTROL_RECIPES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={cn(
              "shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
              activeTab === 'tips'
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Trik Tabulampot ({SECRET_GARDENING_TIPS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={cn(
              "shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5",
              activeTab === 'calc'
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 shadow-md scale-[1.02]"
                : "bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white"
            )}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Pot</span>
          </button>
        </div>

        {/* CONTENT TABS */}
        <AnimatePresence mode="wait">
          {/* 1. TAB RACIKAN MEDIA TANAM */}
          {activeTab === 'media' && (
            <motion.div
              key="media-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b3628] to-[#14281e] border border-emerald-600/40 text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block font-bold mb-0.5">Kunci Utama Media Pot Subur:</strong>
                  Media dalam pot tidak boleh memadat seperti tanah biasa. Wajib memiliki rongga udara (porositas) dari sekam bakar/pasir malang agar akar bisa bernapas bebas dan terhindar dari penyakit busuk akar.
                </div>
              </div>

              {filterByQuery(MEDIA_RECIPES).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 backdrop-blur-md shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-900/80 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider block mb-0.5">
                        {item.target}
                      </span>
                      <h3 className="text-base font-black text-white">{item.title}</h3>
                    </div>
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0c1410] border border-emerald-700/40 text-xs text-emerald-200">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                      📐 Rumus Takaran Rasio:
                    </span>
                    <strong className="text-white block leading-relaxed">{item.ratio}</strong>
                  </div>

                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    <strong className="text-emerald-300">Alasan Ilmiah:</strong> {item.why}
                  </p>

                  <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                    <span className="text-[10px] font-mono uppercase text-emerald-300/80 font-bold block">
                      Langkah Pembuatan:
                    </span>
                    <div className="space-y-1.5">
                      {item.steps.map((step: string, idx: number) => (
                        <div key={idx} className="text-xs text-emerald-100/90 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 2. TAB PUPUK & ZPT DARI SAMPAH RUMAHAN */}
          {activeTab === 'waste' && (
            <motion.div
              key="waste-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#272a1c] to-[#1c2016] border border-amber-700/40 text-xs text-amber-100/90 leading-relaxed flex items-start gap-2.5 shadow-sm">
                <Recycle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-bold mb-0.5">Zero Waste Home Farming:</strong>
                  Hampir 60% sampah dapur rumah tangga (kulit buah, bawang, nasi, cangkang telur, air kelapa) adalah nutrisi emas &amp; ZPT alami bagi tanaman. Tidak perlu beli obat kimia mahal!
                </div>
              </div>

              {filterByQuery(ORGANIC_WASTE_FERTILIZERS).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 backdrop-blur-md shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-900/80 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-base font-black text-white">{item.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 block">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c1410] border border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-200">
                    <Trash2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Bahan Limbah:</strong> {item.wasteSource}</span>
                  </div>

                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    <strong className="text-emerald-300">Khasiat Ilmiah:</strong> {item.science}
                  </p>

                  <div className="space-y-1 bg-[#0c1410]/50 p-3 rounded-2xl border border-emerald-900/40">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Bahan yang Disiapkan:
                    </span>
                    <ul className="space-y-1">
                      {item.materials.map((m: string, idx: number) => (
                        <li key={idx} className="text-xs text-emerald-100/90 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                    <span className="text-[10px] font-mono uppercase text-emerald-300/80 font-bold block">
                      Instruksi Pembuatan:
                    </span>
                    <div className="space-y-1.5">
                      {item.howToMake.map((step: string, idx: number) => (
                        <div key={idx} className="text-xs text-emerald-100/90 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100">
                    <strong className="text-emerald-300 block font-mono text-[10px] uppercase tracking-wider mb-1">
                      💡 Dosis &amp; Cara Penyiraman:
                    </strong>
                    {item.usage}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. TAB PESTISIDA NABATI RUMAHAN */}
          {activeTab === 'pest' && (
            <motion.div
              key="pest-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#311e18] to-[#241510] border border-rose-700/40 text-xs text-rose-100/90 leading-relaxed flex items-start gap-2.5 shadow-sm">
                <Bug className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 block font-bold mb-0.5">Solusi Anti Hama Tanpa Bahan Kimia Beracun:</strong>
                  Racikan pestisida nabati dari bahan dapur aman untuk lingkungan rumah, tidak meninggalkan racun pada sayuran yang dipanen, dan sangat efektif membasmi serangga.
                </div>
              </div>

              {filterByQuery(PEST_CONTROL_RECIPES).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 backdrop-blur-md shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-900/80 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-rose-400 uppercase font-bold tracking-wider block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-base font-black text-white">{item.title}</h3>
                    </div>
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 shrink-0">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c1410] border border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Sasaran Hama:</strong> {item.target}</span>
                  </div>

                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    <strong className="text-emerald-300">Cara Kerja Ilmiah:</strong> {item.science}
                  </p>

                  <div className="space-y-1 bg-[#0c1410]/50 p-3 rounded-2xl border border-emerald-900/40">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Bahan yang Disiapkan:
                    </span>
                    <ul className="space-y-1">
                      {item.materials.map((m: string, idx: number) => (
                        <li key={idx} className="text-xs text-emerald-100/90 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                    <span className="text-[10px] font-mono uppercase text-emerald-300/80 font-bold block">
                      Instruksi Pembuatan:
                    </span>
                    <div className="space-y-1.5">
                      {item.howToMake.map((step: string, idx: number) => (
                        <div key={idx} className="text-xs text-emerald-100/90 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100">
                    <strong className="text-emerald-300 block font-mono text-[10px] uppercase tracking-wider mb-1">
                      💡 Cara Aplikasi Penyemprotan:
                    </strong>
                    {item.usage}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 4. TAB TRIK TABULAMPOT */}
          {activeTab === 'tips' && (
            <motion.div
              key="tips-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2.5 shadow-sm">
                <Scissors className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block font-bold mb-0.5">Trik Rahasia Pembuahan Tanaman Pot:</strong>
                  Rahasia agar tanaman buah di pot tidak hanya tumbuh tinggi menjadi daun saja, namun rajin memunculkan bunga dan berbuah lebat sepanjang tahun.
                </div>
              </div>

              {filterByQuery(SECRET_GARDENING_TIPS).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 backdrop-blur-md shadow-md"
                >
                  <div className="border-b border-emerald-900/80 pb-3">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="text-base font-black text-white">{item.title}</h3>
                  </div>

                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                    <span className="text-[10px] font-mono uppercase text-emerald-300/80 font-bold block">
                      Langkah Eksekusi Praktis:
                    </span>
                    <div className="space-y-2">
                      {item.steps.map((step: string, idx: number) => (
                        <div key={idx} className="p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60 text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 5. TAB KALKULATOR DOSIS POT */}
          {activeTab === 'calc' && (
            <motion.div
              key="calc-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-5 backdrop-blur-md shadow-md"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Presisi Osmotik Akar Pot
                </span>
                <h3 className="text-base font-black text-white">Kalkulator Dosis Pemupukan Pot</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Menghitung takaran aman agar akar di dalam pot tidak terbakar / mengalami dehidrasi akibat konsentrasi pupuk berlebihan.
                </p>
              </div>

              <div className="space-y-4">
                {/* Pot Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-emerald-300">
                      Ukuran Diameter Pot:
                    </label>
                    <span className="text-base font-black font-mono text-emerald-400 bg-emerald-950 px-3 py-0.5 rounded-full border border-emerald-800">
                      {potSize} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={potSize}
                    onChange={(e) => setPotSize(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-[#0c1410] rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-emerald-400/60">
                    <span>15cm (Bibit/Sayur)</span>
                    <span>30cm (Sedang)</span>
                    <span>60cm (Tabulampot Besar)</span>
                  </div>
                </div>

                {/* Fase Pertumbuhan */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-emerald-300 block">
                    Fase Pertumbuhan Tanaman
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPhase('vegetative')}
                      className={cn(
                        "p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98]",
                        phase === 'vegetative'
                          ? "bg-gradient-to-br from-[#183124] to-[#13281d] border-emerald-500 text-white shadow-md ring-1 ring-emerald-400/30"
                          : "bg-[#0c1410] border-emerald-900/60 text-emerald-300/60"
                      )}
                    >
                      <span className="text-xs font-black block text-emerald-300">🌱 Fase Vegetatif</span>
                      <span className="text-[10px] text-emerald-200/70 block mt-0.5">Pertumbuhan Daun &amp; Batang Baru</span>
                    </button>
                    <button
                      onClick={() => setPhase('generative')}
                      className={cn(
                        "p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98]",
                        phase === 'generative'
                          ? "bg-gradient-to-br from-[#183124] to-[#13281d] border-emerald-500 text-white shadow-md ring-1 ring-emerald-400/30"
                          : "bg-[#0c1410] border-emerald-900/60 text-emerald-300/60"
                      )}
                    >
                      <span className="text-xs font-black block text-amber-300">🌸 Fase Generatif</span>
                      <span className="text-[10px] text-amber-200/70 block mt-0.5">Bunga &amp; Pembesaran Buah</span>
                    </button>
                  </div>
                </div>

                {/* Hasil Kalkulasi Card */}
                <div className="rounded-3xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 p-5 space-y-3.5 shadow-md">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    Takaran Rekomendasi Aman
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0c1410]/80 p-3.5 rounded-2xl border border-emerald-900/60 text-center">
                      <span className="text-[9px] font-mono text-emerald-300/70 block">Dosis Pupuk Padat/NPK</span>
                      <span className="text-2xl font-black font-mono text-emerald-400">{doseGrams} g</span>
                      <span className="text-[9px] text-emerald-300/60 block">(± {Math.round(doseGrams / 5 * 10) / 10} sendok teh)</span>
                    </div>
                    <div className="bg-[#0c1410]/80 p-3.5 rounded-2xl border border-emerald-900/60 text-center">
                      <span className="text-[9px] font-mono text-emerald-300/70 block">Volume Air Pelarut</span>
                      <span className="text-2xl font-black font-mono text-emerald-400">{waterLiter} L</span>
                      <span className="text-[9px] text-emerald-300/60 block">(Air Sumur / Bebas Kaporit)</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-100 leading-relaxed pt-1">
                    💡 <strong>Aturan Siram:</strong> Larutkan pupuk hingga homogen, siramkan melingkar di sekeliling dinding pot (sejauh 5 cm dari batang utama). Lakukan setiap 14 hari sekali pada pagi hari.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
