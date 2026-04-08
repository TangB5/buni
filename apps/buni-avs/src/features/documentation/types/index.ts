// Documentation sidebar navigation structure

export interface DocPage {
  id: string;
  title: string;
  section: string;
  slug: string;
  icon?: string;
}

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  pages: DocPage[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    pages: [
      { id: 'intro', title: 'Introduction', section: 'getting-started', slug: 'intro' },
      { id: 'setup', title: 'Installation', section: 'getting-started', slug: 'setup' },
      { id: 'first-pattern', title: 'Votre premier motif', section: 'getting-started', slug: 'first-pattern' },
    ],
  },
  {
    id: 'concepts',
    title: 'Concepts',
    icon: '💡',
    pages: [
      { id: 'philosophy', title: 'Philosophie AVS', section: 'concepts', slug: 'philosophy' },
      { id: 'tokens', title: 'Design Tokens', section: 'concepts', slug: 'tokens' },
      { id: 'patterns', title: 'Motifs culturels', section: 'concepts', slug: 'patterns' },
      { id: 'colors', title: 'Palette de couleurs', section: 'concepts', slug: 'colors' },
    ],
  },
  {
    id: 'components',
    title: 'Composants',
    icon: '🧩',
    pages: [
      { id: 'button', title: 'Button', section: 'components', slug: 'button' },
      { id: 'card', title: 'Card', section: 'components', slug: 'card' },
      { id: 'badge', title: 'Badge', section: 'components', slug: 'badge' },
      { id: 'form', title: 'Form Elements', section: 'components', slug: 'form' },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    icon: '📖',
    pages: [
      { id: 'theming', title: 'Thématisation', section: 'guides', slug: 'theming' },
      { id: 'accessibility', title: 'Accessibilité', section: 'guides', slug: 'accessibility' },
      { id: 'performance', title: 'Performance', section: 'guides', slug: 'performance' },
      { id: 'migration', title: 'Migration depuis avs-frontend', section: 'guides', slug: 'migration' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: '⚙️',
    pages: [
      { id: 'auth-api', title: 'Authentication', section: 'api', slug: 'auth-api' },
      { id: 'patterns-api', title: 'Patterns API', section: 'api', slug: 'patterns-api' },
      { id: 'errors', title: 'Error Handling', section: 'api', slug: 'errors' },
    ],
  },
];

export function getAllPages(): DocPage[] {
  return DOC_SECTIONS.flatMap((section) => section.pages);
}

export function getPageBySectionAndSlug(section: string, slug: string): DocPage | undefined {
  return getAllPages().find((page) => page.section === section && page.slug === slug);
}
