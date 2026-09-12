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

# 1. /doctor/page.tsx
doctor_replacements = [
    ('text-white tracking-tight', 'tracking-tight" style={{ color: "var(--text-main)" }}'),
    ('text-2xl font-black text-white', 'text-2xl font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs text-emerald-200/70 leading-relaxed', 'text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('bg-emerald-900/60 border border-emerald-700/40 text-emerald-300', 'border" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-4 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-4 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl p-4 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner',
     'w-full border rounded-2xl p-4 text-xs focus:outline-none focus:border-emerald-500 shadow-sm" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card)", color: "var(--text-main)" }} placeholder="Tuliskan gejala yang terlihat pada tanaman..."'),
    ('bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300',
     'border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)", color: "var(--text-main)" }}'),
    ('p-4 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('text-white text-xs', 'text-xs" style={{ color: "var(--text-main)" }}'),
    ('text-white font-bold', 'font-bold" style={{ color: "var(--text-main)" }}'),
    ('text-white font-black', 'font-black" style={{ color: "var(--text-main)" }}'),
    ('text-emerald-100/90', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-100/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/70', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('border-emerald-900/80', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/60', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/doctor/page.tsx', doctor_replacements)

# 2. /guide/page.tsx
guide_replacements = [
    ('text-white tracking-tight', 'tracking-tight" style={{ color: "var(--text-main)" }}'),
    ('text-2xl font-black text-white', 'text-2xl font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs text-emerald-200/70 leading-relaxed', 'text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('bg-emerald-900/60 border border-emerald-700/40 text-emerald-300', 'border" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner',
     'w-full border rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)", color: "var(--text-main)" }} placeholder="Cari tanaman (contoh: Anggur, Mangga, Cabai, Monstera...)"'),
    ('bg-[#14231b]/80 border border-emerald-800/40 text-emerald-300/70 hover:text-white',
     'border hover:border-emerald-500/50" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)", color: "var(--text-dim)" }}'),
    ('p-5 rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 hover:border-emerald-500/60 transition-all space-y-3 shadow-md backdrop-blur-md group',
     'p-5 rounded-3xl border transition-all space-y-3 shadow-sm backdrop-blur-md group" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-base font-black text-white group-hover:text-emerald-300 transition-colors',
     'text-base font-black transition-colors" style={{ color: "var(--text-main)" }}'),
    ('text-white font-bold', 'font-bold" style={{ color: "var(--text-main)" }}'),
    ('text-emerald-100/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('border-emerald-900/80', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/60', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('bg-[#14231b]/60 border border-emerald-800/40 p-8 text-center space-y-3 backdrop-blur-md',
     'rounded-3xl border p-8 text-center space-y-3 backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/guide/page.tsx', guide_replacements)

# 3. /guide/[slug]/page.tsx
guide_detail_replacements = [
    ('rounded-3xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-700/40 p-6 space-y-4 backdrop-blur-md shadow-lg',
     'rounded-3xl border p-6 space-y-4 backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-xl font-black text-white tracking-tight leading-snug',
     'text-xl font-black tracking-tight leading-snug" style={{ color: "var(--text-main)" }}'),
    ('text-xs text-emerald-100/90 leading-relaxed',
     'text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('bg-[#0c1410]/70 p-3 rounded-2xl border border-emerald-900/60',
     'p-3 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('strong className="text-white text-[11px] block"',
     'strong className="text-[11px] block font-bold" style={{ color: "var(--text-main)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-4 shadow-md',
     'rounded-3xl border p-5 space-y-4 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3 shadow-md',
     'rounded-3xl border p-5 space-y-3 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-sm font-black text-white uppercase tracking-wider',
     'text-sm font-black uppercase tracking-wider" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-black text-white',
     'text-xs font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-bold text-white',
     'text-xs font-bold" style={{ color: "var(--text-main)" }}'),
    ('p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60 text-xs',
     'p-3 rounded-2xl border text-xs" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-4 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3.5 rounded-2xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100 leading-relaxed',
     'p-3.5 rounded-2xl border text-xs leading-relaxed" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('p-3 rounded-xl bg-gradient-to-br from-[#183124] to-[#13281d] border border-emerald-600/40 text-xs text-emerald-100',
     'p-3 rounded-xl border text-xs leading-relaxed" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}'),
    ('strong className="text-white"',
     'strong style={{ color: "var(--text-main)" }}'),
    ('strong className="text-white leading-relaxed block"',
     'strong className="leading-relaxed block font-bold" style={{ color: "var(--text-main)" }}'),
    ('text-emerald-100/90', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/80', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('bg-[#14231b]/90 border border-emerald-800/40 p-1.5 rounded-3xl backdrop-blur-md shadow-md',
     'border p-1.5 rounded-3xl backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('bg-[#14231b]/80 border border-emerald-800/40 flex items-center justify-between',
     'border p-4 rounded-3xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/guide/[slug]/page.tsx', guide_detail_replacements)

# 4. /plants/[id]/page.tsx
plant_detail_replacements = [
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-4 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-4 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 p-5 space-y-3 backdrop-blur-md shadow-md',
     'rounded-3xl border p-5 space-y-3 backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 p-5 space-y-4 backdrop-blur-md shadow-md',
     'rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-base font-black text-white', 'text-base font-black" style={{ color: "var(--text-main)" }}'),
    ('text-sm font-black text-white', 'text-sm font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-black text-white', 'text-xs font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-bold text-white', 'text-xs font-bold" style={{ color: "var(--text-main)" }}'),
    ('text-white font-mono', 'font-mono" style={{ color: "var(--text-main)" }}'),
    ('p-4 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3.5 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-2.5 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-2.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('text-emerald-100/90', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/70', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('border-emerald-900/80', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/60', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/plants/[id]/page.tsx', plant_detail_replacements)

# 5. /wizard/page.tsx
wizard_replacements = [
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-4 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-4 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/90 border border-emerald-800/40 p-5 space-y-3.5 shadow-md backdrop-blur-md',
     'rounded-3xl border p-5 space-y-3.5 shadow-sm backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('rounded-3xl bg-[#14231b]/80 border border-emerald-800/40 p-5 space-y-4 backdrop-blur-md shadow-md',
     'rounded-3xl border p-5 space-y-4 backdrop-blur-md shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('text-2xl font-black text-white', 'text-2xl font-black" style={{ color: "var(--text-main)" }}'),
    ('text-base font-black text-white', 'text-base font-black" style={{ color: "var(--text-main)" }}'),
    ('text-sm font-black text-white', 'text-sm font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-black text-white', 'text-xs font-black" style={{ color: "var(--text-main)" }}'),
    ('text-xs font-bold text-white', 'text-xs font-bold" style={{ color: "var(--text-main)" }}'),
    ('p-3 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-3.5 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('p-4 rounded-2xl bg-[#0c1410] border border-emerald-900/60',
     'p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card-subtle)" }}'),
    ('w-full bg-[#14231b] border border-emerald-800/60 rounded-2xl px-4 py-3 text-xs text-white placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 shadow-inner',
     'w-full border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 shadow-sm" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card)", color: "var(--text-main)" }}'),
    ('text-emerald-100/90', 'leading-relaxed" style={{ color: "var(--text-muted)" }}'),
    ('text-emerald-200/70', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('text-emerald-200/60', 'leading-relaxed" style={{ color: "var(--text-dim)" }}'),
    ('border-emerald-900/80', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
    ('border-emerald-900/60', 'border" style={{ borderColor: "var(--border-card-subtle)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/wizard/page.tsx', wizard_replacements)

# 6. /auth/login/page.tsx & /auth/register/page.tsx
auth_replacements = [
    ('min-h-screen bg-[#0c1410] text-emerald-50', 'min-h-screen transition-colors duration-200" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}'),
    ('bg-[#14231b]/90 border border-emerald-800/40 p-6 rounded-3xl shadow-xl space-y-4 backdrop-blur-md',
     'border p-6 rounded-3xl shadow-sm space-y-4 backdrop-blur-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}'),
    ('w-full bg-[#0c1410] border border-emerald-900/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-emerald-800/70 focus:outline-none focus:border-emerald-500',
     'w-full border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 shadow-sm" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-card)", color: "var(--text-main)" }}'),
    ('text-2xl font-black text-white tracking-tight', 'text-2xl font-black tracking-tight" style={{ color: "var(--text-main)" }}'),
    ('text-xs text-emerald-200/70', 'text-xs" style={{ color: "var(--text-dim)" }}'),
]
update_file('/opt/brody-workspace/brodyagri/app/auth/login/page.tsx', auth_replacements)
update_file('/opt/brody-workspace/brodyagri/app/auth/register/page.tsx', auth_replacements)

print("All A-Z pages successfully processed.")
