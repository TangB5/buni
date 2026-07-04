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
    <motion.section {...reveal} id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 py-10 first:pt-0" style={{ borderTop: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
      <h2 id={`${id}-h`} className="font-display mb-4 text-xl font-bold" style={{ letterSpacing: '-0.01em', color: 'var(--doc-text, #1D1D1B)', fontFamily: 'var(--font-display, Georgia, serif)' }}>
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
    <article className="min-w-0 flex-1 px-6 py-10 lg:px-12 bg-avs-secondary">

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
        <h1 className="font-display font-black leading-tight" style={{ fontSize: 'clamp(1.75rem,3.4vw,2.75rem)', letterSpacing: '-0.02em', color: 'var(--doc-text, #1D1D1B)', fontFamily: 'var(--font-display, Georgia, serif)' }}>
          {title}
        </h1>
      </motion.div>

      {/* ── Résumé ───────────────────────────────────────────────────── */}
      <motion.p {...reveal} className="mt-5 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}>
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
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', color: 'var(--doc-text, #1D1D1B)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary, #C0573E)'; e.currentTarget.style.color = 'var(--doc-primary, #C0573E)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border, rgba(29,29,27,0.09))'; e.currentTarget.style.color = 'var(--doc-text, #1D1D1B)'; }}
              >
                <i className="pi pi-download shrink-0" style={{ fontSize: '13px', color: 'var(--doc-primary, #C0573E)' }} aria-hidden />
                <span className="flex-1">{d.label}</span>
                <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{d.format}</span>
              </a>
            ))}
          </div>
        </Block>
      )}

      {/* ── Navigation vers la suite ─────────────────────────────────── */}
      <div className="mt-14 flex items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
        {prev ? (
          <Link href={prev.href as Route} className="group flex max-w-[45%] items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200" style={{ borderColor: 'var(--doc-border, rgba(29,29,27,0.09))', color: 'var(--doc-muted, rgba(29,29,27,0.52))' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary, #C0573E)'; e.currentTarget.style.color = 'var(--doc-primary, #C0573E)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border, rgba(29,29,27,0.09))'; e.currentTarget.style.color = 'var(--doc-muted, rgba(29,29,27,0.52))'; }}>
            <i className="pi pi-arrow-left shrink-0" style={{ fontSize: '13px' }} />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : <div />}
        {next && (
          <Link href={next.href as Route} className="ml-auto flex max-w-[45%] items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200" style={{ borderColor: 'var(--doc-border, rgba(29,29,27,0.09))', color: 'var(--doc-muted, rgba(29,29,27,0.52))' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary, #C0573E)'; e.currentTarget.style.color = 'var(--doc-primary, #C0573E)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border, rgba(29,29,27,0.09))'; e.currentTarget.style.color = 'var(--doc-muted, rgba(29,29,27,0.52))'; }}>
            <span className="truncate">{next.title}</span>
            <i className="pi pi-arrow-right shrink-0" style={{ fontSize: '13px' }} />
          </Link>
        )}
      </div>
    </article>
  );
}