# BrodyAgri Ecosystem (Monorepo)

Monorepo terintegrasi untuk ekosistem pertanian & intelijen pasar komoditas pangan.

## Struktur Aplikasi

Repositori ini dikelola dalam arsitektur **Monorepo (npm workspaces)**:

```text
brodyagri/
├── apps/
│   ├── tanam/      # BrodyAgri: Panduan berkebun, AI dokter tanaman, resep panen, jadwal rawat
│   └── mayur/      # AgriRadar: Pemantau harga komoditas pasar (3 level), prediksi panen AI, bursa petani
├── ecosystem.config.cjs # Konfigurasi deployment PM2 production
└── package.json    # Monorepo workspaces definition
```

---

## 1. BrodyAgri (`apps/tanam`)
- **Domain**: `https://tanam.brody.my.id`
- **Port**: `3001`
- **Fitur Utama**:
  - Panduan Tanam Step-by-Step & Jadwal Rawat Harian
  - AI Diagnosa Kesehatan & Hama Tanaman (Vision AI)
  - Bottom Drawer Resep Masakan Berdasarkan Hasil Panen
  - Formulasi Nutrisi & Pupuk Organik
  - Integrasi Link Langsung ke Pasar Komoditas AgriRadar

---

## 2. AgriRadar (`apps/mayur`)
- **Domain**: `https://mayur.brody.my.id`
- **Port**: `3003`
- **Fitur Utama**:
  - Live Commodity Ticker: 53+ Komoditas pangan & pertanian
  - Multi-Tier Pricing: Petani/Kebun, Grosir/Pasar Induk, Konsumen/Eceran
  - AI Price Forecasting: Prediksi tren harga saat panen tiba
  - Smart Crop Advisor: Rekomendasi tanaman paling bernilai ekonomi tinggi
  - Papan Panen Petani: Pasar langsung petani ke pembeli
  - Integrasi Link Langsung ke Kebunku BrodyAgri

---

## Menjalankan di Lokal / Server

### Install Dependencies
```bash
npm install
```

### Jalankan Development Mode
```bash
# Menjalankan BrodyAgri (tanam)
npm run dev:tanam

# Menjalankan AgriRadar (mayur)
npm run dev:mayur
```

### Build Production
```bash
npm run build:tanam
npm run build:mayur
```

### Deploy PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
```
