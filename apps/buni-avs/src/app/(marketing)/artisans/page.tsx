import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, Package, ArrowRight, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artisans — AVS',
  description:
    'Rencontrez les tisserands, sculpteurs et artistes qui valident et enrichissent le standard visuel africain.',
};

// ── Types & données ────────────────────────────────────────────────────────────
interface Artisan {
  id: string;
  name: string;
  craft: string;
  origin: string;
  country: string;
  bio: string;
  specialties: string[];
  patterns: number;
  rating: number;
  avatar: string; // CSS pattern class as avatar bg
  verified: boolean;
}

const ARTISANS: Artisan[] = [
  {
    id: '1',
    name: 'Njoya Hamidou',
    craft: 'Tisserand Ndop',
    origin: 'Foumban, Cameroun',
    country: '🇨🇲',
    bio: 'Tisserand de 4ème génération dans la tradition Bamoum. Gardien de 47 motifs ancestraux du Sultanat.',
    specialties: ['NDOP', 'BOGOLAN'],
    patterns: 47,
    rating: 4.9,
    avatar: 'avs-pattern-ndop-royal',
    verified: true,
  },
  {
    id: '2',
    name: 'Ama Asantewaa',
    craft: 'Tisserande Kente',
    origin: 'Kumasi, Ghana',
    country: '🇬🇭',
    bio: 'Maîtresse tisserande Asante spécialisée dans le Kente cérémoniel royal. Collabore avec des musées internationaux.',
    specialties: ['KENTE', 'ADINKRA'],
    patterns: 63,
    rating: 5.0,
    avatar: 'avs-pattern-kente',
    verified: true,
  },
  {
    id: '3',
    name: 'Fatoumata Coulibaly',
    craft: 'Artisane Bogolan',
    origin: 'Ségou, Mali',
    country: '🇲🇱',
    bio: 'Experte en teinture de boue fermentée (Bogolan). Ses techniques naturelles sont transmises dans son atelier de Ségou.',
    specialties: ['BOGOLAN', 'WAX'],
    patterns: 38,
    rating: 4.8,
    avatar: 'avs-pattern-wax-bold',
    verified: true,
  },
  {
    id: '4',
    name: 'Sipho Dlamini',
    craft: 'Artiste Ndebele',
    origin: 'Mpumalanga, Afr. du Sud',
    country: '🇿🇦',
    bio: "Peintre mural Ndebele perpétuant la tradition géométrique de sa grand-mère. Chaque façade est une carte de l'univers.",
    specialties: ['NDEBELE'],
    patterns: 29,
    rating: 4.7,
    avatar: 'avs-pattern-wax',
    verified: false,
  },
  {
    id: '5',
    name: 'Kofi Mensah',
    craft: 'Symboliste Adinkra',
    origin: 'Accra, Ghana',
    country: '🇬🇭',
    bio: "Chercheur et praticien des symboles Adinkra Akan. Auteur de deux ouvrages de référence sur l'iconographie Akan.",
    specialties: ['ADINKRA', 'KENTE'],
    patterns: 85,
    rating: 4.9,
    avatar: 'avs-pattern-kente',
    verified: true,
  },
  {
    id: '6',
    name: 'Mariama Bah',
    craft: 'Tisserande Fula',
    origin: 'Conakry, Guinée',
    country: '🇬🇳',
    bio: 'Spécialiste des textiles Peul (Fula). Ses bandes de coton indigo sont reconnues pour leur précision mathématique.',
    specialties: ['WAX', 'BOGOLAN'],
    patterns: 31,
    rating: 4.6,
    avatar: 'avs-pattern-ndop',
    verified: false,
  },
];

const STATS = [
  { value: '312', label: 'Artisans contributeurs' },
  { value: '54', label: 'Pays représentés' },
  { value: '28', label: 'Techniques documentées' },
  { value: '98%', label: 'Validation sur source primaire' },
] as const;

// ── Composant carte ────────────────────────────────────────────────────────────
function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <article className="group rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs hover:shadow-avs-md overflow-hidden border transition-all hover:-translate-y-1">
      {/* Avatar pattern */}
      <div className={`${artisan.avatar} relative h-28`}>
        <div className="from-avs-accent/70 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-end gap-2">
          <div className="bg-avs-primary text-avs-secondary shadow-avs border-avs-secondary flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl font-bold">
            {artisan.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-avs-secondary text-sm font-bold">{artisan.name}</p>
              {artisan.verified && (
                <span
                  title="Artisan vérifié"
                  className="text-avs-kente text-xs"
                  aria-label="Vérifié"
                >
                  ✦
                </span>
              )}
            </div>
            <p className="text-avs-secondary/70 text-xs">{artisan.craft}</p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-avs-accent/50 flex items-center gap-1 text-xs">
            <MapPin size={11} aria-hidden />
            <span>
              {artisan.country} {artisan.origin}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-avs-kente text-avs-kente" aria-hidden />
            <span className="text-avs-accent text-xs font-bold">{artisan.rating}</span>
          </div>
        </div>

        <p className="text-avs-accent/65 line-clamp-2 text-sm leading-relaxed">{artisan.bio}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {artisan.specialties.map((s) => (
            <span
              key={s}
              className="rounded-avs bg-avs-primary/10 text-avs-primary px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-avs-accent/50 flex items-center gap-1 text-xs">
            <Package size={11} aria-hidden />
            <span>
              <strong className="text-avs-accent">{artisan.patterns}</strong> motifs contribués
            </span>
          </div>
          <Link
            href={`/artisans/${artisan.id}`}
            className="text-avs-primary flex items-center gap-1 text-xs font-bold transition-colors hover:underline"
          >
            Voir le profil <ArrowRight size={11} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ArtisansPage() {
  return (
    <div className="bg-avs-secondary min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="avs-pattern-kente border-avs-accent border-b px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              {/* Background blur layer */}
              <div className="rounded-avs-lg absolute inset-0 bg-white/1 backdrop-blur-sm" />

              {/* Content (non flouté) */}
              <div className="relative p-10">
                <span className="text-avs-secondary text-xs font-bold tracking-[0.2em] uppercase">
                  Communauté
                </span>

                <h1 className="font-display text-avs-secondary mt-1 text-4xl font-bold sm:text-5xl">
                  Les Gardiens
                  <br />
                  du Patrimoine
                </h1>

                <p className="text-avs-secondary mt-4 max-w-md leading-relaxed">
                  Des centaines d&apos;artisans, tisserands et chercheurs qui sont la source
                  primaire du standard. Chaque motif est valid&eacute; par un expert de terrain.
                </p>

                <Link
                  href="/auth/register?role=artisan"
                  className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs hover:shadow-avs-md mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                >
                  <Users size={15} aria-hidden />
                  Rejoindre la communauté
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs border p-5"
                >
                  <p className="font-display text-avs-primary text-3xl font-bold">{value}</p>
                  <p className="text-avs-accent/60 mt-1 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grille artisans ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-avs-accent text-2xl font-bold">Artisans en vedette</h2>
          <span className="text-avs-accent/50 text-sm">{ARTISANS.length} sur 312</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTISANS.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>

        {/* Load more placeholder */}
        <div className="mt-10 text-center">
          <button className="rounded-avs border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary border-2 px-8 py-3 text-sm font-semibold transition-all">
            Charger plus d&apos;artisans
          </button>
        </div>
      </div>
    </div>
  );
}
