'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, Code2, Eye, Maximize2, X, ExternalLink, Layers } from 'lucide-react';
import {
  COMPONENT_REGISTRY,
  CATEGORY_LABELS,
  ALL_COMPONENT_CATEGORIES,
  filterComponents,
  type ComponentEntry,
  type ComponentCategory,
} from '@/features/templates/componentsregistry';

// ── Hook copie ─────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  };
  return { copied, copy };
}

// ── Bloc de code ───────────────────────────────────────────────────────────────
function CodeBlock({ code, id }: { code: string; id: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative h-full">
      <div className="border-avs-secondary/10 bg-avs-accent flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-avs-secondary font-mono text-[10px] tracking-widest uppercase">
          TSX
        </span>
        <button
          onClick={() => void copy(code, id)}
          className="rounded-avs bg-avs-secondary/10 text-avs-secondary hover:text-avs-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          {copied === id ? (
            <>
              <Check size={12} /> Copié !
            </>
          ) : (
            <>
              <Copy size={12} /> Copier
            </>
          )}
        </button>
      </div>
      <pre className="bg-avs-accent text-avs-secondary scrollbar-thin h-full overflow-auto p-5 font-mono text-[11px] leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

// ── Carte composant ────────────────────────────────────────────────────────────
function ComponentCard({
  comp,
  index,
  onFullscreen,
}: {
  comp: ComponentEntry;
  index: number;
  onFullscreen: (c: ComponentEntry) => void;
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const { copied, copy } = useCopy();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="avs-card flex flex-col overflow-hidden p-0"
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="border-avs-accent/8 flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-avs-accent font-mono text-sm font-bold">{comp.name}</h3>
            {comp.isNew && (
              <span className="rounded-avs bg-avs-primary text-avs-secondary px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                Nouveau
              </span>
            )}
            {comp.usesRadix && (
              <span className="rounded-avs border-avs-indigo/30 bg-avs-indigo/8 text-avs-indigo border px-1.5 py-0.5 text-[8px] font-bold">
                Radix
              </span>
            )}
          </div>
          <p className="text-avs-accent/50 mt-0.5 line-clamp-2 text-xs leading-snug">{comp.desc}</p>
        </div>

        {/* Toggle preview/code */}
        <div className="rounded-avs border-avs-accent/15 flex shrink-0 items-center gap-1 overflow-hidden border text-xs">
          <button
            onClick={() => setView('preview')}
            className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${view === 'preview' ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/50 hover:text-avs-accent'}`}
          >
            <Eye size={11} /> Aperçu
          </button>
          <button
            onClick={() => setView('code')}
            className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${view === 'code' ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/50 hover:text-avs-accent'}`}
          >
            <Code2 size={11} /> Code
          </button>
        </div>
      </div>

      {/* ── Zone preview / code ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-avs-secondary/50 relative min-h-[140px] flex-1"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.04) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          >
            <Suspense
              fallback={
                <div className="flex h-40 items-center justify-center">
                  <div className="avs-pattern-kente animate-avs-spin h-8 w-8 rounded-full opacity-50" />
                </div>
              }
            >
              <comp.Preview />
            </Suspense>

            {/* Bouton plein écran */}
            <button
              onClick={() => onFullscreen(comp)}
              className="rounded-avs bg-avs-secondary/80 text-avs-accent/60 shadow-avs absolute top-2 right-2 flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:opacity-100"
              style={{ opacity: undefined }}
              aria-label="Plein écran"
            >
              <Maximize2 size={11} /> Agrandir
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative min-h-[140px]"
          >
            <pre className="bg-avs-accent text-avs-secondary scrollbar-thin min-h-[140px] overflow-x-auto px-5 py-4 font-mono text-[11px] leading-relaxed">
              {comp.code}
            </pre>
            <button
              onClick={() => void copy(comp.code, comp.id)}
              className="rounded-avs bg-avs-secondary/10 text-avs-secondary hover:text-avs-secondary absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold transition-colors"
            >
              {copied === comp.id ? (
                <>
                  <Check size={10} /> Copié !
                </>
              ) : (
                <>
                  <Copy size={10} /> Copier
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="border-avs-accent/8 flex items-center border-t">
        {/* Tags */}
        <div className="flex flex-1 flex-wrap gap-1 overflow-hidden px-4 py-2.5">
          {comp.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-avs bg-avs-accent/6 text-avs-accent/45 px-1.5 py-0.5 font-mono text-[9px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Plein écran */}
        <button
          onClick={() => onFullscreen(comp)}
          className="border-avs-accent/8 text-avs-accent/40 hover:text-avs-primary flex shrink-0 items-center gap-1 border-l px-3 py-2.5 text-[10px] transition-colors"
        >
          <Maximize2 size={11} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Modal plein écran ──────────────────────────────────────────────────────────
function FullscreenModal({ comp, onClose }: { comp: ComponentEntry; onClose: () => void }) {
  const [view, setView] = useState<'preview' | 'split' | 'code'>('split');
  const { copied, copy } = useCopy();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-avs-secondary fixed inset-0 z-50 flex flex-col"
    >
      {/* Toolbar */}
      <div className="border-avs-accent/10 bg-avs-secondary flex h-12 shrink-0 items-center gap-4 border-b px-4">
        <button
          onClick={onClose}
          className="rounded-avs text-avs-accent/50 hover:bg-avs-accent/8 hover:text-avs-accent p-1.5"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
        <div className="bg-avs-accent/15 h-4 w-px" aria-hidden />
        <div className="flex items-center gap-2">
          <div className="avs-pattern-kente h-5 w-5 rounded-sm" aria-hidden />
          <span className="text-avs-accent font-mono text-sm font-bold">{comp.name}</span>
          {comp.isNew && (
            <span className="rounded-avs bg-avs-primary text-avs-secondary px-1.5 py-0.5 text-[8px] font-bold uppercase">
              Nouveau
            </span>
          )}
        </div>

        {/* Sélecteur de vue */}
        <div className="rounded-avs border-avs-accent/15 ml-auto flex items-center gap-1 border p-0.5">
          {(['preview', 'split', 'code'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-avs px-3 py-1 text-xs font-semibold transition-all ${view === v ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'text-avs-accent/50 hover:text-avs-accent'}`}
            >
              {v === 'preview' ? 'Aperçu' : v === 'split' ? 'Split' : 'Code'}
            </button>
          ))}
        </div>

        <button
          onClick={() => void copy(comp.code, `modal-${comp.id}`)}
          className="rounded-avs bg-avs-primary/10 text-avs-primary hover:bg-avs-primary hover:text-avs-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors"
        >
          {copied === `modal-${comp.id}` ? (
            <>
              <Check size={12} /> Copié !
            </>
          ) : (
            <>
              <Copy size={12} /> Copier
            </>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview */}
        {(view === 'preview' || view === 'split') && (
          <div
            className={`overflow-auto ${view === 'split' ? 'border-avs-accent/10 flex-1 border-r' : 'flex-1'}`}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.035) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          >
            <div className="mx-auto flex min-h-full max-w-2xl items-start justify-center py-8">
              <div className="w-full">
                <Suspense
                  fallback={
                    <div className="avs-pattern-kente animate-avs-spin mx-auto h-10 w-10 rounded-full" />
                  }
                >
                  <comp.Preview />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Code */}
        {(view === 'code' || view === 'split') && (
          <div className={`overflow-hidden ${view === 'split' ? 'w-[45%] shrink-0' : 'flex-1'}`}>
            <CodeBlock code={comp.code} id={`fs-${comp.id}`} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-avs-accent/10 bg-avs-secondary text-avs-accent/40 flex shrink-0 items-center gap-4 border-t px-4 py-2 text-xs">
        <span className="text-avs-accent/60 font-medium capitalize">
          {CATEGORY_LABELS[comp.category]}
        </span>
        {comp.pkg && (
          <code className="bg-avs-accent/8 rounded-avs text-avs-accent/55 px-2 py-0.5 font-mono">
            {comp.pkg}
          </code>
        )}
        {comp.usesRadix && (
          <span className="rounded-avs border-avs-indigo/30 bg-avs-indigo/8 text-avs-indigo border px-2 py-0.5 text-[9px] font-bold">
            Radix UI
          </span>
        )}
        <span className="ml-auto text-[10px]">{comp.tags.join(' · ')}</span>
      </div>
    </motion.div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function ComponentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ComponentCategory | 'all'>('all');
  const [fullscreen, setFullscreen] = useState<ComponentEntry | null>(null);
  const { copied, copy } = useCopy();

  const filtered = filterComponents({ category, search });

  const cats: { value: ComponentCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    ...ALL_COMPONENT_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <>
      <div className="bg-avs-secondary min-h-screen">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="border-avs-accent/10 bg-avs-accent border-b px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
                  Bibliothèque UI
                </span>
                <h1 className="font-display text-avs-secondary mt-1 text-4xl font-bold sm:text-5xl">
                  Composants AVS
                </h1>
                <p className="text-avs-secondary mt-3 max-w-lg leading-relaxed">
                  Composants React construits avec Radix UI et Tailwind. Preview live, copie du
                  code. Aucun compte requis.
                </p>
              </div>

              {/* Commande d'install */}
              <div className="rounded-avs-lg border-avs-secondary/15 bg-avs-secondary/8 flex items-center gap-3 border px-4 py-3 backdrop-blur-sm">
                <code className="text-avs-secondary font-mono text-xs">
                  npm install @avs/ui @radix-ui/react-* framer-motion
                </code>
                <button
                  onClick={() =>
                    void copy(
                      'npm install @avs/ui @radix-ui/react-slot framer-motion clsx tailwind-merge',
                      'hero-install',
                    )
                  }
                  className="text-avs-secondary hover:text-avs-secondary shrink-0 transition-colors"
                  aria-label="Copier la commande"
                >
                  {copied === 'hero-install' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { v: COMPONENT_REGISTRY.length.toString(), l: 'Composants' },
                { v: COMPONENT_REGISTRY.filter((c) => c.isNew).length.toString(), l: 'Nouveaux' },
                {
                  v: COMPONENT_REGISTRY.filter((c) => c.usesRadix).length.toString(),
                  l: 'Radix UI',
                },
                { v: '0', l: 'Auth requise' },
              ].map(({ v, l }) => (
                <div key={l} className="border-avs-primary/50 border-l-2 pl-3">
                  <p className="font-display text-avs-secondary text-xl font-bold">{v}</p>
                  <p className="text-avs-secondary text-xs">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Import rapide ────────────────────────────────────────────────── */}
        <div className="border-avs-accent/10 bg-avs-accent/4 border-b px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
            <span className="text-avs-accent/35 text-[10px] font-bold tracking-widest uppercase">
              Import :
            </span>
            {[
              { label: 'npm', cmd: 'npm install @avs/ui' },
              { label: 'pnpm', cmd: 'pnpm add @avs/ui' },
              { label: 'CDN', cmd: 'https://cdn.avs-standard.com/ui/latest/avs-ui.min.js' },
            ].map(({ label, cmd }) => (
              <button
                key={label}
                onClick={() => void copy(cmd, `install-${label}`)}
                className="rounded-avs border-avs-accent/15 hover:border-avs-primary/40 hover:text-avs-primary flex items-center gap-2 border bg-white px-3 py-1.5 font-mono text-xs transition-colors"
              >
                <span className="text-avs-primary font-bold">{label}</span>
                <span className="text-avs-accent/55">
                  {cmd.length > 32 ? cmd.slice(0, 32) + '…' : cmd}
                </span>
                {copied === `install-${label}` ? (
                  <Check size={10} className="text-green-500" />
                ) : (
                  <Copy size={10} className="text-avs-accent/30" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filtres (sticky) ─────────────────────────────────────────────── */}
        <div className="border-avs-accent/10 bg-avs-secondary/95 sticky top-16 z-20 border-b px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={14}
                className="text-avs-accent/35 absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un composant…"
                className="avs-input py-2 pl-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cats.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-all ${category === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent border'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-avs-accent/35 ml-auto shrink-0 text-xs">
              {filtered.length} composant{filtered.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* ── Grille ───────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="rounded-avs-lg border-avs-accent/15 flex h-64 flex-col items-center justify-center gap-3 border-2 border-dashed">
              <Layers size={28} className="text-avs-accent/25" strokeWidth={1.5} />
              <p className="text-avs-accent/40">Aucun composant trouvé pour « {search} »</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="text-avs-primary text-xs font-semibold underline-offset-4 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((comp, i) => (
                <ComponentCard key={comp.id} comp={comp} index={i} onFullscreen={setFullscreen} />
              ))}
            </div>
          )}

          {/* CTA contribuer */}
          <div className="rounded-avs-lg avs-pattern-wax-bold relative mt-12 overflow-hidden">
            <div className="bg-avs-accent/90 absolute inset-0" />
            <div className="relative px-8 py-10 text-center">
              <h2 className="font-display text-avs-secondary text-2xl font-bold">
                Contribuer un composant
              </h2>
              <p className="text-avs-secondary mx-auto mt-2 max-w-lg text-sm">
                Vous avez créé un composant AVS ? Ajoutez-le au registre en 2 étapes — il apparaît
                ici avec preview live.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href="https://github.com/avs-standard/ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="avs-btn-primary gap-1.5 py-2 text-sm"
                >
                  <ExternalLink size={13} /> GitHub
                </a>
                <a
                  href="/documentation"
                  className="rounded-avs border-avs-secondary/30 text-avs-secondary hover:text-avs-secondary border px-5 py-2 text-sm font-semibold transition-colors"
                >
                  Lire la documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal plein écran ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {fullscreen && <FullscreenModal comp={fullscreen} onClose={() => setFullscreen(null)} />}
      </AnimatePresence>
    </>
  );
}
