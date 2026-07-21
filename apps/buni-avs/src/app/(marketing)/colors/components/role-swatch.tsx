'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Combo, ComboColor } from '../data';
import { isLightColor } from '../utils';
import { ColorInfoPanel } from './color-info-panel';

export function RoleSwatch({ color, index, combo }: { color: ComboColor; index: number; combo: Combo }) {
  const [copied, setCopied] = useState<'hex' | 'css' | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const copy = useCallback(async (text: string, type: 'hex' | 'css') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  const light = isLightColor(color.hex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color.hex}22`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <button
        className="relative h-24 w-full cursor-pointer overflow-hidden"
        style={{ background: color.hex }}
        onClick={() => void copy(color.hex, 'hex')}
        aria-label={`Copier ${color.hex}`}
      >
        <span className="absolute left-2.5 top-2.5 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-black uppercase tracking-wider"
          style={{ background: light ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.16)', color: light ? '#000' : '#fff' }}>
          {color.role}
        </span>
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={copied === 'hex' ? 'done' : 'copy'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-avs-secondary backdrop-blur-sm"
              style={{ background: light ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.18)' }}
            >
              {copied === 'hex' ? <Check size={11} /> : <Copy size={11} />}
              {copied === 'hex' ? 'Copié !' : color.hex}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>

      <div className="p-3.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] font-bold text-avs-accent">{color.name}</p>
          <button
            onClick={() => void copy(`var(${color.css})`, 'css')}
            className={`flex items-center gap-1 font-mono text-[9px] transition-colors ${copied === 'css' ? 'text-emerald-500' : 'text-avs-accent/35'}`}
            title={`Copier var(${color.css})`}
          >
            {copied === 'css' && <Check size={9} />}
            {color.css}
          </button>
        </div>
        <p className="text-[11px] leading-snug text-avs-accent/55">{color.meaning}</p>
        <p className="mt-1 text-[9px] italic text-avs-accent/35">Source : {color.origin}</p>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="mt-2 w-full rounded-md px-2 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wide transition-colors text-avs-accent/40 hover:bg-avs-accent/5 hover:text-avs-accent"
        >
          {showInfo ? 'Masquer infos' : 'Voir détails (HSL, contraste)'}
        </button>
        
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-2 overflow-hidden"
            >
              <ColorInfoPanel color={color} combo={combo} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
