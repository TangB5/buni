'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { CommandPalette } from './command-palette';
import { NAV_SPACES } from './nav-data';
import { Route } from 'next';

const LATEST = [
  { title: 'Ndop Bamoum', space: 'Motifs', date: '28 juin 2026' },
  { title: 'Référence des tokens v1.2', space: 'Design Tokens', date: '24 juin 2026' },
  { title: 'Checklist WCAG', space: 'Accessibilité', date: '19 juin 2026' },
];

const POPULAR = [
  { title: 'Installation', space: 'Commencer', hits: '12,4k' },
  { title: 'Palette principale', space: 'Couleurs', hits: '9,1k' },
  { title: 'Bouton', space: 'Composants', hits: '7,8k' },
];

const PATHS = [
  { title: 'Designer', desc: 'Motifs, couleurs, typographie, études culturelles.', steps: ['Motifs', 'Couleurs', 'Typographie', 'Études culturelles'] },
  { title: 'Développeur', desc: 'Installation, tokens, composants, API.', steps: ['Installation', 'Design Tokens', 'Composants', 'API'] },
  { title: 'Chercheur', desc: 'Concepts, études culturelles, bibliographie.', steps: ['Concepts fondamentaux', 'Études culturelles', 'Ressources'] },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function DocumentationHome() {
  return (
    <div>
      {/* ── Hero + recherche centrale ─────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 bg-avs-secondary">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-avs-primary">
            Documentation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-3 font-black leading-[.95] text-avs-accent"
            style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', letterSpacing: '-0.03em' }}
          >
            Tout le standard,<br />au bout d&apos;une recherche.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-avs-accent/55"
          >
            Motifs, tokens, composants, API, études culturelles — 15 espaces, une seule source de vérité.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mx-auto mt-8 max-w-md">
            <CommandPalette />
          </motion.div>
        </div>
      </section>

      {/* ── Section Commencer ────────────────────────────────────────── */}
      <motion.section {...reveal} className="border-y border-avs-accent/9 bg-avs-accent px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h2 className="font-display text-xl font-bold text-avs-secondary">Nouveau ici ?</h2>
            <p className="mt-1 text-sm text-avs-secondary/55">Installez AVS et publiez votre premier composant en moins de 5 minutes.</p>
          </div>
          <Link
            href="/documentation/commencer/introduction"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-avs-primary px-6 py-3 text-sm font-bold text-avs-secondary transition-transform hover:-translate-y-0.5"
          >
            Commencer <i className="pi pi-arrow-right" style={{ fontSize: '11px' }} />
          </Link>
        </div>
      </motion.section>

      {/* ── Grille des catégories ────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-avs-secondary/95">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...reveal} className="font-display mb-8 text-lg font-bold text-avs-accent">Explorer les espaces</motion.h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_SPACES.map((space, i) => (
              <motion.div
                key={space.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/documentation/${space.slug}` as Route}
                  className="group flex h-full flex-col rounded-2xl border border-avs-accent/9 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-avs-primary/30"
                >
                  <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" style={{ background: `${space.color}14`, color: space.color }}>
                    <i className={`pi pi-${space.icon}`} style={{ fontSize: '15px' }} />
                  </span>
                  <h3 className="font-display text-[15px] font-bold text-avs-accent">{space.label}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-avs-accent/45">{space.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Derniers ajouts / Ressources populaires ──────────────────── */}
      <section className="border-t border-avs-accent/9 px-4 py-20 sm:px-6 lg:px-8 bg-avs-secondary">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
          <motion.div {...reveal}>
            <h2 className="font-display mb-5 text-lg font-bold text-avs-accent">Derniers ajouts</h2>
            <ul className="space-y-1">
              {LATEST.map((l) => (
                <li key={l.title} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-avs-accent/[0.03]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-avs-accent">{l.title}</p>
                    <p className="text-[11px] text-avs-accent/40">{l.space}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-avs-accent/30">{l.date}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal}>
            <h2 className="font-display mb-5 text-lg font-bold text-avs-accent">Ressources populaires</h2>
            <ul className="space-y-1">
              {POPULAR.map((p) => (
                <li key={p.title} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-avs-accent/[0.03]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-avs-accent">{p.title}</p>
                    <p className="text-[11px] text-avs-accent/40">{p.space}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-avs-accent/30">{p.hits} vues</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Parcours recommandés ─────────────────────────────────────── */}
      <section className="border-t border-avs-accent/9 bg-avs-secondary/90 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...reveal} className="font-display mb-8 text-lg font-bold text-avs-accent">Parcours recommandés</motion.h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {PATHS.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-avs-accent/9 p-6"
              >
                <h3 className="font-display text-base font-bold text-avs-accent">{path.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-avs-accent/50">{path.desc}</p>
                <ol className="mt-5 space-y-2">
                  {path.steps.map((s, si) => (
                    <li key={s} className="flex items-center gap-2.5 text-[12.5px] text-avs-accent/60">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-avs-primary/10 font-mono text-[9px] font-bold text-avs-primary">
                        {si + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visualisation interactive du système ─────────────────────── */}
      <section className="avs-pattern-kente-royale relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-avs-accent/93" aria-hidden />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.h2 {...reveal} className="font-display font-black text-avs-secondary" style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', letterSpacing: '-0.02em' }}>
            Un système, sept briques, quinze espaces
          </motion.h2>
          <motion.div {...reveal} className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {NAV_SPACES.map((s) => (
              <Link
                key={s.slug}
                href={`/documentation/${s.slug}` as Route}
                className="rounded-full border border-avs-secondary/15 px-4 py-2 text-[12px] font-semibold text-avs-secondary/70 transition-all hover:border-avs-primary hover:text-avs-primary"
              >
                {s.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}