'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Palette,
  Users,
  BookOpen,
  Check,
  Star,
  Sparkles,
  Download,
} from 'lucide-react';
import { cn } from '@buni/ui';
import { Route } from 'next';
import { HeroSection } from '../components/layout/HeroSection';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 1248, display: '1 248', label: 'Motifs', sub: 'vectorisés' },
  { value: 54, display: '54', label: 'Pays', sub: 'représentés' },
  { value: 312, display: '312', label: 'Artisans', sub: 'vérifiés' },
  { value: 98, display: '98k', label: 'DL', sub: 'ce mois' },
] as const;

const MARQUEE_ITEMS = [
  'KENTE',
  'NDOP',
  'BOGOLAN',
  'ADINKRA',
  'WAX',
  'KUBA',
  'NDEBELE',
  'BERBER',
  'TOGHU',
  'RAPHIA',
  'MAASAI',
  'ANKARA',
];

const COLLAGE = [
  {
    css: 'avs-pattern-ndop-sultan',
    type: 'NDOP',
    name: 'Ndop Sultan',
    origin: 'Foumban · CM',
    style: { left: '5%', top: '5%', width: '56%', height: '52%', rotate: '-2deg' },
  },
  {
    css: 'avs-pattern-kente-royale',
    type: 'KENTE',
    name: 'Kente Royale',
    origin: 'Kumasi · GH',
    style: { right: '0', top: '8%', width: '40%', height: '36%', rotate: '1.5deg' },
  },
  {
    css: 'avs-pattern-wax-dakar',
    type: 'WAX',
    name: 'Wax Lagos',
    origin: 'Lagos · NG',
    style: { right: '4%', top: '48%', width: '42%', height: '30%', rotate: '-1deg' },
  },
  {
    css: 'avs-pattern-bogolan-fanga',
    type: 'BOGOLAN',
    name: 'Bogolan Fanga',
    origin: 'Ségou · ML',
    style: { left: '0', bottom: '5%', width: '50%', height: '28%', rotate: '2deg' },
  },
] as const;

const GALLERY = [
  {
    css: 'avs-pattern-ndop-sultan',
    type: 'NDOP',
    name: 'Ndop Sultan',
    origin: 'Foumban · CM',
    cls: 'lg:col-span-3 lg:row-span-2',
  },
  {
    css: 'avs-pattern-kente-royale',
    type: 'KENTE',
    name: 'Kente Royale',
    origin: 'Kumasi · GH',
    cls: 'lg:col-span-2',
  },
  {
    css: 'avs-pattern-adinkra-sankofa',
    type: 'ADINKRA',
    name: 'Adinkra Sankofa',
    origin: 'Akan · GH',
    cls: '',
  },
  {
    css: 'avs-pattern-kuba-kasai',
    type: 'KUBA',
    name: 'Kuba Kasai',
    origin: 'Kasai · CD',
    cls: '',
  },
  {
    css: 'avs-pattern-bogolan-fanga',
    type: 'BOGOLAN',
    name: 'Bogolan Fanga',
    origin: 'Ségou · ML',
    cls: 'lg:col-span-2',
  },
] as const;

const FEATURES = [
  {
    num: '01',
    Icon: Layers,
    title: 'Bibliothèque de motifs',
    desc: '+1 200 motifs par région, époque et symbolisme. SVG, PNG, JSON, CSS.',
    href: '/patterns',
    color: '#C0573E',
    accent: 'rgba(192,87,62,.08)',
  },
  {
    num: '02',
    Icon: Palette,
    title: 'Design tokens culturels',
    desc: 'Palettes de pigments naturels africains. Tailwind, Figma, CSS Variables.',
    href: '/colors',
    color: '#D4A017',
    accent: 'rgba(212,160,23,.08)',
  },
  {
    num: '03',
    Icon: Users,
    title: "Communauté d'artisans",
    desc: '312 artisans vérifiés valident chaque entrée. La source primaire, toujours.',
    href: '/artisans',
    color: '#4A6741',
    accent: 'rgba(74,103,65,.08)',
  },
  {
    num: '04',
    Icon: BookOpen,
    title: 'Composants & Documentation',
    desc: 'Bibliothèque UI React, templates, icônes SVG. Copy & Paste. Sans compte.',
    href: '/documentation',
    color: '#2A4A6B',
    accent: 'rgba(42,74,107,.08)',
  },
] as const;

const BENTO = [
  {
    css: 'avs-pattern-ndop-sultan',
    overlay: 'from-[#060F1A]/94 to-[#060F1A]/72',
    span: 'lg:col-span-2',
    minH: '220px',
    eyebrow: 'Copy & Paste · Shadcn style',
    eyeColor: '#C8A96E',
    title: 'Vous possédez\nvotre code',
    titleColor: '#F5EBE0',
    desc: 'Copiez les composants, motifs et tokens. Aucune dépendance opaque. Adaptez sans permission.',
    descColor: 'rgba(245,235,224,.5)',
    chips: ['Button', 'PatternCard', 'SvgPattern', 'Toast'],
    chipColor: '#C8A96E',
  },
  {
    solid: '#C0573E',
    span: '',
    minH: '220px',
    eyebrow: 'Formats · Licences',
    eyeColor: 'rgba(245,235,224,.65)',
    title: 'SVG · PNG\nJSON · CSS',
    titleColor: '#F5EBE0',
    desc: 'Chaque motif dans 4 formats. CC BY 4.0 — usage libre.',
    descColor: 'rgba(245,235,224,.55)',
    bigNum: '4×',
  },
  {
    solid: 'var(--hp-bento-check-bg)',
    span: '',
    minH: '200px',
    eyebrow: 'Accès public',
    eyeColor: 'var(--hp-bento-check-eye)',
    title: 'Aucun compte\nrequis',
    titleColor: 'var(--hp-bento-check-title)',
    desc: "Comme PrimeReact. Tout est public. L'auth est optionnelle — seulement pour contribuer.",
    descColor: 'var(--hp-bento-check-desc)',
    checkmark: true,
  },
  {
    solid: 'var(--hp-surface)',
    span: 'lg:col-span-2',
    minH: '170px',
    eyebrow: 'Design tokens',
    eyeColor: 'var(--hp-muted)',
    title: 'Intégrez en 30s dans\nFigma, Tailwind, React Native',
    titleColor: 'var(--hp-text)',
    desc: 'Téléchargez les tokens de couleurs, typographie et spacing pour vos outils',
    descColor: 'var(--hp-muted)',
    palette: [
      '#C0573E',
      '#F5EBE0',
      '#1D1D1B',
      '#D4A017',
      '#4A6741',
      '#2A4A6B',
      '#8B4513',
      '#C8A96E',
    ],
  },
] as const;

const TESTIMONIALS = [
  {
    css: 'avs-pattern-kente-royale',
    quote:
      "AVS est la référence que j'attendais depuis 10 ans. Chaque pixel est documenté avec sa source culturelle.",
    name: 'Ama Asantewaa',
    flag: '🇬🇭',
    role: 'Tisserande Kente · Kumasi',
  },
  {
    css: 'avs-pattern-adinkra-sankofa',
    quote:
      "Le Ndop de mon sultanat enfin standardisé. AVS préserve ce que le temps risquait d'effacer.",
    name: 'Njoya Hamidou',
    flag: '🇨🇲',
    role: 'Tisserand Ndop · Foumban',
  },
  {
    css: 'avs-pattern-wax-dakar',
    quote:
      "En tant que designer, c'est ma première source. Des tokens prêts pour Figma en deux clics.",
    name: 'Dr. Amara Diop',
    flag: '🇸🇳',
    role: 'Directeur Design · Dakar',
  },
] as const;

const COMMUNITY_AVATARS = [
  'avs-pattern-kente-royale',
  'avs-pattern-ndop-sultan',
  'avs-pattern-bogolan-fanga',
  'avs-pattern-adinkra-sankofa',
  'avs-pattern-kuba-kasai',
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES — single source of truth for both modes
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  :root {
    /* Page backgrounds */
    --hp-bg:              #FAFAF8;
    --hp-surface:         #F5EBE0;
    --hp-gallery-bg:      #F0EBE4;
    --hp-bento-bg:        #FAFAF8;
    --hp-testimonial-bg:  #EDE8E1;

    /* Text */
    --hp-text:            #1D1D1B;
    --hp-muted:           rgba(29,29,27,0.62);
    --hp-hint:            rgba(29,29,27,0.45);
    --hp-faint:           rgba(29,29,27,0.08);

    /* Borders / grid */
    --hp-grid:            rgba(29,29,27,0.04);
    --hp-border:          rgba(29,29,27,0.08);
    --hp-border-md:       rgba(29,29,27,0.14);
    --hp-stat-border:     rgba(29,29,27,0.08);

    /* Ghost CTA */
    --hp-ghost-border:    rgba(29,29,27,0.14);
    --hp-ghost-text:      rgba(29,29,27,0.70);
    --hp-ghost-hover-b:   rgba(29,29,27,0.28);
    --hp-ghost-hover-t:   #1D1D1B;

    /* Testimonials hover */
    --hp-card-bg:         rgba(29,29,27,0.03);
    --hp-card-border:     rgba(29,29,27,0.08);
    --hp-card-hover-bg:   rgba(255,255,255,0.70);
    --hp-card-hover-b:    rgba(192,87,62,0.22);
    --hp-quote-text:      rgba(29,29,27,0.72);
    --hp-author-text:     #1D1D1B;
    --hp-role-text:       rgba(29,29,27,0.45);

    /* Bento "checkmark" card */
    --hp-bento-check-bg:    #1D1D1B;
    --hp-bento-check-eye:   rgba(245,235,224,0.6);
    --hp-bento-check-title: #F5EBE0;
    --hp-bento-check-desc:  rgba(245,235,224,0.5);

    /* Avatar ring */
    --hp-avatar-ring:     #0A0806;

    /* Collage shadow */
    --hp-collage-shadow:  rgba(0,0,0,0.18);
  }

  .dark {
    --hp-bg:              #0A0806;
    --hp-surface:         #121008;
    --hp-gallery-bg:      #0A0806;
    --hp-bento-bg:        #0A0806;
    --hp-testimonial-bg:  #0C0906;

    --hp-text:            #F5EBE0;
    --hp-muted:           rgba(245,235,224,0.62);
    --hp-hint:            rgba(245,235,224,0.45);
    --hp-faint:           rgba(245,235,224,0.06);

    --hp-grid:            rgba(245,235,224,0.04);
    --hp-border:          rgba(245,235,224,0.06);
    --hp-border-md:       rgba(245,235,224,0.10);
    --hp-stat-border:     rgba(245,235,224,0.08);

    --hp-ghost-border:    rgba(245,235,224,0.14);
    --hp-ghost-text:      rgba(245,235,224,0.80);
    --hp-ghost-hover-b:   rgba(245,235,224,0.28);
    --hp-ghost-hover-t:   #F5EBE0;

    --hp-card-bg:         rgba(245,235,224,0.03);
    --hp-card-border:     rgba(245,235,224,0.07);
    --hp-card-hover-bg:   rgba(245,235,224,0.05);
    --hp-card-hover-b:    rgba(192,87,62,0.22);
    --hp-quote-text:      rgba(245,235,224,0.72);
    --hp-author-text:     #F5EBE0;
    --hp-role-text:       rgba(245,235,224,0.45);

    --hp-bento-check-bg:    #F5EBE0;
    --hp-bento-check-eye:   rgba(29,29,27,0.45);
    --hp-bento-check-title: #1D1D1B;
    --hp-bento-check-desc:  rgba(29,29,27,0.50);

    --hp-avatar-ring:     #0A0806;
    --hp-collage-shadow:  rgba(0,0,0,0.65);
  }

  @keyframes avs-marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
  return { val, trigger: () => setStarted(true) };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease } },
});
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const itemFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="h-px w-10" style={{ background: '#C0573E', opacity: 0.6 }} aria-hidden />
      <span
        className="font-mono text-[9px] tracking-[.28em] uppercase"
        style={{ color: '#C0573E' }}
      >
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
 

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="overflow-x-hidden" style={{ background: 'var(--hp-bg)' }}>
        {/* ══════════════════════════════════════════════════════
            § 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <HeroSection />

        {/* ══════════════════════════════════════════════════════
            § 2 — MARQUEE
        ══════════════════════════════════════════════════════ */}
        <div
          className="overflow-hidden py-3"
          aria-hidden
          style={{
            background: 'rgba(192,87,62,.05)',
            borderTop: '1px solid var(--hp-border)',
            borderBottom: '1px solid var(--hp-border)',
          }}
        >
          <div className="flex w-max" style={{ animation: 'avs-marquee 30s linear infinite' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-8 px-8 font-mono text-[9px] tracking-[.28em] whitespace-nowrap uppercase"
                style={{ color: '#C0573E' }}
              >
                {item}
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: 'rgba(192,87,62,.40)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            § 3 — GALLERY
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="gallery-title"
          className="px-6 py-20 lg:px-8"
          style={{ background: 'var(--hp-gallery-bg)' }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <SectionLabel label="Patrimoine · Motifs en vedette" />
              <Link
                href={'/patterns' as Route}
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: 'var(--hp-hint)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C0573E')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-hint)')}
              >
                Tout voir <ArrowRight size={12} />
              </Link>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-2 gap-2 lg:grid-cols-6 lg:grid-rows-2"
            >
              {GALLERY.map(({ css, type, name, origin, cls }, i) => (
                <motion.div
                  key={name}
                  variants={itemFade}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl ${cls}`}
                  style={{ minHeight: i === 0 ? '380px' : '165px' }}
                  whileHover={{ scale: 1.014 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                >
                  <div
                    className={`${css} absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]`}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top,rgba(10,8,6,.92) 0%,rgba(10,8,6,.08) 55%,transparent 100%)',
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-[8px] font-bold tracking-[.2em] uppercase backdrop-blur-sm"
                      style={{ background: 'rgba(192,87,62,.85)', color: '#F5EBE0' }}
                    >
                      {type}
                    </span>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 translate-y-1.5 p-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-display text-sm font-bold" style={{ color: '#F5EBE0' }}>
                      {name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'rgba(245,235,224,.6)' }}>
                      {origin}
                    </p>
                  </div>
                  <div
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    style={{ background: 'rgba(245,235,224,.10)' }}
                  >
                    <ArrowUpRight size={11} style={{ color: '#F5EBE0' }} aria-hidden />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 4 — PIVOT STAT (always dark — pattern-imposed)
        ══════════════════════════════════════════════════════ */}
        <section
          className="avs-pattern-kente-royale relative overflow-hidden py-28"
          aria-label="Impact AVS"
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(10,8,6,.89)' }}
            aria-hidden
          />
          <div
            className="font-display pointer-events-none absolute right-[-2%] bottom-[-14%] leading-none font-black select-none"
            style={{ fontSize: 'clamp(8rem,22vw,20rem)', color: 'rgba(245,235,224,.03)' }}
            aria-hidden
          >
            1248
          </div>
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <SectionLabel label="Héritage · Documentation · Standard" />
                <motion.h2
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                  className="font-display leading-[.9] font-black"
                  style={{
                    fontSize: 'clamp(2.5rem,5vw,4.25rem)',
                    color: '#F5EBE0',
                    letterSpacing: '-0.025em',
                  }}
                >
                  Chaque motif
                  <br />
                  porte une
                  <br />
                  <span style={{ color: '#C0573E' }}>histoire</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mt-6 max-w-md leading-relaxed"
                  style={{ color: 'rgba(245,235,224,.55)' }}
                >
                  Région d&apos;origine, peuple, époque, symbolisme cérémoniel. Une archive vivante,
                  ouverte, vérifiée par des artisans réels.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-8 flex flex-wrap gap-2"
                >
                  {[
                    'CC BY 4.0',
                    'Open Source',
                    'Aucun compte requis',
                    'SVG · PNG · JSON · CSS',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-xl px-4 py-1.5 text-xs font-medium"
                      style={
                        tag === 'CC BY 4.0'
                          ? {
                              background: 'rgba(192,87,62,.12)',
                              border: '1px solid rgba(192,87,62,.28)',
                              color: '#C0573E',
                            }
                          : {
                              border: '1px solid rgba(245,235,224,.10)',
                              color: 'rgba(245,235,224,.7)',
                            }
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { num: '1 248', label: 'Motifs documentés', color: '#C0573E' },
                  { num: '54', label: 'Pays représentés', color: '#D4A017' },
                  { num: '312', label: 'Artisans vérifiés', color: '#4A6741' },
                  { num: '98k', label: 'Téléchargements/mois', color: '#2A4A6B' },
                ].map(({ num, label, color }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-5"
                    style={{
                      background: 'rgba(245,235,224,.04)',
                      border: '1px solid rgba(245,235,224,.06)',
                    }}
                  >
                    <p
                      className="font-display text-3xl leading-none font-black"
                      style={{ color, letterSpacing: '-0.02em' }}
                    >
                      {num}
                    </p>
                    <p
                      className="mt-2 text-xs leading-snug"
                      style={{ color: 'rgba(245,235,224,.45)' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 5 — FEATURES
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="features-title"
          className="px-6 py-24 lg:px-8"
          style={{ background: 'var(--hp-surface)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionLabel label="Ce que nous offrons" />
                <h2
                  id="features-title"
                  className="font-display leading-[.92] font-black"
                  style={{
                    fontSize: 'clamp(2rem,4vw,3.5rem)',
                    color: 'var(--hp-text)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  Un standard
                  <br />
                  <span style={{ color: '#C0573E' }}>ouvert</span> &amp; rigoureux
                </h2>
              </div>
              <p
                className="max-w-xs text-sm leading-relaxed lg:text-right"
                style={{ color: 'var(--hp-hint)' }}
              >
                Tout est accessible sans compte, comme PrimeReact. La connaissance africaine
                appartient à l&apos;humanité.
              </p>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="divide-y"
              style={{ borderColor: 'var(--hp-border)' }}
            >
              {FEATURES.map(({ num, Icon, title, desc, href, color, accent }) => (
                <motion.div key={title} variants={itemFade}>
                  <Link
                    href={href as Route}
                    className="group flex items-center gap-6 py-7 transition-all duration-300 lg:gap-8 lg:py-8"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.paddingLeft = '12px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.paddingLeft = '0px';
                    }}
                    style={{ transitionProperty: 'padding-left' }}
                  >
                    <span
                      className="font-display shrink-0 leading-none font-black tabular-nums"
                      style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', color, opacity: 0.08 }}
                      aria-hidden
                    >
                      {num}
                    </span>
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                      style={{ background: accent, color }}
                    >
                      <Icon size={20} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-display text-xl font-bold transition-colors duration-200"
                        style={{ color: 'var(--hp-text)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-text)')}
                      >
                        {title}
                      </p>
                      <p
                        className="mt-1 text-sm leading-relaxed"
                        style={{ color: 'var(--hp-hint)' }}
                      >
                        {desc}
                      </p>
                    </div>
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'var(--hp-faint)', opacity: 0.45 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.background = color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.45';
                        e.currentTarget.style.background = 'var(--hp-faint)';
                      }}
                    >
                      <ArrowUpRight size={15} style={{ color: 'var(--hp-text)' }} aria-hidden />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 6 — BENTO
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="bento-title"
          className="px-6 pt-20 pb-24 lg:px-8"
          style={{ background: 'var(--hp-bento-bg)' }}
        >
          <div className="mx-auto max-w-6xl">
            <SectionLabel label="Pourquoi AVS" />
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid gap-3 lg:grid-cols-3"
            >
              {BENTO.map((card, i) => (
                <motion.div
                  key={i}
                  variants={itemFade}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className={`relative overflow-hidden rounded-2xl ${card.span || ''}`}
                  style={{
                    minHeight: card.minH,
                    ...('solid' in card && card.solid ? { background: card.solid } : {}),
                    ...('border' in card && card.border
                      ? { border: `1px solid ${card.border}` }
                      : { border: '1px solid var(--hp-border)' }),
                  }}
                >
                  {'css' in card && (
                    <>
                      <div className={`${card.css} absolute inset-0`} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.overlay}`} />
                    </>
                  )}
                  <div className="relative flex h-full flex-col justify-between p-7">
                    <div>
                      <p
                        className="mb-3 font-mono text-[8px] tracking-[.22em] uppercase"
                        style={{ color: card.eyeColor, opacity: 0.85 }}
                      >
                        {card.eyebrow}
                      </p>
                      <h3
                        className="font-display text-xl leading-tight font-bold"
                        style={{ color: card.titleColor, letterSpacing: '-0.015em' }}
                      >
                        {card.title.split('\n').map((line, j) => (
                          <span key={j} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p
                        className="mt-2.5 text-sm leading-relaxed"
                        style={{ color: card.descColor }}
                      >
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-6">
                      {'chips' in card && (
                        <div className="flex flex-wrap gap-1.5">
                          {card.chips.map((c) => (
                            <span
                              key={c}
                              className="rounded-lg border px-2.5 py-1 font-mono text-[9px] font-medium"
                              style={{
                                color: card.chipColor,
                                borderColor: `${card.chipColor}30`,
                                background: `${card.chipColor}08`,
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {'bigNum' in card && (
                        <p
                          className="font-display text-right leading-none font-black"
                          style={{
                            fontSize: '5rem',
                            color: card.titleColor,
                            opacity: 0.12,
                            letterSpacing: '-0.04em',
                          }}
                          aria-hidden
                        >
                          {card.bigNum}
                        </p>
                      )}
                      {'checkmark' in card && (
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: 'rgba(74,103,65,.18)' }}
                        >
                          <Check size={17} style={{ color: '#4A6741' }} aria-hidden />
                        </div>
                      )}
                      {'palette' in card && (
                        <div className="mt-5 flex gap-1.5">
                          {card.palette.map((hex) => (
                            <div
                              key={hex}
                              className="h-7 flex-1 rounded-lg shadow-sm first:rounded-l-xl last:rounded-r-xl"
                              style={{ background: hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 7 — TESTIMONIALS
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="testimonials-title"
          className="px-6 py-24 lg:px-8"
          style={{ background: 'var(--hp-testimonial-bg)' }}
        >
          <div className="mx-auto max-w-6xl">
            <SectionLabel label="Ils utilisent AVS" />
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-5 md:grid-cols-3"
            >
              {TESTIMONIALS.map(({ css, quote, name, flag, role }) => (
                <motion.figure
                  key={name}
                  variants={itemFade}
                  className="group flex flex-col gap-5 rounded-2xl p-7 backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: 'var(--hp-card-bg)',
                    border: '1px solid var(--hp-card-border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hp-card-hover-b)';
                    e.currentTarget.style.background = 'var(--hp-card-hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hp-card-border)';
                    e.currentTarget.style.background = 'var(--hp-card-bg)';
                  }}
                >
                  <span
                    className="font-display text-5xl leading-[.8] select-none"
                    style={{ color: '#C0573E', fontFamily: 'Georgia,serif' }}
                    aria-hidden
                  >
                    &quot;
                  </span>
                  <blockquote
                    className="-mt-3 flex-1 text-sm leading-[1.8]"
                    style={{ color: 'var(--hp-quote-text)' }}
                  >
                    {quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div
                      className={`${css} relative h-10 w-10 shrink-0 overflow-hidden rounded-full`}
                      style={{ border: '1.5px solid var(--hp-border-md)' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="font-display text-sm font-black text-white drop-shadow">
                          {name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: 'var(--hp-author-text)' }}
                      >
                        {flag} {name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--hp-role-text)' }}>
                        {role}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 8 — CTA (always dark — kente-imposed)
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="cta-title"
          className="avs-pattern-kente-royale relative overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg,rgba(10,8,6,.97) 0%,rgba(26,18,8,.90) 60%,rgba(50,25,10,.84) 100%)',
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div
              className="absolute -top-24 -right-24 h-96 w-96 rounded-full"
              style={{ border: '1px solid rgba(192,87,62,.09)' }}
            />
            <div
              className="absolute -top-10 -right-10 h-60 w-60 rounded-full"
              style={{ border: '1px solid rgba(192,87,62,.14)' }}
            />
            <div
              className="absolute top-12 right-20 h-20 w-20 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,.04)' }}
            />
            <div
              className="absolute -bottom-12 -left-16 h-56 w-56 rotate-45"
              style={{ border: '1px solid rgba(212,160,23,.08)' }}
            />
          </div>
          <div
            className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 opacity-[.03]"
            aria-hidden
          >
            <div className="avs-pattern-adinkra-sankofa h-full w-full" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 py-32 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
              style={{ background: 'rgba(192,87,62,.10)', borderColor: 'rgba(192,87,62,.28)' }}
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: '#C0573E' }}
                aria-hidden
              />
              <span
                className="font-mono text-[9px] tracking-[.24em] uppercase"
                style={{ color: '#C0573E' }}
              >
                Open Source · CC BY 4.0 · Gratuit
              </span>
            </motion.div>

            <motion.h2
              id="cta-title"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              className="font-display leading-[.9] font-black tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.75rem,7vw,5.75rem)', color: '#F5EBE0' }}
            >
              Construisons
              <br />
              <span style={{ color: '#C0573E' }}>le standard</span>
              <br />
              africain
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-md leading-relaxed"
              style={{ color: 'rgba(245,235,224,.52)' }}
            >
              Artisan, designer, chercheur ou développeur — votre savoir enrichit la plus grande
              archive visuelle africaine open-source du monde.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.32, duration: 0.6, ease }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href={'/auth/register' as Route}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-9 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#C0573E',
                  boxShadow: '4px 4px 0 rgba(192,87,62,.35),0 8px 24px rgba(192,87,62,.22)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '6px 6px 0 rgba(192,87,62,.35),0 12px 32px rgba(192,87,62,.28)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '4px 4px 0 rgba(192,87,62,.35),0 8px 24px rgba(192,87,62,.22)')
                }
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                Rejoindre gratuitement{' '}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={'/patterns' as Route}
                className="inline-flex items-center gap-2 rounded-xl px-9 py-4 text-sm font-semibold transition-all duration-200"
                style={{
                  border: '1px solid rgba(245,235,224,.14)',
                  color: 'rgba(245,235,224,.75)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245,235,224,.28)';
                  e.currentTarget.style.color = '#F5EBE0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245,235,224,.14)';
                  e.currentTarget.style.color = 'rgba(245,235,224,.75)';
                }}
              >
                Explorer d&apos;abord
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-14 flex items-center justify-center gap-4"
            >
              <div className="flex">
                {COMMUNITY_AVATARS.map((css, i) => (
                  <div
                    key={i}
                    className={`${css} relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${i > 0 ? '-ml-2.5' : ''}`}
                    style={{ zIndex: 5 - i, border: '2px solid var(--hp-avatar-ring)' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="font-display text-xs font-black text-white drop-shadow">
                        {['N', 'A', 'F', 'K', 'S'][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: 'rgba(245,235,224,.60)' }}>
                +312 artisans nous ont déjà rejoints
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[.16em] uppercase"
              style={{ color: 'rgba(245,235,224,.25)' }}
            >
              <Download size={10} />
              98k téléchargements ce mois — aucun compte requis
            </motion.p>
          </div>
        </section>
      </div>
    </>
  );
}
