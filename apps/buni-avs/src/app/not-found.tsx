import Link from 'next/link';
import { ArrowLeft, Search, Layers } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: 'Bibliothèque de motifs', href: '/patterns',         icon: Layers },
  { label: 'Rechercher un motif',    href: '/patterns?search=', icon: Search },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  :root {
    --nf-bg:         #faf8f5;
    --nf-surface:    #ffffff;
    --nf-border:     rgba(29,29,27,0.09);
    --nf-border-md:  rgba(29,29,27,0.16);
    --nf-text:       #1D1D1B;
    --nf-muted:      rgba(29,29,27,0.55);
    --nf-hint:       rgba(29,29,27,0.25);
    --nf-primary:    #C0573E;
    --nf-primary-10: rgba(192,87,62,0.08);
    --nf-primary-20: rgba(192,87,62,0.18);
  }
  .dark {
    --nf-bg:         #111110;
    --nf-surface:    #1a1917;
    --nf-border:     rgba(255,255,255,0.07);
    --nf-border-md:  rgba(255,255,255,0.13);
    --nf-text:       #ece8e1;
    --nf-muted:      rgba(236,232,225,0.50);
    --nf-hint:       rgba(236,232,225,0.25);
    --nf-primary:    #d4694e;
    --nf-primary-10: rgba(212,105,78,0.10);
    --nf-primary-20: rgba(212,105,78,0.22);
  }

  @keyframes nf-float {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(1deg); }
  }
  @keyframes nf-spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes nf-fade-up {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .nf-float      { animation: nf-float 6s ease-in-out infinite; }
  .nf-spin-slow  { animation: nf-spin-slow 20s linear infinite; }

  .nf-anim-1 { animation: nf-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .nf-anim-2 { animation: nf-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
  .nf-anim-3 { animation: nf-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.30s both; }
  .nf-anim-4 { animation: nf-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.44s both; }
  .nf-anim-5 { animation: nf-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.58s both; }

  .nf-ghost-btn {
    display: flex; align-items: center; gap: 0.5rem;
    border-radius: 0.75rem;
    border: 1.5px solid var(--nf-border-md);
    padding: 0.6875rem 1.25rem;
    font-size: 0.8125rem; font-weight: 600;
    color: var(--nf-muted);
    transition: border-color 0.18s, color 0.18s, transform 0.18s;
  }
  .nf-ghost-btn:hover {
    border-color: var(--nf-primary-20);
    color: var(--nf-primary);
    transform: translateY(-1px);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE (Server Component)
// ─────────────────────────────────────────────────────────────────────────────
export default function NotFound() {
  return (
    <>
      <style>{STYLES}</style>

      <div
        className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-20"
        style={{ background: 'var(--nf-bg)' }}
      >
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(var(--nf-border) 1px,transparent 1px),linear-gradient(90deg,var(--nf-border) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.5,
          }}
          aria-hidden
        />
        {/* Warm halo */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(192,87,62,.07) 0%,transparent 70%)', filter: 'blur(48px)' }}
          aria-hidden
        />

        {/* ── Geometric illustration ──────────────────────────────────────── */}
        <div className="nf-anim-1 relative mb-10" aria-hidden>
          {/* Outer rotating ring */}
          <div
            className="nf-spin-slow absolute -inset-6 rounded-full"
            style={{ border: '1px solid rgba(192,87,62,0.14)' }}
          />
          {/* Mid ring */}
          <div
            className="absolute -inset-2 rounded-full"
            style={{ border: '1px solid var(--nf-border-md)' }}
          />

          {/* Floating pattern disk */}
          <div className="nf-float relative h-40 w-40">
            <div className="avs-pattern-adinkra-sankofa absolute inset-0 rounded-full opacity-70" />
            {/* Dark overlay for contrast */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(10,8,6,0.55)' }}
            />
            {/* 404 label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-display font-black leading-none drop-shadow-lg"
                style={{ fontSize: '3.5rem', color: '#C0573E', letterSpacing: '-0.04em' }}
              >
                404
              </span>
            </div>
          </div>

          {/* Corner pattern swatches */}
          <div className="avs-pattern-kente-royale absolute -top-2 -right-2 h-8 w-8 rounded-xl ring-2 ring-white dark:ring-zinc-900 shadow-md" />
          <div className="avs-pattern-ndop-sultan absolute -bottom-2 -left-2 h-6 w-6 rounded-lg ring-2 ring-white dark:ring-zinc-900 shadow-sm" />
        </div>

        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <h1
          className="nf-anim-2 font-display text-center font-black leading-tight"
          style={{ fontSize: 'clamp(1.75rem,5vw,2.75rem)', color: 'var(--nf-text)', letterSpacing: '-0.025em' }}
        >
          Motif Introuvable
        </h1>

        {/* Decorative underline */}
        <div
          className="nf-anim-2 mt-2 h-0.5 w-16 rounded-full"
          style={{ background: '#C0573E', opacity: 0.5 }}
          aria-hidden
        />

        {/* ── Body text ───────────────────────────────────────────────────── */}
        <p
          className="nf-anim-3 mt-5 max-w-sm text-center text-sm leading-relaxed"
          style={{ color: 'var(--nf-muted)' }}
        >
          Cette page n&apos;existe pas ou a été déplacée.
          Revenez à l&apos;accueil ou explorez la bibliothèque.
        </p>

        {/* ── CTA buttons ─────────────────────────────────────────────────── */}
        <div className="nf-anim-4 mt-8 flex flex-wrap justify-center gap-3">
          {/* Primary CTA */}
          <Link
            href="/"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--nf-primary)',
              boxShadow: '4px 4px 0 rgba(192,87,62,.32),0 6px 20px rgba(192,87,62,.20)',
            }}
          >
            {/* Shimmer */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden
            />
            <ArrowLeft size={13} aria-hidden />
            Retour à l&apos;accueil
          </Link>

          {/* Ghost CTAs */}
          {SUGGESTIONS.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} className="nf-ghost-btn">
              <Icon size={13} aria-hidden />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Easter egg — Adinkra Sankofa ────────────────────────────────── */}
        <div className="nf-anim-5 mt-16 flex flex-col items-center gap-3">
          {/* Mini Sankofa avatar */}
          <div
            className="avs-pattern-adinkra-sankofa h-8 w-8 rounded-full opacity-40"
            aria-hidden
          />
          <p
            className="max-w-xs text-center text-xs italic leading-relaxed"
            style={{ color: 'var(--nf-hint)' }}
          >
            En Adinkra, &laquo;&nbsp;Sankofa&nbsp;&raquo; enseigne qu&apos;il faut retourner
            en arrière pour avancer.
          </p>
        </div>
      </div>
    </>
  );
}