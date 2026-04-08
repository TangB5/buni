import Link from 'next/link';
import { ArrowLeft, Search, Layers } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Bibliothèque de motifs', href: '/patterns', icon: Layers },
  { label: 'Rechercher un motif',    href: '/patterns?search=', icon: Search },
] as const;

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-avs-secondary px-4 py-20">

      {/* Décoration géométrique */}
      <div aria-hidden className="relative mb-10">
        <div className="avs-pattern-ndop h-40 w-40 rounded-full opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl font-black text-avs-primary drop-shadow">404</span>
        </div>
      </div>

      <h1 className="font-display text-3xl font-bold text-avs-accent text-center">
        Motif Introuvable
      </h1>
      <p className="mt-3 max-w-sm text-center text-avs-accent/60 leading-relaxed">
        Cette page n&apos;existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e.
        Revenez &agrave; l&apos;accueil ou explorez la biblioth&egrave;que.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-avs bg-avs-primary px-6 py-3 text-sm font-bold text-avs-secondary shadow-avs transition-all hover:-translate-y-0.5 hover:shadow-avs-md"
        >
          <ArrowLeft size={14} aria-hidden />
          Retour &agrave; l&apos;accueil
        </Link>
        {SUGGESTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-2 rounded-avs border-2 border-avs-accent/15 px-5 py-3 text-sm font-semibold text-avs-accent transition-colors hover:border-avs-primary hover:text-avs-primary"
          >
            <Icon size={14} aria-hidden />
            {label}
          </Link>
        ))}
      </div>

      {/* Easter egg cultural */}
      <p className="mt-16 text-xs text-avs-accent/25 text-center italic">
        En Adinkra, &laquo;&nbsp;Sankofa&nbsp;&raquo; enseigne qu&apos;il faut retourner en arri&egrave;re pour avancer.
      </p>
    </div>
  );
}