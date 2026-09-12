import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const guide = db.prepare('SELECT * FROM plant_guides WHERE slug = ?').get(slug) as any;
    if (!guide) return NextResponse.json({ error: 'Guide not found' }, { status: 404 });

    // Parse JSON string fields safely
    const parsed = {
      ...guide,
      media_recipe: JSON.parse(guide.media_recipe || '{}'),
      vegetative_steps: JSON.parse(guide.vegetative_steps || '[]'),
      generative_steps: JSON.parse(guide.generative_steps || '[]'),
      pests_diseases: JSON.parse(guide.pests_diseases || '[]'),
      pro_tips: JSON.parse(guide.pro_tips || '[]'),
    };

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Guide detail error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
