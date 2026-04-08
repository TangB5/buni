// =============================================================================
// AVS — Vrais composants template (ce que l'utilisateur verra en preview)
// Chaque export est un composant React autonome, stylé avec Tailwind + classes AVS.
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Download,
  MapPin,
  Search,
  ChevronRight,
  Menu,
  X,
  Layers,
  Palette,
  Users,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — Hero Section Culturel
// ─────────────────────────────────────────────────────────────────────────────
export function HeroCulturelTemplate() {
  return (
    <div className="avs-pattern-ndop-royal relative flex min-h-[520px] items-center overflow-hidden">
      {/* Overlay dégradé */}
      <div className="from-avs-accent/95 via-avs-accent/80 absolute inset-0 bg-gradient-to-br to-transparent" />

      {/* Déco géométrique */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="border-avs-primary absolute -top-16 -right-16 h-64 w-64 rounded-full border" />
        <div className="border-avs-kente absolute top-8 -right-8 h-44 w-44 rounded-full border" />
        <div className="border-avs-secondary absolute bottom-0 left-1/3 h-80 w-80 rotate-45 border" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="rounded-avs border-avs-primary/30 bg-avs-primary/12 mb-6 inline-flex items-center gap-2 border px-3 py-1.5 backdrop-blur-sm">
            <Star size={11} className="fill-avs-primary text-avs-primary" />
            <span className="text-avs-primary text-xs font-bold tracking-[0.18em] uppercase">
              v1.0 · Open Standard
            </span>
          </div>

          <h1 className="font-display text-avs-secondary text-5xl leading-[1.05] font-bold sm:text-6xl">
            Le langage
            <br />
            visuel de
            <br />
            <span className="text-avs-primary">l&apos;Afrique</span>
          </h1>

          <p className="text-avs-secondary mt-6 max-w-lg text-lg leading-relaxed">
            AVS préserve et standardise le patrimoine visuel africain — motifs, couleurs et
            géométrie.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="group rounded-avs bg-avs-primary text-avs-secondary shadow-avs hover:shadow-avs-md inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5">
              Parcourir les motifs
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="rounded-avs border-avs-secondary/25 text-avs-secondary hover:border-avs-secondary/50 hover:text-avs-secondary inline-flex items-center gap-2 border px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-colors">
              Notre mission
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-4 gap-4">
            {[
              { v: '1 248', l: 'Motifs' },
              { v: '54', l: 'Pays' },
              { v: '312', l: 'Artisans' },
              { v: '98k', l: 'Téléchargements' },
            ].map(({ v, l }) => (
              <div key={l} className="border-avs-primary/50 border-l-2 pl-3">
                <p className="font-display text-avs-secondary text-2xl font-bold">{v}</p>
                <p className="text-avs-secondary mt-0.5 text-[10px] tracking-wider uppercase">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — Grille de motifs avec filtres
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PATTERNS = [
  {
    id: '1',
    name: 'Ndop Bamoum',
    origin: 'Cameroun',
    type: 'NDOP',
    css: 'avs-pattern-ndop-royal',
    colors: ['#0D2340', '#C8A96E', '#F5EBE0'],
  },
  {
    id: '2',
    name: 'Kente Asante',
    origin: 'Ghana',
    type: 'KENTE',
    css: 'avs-pattern-kente',
    colors: ['#D4A017', '#1D1D1B', '#C0573E'],
  },
  {
    id: '3',
    name: 'Bogolan Malien',
    origin: 'Mali',
    type: 'BOGOLAN',
    css: 'avs-pattern-wax-bold',
    colors: ['#1D1D1B', '#C8A96E', '#F5EBE0'],
  },
  {
    id: '4',
    name: 'Wax Sénégalais',
    origin: 'Sénégal',
    type: 'WAX',
    css: 'avs-pattern-wax',
    colors: ['#C0573E', '#2A4A6B', '#F5EBE0'],
  },
  {
    id: '5',
    name: 'Toghu Bamiléké',
    origin: 'Cameroun',
    type: 'NDOP',
    css: 'avs-pattern-ndop',
    colors: ['#1D1D1B', '#C0573E', '#D4A017'],
  },
  {
    id: '6',
    name: 'Adinkra Akan',
    origin: 'Ghana',
    type: 'ADINKRA',
    css: 'avs-pattern-kente',
    colors: ['#1D1D1B', '#D4A017', '#F5EBE0'],
  },
];

export function PatternGridTemplate() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('ALL');
  const types = ['ALL', 'KENTE', 'NDOP', 'BOGOLAN', 'WAX', 'ADINKRA'];

  const filtered = MOCK_PATTERNS.filter((p) => {
    const q = search.toLowerCase();
    const matchS = !q || p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q);
    const matchT = active === 'ALL' || p.type === active;
    return matchS && matchT;
  });

  return (
    <div className="bg-avs-secondary min-h-[520px] px-6 py-10">
      {/* En-tête */}
      <div className="mb-8">
        <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
          Bibliothèque
        </span>
        <h2 className="font-display text-avs-accent mt-1 text-3xl font-bold">Motifs Culturels</h2>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="text-avs-accent/35 absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un motif…"
            className="avs-input w-full py-2 pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-avs px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all ${active === t ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent border'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-avs-accent/40 text-xs">
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="avs-card group hover:shadow-avs-md cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1"
          >
            <div className={`${p.css} relative h-40`}>
              <div className="from-avs-accent/60 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="rounded-avs bg-avs-accent/80 text-avs-secondary absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
                {p.type}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-avs-accent font-bold">{p.name}</h3>
              <div className="text-avs-accent/50 mt-0.5 flex items-center gap-1 text-xs">
                <MapPin size={10} />
                {p.origin}
              </div>
              <div className="mt-3 flex gap-1.5">
                {p.colors.map((c) => (
                  <span
                    key={c}
                    className="border-avs-accent/10 h-4 w-4 rounded-full border shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — Navbar / Header responsive
// ─────────────────────────────────────────────────────────────────────────────
export function NavbarTemplate() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ['Motifs', 'Palettes', 'Artisans', 'Templates', 'Docs'];

  return (
    <div className="bg-avs-secondary min-h-[520px]">
      {/* Header */}
      <header className="border-avs-accent/10 bg-avs-secondary/95 shadow-avs sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="avs-pattern-kente rounded-avs border-avs-accent/10 flex h-8 w-8 items-center justify-center overflow-hidden border">
              <span className="font-display text-avs-accent text-sm font-black">A</span>
            </div>
            <span className="font-display text-avs-accent text-base font-bold">
              AVS <span className="text-avs-primary">Standard</span>
            </span>
          </div>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l, i) => (
              <button
                key={l}
                className={`rounded-avs px-3 py-2 text-sm font-medium transition-colors ${i === 0 ? 'bg-avs-primary/10 text-avs-primary' : 'text-avs-accent/60 hover:bg-avs-primary/8 hover:text-avs-primary'}`}
              >
                {l}
              </button>
            ))}
          </nav>

          {/* CTA + burger */}
          <div className="flex items-center gap-2">
            <button className="rounded-avs border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary hidden border px-3 py-2 text-sm font-semibold transition-colors sm:block">
              Connexion
            </button>
            <button className="avs-btn-primary hidden px-4 py-2 text-xs sm:block">
              S&apos;inscrire
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-avs text-avs-accent hover:bg-avs-primary/10 p-2 md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-avs-accent/10 bg-avs-secondary border-t px-4 py-3 md:hidden"
          >
            {links.map((l) => (
              <button
                key={l}
                className="rounded-avs text-avs-accent hover:bg-avs-primary/8 block w-full px-3 py-2.5 text-left text-sm font-medium"
              >
                {l}
              </button>
            ))}
            <div className="border-avs-accent/10 mt-3 flex gap-2 border-t pt-3">
              <button className="avs-btn-secondary flex-1 py-2 text-xs">Connexion</button>
              <button className="avs-btn-primary flex-1 py-2 text-xs">S&apos;inscrire</button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Contenu sous le header */}
      <div className="avs-pattern-wax flex min-h-[420px] items-center justify-center">
        <div className="bg-avs-secondary/50 absolute inset-0" />
        <div className="relative text-center">
          <p className="font-display text-avs-accent text-3xl font-bold">Contenu de la page</p>
          <p className="text-avs-accent/50 mt-2 text-sm">
            Redimensionnez pour voir la navbar responsive
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — Pricing / Cards d'abonnement
// ─────────────────────────────────────────────────────────────────────────────
export function PricingTemplate() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Explorateur',
      price: annual ? 0 : 0,
      period: '',
      desc: 'Pour découvrir le standard AVS.',
      features: [
        'Accès à 200 motifs',
        'Téléchargement PNG',
        'Palette CSS basique',
        'Documentation publique',
      ],
      cta: 'Commencer gratuitement',
      variant: 'secondary' as const,
      pattern: 'avs-pattern-wax',
    },
    {
      name: 'Artisan',
      price: annual ? 8 : 10,
      period: annual ? '/mois, facturé annuellement' : '/mois',
      desc: 'Pour les créateurs qui contribuent.',
      features: [
        'Accès illimité (1 248 motifs)',
        'Téléchargement SVG + JSON',
        'Tokens Tailwind & Figma',
        'Soumettre des motifs',
        'Badge Artisan vérifié',
      ],
      cta: "Commencer l'essai gratuit",
      variant: 'primary' as const,
      popular: true,
      pattern: 'avs-pattern-ndop-royal',
    },
    {
      name: 'Studio',
      price: annual ? 24 : 30,
      period: annual ? '/mois, facturé annuellement' : '/mois',
      desc: 'Pour les équipes et agences.',
      features: [
        'Tout Artisan inclus',
        "5 membres d'équipe",
        'API access',
        'Licence commerciale',
        'Support prioritaire',
        'White-label SVG',
      ],
      cta: "Contacter l'équipe",
      variant: 'secondary' as const,
      pattern: 'avs-pattern-kente',
    },
  ];

  return (
    <div className="bg-avs-secondary min-h-[520px] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
            Tarifs
          </span>
          <h2 className="font-display text-avs-accent mt-2 text-4xl font-bold">
            Simple et transparent
          </h2>
          <p className="text-avs-accent/60 mt-3">
            Tous les plans incluent l&apos;accès public à la bibliothèque.
          </p>

          {/* Toggle annuel/mensuel */}
          <div className="rounded-avs-lg border-avs-accent/15 bg-avs-accent/4 mt-6 inline-flex items-center gap-3 border p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-avs px-4 py-2 text-sm font-semibold transition-all ${!annual ? 'bg-avs-secondary text-avs-accent shadow-avs' : 'text-avs-accent/50'}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-avs px-4 py-2 text-sm font-semibold transition-all ${annual ? 'bg-avs-secondary text-avs-accent shadow-avs' : 'text-avs-accent/50'}`}
            >
              Annuel <span className="text-avs-primary ml-1 text-[10px] font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`avs-card relative flex flex-col overflow-hidden p-6 ${plan.popular ? 'border-avs-primary shadow-avs-md ring-avs-primary/30 ring-1' : ''}`}
            >
              {plan.popular && (
                <div className="bg-avs-primary text-avs-secondary absolute top-5 -right-8 rotate-45 px-10 py-1 text-[10px] font-bold tracking-wider uppercase">
                  Populaire
                </div>
              )}

              {/* Pattern header */}
              <div className={`${plan.pattern} -mx-6 -mt-6 mb-5 h-20`} aria-hidden />

              <h3 className="font-display text-avs-accent text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-avs-accent text-4xl font-black">
                  {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                </span>
                {plan.period && <span className="text-avs-accent/45 text-xs">{plan.period}</span>}
              </div>
              <p className="text-avs-accent/55 mt-1 text-sm">{plan.desc}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-avs-accent/70 flex items-start gap-2 text-sm">
                    <span className="text-avs-primary mt-0.5 shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`rounded-avs mt-6 w-full py-3 text-sm font-bold transition-all ${plan.variant === 'primary' ? 'bg-avs-primary text-avs-secondary shadow-avs hover:shadow-avs-md hover:-translate-y-0.5' : 'border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary border-2'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5 — Section Features 2 colonnes
// ─────────────────────────────────────────────────────────────────────────────
export function FeaturesTemplate() {
  const features = [
    {
      icon: Layers,
      title: 'Bibliothèque complète',
      desc: '1 248 motifs africains vectorisés, classifiés par région, type et époque. SVG, PNG et JSON inclus.',
      pattern: 'avs-pattern-ndop-royal',
    },
    {
      icon: Palette,
      title: 'Design tokens culturels',
      desc: 'Chaque couleur extraite de pigments naturels africains. Utilisables en CSS, Tailwind, Figma ou Swift UI.',
      pattern: 'avs-pattern-kente',
    },
    {
      icon: Users,
      title: 'Communauté ouverte',
      desc: '312 artisans, tisserands et chercheurs valident chaque entrée. La source primaire, toujours.',
      pattern: 'avs-pattern-wax-bold',
    },
    {
      icon: Download,
      title: 'Téléchargement libre',
      desc: 'Tout est CC BY 4.0. Aucun compte requis pour accéder aux ressources de base.',
      pattern: 'avs-pattern-wax',
    },
  ];

  return (
    <div className="bg-avs-secondary min-h-[520px] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid items-end gap-10 lg:grid-cols-2">
          <div>
            <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
              Fonctionnalités
            </span>
            <h2 className="font-display text-avs-accent mt-2 text-4xl leading-tight font-bold">
              Tout ce dont vous avez
              <br />
              besoin pour créer
            </h2>
          </div>
          <p className="text-avs-accent/60 leading-relaxed">
            AVS est conçu comme un standard ouvert — pas une plateforme fermée. Chaque ressource est
            documentée, traçable et libre.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc, pattern }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="avs-card group hover:shadow-avs-md cursor-default overflow-hidden p-0 transition-all hover:-translate-y-1"
            >
              {/* Pattern header réduit */}
              <div className={`${pattern} relative h-2`} aria-hidden />

              <div className="p-6">
                <div className="rounded-avs bg-avs-primary/10 mb-4 inline-flex h-11 w-11 items-center justify-center">
                  <Icon size={20} className="text-avs-primary" />
                </div>
                <h3 className="font-display text-avs-accent text-lg font-bold">{title}</h3>
                <p className="text-avs-accent/60 mt-2 text-sm leading-relaxed">{desc}</p>
                <div className="text-avs-primary mt-4 flex items-center gap-1 text-xs font-bold tracking-widest uppercase">
                  En savoir plus <ChevronRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6 — CTA / Section finale
// ─────────────────────────────────────────────────────────────────────────────
export function CtaTemplate() {
  return (
    <div className="avs-pattern-wax-bold relative flex min-h-[420px] items-center overflow-hidden">
      <div className="bg-avs-accent/92 absolute inset-0" />

      {/* Déco */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="border-avs-secondary/10 absolute top-10 right-10 h-48 w-48 rounded-full border" />
        <div className="border-avs-primary/20 absolute top-20 right-20 h-28 w-28 rounded-full border" />
        <div className="border-avs-kente/20 absolute bottom-10 left-10 h-32 w-32 rotate-45 border" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
        <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
          Rejoindre le mouvement
        </span>
        <h2 className="font-display text-avs-secondary mt-3 text-4xl font-bold sm:text-5xl">
          Construisons ensemble
          <br />
          le standard africain
        </h2>
        <p className="text-avs-secondary mx-auto mt-5 max-w-lg leading-relaxed">
          Artisan, designer ou développeur — votre savoir enrichit le plus grand standard visuel
          africain open-source du monde.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="group rounded-avs bg-avs-primary text-avs-secondary shadow-avs-md hover:shadow-avs-lg inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5">
            Créer un compte gratuit
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="rounded-avs border-avs-secondary/30 text-avs-secondary hover:text-avs-secondary border px-8 py-3.5 text-sm font-semibold transition-colors">
            Explorer d&apos;abord
          </button>
        </div>

        {/* Avatars communauté */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[
              'avs-pattern-kente',
              'avs-pattern-ndop',
              'avs-pattern-wax',
              'avs-pattern-ndop-royal',
              'avs-pattern-wax-bold',
            ].map((css, i) => (
              <div
                key={i}
                className={`${css} border-avs-accent flex h-8 w-8 items-center justify-center rounded-full border-2`}
              >
                <span className="font-display text-avs-secondary text-xs font-black drop-shadow">
                  {['N', 'K', 'F', 'S', 'A'][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-avs-secondary text-sm">+312 artisans nous ont déjà rejoints</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 7 — Artisan / Profile Card
// ─────────────────────────────────────────────────────────────────────────────
export function ArtisanProfileTemplate() {
  const artisans = [
    {
      name: 'Njoya Hamidou',
      role: 'Tisserand Ndop',
      origin: 'Foumban 🇨🇲',
      patterns: 47,
      rating: 4.9,
      css: 'avs-pattern-ndop-royal',
      badges: ['Vérifié', '50 motifs'],
    },
    {
      name: 'Ama Asantewaa',
      role: 'Tisserande Kente',
      origin: 'Kumasi 🇬🇭',
      patterns: 63,
      rating: 5.0,
      css: 'avs-pattern-kente',
      badges: ['Top', '100 motifs'],
    },
    {
      name: 'Fatoumata Coulibaly',
      role: 'Artisane Bogolan',
      origin: 'Ségou 🇲🇱',
      patterns: 38,
      rating: 4.8,
      css: 'avs-pattern-wax-bold',
      badges: ['Vérifié', '25 motifs'],
    },
  ];

  return (
    <div className="bg-avs-secondary min-h-[520px] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
            Communauté
          </span>
          <h2 className="font-display text-avs-accent mt-1 text-4xl font-bold">
            Artisans en vedette
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {artisans.map((a) => (
            <div
              key={a.name}
              className="avs-card group hover:shadow-avs-md cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1"
            >
              {/* Pattern avatar */}
              <div className={`${a.css} relative h-28`}>
                <div className="from-avs-accent/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-end gap-3">
                  <div
                    className={`${a.css} border-avs-secondary shadow-avs flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2`}
                  >
                    <span className="font-display text-avs-secondary text-xl font-black drop-shadow">
                      {a.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-avs-secondary text-sm leading-tight font-bold">{a.name}</p>
                    <p className="text-avs-secondary text-xs">{a.role}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-avs-accent/50 flex items-center gap-1 text-xs">
                    <MapPin size={11} />
                    {a.origin}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-avs-kente text-avs-kente" />
                    <span className="text-avs-accent text-xs font-bold">{a.rating}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-avs bg-avs-primary/10 text-avs-primary px-2 py-0.5 text-[10px] font-bold"
                    >
                      ✦ {b}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-avs-accent/50 text-xs">
                    <strong className="text-avs-accent">{a.patterns}</strong> motifs
                  </span>
                  <button className="text-avs-primary flex items-center gap-1 text-xs font-bold underline-offset-4 hover:underline">
                    Voir le profil <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
