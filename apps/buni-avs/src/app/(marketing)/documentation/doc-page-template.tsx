'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { useActiveHeading } from './doc-primitives';


export interface DocTocEntry { id: string; label: string; level: 1 | 2 | 3 }

export interface DocNavLink { href: string; title: string }

interface DocPageTemplateProps {
  space: { label: string; color: string; icon: string };
  title: string;
  summary: string;                 // Résumé — 1-2 phrases
  why?: React.ReactNode;           // Pourquoi ce sujet est important
  explanation: React.ReactNode;    // Explication détaillée (avs-prose)
  interactive?: React.ReactNode;   // Exemples interactifs / playground
  useCases?: React.ReactNode;      // Cas d'utilisation
  bestPractices?: React.ReactNode; // Bonnes pratiques
  pitfalls?: React.ReactNode;      // Erreurs fréquentes
  culturalRefs?: React.ReactNode;  // Références culturelles
  downloads?: { label: string; href: string; format: string }[];
  toc?: DocTocEntry[];
  prev?: DocNavLink;
  next?: DocNavLink;
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

function Block({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <motion.section {...reveal} id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-avs-accent/9 py-10 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="font-display mb-4 text-xl font-bold text-avs-accent" style={{ letterSpacing: '-0.01em' }}>
        {heading}
      </h2>
      <div className="avs-prose">{children}</div>
    </motion.section>
  );
}

export function DocPageTemplate({
  space, title, summary, why, explanation, interactive, useCases, bestPractices, pitfalls, culturalRefs, downloads, toc = [], prev, next,
}: DocPageTemplateProps) {
  const activeHeading = useActiveHeading(toc);

  return (
    <div className="flex gap-0">
      <article className="min-w-0 flex-1 px-6 py-10 lg:px-12">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: `${space.color}14`, color: space.color }}>
              <i className={`pi pi-${space.icon}`} style={{ fontSize: '11px' }} />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: space.color }}>
              {space.label}
            </span>
          </div>
          <h1 className="font-display font-black leading-tight text-avs-accent" style={{ fontSize: 'clamp(1.75rem,3.4vw,2.75rem)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
        </motion.div>

        {/* ── Résumé ───────────────────────────────────────────────────── */}
        <motion.p {...reveal} className="mt-5 max-w-2xl text-[15px] leading-relaxed text-avs-accent/55">
          {summary}
        </motion.p>

        {why && <Block id="pourquoi" heading="Pourquoi ce sujet est important">{why}</Block>}
        <Block id="explication" heading="Explication">{explanation}</Block>
        {interactive && <Block id="exemples" heading="Exemples interactifs">{interactive}</Block>}
        {useCases && <Block id="cas-usage" heading="Cas d'utilisation">{useCases}</Block>}
        {bestPractices && <Block id="bonnes-pratiques" heading="Bonnes pratiques">{bestPractices}</Block>}
        {pitfalls && <Block id="erreurs" heading="Erreurs fréquentes">{pitfalls}</Block>}
        {culturalRefs && <Block id="references-culturelles" heading="Références culturelles">{culturalRefs}</Block>}

        {downloads && downloads.length > 0 && (
          <Block id="telechargements" heading="Téléchargements">
            <div className="grid gap-3 sm:grid-cols-2">
              {downloads.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  className="flex items-center gap-3 rounded-xl border border-avs-accent/9 px-4 py-3 text-sm font-semibold text-avs-accent transition-colors hover:border-avs-primary/40 hover:text-avs-primary"
                >
                  <i className="pi pi-download text-avs-primary" style={{ fontSize: '13px' }} aria-hidden />
                  <span className="flex-1">{d.label}</span>
                  <span className="font-mono text-[10px] uppercase text-avs-accent/35">{d.format}</span>
                </a>
              ))}
            </div>
          </Block>
        )}

        {/* ── Navigation vers la suite ─────────────────────────────────── */}
        <div className="mt-14 flex items-center justify-between gap-4 border-t border-avs-accent/9 pt-8">
          {prev ? (
            <Link href={prev.href as Route} className="group flex max-w-[45%] items-center gap-2.5 rounded-xl border border-avs-accent/9 px-4 py-3 text-sm font-semibold text-avs-accent/52 transition-all duration-200 hover:border-avs-primary hover:text-avs-primary">
              <i className="pi pi-arrow-left shrink-0" style={{ fontSize: '13px' }} />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : <div />}
          {next && (
            <Link href={next.href as Route} className="ml-auto flex max-w-[45%] items-center gap-2.5 rounded-xl border border-avs-accent/9 px-4 py-3 text-sm font-semibold text-avs-accent/52 transition-all duration-200 hover:border-avs-primary hover:text-avs-primary">
              <span className="truncate">{next.title}</span>
              <i className="pi pi-arrow-right shrink-0" style={{ fontSize: '13px' }} />
            </Link>
          )}
        </div>
      </article>

      {/* ── TOC latérale ─────────────────────────────────────────────── */}
      {toc.length > 0 && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-20 pr-6 pt-10">
            <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-avs-accent/32">Sur cette page</p>
            <nav aria-label="Table des matières" className="space-y-0.5">
              {toc.map(({ id, label, level }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block rounded-lg border-l-2 py-1.5 text-[12px] leading-snug transition-all duration-150 ${
                    activeHeading === id ? 'border-avs-primary bg-avs-primary/10 font-semibold text-avs-primary' : 'border-transparent text-avs-accent/32'
                  }`}
                  style={{ paddingLeft: level === 3 ? '1rem' : '0.5rem' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}