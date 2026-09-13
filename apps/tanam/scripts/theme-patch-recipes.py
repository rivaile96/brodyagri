import re

def update_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    for old, new in replacements:
        content = content.replace(old, new)
        
    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {path}")
    else:
        print(f"No changes in: {path}")

# Common text and card replacements across all pages
# 1. /recipes/page.tsx
recipes_replacements = [
    ('text-white tracking-tight', 'tracking-tight" style={{ color: "var(--text-main)" }}'),
    ('text-2xl font-black text-white', 'text-2xl font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs text-emerald-200/70 leading-relaxed', 'text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('bg-emerald-900/60 border border-emerald-700/40 text-emerald-300', 'border" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner',
     'w-full border rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)", color: "var(--text-main)" }} placeholder="Cari resep (cth: Kalsium, Bawang, Rooftop, Anggur, Kutu Putih...)"'),
    ('bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white',
     'border hover:border-emerald-500/50" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)", color: "var(--text-dim)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-4 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-4 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-3.5 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-base font-black text-white group-hover:text-emerald-300 transition-colors',
     'text-base font-black transition-colors" style={{ color: "var(--text-main)" }}'),
    ('p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3.5 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3.5 rounded-2xl bg-[#0c1410]/90 border border-emerald-900/60',
     'p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-4 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100',
     'p-3.5 rounded-2xl border text-xs leading-relaxed" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('p-3.5 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100',
     'p-3.5 rounded-2xl border text-xs leading-relaxed" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('p-4 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100',
     'p-4 rounded-2xl border text-xs leading-relaxed" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('text-white text-xs', 'text-xs" style={{ color: "var(--text-main)" }}'),
    ('text-white font-bold', 'font-bold" style={{ color: "var(--text-main)" }}'),
    ('text-white font-black', 'font-black" style={{ color: "var(--text-main)" }}'),
    ('text-emerald-100/90', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-100/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('border-emerald-900/80', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/60', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/40', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('bg-[#0c1410] border border-emerald-800 text-emerald-300 font-bold',
     'border font-bold" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card)", color: "var(--text-main)" }}'),
]

update_file('/opt/brody-workspace/brodyagri/app/recipes/page.tsx', recipes_replacements)
print("Recipes updated.")
