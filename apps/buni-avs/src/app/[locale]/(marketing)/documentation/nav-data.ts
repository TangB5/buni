// ─────────────────────────────────────────────────────────────────────────────
// The 15 documentation spaces. Each has its own icon/accent — used to build
// the sidebar tree, the homepage category grid and the search index.
// ─────────────────────────────────────────────────────────────────────────────

import { useTranslations } from 'next-intl';

export interface NavPage {
  slug: string;
  title: string;
}

export interface NavSpace {
  slug: string;
  label: string;
  icon: string;       // primeicons class suffix, e.g. "compass" → "pi pi-compass"
  color: string;
  description: string;
  pages: NavPage[];
}

export function useNavSpaces(): NavSpace[] {
  const t = useTranslations('documentation.nav');

  return [
    {
      slug: 'commencer', label: t('commencer.label'), icon: 'play', color: '#C0573E',
      description: t('commencer.description'),
      pages: [
        { slug: 'introduction', title: t('commencer.pages.introduction') },
        { slug: 'installation', title: t('commencer.pages.installation') },
        { slug: 'structure', title: t('commencer.pages.structure') },
      ],
    },
    {
      slug: 'concepts', label: t('concepts.label'), icon: 'compass', color: '#2A4A6B',
      description: t('concepts.description'),
      pages: [
        { slug: 'philosophie', title: t('concepts.pages.philosophie') },
        { slug: 'tracability', title: t('concepts.pages.tracability') },
      ],
    },
    {
      slug: 'motifs', label: t('motifs.label'), icon: 'th-large', color: '#D4A017',
      description: t('motifs.description'),
      pages: [
        { slug: 'intro', title: t('motifs.pages.intro') },
        { slug: 'utiliser-patterns-code', title: t('motifs.pages.utiliser-patterns-code') },
        { slug: 'ndop-bamoum', title: t('motifs.pages.ndop-bamoum') },
        { slug: 'kente-royale', title: t('motifs.pages.kente-royale') },
        { slug: 'bogolan-fanga', title: t('motifs.pages.bogolan-fanga') },
      ],
    },
    {
      slug: 'couleurs', label: t('couleurs.label'), icon: 'palette', color: '#8B4513',
      description: t('couleurs.description'),
      pages: [
        { slug: 'introduction', title: t('couleurs.pages.introduction') },
        { slug: 'color-picker', title: t('couleurs.pages.color-picker') },
        { slug: 'integration', title: t('couleurs.pages.integration') },
        { slug: 'design-system', title: t('couleurs.pages.design-system') },
        { slug: 'palette-principale', title: t('couleurs.pages.palette-principale') },
      ],
    },
    {
      slug: 'tokens', label: t('tokens.label'), icon: 'sliders-h', color: '#4A6741',
      description: t('tokens.description'),
      pages: [{ slug: 'reference', title: t('tokens.pages.reference') }],
    },
    {
      slug: 'composants', label: t('composants.label'), icon: 'box', color: '#C0573E',
      description: t('composants.description'),
      pages: [{ slug: 'bouton', title: t('composants.pages.bouton') }, { slug: 'carte', title: t('composants.pages.carte') }],
    },
    {
      slug: 'icones', label: t('icones.label'), icon: 'sun', color: '#D4A017',
      description: t('icones.description'),
      pages: [{ slug: 'catalogue', title: t('icones.pages.catalogue') }],
    },
    {
      slug: 'svg', label: t('svg.label'), icon: 'image', color: '#2A4A6B',
      description: t('svg.description'),
      pages: [{ slug: 'export', title: t('svg.pages.export') }],
    },
    {
      slug: 'typographie', label: t('typographie.label'), icon: 'font', color: '#8B4513',
      description: t('typographie.description'),
      pages: [{ slug: 'echelle', title: t('typographie.pages.echelle') }],
    },
    {
      slug: 'accessibilite', label: t('accessibilite.label'), icon: 'eye', color: '#4A6741',
      description: t('accessibilite.description'),
      pages: [{ slug: 'checklist', title: t('accessibilite.pages.checklist') }],
    },
    {
      slug: 'api', label: t('api.label'), icon: 'code', color: '#C0573E',
      description: t('api.description'),
      pages: [{ slug: 'reference', title: t('api.pages.reference') }],
    },
    {
      slug: 'guides', label: t('guides.label'), icon: 'book', color: '#D4A017',
      description: t('guides.description'),
      pages: [{ slug: 'integration-nextjs', title: t('guides.pages.integration-nextjs') }],
    },
    {
      slug: 'etudes-culturelles', label: t('etudes-culturelles.label'), icon: 'globe', color: '#2A4A6B',
      description: t('etudes-culturelles.description'),
      pages: [{ slug: 'wax-pan-africain', title: t('etudes-culturelles.pages.wax-pan-africain') }],
    },
    {
      slug: 'exemples', label: t('exemples.label'), icon: 'desktop', color: '#8B4513',
      description: t('exemples.description'),
      pages: [{ slug: 'showcase', title: t('exemples.pages.showcase') }],
    },
    {
      slug: 'ressources', label: t('ressources.label'), icon: 'download', color: '#4A6741',
      description: t('ressources.description'),
      pages: [{ slug: 'telechargements', title: t('ressources.pages.telechargements') }],
    },
  ];
}

// Legacy export for backward compatibility (non-i18n usage)
export const NAV_SPACES: NavSpace[] = [
  {
    slug: 'commencer', label: 'Commencer', icon: 'play', color: '#C0573E',
    description: 'Installation, premiers pas, structure du projet.',
    pages: [
      { slug: 'introduction', title: 'Introduction' },
      { slug: 'installation', title: 'Installation' },
      { slug: 'structure', title: 'Structure du projet' },
    ],
  },
  {
    slug: 'concepts', label: 'Concepts fondamentaux', icon: 'compass', color: '#2A4A6B',
    description: "La philosophie derrière le standard.",
    pages: [
      { slug: 'philosophie', title: 'Philosophie' },
      { slug: 'tracability', title: 'Tracability' },
    ],
  },
  {
    slug: 'motifs', label: 'Motifs', icon: 'th-large', color: '#D4A017',
    description: "1 248 motifs documentés et sourcés.",
    pages: [
      { slug: 'intro', title: 'Introduction' },
      { slug: 'utiliser-patterns-code', title: 'Utiliser dans votre code' },
      { slug: 'ndop-bamoum', title: 'Ndop Bamoum' },
      { slug: 'kente-royale', title: 'Kente Royale' },
      { slug: 'bogolan-fanga', title: 'Bogolan Fanga' },
    ],
  },
  {
    slug: 'couleurs', label: 'Couleurs', icon: 'palette', color: '#8B4513',
    description: 'Palettes extraites de pigments naturels africains.',
    pages: [
      { slug: 'introduction', title: 'Introduction' },
      { slug: 'color-picker', title: 'Color Picker' },
      { slug: 'integration', title: 'Intégration' },
      { slug: 'design-system', title: 'Design System' },
      { slug: 'palette-principale', title: 'Palette principale' },
    ],
  },
  {
    slug: 'tokens', label: 'Design Tokens', icon: 'sliders-h', color: '#4A6741',
    description: 'Couleur, espace, rythme — nommés et versionnés.',
    pages: [{ slug: 'reference', title: 'Référence des tokens' }],
  },
  {
    slug: 'composants', label: 'Composants', icon: 'box', color: '#C0573E',
    description: 'Bibliothèque UI copy-and-paste.',
    pages: [{ slug: 'bouton', title: 'Bouton' }, { slug: 'carte', title: 'Carte' }],
  },
  {
    slug: 'icones', label: 'Icônes', icon: 'sun', color: '#D4A017',
    description: 'Set iconographique cohérent avec le standard.',
    pages: [{ slug: 'catalogue', title: 'Catalogue' }],
  },
  {
    slug: 'svg', label: 'SVG', icon: 'image', color: '#2A4A6B',
    description: 'Fichiers sources haute-fidélité, prêts à intégrer.',
    pages: [{ slug: 'export', title: "Guide d'export" }],
  },
  {
    slug: 'typographie', label: 'Typographie', icon: 'font', color: '#8B4513',
    description: 'Échelle, familles, usages.',
    pages: [{ slug: 'echelle', title: 'Échelle typographique' }],
  },
  {
    slug: 'accessibilite', label: 'Accessibilité', icon: 'eye', color: '#4A6741',
    description: 'Contrastes, focus, navigation clavier.',
    pages: [{ slug: 'checklist', title: 'Checklist WCAG' }],
  },
  {
    slug: 'api', label: 'API', icon: 'code', color: '#C0573E',
    description: 'Accès programmatique au standard.',
    pages: [{ slug: 'reference', title: 'Référence API' }],
  },
  {
    slug: 'guides', label: 'Guides', icon: 'book', color: '#D4A017',
    description: "Tutoriels pas à pas pour intégrer AVS.",
    pages: [{ slug: 'integration-nextjs', title: 'Intégration Next.js' }],
  },
  {
    slug: 'etudes-culturelles', label: 'Études culturelles', icon: 'globe', color: '#2A4A6B',
    description: 'Origine, symbolique et histoire des motifs.',
    pages: [{ slug: 'wax-pan-africain', title: 'Le wax pan-africain' }],
  },
  {
    slug: 'exemples', label: 'Exemples', icon: 'desktop', color: '#8B4513',
    description: 'Projets réels construits avec AVS.',
    pages: [{ slug: 'showcase', title: 'Showcase' }],
  },
  {
    slug: 'ressources', label: 'Ressources', icon: 'download', color: '#4A6741',
    description: 'Fichiers source, kits, bibliographie.',
    pages: [{ slug: 'telechargements', title: 'Téléchargements' }],
  },
];

export function findSpace(slug: string) {
  return NAV_SPACES.find((s) => s.slug === slug);
}