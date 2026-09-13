import sqlite3
import json

conn = sqlite3.connect('/opt/brody-workspace/brodyagri/data/brodyagri.db')
c = conn.cursor()

guides = [
  {
    "id": "guide-anggur-tropis",
    "slug": "anggur-tropis",
    "title": "Panduan Lengkap Budidaya Anggur Tropis",
    "category": "Buah-buahan",
    "difficulty": "Tingkat Menengah",
    "harvest_time": "8 - 12 Bulan Pasca Tanam",
    "sunlight_req": "Min. 8 Jam Sinar Matahari Penuh",
    "optimal_temp": "26°C - 33°C (Suka Panas)",
    "optimal_elevation": "0 - 500 mdpl (Dataran Rendah)",
    "summary": "Anggur sangat adaptif di iklim tropis panas Indonesia. Kunci suksesnya adalah media tanam super poros (anti busuk akar), pembentukan cabang tersier sistem trellis/para-para, dan teknik pemangkasan pembuahan (pruning bud).",
    "media_recipe": json.dumps({
      "pot_size": "Planter Bag 50-100 Liter / Drum",
      "formula": "2 Sekam Bakar : 1 Sekam Mentah Lapuk : 1 Tanah Humus : 1/2 Pasir Malang",
      "ph_target": "6.0 - 6.8",
      "drainage_note": "Wajib sangat lancar, air siraman harus langsung meresap keluar dalam hitungan detik tanpa menggenang."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Bulan 1-3 (Batang Primer)", "desc": "Tumbuhkan 1 tunas utama lurus ke atas setinggi 1.5 - 2 meter menggunakan ajir lurus. Buang semua tunas air di ketiak daun bagian bawah." },
      { "title": "Bulan 4-5 (Cabang Sekunder)", "desc": "Belokkan ujung batang utama ke kawat rambatan horizontal sepanjang 1 - 1.5 meter untuk membentuk cabang sekunder." },
      { "title": "Bulan 6-7 (Cabang Tersier)", "desc": "Pelihara tunas air atau mata tunas (bud) yang tumbuh ke atas dari cabang sekunder dengan jarak 15-20 cm antar cabang. Batasi panjang cabang tersier sampai 15-20 daun (pangkas pucuknya)." }
    ]),
    "generative_steps": json.dumps([
      { "title": "1 Bulan Sebelum Pruning", "desc": "Kocorkan pupuk tinggi Kalium & Fosfor (POC Pisang / MKP) seminggu sekali sebanyak 4 kali untuk memadatkan nutrisi di dalam mata tunas (bud)." },
      { "title": "Eksekusi Pruning Pembuahan", "desc": "Pangkas semua cabang tersier yang sudah berwarna cokelat (kayu matang) pada mata bud ke-3 s/d ke-9 (tergantung varietas: Jupiter di bud 3-4, Ninel/Trans di bud 6-8). Rontokkan semua daun tua." },
      { "title": "Fase Pembungaan & Penjarangan Buah", "desc": "Dalam 10-14 hari, tunas baru akan pecah (*sprout*) membawa brokoli bunga. Lakukan penjarangan buah (berry thinning) dengan membuang 30-40% butiran buah muda agar dompolan tidak terlalu rapat dan buah bisa berukuran jumbo tanpa pecah." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Jamur Embun Tepung (Powdery Mildew)", "symptoms": "Bercak serbuk putih seperti bedak di daun dan bunga.", "solution": "Semprotkan larutan White Oil dapur atau fungisida nabati rebusan kunyit di sore hari." },
      { "name": "Kutu Perisai & Thrips", "symptoms": "Daun keriting melengkung ke atas, pucuk tunas gosong.", "solution": "Semprotkan ekstrak tembakau nikotin 3 hari sekali." }
    ]),
    "pro_tips": json.dumps([
      "Jangan siram tanaman saat bunga anggur sedang mekar penuh (fase mekar sari) agar penyerbukan tidak gagal akibat kebasahan.",
      "Bungkus dompolan buah anggur dengan fruit cover pembungkus buah saat ukuran butiran sudah sebesar kacang hijau agar terhindar dari lalat buah dan burung."
    ])
  },
  {
    "id": "guide-mangga-tabulampot",
    "slug": "mangga-tabulampot",
    "title": "Rahasia Tabulampot Mangga Berbuah Cepat",
    "category": "Buah-buahan",
    "difficulty": "Mudah",
    "harvest_time": "1 - 2 Tahun (Bibit Okulasi/Cangkok)",
    "sunlight_req": "Min. 6 - 8 Jam Sinar Penuh",
    "optimal_temp": "27°C - 34°C",
    "optimal_elevation": "0 - 600 mdpl",
    "summary": "Menanam mangga dalam pot (tabulampot) sangat cocok untuk pekarangan sempit atau rooftop. Dengan varietas genjah (Chokanan, Irwin, Kiojay) dan trik stress air, pohon mangga bisa berbuah lebat setinggi 1 meter.",
    "media_recipe": json.dumps({
      "pot_size": "Pot Plastik / Drum 60cm (Min 60 Liter)",
      "formula": "2 Tanah Hitam : 1 Kompos Matang : 1 Arang Sekam : 1/2 Cocopeat",
      "ph_target": "6.0 - 7.0",
      "drainage_note": "Gunakan pecahan genteng setebal 5 cm di dasar pot agar akar tunggang tidak terendam genangan air."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Bulan 1-6 (Pembentukan Tajuk 1-3-9)", "desc": "Pangkas batang utama setinggi 60-80cm. Pelihara 3 cabang primer seimbang, lalu pangkas lagi saat cabang primer berusia 4 bulan agar membentuk 9 cabang sekunder berbentuk mangkuk rimbun." },
      { "title": "Bulan 7-12 (Pemberian Nutrisi Daun)", "desc": "Kocorkan air cucian beras atau pupuk organik cair nitrogen seminggu sekali untuk memperkuat batang dan kerapatan daun tua." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Trik Kejutan Stress Air", "desc": "Saat dahan sudah berwarna cokelat tua dan daun mengeras hijau tua, hentikan penyiraman total selama 5-7 hari sampai daun terlihat sedikit terkulai layu di sore hari." },
      { "title": "Kocoran Nutrisi Pemicu Bunga", "desc": "Segera siram melimpah + berikan kalsium cuka cangkang telur dan POC kulit pisang. Pohon akan merespons dengan mengeluarkan malai bunga di ujung cabang dalam 2-3 pekan." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Kutu Putih & Semut", "symptoms": "Bercak putih di balik daun dan kehadiran semut hitam/merah.", "solution": "Semprotkan White Oil (minyak goreng + sabun cair) di balik daun." },
      { "name": "Lalat Buah", "symptoms": "Buah mangga muda berlubang kecil dan busuk rontok sebelum matang.", "solution": "Bungkus buah dengan plastik berlubang kecil atau kertas semen sejak buah sebesar telur puyuh." }
    ]),
    "pro_tips": json.dumps([
      "Pilih varietas genjah alami seperti Chokanan (bisa berbuah 3x setahun) atau Garifta Merah untuk tabulampot.",
      "Jangan membiarkan buah terlalu banyak pada pohon yang baru pertama kali berbuah (maksimal 3-5 buah per pot agar pohon tidak kerdil)."
    ])
  },
  {
    "id": "guide-cabai-rawit",
    "slug": "cabai-rawit",
    "title": "Budidaya Cabai Rawit Rumahan Bebas Daun Keriting",
    "category": "Sayuran",
    "difficulty": "Sangat Mudah",
    "harvest_time": "75 - 90 Hari Pasca Semai",
    "sunlight_req": "Min. 6 Jam Sinar Matahari",
    "optimal_temp": "25°C - 32°C",
    "optimal_elevation": "0 - 1000 mdpl",
    "summary": "Cabai rawit adalah tanaman wajib di pekarangan rumah. Musuh utamanya adalah daun keriting (thrips/virus kuning). Dengan media gembur dan pencegahan rutin, 2-3 pot cabai cukup untuk konsumsi dapur harian.",
    "media_recipe": json.dumps({
      "pot_size": "Polybag 30-35cm / Ember Bekas",
      "formula": "1 Tanah Gembur : 1 Kompos Organik : 1 Arang Sekam",
      "ph_target": "6.0 - 6.8",
      "drainage_note": "Cabai tidak suka tanah terlalu becek karena mudah terkena busuk batang (Phytophthora)."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Hari 1-25 (Penyemaian & Pindah Tanam)", "desc": "Semai biji di tray semai. Pindahkan ke polybag saat berdaun 4-5 helai. Siram dengan ZPT bawang merah untuk mempercepat rooting." },
      { "title": "Hari 30 (Topping / Potong Pucuk)", "desc": "Potong pucuk utama saat tanaman setinggi 20 cm agar tumbuh 4-6 cabang samping produktif (cabai jadi rimbun bercabang banyak)." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Hari 45-60 (Fase Berbunga)", "desc": "Semprotkan Kalsium Cuka Cangkang Telur seminggu sekali agar bunga tidak rontok saat terkena hujan atau panas terik." },
      { "title": "Hari 75+ (Masa Panen Raya)", "desc": "Petik buah cabai bersama tangkainya pada pagi hari. Panen rutin akan merangsang keluarnya bunga baru secara terus-menerus hingga umur 1-2 tahun." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Thrips & Kutu Kebul (Daun Keriting)", "symptoms": "Daun mengeriting ke atas, pucuk kerdil, dan warna belang kuning.", "solution": "Semprotkan kombinasi ekstrak bawang putih + cabai rawit + sabun cuci piring 3 hari sekali." },
      { "name": "Patek / Antraknosa (Buah Busuk Kering)", "symptoms": "Bercak melingkar cokelat kehitaman pada buah cabai matang.", "solution": "Petik dan bakar buah yang terinfeksi, kurangi penyiraman di sore hari." }
    ]),
    "pro_tips": json.dumps([
      "Pasang ajir bambu penyangga sejak awal agar tanaman cabai tidak tumbang saat mulai sarat berbuah.",
      "Hindari menyiram daun cabai di malam hari untuk mencegah pertumbuhan spora jamur."
    ])
  },
  {
    "id": "guide-alpukat-aligator",
    "slug": "alpukat-aligator",
    "title": "Panduan Budidaya Alpukat Genjah di Lahan & Pot",
    "category": "Buah-buahan",
    "difficulty": "Sedang",
    "harvest_time": "2.5 - 3.5 Tahun (Bibit Sambung Pucuk)",
    "sunlight_req": "Min. 6 - 8 Jam",
    "optimal_temp": "22°C - 30°C",
    "optimal_elevation": "100 - 900 mdpl",
    "summary": "Alpukat varietas Miki dan Aligator sangat adaptif ditanam di dataran rendah hingga menengah. Daging buah tebal, pulen bebas ulat, dan rajin berbuah sepanjang tahun.",
    "media_recipe": json.dumps({
      "pot_size": "Drum 100 Liter / Tanah Pekarangan Lubang 60x60x60cm",
      "formula": "2 Tanah Humus : 1 Kompos Kandang Matang : 1 Sekam Mentah Lapuk + 1 kg Dolomit",
      "ph_target": "6.0 - 6.5",
      "drainage_note": "Akar alpukat sangat butuh oksigen. Tanah liat padat harus dicampur sekam mentah banyak agar tidak mengunci air."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Tahun 1 (Fokus Batang Utama)", "desc": "Pangkas cabang-cabang liar yang tumbuh di bawah sambungan okulasi (*rootstock*). Pelihara batang utama agar kokoh dan tegak." },
      { "title": "Tahun 2 (Pembentukan Tajuk Payung)", "desc": "Pangkas pucuk pada ketinggian 1.5 meter agar melebar ke samping menyerupai kanopi payung." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Pemupukan Generatif Berkala", "desc": "Berikan pupuk tinggi Kalium dan Fosfor setiap 3 bulan sekali. Taburkan kompos daun pisang di sekeliling piringan pohon." },
      { "title": "Perawatan Saat Bunga Mekar", "desc": "Jaga tanah tetap lembab stabil (tidak terlalu kering dan tidak becek berlebihan) agar bunga tidak rontok." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Ulat Daun Kupu-kupu", "symptoms": "Helaian daun muda berlubang atau habis menyisakan tulang daun.", "solution": "Semprotkan air rebusan tembakau atau petik manual di malam hari." },
      { "name": "Kanker Batang (Phytophthora cinnamomi)", "symptoms": "Batang mengeluarkan getah kecokelatan dan kulit batang mengering.", "solution": "Kerok bagian luka lalu olesi bubur belerang/fungisida tembaga." }
    ]),
    "pro_tips": json.dumps([
      "Tanam minimal 2 pohon alpukat berdekatan untuk membantu penyerbukan silang bunga tipe A dan tipe B agar pembuahan maksimal.",
      "Gunakan varietas Miki untuk daerah dataran rendah/panas (tahan ulat buah)."
    ])
  },
  {
    "id": "guide-stroberi-pot",
    "slug": "stroberi-pot",
    "title": "Budidaya Stroberi Pot di Rumah (Dataran Menengah & Rooftop)",
    "category": "Buah-buahan",
    "difficulty": "Menantang",
    "harvest_time": "60 - 80 Hari",
    "sunlight_req": "4 - 6 Jam Sinar Pagi (Hindari Terik Siang Ekstrem)",
    "optimal_temp": "18°C - 26°C",
    "optimal_elevation": "Min. 400 mdpl (Atau gunakan naungan sejuk)",
    "summary": "Stroberi menyukai suhu sejuk dan media asam-lembab. Di dataran rendah, kuncinya adalah naungan paranet 50%, media cocopeat dingin, dan penyiraman pagi-sore.",
    "media_recipe": json.dumps({
      "pot_size": "Pot Gantung / Polybag 20cm",
      "formula": "2 Cocopeat : 1 Sekam Bakar : 1 Kompos Cacing (Vermikompos)",
      "ph_target": "5.5 - 6.5 (Sedikit Asam)",
      "drainage_note": "Beri mulsa plastik atau jerami di atas media agar buah stroberi tidak menyentuh tanah basah (mencegah buah membusuk)."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Perbanyakan via Sulur (Stolon)", "desc": "Stroberi berkembang biak cepat lewat sulur yang menjulur. Tempelkan sulur ke pot kecil baru hingga keluar akar, lalu potong dari pohon induk." },
      { "title": "Sanitasi Daun Tua", "desc": "Pangkas rutin daun-daun tua di bagian bawah (sisakan 5-7 helai daun produktif per pohon) agar nutrisi fokus ke pembentukan mahkota bunga." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Aplikasi Nutrisi Buah", "desc": "Kocorkan larutan teh kulit pisang dan air cucian beras seminggu sekali." },
      { "title": "Bantu Penyerbukan Manual", "desc": "Kuas lembut bagian tengah bunga kuning stroberi dengan kuas lukis kecil agar buah yang terbentuk bulat sempurna dan tidak cacat bengkok." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Bercak Daun & Busuk Buah (Botrytis)", "symptoms": "Bercak abu-abu berbulu halus pada buah matang yang lembab.", "solution": "Jaga buah tidak basah saat menyiram, beri tatakan sekam kering." },
      { "name": "Tungau Merah (Spider Mites)", "symptoms": "Jaring laba-laba halus di bawah daun, daun tampak kusam berbintik kuning.", "solution": "Semprotkan air bertekanan tinggi di bawah daun atau semprotkan White Oil encer." }
    ]),
    "pro_tips": json.dumps([
      "Pilih varietas Dorit atau Earlibrite jika menanam di dataran rendah berhawa agak hangat.",
      "Gunakan pot gantung untuk menghemat ruang dan menjaga buah tetap bersih menjuntai ke bawah."
    ])
  },
  {
    "id": "guide-pakcoy-sayur",
    "slug": "pakcoy-sayur",
    "title": "Panduan Menanam Pakcoy Organik Cepat Panen (30 Hari)",
    "category": "Sayuran",
    "difficulty": "Sangat Mudah (Cocok Pemula & Anak Sekolah)",
    "harvest_time": "28 - 35 Hari Pasca Semai",
    "sunlight_req": "4 - 6 Jam Sinar Matahari",
    "optimal_temp": "22°C - 30°C",
    "optimal_elevation": "0 - 1200 mdpl",
    "summary": "Pakcoy adalah sayuran daun paling ramah pemula. Tumbuh sangat cepat di pot kecil, wadah bekas botol air mineral, maupun bak styrofoam sederhana.",
    "media_recipe": json.dumps({
      "pot_size": "Pot 15-20cm / Polybag / Botol Bekas",
      "formula": "1 Tanah Subur : 1 Kompos Halus : 1 Arang Sekam",
      "ph_target": "6.0 - 7.0",
      "drainage_note": "Media harus selalu lembab merata tapi tidak menggenang air kotor."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Hari 1-10 (Semaian)", "desc": "Semai benih pakcoy di wadah kecil. Setelah berdaun 3 helai, pilih bibit yang berbatang kokoh dan pindahkan ke pot masing-masing." },
      { "title": "Hari 11-25 (Pertumbuhan Cepat)", "desc": "Siram 2x sehari (pagi dan sore). Berikan kocor air cucian beras fermentasi 3 hari sekali untuk memicu daun hijau tebal dan renyah." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Hari 30 (Panen)", "desc": "Panen pakcoy dengan cara mencabut seluruh perakaran atau memotong pangkal batangnya 1 cm dari permukaan tanah (bisa tumbuh kembali tunas baru mini)." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Ulat Daun & Belalang", "symptoms": "Daun bolong-bolong dimakan serangga.", "solution": "Semprotkan pestisida nabati bawang putih + cabai setiap 4 hari sekali di sore hari." },
      { "name": "Siput / Bekicot Kecil", "symptoms": "Daun muda habis dimakan di malam hari.", "solution": "Taburkan serbuk cangkang telur kasar di sekeliling pot (siput tidak bisa merayap di atas cangkang tajam)." }
    ]),
    "pro_tips": json.dumps([
      "Tanam secara bertahap (misal 3 pot setiap minggu) agar Anda bisa panen sayuran segar setiap pekan tanpa putus!",
      "Letakkan di tempat yang mendapatkan sinar matahari pagi agar batang pakcoy tidak memanjang kurus (*etiolasi*)."
    ])
  },
  {
    "id": "guide-monstera-tanaman-hias",
    "slug": "monstera-tanaman-hias",
    "title": "Perawatan Monstera Deliciosa Daun Pecah & Mengkilap",
    "category": "Tanaman Hias",
    "difficulty": "Mudah",
    "harvest_time": "Tanaman Hias Abadi",
    "sunlight_req": "Terang Tidak Langsung (*Bright Indirect Light*)",
    "optimal_temp": "20°C - 29°C",
    "optimal_elevation": "0 - 1000 mdpl (Indoor & Teras)",
    "summary": "Monstera (Janda Bolong Besar) adalah ratu tanaman hias indoor. Rahasia daun sobek/fenestrasi sempurna adalah intensitas cahaya terang tidak langsung dan tiang rambatan sabut kelapa (turus).",
    "media_recipe": json.dumps({
      "pot_size": "Pot Terakota / Plastik 30-40cm",
      "formula": "30% Kulit Kayu Pinus / Pasir Malang : 30% Cocopeat Cuci : 20% Sekam Bakar : 20% Kompos Daun",
      "ph_target": "5.5 - 6.8",
      "drainage_note": "Wajib menggunakan pot berlubang bawah lancar. Media 'Aroid Mix' ini mencegah busuk batang (*root rot*)."
    }),
    "vegetative_steps": json.dumps([
      { "title": "Pemasangan Turus / Tiang Lumut", "desc": "Tancapkan turus sabut kelapa di belakang batang utama. Ikatkan batang utama ke turus agar akar angin (*aerial root*) menancap ke turus. Ini memicu ukuran daun berikutnya menjadi 2x lebih besar dan pecah sobek alami." },
      { "title": "Pembersihan Daun Rutin", "desc": "Lap permukaan daun dengan kain basah yang diberi beberapa tetes susu segar atau minyak kelapa encer seminggu sekali agar daun mengkilap dan bebas debu (fotosintesis optimal)." }
    ]),
    "generative_steps": json.dumps([
      { "title": "Penyiraman Mengikuti Kelembaban Tanah", "desc": "Siram hanya jika 2 ruas jari (3-5 cm) lapisan atas tanah sudah terasa kering saat disentuh. Jangan biarkan air menggenang di tatakan pot." }
    ]),
    "pests_diseases": json.dumps([
      { "name": "Busuk Daun Cokelat Basah (Overwatering)", "symptoms": "Ujung daun menguning lalu menghitam basah dan lembek.", "solution": "Kurangi frekuensi siram, potong bagian yang busuk, dan ganti media dengan yang lebih poros." },
      { "name": "Kutu Sisik (Scale Insects)", "symptoms": "Bintik cokelat keras menempel di batang dan tangkai daun.", "solution": "Kikis pelan dengan sikat gigi lembut yang dibasahi sabun cuci piring encer." }
    ]),
    "pro_tips": json.dumps([
      "Jangan letakkan Monstera di bawah sinar matahari siang langsung karena daunnya akan terbakar hangus cokelat (*sunburn*).",
      "Arahkan akar angin ke dalam tanah pot untuk menambah serapan nutrisi."
    ])
  }
]

for g in guides:
  c.execute('''
    INSERT INTO plant_guides (
      id, slug, title, category, difficulty, harvest_time, sunlight_req, optimal_temp,
      optimal_elevation, summary, media_recipe, vegetative_steps, generative_steps,
      pests_diseases, pro_tips, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      category=excluded.category,
      difficulty=excluded.difficulty,
      harvest_time=excluded.harvest_time,
      sunlight_req=excluded.sunlight_req,
      optimal_temp=excluded.optimal_temp,
      optimal_elevation=excluded.optimal_elevation,
      summary=excluded.summary,
      media_recipe=excluded.media_recipe,
      vegetative_steps=excluded.vegetative_steps,
      generative_steps=excluded.generative_steps,
      pests_diseases=excluded.pests_diseases,
      pro_tips=excluded.pro_tips,
      updated_at=datetime('now')
  ''', (
    g["id"], g["slug"], g["title"], g["category"], g["difficulty"], g["harvest_time"],
    g["sunlight_req"], g["optimal_temp"], g["optimal_elevation"], g["summary"],
    g["media_recipe"], g["vegetative_steps"], g["generative_steps"],
    g["pests_diseases"], g["pro_tips"]
  ))

conn.commit()
conn.close()
print(f"Successfully seeded {len(guides)} comprehensive plant guides into SQLite.")
