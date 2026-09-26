import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');

  if (!latStr || !lonStr) {
    return NextResponse.json({ error: 'Parameter lat dan lon wajib diisi' }, { status: 400 });
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);

  return fetchPreciseClimateData(latitude, longitude, searchParams.get('name') ?? undefined);
}

export async function POST(req: NextRequest) {
  const { latitude, longitude, name } = await req.json();

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Koordinat wajib diisi' }, { status: 400 });
  }

  return fetchPreciseClimateData(latitude, longitude, name);
}

async function fetchPreciseClimateData(latitude: number, longitude: number, name?: string) {
  try {
    let locationName = name ?? 'Lokasi Kebun';
    let city = '';
    let district = '';

    // 1. Reverse geocoding via OpenStreetMap (Nominatim)
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        { headers: { 'User-Agent': 'BrodyAgri/1.0' } }
      );
      const geoData = await geoRes.json();
      if (geoData?.address) {
        const addr = geoData.address;
        const road = addr.road ?? '';
        const village = addr.village ?? addr.suburb ?? addr.neighbourhood ?? '';
        city = addr.city ?? addr.town ?? addr.county ?? addr.regency ?? '';
        district = village;
        const parts = [road, village, city].filter(Boolean);
        if (parts.length) locationName = parts.join(', ');
        else if (geoData.display_name) locationName = geoData.display_name.split(',').slice(0, 3).join(',');
      }
    } catch {
      locationName = `Koordinat (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
    }

    // 2. Fetch Real-time Current Weather & Elevation from Open-Meteo Forecast
    let current_temp_c = 28;
    let current_weather = 'Cerah Berawan';
    let current_humidity = 70;
    let elevation_m = 25;
    let wind_speed_kmh = 8;

    try {
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      if (forecastData?.current) {
        current_temp_c = Math.round(forecastData.current.temperature_2m * 10) / 10;
        current_humidity = Math.round(forecastData.current.relative_humidity_2m);
        wind_speed_kmh = Math.round(forecastData.current.wind_speed_10m * 10) / 10;
        elevation_m = Math.round(forecastData.elevation ?? 25);

        const wcode = forecastData.current.weather_code ?? 0;
        if (wcode === 0) current_weather = 'Cerah';
        else if (wcode <= 3) current_weather = 'Sebagian Berawan';
        else if (wcode <= 67) current_weather = 'Hujan Ringan/Sedang';
        else current_weather = 'Mendung / Berawan Tebal';
      }
    } catch (e) {
      console.error('Forecast fetch fallback:', e);
    }

    // 3. Fetch 3-Year Historical Archive (Open-Meteo Archive API)
    // Periode 3 tahun ke belakang
    const endYear = new Date().getFullYear() - 1;
    const startYear = endYear - 2;
    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;

    let avg_temp_c = current_temp_c;
    let avg_humidity_pct = current_humidity;
    let annual_rainfall_mm = 2100;
    let dry_months_count = 3;
    let sunshine_hours_day = 6.8;

    try {
      const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,sunshine_duration,wind_speed_10m_mean&timezone=auto`;
      const archiveRes = await fetch(archiveUrl);
      const archiveData = await archiveRes.json();

      if (archiveData?.daily) {
        const temps: number[] = archiveData.daily.temperature_2m_mean?.filter((v: number) => v != null) ?? [];
        const humidities: number[] = archiveData.daily.relative_humidity_2m_mean?.filter((v: number) => v != null) ?? [];
        const rainfalls: number[] = archiveData.daily.precipitation_sum?.filter((v: number) => v != null) ?? [];
        const sunshines: number[] = archiveData.daily.sunshine_duration?.filter((v: number) => v != null) ?? [];
        const winds: number[] = archiveData.daily.wind_speed_10m_mean?.filter((v: number) => v != null) ?? [];

        if (temps.length) {
          avg_temp_c = Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10;
        }
        if (humidities.length) {
          avg_humidity_pct = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
        }
        if (rainfalls.length) {
          // Total hujan selama 3 tahun dibagi 3 untuk rata-rata tahunan
          const totalRain = rainfalls.reduce((a, b) => a + b, 0);
          annual_rainfall_mm = Math.round(totalRain / 3);

          // Hitung bulan kering (<60mm per bulan menurut klasifikasi Schmidt-Ferguson)
          // Estimasi dari proporsi hari hujan rendah
          const dryDaysPerYear = rainfalls.filter(r => r < 1.0).length / 3;
          dry_months_count = Math.max(1, Math.min(6, Math.round((dryDaysPerYear / 365) * 12 * 0.4)));
        }
        if (sunshines.length) {
          // Detik sunshine duration ke jam harian
          const avgSec = sunshines.reduce((a, b) => a + b, 0) / sunshines.length;
          sunshine_hours_day = Math.round((avgSec / 3600) * 10) / 10;
        }
        if (winds.length) {
          wind_speed_kmh = Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 10) / 10;
        }
      }
    } catch (e) {
      console.error('Archive fetch fallback:', e);
    }

    // 4. Tentukan Zona Agroklimat Wilayah
    let climate_zone = 'Tropis Dataran Rendah';
    if (elevation_m > 800) climate_zone = 'Tropis Dataran Tinggi (Sejuk)';
    else if (elevation_m > 400) climate_zone = 'Tropis Dataran Menengah';

    if (annual_rainfall_mm > 2500) climate_zone += ' — Sangat Basah';
    else if (annual_rainfall_mm < 1500) climate_zone += ' — Kering/Semi-Arid';
    else climate_zone += ' — Moderat Humid';

    return NextResponse.json({
      location_name: locationName,
      location: {
        name: locationName,
        city,
        district,
        latitude: Math.round(latitude * 10000) / 10000,
        longitude: Math.round(longitude * 10000) / 10000,
      },
      climate: {
        avg_temp_c,
        current_temp_c,
        current_weather,
        avg_humidity_pct,
        annual_rainfall_mm,
        dry_months_count,
        sunshine_hours_day,
        avg_wind_speed_kmh: wind_speed_kmh,
        elevation_m,
        climate_zone,
        historical_years: `${startYear} - ${endYear}`,
      },
    });
  } catch (err: any) {
    console.error('Climate API error:', err);
    return NextResponse.json({ error: 'Gagal memproses audit iklim wilayah' }, { status: 500 });
  }
}