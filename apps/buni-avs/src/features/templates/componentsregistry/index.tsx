// =============================================================================
// AVS — Registre Central des Composants UI
// src/features/components/registry/index.tsx
//
// POUR AJOUTER UN NOUVEAU COMPOSANT :
// 1. Créez votre composant preview dans previews/index.tsx
// 2. Ajoutez une entrée dans COMPONENT_REGISTRY ci-dessous
// 3. Il apparaît automatiquement sur /components avec preview live
// =============================================================================

import type { ComponentType } from 'react';
import {
  ButtonPreview,
  BadgePreview,
  InputPreview,
  WaxInput,
  CardPreview,
  CssPatternsPreview,
  AlertPreview,
  TabsPreview,
  LoaderPreview,
  ToastPreview,
  AccordionPreview,
  TogglePreview,
  AvatarPreview,
  ColorSwatchPreview,
} from '../previews';

// ── Types ──────────────────────────────────────────────────────────────────────
export type ComponentCategory = 'forms' | 'display' | 'navigation' | 'feedback' | 'layout' | 'data';

export interface ComponentEntry {
  /** Identifiant unique */
  id: string;
  /** Nom du composant (style PascalCase) */
  name: string;
  /** Catégorie pour filtres */
  category: ComponentCategory;
  /** Description courte */
  desc: string;
  /** Tags de recherche */
  tags: string[];
  /** Composant React pour le preview live */
  Preview: ComponentType;
  /** Code à copier */
  code: string;
  /** Package npm source */
  pkg?: string;
  /** Nouveau composant */
  isNew?: boolean;
  /** Radix UI utilisé */
  usesRadix?: boolean;
}

// ── Registre ───────────────────────────────────────────────────────────────────
export const COMPONENT_REGISTRY: ComponentEntry[] = [
  // ── FORMS ──────────────────────────────────────────────────────────────────
  {
    id: 'button',
    name: 'AvsButton',
    category: 'forms',
    desc: 'Bouton multi-variantes (primary, secondary, kente, ghost, danger) avec états loading, disabled et icônes.',
    tags: ['button', 'btn', 'action', 'cta', 'submit', 'loading'],
    Preview: ButtonPreview,
    pkg: '@avs/ui',
    code: `import { Button } from '@/components/ui';

// Variantes
<Button variant="primary">Primaire</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="kente">Kente</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Tailles : xs | sm | md | lg | icon
<Button size="lg">Grand</Button>
<Button size="icon"><SearchIcon /></Button>

// États
<Button isLoading>Enregistrement…</Button>
<Button disabled>Désactivé</Button>

// Avec icônes
<Button leftIcon={<Download size={14} />}>Télécharger</Button>
<Button rightIcon={<ArrowRight size={14} />}>Suivant</Button>

// Comme lien (Radix Slot)
<Button asChild><a href="/patterns">Voir les motifs</a></Button>

// Classes utilitaires CSS directes
<button className="avs-btn-primary">Primaire</button>
<button className="avs-btn-secondary">Secondaire</button>`,
  },

  {
    id: 'input',
    name: 'AvsInput',
    category: 'forms',
    desc: "Champ texte avec validation Zod, icônes gauche/droite, gestion d'erreur inline et textarea.",
    tags: ['input', 'field', 'form', 'validation', 'textarea', 'search'],
    Preview: InputPreview,
    pkg: '@avs/ui',
    code: `import { Input, Label } from '@/components/ui';

// Simple
<Input placeholder="Nom du motif…" />

// Avec icône
<Input
  leftIcon={<Search size={14} />}
  placeholder="Rechercher…"
/>

// Avec erreur
<Input
  error="Format email invalide"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

// Classe utilitaire CSS
<input className="avs-input" placeholder="…" />
<input className="avs-input avs-input-error" />

// Avec label
<Label required>Nom du motif</Label>
<input className="avs-input" placeholder="ex: Ndop Bamoum" />

// Textarea
<textarea className="avs-input resize-none" rows={3} />`,
  },

  {
    id: 'toggle',
    name: 'AvsToggle',
    category: 'forms',
    desc: 'Switch on/off accessible — notifications, préférences, paramètres. Supporte ARIA.',
    tags: ['toggle', 'switch', 'checkbox', 'settings', 'preferences'],
    Preview: TogglePreview,
    isNew: true,
    code: `// Composant CSS pur — aucune dépendance
function Toggle({ checked, onChange, label }: {
  checked:  boolean;
  onChange: (v: boolean) => void;
  label:    string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={\`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary
        \${checked ? 'bg-avs-primary' : 'bg-avs-accent/20'}\`}
    >
      <span className={\`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform
        \${checked ? 'translate-x-[18px]' : 'translate-x-1'}\`} />
    </button>
  );
}`,
  },

  // ── DISPLAY ────────────────────────────────────────────────────────────────
  {
    id: 'badge',
    name: 'AvsBadge',
    category: 'display',
    desc: "Étiquettes typées pour motifs culturels, statuts de publication et indicateurs d'état.",
    tags: ['badge', 'label', 'tag', 'status', 'chip', 'pill'],
    Preview: BadgePreview,
    pkg: '@avs/ui',
    code: `import { Badge } from '@/components/ui';

// Variantes de type de motif
<Badge variant="primary">KENTE</Badge>
<Badge variant="kente">NDOP</Badge>
<Badge variant="ndop">BOGOLAN</Badge>

// Statuts
<Badge variant="success">Publié</Badge>
<Badge variant="warning">En révision</Badge>
<Badge variant="danger">Rejeté</Badge>
<Badge variant="secondary">Brouillon</Badge>

// Tailles : sm | md
<Badge size="sm">Petit</Badge>
<Badge size="md">Normal</Badge>

// Avec indicateur de statut
<span className="inline-flex items-center gap-1.5 rounded-avs bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
  En ligne
</span>`,
  },

  {
    id: 'card',
    name: 'AvsCard',
    category: 'display',
    desc: "Cartes de motifs, de stats et d'artisans avec aperçu CSS pattern, palette couleurs et interactions.",
    tags: ['card', 'pattern', 'artisan', 'stat', 'preview', 'motif'],
    Preview: CardPreview,
    pkg: '@avs/ui',
    code: `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

// Pattern card (motif culturel)
<div className="avs-pattern-ndop-royal relative overflow-hidden rounded-avs-lg shadow-avs">
  <div className="h-40" />
  <div className="absolute inset-0 bg-gradient-to-t from-avs-accent/80 to-transparent" />
  <div className="absolute bottom-3 left-3">
    <Badge>NDOP</Badge>
    <p className="font-display font-bold text-avs-secondary">Ndop Bamoum</p>
  </div>
</div>

// Card avec contenu
<Card variant="elevated" padding="md">
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>Contenu de la carte</CardContent>
</Card>

// PatternCard (feature complète)
import { PatternCard } from '@/features/patterns/components/PatternCard';
<PatternCard pattern={pattern} index={0} featured={false} />`,
  },

  {
    id: 'css-patterns',
    name: 'AVS CSS Patterns',
    category: 'display',
    desc: 'Motifs africains Kente, Ndop, Wax et Bogolan générés en CSS pur — aucune image requise.',
    tags: ['pattern', 'css', 'background', 'kente', 'ndop', 'wax', 'bogolan', 'motif'],
    Preview: CssPatternsPreview,
    code: `/* Import du fichier CSS */
import '@/theme/patterns/patterns.css';

/* Appliquer via className */
<div className="avs-pattern-kente" />
<div className="avs-pattern-ndop-royal" />
<div className="avs-pattern-wax" />
<div className="avs-pattern-wax-bold" />
<div className="avs-pattern-ndop" />

/* Exemples d'usage */
// Section hero
<section className="avs-pattern-ndop-royal relative min-h-screen">
  <div className="absolute inset-0 bg-avs-accent/80" />
  <div className="relative">…</div>
</section>

// Avatar
<div className="avs-pattern-kente h-10 w-10 rounded-full" />

// Spinner animé
<div className="avs-pattern-kente h-10 w-10 animate-avs-spin rounded-full" />

// Bande décorative
<div className="avs-pattern-wax h-2 w-full" />`,
  },

  {
    id: 'avatar',
    name: 'AvsAvatar',
    category: 'display',
    desc: 'Avatars avec motifs africains comme fond, badge de rôle et groupes empilés.',
    tags: ['avatar', 'user', 'profile', 'group', 'artisan'],
    Preview: AvatarPreview,
    isNew: true,
    code: `// Avatar simple avec motif
<div className="avs-pattern-kente h-10 w-10 rounded-full border-2 border-avs-secondary flex items-center justify-center overflow-hidden">
  <span className="font-display font-black text-avs-secondary drop-shadow">A</span>
</div>

// Avatar avec badge de rôle
<div className="relative inline-block">
  <div className="avs-pattern-ndop-royal h-12 w-12 rounded-full border-2 border-avs-secondary flex items-center justify-center overflow-hidden">
    <span className="font-display text-lg font-black text-avs-secondary drop-shadow">N</span>
  </div>
  <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-avs-primary px-1 text-[7px] font-black text-avs-secondary border border-avs-secondary">
    ✓
  </div>
</div>

// Groupe empilé
<div className="flex -space-x-2">
  {avatars.map((a, i) => (
    <div key={i} className={\`\${a.css} h-9 w-9 rounded-full border-2 border-avs-secondary\`} />
  ))}
  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-avs-secondary bg-avs-accent text-avs-secondary text-[10px] font-bold">
    +5
  </div>
</div>`,
  },

  {
    id: 'color-swatch',
    name: 'AvsColorSwatch',
    category: 'display',
    desc: 'Swatches de couleurs culturelles cliquables avec copie HEX et token CSS.',
    tags: ['color', 'swatch', 'palette', 'hex', 'tokens', 'copy'],
    Preview: ColorSwatchPreview,
    isNew: true,
    code: `// Swatch interactif avec copie HEX
function ColorSwatch({ hex, name, label }: { hex: string; name: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const isLight = parseInt(hex.slice(1), 16) > 0xaaaaaa;

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="group overflow-hidden rounded-avs-lg border border-avs-accent/10 shadow-avs hover:-translate-y-0.5 transition-all"
    >
      <div className="relative h-12" style={{ backgroundColor: hex }}>
        <span className={\`absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity \${isLight ? 'text-avs-accent' : 'text-white'}\`}>
          {copied ? '✓ Copié' : 'Copier'}
        </span>
      </div>
      <div className="bg-white p-2">
        <p className="font-mono text-[9px] text-avs-accent/45">{hex}</p>
        <p className="text-[10px] font-semibold text-avs-accent">{label}</p>
      </div>
    </button>
  );
}`,
  },

  // ── NAVIGATION ─────────────────────────────────────────────────────────────
  {
    id: 'tabs',
    name: 'AvsTabs',
    category: 'navigation',
    desc: 'Onglets accessibles basés sur Radix UI — deux styles : bordure bas et pills.',
    tags: ['tabs', 'navigation', 'radix', 'panels', 'onglets'],
    Preview: TabsPreview,
    usesRadix: true,
    pkg: '@radix-ui/react-tabs',
    code: `import * as Tabs from '@radix-ui/react-tabs';

// Style bordure bas
<Tabs.Root value={active} onValueChange={setActive}>
  <Tabs.List className="flex border-b border-avs-accent/10">
    <Tabs.Trigger
      value="motifs"
      className="px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all
        data-[state=active]:border-avs-primary data-[state=active]:text-avs-primary
        data-[state=inactive]:border-transparent data-[state=inactive]:text-avs-accent/50"
    >
      Motifs
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="motifs" className="pt-4">…</Tabs.Content>
</Tabs.Root>

// Style pills
<Tabs.Root value={active} onValueChange={setActive}>
  <Tabs.List className="flex gap-1 rounded-avs-lg bg-avs-accent/5 p-1">
    <Tabs.Trigger
      value="motifs"
      className="flex-1 rounded-avs px-3 py-1.5 text-sm font-semibold transition-all
        data-[state=active]:bg-avs-secondary data-[state=active]:text-avs-accent data-[state=active]:shadow-avs
        data-[state=inactive]:text-avs-accent/50"
    >
      Motifs
    </Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>`,
  },

  {
    id: 'accordion',
    name: 'AvsAccordion',
    category: 'navigation',
    desc: 'Sections repliables pour FAQ, documentation et contenu structuré. Animation CSS.',
    tags: ['accordion', 'faq', 'collapse', 'expand', 'sections'],
    Preview: AccordionPreview,
    code: `// Accordion CSS pur (sans Radix)
function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map(({ q, a }, i) => {
        const id = String(i);
        return (
          <div key={id} className="overflow-hidden rounded-avs border border-avs-accent/12">
            <button
              onClick={() => setOpen(open === id ? null : id)}
              aria-expanded={open === id}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-avs-primary/5 transition-colors"
            >
              <span className="text-sm font-semibold text-avs-accent pr-4">{q}</span>
              <span className={\`font-bold text-avs-primary text-lg leading-none transition-transform \${open === id ? 'rotate-45' : ''}\`}>
                +
              </span>
            </button>
            {open === id && (
              <div className="border-t border-avs-accent/8 bg-avs-accent/3 px-4 py-3">
                <p className="text-xs text-avs-accent/65 leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}`,
  },

  // ── FEEDBACK ───────────────────────────────────────────────────────────────
  {
    id: 'alert',
    name: 'AvsAlert',
    category: 'feedback',
    desc: 'Alertes dismissables typées : info, success, warning, error. Avec icône et bouton fermer.',
    tags: ['alert', 'notification', 'message', 'info', 'warning', 'error', 'success'],
    Preview: AlertPreview,
    pkg: '@/components/feedback',
    code: `import { Alert } from '@/components/feedback';

// Alertes typées avec fermeture
<Alert variant="info"    message="Nouveau motif disponible." />
<Alert variant="success" message="Votre motif a été publié !" />
<Alert variant="warning" title="Attention" message="Validation en attente." />
<Alert variant="error"   message="Erreur lors de la soumission." onClose={() => {}} />

// Inline sans composant
<div className="flex items-start gap-3 rounded-avs border border-green-200 bg-green-50 px-3.5 py-3 text-green-700">
  <CheckCircle size={14} className="mt-0.5 shrink-0" />
  <p className="text-xs font-medium">Motif publié avec succès !</p>
  <button onClick={onClose} className="ml-auto opacity-50 hover:opacity-100">×</button>
</div>`,
  },

  {
    id: 'toast',
    name: 'AvsToast',
    category: 'feedback',
    desc: 'Système de notifications temporaires avec auto-dismiss, 4 types et hook useToast.',
    tags: ['toast', 'notification', 'snackbar', 'temporary', 'dismiss'],
    Preview: ToastPreview,
    isNew: true,
    pkg: '@/components/feedback',
    code: `import { useToast } from '@/components/feedback';

// Hook useToast
function MonComposant() {
  const { add, ToastContainer } = useToast();

  return (
    <>
      <button onClick={() => add({ variant:'success', message:'Motif publié !' })}>
        Publier
      </button>
      <button onClick={() => add({ variant:'error', title:'Erreur', message:'Réessayez.' })}>
        Erreur
      </button>

      {/* Conteneur positionné en bas à droite */}
      <ToastContainer />
    </>
  );
}

// Toast manuel (auto-dismiss 4.5s)
const { id } = add({
  variant:  'kente',       // success | error | warning | info | kente
  title:    'Vedette',     // optionnel
  message:  '✦ Motif mis en vedette !',
});`,
  },

  {
    id: 'loader',
    name: 'AvsLoader',
    category: 'feedback',
    desc: 'Spinners culturels (Kente, Ndop), dots animés, skeletons et page de chargement complète.',
    tags: ['loader', 'spinner', 'skeleton', 'loading', 'kente', 'dots'],
    Preview: LoaderPreview,
    pkg: '@avs/ui',
    code: `import { Spinner, Skeleton, LoadingPage } from '@/components/feedback';

// Spinner inline
<Spinner size={20} label="Chargement…" />

// Spinner motif Kente (CSS uniquement)
<div className="avs-pattern-kente h-10 w-10 animate-avs-spin rounded-full" />
<div className="avs-pattern-ndop  h-10 w-10 animate-avs-spin rounded-full" />

// Dots animés
<div className="flex gap-1">
  {[0, 1, 2].map(i => (
    <div key={i}
      className="h-2 w-2 rounded-full bg-avs-primary animate-avs-pulse"
      style={{ animationDelay: \`\${i * 0.2}s\` }}
    />
  ))}
</div>

// Skeleton loader
<Skeleton className="h-44 w-full rounded-avs-lg" />
<Skeleton className="h-4 w-3/4 mt-3" />

// Page complète
<LoadingPage label="Chargement des motifs…" />`,
  },

  // ── DATA ───────────────────────────────────────────────────────────────────
  {
    id: 'color-swatch-data',
    name: 'AvsColorSwatch',
    category: 'data',
    desc: 'Grille de swatches culturels interactifs — copie HEX, tokens CSS et noms culturels.',
    tags: ['color', 'palette', 'swatch', 'hex', 'token', 'data'],
    Preview: ColorSwatchPreview,
    isNew: true,
    code: `// Voir entry 'color-swatch' dans la section Display pour le code complet.
// Importer depuis @/features/components/previews ou créer votre propre version.

// Usage rapide :
const AVS_PALETTE = [
  { hex:'#C0573E', name:'avs-primary',   label:'Terre brûlée' },
  { hex:'#F5EBE0', name:'avs-secondary', label:'Lin naturel'  },
  { hex:'#1D1D1B', name:'avs-accent',    label:'Obsidienne'   },
  { hex:'#D4A017', name:'avs-kente',     label:'Or kente'     },
  { hex:'#4A6741', name:'avs-ndop',      label:'Vert Bamiléké'},
  { hex:'#2A4A6B', name:'avs-indigo',    label:'Bleu bogolan' },
];`,
  },
  {
    id: 'wax-input',
    name: 'WaxInput',
    category: 'forms',
    desc: 'Input signature AVS : bordure activée par un pattern Wax dynamique au focus.',
    tags: ['input', 'wax', 'animation', 'signature', 'premium'],
    Preview: WaxInput, // Tu créeras cet export dans ton fichier previews/index.tsx
    isNew: true,
    code: `/* Utilise le composant WaxInput avec le pattern CSS avs-pattern-wax-bold */
<WaxInput />

// Dans ton CSS (avs-tokens.css ou patterns.css):
.avs-input-wax-focus {
  border-image: linear-gradient(45deg, #C0573E, #D4A017) 1;
  /* Utilise l'animation définie dans tailwind.config.ts */
}`,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
export const ALL_COMPONENT_CATEGORIES = [
  ...new Set(COMPONENT_REGISTRY.map((c) => c.category)),
] as ComponentCategory[];

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  forms: 'Formulaires',
  display: 'Affichage',
  navigation: 'Navigation',
  feedback: 'Feedback',
  layout: 'Layout',
  data: 'Données',
};

export function filterComponents(opts: {
  category?: ComponentCategory | 'all';
  search?: string;
}): ComponentEntry[] {
  const { category = 'all', search = '' } = opts;
  const q = search.toLowerCase();

  return COMPONENT_REGISTRY.filter((c) => {
    const matchCat = category === 'all' || c.category === category;
    const matchS =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q));
    return matchCat && matchS;
  });
}
