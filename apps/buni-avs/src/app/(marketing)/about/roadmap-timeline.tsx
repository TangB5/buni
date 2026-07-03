'use client';

import { motion } from 'framer-motion';

export interface RoadmapPhase {
  phase: string;
  period: string;
  status: 'done' | 'now' | 'planned';
  title: string;
  objective: string;
  metric?: string;
  deliverables: readonly string[];
}

export function RoadmapTimeline({ phases }: { phases: readonly RoadmapPhase[] }) {
  return (
    <>
      {/* — Barre de progression globale — */}
      <div className="mx-auto mb-16 flex max-w-md items-center gap-1.5" aria-hidden>
        {phases.map(({ phase, status }) => (
          <div
            key={phase}
            className={`h-1 flex-1 rounded-full ${
              status === 'done' ? 'bg-avs-primary' : status === 'now' ? 'bg-avs-primary/60' : 'bg-avs-secondary/12'
            }`}
          />
        ))}
      </div>

      <ol className="relative space-y-8" aria-label="Phases de la feuille de route AVS">
        {phases.map(({ phase, period, status, title, objective, metric, deliverables }, i) => (
          <motion.li
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid gap-5 sm:grid-cols-[88px_1fr]"
          >
            {/* Rail — numéro de phase + connecteur */}
            <div className="flex sm:flex-col sm:items-center">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-black ${
                  status === 'now'
                    ? 'border-avs-primary bg-avs-primary text-avs-secondary shadow-[0_0_0_4px_rgba(192,87,62,0.20)]'
                    : status === 'done'
                    ? 'border-avs-primary/60 bg-avs-primary/10 text-avs-primary'
                    : 'border-dashed border-avs-primary/35 text-avs-primary/50'
                }`}
              >
                {phase}
              </div>
              {i < phases.length - 1 && (
                <div
                  className={`mt-2 hidden w-px flex-1 sm:block ${status === 'done' ? 'bg-avs-primary/30' : 'bg-avs-primary/12'}`}
                  aria-hidden
                />
              )}
            </div>

            {/* Carte de contenu */}
            <div
              className={`rounded-2xl border p-6 sm:p-7 ${
                status === 'now' ? 'border-avs-primary/35 bg-avs-primary/[.07]' : 'border-avs-secondary/10 bg-avs-secondary/[.03]'
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <time className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-avs-primary">{period}</time>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
                    status === 'now'
                      ? 'bg-avs-primary text-avs-secondary'
                      : status === 'done'
                      ? 'border border-avs-primary/30 text-avs-primary/80'
                      : 'border border-avs-secondary/15 text-avs-secondary/40'
                  }`}
                >
                  {status === 'now' ? "En cours · Aujourd'hui" : status === 'done' ? 'Terminé' : 'Prévu'}
                </span>
                {metric && <span className="font-mono text-[10px] tracking-wide text-avs-secondary/40">{metric}</span>}
              </div>

              <h3 className="mt-3 font-display text-xl font-black text-avs-secondary">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-avs-secondary/60">{objective}</p>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {deliverables.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-snug text-avs-secondary/55">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${status === 'planned' ? 'bg-avs-secondary/25' : 'bg-avs-primary'}`}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </>
  );
}