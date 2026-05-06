'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const HERO_STATS = [
  { num: '1·248', label: 'Motifs SVG' },
  { num: '54',    label: 'Pays' },
  { num: '312',   label: 'Artisans' },
  { num: '98k',   label: 'DL / mois' },
] as const;

const COMMUNITY_AVATARS = [
  { letter: 'A', bg: '#C0573E' },
  { letter: 'N', bg: '#2A4A6B' },
  { letter: 'K', bg: '#4A6741' },
  { letter: 'F', bg: '#D4A017' },
  { letter: 'S', bg: '#8B4513' },
] as const;

// 9 pattern cells — (css class, type label, gridSpan?)
const PATTERN_CELLS = [
  { css: 'avs-pattern-kente-royale',    type: 'KENTE',   span: 'col-span-2' },
  { css: 'avs-pattern-ndop-sultan',     type: 'NDOP',    span: 'row-span-2' },
  { css: 'avs-pattern-adinkra-sankofa', type: 'ADINKRA', span: '' },
  { css: 'avs-pattern-bogolan-fanga',   type: 'BOGOLAN', span: '' },
  { css: 'avs-pattern-kuba-kasai',      type: 'KUBA',    span: '' },
  { css: 'avs-pattern-wax-dakar',       type: 'WAX',     span: '' },
  { css: 'avs-pattern-maasai',          type: 'MAASAI',  span: '' },
  { css: 'avs-pattern-ndebele',         type: 'NDEBELE', span: '' },
] as const;

const TOKEN_COLORS = [
  '#C0573E', '#D4A017', '#F5EBE0',
  '#4A6741', '#2A4A6B', '#8B4513', '#C8A96E', '#1D1D1B',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES (scoped to hero — merge into your global STYLES const if preferred)
// ─────────────────────────────────────────────────────────────────────────────
const HERO_STYLES = `
  @keyframes avs-float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes avs-float2 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(3px)} }
  @keyframes avs-float3 { 0%,100%{transform:translateY(0px)} 60%{transform:translateY(-8px)} }
  @keyframes avs-pulse-ring {
    0%  { transform:scale(1); opacity:.5 }
    100%{ transform:scale(1.5); opacity:0 }
  }

  .avs-hero-anno-1 { animation: avs-float1 4s   ease-in-out infinite; }
  .avs-hero-anno-2 { animation: avs-float2 5s   ease-in-out infinite; }
  .avs-hero-anno-3 { animation: avs-float3 3.8s ease-in-out infinite; }

  .avs-badge-dot::after {
    content:'';
    position:absolute; inset:-4px;
    border-radius:50%;
    border:1px solid rgba(192,87,62,.55);
    animation: avs-pulse-ring 1.6s ease-out infinite;
  }

  .avs-pcell:hover .avs-poverlay  { opacity:1 }
  .avs-pcell:hover .avs-pat       { transform:scale(1.07) }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease } },
});

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
export function HeroSection() {
    
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity   = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroTranslate = useTransform(scrollYProgress, [0, 0.65], [0, -56]);

  // Cursor spring (keep if you use it elsewhere; remove if unused)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 18 });
  useEffect(() => {
    const h = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{HERO_STYLES}</style>

      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'var(--hp-bg)' }}
      >
        {/* ── Subtle grid ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(var(--hp-grid) 1px,transparent 1px),linear-gradient(90deg,var(--hp-grid) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* ── Radial bloom (top-right) ── */}
        <div
          className="pointer-events-none absolute -top-[10%] -right-[5%] h-[600px] w-[600px] rounded-full"
          aria-hidden
          style={{ background: 'radial-gradient(circle,rgba(192,87,62,.13) 0%,transparent 65%)' }}
        />

        {/* ── Faint texture ── */}
        <div
          className="avs-pattern-kente-royale pointer-events-none absolute inset-0 opacity-[.025]"
          aria-hidden
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroTranslate }}
          className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pt-24 pb-28 lg:grid-cols-2 lg:px-8"
        >
          {/* ══════════════════════════════════════════
              LEFT — headline, CTAs, stats
          ══════════════════════════════════════════ */}
          <div>

            

            {/* — Headline — */}
            <motion.h1
              id="hero-title"
              {...fadeUp(0.10)}
              className="font-display leading-[.88] font-black tracking-[-0.035em]"
              style={{ fontSize: 'clamp(3.25rem,8vw,6.5rem)', color: 'var(--hp-text)' }}
            >
              <span className="block" style={{ color: '#C0573E' }}>Le standard</span>
              <span className="block">visuel</span>
              <span className="block">de l'Afrique</span>
              {/* Subscript — typographic signature */}
              <span
                className="mt-1 block font-mono font-normal"
                style={{ fontSize: '.18em', letterSpacing: '.22em', color: 'var(--hp-hint)', opacity: .7 }}
              >
                — Design System
              </span>
            </motion.h1>

            {/* — Sub — */}
            <motion.p
              {...fadeUp(0.18)}
              className="mt-7 max-w-md text-[15px] leading-[1.8]"
              style={{ color: 'var(--hp-muted)' }}
            >
              <strong style={{ color: 'var(--hp-text)', fontWeight: 600 }}>1 248 motifs.</strong>{' '}
              54 pays. 312 artisans vérifiés.
              <br />
              L'héritage africain en tokens, composants et SVG
              <br />
              prêts pour la production — sans compte requis.
            </motion.p>

            {/* — CTAs — */}
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={'/patterns' as Route}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#C0573E',
                  boxShadow: '4px 4px 0 rgba(192,87,62,.38),0 8px 24px rgba(192,87,62,.25)',
                }}
              >
                {/* shimmer */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                Explorer les motifs
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={'/components' as Route}
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-200"
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
                ⌘ Copy &amp; paste
              </Link>
            </motion.div>

            {/* — Stats row — */}
            <motion.div
              {...fadeUp(0.30)}
              className="mt-8 overflow-hidden rounded-2xl"
              style={{ border: '1px solid var(--hp-border)', background: 'var(--hp-faint)' }}
            >
              <div className="grid grid-cols-4">
                {HERO_STATS.map(({ num, label }, i) => (
                  <div
                    key={label}
                    className="relative px-5 py-4"
                  >
                    {i > 0 && (
                      <div
                        className="absolute top-[20%] left-0 h-[60%] w-px"
                        style={{ background: 'var(--hp-border)' }}
                        aria-hidden
                      />
                    )}
                    <p
                      className="font-display text-2xl font-black leading-none"
                      style={{ color: 'var(--hp-text)', letterSpacing: '-0.025em' }}
                    >
                      {num}
                    </p>
                    <p
                      className="mt-1.5 font-mono text-[9px] uppercase tracking-[.16em]"
                      style={{ color: 'var(--hp-hint)' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* — Artisan social proof — */}
            <motion.div {...fadeUp(0.36)} className="mt-5 flex items-center gap-3">
              <div className="flex">
                {COMMUNITY_AVATARS.map(({ letter, bg }, i) => (
                  <div
                    key={letter}
                    className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full font-display text-[11px] font-black text-white"
                    style={{
                      background: bg,
                      border: '2px solid var(--hp-bg)',
                      marginLeft: i > 0 ? '-8px' : 0,
                      zIndex: 5 - i,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--hp-hint)' }}>
                <span style={{ color: 'var(--hp-muted)', fontWeight: 600 }}>+312 artisans</span>{' '}
                vérifient chaque motif
              </p>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════
              RIGHT — system preview (pattern grid)
          ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
            className="relative hidden lg:block"
          >
            {/* ── Floating annotation: pattern name ── */}
            <div
              className="avs-hero-anno-1 absolute -top-6 left-2 z-10 rounded-xl px-4 py-3"
              style={{
                background: 'rgba(10,8,6,.82)',
                border: '1px solid rgba(245,235,224,.10)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="font-mono text-[8px] uppercase tracking-[.2em]" style={{ color: 'rgba(245,235,224,.42)' }}>
                KENTE · GH
              </p>
              <p className="mt-0.5 text-[13px] font-semibold" style={{ color: '#F5EBE0' }}>
                Kente Royale
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(245,235,224,.38)' }}>
                SVG · PNG · JSON · CSS
              </p>
            </div>

            {/* ── Floating annotation: symbolisme ── */}
            <div
              className="avs-hero-anno-2 absolute -bottom-4 right-1 z-10 rounded-xl px-4 py-3"
              style={{ background: '#C0573E', border: '1px solid rgba(255,255,255,.12)' }}
            >
              <p className="font-mono text-[8px] uppercase tracking-[.16em]" style={{ color: 'rgba(255,255,255,.68)' }}>
                Symbolisme
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-white">
                Royauté · Fertilité
              </p>
            </div>

            {/* ── Floating annotation: token swatch ── */}
            <div
              className="avs-hero-anno-3 absolute left-[-20px] top-1/2 z-10 -translate-y-1/2 rounded-xl px-3 py-3"
              style={{
                background: 'rgba(10,8,6,.82)',
                border: '1px solid rgba(245,235,224,.10)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[.18em]" style={{ color: '#C0573E' }}>
                Tokens
              </p>
              <div className="flex gap-1">
                {['#C0573E', '#D4A017', '#4A6741', '#2A4A6B'].map((hex) => (
                  <div key={hex} className="h-3.5 w-3.5 rounded-[3px]" style={{ background: hex }} />
                ))}
              </div>
            </div>

            {/* ── Format chips ── */}
            <div className="absolute -right-2 top-0 z-10 flex flex-col gap-1.5">
              {(
                [
                  { label: 'SVG',  bg: 'rgba(192,87,62,.88)'  },
                  { label: 'CSS',  bg: 'rgba(74,103,65,.88)'  },
                  { label: 'JSON', bg: 'rgba(42,74,107,.88)'  },
                  { label: 'PNG',  bg: 'rgba(212,160,23,.88)' },
                ] as const
              ).map(({ label, bg }) => (
                <span
                  key={label}
                  className="rounded-lg px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[.12em] text-white"
                  style={{ background: bg, backdropFilter: 'blur(8px)' }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* ── Pattern grid ── */}
            <div
              className="grid aspect-square grid-cols-3 grid-rows-3 gap-1.5 overflow-hidden rounded-2xl"
              style={{ border: '1px solid rgba(245,235,224,.08)' }}
            >
              {PATTERN_CELLS.map(({ css, type, span }) => (
                <div
                  key={type}
                  className={`avs-pcell group relative cursor-pointer overflow-hidden ${span}`}
                >
                  <div
                    className={`${css} avs-pat absolute inset-0 transition-transform duration-500`}
                  />
                  {/* hover overlay */}
                  <div
                    className="avs-poverlay absolute inset-0 flex items-end p-2 opacity-0 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,.42)' }}
                  >
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[.15em]"
                      style={{ background: 'rgba(192,87,62,.85)', color: '#F5EBE0' }}
                    >
                      {type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Token strip ── */}
            <div
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'var(--hp-faint)', border: '1px solid var(--hp-border)' }}
            >
              <span
                className="shrink-0 font-mono text-[8px] uppercase tracking-[.18em]"
                style={{ color: 'var(--hp-hint)' }}
              >
                Pigments
              </span>
              <div className="flex flex-1 gap-1">
                {TOKEN_COLORS.map((hex) => (
                  <div
                    key={hex}
                    className="h-5 flex-1 rounded-md first:rounded-l-lg last:rounded-r-lg"
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 shrink-0">
                {(['Tailwind', 'Figma', 'CSS'] as const).map((f) => (
                  <span
                    key={f}
                    className="rounded-md px-2 py-1 font-mono text-[8px] uppercase tracking-[.08em]"
                    style={{
                      background: 'var(--hp-faint)',
                      border: '1px solid var(--hp-border)',
                      color: 'var(--hp-hint)',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}