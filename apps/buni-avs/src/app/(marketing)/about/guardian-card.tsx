'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface GuardianCardProps {
  name:       string;
  role:       string;
  origin:     string;
  expertise:  string;   // e.g. "Textiles ouest-africains"
  quote:      string;   // short first-person citation
  motifName:  string;   // human label of the associated motif, e.g. "Wax Dakar"
  pattern:    string;   // css class for the pattern watermark
  index:      number;
}

export function GuardianCard({ name, role, origin, expertise, quote, motifName, pattern, index }: GuardianCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="guardian-card group relative flex flex-col overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-1 hover:border-avs-primary/25 hover:shadow-avs-md"
    >
      {/* ── Motif panel — front face ─────────────────────────────────────── */}
      <div className="relative h-36 overflow-hidden">
        <div className={`${pattern} guardian-pattern absolute inset-0 transition-transform duration-700 group-hover:scale-110`} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--avs-secondary) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)' }}
          aria-hidden
        />
        <span className="absolute bottom-3 right-3 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-avs-secondary/70">
          {motifName}
        </span>
        <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-avs-secondary/25">
          <div className={`${pattern} absolute inset-0`} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="font-display text-sm font-black text-avs-secondary drop-shadow">{name.charAt(0)}</span>
          </div>
        </div>
      </div>

      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <div className="p-5 pt-3.5">
        <p className="font-display text-[15px] font-bold leading-tight text-avs-accent" style={{ letterSpacing: '-0.01em' }}>
          {name}
        </p>
        <p className="mt-1 text-[11px] font-semibold leading-snug text-avs-primary">{role}</p>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-avs-accent/40">
          <span>{origin}</span>
          <span aria-hidden>·</span>
          <span>{expertise}</span>
        </div>

        {/* ── Citation — revealed on hover, always present for a11y ──────── */}
        <div className="mt-4 flex gap-2 border-t border-avs-accent/8 pt-4">
          <Quote size={13} className="mt-0.5 shrink-0 text-avs-primary/50" aria-hidden />
          <p className="text-[12px] italic leading-relaxed text-avs-accent/50">{quote}</p>
        </div>
      </div>
    </motion.div>
  );
}