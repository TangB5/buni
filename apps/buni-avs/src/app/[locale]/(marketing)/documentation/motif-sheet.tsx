'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface MotifData {
  name: string;
  pattern: string;        // css watermark class
  origin: string;
  ethnicGroup: string;
  country: string;
  region: string;
  meaning: string;
  uses: string[];
  symbolism: string;
  history: string;
  variants: { name: string; pattern: string; note: string }[];
  bibliography: { author: string; work: string; year: string }[];
}

const TABS = [
  { id: 'identite',    label: 'Identité' },
  { id: 'symbolique',  label: 'Symbolique' },
  { id: 'histoire',    label: 'Histoire' },
  { id: 'variantes',   label: 'Variantes' },
  { id: 'bibliographie', label: 'Bibliographie' },
] as const;

export function MotifSheet({ motif }: { motif: MotifData }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('identite');

  return (
    <div className="overflow-hidden rounded-2xl border border-avs-accent/9">
      {/* ── Illustration principale ──────────────────────────────────── */}
      <div className="relative h-56 overflow-hidden sm:h-72">
        <div className={`${motif.pattern} absolute inset-0`} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.1) 60%, transparent 100%)' }} />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-avs-primary">{motif.origin}</p>
          <h2 className="font-display mt-1 text-2xl font-black text-avs-secondary sm:text-3xl" style={{ letterSpacing: '-0.02em' }}>
            {motif.name}
          </h2>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto border-b border-avs-accent/9 bg-avs-secondary px-3 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-t-lg px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === t.id ? 'border-b-2 border-avs-primary text-avs-primary' : 'text-avs-accent/40 hover:text-avs-accent/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Panels ───────────────────────────────────────────────────── */}
      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="bg-avs-secondary p-6 sm:p-8">
        {tab === 'identite' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <dl className="space-y-4 text-sm">
              {[
                ['Ethnie', motif.ethnicGroup],
                ['Pays', motif.country],
                ['Région', motif.region],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-avs-accent/32">{k}</dt>
                  <dd className="mt-0.5 text-avs-accent">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-avs-accent/32">Utilisations</p>
              <ul className="mt-2 space-y-1.5">
                {motif.uses.map((u) => (
                  <li key={u} className="flex gap-2 text-sm text-avs-accent/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-avs-primary" aria-hidden />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'symbolique' && (
          <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-avs-accent/60">
            <p><span className="font-semibold text-avs-accent">Signification — </span>{motif.meaning}</p>
            <p><span className="font-semibold text-avs-accent">Symbolique — </span>{motif.symbolism}</p>
          </div>
        )}

        {tab === 'histoire' && (
          <p className="max-w-2xl text-sm leading-relaxed text-avs-accent/60">{motif.history}</p>
        )}

        {tab === 'variantes' && (
          <div className="grid gap-4 sm:grid-cols-3">
            {motif.variants.map((v) => (
              <div key={v.name} className="overflow-hidden rounded-xl border border-avs-accent/9">
                <div className={`${v.pattern} h-20`} />
                <div className="p-3">
                  <p className="text-sm font-bold text-avs-accent">{v.name}</p>
                  <p className="mt-0.5 text-[11px] text-avs-accent/40">{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'bibliographie' && (
          <ol className="space-y-2.5 text-sm text-avs-accent/60">
            {motif.bibliography.map((b) => (
              <li key={`${b.author}-${b.year}`} className="border-l-2 border-avs-accent/10 pl-3">
                {b.author} — <em>{b.work}</em> ({b.year})
              </li>
            ))}
          </ol>
        )}
      </motion.div>
    </div>
  );
}