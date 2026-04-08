// =============================================================================
// AVS — Registre Central des Templates
// src/features/templates/registry/index.tsx
//
// POUR AJOUTER UN NOUVEAU TEMPLATE :
// 1. Créez votre composant dans template-components.tsx (ou un nouveau fichier)
// 2. Importez-le ici
// 3. Ajoutez une entrée dans TEMPLATE_REGISTRY
// 4. C'est tout — il apparaît automatiquement sur /templates
// =============================================================================

import type { ComponentType } from 'react';
import {
  HeroCulturelTemplate,
  PatternGridTemplate,
  NavbarTemplate,
  PricingTemplate,
  FeaturesTemplate,
  CtaTemplate,
  ArtisanProfileTemplate,
} from '../components/template-components';

// ── Types ──────────────────────────────────────────────────────────────────────
export type TemplateCategory =
  | 'landing'
  | 'marketing'
  | 'navigation'
  | 'ecommerce'
  | 'community'
  | 'dashboard';

export type Framework = 'nextjs' | 'react' | 'html';
export type Complexity = 'simple' | 'medium' | 'advanced';

export interface TemplateEntry {
  /** Identifiant unique (slug URL-friendly) */
  id: string;
  /** Nom affiché */
  name: string;
  /** Catégorie pour les filtres */
  category: TemplateCategory;
  /** Description courte */
  desc: string;
  /** Tags de recherche */
  tags: string[];
  /** Frameworks compatibles */
  frameworks: Framework[];
  /** Complexité estimée */
  complexity: Complexity;
  /** Liste des composants AVS utilisés */
  components: string[];
  /** Composant React à prévisualiser */
  Component: ComponentType;
  /** Code source à copier */
  sourceCode: string;
  /** Gratuit ou premium */
  free: boolean;
  /** Nouveauté */
  isNew?: boolean;
}

// ── Registre ───────────────────────────────────────────────────────────────────
export const TEMPLATE_REGISTRY: TemplateEntry[] = [
  // ── Landing ────────────────────────────────────────────────────────────────
  {
    id: 'hero-culturel',
    name: 'Hero Section Culturel',
    category: 'landing',
    desc: 'Section hero avec motif Ndop en fond, titre display, stats et CTAs. Responsive.',
    tags: ['hero', 'landing', 'motif', 'ndop', 'cta', 'stats'],
    frameworks: ['nextjs', 'react'],
    complexity: 'simple',
    components: ['SvgPatternHero', 'Button', 'motion.div'],
    Component: HeroCulturelTemplate,
    free: true,
    isNew: true,
    sourceCode: `'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export function HeroCulturel() {
  return (
    <div className="avs-pattern-ndop-royal relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-avs-accent/95 via-avs-accent/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-avs border border-avs-primary/30 bg-avs-primary/12 px-3 py-1.5">
            <Star size={11} className="fill-avs-primary text-avs-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-avs-primary">
              v1.0 · Open Standard
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold text-avs-secondary sm:text-6xl">
            Le langage visuel de<br />
            <span className="text-avs-primary">l'Afrique</span>
          </h1>

          <p className="mt-6 text-lg text-avs-secondary/65 leading-relaxed">
            AVS préserve et standardise le patrimoine visuel africain.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="group avs-btn-primary gap-2 px-6 py-3">
              Parcourir les motifs
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="rounded-avs border border-avs-secondary/25 px-6 py-3 text-sm font-semibold text-avs-secondary/80 hover:text-avs-secondary transition-colors">
              Notre mission
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-4 gap-4">
            {[{v:'1 248',l:'Motifs'},{v:'54',l:'Pays'},{v:'312',l:'Artisans'},{v:'98k',l:'DL'}].map(({v,l}) => (
              <div key={l} className="border-l-2 border-avs-primary/50 pl-3">
                <p className="font-display text-2xl font-bold text-avs-secondary">{v}</p>
                <p className="text-[10px] text-avs-secondary/45 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
  },

  {
    id: 'cta-section',
    name: 'Section CTA Finale',
    category: 'landing',
    desc: "Section d'appel à l'action avec motif Wax en fond, avatars communauté et double CTA.",
    tags: ['cta', 'landing', 'communauté', 'conversion'],
    frameworks: ['nextjs', 'react'],
    complexity: 'simple',
    components: ['Button', 'motion.div'],
    Component: CtaTemplate,
    free: true,
    sourceCode: `// Voir src/features/templates/components/template-components.tsx → CtaTemplate
// Copier le composant CtaTemplate dans votre projet.`,
  },

  // ── Marketing ──────────────────────────────────────────────────────────────
  {
    id: 'pattern-grid',
    name: 'Grille de Motifs',
    category: 'marketing',
    desc: 'Grille responsive de PatternCard avec filtres par type et barre de recherche live.',
    tags: ['grid', 'patterns', 'filtres', 'recherche', 'cards'],
    frameworks: ['nextjs', 'react'],
    complexity: 'medium',
    components: ['PatternCard', 'Input', 'Badge', 'motion.div'],
    Component: PatternGridTemplate,
    free: true,
    sourceCode: `'use client';
import { useState } from 'react';
import { PatternCard } from '@/features/patterns/components/PatternCard';
import { usePatterns } from '@/features/patterns/hooks/usePatterns';
import { Search } from 'lucide-react';

const TYPES = ['ALL','KENTE','NDOP','BOGOLAN','WAX','ADINKRA'];

export function PatternGridSection() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('ALL');
  const { data, isLoading } = usePatterns({ search, patternType: active === 'ALL' ? undefined : active });

  return (
    <section className="avs-section bg-avs-secondary">
      <div className="avs-container">
        <h2 className="font-display text-3xl font-bold text-avs-accent mb-8">Motifs Culturels</h2>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…" className="avs-input pl-9 text-sm" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(t => (
              <button key={t} onClick={() => setActive(t)}
                className={\`rounded-avs px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all
                  \${active === t ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border border-avs-accent/15 text-avs-accent/60'}\`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grille */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((p, i) => <PatternCard key={p.id} pattern={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}`,
  },

  {
    id: 'features-section',
    name: 'Section Fonctionnalités',
    category: 'marketing',
    desc: 'Grille 2×2 de feature cards avec bande couleur pattern, icône et description.',
    tags: ['features', 'marketing', 'cards', 'icons'],
    frameworks: ['nextjs', 'react'],
    complexity: 'simple',
    components: ['Card', 'motion.div', 'lucide-react'],
    Component: FeaturesTemplate,
    free: true,
    sourceCode: `// Voir src/features/templates/components/template-components.tsx → FeaturesTemplate`,
  },

  {
    id: 'pricing-cards',
    name: 'Cards de Tarification',
    category: 'ecommerce',
    desc: 'Plans tarifaires avec toggle mensuel/annuel, pattern header et badge "Populaire".',
    tags: ['pricing', 'tarifs', 'abonnement', 'cards', 'toggle'],
    frameworks: ['nextjs', 'react'],
    complexity: 'medium',
    components: ['Card', 'Badge', 'Button'],
    Component: PricingTemplate,
    free: true,
    sourceCode: `// Voir src/features/templates/components/template-components.tsx → PricingTemplate`,
  },

  // ── Navigation ─────────────────────────────────────────────────────────────
  {
    id: 'navbar-responsive',
    name: 'Navbar Responsive',
    category: 'navigation',
    desc: 'Header sticky avec logo, navigation desktop, burger mobile et menu animé.',
    tags: ['navbar', 'header', 'responsive', 'mobile', 'menu'],
    frameworks: ['nextjs', 'react'],
    complexity: 'simple',
    components: ['Header', 'motion.div', 'Menu', 'X'],
    Component: NavbarTemplate,
    free: true,
    sourceCode: `// Voir src/components/layout/Header.tsx — version complète avec auth
// Voir src/features/templates/components/template-components.tsx → NavbarTemplate — version standalone`,
  },

  // ── Community ──────────────────────────────────────────────────────────────
  {
    id: 'artisan-cards',
    name: 'Grille Artisans',
    category: 'community',
    desc: "Cards d'artisans avec avatar-pattern, badges de spécialité, rating et lien profil.",
    tags: ['artisans', 'profil', 'communauté', 'cards', 'rating'],
    frameworks: ['nextjs', 'react'],
    complexity: 'simple',
    components: ['Card', 'Badge', 'Star', 'MapPin'],
    Component: ArtisanProfileTemplate,
    free: true,
    isNew: true,
    sourceCode: `// Voir src/features/templates/components/template-components.tsx → ArtisanProfileTemplate`,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Toutes les catégories uniques du registre */
export const ALL_CATEGORIES = [
  ...new Set(TEMPLATE_REGISTRY.map((t) => t.category)),
] as TemplateCategory[];

/** Tous les frameworks uniques */
export const ALL_FRAMEWORKS = [
  ...new Set(TEMPLATE_REGISTRY.flatMap((t) => t.frameworks)),
] as Framework[];

/** Filtrer le registre */
export function filterTemplates(opts: {
  category?: TemplateCategory | 'all';
  framework?: Framework | 'all';
  search?: string;
}): TemplateEntry[] {
  const { category = 'all', framework = 'all', search = '' } = opts;
  const q = search.toLowerCase();

  return TEMPLATE_REGISTRY.filter((t) => {
    const matchCat = category === 'all' || t.category === category;
    const matchFw = framework === 'all' || t.frameworks.includes(framework as Framework);
    const matchS =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.desc.toLowerCase().includes(q);
    return matchCat && matchFw && matchS;
  });
}

/** Libellés affichés */
export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  landing: 'Landing',
  marketing: 'Marketing',
  navigation: 'Navigation',
  ecommerce: 'E-commerce',
  community: 'Communauté',
  dashboard: 'Dashboard',
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  nextjs: 'Next.js',
  react: 'React',
  html: 'HTML',
};

export const COMPLEXITY_CONFIG: Record<Complexity, { label: string; css: string }> = {
  simple: { label: 'Simple', css: 'bg-green-100 text-green-700' },
  medium: { label: 'Moyen', css: 'bg-amber-100 text-amber-700' },
  advanced: { label: 'Avancé', css: 'bg-avs-primary/12 text-avs-primary' },
};
