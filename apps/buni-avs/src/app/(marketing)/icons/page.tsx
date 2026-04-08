'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, Download, Link2, ExternalLink } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type IconCategory = 'all' | 'symbols' | 'patterns' | 'nature' | 'culture';
type ImportFormat = 'react' | 'img' | 'cdn' | 'svg';

interface AvsIcon {
  id: string;
  name: string;
  label: string;
  category: Exclude<IconCategory, 'all'>;
  file: string; // /patterns/*.svg ou /icons/*.svg
  tags: string[];
  origin: string;
  meaning: string;
}

// ── Registre des icônes / motifs SVG ──────────────────────────────────────────
// Inclut vos 3 SVG existants + futurs
const ICONS: AvsIcon[] = [
  {
    id: 'ndop-bamoum',
    name: 'NdopBamoum',
    label: 'Ndop Bamoum',
    category: 'patterns',
    file: '/patterns/ndop-bamoum.svg',
    tags: ['ndop', 'cameroun', 'bamoum', 'royal'],
    origin: 'Foumban, Cameroun',
    meaning: 'Tissu sacré du Sultanat Bamoum — royauté et spiritualité',
  },
  {
    id: 'toghu-bamileke',
    name: 'ToghuBamileke',
    label: 'Toghu Bamiléké',
    category: 'patterns',
    file: '/patterns/toghu-bamileke.svg',
    tags: ['toghu', 'cameroun', 'bamileke', 'velours'],
    origin: 'Bafoussam, Cameroun',
    meaning: 'Tissu de velours brodé des chefferies Bamiléké',
  },
  {
    id: 'toghu-bamenda',
    name: 'ToghuBamenda',
    label: 'Toghu Bamenda',
    category: 'patterns',
    file: '/patterns/toghu-bamenda.svg',
    tags: ['toghu', 'cameroun', 'bamenda', 'northwest'],
    origin: 'Bamenda, Cameroun',
    meaning: 'Variante Bamenda du Toghu — région Nord-Ouest',
  },
  // Placeholders pour futurs SVG à ajouter dans public/patterns/
  {
    id: 'adinkra-sankofa',
    name: 'AdinkraSankofa',
    label: 'Adinkra Sankofa',
    category: 'symbols',
    file: '/patterns/adinkra-sankofa.svg',
    tags: ['adinkra', 'ghana', 'sankofa', 'sagesse'],
    origin: 'Akan, Ghana',
    meaning: 'Sankofa — revenir en arrière pour avancer',
  },
  {
    id: 'kente-stripe',
    name: 'KenteStripe',
    label: 'Bande Kente',
    category: 'patterns',
    file: '/patterns/kente-stripe.svg',
    tags: ['kente', 'ghana', 'bande', 'tissu'],
    origin: 'Kumasi, Ghana',
    meaning: 'Motif de bande kente Asante',
  },
] as const;

const CDN_BASE = 'https://cdn.avs-standard.com/icons/v1';

// ── Utilitaire copie ───────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copied, copy };
}

// ── Génération du code d'import ────────────────────────────────────────────────
function getImportCode(icon: AvsIcon, format: ImportFormat): string {
  switch (format) {
    case 'react':
      return `import { ${icon.name} } from '@avs/icons';

// Usage
<${icon.name} size={24} className="text-avs-primary" />`;

    case 'img':
      return `<img
  src="/patterns/${icon.id}.svg"
  alt="${icon.label}"
  width={64}
  height={64}
/>

{/* Avec Next.js Image */}
import Image from 'next/image';
<Image src="/patterns/${icon.id}.svg"
  alt="${icon.label}"
  width={64} height={64}
  unoptimized />`;

    case 'cdn':
      return `<!-- HTML direct -->
<img src="${CDN_BASE}/${icon.id}.svg" alt="${icon.label}" />

<!-- Lien CDN direct -->
${CDN_BASE}/${icon.id}.svg`;

    case 'svg':
      return `/* Téléchargez le SVG et importez-le */
import { ReactComponent as ${icon.name} } from './icons/${icon.id}.svg';

/* Ou directement comme background CSS */
.my-element {
  background-image: url('/patterns/${icon.id}.svg');
  background-size: cover;
}`;
  }
}

// ── Carte icône ────────────────────────────────────────────────────────────────
function IconCard({ icon, onSelect }: { icon: AvsIcon; onSelect: (icon: AvsIcon) => void }) {
  const { copied, copy } = useCopy();
  const [imgError, setImgError] = useState(false);
  const CSS_MAP: Record<string, string> = {
    'ndop-bamoum': 'avs-pattern-ndop-royal',
    'toghu-bamileke': 'avs-pattern-ndop',
    'toghu-bamenda': 'avs-pattern-ndop',
    'adinkra-sankofa': 'avs-pattern-kente',
    'kente-stripe': 'avs-pattern-kente',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group avs-card hover:shadow-avs-md cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-0.5"
      onClick={() => onSelect(icon)}
    >
      {/* Aperçu */}
      <div
        className="bg-avs-secondary/60 relative flex h-28 items-center justify-center"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.04) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {!imgError ? (
          <Image
            width={64}
            height={64}
            src={icon.file}
            alt={icon.label}
            className="h-16 w-16 object-contain transition-transform group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback CSS si le SVG n'existe pas encore
          <div
            className={`${CSS_MAP[icon.id] ?? 'avs-pattern-wax'} rounded-avs h-16 w-16`}
            aria-label={icon.label}
          />
        )}
        {/* Overlay copie rapide */}
        <div className="bg-avs-accent/70 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              void copy(`import { ${icon.name} } from '@avs/icons';`, icon.id);
            }}
            className="rounded-avs bg-avs-primary text-avs-secondary flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold"
            aria-label="Copier l'import"
          >
            {copied === icon.id ? (
              <>
                <Check size={10} /> Copié
              </>
            ) : (
              <>
                <Copy size={10} /> Copier
              </>
            )}
          </button>
          <a
            href={icon.file}
            download={`${icon.id}.svg`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-avs bg-avs-secondary/20 text-avs-secondary flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold"
            aria-label="Télécharger le SVG"
          >
            <Download size={10} /> SVG
          </a>
        </div>
      </div>

      {/* Infos */}
      <div className="px-3 py-2.5">
        <p className="text-avs-accent truncate font-mono text-xs font-bold">{icon.name}</p>
        <p className="text-avs-accent/45 mt-0.5 truncate text-[10px]">{icon.origin}</p>
      </div>
    </motion.div>
  );
}

// ── Panneau latéral détail ─────────────────────────────────────────────────────
function IconDetailPanel({ icon, onClose }: { icon: AvsIcon; onClose: () => void }) {
  const [format, setFormat] = useState<ImportFormat>('react');
  const { copied, copy } = useCopy();
  const [imgError, setImgError] = useState(false);
  const CSS_MAP: Record<string, string> = {
    'ndop-bamoum': 'avs-pattern-ndop-royal',
    'toghu-bamileke': 'avs-pattern-ndop',
    'toghu-bamenda': 'avs-pattern-ndop',
    'adinkra-sankofa': 'avs-pattern-kente',
    'kente-stripe': 'avs-pattern-kente',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.25 }}
      className="bg-avs-secondary border-avs-accent/10 h-full space-y-5 overflow-y-auto border-l p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-avs-accent font-bold">{icon.label}</h3>
        <button
          onClick={onClose}
          className="text-avs-accent/40 hover:text-avs-accent text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Grand aperçu */}
      <div className="rounded-avs-lg border-avs-accent/10 bg-avs-accent/5 flex h-36 items-center justify-center border">
        {!imgError ? (
          <Image
            width={128}
            height={128}
            src={icon.file}
            alt={icon.label}
            className="h-24 w-24 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`${CSS_MAP[icon.id] ?? 'avs-pattern-wax'} rounded-avs-lg h-24 w-24`} />
        )}
      </div>

      {/* Métadonnées */}
      <div className="space-y-2">
        {[
          { l: 'Composant', v: icon.name },
          { l: 'Origine', v: icon.origin },
          { l: 'Catégorie', v: icon.category },
          { l: 'Fichier', v: icon.file },
        ].map(({ l, v }) => (
          <div key={l} className="flex gap-3 text-xs">
            <span className="text-avs-accent/35 w-20 shrink-0 font-bold tracking-wider uppercase">
              {l}
            </span>
            <span className="text-avs-accent/70 font-mono">{v}</span>
          </div>
        ))}
        <div className="rounded-avs bg-avs-primary/8 border-avs-primary text-avs-accent/70 border-l-2 px-3 py-2 text-xs italic">
          {icon.meaning}
        </div>
      </div>

      {/* Sélecteur format */}
      <div>
        <p className="avs-label mb-2">Format d&apos;import</p>
        <div className="flex flex-wrap gap-1.5">
          {(['react', 'img', 'cdn', 'svg'] as ImportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-avs px-2.5 py-1 text-xs font-bold uppercase transition-all ${format === f ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/50 hover:text-avs-accent border'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="rounded-avs-lg bg-avs-accent text-avs-secondary scrollbar-thin overflow-x-auto p-4 font-mono text-[11px] leading-relaxed">
          {getImportCode(icon, format)}
        </pre>
        <button
          onClick={() => void copy(getImportCode(icon, format), `detail-${icon.id}`)}
          className="rounded-avs bg-avs-secondary/10 text-avs-secondary hover:text-avs-secondary absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[10px]"
        >
          {copied === `detail-${icon.id}` ? (
            <>
              <Check size={10} /> Copié
            </>
          ) : (
            <>
              <Copy size={10} /> Copier
            </>
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <a
          href={icon.file}
          download={`${icon.id}.svg`}
          className="avs-btn-primary flex items-center justify-center gap-2 py-2.5 text-center text-sm"
        >
          <Download size={14} /> Télécharger SVG
        </a>
        <button
          onClick={() => void copy(`${CDN_BASE}/${icon.id}.svg`, `cdn-${icon.id}`)}
          className="avs-btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm"
        >
          <Link2 size={14} />
          {copied === `cdn-${icon.id}` ? 'Lien copié !' : 'Copier lien CDN'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function IconsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<IconCategory>('all');
  const [selected, setSelected] = useState<AvsIcon | null>(null);
  const { copied, copy } = useCopy();

  const filtered = ICONS.filter((icon) => {
    const q = search.toLowerCase();
    const matchS =
      !q || icon.label.toLowerCase().includes(q) || icon.tags.some((t) => t.includes(q));
    const matchC = category === 'all' || icon.category === category;
    return matchS && matchC;
  });

  const categories: { value: IconCategory; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'patterns', label: 'Motifs' },
    { value: 'symbols', label: 'Symboles' },
    { value: 'nature', label: 'Nature' },
    { value: 'culture', label: 'Culture' },
  ];

  return (
    <div className="bg-avs-secondary min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="border-avs-accent/10 avs-pattern-wax border-b px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
            Ressources visuelles
          </span>
          <h1 className="font-display text-avs-accent mt-1 text-4xl font-bold sm:text-5xl">
            Icônes & Motifs SVG
          </h1>
          <p className="text-avs-accent/60 mt-3 max-w-lg leading-relaxed">
            Motifs SVG vectoriels du patrimoine africain. Téléchargeables, importables via CDN ou
            React. Aucune authentification requise.
          </p>

          {/* Méthodes d'import rapide */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: 'CDN', cmd: `<script src="${CDN_BASE}/avs-icons.js"></script>` },
              { label: 'npm', cmd: 'npm install @avs/icons' },
              { label: 'pnpm', cmd: 'pnpm add @avs/icons' },
            ].map(({ label, cmd }) => (
              <button
                key={label}
                onClick={() => void copy(cmd, `hero-${label}`)}
                className="rounded-avs border-avs-accent/20 bg-avs-secondary/80 hover:border-avs-primary/40 hover:text-avs-primary flex items-center gap-2 border px-3 py-2 font-mono text-xs backdrop-blur-sm transition-colors"
              >
                <span className="text-avs-primary font-bold">{label}</span>
                <span className="text-avs-accent/60">
                  {cmd.length > 35 ? cmd.slice(0, 35) + '…' : cmd}
                </span>
                {copied === `hero-${label}` ? (
                  <Check size={11} className="text-green-500" />
                ) : (
                  <Copy size={11} className="text-avs-accent/30" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layout grille + panneau ─────────────────────────────────────────── */}
      <div className="flex min-h-[calc(100vh-14rem)]">
        {/* Colonne principale */}
        <div className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Filtres */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[180px] flex-1">
                <Search
                  size={14}
                  className="text-avs-accent/35 absolute top-1/2 left-3 -translate-y-1/2"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="avs-input py-2 pl-9 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setCategory(value)}
                    className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-all ${category === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent border'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-avs-accent/40 text-xs">
                {filtered.length} icône{filtered.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Grille */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((icon) => (
                <IconCard key={icon.id} icon={icon} onSelect={setSelected} />
              ))}
            </div>

            {/* CTA ajouter ses SVG */}
            <div className="rounded-avs-lg border-avs-accent/15 mt-10 border-2 border-dashed p-8 text-center">
              <p className="font-display text-avs-accent/50 font-semibold">
                Vous avez des SVG à ajouter ?
              </p>
              <p className="text-avs-accent/35 mt-1 text-sm">
                Placez vos fichiers dans{' '}
                <code className="bg-avs-accent/8 rounded px-1 font-mono">public/patterns/</code> et
                déclarez-les dans{' '}
                <code className="bg-avs-accent/8 rounded px-1 font-mono">svg-patterns.ts</code>
              </p>
              <a
                href="https://github.com/avs-standard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-avs-primary mt-4 inline-flex items-center gap-2 text-xs font-semibold hover:underline"
              >
                <ExternalLink size={12} /> Contribuer sur GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Panneau latéral détail */}
        <AnimatePresence>
          {selected && (
            <div className="w-72 shrink-0">
              <IconDetailPanel icon={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
