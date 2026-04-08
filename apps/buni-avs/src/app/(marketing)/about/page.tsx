import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, Shield, Globe, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos — AVS',
  description: 'La mission, les valeurs et l\'équipe derrière le standard visuel africain.',
};

const VALUES = [
  {
    icon: Shield,
    title: 'Rigueur Ethnographique',
    text: 'Chaque motif est validé par des artisans de terrain et des chercheurs spécialisés. Pas de romantisation, pas d\'appropriation : de la documentation factuelle.',
  },
  {
    icon: Heart,
    title: 'Souveraineté Culturelle',
    text: 'Les communautés sources ont un droit de regard permanent sur leur patrimoine. AVS est un outil de préservation, jamais d\'extraction.',
  },
  {
    icon: Globe,
    title: 'Accès Universel',
    text: 'La majorité des ressources est libre et gratuite (CC BY 4.0). Le savoir africain appartient à l\'humanité entière, à commencer par les Africains.',
  },
  {
    icon: BookOpen,
    title: 'Traçabilité Totale',
    text: 'Chaque token de couleur, chaque motif, chaque symbole porte la trace de sa source : artisan, région, époque, signification documentée.',
  },
] as const;

const TEAM = [
  { name: 'Dr. Amara Diop',     role: 'Fondateur & Directeur Ethnographique', origin: '🇸🇳 Dakar',   pattern: 'avs-pattern-wax-bold' },
  { name: 'Ngozi Okonkwo',      role: 'Directrice Design & Standard',         origin: '🇳🇬 Lagos',   pattern: 'avs-pattern-kente' },
  { name: 'Jean-Paul Kamdem',   role: 'Lead Ingénierie & Archivage',          origin: '🇨🇲 Yaoundé', pattern: 'avs-pattern-ndop-royal' },
  { name: 'Aïcha Ben Salah',    role: 'Recherche Afrique du Nord',            origin: '🇹🇳 Tunis',   pattern: 'avs-pattern-wax' },
  { name: 'Thabo Mokoena',      role: 'Communauté & Partenariats Artisans',   origin: '🇿🇦 Jo\'burg', pattern: 'avs-pattern-ndop' },
] as const;

const TIMELINE = [
  { year: '2019', event: 'Première réunion fondatrice à Dakar — 12 chercheurs, 3 pays' },
  { year: '2020', event: 'Lancement du prototype avec 200 motifs documentés' },
  { year: '2021', event: 'Partenariats avec 5 musées africains et 3 universités' },
  { year: '2022', event: 'Version beta publique — 850 motifs, 120 artisans vérifiés' },
  { year: '2023', event: 'Intégration dans Figma, Tailwind et Adobe Color' },
  { year: '2024', event: 'v1.0 — 1 248 motifs, 54 pays, standard ouvert officiel' },
] as const;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ── Manifeste Hero ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="manifesto-title"
        className="avs-pattern-ndop-royal relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-avs-accent/95" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-avs-primary">Notre Mission</span>
          <h1 id="manifesto-title" className="mt-3 font-display text-4xl font-bold text-avs-secondary sm:text-6xl leading-tight">
            Nommer, Préserver,<br />
            <span className="text-avs-primary">Transmettre</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-avs-secondary/65 leading-relaxed">
            Le patrimoine visuel africain est le plus riche et le plus diversifi&eacute; du monde.
            Il m&eacute;rite un standard aussi rigoureux que Unicode l&apos;est pour l&apos;&eacute;criture.
          </p>
        </div>
      </section>

      {/* ── Valeurs ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="values-title"
        className="bg-avs-secondary px-4 py-20 sm:px-6 lg:px-8 border-b border-avs-accent/8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-avs-primary">Principes</span>
            <h2 id="values-title" className="mt-2 font-display text-3xl font-bold text-avs-accent">
              Ce qui nous guide
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-avs-lg border border-avs-accent/10 bg-white p-7 shadow-avs">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-avs bg-avs-primary/10">
                  <Icon size={20} className="text-avs-primary" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-bold text-avs-accent">{title}</h3>
                <p className="mt-2 text-sm text-avs-accent/65 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Histoire / Timeline ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="history-title"
        className="bg-avs-accent px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-avs-primary">Histoire</span>
            <h2 id="history-title" className="mt-2 font-display text-3xl font-bold text-avs-secondary">
              5 ans de construction
            </h2>
          </div>
          <ol className="relative space-y-0 before:absolute before:left-[7.5px] before:top-2 before:bottom-2 before:w-px before:bg-avs-primary/30" aria-label="Chronologie AVS">
            {TIMELINE.map(({ year, event }) => (
              <li key={year} className="relative pl-8 pb-8 last:pb-0">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-avs-primary bg-avs-accent" aria-hidden />
                <time className="text-xs font-bold text-avs-primary uppercase tracking-widest">{year}</time>
                <p className="mt-1 text-sm text-avs-secondary/70 leading-relaxed">{event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Équipe ────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="team-title"
        className="bg-avs-secondary px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-avs-primary">Équipe</span>
            <h2 id="team-title" className="mt-2 font-display text-3xl font-bold text-avs-accent">
              Des visages derrière le standard
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TEAM.map(({ name, role, origin, pattern }) => (
              <div key={name} className="overflow-hidden rounded-avs-lg border border-avs-accent/10 shadow-avs">
                <div className={`${pattern} h-24`} aria-hidden />
                <div className="bg-white p-4">
                  <p className="font-display font-bold text-avs-accent text-sm leading-tight">{name}</p>
                  <p className="mt-0.5 text-[11px] text-avs-primary font-semibold leading-snug">{role}</p>
                  <p className="mt-1.5 text-xs text-avs-accent/45">{origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA rejoindre ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="join-title"
        className="avs-pattern-wax border-t border-avs-accent/10 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="join-title" className="font-display text-3xl font-bold text-avs-accent">
            Vous avez un savoir à partager ?
          </h2>
          <p className="mt-4 text-avs-accent/65 leading-relaxed">
            Artisan, chercheur, designer — votre expertise enrichit le standard.
            Rejoignez les 312 contributeurs du monde entier.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 rounded-avs bg-avs-primary px-7 py-3 text-sm font-bold text-avs-secondary shadow-avs transition-all hover:-translate-y-0.5 hover:shadow-avs-md"
            >
              Contribuer au standard
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/patterns"
              className="rounded-avs border-2 border-avs-accent/20 px-7 py-3 text-sm font-semibold text-avs-accent transition-colors hover:border-avs-primary hover:text-avs-primary"
            >
              Explorer la bibliothèque
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}