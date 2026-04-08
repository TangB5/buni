'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Palette,
  Users,
  BookOpen,
  Check,
  Star,
} from 'lucide-react';
import { cn } from '@buni/ui';
import { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '1 248', label: 'Motifs', sub: 'vectorisés' },
  { value: '54', label: 'Pays', sub: 'représentés' },
  { value: '312', label: 'Artisans', sub: 'vérifiés' },
  { value: '98k', label: 'DL', sub: 'ce mois' },
] as const;

const MARQUEE = [
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
    css: 'avs-pattern-wax-lagos',
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
    descColor: 'rgba(245,235,224,.6)',
    href: '/patterns',
    color: '#C0573E',
  },
  {
    num: '02',
    Icon: Palette,
    title: 'Design tokens culturels',
    desc: 'Palettes de pigments naturels africains. Tailwind, Figma, CSS Variables.',
    descColor: 'rgba(245,235,224,.6)',
    href: '/colors',
    color: '#D4A017',
  },
  {
    num: '03',
    Icon: Users,
    title: "Communauté d'artisans",
    desc: '312 artisans vérifiés valident chaque entrée. La source primaire, toujours.',
    descColor: 'rgba(245,235,224,.6)',
    href: '/artisans',
    color: '#4A6741',
  },
  {
    num: '04',
    Icon: BookOpen,
    title: 'Composants & Documentation',
    desc: 'Bibliothèque UI React, templates, icônes SVG. Copy & Paste. Sans compte.',
    descColor: 'rgba(245,235,224,.6)',
    href: '/documentation',
    color: '#2A4A6B',
  },
] as const;

const BENTO = [
  {
    css: 'avs-pattern-ndop-sultan',
    overlay: 'from-[#060F1A]/92 to-[#060F1A]/70',
    span: 'lg:col-span-2',
    minH: '200px',
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
    minH: '200px',
    eyebrow: 'Formats · Licences',
    eyeColor: 'rgba(245,235,224,.6)',
    title: 'SVG · PNG\nJSON · CSS',
    titleColor: '#F5EBE0',
    desc: 'Chaque motif dans 4 formats. CC BY 4.0 — usage libre.',
    descColor: 'rgba(245,235,224,.55)',
    bigNum: '4×',
  },
  {
    solid: '#FFFFFF',
    span: '',
    minH: '180px',
    eyebrow: 'Accès public',
    eyeColor: 'rgba(29,29,27,.4)',
    title: 'Aucun compte\nrequis',
    titleColor: '#1D1D1B',
    desc: "Comme PrimeReact. Tout est public. L'auth est optionnelle — seulement pour contribuer.",
    descColor: 'rgba(29,29,27,.45)',
    checkmark: true,
  },
  {
    solid: '#111009',
    span: 'lg:col-span-2',
    minH: '160px',
    border: 'rgba(245,235,224,.05)',
    eyebrow: 'Design tokens',
    eyeColor: 'rgba(245,235,224,.3)',
    title: 'Intégrez en 30s dans\nFigma, Tailwind, React Native',
    titleColor: '#F5EBE0',
    desc: 'Téléchargez les tokens de couleurs, typographie et spacing pour vos outils',
    descColor: 'rgba(245,235,224,.3)',
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
    css: 'avs-pattern-ndop-ceremoniel',
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
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const itemFade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div
        className={`h-px w-8 ${light ? 'bg-avs-primary/40' : 'bg-avs-primary/60'}`}
        aria-hidden
      />
      <span
        className={`font-mono text-[10px] tracking-[.25em] uppercase ${light ? 'text-avs-primary' : 'text-avs-primary'}`}
      >
        {label}
      </span>
    </div>
  );
}

function CollageCard({ card, floatDelay }: { card: (typeof COLLAGE)[number]; floatDelay: number }) {
  return (
    <motion.div
      className="rounded-avs-xl border-avs-secondary/8 group absolute cursor-pointer overflow-hidden border shadow-[0_24px_64px_rgba(0,0,0,.6)]"
      style={{
        ...card.style,
        rotate: card.style.rotate,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [
          parseFloat(card.style.rotate),
          parseFloat(card.style.rotate) + 0.8,
          parseFloat(card.style.rotate),
        ],
      }}
      transition={{
        duration: 6 + floatDelay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
    >
      <div className={`${card.css} h-full w-full`} />
      <div className="absolute inset-0 bg-linear-to-t from-[#0A0806]/95 via-[#0A0806]/10 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 translate-y-1 p-3 transition-transform duration-300 group-hover:translate-y-0">
        <p className="text-avs-primary font-mono text-[8px] tracking-[.18em] uppercase">
          {card.type}
        </p>
        <p className="font-display text-avs-secondary text-sm leading-tight font-bold">
          {card.name}
        </p>
        <p className="text-avs-secondary text-[10px]">{card.origin}</p>
      </div>
      <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="bg-avs-secondary/10 rounded-full p-1.5 backdrop-blur-sm">
          <ArrowUpRight size={11} className="text-avs-secondary" />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroTranslate = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  return (
    <div className="overflow-x-hidden bg-[#0A0806]">
      {/* ══════════════════════════════════════════════════════
          § 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative min-h-screen overflow-hidden"
      >
        {/* Fond grille fine */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
      linear-gradient(rgba(245, 235, 224, 0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245, 235, 224, 0.12) 1px, transparent 1px)
    `,
            backgroundSize: '60px 60px',
          }}
          aria-hidden
        />
        {/* Halo radial */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 60% 50%, rgba(192, 87, 62, 0.25) 0%, transparent 75%)',
          }}
          aria-hidden
        />
        {/* Lignes verticales */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* Ligne gauche avec opacité augmentée */}
          <div className="via-avs-primary/40 absolute top-0 left-[8%] h-full w-px bg-linear-to-b from-transparent to-transparent" />

          {/* Ligne droite avec opacité augmentée */}
          <div className="via-avs-primary/40 absolute top-0 right-[8%] h-full w-px bg-linear-to-b from-transparent to-transparent" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroTranslate }}
          className="relative mx-auto max-w-7xl px-6 pt-36 pb-28 lg:px-8"
        >
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Texte gauche */}
            <div>
              {/* Eyebrow pill */}
              <motion.div {...fadeUp(0)} className="mb-10">
                <div className="rounded-avs border-avs-primary/30 bg-avs-primary/8 inline-flex items-center gap-2.5 border px-4 py-2 backdrop-blur-sm">
                  <span
                    className="bg-avs-primary h-1.5 w-1.5 animate-pulse rounded-full"
                    aria-hidden
                  />
                  <span className="text-avs-primary font-mono text-[10px] tracking-[.22em] uppercase">
                    African Visual Standard · v1.0
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                id="hero-title"
                {...fadeUp(0.1)}
                className="font-display text-avs-secondary leading-[.9] font-black tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3.5rem,8vw,7rem)' }}
              >
                <span className="block">Le</span>
                <span className="text-avs-primary relative block">
                  langage
                  <span
                    className="bg-avs-primary absolute -bottom-1 left-0 h-0.75"
                    style={{ width: '55%' }}
                    aria-hidden
                  />
                </span>
                <span className="block">visuel de</span>
                <span
                  className="text-avs-secondary block"
                  style={{ WebkitTextStroke: '1px rgba(245,235,224,.2)', color: 'transparent' }}
                >
                  l&apos;Afrique
                </span>
              </motion.h1>

              {/* Sous-titre */}
              <motion.p
                {...fadeUp(0.2)}
                className="text-avs-secondary mt-8 max-w-md text-lg leading-relaxed"
              >
                Nous préservons, documentons et standardisons le patrimoine visuel africain —
                motifs, couleurs et géométrie — pour designers, artisans et développeurs.
              </motion.p>

              {/* CTAs */}
              <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={"/patterns" as Route}
                  className="group rounded-avs bg-avs-primary text-avs-secondary relative inline-flex items-center gap-2 overflow-hidden px-7 py-3.5 text-sm font-bold shadow-[3px_3px_0_rgba(192,87,62,.4)] transition-all hover:-translate-y-px hover:shadow-[5px_5px_0_rgba(192,87,62,.4)]"
                >
                  Explorer les motifs
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href={"/components" as Route}
                  className="rounded-avs border-avs-secondary/12 text-avs-secondary hover:border-avs-secondary/28 hover:text-avs-secondary inline-flex items-center gap-2 border px-7 py-3.5 text-sm font-semibold transition-all"
                >
                  <Star size={13} className="text-avs-primary" aria-hidden />
                  Composants UI
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                {...fadeUp(0.4)}
                className="bg-avs-secondary/10 border-avs-secondary/10 relative mt-14 grid grid-cols-2 gap-px border-y md:grid-cols-4"
              >
                {/* Optionnel : Un léger halo global derrière les stats */}
                <div
                  className="via-avs-primary/5 pointer-events-none absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                  aria-hidden
                />

                {STATS.map(({ value, label, sub }, i) => (
                  <div
                    key={label}
                    className={cn(
                      'group hover:bg-avs-secondary/[0.02] relative overflow-hidden bg-transparent px-6 py-8 transition-all duration-300',
                      // Bordures intelligentes : on évite les doubles bordures
                      i % 2 !== 0 ? 'border-avs-secondary/10 border-l' : '', // Mobile (2 cols)
                      'border-avs-secondary/10 md:border-l md:first:border-l-0', // Desktop (4 cols)
                    )}
                  >
                    {/* Effet de lueur au survol (Spotlight) */}
                    <div className="pointer-events-none absolute -inset-px bg-[radial-gradient(400px_circle_at_center,rgba(192,87,62,0.08),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10">
                      <p className="font-display text-avs-secondary text-[2rem] leading-none font-black tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
                        {value}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        {/* Petite barre décorative style "identitaire" */}
                        <div className="bg-avs-primary h-px w-3" />
                        <p className="text-avs-primary text-[10px] font-bold tracking-[0.15em] uppercase">
                          {label}
                        </p>
                      </div>

                      <p className="text-avs-secondary/60 mt-2 text-[11px] leading-relaxed font-medium">
                        {sub}
                      </p>
                    </div>

                    {/* Décoration d'angle subtile au survol */}
                    <div className="absolute top-0 right-0 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="bg-avs-primary/40 absolute top-2 right-2 h-px w-2" />
                      <div className="bg-avs-primary/40 absolute top-2 right-2 h-2 w-px" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Collage motifs droite */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden h-145 lg:block"
            >
              {COLLAGE.map((card, i) => (
                <CollageCard key={card.name} card={card} floatDelay={i * 1.5} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 2 — MARQUEE
      ══════════════════════════════════════════════════════ */}
      <div
        className="border-avs-secondary/6 bg-avs-primary/6 overflow-hidden border-y py-3"
        aria-hidden
      >
        <div className="flex w-max gap-0" style={{ animation: 'avs-marquee 28s linear infinite' }}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <div
              key={i}
              className="text-avs-primary flex items-center gap-8 px-8 font-mono text-[10px] tracking-[.25em] whitespace-nowrap uppercase"
            >
              {item}
              <span className="bg-avs-primary/28 h-0.75 w-0.75 rounded-full" />
            </div>
          ))}
        </div>
        <style>{`@keyframes avs-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 3 — GALERIE BRISÉE
      ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="gallery-title" className="bg-[#0A0806] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <SectionLabel label="Patrimoine · Motifs en vedette" light />
            <Link
              href={"/patterns" as Route}
              className="text-avs-secondary hover:text-avs-primary flex items-center gap-1.5 text-xs font-semibold transition-colors"
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
                className={`group rounded-avs-xl relative cursor-pointer overflow-hidden ${cls}`}
                style={{ minHeight: i === 0 ? '360px' : '160px' }}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  className={`${css} absolute inset-0 transition-transform duration-700 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0A0806]/90 via-[#0A0806]/10 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-avs-primary/90 text-avs-secondary rounded-sm px-2 py-0.5 font-mono text-[8px] font-bold tracking-[.18em] uppercase backdrop-blur-sm">
                    {type}
                  </span>
                </div>

                {/* Info bas */}
                <div className="absolute right-0 bottom-0 left-0 translate-y-1 p-4 opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-avs-secondary text-sm font-bold">{name}</p>
                  <p className="text-avs-secondary text-[10px]">{origin}</p>
                </div>

                {/* Arrow */}
                <div className="bg-avs-secondary/10 absolute top-3 right-3 rounded-full p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={11} className="text-avs-secondary" aria-hidden />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 4 — PIVOT STAT
      ══════════════════════════════════════════════════════ */}
      <section
        className="avs-pattern-kente-royale relative overflow-hidden py-24"
        aria-label="Impact du standard AVS"
      >
        <div className="absolute inset-0 bg-[#0A0806]/88" aria-hidden />

        {/* Numéro géant en filigrane */}
        <div
          className="font-display text-avs-secondary pointer-events-none absolute right-[-2%] bottom-[-12%] leading-none font-black opacity-[.04] select-none"
          style={{ fontSize: 'clamp(8rem,22vw,18rem)' }}
          aria-hidden
        >
          1248
        </div>

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionLabel label="Héritage · Documentation · Standard" light />

            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-avs-secondary leading-[.9] font-black"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}
            >
              Chaque motif
              <br />
              porte une
              <br />
              <span className="text-avs-primary">histoire</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-avs-secondary mt-6 max-w-md leading-relaxed"
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
              {['CC BY 4.0', 'Open Source', 'Aucun compte requis', 'SVG · PNG · JSON · CSS'].map(
                (tag) => (
                  <span
                    key={tag}
                    className={`rounded-avs border px-4 py-1.5 text-xs ${tag === 'CC BY 4.0' ? 'border-avs-primary/30 bg-avs-primary/10 text-avs-primary' : 'border-avs-secondary/10 text-avs-secondary'}`}
                  >
                    {tag}
                  </span>
                ),
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 5 — FEATURES LISTE ÉDITORIALE
      ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="features-title" className="bg-avs-secondary px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel label="Ce que nous offrons" />
              <h2
                id="features-title"
                className="font-display text-avs-accent leading-[.95] font-black"
                style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}
              >
                Un standard
                <br />
                <span className="text-avs-primary">ouvert</span> & rigoureux
              </h2>
            </div>
            <p className="text-avs-accent/40 max-w-xs text-sm leading-relaxed lg:text-right">
              Tout est accessible sans compte, comme PrimeReact. La connaissance africaine
              appartient à l&apos;humanité.
            </p>
          </div>

          {/* Liste */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="divide-avs-accent/7 divide-y"
          >
            {FEATURES.map(({ num, Icon, title, desc, href, color }) => (
              <motion.div key={title} variants={itemFade}>
                <Link
                  href={href as Route}
                  className="group flex items-center gap-6 py-7 transition-all hover:pl-3 lg:gap-8 lg:py-8"
                >
                  {/* Numéro éditorial */}
                  <span
                    className="font-display text-5xl leading-none font-black tabular-nums opacity-[.07] transition-opacity duration-300 group-hover:opacity-[.14] lg:text-6xl"
                    style={{ color }}
                    aria-hidden
                  >
                    {num}
                  </span>

                  {/* Icône */}
                  <div
                    className="rounded-avs flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `${color}12`, color }}
                  >
                    <Icon size={20} aria-hidden />
                  </div>

                  {/* Texte */}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-avs-accent group-hover:text-avs-primary text-xl font-bold transition-colors">
                      {title}
                    </p>
                    <p className="text-avs-accent/45 mt-1 text-sm leading-relaxed">{desc}</p>
                  </div>

                  {/* Arrow */}
                  <div className="bg-avs-accent/6 group-hover:bg-avs-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full opacity-40 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                    <ArrowUpRight
                      size={15}
                      className="text-avs-accent group-hover:text-avs-secondary"
                      aria-hidden
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 6 — BENTO GRID
      ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="bento-title" className="bg-[#0A0806] px-6 pt-20 pb-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel label="Pourquoi AVS" light />

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
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`rounded-avs-xl relative overflow-hidden ${card.span || ''}`}
                style={{
                  minHeight: card.minH,
                  ...('border' in card && card.border
                    ? { border: `1px solid ${card.border}` }
                    : {}),
                  ...('solid' in card && card.solid ? { background: card.solid } : {}),
                }}
              >
                {/* Pattern bg */}
                {'css' in card && (
                  <>
                    <div className={`${card.css} absolute inset-0`} />
                    <div className={`absolute inset-0 bg-linear-to-br ${card.overlay}`} />
                  </>
                )}

                <div className="relative flex h-full flex-col justify-between p-7">
                  <div>
                    <p
                      className="mb-3 font-mono text-[9px] tracking-[.2em] uppercase"
                      style={{ color: card.eyeColor, opacity: 0.8 }}
                    >
                      {card.eyebrow}
                    </p>
                    <h3
                      className="font-display text-xl leading-tight font-bold"
                      style={{ color: card.titleColor }}
                    >
                      {card.title.split('\n').map((line, j) => (
                        <span key={j} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: card.descColor }}>
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-5">
                    {'chips' in card && (
                      <div className="flex flex-wrap gap-1.5">
                        {card.chips.map((c) => (
                          <span
                            key={c}
                            className="rounded-avs border px-2.5 py-1 font-mono text-[9px]"
                            style={{ color: card.chipColor, borderColor: `${card.chipColor}35` }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {'bigNum' in card && (
                      <p
                        className="font-display text-right text-5xl leading-none font-black"
                        style={{ color: card.titleColor, opacity: 0.15 }}
                        aria-hidden
                      >
                        {card.bigNum}
                      </p>
                    )}
                    {'checkmark' in card && (
                      <div className="bg-avs-ndop/15 flex h-8 w-8 items-center justify-center rounded-full">
                        <Check size={16} className="text-avs-ndop" aria-hidden />
                      </div>
                    )}
                    {'palette' in card && (
                      <div className="mt-4 flex gap-1.5">
                        {card.palette.map((hex) => (
                          <div
                            key={hex}
                            className="rounded-avs first:rounded-l-avs-lg last:rounded-r-avs-lg h-7 flex-1"
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
          § 7 — TÉMOIGNAGES
      ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="testimonials-title" className="bg-[#0C0906] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel label="Ils utilisent AVS" light />

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
                className="group rounded-avs-xl border-avs-secondary/7 bg-avs-secondary/3 hover:border-avs-primary/25 hover:bg-avs-secondary/5 flex flex-col gap-5 border p-7 backdrop-blur-sm transition-all"
              >
                <span
                  className="font-display text-avs-primary text-5xl leading-[.8] select-none"
                  aria-hidden
                >
                  &quot;
                </span>
                <blockquote className="text-avs-secondary -mt-3 flex-1 text-sm leading-[1.75]">
                  {quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    className={`${css} border-avs-secondary/12 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border`}
                  >
                    <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-avs-secondary text-xs font-semibold">
                      {flag} {name}
                    </p>
                    <p className="text-avs-secondary text-[10px]">{role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 8 — CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-title"
        className="avs-pattern-kente-royale relative overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg,rgba(10,8,6,.96) 0%,rgba(26,18,8,.88) 100%)',
          }}
          aria-hidden
        />

        {/* Cercles déco */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="border-avs-primary/10 absolute -top-20 -right-20 h-80 w-80 rounded-full border" />
          <div className="border-avs-primary/16 absolute -top-8 -right-8 h-52 w-52 rounded-full border" />
          <div className="border-avs-kente/10 absolute bottom-0 -left-16 h-48 w-48 rotate-45 border" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 py-32 text-center lg:px-8">
          {/* Badge live */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-avs-primary/30 bg-avs-primary/10 mb-8 inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
          >
            <span className="bg-avs-primary h-1.5 w-1.5 animate-pulse rounded-full" aria-hidden />
            <span className="text-avs-primary font-mono text-[10px] tracking-[.22em] uppercase">
              Open Source · CC BY 4.0 · Gratuit
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="cta-title"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-avs-secondary leading-[.9] font-black tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)' }}
          >
            Construisons
            <br />
            <span className="text-avs-primary">le standard</span>
            <br />
            africain
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-avs-secondary mx-auto mt-8 max-w-md leading-relaxed"
          >
            Artisan, designer, chercheur ou développeur — votre savoir enrichit la plus grande
            archive visuelle africaine open-source du monde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href={"/auth/register" as Route}
              className="group rounded-avs bg-avs-primary text-avs-secondary relative inline-flex items-center gap-2 overflow-hidden px-9 py-4 text-sm font-bold shadow-[3px_3px_0_rgba(192,87,62,.35)] transition-all hover:-translate-y-px hover:shadow-[5px_5px_0_rgba(192,87,62,.35)]"
            >
              Rejoindre gratuitement
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={"/patterns" as Route}
              className="rounded-avs border-avs-secondary/15 text-avs-secondary hover:border-avs-secondary/28 hover:text-avs-secondary inline-flex items-center gap-2 border px-9 py-4 text-sm font-semibold transition-all"
            >
              Explorer d&apos;abord
            </Link>
          </motion.div>

          {/* Avatars communauté */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-14 flex items-center justify-center gap-4"
          >
            <div className="flex">
              {COMMUNITY_AVATARS.map((css, i) => (
                <div
                  key={i}
                  className={`${css} flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#0A0806] ${i > 0 ? '-ml-2.5' : ''}`}
                  style={{ zIndex: 5 - i }}
                >
                  <span className="font-display text-avs-secondary text-xs font-black drop-shadow">
                    {['N', 'A', 'F', 'K', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-avs-secondary text-sm">+312 artisans nous ont déjà rejoints</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
