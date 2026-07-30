'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion,  useMotionValue,  } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Palette,
  Users,
  BookOpen,
  Check,
  Download,
  Coffee,
} from 'lucide-react';
import { cn } from '@buni/ui';
import { Route } from 'next';
import { HeroSection } from '../../components/layout/HeroSection';
import { useTranslations } from '@/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// DATA (moved inside component for i18n)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE KEYFRAME — minimal, no custom CSS vars needed
// ─────────────────────────────────────────────────────────────────────────────
const MARQUEE_STYLE = `@keyframes avs-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease } },
});
const stagger  = { animate: { transition: { staggerChildren: 0.1 } } };
const itemFade = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1400) {
  const [val, setVal]         = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
  return { val, trigger: () => setStarted(true) };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="h-px w-10 bg-avs-primary/60" aria-hidden />
      <span className="font-mono text-[9px] tracking-[.28em] uppercase text-avs-primary">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations('home');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Data with i18n
  const STATS = [
    { value: 1248, display: '1 248', label: t('stats.patterns'),   sub: t('stats.vectorized')  },
    { value: 54,   display: '54',    label: t('stats.countries'),     sub: t('stats.represented') },
    { value: 312,  display: '312',   label: t('stats.artisans'), sub: t('stats.verified')    },
    { value: 98,   display: '98k',   label: t('stats.downloads'),       sub: t('stats.thisMonth')     },
  ] as const;

  const MARQUEE_ITEMS = [
    'KENTE','NDOP','BOGOLAN','ADINKRA','WAX','KUBA',
    'NDEBELE','BERBER','TOGHU','RAPHIA','MAASAI','ANKARA',
  ];

  const GALLERY = [
    { cssClass: 'avs-pattern-ndop-sultan',       type: 'NDOP',    name: 'Ndop Sultan',    origin: 'Foumban · CM', slug: 'ndop-bamoum',      cls: 'lg:col-span-3 lg:row-span-2' },
    { cssClass: 'avs-pattern-kente-royale',      type: 'KENTE',   name: 'Kente Royale',   origin: 'Kumasi · GH',  slug: 'kente-asante',     cls: 'lg:col-span-2'               },
    { cssClass: 'avs-pattern-adinkra-sankofa',   type: 'ADINKRA', name: 'Adinkra Sankofa',origin: 'Akan · GH',    slug: 'adinkra-akan', cls: ''                            },
    { cssClass: 'avs-pattern-kuba-kasai',        type: 'KUBA',    name: 'Kuba Kasai',     origin: 'Kasai · CD',   slug: 'kuba-kasai',      cls: ''                            },
    { cssClass: 'avs-pattern-bogolan-fanga',     type: 'BOGOLAN', name: 'Bogolan Fanga',  origin: 'Ségou · ML',   slug: 'bogolan-malien',   cls: 'lg:col-span-2'               },
  ] as const;

  const FEATURES = [
    {
      num: '01', Icon: Layers,   title: t('features.patternLibrary.title'),
      desc: t('features.patternLibrary.desc'),
      href: '/patterns',
      accentClass: 'text-avs-primary',  bgClass: 'bg-avs-primary/8',
    },
    {
      num: '02', Icon: Palette,  title: t('features.designTokens.title'),
      desc: t('features.designTokens.desc'),
      href: '/colors',
      accentClass: 'text-avs-kente',    bgClass: 'bg-avs-kente/8',
    },
    {
      num: '03', Icon: Users,    title: t('features.artisanCommunity.title'),
      desc: t('features.artisanCommunity.desc'),
      href: '/artisans',
      accentClass: 'text-avs-ndop',     bgClass: 'bg-avs-ndop/8',
    },
    {
      num: '04', Icon: BookOpen, title: t('features.documentation.title'),
      desc: t('features.documentation.desc'),
      href: '/documentation',
      accentClass: 'text-avs-indigo',   bgClass: 'bg-avs-indigo/8',
    },
  ] as const;

  const PIVOT_STATS = [
    { num: '1 248', label: t('pivotStats.documentedPatterns'),    accentClass: 'text-avs-primary' },
    { num: '54',    label: t('pivotStats.representedCountries'),     accentClass: 'text-avs-kente'   },
    { num: '312',   label: t('pivotStats.verifiedArtisans'),    accentClass: 'text-avs-ndop'    },
    { num: '98k',   label: t('pivotStats.downloadsPerMonth'), accentClass: 'text-avs-indigo'  },
  ] as const;

  const BENTO = [
    {
      css: 'avs-pattern-ndop-sultan',
      overlay: 'from-avs-accent/94 to-avs-accent/72',
      span: 'lg:col-span-2',
      minH: '220px',
      eyebrow: t('bento.copyPaste.eyebrow'),
      eyeClass: 'text-avs-raffia',
      titleClass: 'text-avs-secondary',
      title: t('bento.copyPaste.title'),
      desc: t('bento.copyPaste.desc'),
      descClass: 'text-avs-secondary/50',
      chips: ['Button', 'PatternCard', 'SvgPattern', 'Toast'],
      chipClass: 'text-avs-raffia border-avs-raffia/30 bg-avs-raffia/8',
    },
    {
      solidClass: 'bg-avs-primary',
      span: '',
      minH: '220px',
      eyebrow: t('bento.formats.eyebrow'),
      eyeClass: 'text-avs-secondary/65',
      titleClass: 'text-avs-secondary',
      title: t('bento.formats.title'),
      desc: t('bento.formats.desc'),
      descClass: 'text-avs-secondary/55',
      bigNum: '4×',
    },
    {
      solidClass: 'bg-avs-accent',
      span: '',
      minH: '200px',
      eyebrow: t('bento.publicAccess.eyebrow'),
      eyeClass: 'text-avs-secondary/60',
      titleClass: 'text-avs-secondary',
      title: t('bento.publicAccess.title'),
      desc: t('bento.publicAccess.desc'),
      descClass: 'text-avs-secondary/50',
      checkmark: true,
    },
    {
      solidClass: 'bg-avs-secondary',
      borderClass: 'border border-avs-accent/10',
      span: 'lg:col-span-2',
      minH: '170px',
      eyebrow: t('bento.designTokens.eyebrow'),
      eyeClass: 'text-avs-accent/45',
      titleClass: 'text-avs-accent',
      title: t('bento.designTokens.title'),
      desc: t('bento.designTokens.desc'),
      descClass: 'text-avs-accent/45',
      palette: ['#C0573E','#F5EBE0','#1D1D1B','#D4A017','#4A6741','#2A4A6B','#8B4513','#C8A96E'],
    },
  ] as const;

  const TESTIMONIALS = [
    {
      css: 'avs-pattern-kente-royale',
      quote: t('testimonials.ama.quote'),
      name: 'Ama Asantewaa', flag: '🇬🇭', role: t('testimonials.ama.role'),
    },
    {
      css: 'avs-pattern-adinkra-sankofa',
      quote: t('testimonials.njoya.quote'),
      name: 'Njoya Hamidou', flag: '🇨🇲', role: t('testimonials.njoya.role'),
    },
    {
      css: 'avs-pattern-wax-dakar',
      quote: t('testimonials.amara.quote'),
      name: 'Dr. Amara Diop', flag: '🇸🇳', role: t('testimonials.amara.role'),
    },
  ] as const;

  const COMMUNITY_AVATARS = [
    'avs-pattern-kente-royale',
    'avs-pattern-ndop-sultan',
    'avs-pattern-bogolan-fanga',
    'avs-pattern-adinkra-sankofa',
    'avs-pattern-kuba-kasai',
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{MARQUEE_STYLE}</style>

      <div className="overflow-x-hidden bg-avs-secondary ">

        {/* ══ § 1 — HERO ══════════════════════════════════════════════════ */}
        <HeroSection />

        {/* ══ § 2 — MARQUEE ═══════════════════════════════════════════════ */}
        <div
          className="overflow-hidden py-3 bg-avs-primary/5 border-y border-avs-accent/8"
          aria-hidden
        >
          <div className="flex w-max" style={{ animation: 'avs-marquee 30s linear infinite' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-8 px-8 font-mono text-[9px] tracking-[.28em] whitespace-nowrap uppercase text-avs-primary"
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-avs-primary/40" />
              </div>
            ))}
          </div>
        </div>

        {/* ══ § 3 — GALLERY ═══════════════════════════════════════════════ */}
        <section aria-labelledby="gallery-title" className="px-6 py-20 lg:px-8 bg-avs-secondary-dark">
          
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <SectionLabel label={t('gallery.label')} />
              <Link
                href={'/patterns' as Route}
                className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent/45 hover:text-avs-primary transition-colors"
              >
                {t('gallery.viewAll')} <ArrowRight size={12} />
              </Link>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-2 gap-2 lg:grid-cols-6 lg:grid-rows-2"
            >
              {GALLERY.map(({ cssClass, type, name, origin, slug, cls }, i) => (
                <Link
                  key={name}
                  href={`/patterns?pattern=${slug}` as Route}
                  className={`group relative overflow-hidden rounded-2xl block ${cls}`}
                  style={{ minHeight: i === 0 ? '380px' : '165px' }}
                >
                  <motion.div
                    variants={itemFade}
                    whileHover={{ scale: 1.014 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="h-full"
                  >
                    <div className={`${cssClass} absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]`} />
                    {/* Dark-to-transparent gradient — justified inline: complex multi-stop positional gradient */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top,rgba(10,8,6,.92) 0%,rgba(10,8,6,.08) 55%,transparent 100%)' }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md px-2 py-0.5 font-mono text-[8px] font-bold tracking-[.2em] uppercase backdrop-blur-sm bg-avs-primary/85 text-avs-secondary">
                        {type}
                      </span>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 translate-y-1.5 p-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-display text-sm font-bold text-avs-secondary">{name}</p>
                      <p className="text-[10px] text-avs-secondary/60">{origin}</p>
                    </div>
                    <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 bg-avs-secondary/10">
                      <ArrowUpRight size={11} className="text-avs-secondary" aria-hidden />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ § 4 — PIVOT STAT (always dark — pattern-imposed) ════════════ */}
        <section className="avs-pattern-kente-royale relative overflow-hidden py-28" aria-label="Impact AVS">
          {/* Semi-opaque dark overlay — justified inline: opacity not tokenisable */}
          <div className="absolute inset-0 bg-avs-accent/89" aria-hidden />

          {/* Watermark number */}
          <div
            className="font-display pointer-events-none absolute right-[-2%] bottom-[-14%] leading-none font-black select-none text-avs-secondary/3"
            style={{ fontSize: 'clamp(8rem,22vw,20rem)' }}
            aria-hidden
          >
            1248
          </div>

          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <SectionLabel label={t('pivot.label')} />
                <motion.h2
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                  className="font-display leading-[.9] font-black text-avs-secondary"
                  style={{ fontSize: 'clamp(2.5rem,5vw,4.25rem)', letterSpacing: '-0.025em' }}
                >
                  {t('pivot.title1')}<br />{t('pivot.title2')}<br />
                  <span className="text-avs-primary">{t('pivot.title3')}</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mt-6 max-w-md leading-relaxed text-avs-secondary/55"
                >
                  {t('pivot.description')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-8 flex flex-wrap gap-2"
                >
                  {[t('pivot.tag1'), t('pivot.tag2'), t('pivot.tag3'), t('pivot.tag4')].map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-xl px-4 py-1.5 text-xs font-medium ${
                        tag === t('pivot.tag1')
                          ? 'bg-avs-primary/12 border border-avs-primary/28 text-avs-primary'
                          : 'border border-avs-secondary/10 text-avs-secondary/70'
                      }`}
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
                {PIVOT_STATS.map(({ num, label, accentClass }) => (
                  <div key={label} className="rounded-2xl p-5 bg-avs-secondary/4 border border-avs-secondary/6">
                    <p className={`font-display text-3xl leading-none font-black ${accentClass}`} style={{ letterSpacing: '-0.02em' }}>
                      {num}
                    </p>
                    <p className="mt-2 text-xs leading-snug text-avs-secondary/45">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ § 5 — FEATURES ══════════════════════════════════════════════ */}
        <section aria-labelledby="features-title" className="px-6 py-24 lg:px-8 bg-avs-secondary">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionLabel label={t('features.label')} />
                <h2
                  id="features-title"
                  className="font-display leading-[.92] font-black text-avs-accent"
                  style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', letterSpacing: '-0.025em' }}
                >
                  {t('features.title1')}<br />
                  <span className="text-avs-primary">{t('features.title2')}</span> &amp; {t('features.title3')}
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed lg:text-right text-avs-accent/45">
                {t('features.description')}
              </p>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="divide-y divide-avs-accent/8"
            >
              {FEATURES.map(({ num, Icon, title, desc, href, accentClass, bgClass }) => (
                <motion.div key={title} variants={itemFade}>
                  <Link
                    href={href as Route}
                    className="group flex items-center gap-6 py-7 transition-all duration-300 lg:gap-8 lg:py-8 hover:pl-3"
                  >
                    <span
                      className={`font-display shrink-0 leading-none font-black tabular-nums ${accentClass} opacity-[0.08]`}
                      style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)' }}
                      aria-hidden
                    >
                      {num}
                    </span>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${bgClass} ${accentClass}`}>
                      <Icon size={20} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-display text-xl font-bold transition-colors duration-200 text-avs-accent group-hover:${accentClass}`}>
                        {title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-avs-accent/45">{desc}</p>
                    </div>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 bg-avs-accent/8 opacity-45 group-hover:opacity-100 group-hover:${bgClass}`}>
                      <ArrowUpRight size={15} className="text-avs-accent" aria-hidden />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ § 6 — BENTO ═════════════════════════════════════════════════ */}
        <section aria-labelledby="bento-title" className="px-6 pt-20 pb-24 lg:px-8 bg-avs-secondary">
          <div className="mx-auto max-w-6xl">
            <SectionLabel label={t('bento.label')} />
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
                  className={`
                    relative overflow-hidden rounded-2xl
                    ${'solidClass' in card ? card.solidClass : ''}
                    ${'borderClass' in card ? card.borderClass : 'border border-avs-accent/8'}
                    ${card.span || ''}
                  `}
                  style={{ minHeight: card.minH }}
                >
                  {'css' in card && (
                    <>
                      <div className={`${card.css} absolute inset-0`} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.overlay}`} />
                    </>
                  )}

                  <div className="relative flex h-full flex-col justify-between p-7">
                    <div>
                      <p className={`mb-3 font-mono text-[8px] tracking-[.22em] uppercase opacity-85 ${card.eyeClass}`}>
                        {card.eyebrow}
                      </p>
                      <h3 className={`font-display text-xl leading-tight font-bold ${card.titleClass}`} style={{ letterSpacing: '-0.015em' }}>
                        {card.title.split('\n').map((line, j) => (
                          <span key={j} className="block">{line}</span>
                        ))}
                      </h3>
                      <p className={`mt-2.5 text-sm leading-relaxed ${card.descClass}`}>{card.desc}</p>
                    </div>

                    <div className="mt-6">
                      {'chips' in card && (
                        <div className="flex flex-wrap gap-1.5">
                          {card.chips.map((c) => (
                            <span key={c} className={`rounded-lg border px-2.5 py-1 font-mono text-[9px] font-medium ${card.chipClass}`}>
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {'bigNum' in card && (
                        <p
                          className={`font-display text-right leading-none font-black ${card.titleClass} opacity-[0.12]`}
                          style={{ fontSize: '5rem', letterSpacing: '-0.04em' }}
                          aria-hidden
                        >
                          {card.bigNum}
                        </p>
                      )}
                      {'checkmark' in card && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-avs-ndop/18">
                          <Check size={17} className="text-avs-ndop" aria-hidden />
                        </div>
                      )}
                      {'palette' in card && (
                        <div className="mt-5 flex gap-1.5">
                          {card.palette.map((hex) => (
                            <div
                              key={hex}
                              className="h-7 flex-1 rounded-lg shadow-avs first:rounded-l-xl last:rounded-r-xl"
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

        {/* ══ § 7 — TESTIMONIALS ══════════════════════════════════════════ */}
        <section aria-labelledby="testimonials-title" className="px-6 py-24 lg:px-8 bg-avs-secondary-dark">
          <div className="mx-auto max-w-6xl">
            <SectionLabel label={t('testimonials.label')} />
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
                  className="group flex flex-col gap-5 rounded-2xl p-7 backdrop-blur-sm transition-all duration-300 bg-avs-accent/3 border border-avs-accent/8 hover:bg-avs-secondary/70 hover:border-avs-primary/22"
                >
                  <span
                    className="font-display text-5xl leading-[.8] select-none text-avs-primary"
                    style={{ fontFamily: 'Georgia,serif' }}
                    aria-hidden
                  >
                    &quot;
                  </span>
                  <blockquote className="-mt-3 flex-1 text-sm leading-[1.8] text-avs-accent/72">
                    {quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div className={`${css} relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-avs-accent/14`}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="font-display text-sm font-black text-avs-secondary drop-shadow">
                          {name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-avs-accent">{flag} {name}</p>
                      <p className="text-[10px] text-avs-accent/45">{role}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ § 8 — CTA (always dark — kente-imposed) ═════════════════════ */}
        <section aria-labelledby="cta-title" className="avs-pattern-kente-royale relative overflow-hidden">
          {/* Gradient overlay from top-left */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-avs-accent/94 to-avs-accent/72"
            aria-hidden
          />

          {/* Geometric decor rings */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-avs-primary/9" />
            <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full border border-avs-primary/14" />
            <div className="absolute top-12 right-20 h-20 w-20 rounded-full border border-avs-secondary/4" />
            <div className="absolute -bottom-12 -left-16 h-56 w-56 rotate-45 border border-avs-kente/8" />
          </div>

          {/* Adinkra watermark */}
          <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 opacity-[.03]" aria-hidden>
            <div className="avs-pattern-adinkra-sankofa h-full w-full" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 py-32 text-center lg:px-8">
            

            <motion.h2
              id="cta-title"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              className="font-display leading-[.9] font-black tracking-[-0.025em] text-avs-secondary"
              style={{ fontSize: 'clamp(2.75rem,7vw,5.75rem)' }}
            >
              {t('cta.title1')}<br />
              <span className="text-avs-primary">{t('cta.title2')}</span><br />
              {t('cta.title3')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-md leading-relaxed text-avs-secondary/52"
            >
              {t('cta.description')}
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
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-9 py-4 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                {t('cta.joinFree')}{' '}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={'/patterns' as Route}
                className="inline-flex items-center gap-2 rounded-xl px-9 py-4 text-sm font-semibold border border-avs-secondary/14 text-avs-secondary/75 hover:border-avs-secondary/28 hover:text-avs-secondary transition-all duration-200"
              >
                {t('cta.exploreFirst')}
              </Link>
              <button
                onClick={() => window.open('https://ko-fi.com/yourusername', '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold border border-avs-primary/30 text-avs-primary hover:bg-avs-primary/10 hover:border-avs-primary transition-all duration-200"
                aria-label="Offer me a coffee on Ko-fi"
              >
                <Coffee size={14} />
                <span>Offer me a coffee</span>
              </button>
            </motion.div>

            {/* Community avatars */}
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
                    className={`${css} relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-avs-accent ${i > 0 ? '-ml-2.5' : ''}`}
                    style={{ zIndex: 5 - i }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="font-display text-xs font-black text-avs-secondary drop-shadow">
                        {['N','A','F','K','S'][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-avs-secondary/60">
                +312 artisans nous ont déjà rejoints
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[.16em] uppercase text-avs-secondary/25"
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