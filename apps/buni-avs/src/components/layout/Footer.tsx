'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const LINKS = {
  Standard: [
    { href: '/patterns',  label: 'Motifs culturels'   },
    { href: '/colors',    label: 'Palettes & tokens'  },
    { href: '/artisans',  label: 'Réseau artisans'    },
  ],
  Ressources: [
    { href: '/about',         label: 'Notre mission'  },
    { href: '/documentation', label: 'Documentation'  },
    { href: '/auth/register', label: 'Contribuer'     },
  ],
  Légal: [
    { href: '/privacy',  label: 'Confidentialité' },
    { href: '/terms',    label: 'Conditions'       },
    { href: '/licenses', label: 'Licences CC'      },
  ],
} as const;

const SOCIALS = [
  {
    label: 'Twitter / X',
    href:  'https://twitter.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href:  'https://github.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  'https://instagram.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Site web',
    href:  'https://avs-standard.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const FOOTER_STYLES = `
  .ftr-email-input {
    flex: 1;
    background: rgba(245,235,224,0.06);
    color: #F5EBE0;
    border: 1.5px solid rgba(245,235,224,0.12);
    border-radius: 0.75rem;
    padding: 0.6875rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    min-width: 0;
    font-family: inherit;
  }
  .ftr-email-input::placeholder { color: rgba(245,235,224,0.35); }
  .ftr-email-input:focus {
    border-color: rgba(192,87,62,0.55);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.12);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer
        className="relative overflow-hidden"
        style={{ background: '#0A0806', borderTop: '1px solid rgba(245,235,224,0.06)' }}
      >
        {/* ── Background effects ─────────────────────────────────────────── */}
        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,235,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,235,224,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />
        {/* Warm halo — bottom-left */}
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-[480px] w-[480px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(192,87,62,0.28) 0%, transparent 70%)', filter: 'blur(72px)' }}
          aria-hidden
        />
        {/* Kente pattern vignette — top-right */}
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-[0.03]" aria-hidden>
          <div className="avs-pattern-kente-royale h-full w-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          {/* ══════════════════════════════════════════════════════
              NEWSLETTER STRIP
          ══════════════════════════════════════════════════════ */}
          <div
            className="mb-14 grid grid-cols-1 gap-8 pb-14 lg:grid-cols-3 lg:items-center"
            style={{ borderBottom: '1px solid rgba(245,235,224,0.07)' }}
          >
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-6" style={{ background: '#C0573E' }} aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase" style={{ color: '#C0573E' }}>
                  Newsletter
                </span>
              </div>
              <h3
                className="font-display font-bold leading-snug"
                style={{ fontSize: 'clamp(1rem,2.5vw,1.35rem)', color: '#F5EBE0', letterSpacing: '-0.015em' }}
              >
                Rejoignez la transmission du patrimoine.
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.50)' }}>
                Recevez les nouveaux motifs documentés et les mises à jour des standards UI — aucun spam.
              </p>
            </div>

            {/* Email form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex max-w-md gap-2"
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="ftr-email-input"
                aria-label="Adresse email pour la newsletter"
              />
              <button
                type="submit"
                className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: '#C0573E', boxShadow: '0 4px 16px rgba(192,87,62,0.30)', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(192,87,62,0.38)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(192,87,62,0.30)')}
              >
                {/* Shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                S&apos;inscrire <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

          {/* ══════════════════════════════════════════════════════
              BRAND + LINKS GRID
          ══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-4 lg:grid-cols-5">

            {/* Brand column */}
            <div className="col-span-2 lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="avs-pattern-kente-royale relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-105">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="font-display text-base font-black text-white drop-shadow-md">A</span>
                  </div>
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className="font-display font-black"
                    style={{ fontSize: '1.15rem', color: '#F5EBE0', letterSpacing: '-0.02em' }}
                  >AVS</span>
                  <span
                    className="font-mono font-bold uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#C0573E' }}
                  >African Visual Standard</span>
                </div>
              </div>

              {/* Description */}
              <p
                className="mt-5 max-w-xs text-sm leading-relaxed"
                style={{ color: 'rgba(245,235,224,0.48)' }}
              >
                Le premier standard open-source dédié à la préservation, la documentation et la
                numérisation du patrimoine visuel africain.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-2">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
                    style={{ border: '1px solid rgba(245,235,224,0.10)', color: 'rgba(245,235,224,0.45)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,87,62,0.40)';
                      (e.currentTarget as HTMLElement).style.color = '#C0573E';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(192,87,62,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,235,224,0.10)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(245,235,224,0.45)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                    aria-label={label}
                  >
                    {icon}
                  </a>
                ))}
              </div>

              {/* Open source badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{ background: 'rgba(245,235,224,0.04)', border: '1px solid rgba(245,235,224,0.08)' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4A6741' }} aria-hidden />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(245,235,224,0.35)' }}>
                  Apache 2.0 + Commons Clause
                </span>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([title, items]) => (
              <div key={title} className="col-span-1">
                <h3 className="mb-5 font-mono text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: '#C0573E' }}>
                  {title}
                </h3>
                <ul className="space-y-3">
                  {items.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href as Route}
                        className="group flex items-center gap-1.5 text-sm transition-colors duration-150"
                        style={{ color: 'rgba(245,235,224,0.48)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EBE0')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,235,224,0.48)')}
                      >
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          {label}
                        </span>
                        <ArrowRight
                          size={11}
                          className="-translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                          style={{ color: '#C0573E', flexShrink: 0 }}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════
              BOTTOM BAR
          ══════════════════════════════════════════════════════ */}
          <div
            className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
            style={{ borderTop: '1px solid rgba(245,235,224,0.07)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(245,235,224,0.30)' }}>
              © 2026 AVS — African Visual Standard. Tous droits réservés.
            </p>

            <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(245,235,224,0.28)' }}>
              <span className="flex items-center gap-1.5">
                Fait avec{' '}
                <span style={{ color: '#C0573E' }}>♥</span>
                {' '}pour le patrimoine
              </span>
              <span className="h-3 w-px" style={{ background: 'rgba(245,235,224,0.12)' }} aria-hidden />
              <span className="font-mono text-[9px] tracking-wide">v1.0.0</span>
              <span className="h-3 w-px" style={{ background: 'rgba(245,235,224,0.12)' }} aria-hidden />
              <a
                href="https://github.com/avs-standard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C0573E')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,235,224,0.28)')}
              >
                GitHub <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;