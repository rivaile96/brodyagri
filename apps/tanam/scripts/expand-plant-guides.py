import sqlite3
import json
import requests
import os
import sys

# Target daftar spesies yang akan terus di-generate dan diperkaya otomatis
CANDIDATE_PLANTS = [
  {"name": "Tomat Ceri (Cherry Tomato)", "category": "Sayuran", "slug": "tomat-ceri"},
  {"name": "Melon Madu Polybag (Golden Melon)", "category": "Buah-buahan", "slug": "melon-madu-polybag"},
  {"name": "Jahe Merah Media Karung", "category": "Rempah & Herbal", "slug": "jahe-merah-karung"},
  {"name": "Jeruk Nipis & Lemon Tabulampot", "category": "Buah-buahan", "slug": "jeruk-nipis-lemon"},
  {"name": "Kangkung Cabut & Hidroponik Sederhana", "category": "Sayuran", "slug": "kangkung-rumahan"},
  {"name": "Kelengkeng New Kristal Tabulampot", "category": "Buah-buahan", "slug": "kelengkeng-tabulampot"},
  {"name": "Kunyit & Temulawak Dapur", "category": "Rempah & Herbal", "slug": "kunyit-temulawak"},
  {"name": "Aglaonema Daun Merah Mengkilap", "category": "Tanaman Hias", "slug": "aglaonema-merah"},
  {"name": "Semangka Inul Lahan Terbuka & Pot", "category": "Buah-buahan", "slug": "semangka-inul"},
  {"name": "Bawang Merah dari Biji & Umbi Polybag", "category": "Sayuran", "slug": "bawang-merah-polybag"},
  {"name": "Terong Ungu Bulat & Panjang", "category": "Sayuran", "slug": "terong-ungu"},
  {"name": "Jambu Kristal Tanpa Biji Tabulampot", "category": "Buah-buahan", "slug": "jambu-kristal-tabulampot"},
  {"name": "Kemangi & Daun Mint Segar", "category": "Rempah & Herbal", "slug": "kemangi-mint"}
]

DB_PATH = '/opt/brody-workspace/brodyagri/data/brodyagri.db'

def get_db():
    return sqlite3.connect(DB_PATH)

def get_existing_slugs():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT slug FROM plant_guides')
    rows = [r[0] for r in c.fetchall()]
    conn.close()
    return set(rows)

def load_ai_credentials():
    try:
        with open('/home/brody/.openclaw/openclaw.json') as f:
            cfg = json.load(f)
        api_key = cfg.get('models', {}).get('providers', {}).get('custom-openagentic-id', {}).get('apiKey')
        base_url = cfg.get('models', {}).get('providers', {}).get('custom-openagentic-id', {}).get('baseUrl', 'https://openagentic.id/api/v1')
        return api_key, base_url
    except Exception as e:
        print('Error reading openclaw config:', e)
        return None, None

def generate_guide_with_ai(plant_info, api_key, base_url):
    prompt = f"""Kamu adalah Pakar Botani, Agronom, dan Praktisi Urban Farming Rumahan.
Buatkan panduan budidaya yang SANGAT LENGKAP, PRAKTIS, dan TERPERINCI untuk spesies berikut:

Spesies: {plant_info['name']}
Kategori: {plant_info['category']}
Slug: {plant_info['slug']}

Format respon WAJIB JSON murni tanpa markdown pembungkus dengan struktur:
{{
  "id": "guide-{plant_info['slug']}",
  "slug": "{plant_info['slug']}",
  "title": "Panduan Lengkap Budidaya {plant_info['name']}",
  "category": "{plant_info['category']}",
  "difficulty": "Mudah / Sedang / Menantang",
  "harvest_time": "Durasi perkiraan panen",
  "sunlight_req": "Kebutuhan sinar matahari jam/hari",
  "optimal_temp": "Rentang suhu ideal",
  "optimal_elevation": "Rentang elevasi ideal mdpl",
  "summary": "Ringkasan 2-3 kalimat mengapa tanaman ini menarik dan apa kunci suksesnya",
  "media_recipe": {{
    "pot_size": "Rekomendasi ukuran wadah pot/polybag",
    "formula": "Rumus takaran rasio media",
    "ph_target": "Target pH tanah",
    "drainage_note": "Catatan sirkulasi air dan drainase"
  }},
  "vegetative_steps": [
    {{ "title": "Tahap 1", "desc": "Penjelasan langkah detil" }},
    {{ "title": "Tahap 2", "desc": "Penjelasan langkah detil" }}
  ],
  "generative_steps": [
    {{ "title": "Tahap Pembuahan 1", "desc": "Trik dan nutrisi pemicu panen/bunga" }},
    {{ "title": "Tahap Pembuahan 2", "desc": "Penjelasan langkah detil" }}
  ],
  "pests_diseases": [
    {{ "name": "Nama Hama 1", "symptoms": "Gejala", "solution": "Solusi organik" }},
    {{ "name": "Nama Hama 2", "symptoms": "Gejala", "solution": "Solusi organik" }}
  ],
  "pro_tips": [
    "Trik rahasia 1",
    "Trik rahasia 2"
  ]
}}"""

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'gemini-3.8-flash-high',
        'messages': [
            {'role': 'system', 'content': 'Kamu adalah AI Botanis Ahli yang mengeluarkan format JSON murni.'},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.2
    }

    res = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload, timeout=60)
    if not res.ok:
        raise Exception(f"AI API error: {res.status_code} {res.text}")

    data = res.json()
    raw = data['choices'][0]['message']['content']
    clean = raw.replace('```json', '').replace('```', '').trim() if hasattr(raw, 'trim') else raw.replace('```json', '').replace('```', '').strip()
    return json.loads(clean)

def save_guide_to_db(g):
    conn = get_db()
    c = conn.cursor()
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
      json.dumps(g["media_recipe"]) if isinstance(g["media_recipe"], (dict, list)) else g["media_recipe"],
      json.dumps(g["vegetative_steps"]) if isinstance(g["vegetative_steps"], (dict, list)) else g["vegetative_steps"],
      json.dumps(g["generative_steps"]) if isinstance(g["generative_steps"], (dict, list)) else g["generative_steps"],
      json.dumps(g["pests_diseases"]) if isinstance(g["pests_diseases"], (dict, list)) else g["pests_diseases"],
      json.dumps(g["pro_tips"]) if isinstance(g["pro_tips"], (dict, list)) else g["pro_tips"]
    ))
    conn.commit()
    conn.close()

def run_expansion(limit=2):
    existing = get_existing_slugs()
    candidates = [p for p in CANDIDATE_PLANTS if p['slug'] not in existing]

    if not candidates:
        print("Semua kandidat panduan tanaman sudah terisi lengkap.")
        return

    api_key, base_url = load_ai_credentials()
    if not api_key:
        print("No AI API Key available for guide expansion.")
        return

    processed = 0
    for target in candidates:
        if processed >= limit:
            break
        print(f"Generating guide for: {target['name']}...")
        try:
            guide_data = generate_guide_with_ai(target, api_key, base_url)
            save_guide_to_db(guide_data)
            print(f"Successfully generated and saved: {target['name']}")
            processed += 1
        except Exception as e:
            print(f"Failed to generate {target['name']}: {e}")

if __name__ == '__main__':
    run_expansion(limit=3)
