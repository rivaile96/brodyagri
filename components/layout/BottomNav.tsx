'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sprout, Plus, BookOpen, FlaskConical, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/today', label: 'Beranda', icon: Home },
  { href: '/plants', label: 'Kebunku', icon: Sprout },
  { href: '/wizard', label: 'Tanam', icon: Plus, special: true },
  { href: '/recipes', label: 'Formulasi', icon: FlaskConical },
  { href: '/guide', label: 'Kamus', icon: BookOpen },
  { href: '/doctor', label: 'Dokter AI', icon: Stethoscope },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe px-2 pb-3">
      <nav className="pointer-events-auto max-w-lg mx-auto bg-[#14231b]/95 backdrop-blur-2xl border border-emerald-800/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] rounded-full px-2 py-1.5 flex items-center justify-around gap-1">
        {navItems.map(({ href, label, icon: Icon, special }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          if (special) {
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center justify-center p-0.5 shrink-0"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-300/30"
                >
                  <Icon className="w-5 h-5 stroke-[2.8]" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-full group min-w-[48px]"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative',
                  isActive ? 'text-emerald-300 font-bold' : 'text-emerald-100/50 hover:text-emerald-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-emerald-500/20 rounded-full border border-emerald-400/30 shadow-inner"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 relative z-10", isActive ? "stroke-[2.4]" : "stroke-[1.8]")} />
              </motion.div>
              <span
                className={cn(
                  'text-[8.5px] tracking-tight mt-0.5 transition-colors leading-none font-medium truncate max-w-[52px]',
                  isActive ? 'text-emerald-300 font-bold' : 'text-emerald-100/50 group-hover:text-emerald-200'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
