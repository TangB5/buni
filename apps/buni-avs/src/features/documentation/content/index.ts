// Documentation content index
// Each document is a structured content block

export interface DocContent {
  id: string;
  title: string;
  slug: string;
  section: string;
  content: React.ReactNode;
  description: string;
}

// Getting Started
export const docIntro = {
  id: 'intro',
  title: 'Introduction',
  slug: 'intro',
  section: 'getting-started',
  description: 'Qu\'est-ce que AVS et comment commencer',
  content: `
# Introduction à AVS

AVS (African Visual Standard) est un écosystème numérique africain composé de 7 applications indépendantes partageant un socle commun.

## 3 Principes fondateurs

### 1. Public par défaut
Comme PrimeReact ou Shadcn/UI, toutes les ressources (composants, motifs, templates, icônes) sont accessibles sans authentification. Le compte est optionnel — il ne sert qu'à contribuer.

### 2. Copy & Paste ownership
Les composants ne sont pas des dépendances opaques. Vous copiez le code dans votre projet, il vous appartient. Aucun lock-in.

### 3. Culturellement ancré
Chaque token de couleur, chaque motif CSS et chaque composant est documenté avec sa source culturelle africaine primaire.

## Les 7 Applications

| App | Domaine |
|-----|---------|
| buni-avs | avs.buni.africa |
| buni-icons | icons.buni.africa |
| buni-components | ui.buni.africa |
| buni-templates | templates.buni.africa |
| buni-drop | drop.buni.africa |
| buni-behance | behance.buni.africa |
| buni-mode | mode.buni.africa |
  `,
};

export const docSetup = {
  id: 'setup',
  title: 'Installation',
  slug: 'setup',
  section: 'getting-started',
  description: 'Installation et configuration initiale',
  content: `
# Installation

## Prérequis

- Node.js 20+
- pnpm (recommandé)

## Installation du monorepo

\`\`\`bash
git clone https://github.com/buni/buni.git
cd buni
pnpm install
\`\`\`

## Lancer une application en développement

\`\`\`bash
nx dev buni-avs          # Lance buni-avs sur le port 3000
nx dev buni-components   # Lance buni-components sur le port 3001
\`\`\`

## Build

\`\`\`bash
nx build buni-avs        # Build une app
nx affected:build        # Build uniquement les apps affectées
\`\`\`

## Structure du monorepo

\`\`\`
buni/
├── apps/          ← 7 applications Next.js
├── packages/      ← 9 bibliothèques partagées
├── services/      ← Backend (API, media, search)
└── tools/         ← Scripts utilitaires
\`\`\`
  `,
};

export const docFirstPattern = {
  id: 'first-pattern',
  title: 'Votre premier motif',
  slug: 'first-pattern',
  section: 'getting-started',
  description: 'Créer et utiliser votre premier motif CSS',
  content: `
# Votre premier motif

Les motifs AVS sont des classes CSS réutilisables basées sur des designs africains authentiques.

## Utiliser un motif existant

\`\`\`jsx
<div className="avs-pattern-kente w-64 h-64 rounded-avs">
  Contenu avec motif Kente
</div>
\`\`\`

## Les 13 motifs disponibles

1. **avs-pattern-kente-royale** — Akan (Ghana)
2. **avs-pattern-ndop-sultan** — Bamiléké (Cameroun)
3. **avs-pattern-bogolan-terre** — Bambara (Mali)
4. **avs-pattern-adinkra-sankofa** — Akan (Ghana)
5. **avs-pattern-wax-dakar** — Sénégal
6. **avs-pattern-kuba-kasai** — Kuba (Congo)
7. Et plus...

## Créer un motif personnalisé

\`\`\`css
.my-pattern {
  background: 
    repeating-linear-gradient(45deg, #C0573E, #C0573E 10px, #1D1D1B 10px, #1D1D1B 20px);
}
\`\`\`

Chaque motif doit être documenté avec sa source culturelle primaire.
  `,
};

// Concepts
export const docPhilosophy = {
  id: 'philosophy',
  title: 'Philosophie AVS',
  slug: 'philosophy',
  section: 'concepts',
  description: 'Les principes fondamentaux d\'AVS',
  content: `
# Philosophie AVS

## Pourquoi AVS?

L'identité d'un peuple se lit dans ses motifs. AVS (African Visual Standard) est un mouvement pour :

1. **Valoriser le design africain** — Chaque couleur, chaque motif a une histoire
2. **Démocratiser l'accès** — Pas de paywall, pas de lock-in
3. **Créer un standard** — Un langage visuel cohérent et authentique

## Valeurs fondamentales

### Accessibilité
- Public par défaut
- Gratuit et open source
- Documentation multilingue

### Authenticité
- Sources culturelles documentées
- Collaboration avec les artisans locaux
- Respect des traditions

### Flexibilité
- Copy & paste ownership
- Personnalisation libre
- Contributions communautaires bienvenues

## Nos ambassadeurs

Designers, développeurs, artisans africains qui croient en cette mission.
  `,
};

export const docTokens = {
  id: 'tokens',
  title: 'Design Tokens',
  slug: 'tokens',
  section: 'concepts',
  description: 'Tokens, couleurs et variables de design',
  content: `
# Design Tokens

## Qu'est-ce qu'un token?

Un token est une variable de design réutilisable : couleur, taille, rayon de border, ombre, etc.

## Les tokens AVS

### Couleurs

| Couleur | Valeur | Origine |
|---------|--------|---------|
| Primary | #C0573E | Terre brûlée (poterie Yoruba) |
| Secondary | #F5EBE0 | Lin naturel (tissu Fulani) |
| Accent | #1D1D1B | Obsidienne (basalte Kenya) |
| Kente | #D4A017 | Or kente (fil soie Asante) |

### Typographie

- **Display** — Playfair Display (titres)
- **Body** — DM Sans (corps de texte)
- **Mono** — JetBrains Mono (code)

### Espacements

\`8px, 16px, 24px, 32px, 48px, 64px\`

### Bordures

\`0.375rem (avs), 1.5rem (avs-lg)\`

### Ombres

\`3px 3px 0px #1D1D1B (style éditorial imprimé)\`

## Utilisation en CSS

\`\`\`css
:root {
  --avs-primary: #C0573E;
  --avs-secondary: #F5EBE0;
  --radius-avs: 0.375rem;
}

.button {
  background: var(--avs-primary);
  border-radius: var(--radius-avs);
}
\`\`\`

## Utilisation en Tailwind

\`\`\`jsx
<button className="bg-avs-primary text-avs-secondary rounded-avs shadow-avs">
  Button
</button>
\`\`\`
  `,
};

export const docPatterns = {
  id: 'patterns',
  title: 'Motifs culturels',
  slug: 'patterns',
  section: 'concepts',
  description: 'Les 13 motifs CSS africains',
  content: `
# Motifs culturels

Les 13 motifs AVS sont des designs CSS authentiques inspirés d'arts africains traditionnels.

## Motifs disponibles

### Kente (Ghana)
- **avs-pattern-kente-royale** — Bandes tricolores
- **avs-pattern-kente-etoile** — Croix géométrique

### Ndop (Cameroun)
- **avs-pattern-ndop-ceremoniel** — Grille losanges
- **avs-pattern-ndop-sultan** — Hexagones

### Bogolan (Mali)
- **avs-pattern-bogolan-terre** — Géométrie binaire
- **avs-pattern-bogolan-fanga** — Chevrons entrelacés

### Adinkra (Ghana)
- **avs-pattern-adinkra-sankofa** — Radial concentrique
- **avs-pattern-adinkra-nkyinkyin** — Croix dynamique

### Autres
- **avs-pattern-wax-dakar** — Floral géométrisé
- **avs-pattern-kuba-kasai** — Entrelacs velours
- **avs-pattern-ndebele-amabhaxa** — Bandes verticales
- **avs-pattern-berber-amazigh** — Losanges amazighs

## Utilisation

\`\`\`jsx
<div className="avs-pattern-kente w-full h-96 rounded-2xl" />
\`\`\`

Chaque motif s'adapte à tous les conteneurs. Les patterns se répètent infiniment.
  `,
};

export const docColors = {
  id: 'colors',
  title: 'Palette de couleurs',
  slug: 'colors',
  section: 'concepts',
  description: 'La palette de couleurs complète',
  content: `
# Palette de couleurs AVS

Toutes les couleurs AVS sont inspirées par des éléments naturels et culturels africains.

## Palette principale

### Terre brûlée (#C0573E)
Inspirée par les poteries Yoruba. Utilisée pour les accents principaux, CTA, états actifs.

### Lin naturel (#F5EBE0)
Inspirée par les tissus Fulani. Couleur de fond, surface secondaire.

### Obsidienne (#1D1D1B)
Inspirée par le basalte du Kenya. Texte principal, contrastes forts.

### Or Kente (#D4A017)
Inspirée par les fils de soie dorés Asante. Accents premium, détails.

## Utilisation en Tailwind

\`\`\`jsx
// Couleur primaire
<div className="bg-avs-primary text-avs-secondary">Texte</div>

// Tous les tokens sont disponibles
<div className="bg-avs-kente text-avs-ndop">Créatif</div>
\`\`\`

## Accessibilité

Tous les contrastes respectent WCAG AA minimum.
- Ratio 4.5:1 pour le texte
- Ratio 3:1 pour les composants
  `,
};

// All content mapped
export const ALL_DOC_CONTENT = [
  docIntro,
  docSetup,
  docFirstPattern,
  docPhilosophy,
  docTokens,
  docPatterns,
  docColors,
  // Components
  {
    id: 'button',
    title: 'Button',
    slug: 'button',
    section: 'components',
    description: 'Composant bouton avec variantes',
    content: 'Contenu du composant Button — Variantes (primary, secondary, ghost, outline, danger, kente, link), tailles (sm, md, lg, xl), états (disabled, loading)',
  },
  {
    id: 'card',
    title: 'Card',
    slug: 'card',
    section: 'components',
    description: 'Composant card pour conteneurs',
    content: 'Contenu du composant Card — Variantes (default, elevated, flat), avec header, content, footer',
  },
  {
    id: 'badge',
    title: 'Badge',
    slug: 'badge',
    section: 'components',
    description: 'Badges et étiquettes',
    content: 'Contenu du composant Badge — Variantes de couleur, dot indicator, pill style',
  },
  {
    id: 'form',
    title: 'Form Elements',
    slug: 'form',
    section: 'components',
    description: 'Éléments de formulaire',
    content: 'Contenu des formulaires — Input, Textarea, Select, Checkbox, Toggle, Radio',
  },
  // Guides
  {
    id: 'theming',
    title: 'Thématisation',
    slug: 'theming',
    section: 'guides',
    description: 'Personnaliser le thème',
    content: 'Guide pour créer des thèmes personnalisés avec les tokens AVS',
  },
  {
    id: 'accessibility',
    title: 'Accessibilité',
    slug: 'accessibility',
    section: 'guides',
    description: 'Bonnes pratiques d\'accessibilité',
    content: 'Guide pour créer des interfaces accessibles — WCAG, ARIA, focus management',
  },
  {
    id: 'performance',
    title: 'Performance',
    slug: 'performance',
    section: 'guides',
    description: 'Optimisation des performances',
    content: 'Guide pour optimiser les performances — lazy loading, code splitting, caching',
  },
  {
    id: 'migration',
    title: 'Migration depuis avs-frontend',
    slug: 'migration',
    section: 'guides',
    description: 'Migrer depuis l\'ancien monorepo',
    content: 'Guide de migration — imports, structure, components',
  },
  // API Reference
  {
    id: 'auth-api',
    title: 'Authentication',
    slug: 'auth-api',
    section: 'api',
    description: 'API d\'authentification',
    content: 'Référence API — useAuth, useLogin, useRegister, useLogout',
  },
  {
    id: 'patterns-api',
    title: 'Patterns API',
    slug: 'patterns-api',
    section: 'api',
    description: 'API des motifs',
    content: 'Référence API — GET /api/patterns, POST /api/patterns',
  },
  {
    id: 'errors',
    title: 'Error Handling',
    slug: 'errors',
    section: 'api',
    description: 'Gestion des erreurs',
    content: 'Guide de gestion des erreurs — error codes, retry logic',
  },
];

export function getDocBySlug(slug: string) {
  return ALL_DOC_CONTENT.find((doc) => doc.slug === slug);
}

export function getDocsBySection(section: string) {
  return ALL_DOC_CONTENT.filter((doc) => doc.section === section);
}
