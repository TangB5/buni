'use client';

import Link from 'next/link';
import { Route } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, Check, Command, Copy, MoveDown } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA — the hero IS a live instance of the design system, not a picture of it
// ─────────────────────────────────────────────────────────────────────────────
type PatternFamily = {
  id: string;
  css: string;        // texture class already defined in the global pattern stylesheet
  code: string;        // short mono code, e.g. KENTE
  name: string;        // display name
  country: string;
  flag: string;        // ISO-ish 2-letter tag used as a mono label
  symbolism: string;
  colors: readonly [string, string, string, string];
};

const PATTERNS: readonly PatternFamily[] = [
  {
    id: 'kente',
    css: 'avs-pattern-kente-royale',
    code: 'KENTE',
    name: 'Kente Royale',
    country: 'Ghana',
    flag: 'GH',
    symbolism: 'Royauté · Sagesse',
    colors: ['#C0573E', '#D4A017', '#1D1D1B', '#F5EBE0'],
  },
  {
    id: 'ndop',
    css: 'avs-pattern-ndop-sultan',
    code: 'NDOP',
    name: 'Ndop Sultan',
    country: 'Cameroun',
    flag: 'CM',
    symbolism: 'Autorité · Ancêtres',
    colors: ['#2A4A6B', '#F5EBE0', '#8B4513', '#1D1D1B'],
  },
  {
    id: 'adinkra',
    css: 'avs-pattern-adinkra-sankofa',
    code: 'ADINKRA',
    name: 'Adinkra Sankofa',
    country: 'Ghana',
    flag: 'GH',
    symbolism: 'Mémoire · Retour aux sources',
    colors: ['#1D1D1B', '#C8A96E', '#F5EBE0', '#C0573E'],
  },
  {
    id: 'bogolan',
    css: 'avs-pattern-bogolan-fanga',
    code: 'BOGOLAN',
    name: 'Bogolan Fanga',
    country: 'Mali',
    flag: 'ML',
    symbolism: 'Force · Protection',
    colors: ['#8B4513', '#D4A017', '#1D1D1B', '#F5EBE0'],
  },
  {
    id: 'kuba',
    css: 'avs-pattern-kuba-kasai',
    code: 'KUBA',
    name: 'Kuba Kasaï',
    country: 'RD Congo',
    flag: 'CD',
    symbolism: 'Géométrie sacrée',
    colors: ['#4A6741', '#C8A96E', '#1D1D1B', '#F5EBE0'],
  },
  {
    id: 'wax',
    css: 'avs-pattern-wax-dakar',
    code: 'WAX',
    name: 'Wax Dakar',
    country: 'Sénégal',
    flag: 'SN',
    symbolism: 'Récit populaire',
    colors: ['#C0573E', '#2A4A6B', '#D4A017', '#F5EBE0'],
  },
  {
    id: 'maasai',
    css: 'avs-pattern-maasai',
    code: 'MAASAI',
    name: 'Maasai',
    country: 'Kenya',
    flag: 'KE',
    symbolism: 'Rites de passage',
    colors: ['#C0573E', '#1D1D1B', '#F5EBE0', '#D4A017'],
  },
  {
    id: 'ndebele',
    css: 'avs-pattern-ndebele',
    code: 'NDEBELE',
    name: 'Ndebele',
    country: 'Afrique du Sud',
    flag: 'ZA',
    symbolism: 'Identité · Statut',
    colors: ['#4A6741', '#C0573E', '#D4A017', '#1D1D1B'],
  },
] as const;

const FOOTNOTES = [
  { mark: '01', value: '1 248', label: 'motifs documentés' },
  { mark: '02', value: '54', label: 'pays représentés' },
  { mark: '03', value: '312', label: 'artisans-conservateurs' },
  { mark: '04', value: '0', label: 'motif sans provenance vérifiée' },
] as const;

const COMMUNITY_AVATARS = [
  { letter: 'A', bg: '#C0573E' },
  { letter: 'N', bg: '#2A4A6B' },
  { letter: 'K', bg: '#4A6741' },
  { letter: 'F', bg: '#D4A017' },
  { letter: 'S', bg: '#8B4513' },
] as const;

const COUNTRIES = [
  'Ghana', 'Mali', 'Nigéria', 'Sénégal', 'Cameroun', 'Kenya',
  'Afrique du Sud', 'RD Congo', 'Éthiopie', 'Maroc', "Côte d'Ivoire", 'Tanzanie',
] as const;

const AUTO_ADVANCE_MS = 4200;
const RESUME_AFTER_MS = 9000;
const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const HERO_STYLES = `
  @keyframes avs-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes avs-float1  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes avs-float2  { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(3px)} }

  .avs-marquee-track { animation: avs-marquee 34s linear infinite; }
  .avs-marquee-track:hover { animation-play-state: paused; }

  .avs-chip-float-a { animation: avs-float1 5s ease-in-out infinite; }
  .avs-chip-float-b { animation: avs-float2 4.2s ease-in-out infinite; }

  .avs-footnote-mark {
    font-family: var(--font-mono, monospace);
    font-size: 0.32em;
    vertical-align: super;
    letter-spacing: 0;
    color: #C0573E;
    margin-left: 0.06em;
  }

  @media (prefers-reduced-motion: reduce) {
    .avs-marquee-track, .avs-chip-float-a, .avs-chip-float-b { animation: none !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SMALL REUSABLE PIECES
// ─────────────────────────────────────────────────────────────────────────────
function FormatChip({
  label, bg, className, style,
}: { label: string; bg: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`rounded-lg px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[.12em] text-white ${className ?? ''}`}
      style={{ background: bg, backdropFilter: 'blur(8px)', ...style }}
    >
      {label}
    </span>
  );
}



// ── Signature element: a live, self-playing inspector of the system itself ──
function PatternInspector({
  active, index, onSelect, paused, copiedHex, onCopy, reduceMotion,
}: {
  active: PatternFamily;
  index: number;
  onSelect: (i: number) => void;
  paused: boolean;
  copiedHex: string | null;
  onCopy: (hex: string) => void;
  reduceMotion: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        border: '1px solid rgba(245,235,224,.10)',
        background: 'rgba(10,8,6,.86)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 24px 60px -20px rgba(0,0,0,.55)',
      }}
    >
      {/* progress rail — shows the autoplay countdown, like a stories UI */}
      <div className="flex gap-1 px-4 pt-4" aria-hidden>
        {PATTERNS.map((p, i) => (
          <div key={p.id} className="h-0.5 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(245,235,224,.14)' }}>
            {i === index && !paused && !reduceMotion && (
              <motion.div
                key={`${p.id}-${paused}`}
                className="h-full"
                style={{ background: '#C0573E' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
              />
            )}
            {i === index && (paused || reduceMotion) && (
              <div className="h-full w-full" style={{ background: '#C0573E' }} />
            )}
          </div>
        ))}
      </div>

      {/* header: family tabs, clickable, doubles as navigation */}
      <div className="flex flex-wrap gap-1 sm:gap-1.5 px-3 sm:px-4 pt-2 sm:pt-3">
        {PATTERNS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => onSelect(i)}
            className="rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widset transition-colors"
            style={{
              color: i === index ? '#F5EBE0' : 'rgba(245,235,224,.4)',
              background: i === index ? 'rgba(192,87,62,.9)' : 'transparent',
            }}
          >
            {p.code}
          </button>
        ))}
      </div>

      {/* main swatch */}
      <div className="relative m-3 sm:m-4 aspect-16/10 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(245,235,224,.08)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className={`${active.css} absolute inset-0`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
          />
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 p-2 sm:p-3">
          <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[.2em]" style={{ color: 'rgba(245,235,224,.5)' }}>
            {active.code} · {active.flag}
          </p>
          <p className="mt-0.5 text-[12px] sm:text-[14px] font-semibold" style={{ color: '#F5EBE0' }}>
            {active.name}
          </p>
        </div>
        <div className="absolute right-2 sm:right-3 top-2 sm:top-3 rounded-md px-1.5 sm:px-2 py-0.5" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)' }}>
          <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[.14em]" style={{ color: '#F5EBE0' }}>
            {active.country}
          </p>
        </div>
      </div>

      {/* inspector readout — hex tokens (click to copy), symbolism, formats */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <p className="mb-2 font-mono text-[7px] sm:text-[8px] uppercase tracking-[.18em]" style={{ color: '#C0573E' }}>
          Tokens — cliquer pour copier
        </p>
        <div className="flex gap-1 sm:gap-1.5">
          {active.colors.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => onCopy(hex)}
              aria-label={`Copier le token ${hex}`}
              className="group relative h-7 sm:h-8 flex-1 overflow-hidden rounded-md transition-transform hover:-translate-y-0.5"
              style={{ background: hex }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: 'rgba(0,0,0,.35)' }}
              >
                {copiedHex === hex ? (
                  <Check size={10} color="#F5EBE0" />
                ) : (
                  <Copy size={10} color="#F5EBE0" />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <p className="text-[10px] sm:text-[11px]" style={{ color: 'rgba(245,235,224,.55)' }}>
            {active.symbolism}
          </p>
          <div className="flex gap-0.5 sm:gap-1">
            {['SVG', 'CSS', 'JSON', 'PNG'].map((f) => (
              <span key={f} className="font-mono text-[6px] sm:text-[7.5px] uppercase tracking-wiset" style={{ color: 'rgba(245,235,224,.35)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked exit for the whole hero
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroTranslate = useTransform(scrollYProgress, [0, 0.65], [0, -56]);

  // Signature element state — autoplaying, pausable pattern inspector
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PATTERNS.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  const handleSelect = useCallback((i: number) => {
    setIndex(i);
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, []);

  const handleCopy = useCallback((hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex((c) => (c === hex ? null : c)), 1200);
  }, []);

  // Ambient parallax for the floating chips (disabled under reduced motion)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const chipX = useTransform(smx, (v) => v * 14);
  const chipY = useTransform(smy, (v) => v * 14);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mx, my, reduceMotion]);

  const active = PATTERNS[index];

  return (
    <>
      <style>{HERO_STYLES}</style>

      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        onMouseMove={handleMouseMove}
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'var(--hp-bg)' }}
      >
        {/* ── Ambient background: grid + faint texture + bloom ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(var(--hp-grid) 1px,transparent 1px),linear-gradient(90deg,var(--hp-grid) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          className="pointer-events-none absolute -top-[10%] -right-[5%] h-150 w-150rounded-full"
          aria-hidden
          style={{ background: 'radial-gradient(circle,rgba(192,87,62,.13) 0%,transparent 65%)' }}
        />
        <div className="avs-pattern-kente-royale pointer-events-none absolute inset-0 opacity-[.02]" aria-hidden />

        <motion.div style={{ opacity: heroOpacity, y: heroTranslate }} className="relative flex min-h-screen flex-col">
         

          {/* ══════════════════════════════════════════
              HEADLINE — full width, editorial, footnoted
          ══════════════════════════════════════════ */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-12 sm:pt-14 lg:px-8">
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease }}
              className="font-display leading-[.92] font-black tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem,8vw,5rem)', color: 'var(--hp-text)' }}
            >
              <span className="block">
                Chaque motif
              </span>
              <span className="block" style={{ color: '#C0573E' }}>
                a une histoire
              </span>
              <span className="block">
                Nous l&rsquo;avons codée.
              </span>
            </motion.h1>

            {/* ══════════════════════════════════════════
              ASYMMETRIC ROW — copy left, live system right
          ══════════════════════════════════════════ */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* — Left: explanation, CTAs, social proof — */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34, ease }}
                className="max-w-md text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.8]"
                style={{ color: 'var(--hp-muted)' }}
              >
                <strong style={{ color: 'var(--hp-text)', fontWeight: 600 }}>312 artisans-conservateurs</strong>{' '}
                vérifient<sup className="avs-footnote-mark">04</sup> l&rsquo;origine, la symbolique et les droits
                d&rsquo;usage de chaque motif avant qu&rsquo;il ne devienne un token — prêt pour la production,
                sans compte requis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42, ease }}
                className="mt-6 sm:mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href={'/patterns' as Route}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: '#C0573E', boxShadow: '4px 4px 0 rgba(192,87,62,.38),0 8px 24px rgba(192,87,62,.25)' }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden
                  />
                  Explorer le système
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={'/components' as Route}
                  className="inline-flex items-center gap-2 rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold transition-all duration-200"
                  style={{ border: '1px solid var(--hp-ghost-border)', color: 'var(--hp-ghost-text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hp-ghost-hover-b)';
                    e.currentTarget.style.color = 'var(--hp-ghost-hover-t)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hp-ghost-border)';
                    e.currentTarget.style.color = 'var(--hp-ghost-text)';
                  }}
                >
                  <Command size={13} />
                  Voir la documentation
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease }}
                className="mt-6 sm:mt-7 flex items-center gap-3"
              >
                <div className="flex">
                  {COMMUNITY_AVATARS.map(({ letter, bg }, i) => (
                    <div
                      key={letter}
                      className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full font-display text-[11px] font-black text-white"
                      style={{ background: bg, border: '2px solid var(--hp-bg)', marginLeft: i > 0 ? '-8px' : 0, zIndex: 5 - i }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--hp-hint)' }}>
                  <span style={{ color: 'var(--hp-muted)', fontWeight: 600 }}>+312 artisans</span> vérifient chaque motif
                </p>
              </motion.div>
            </div>

            {/* — Right: the live inspector, offset lower for editorial asymmetry — */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
              className="relative lg:col-span-1 order-1 lg:order-2 lg:mt-0"
            >
              {/* floating verified badge - desktop only */}
              <motion.div
                className="avs-chip-float-a absolute -top-4 sm:-top-6 left-2 sm:left-4 z-10 hidden lg:block"
                style={reduceMotion ? undefined : { x: chipX, y: chipY }}
              >
                <FormatChip label="Provenance vérifiée" bg="rgba(74,103,65,.9)" />
              </motion.div>

              {/* floating format chips - desktop only */}
              <motion.div
                className="avs-chip-float-b absolute -right-2 sm:-right-3 top-6 sm:top-8 z-10 flex flex-col gap-1.5 hidden lg:flex"
                style={reduceMotion ? undefined : { x: chipX, y: chipY }}
              >
                <FormatChip label="Tailwind" bg="rgba(42,74,107,.9)" />
                <FormatChip label="Figma" bg="rgba(212,160,23,.9)" />
              </motion.div>

              <PatternInspector
                active={active!}
                index={index}
                onSelect={handleSelect}
                paused={paused}
                copiedHex={copiedHex}
                onCopy={handleCopy}
                reduceMotion={!!reduceMotion}
              />
            </motion.div>
          </div>
            

            {/* footnote strip — the "receipts" for the claim above */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
              className="grid grid-cols-2 sm:flex"
              style={{ border: '1px solid var(--hp-border)', background: 'var(--hp-faint)' }}
            >
              {FOOTNOTES.map(({ mark, value, label }, i) => (
                <div key={mark} className="relative px-3 sm:px-4 py-3 sm:py-3">
                  {i > 0 && i % 2 === 0 && (
                    <div className="absolute top-[20%] left-0 hidden h-[60%] w-px sm:block" style={{ background: 'var(--hp-border)' }} aria-hidden />
                  )}
                  <p className="font-mono text-[8px] sm:text-[9px]" style={{ color: '#C0573E' }}>{mark}</p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-black leading-none" style={{ color: 'var(--hp-text)' }}>{value}</p>
                  <p className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase leading-tight tracking-widset" style={{ color: 'var(--hp-hint)' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          

          
        </motion.div>
      </section>
    </>
  );
}