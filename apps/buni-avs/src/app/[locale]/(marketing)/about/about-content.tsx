'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useTranslations } from '@buni/i18n';

import { PrincipleRow } from './principle-row';

import { RoadmapTimeline, type RoadmapPhase } from './roadmap-timeline';
import { GuardianCard } from './guardian-card';
import { InfrastructureGrid } from './infrastructure-grid';
import { MethodPipeline } from './method-pipeline';
import { StatsComposition } from './stats-composition';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    iconName: 'shield' as const,
    title: 'Rigueur ethnographique',
    color: '#C0573E',
    text: "Chaque motif est validé par des artisans de terrain et des chercheurs spécialisés. Pas de romantisation, pas d'appropriation : de la documentation factuelle.",
  },
  {
    iconName: 'heart' as const,
    title: 'Souveraineté culturelle',
    color: '#D4A017',
    text: "Les communautés sources ont un droit de regard permanent sur leur patrimoine. AVS est un outil de préservation, jamais d'extraction.",
  },
  {
    iconName: 'globe' as const,
    title: 'Accès universel',
    color: '#4A6741',
    text: "La majorité des ressources est libre et gratuite (CC BY 4.0). Le savoir africain appartient à l'humanité entière, à commencer par les Africains.",
  },
  {
    iconName: 'book' as const,
    title: 'Traçabilité totale',
    color: '#2A4A6B',
    text: 'Chaque token de couleur, chaque motif, chaque symbole porte la trace de sa source : artisan, région, époque, signification documentée.',
  },
] as const;

const GUARDIANS = [
  {
    name: 'Dr. Amara Diop', role: 'Fondateur & Directeur Ethnographique', origin: '🇸🇳 Dakar',
    expertise: 'Textiles ouest-africains', motifName: 'Wax Dakar', pattern: 'avs-pattern-wax-dakar',
    quote: "Un motif sans sa source n'est plus qu'un décor. Notre travail commence toujours par le nom du village.",
  },
  {
    name: 'Ngozi Okonkwo', role: 'Directrice Design & Standard', origin: '🇳🇬 Lagos',
    expertise: 'Systèmes de design', motifName: 'Kente Royale', pattern: 'avs-pattern-kente-royale',
    quote: "Un standard n'est utile que si les designers l'adoptent sans y penser. C'est là notre exigence.",
  },
  {
    name: 'Jean-Paul Kamdem', role: 'Lead Ingénierie & Archivage', origin: '🇨🇲 Yaoundé',
    expertise: 'Architecture & données', motifName: 'Ndop Sultan', pattern: 'avs-pattern-ndop-sultan',
    quote: "Chaque token qu'on publie doit pouvoir être audité dans vingt ans. On construit pour durer.",
  },
  {
    name: 'Aïcha Ben Salah', role: 'Recherche Afrique du Nord', origin: '🇹🇳 Tunis',
    expertise: 'Iconographie berbère', motifName: 'Bogolan Fanga', pattern: 'avs-pattern-bogolan-fanga',
    quote: "L'Afrique du Nord est souvent absente des récits visuels du continent. Nous corrigeons ça, motif après motif.",
  },
  {
    name: 'Thabo Mokoena', role: 'Communauté & Partenariats Artisans', origin: "🇿🇦 Jo'burg",
    expertise: 'Relations artisans', motifName: 'Adinkra Sankofa', pattern: 'avs-pattern-adinkra-sankofa',
    quote: "Sankofa : revenir chercher ce qu'on a laissé derrière. C'est littéralement notre mission.",
  },
] as const;

const ROADMAP_PHASES: readonly RoadmapPhase[] = [
  {
    phase: '01', period: '2024 – 2025', status: 'done',
    title: 'Recherche & cadrage',
    objective: 'Comprendre le besoin réel avant de coder quoi que ce soit.',
    metric: '18 mois de recherche terrain',
    deliverables: [
      'Entretiens avec artisans et chercheurs pour cartographier les motifs existants',
      'Veille ethnographique sur les systèmes de classification africains',
      'Premiers prototypes techniques — formats SVG, structure de tokens',
      "Définition du modèle de données et de l'architecture du standard",
    ],
  },
  {
    phase: '02', period: '2026', status: 'now',
    title: 'Lancement v1.0',
    objective: 'Sortir un socle solide, documenté et utilisable en production.',
    metric: '1 248 motifs · 312 artisans vérifiés',
    deliverables: [
      'Bibliothèque ouverte de motifs documentés',
      'Intégrations Figma & Tailwind',
      'Système de vérification artisan (v1)',
      'Documentation publique du standard',
    ],
  },
  {
    phase: '03', period: '2027', status: 'planned',
    title: 'Consolidation',
    objective: "Solidifier la qualité et la gouvernance avant d'accélérer.",
    deliverables: [
      "Partenariats avec musées et universités d'Afrique centrale",
      'API publique pour intégrations tierces',
      'Programme de certification artisan renforcé',
      'Premiers revenus récurrents — licences et partenariats',
    ],
  },
  {
    phase: '04', period: '2028', status: 'planned',
    title: 'Expansion régionale',
    objective: 'Étendre la couverture géographique et la communauté.',
    deliverables: [
      "Couverture Afrique de l'Ouest et Afrique australe",
      'Gouvernance communautaire — comité consultatif artisans',
      'Programme de traduction multilingue du standard',
      'Outils designers — plugin, CLI, API stable',
    ],
  },
  {
    phase: '05', period: '2029', status: 'planned',
    title: 'Standard de référence',
    objective: 'Devenir la référence continentale, reconnue et adoptée.',
    deliverables: [
      '54 pays couverts, gouvernance ouverte et transparente',
      'Adoption par des institutions culturelles majeures',
      'Modèle de financement pérenne',
      'Certification officielle « AVS Verified »',
    ],
  },
] as const;

const CHAOS_PATTERNS = [
  'avs-pattern-wax-dakar', 'avs-pattern-kente-royale', 'avs-pattern-ndop-sultan',
  'avs-pattern-bogolan-fanga', 'avs-pattern-adinkra-sankofa', 'avs-pattern-wax-dakar',
  'avs-pattern-ndop-sultan', 'avs-pattern-kente-royale', 'avs-pattern-adinkra-sankofa',
  'avs-pattern-bogolan-fanga', 'avs-pattern-wax-dakar', 'avs-pattern-kente-royale',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MOTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionLabel({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'secondary' }) {
  const text = tone === 'accent' ? 'text-avs-primary' : 'text-avs-primary';
  return (
    <motion.div {...fadeUp} className="mb-4 flex items-center gap-3">
      <div className="h-px w-8 bg-avs-primary" aria-hidden />
      <span className={`font-mono text-[9px] tracking-[0.26em] uppercase ${text}`}>{children}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CONTENT
// ─────────────────────────────────────────────────────────────────────────────

export function AboutContent() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ══ 1 · MANIFESTO ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="manifesto-title"
        className="avs-pattern-ndop-sultan relative flex min-h-[92vh] items-center overflow-hidden px-4 py-32 sm:px-6 lg:px-8"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.74) 0%, rgba(10,8,6,0.97) 100%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(192,87,62,0.18) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-avs-primary/8"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-avs-primary/12"
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h1
            id="manifesto-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black leading-[.9] tracking-[-0.03em] text-avs-secondary"
            style={{ fontSize: 'clamp(2.75rem,7.5vw,6rem)' }}
          >
            {t('manifesto.title')}<br />
            <span className="text-avs-primary">{t('manifesto.highlight')}</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 h-0.5 w-24 origin-left rounded-full bg-avs-primary"
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-avs-secondary/60"
          >
            {t('manifesto.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-16 flex justify-center"
          >
            <ArrowDown size={18} className="animate-bounce text-avs-secondary/30" aria-hidden />
          </motion.div>
        </div>
      </section>

      {/* ══ 2 · LE PROBLÈME ══════════════════════════════════════════════════ */}
      <section aria-labelledby="problem-title" className="relative overflow-hidden border-b border-avs-accent/9 bg-avs-secondary px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel>{t('problem.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="problem-title"
              className="font-display font-black leading-[.95] text-avs-accent"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('problem.title')}<br />{t('problem.titleHighlight')}<br />
              <span className="text-avs-primary/80">{t('problem.titleEnd')}</span>
            </motion.h2>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-8 space-y-4 text-[15px] leading-relaxed text-avs-accent/60">
              <p>
                {t('problem.paragraph1')}
              </p>
              <p>
                {t('problem.paragraph2')}
              </p>
            </motion.div>
          </div>

          {/* Chaos mosaic — small, misaligned, desaturated swatches: fragmentation made visible */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-4 gap-2 opacity-90 sm:grid-cols-6"
            aria-hidden
          >
            {CHAOS_PATTERNS.map((p, i) => (
              <div
                key={`${p}-${i}`}
                className={`${p} aspect-square rounded-md grayscale`}
                style={{
                  transform: `rotate(${(i % 5) * 3 - 6}deg) translateY(${(i % 3) * 4}px)`,
                  opacity: 0.4 + (i % 4) * 0.12,
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 3 · NOTRE RÉPONSE ════════════════════════════════════════════════ */}
      <section aria-labelledby="response-title" className="relative overflow-hidden bg-avs-accent px-4 py-28 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 85% 20%, rgba(192,87,62,0.12) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <SectionLabel>{t('response.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="response-title"
              className="font-display font-black leading-[.95] text-avs-secondary"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('response.title')}<br />
              <span className="text-avs-primary">{t('response.highlight')}</span>
            </motion.h2>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 text-[15px] leading-relaxed text-avs-secondary/55">
              {t('response.subtitle')}
            </motion.p>
          </div>

          <InfrastructureGrid />
        </div>
      </section>

      {/* ══ 4 · NOTRE MÉTHODE ════════════════════════════════════════════════ */}
      <section aria-labelledby="method-title" className="border-b border-avs-accent/9 bg-avs-secondary px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <SectionLabel>{t('method.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="method-title"
              className="font-display font-black leading-[.95] text-avs-accent"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('method.title')}
            </motion.h2>
          </div>

          <MethodPipeline />
        </div>
      </section>

      {/* ══ 5 · NOS PRINCIPES ════════════════════════════════════════════════ */}
      <section aria-labelledby="principles-title" className="border-b border-avs-accent/9 bg-avs-secondary px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <SectionLabel>{t('principles.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="principles-title"
              className="font-display font-black leading-[.95] text-avs-accent"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('principles.title')}
            </motion.h2>
          </div>

          <div>
            {PRINCIPLES.map((p, i) => (
              <PrincipleRow key={p.title} {...p} index={i} total={PRINCIPLES.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6 · LES CHIFFRES ═════════════════════════════════════════════════ */}
      <section aria-labelledby="numbers-title" className="border-b border-avs-accent/9 bg-avs-secondary px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <SectionLabel>{t('stats.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="numbers-title"
              className="font-display font-black leading-[.95] text-avs-accent"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('stats.title')}
            </motion.h2>
          </div>

          <StatsComposition />
        </div>
      </section>

      {/* ══ 7 · FEUILLE DE ROUTE ═════════════════════════════════════════════ */}
      <section aria-labelledby="roadmap-title" className="avs-pattern-kente-royale relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-avs-accent/93" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 15% 30%, rgba(192,87,62,0.10) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <SectionLabel>{t('roadmap.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="roadmap-title"
              className="font-display font-black leading-tight text-avs-secondary"
              style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', letterSpacing: '-0.025em' }}
            >
              {t('roadmap.title')}
            </motion.h2>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-avs-secondary/55">
              {t('roadmap.subtitle')}
            </motion.p>
          </div>

          <RoadmapTimeline phases={ROADMAP_PHASES} />
        </div>
      </section>

      {/* ══ 8 · ÉQUIPE ════════════════════════════════════════════════════════ */}
      <section aria-labelledby="team-title" className="bg-avs-secondary px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <SectionLabel>{t('team.label')}</SectionLabel>
            <motion.h2
              {...fadeUp}
              id="team-title"
              className="font-display font-black leading-tight text-avs-accent"
              style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', letterSpacing: '-0.025em' }}
            >
              {t('team.title')}
            </motion.h2>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-avs-accent/55">
              {t('team.subtitle')}
            </motion.p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {GUARDIANS.map((g, i) => (
              <GuardianCard key={g.name} {...g} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9 · VISION ════════════════════════════════════════════════════════ */}
      <section aria-labelledby="vision-title" className="avs-pattern-adinkra-sankofa relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.90) 0%, rgba(10,8,6,0.97) 100%)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <SectionLabel>{t('vision.label')}</SectionLabel>
          <motion.h2
            {...fadeUp}
            id="vision-title"
            className="font-display font-black leading-[.95] text-avs-secondary"
            style={{ fontSize: 'clamp(2rem,4.5vw,3.75rem)', letterSpacing: '-0.025em' }}
          >
            {t('vision.title')}
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-avs-secondary/55">
            {t('vision.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* ══ 10 · CTA ═════════════════════════════════════════════════════════ */}
      <section aria-labelledby="join-title" className="avs-pattern-bogolan-fanga relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.97) 0%, rgba(26,18,8,0.92) 60%, rgba(50,28,10,0.86) 100%)' }}
          aria-hidden
        />
        <motion.div {...fadeUp} className="relative mx-auto max-w-xl text-center">
          <h2
            id="join-title"
            className="font-display font-black leading-[.92] tracking-[-0.025em] text-avs-secondary"
            style={{ fontSize: 'clamp(2.5rem,5.5vw,4.5rem)' }}
          >
            {t('cta.title')}
          </h2>

          <div className="mt-12 flex justify-center">
            <Link
              href={'/auth/register' as Route}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-avs-primary px-10 py-4 text-sm font-bold text-avs-secondary shadow-avs-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              {t('cta.button')}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <p className="mt-10 font-mono text-[10px] tracking-[0.16em] uppercase text-avs-secondary/22">
            {t('cta.footer')}
          </p>
        </motion.div>
      </section>

    </div>
  );
}