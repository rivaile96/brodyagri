'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import BottomDrawer from '@/components/ui/BottomDrawer';
import {
  FlaskConical,
  Calculator,
  ChevronRight,
  Sparkles,
  Shovel,
  Recycle,
  Sprout,
  ShieldCheck,
  Search,
  Scissors,
  Bug,
  Trash2,
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
    science: 'Asam asetat mengekstraksi Kalsium Karbonat padat (CaCO3) menjadi Kalsium Asetat cair yang langsung bisa diserap oleh pembuluh tanaman tanpa menunggu berbulan-bulan.',
    howToMake: [
      'Sangrai sebentar cangkang telur agar kering dan mudah diremas.',
      'Masukkan remasan cangkang ke dalam toples kaca, lalu tuangkan cuka dapur (akan muncul gelembung gas CO2 pertanda kalsium sedang larut).',
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
    usage: 'Encerkan 1 gelas (200ml) ke dalam 1 liter air bersih. Siramkan ke tanaman yang sedang mulai belajar berbunga.'
  }
];

// 3. DAFTAR RACIKAN PESTISIDA NABATI DARI BAHAN DAPUR
const PEST_CONTROL_RECIPES = [
  {
    id: 'pestisida-bawang-putih-cabai',
    title: 'Pestisida Nabati Bawang Putih & Cabai Rawit',
    target: 'Kutu Kebul, Kutu Daun (Aphids), Semut, Belalang',
    category: 'Insektisida Nabati Kontak & Repellent',
    difficulty: 'Sangat Mudah',
    materials: [
      '1 bonggol Bawang Putih (± 10 siung)',
      '10 buah Cabai Rawit pedas',
      '1 liter air bersih',
      '1 sendok teh sabun cuci piring (sebagai pelekat)'
    ],
    science: 'Senyawa Allicin pada bawang dan Capsaicin pedas cabai membakar lapisan lilin pelindung tubuh hama serangga dan merusak sensor penciumannya.',
    howToMake: [
      'Blender bawang putih dan cabai rawit dengan 500ml air hingga halus.',
      'Diamkan rendaman semalaman (24 jam) di tempat teduh.',
      'Saring menggunakan kain tipis/saringan kopi.',
      'Tambahkan sisa 500ml air + 1 sdt sabun cair, aduk perlahan tanpa berbusa.'
    ],
    usage: 'Semprotkan merata ke balik-balik daun (sarang kutu kebul) pada sore hari pukul 16.30 setelah matahari tidak terik. Ulangi 3 hari sekali.'
  },
  {
    id: 'fungisida-kunyit-baking-soda',
    title: 'Fungisida Organik Kunyit & Baking Soda',
    target: 'Embun Tepung (Powdery Mildew), Bercak Daun, Antraknosa',
    category: 'Fungisida & Anti Jamur Alami',
    difficulty: 'Sangat Mudah',
    materials: [
      '100 gram Rimpang Kunyit Tua',
      '1 sendok teh Baking Soda (Natrium Bikarbonat)',
      '1 liter air bersih'
    ],
    science: 'Kurkumin dalam kunyit adalah antimikroba kuat, dan Baking Soda menaikkan pH permukaan daun menjadi basa sehingga spora jamur mati seketika.',
    howToMake: [
      'Parut atau blender kunyit dengan air, peras air sarinya.',
      'Campurkan 1 sdt baking soda ke dalam perasan air kunyit, aduk larut.',
      'Masukkan ke botol spray.'
    ],
    usage: 'Semprotkan pada daun yang mulai timbul bintik putih tepung atau bercak kuning jamur. Lakukan di pagi hari.'
  },
  {
    id: 'tembakau-anti-ulat',
    title: 'Ekstrak Rendaman Tembakau (Anti Ulat & Thrips)',
    target: 'Ulat Grayak, Thrips Penggulung Daun, Tungau Merah',
    category: 'Insektisida Nabati Sistemik Ringan',
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

  // Selected Drawer Modal Item
  const [selectedItem, setSelectedItem] = useState<{
    type: 'media' | 'waste' | 'pest' | 'tips';
    data: any;
  } | null>(null);

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
    <AppShell title="Kamus Nutrisi & Formulasi">
      <div className="space-y-4">
        {/* Header Ringkas */}
        <div className="space-y-1">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-semibold"
            style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            <span>Kamus Formulasi & Racikan</span>
          </div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Kamus Nutrisi & Perawatan
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Sentuh kartu untuk melihat takaran, bahan, dan cara meracik.
          </p>
        </div>

        {/* Search Bar Interaktif */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari racikan (cth: Kalsium, Bawang, Anggur, Kutu...)"
            className="w-full border rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-main)',
            }}
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--accent-primary)' }}
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
              "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              activeTab === 'media'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "text-dim border-transparent hover:border-emerald-500/20"
            )}
            style={{
              backgroundColor: activeTab === 'media' ? undefined : 'var(--bg-card)',
              borderColor: activeTab === 'media' ? undefined : 'var(--border-card)',
              color: activeTab === 'media' ? '#ffffff' : 'var(--text-dim)',
            }}
          >
            <Shovel className="w-3.5 h-3.5" />
            <span>Media ({MEDIA_RECIPES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('waste')}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              activeTab === 'waste'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "border-transparent"
            )}
            style={{
              backgroundColor: activeTab === 'waste' ? undefined : 'var(--bg-card)',
              borderColor: activeTab === 'waste' ? undefined : 'var(--border-card)',
              color: activeTab === 'waste' ? '#ffffff' : 'var(--text-dim)',
            }}
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>Pupuk Dapur ({ORGANIC_WASTE_FERTILIZERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pest')}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              activeTab === 'pest'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "border-transparent"
            )}
            style={{
              backgroundColor: activeTab === 'pest' ? undefined : 'var(--bg-card)',
              borderColor: activeTab === 'pest' ? undefined : 'var(--border-card)',
              color: activeTab === 'pest' ? '#ffffff' : 'var(--text-dim)',
            }}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Pestisida ({PEST_CONTROL_RECIPES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              activeTab === 'tips'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "border-transparent"
            )}
            style={{
              backgroundColor: activeTab === 'tips' ? undefined : 'var(--bg-card)',
              borderColor: activeTab === 'tips' ? undefined : 'var(--border-card)',
              color: activeTab === 'tips' ? '#ffffff' : 'var(--text-dim)',
            }}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Tabulampot ({SECRET_GARDENING_TIPS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              activeTab === 'calc'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "border-transparent"
            )}
            style={{
              backgroundColor: activeTab === 'calc' ? undefined : 'var(--bg-card)',
              borderColor: activeTab === 'calc' ? undefined : 'var(--border-card)',
              color: activeTab === 'calc' ? '#ffffff' : 'var(--text-dim)',
            }}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator</span>
          </button>
        </div>

        {/* CONTENT LIST (COMPACT CARDS) */}
        <AnimatePresence mode="wait">
          {/* 1. TAB RACIKAN MEDIA TANAM */}
          {activeTab === 'media' && (
            <motion.div
              key="media-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5"
            >
              {filterByQuery(MEDIA_RECIPES).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem({ type: 'media', data: item })}
                  className="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:border-emerald-500/40"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}
                    >
                      <Shovel className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border"
                          style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                        >
                          {item.target}
                        </span>
                        <span className="text-[9px] font-medium" style={{ color: 'var(--text-dim)' }}>
                          • {item.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ color: 'var(--text-dim)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 2. TAB PUPUK & ZPT DARI SAMPAH RUMAHAN */}
          {activeTab === 'waste' && (
            <motion.div
              key="waste-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5"
            >
              {filterByQuery(ORGANIC_WASTE_FERTILIZERS).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem({ type: 'waste', data: item })}
                  className="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:border-emerald-500/40"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}
                    >
                      <Recycle className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border"
                          style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                        >
                          {item.wasteSource}
                        </span>
                        <span className="text-[9px] font-medium" style={{ color: 'var(--text-dim)' }}>
                          • {item.time}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ color: 'var(--text-dim)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 3. TAB PESTISIDA NABATI RUMAHAN */}
          {activeTab === 'pest' && (
            <motion.div
              key="pest-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5"
            >
              {filterByQuery(PEST_CONTROL_RECIPES).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem({ type: 'pest', data: item })}
                  className="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:border-emerald-500/40"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}
                    >
                      <Bug className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border"
                          style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                        >
                          {item.target}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ color: 'var(--text-dim)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 4. TAB TRIK TABULAMPOT */}
          {activeTab === 'tips' && (
            <motion.div
              key="tips-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5"
            >
              {filterByQuery(SECRET_GARDENING_TIPS).map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem({ type: 'tips', data: item })}
                  className="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:border-emerald-500/40"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)', color: 'var(--accent-primary)' }}
                    >
                      <Scissors className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border"
                          style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ color: 'var(--text-dim)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 5. TAB KALKULATOR DOSIS POT */}
          {activeTab === 'calc' && (
            <motion.div
              key="calc-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-3xl border p-5 space-y-4 shadow-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                  Presisi Dosis Pot
                </span>
                <h3 className="text-base font-black" style={{ color: 'var(--text-main)' }}>
                  Kalkulator Dosis Pemupukan
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  Menghitung takaran aman agar akar pot tidak panas atau over-dosis.
                </p>
              </div>

              <div className="space-y-4">
                {/* Pot Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-main)' }}>
                      Diameter Pot:
                    </label>
                    <span 
                      className="text-sm font-black font-mono px-3 py-0.5 rounded-full border"
                      style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}
                    >
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
                    className="w-full accent-emerald-500 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono" style={{ color: 'var(--text-dim)' }}>
                    <span>15cm (Bibit)</span>
                    <span>30cm (Sedang)</span>
                    <span>60cm (Tabulampot)</span>
                  </div>
                </div>

                {/* Fase Pertumbuhan */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-main)' }}>
                    Fase Pertumbuhan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPhase('vegetative')}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all active:scale-[0.98]",
                        phase === 'vegetative'
                          ? "border-emerald-500 ring-1 ring-emerald-400/30"
                          : ""
                      )}
                      style={{
                        backgroundColor: phase === 'vegetative' ? 'var(--badge-bg)' : 'var(--bg-card-subtle)',
                        borderColor: phase === 'vegetative' ? 'var(--accent-primary)' : 'var(--border-card-subtle)',
                      }}
                    >
                      <span className="text-xs font-bold block" style={{ color: 'var(--accent-primary)' }}>🌱 Vegetatif</span>
                      <span className="text-[10px] block mt-0.5" style={{ color: 'var(--text-dim)' }}>Pertumbuhan Daun & Ranting</span>
                    </button>
                    <button
                      onClick={() => setPhase('generative')}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all active:scale-[0.98]",
                        phase === 'generative'
                          ? "border-amber-500 ring-1 ring-amber-400/30"
                          : ""
                      )}
                      style={{
                        backgroundColor: phase === 'generative' ? 'var(--badge-bg)' : 'var(--bg-card-subtle)',
                        borderColor: phase === 'generative' ? '#f59e0b' : 'var(--border-card-subtle)',
                      }}
                    >
                      <span className="text-xs font-bold block text-amber-500">🌸 Generatif</span>
                      <span className="text-[10px] block mt-0.5" style={{ color: 'var(--text-dim)' }}>Bunga & Buah</span>
                    </button>
                  </div>
                </div>

                {/* Hasil Kalkulasi Card */}
                <div 
                  className="rounded-2xl border p-4 space-y-3 shadow-sm"
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--accent-primary)' }}>
                    Takaran Aman Terhitung
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <span className="text-[9px] font-mono block" style={{ color: 'var(--text-dim)' }}>Dosis Pupuk NPK</span>
                      <span className="text-xl font-black font-mono block mt-0.5" style={{ color: 'var(--accent-primary)' }}>{doseGrams} g</span>
                      <span className="text-[9px] block" style={{ color: 'var(--text-dim)' }}>(± {Math.round(doseGrams / 5 * 10) / 10} sdt)</span>
                    </div>
                    <div className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <span className="text-[9px] font-mono block" style={{ color: 'var(--text-dim)' }}>Air Pelarut</span>
                      <span className="text-xl font-black font-mono block mt-0.5" style={{ color: 'var(--accent-primary)' }}>{waterLiter} L</span>
                      <span className="text-[9px] block" style={{ color: 'var(--text-dim)' }}>(Bebas kaporit)</span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'var(--text-muted)' }}>
                    💡 <strong>Cara Pakai:</strong> Larutkan merata, siram melingkar di dinding tepi pot (jangan langsung terkena batang). Ulangi 14 hari sekali di pagi hari.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAIL DRAWER / BOTTOM SHEET */}
      <BottomDrawer
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.data?.title || 'Detail Formulasi'}
        badge={selectedItem?.data?.target || selectedItem?.data?.category || selectedItem?.data?.wasteSource}
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            {/* 1. MEDIA TANAM DETAILS */}
            {selectedItem.type === 'media' && (
              <>
                <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold block mb-1">📐 Rumus Rasio Media:</span>
                  <p className="font-bold text-sm leading-relaxed">{selectedItem.data.ratio}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Karakteristik & Alasan Ilmiah:
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {selectedItem.data.why}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Langkah Peracikan:
                  </span>
                  <div className="space-y-2">
                    {selectedItem.data.steps.map((step: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span 
                          className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 2. PUPUK DAPUR DETAILS */}
            {selectedItem.type === 'waste' && (
              <>
                <div className="p-3 rounded-2xl border flex items-center gap-2" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                  <Trash2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span style={{ color: 'var(--text-main)' }}><strong>Bahan Limbah:</strong> {selectedItem.data.wasteSource}</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Bahan yang Disiapkan:
                  </span>
                  <ul className="space-y-1">
                    {selectedItem.data.materials.map((m: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Instruksi Pembuatan:
                  </span>
                  <div className="space-y-2">
                    {selectedItem.data.howToMake.map((step: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span 
                          className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}>
                  <strong className="block font-bold text-xs">💡 Dosis & Cara Aplikasi:</strong>
                  <p className="leading-relaxed">{selectedItem.data.usage}</p>
                </div>
              </>
            )}

            {/* 3. PESTISIDA DETAILS */}
            {selectedItem.type === 'pest' && (
              <>
                <div className="p-3 rounded-2xl border flex items-center gap-2" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span style={{ color: 'var(--text-main)' }}><strong>Sasaran Hama:</strong> {selectedItem.data.target}</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Bahan-Bahan:
                  </span>
                  <ul className="space-y-1">
                    {selectedItem.data.materials.map((m: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Langkah Pembuatan:
                  </span>
                  <div className="space-y-2">
                    {selectedItem.data.howToMake.map((step: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span 
                          className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--badge-border)', color: 'var(--badge-text)' }}>
                  <strong className="block font-bold text-xs">💡 Cara Penyemprotan:</strong>
                  <p className="leading-relaxed">{selectedItem.data.usage}</p>
                </div>
              </>
            )}

            {/* 4. TIPS TABULAMPOT DETAILS */}
            {selectedItem.type === 'tips' && (
              <>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {selectedItem.data.desc}
                </p>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-card-subtle)' }}>
                  <span className="text-[10px] font-mono uppercase font-bold block" style={{ color: 'var(--accent-primary)' }}>
                    Langkah Eksekusi:
                  </span>
                  <div className="space-y-2">
                    {selectedItem.data.steps.map((step: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-card-subtle)' }}>
                        <span 
                          className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </BottomDrawer>
    </AppShell>
  );
}
