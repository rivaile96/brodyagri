'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'rose' | 'blue';
  children: React.ReactNode;
}

export default function BottomDrawer({
  isOpen,
  onClose,
  title,
  badge,
  badgeColor = 'emerald',
  children
}: BottomDrawerProps) {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const badgeClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }[badgeColor];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-[32px] border-t border-x overflow-hidden shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-main)',
            }}
          >
            {/* Grab handle for mobile touch feel */}
            <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 rounded-full bg-zinc-500/30" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b flex items-center justify-between gap-3 shrink-0" style={{ borderColor: 'var(--border-card-subtle)' }}>
              <div className="min-w-0">
                {badge && (
                  <span className={`inline-block text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border mb-1 ${badgeClasses}`}>
                    {badge}
                  </span>
                )}
                <h3 className="text-base font-black truncate" style={{ color: 'var(--text-main)' }}>
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-card-subtle)',
                  color: 'var(--text-dim)',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 pb-24 scrollbar-hidden">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
