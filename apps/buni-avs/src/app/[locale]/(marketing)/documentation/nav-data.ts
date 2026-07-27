// ─────────────────────────────────────────────────────────────────────────────
// The 15 documentation spaces. Each has its own icon/accent — used to build
// the sidebar tree, the homepage category grid and the search index.
// ─────────────────────────────────────────────────────────────────────────────

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