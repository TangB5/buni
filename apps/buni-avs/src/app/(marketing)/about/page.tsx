
import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ValueCard } from './value-card';
import { TeamCard } from './team-card';

export const metadata: Metadata = {
  title: 'À propos — AVS',
  description: "La mission, les valeurs et l'équipe derrière le standard visuel africain.",
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    iconName: 'shield' as const,
    title: 'Rigueur Ethnographique',
    color: '#C0573E',
    text: "Chaque motif est validé par des artisans de terrain et des chercheurs spécialisés. Pas de romantisation, pas d'appropriation : de la documentation factuelle.",
  },
  {
    iconName: 'heart' as const,
    title: 'Souveraineté Culturelle',
    color: '#D4A017',
    text: "Les communautés sources ont un droit de regard permanent sur leur patrimoine. AVS est un outil de préservation, jamais d'extraction.",
  },
  {
    iconName: 'globe' as const,
    title: 'Accès Universel',
    color: '#4A6741',
    text: "La majorité des ressources est libre et gratuite (CC BY 4.0). Le savoir africain appartient à l'humanité entière, à commencer par les Africains.",
  },
  {
    iconName: 'book' as const,
    title: 'Traçabilité Totale',
    color: '#2A4A6B',
    text: 'Chaque token de couleur, chaque motif, chaque symbole porte la trace de sa source : artisan, région, époque, signification documentée.',
  },
] as const;

const TEAM = [
  { name: 'Dr. Amara Diop',   role: 'Fondateur & Directeur Ethnographique', origin: '🇸🇳 Dakar',    pattern: 'avs-pattern-wax-dakar'     },
  { name: 'Ngozi Okonkwo',    role: 'Directrice Design & Standard',         origin: '🇳🇬 Lagos',    pattern: 'avs-pattern-kente-royale'  },
  { name: 'Jean-Paul Kamdem', role: 'Lead Ingénierie & Archivage',          origin: '🇨🇲 Yaoundé',  pattern: 'avs-pattern-ndop-sultan'   },
  { name: 'Aïcha Ben Salah',  role: 'Recherche Afrique du Nord',            origin: '🇹🇳 Tunis',    pattern: 'avs-pattern-bogolan-fanga' },
  { name: 'Thabo Mokoena',    role: 'Communauté & Partenariats Artisans',   origin: "🇿🇦 Jo'burg",  pattern: 'avs-pattern-adinkra-sankofa'},
] as const;

const TIMELINE = [
  { year: '2019', event: 'Première réunion fondatrice à Dakar — 12 chercheurs, 3 pays',         highlight: false },
  { year: '2020', event: 'Lancement du prototype avec 200 motifs documentés',                    highlight: false },
  { year: '2021', event: 'Partenariats avec 5 musées africains et 3 universités',                highlight: false },
  { year: '2022', event: 'Version beta publique — 850 motifs, 120 artisans vérifiés',            highlight: false },
  { year: '2023', event: 'Intégration dans Figma, Tailwind et Adobe Color',                      highlight: false },
  { year: '2024', event: 'v1.0 — 1 248 motifs, 54 pays, standard ouvert officiel',              highlight: true  },
] as const;

const NUMBERS = [
  { value: '1 248', label: 'Motifs documentés' },
  { value: '54',    label: 'Pays représentés'  },
  { value: '312',   label: 'Artisans vérifiés' },
  { value: '5 ans', label: "D'archive vivante" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE (Server Component — no 'use client' needed)
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* ── Global styles (injected once, SSR-safe) ────────────────────── */}
      <style>{`
        :root {
          --about-bg:          #faf8f5;
          --about-surface:     #ffffff;
          --about-border:      rgba(29,29,27,0.09);
          --about-border-md:   rgba(29,29,27,0.15);
          --about-text:        #1D1D1B;
          --about-muted:       rgba(29,29,27,0.55);
          --about-hint:        rgba(29,29,27,0.35);
          --about-primary:     #C0573E;
          --about-primary-10:  rgba(192,87,62,0.08);
          --about-primary-20:  rgba(192,87,62,0.18);
          --about-dark-bg:     #0A0806;
          --about-dark-text:   #F5EBE0;
        }
        .dark {
          --about-bg:          #111110;
          --about-surface:     #1a1917;
          --about-border:      rgba(255,255,255,0.07);
          --about-border-md:   rgba(255,255,255,0.13);
          --about-text:        #ece8e1;
          --about-muted:       rgba(236,232,225,0.50);
          --about-hint:        rgba(236,232,225,0.30);
          --about-primary:     #d4694e;
          --about-primary-10:  rgba(212,105,78,0.10);
          --about-primary-20:  rgba(212,105,78,0.20);
          --about-dark-bg:     #0d0b09;
          --about-dark-text:   #ece8e1;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .anim-fade-up   { animation: fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-delay-1   { animation-delay: 0.10s; }
        .anim-delay-2   { animation-delay: 0.20s; }
        .anim-delay-3   { animation-delay: 0.30s; }
        .anim-delay-4   { animation-delay: 0.42s; }

        .value-card:hover .value-icon { transform: scale(1.08); }
        .value-icon { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }

        .tl-dot-active { box-shadow: 0 0 0 4px rgba(192,87,62,0.20); }

        .team-card:hover .team-pattern { transform: scale(1.04); }
        .team-pattern { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      <div style={{ background: 'var(--about-bg)', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════════════════
            § 1 — HERO MANIFESTE
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="manifesto-title"
          className="avs-pattern-ndop-sultan relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8"
        >
          {/* Layered dark gradient */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.96) 100%)' }}
            aria-hidden
          />
          {/* Warm halo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(192,87,62,0.18) 0%, transparent 70%)' }}
            aria-hidden
          />
          {/* Fine grid overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(245,235,224,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,235,224,.05) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden
          />
          {/* Decorative rings */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.08)' }} />
            <div className="absolute left-1/2 top-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.12)' }} />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="anim-fade-up mb-7 inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
              style={{ background: 'rgba(192,87,62,0.10)', borderColor: 'rgba(192,87,62,0.28)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#C0573E' }} aria-hidden />
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase" style={{ color: '#C0573E' }}>
                Notre Mission
              </span>
            </div>

            {/* Headline */}
            <h1
              id="manifesto-title"
              className="anim-fade-up anim-delay-1 font-display font-black leading-[.9] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.75rem,7vw,5.5rem)', color: '#F5EBE0' }}
            >
              Nommer, Préserver,<br />
              <span style={{ color: '#C0573E' }}>Transmettre</span>
            </h1>

            {/* Animated underline */}
            <div className="mx-auto mt-4 h-0.5 w-24 origin-left rounded-full" style={{ background: '#C0573E', animation: 'line-grow 0.7s 0.6s cubic-bezier(0.22,1,0.36,1) both' }} aria-hidden />

            {/* Subtitle */}
            <p
              className="anim-fade-up anim-delay-2 mx-auto mt-8 max-w-xl text-lg leading-relaxed"
              style={{ color: 'rgba(245,235,224,0.60)' }}
            >
              Le patrimoine visuel africain est le plus riche et le plus diversifié du monde.
              Il mérite un standard aussi rigoureux que Unicode l&apos;est pour l&apos;écriture.
            </p>

            {/* Stat pills */}
            <div className="anim-fade-up anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
              {NUMBERS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl px-5 py-2.5"
                  style={{ background: 'rgba(245,235,224,0.06)', border: '1px solid rgba(245,235,224,0.10)' }}
                >
                  <span className="font-display text-xl font-black" style={{ color: '#F5EBE0', letterSpacing: '-0.02em' }}>{value}</span>
                  <span className="ml-2 font-mono text-[10px] tracking-wide" style={{ color: 'rgba(245,235,224,0.45)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 2 — VALEURS
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="values-title"
          className="px-4 py-24 sm:px-6 lg:px-8"
          style={{ background: 'var(--about-bg)', borderBottom: '1px solid var(--about-border)' }}
        >
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
                  <span className="font-mono text-[9px] tracking-[0.26em] uppercase" style={{ color: '#C0573E' }}>Principes</span>
                </div>
                <h2
                  id="values-title"
                  className="font-display font-black leading-[.92]"
                  style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', color: 'var(--about-text)', letterSpacing: '-0.025em' }}
                >
                  Ce qui nous guide
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed lg:text-right" style={{ color: 'var(--about-muted)' }}>
                Quatre engagements fondateurs qui orientent chaque décision editoriale et technique du standard AVS.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {VALUES.map(({ iconName, title, text, color }, i) => (
                <ValueCard key={title} iconName={iconName} title={title} text={text} color={color} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 3 — TIMELINE
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="history-title"
          className="avs-pattern-kente-royale relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(10,8,6,0.92)' }} aria-hidden />
          {/* Warm ambient */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(192,87,62,0.10) 0%, transparent 70%)' }} aria-hidden />

          <div className="relative mx-auto max-w-4xl">
            {/* Section header */}
            <div className="mb-16 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
                <span className="font-mono text-[9px] tracking-[0.26em] uppercase" style={{ color: '#C0573E' }}>Histoire</span>
                <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
              </div>
              <h2
                id="history-title"
                className="font-display font-black leading-tight"
                style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', color: '#F5EBE0', letterSpacing: '-0.025em' }}
              >
                5 ans de construction
              </h2>
            </div>

            {/* Two-column timeline on desktop */}
            <div className="grid gap-x-16 lg:grid-cols-2">
              {/* Left — first 3 entries */}
              <ol className="relative space-y-0" aria-label="Chronologie AVS (partie 1)">
                <div className="absolute left-1.75 top-2 bottom-2 w-px" style={{ background: 'rgba(192,87,62,0.22)' }} aria-hidden />
                {TIMELINE.slice(0, 3).map(({ year, event, highlight }) => (
                  <li key={year} className="relative pb-10 pl-9 last:pb-0">
                    <div
                      className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full ${highlight ? 'tl-dot-active' : ''}`}
                      style={{
                        background: highlight ? '#C0573E' : 'rgba(192,87,62,0.30)',
                        border: highlight ? '2px solid #C0573E' : '2px solid rgba(192,87,62,0.50)',
                      }}
                      aria-hidden
                    />
                    <time className="font-mono text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: '#C0573E' }}>{year}</time>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.65)' }}>{event}</p>
                  </li>
                ))}
              </ol>

              {/* Right — last 3 entries */}
              <ol className="relative mt-10 space-y-0 lg:mt-0" aria-label="Chronologie AVS (partie 2)">
                <div className="absolute left-1.75 top-2 bottom-2 w-px" style={{ background: 'rgba(192,87,62,0.22)' }} aria-hidden />
                {TIMELINE.slice(3).map(({ year, event, highlight }) => (
                  <li key={year} className="relative pb-10 pl-9 last:pb-0">
                    <div
                      className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full ${highlight ? 'tl-dot-active' : ''}`}
                      style={{
                        background: highlight ? '#C0573E' : 'rgba(192,87,62,0.30)',
                        border: highlight ? '2px solid #C0573E' : '2px solid rgba(192,87,62,0.50)',
                      }}
                      aria-hidden
                    />
                    <time className="font-mono text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: '#C0573E' }}>{year}</time>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.65)' }}>{event}</p>
                    {highlight && (
                      <span
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] font-bold tracking-wide uppercase"
                        style={{ background: 'rgba(192,87,62,0.15)', border: '1px solid rgba(192,87,62,0.30)', color: '#C0573E' }}
                      >
                        <span className="h-1 w-1 rounded-full" style={{ background: '#C0573E' }} aria-hidden />
                        Aujourd&apos;hui
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 4 — ÉQUIPE
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="team-title"
          className="px-4 py-24 sm:px-6 lg:px-8"
          style={{ background: 'var(--about-bg)' }}
        >
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-14 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
                <span className="font-mono text-[9px] tracking-[0.26em] uppercase" style={{ color: '#C0573E' }}>Équipe</span>
                <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
              </div>
              <h2
                id="team-title"
                className="font-display font-black leading-tight"
                style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', color: 'var(--about-text)', letterSpacing: '-0.025em' }}
              >
                Des visages derrière le standard
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: 'var(--about-muted)' }}>
                Une équipe distribuée à travers le continent, unie par la même conviction.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {TEAM.map(({ name, role, origin, pattern }) => (
                <TeamCard key={name} name={name} role={role} origin={origin} pattern={pattern} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            § 5 — CTA REJOINDRE
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="join-title"
          className="avs-pattern-bogolan-fanga relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.97) 0%, rgba(26,18,8,0.92) 60%, rgba(50,28,10,0.86) 100%)' }}
            aria-hidden
          />
          {/* Decorative rings */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.09)' }} />
            <div className="absolute -top-8 -right-8 h-52 w-52 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.14)' }} />
            {/* Bottom-left diamond */}
            <div className="absolute -bottom-10 -left-14 h-52 w-52 rotate-45" style={{ border: '1px solid rgba(212,160,23,0.08)' }} />
          </div>
          {/* Pattern vignette corner */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 opacity-[.04]" aria-hidden>
            <div className="avs-pattern-adinkra-sankofa h-full w-full" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
              style={{ background: 'rgba(192,87,62,0.10)', borderColor: 'rgba(192,87,62,0.28)' }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#C0573E' }} aria-hidden />
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase" style={{ color: '#C0573E' }}>
                Contribuer au standard
              </span>
            </div>

            <h2
              id="join-title"
              className="font-display font-black leading-[.92] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.25rem,5vw,4rem)', color: '#F5EBE0' }}
            >
              Vous avez un savoir<br />
              <span style={{ color: '#C0573E' }}>à partager ?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-md leading-relaxed" style={{ color: 'rgba(245,235,224,0.52)' }}>
              Artisan, chercheur, designer — votre expertise enrichit le standard.
              Rejoignez les 312 contributeurs du monde entier.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={"/auth/register" as Route}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#C0573E',
                  boxShadow: '4px 4px 0 rgba(192,87,62,0.36), 0 8px 24px rgba(192,87,62,0.22)',
                }}
              >
                {/* Shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                Contribuer au standard
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
              href={"/patterns" as Route}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-200"
                style={{ border: '1px solid rgba(245,235,224,0.14)', color: 'rgba(245,235,224,0.75)' }}
              >
                Explorer la bibliothèque
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-10 font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: 'rgba(245,235,224,0.22)' }}>
              312 artisans · 54 pays · CC BY 4.0 · Gratuit
            </p>
          </div>
        </section>

      </div>
    </>
  );
}