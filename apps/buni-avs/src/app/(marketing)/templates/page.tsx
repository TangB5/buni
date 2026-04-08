'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Copy, Check, Code2, Maximize2,
  ExternalLink, X, Layers,
} from 'lucide-react';
import {
  TEMPLATE_REGISTRY,
  CATEGORY_LABELS,
  FRAMEWORK_LABELS,
  COMPLEXITY_CONFIG,
  filterTemplates,
  ALL_CATEGORIES,
  type TemplateEntry,
  type TemplateCategory,
  type Framework,
} from '@/features/templates/templatesregistry';

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

// ── Panneau code ───────────────────────────────────────────────────────────────
function CodePanel({ code, id }: { code: string; id: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-avs-secondary/10 bg-avs-accent px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-avs-secondary">TSX</span>
        <button
          onClick={() => void copy(code, id)}
          className="flex items-center gap-1.5 rounded-avs bg-avs-secondary/10 px-3 py-1.5 text-xs font-semibold text-avs-secondary hover:text-avs-secondary transition-colors"
        >
          {copied === id ? <><Check size={12}/> Copié !</> : <><Copy size={12}/> Copier</>}
        </button>
      </div>
      <pre className="h-full overflow-auto bg-avs-accent p-5 font-mono text-[11px] leading-relaxed text-avs-secondary scrollbar-thin">
        {code}
      </pre>
    </div>
  );
}

// ── Carte template (vue liste) ─────────────────────────────────────────────────
function TemplateCard({ tpl, index, onSelect, onFullscreen }: {
  tpl:         TemplateEntry;
  index:       number;
  onSelect:    (t: TemplateEntry) => void;
  onFullscreen:(t: TemplateEntry) => void;
}) {
  const [showCode, setShowCode] = useState(false);
  const { copied, copy } = useCopy();
  const { label: cpxLabel, css: cpxCss } = COMPLEXITY_CONFIG[tpl.complexity];

  return (
    <motion.div
      initial={{ opacity:0, y:18 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.06, duration:0.4, ease:[0.22,1,0.36,1] }}
      className="avs-card group overflow-hidden p-0 flex flex-col"
    >
      {/* ── Zone de preview ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-avs-accent/8">
        {/* Fond quadrillé pour montrer la transparence */}
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage:'radial-gradient(circle, rgba(29,29,27,0.05) 1px, transparent 1px)', backgroundSize:'14px 14px' }}
          aria-hidden
        />

        {/* Rendu du vrai composant — réduit par scale */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{ height: 240 }}
          onClick={() => onSelect(tpl)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') onSelect(tpl); }}
          aria-label={`Prévisualiser ${tpl.name}`}
        >
          <div
            style={{
              transform: 'scale(0.38)',
              transformOrigin: 'top left',
              width: '263%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <Suspense fallback={<div className="h-64 bg-avs-accent/5 animate-avs-pulse" />}>
              <tpl.Component />
            </Suspense>
          </div>

          {/* Overlay d'interaction */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-avs-accent/0 transition-colors group-hover:bg-avs-accent/40">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => { e.stopPropagation(); onFullscreen(tpl); }}
                className="flex items-center gap-1.5 rounded-avs bg-avs-secondary px-3 py-2 text-xs font-bold text-avs-accent shadow-avs hover:bg-avs-primary hover:text-avs-secondary transition-colors"
                aria-label="Plein écran"
              >
                <Maximize2 size={13}/> Plein écran
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowCode(v => !v); }}
                className="flex items-center gap-1.5 rounded-avs bg-avs-accent px-3 py-2 text-xs font-bold text-avs-secondary shadow-avs hover:bg-avs-primary transition-colors"
                aria-label="Voir le code"
              >
                <Code2 size={13}/> Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Métadonnées ──────────────────────────────────────────────────── */}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-avs-accent text-sm">{tpl.name}</h3>
              {tpl.isNew && (
                <span className="rounded-avs bg-avs-primary px-1.5 py-0.5 text-[9px] font-bold text-avs-secondary uppercase tracking-wider">
                  Nouveau
                </span>
              )}
            </div>
            <p className="text-xs text-avs-accent/55 mt-0.5 leading-snug line-clamp-2">{tpl.desc}</p>
          </div>
          <span className={`shrink-0 rounded-avs px-2 py-0.5 text-[9px] font-bold uppercase ${cpxCss}`}>
            {cpxLabel}
          </span>
        </div>

        {/* Frameworks + composants */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tpl.frameworks.map(fw => (
            <span key={fw} className="rounded-avs bg-avs-accent/8 px-2 py-0.5 font-mono text-[10px] font-semibold text-avs-accent/55">
              {FRAMEWORK_LABELS[fw]}
            </span>
          ))}
          <span className="text-avs-accent/25">·</span>
          {tpl.components.slice(0,3).map(c => (
            <span key={c} className="font-mono text-[9px] text-avs-accent/35">{c}</span>
          ))}
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="border-t border-avs-accent/8 flex">
        <button
          onClick={() => setShowCode(v => !v)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-r border-avs-accent/8 transition-colors ${showCode ? 'bg-avs-primary/8 text-avs-primary' : 'text-avs-accent/50 hover:text-avs-accent'}`}
        >
          <Code2 size={12}/>{showCode ? 'Fermer' : 'Code'}
        </button>
        <button
          onClick={() => void copy(tpl.sourceCode, tpl.id)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-r border-avs-accent/8 text-avs-accent/50 hover:text-avs-primary transition-colors"
        >
          {copied === tpl.id ? <><Check size={12}/> Copié !</> : <><Copy size={12}/> Copier</>}
        </button>
        <button
          onClick={() => onFullscreen(tpl)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-avs-accent/50 hover:text-avs-primary transition-colors"
        >
          <Maximize2 size={12}/> Preview
        </button>
      </div>

      {/* ── Code expansible ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ height:0 }}
            animate={{ height: 280 }}
            exit={{ height:0 }}
            className="overflow-hidden border-t border-avs-accent/8"
          >
            <CodePanel code={tpl.sourceCode} id={`card-${tpl.id}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Modal plein écran ──────────────────────────────────────────────────────────
function FullscreenModal({ tpl, onClose }: { tpl: TemplateEntry; onClose: () => void }) {
  const [view, setView] = useState<'preview' | 'code' | 'split'>('preview');
  const { copied, copy } = useCopy();

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex flex-col bg-avs-secondary"
    >
      {/* Toolbar */}
      <div className="flex h-12 items-center gap-4 border-b border-avs-accent/10 bg-avs-secondary px-4 shrink-0">
        <button onClick={onClose} className="rounded-avs p-1.5 text-avs-accent/50 hover:bg-avs-accent/8 hover:text-avs-accent" aria-label="Fermer">
          <X size={16}/>
        </button>

        <div className="h-4 w-px bg-avs-accent/15" aria-hidden />

        <div className="flex items-center gap-2">
          <div className="avs-pattern-kente h-5 w-5 rounded-sm" aria-hidden />
          <span className="font-display text-sm font-bold text-avs-accent">{tpl.name}</span>
        </div>

        {/* Sélecteur de vue */}
        <div className="ml-auto flex items-center gap-1 rounded-avs border border-avs-accent/15 p-0.5">
          {(['preview','split','code'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-avs px-3 py-1 text-xs font-semibold capitalize transition-all ${view === v ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'text-avs-accent/50 hover:text-avs-accent'}`}>
              {v === 'split' ? 'Split' : v === 'code' ? 'Code' : 'Aperçu'}
            </button>
          ))}
        </div>

        <button
          onClick={() => void copy(tpl.sourceCode, `modal-${tpl.id}`)}
          className="flex items-center gap-1.5 rounded-avs bg-avs-primary/10 px-3 py-1.5 text-xs font-bold text-avs-primary hover:bg-avs-primary hover:text-avs-secondary transition-colors"
        >
          {copied === `modal-${tpl.id}` ? <><Check size={12}/> Copié !</> : <><Copy size={12}/> Copier le code</>}
        </button>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 overflow-hidden">

        {/* Preview */}
        {(view === 'preview' || view === 'split') && (
          <div className={`flex-1 overflow-auto ${view === 'split' ? 'border-r border-avs-accent/10' : ''}`}>
            {/* Simulateur de viewport */}
            <div className="mx-auto min-h-full">
              <Suspense fallback={<div className="flex h-48 items-center justify-center text-avs-accent/30 text-sm">Chargement…</div>}>
                <tpl.Component />
              </Suspense>
            </div>
          </div>
        )}

        {/* Code */}
        {(view === 'code' || view === 'split') && (
          <div className={`flex-1 overflow-hidden ${view === 'split' ? 'max-w-[50%]' : ''}`}>
            <CodePanel code={tpl.sourceCode} id={`fullscreen-${tpl.id}`} />
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="flex items-center gap-4 border-t border-avs-accent/10 bg-avs-secondary px-4 py-2.5 text-xs text-avs-accent/40 shrink-0">
        <span className={`rounded-avs px-2 py-0.5 text-[9px] font-bold uppercase ${COMPLEXITY_CONFIG[tpl.complexity].css}`}>
          {COMPLEXITY_CONFIG[tpl.complexity].label}
        </span>
        {tpl.frameworks.map(fw => (
          <span key={fw} className="rounded-avs bg-avs-accent/8 px-2 py-0.5 font-mono text-[10px] text-avs-accent/55">
            {FRAMEWORK_LABELS[fw]}
          </span>
        ))}
        <span className="ml-auto">{tpl.components.join(' · ')}</span>
      </div>
    </motion.div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function TemplatesPage() {
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState<TemplateCategory | 'all'>('all');
  const [framework,  setFramework]  = useState<Framework | 'all'>('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected,   setSelected]   = useState<TemplateEntry | null>(null);
  const [fullscreen, setFullscreen] = useState<TemplateEntry | null>(null);

  const filtered = filterTemplates({ category, framework, search });

  const cats: { value: TemplateCategory | 'all'; label: string }[] = [
    { value:'all', label:'Tous' },
    ...ALL_CATEGORIES.map(c => ({ value:c, label:CATEGORY_LABELS[c] })),
  ];

  return (
    <>
      <div className="min-h-screen bg-avs-secondary">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="border-b border-avs-accent/10 bg-avs-accent px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-avs-primary">Templates AVS</span>
                <h1 className="mt-1 font-display text-4xl font-bold text-avs-secondary sm:text-5xl">
                  Sections & Pages Prêtes
                </h1>
                <p className="mt-3 max-w-lg text-avs-secondary leading-relaxed">
                  Vrais composants React prévisualisables. Copiez, adaptez, déployez.
                  Aucun compte requis. Ajoutez les vôtres dans le registre.
                </p>
              </div>

              {/* Comment contribuer */}
              <div className="rounded-avs-lg border border-avs-secondary/15 bg-avs-secondary/8 px-5 py-4 backdrop-blur-sm max-w-xs">
                <p className="text-xs font-bold text-avs-secondary mb-2">Ajouter un template :</p>
                <ol className="text-xs text-avs-secondary space-y-1 list-decimal list-inside">
                  <li>Créez votre composant dans <code className="font-mono text-avs-secondary">template-components.tsx</code></li>
                  <li>Déclarez-le dans <code className="font-mono text-avs-secondary">registry/index.tsx</code></li>
                  <li>Il apparaît automatiquement ici ✓</li>
                </ol>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { v: TEMPLATE_REGISTRY.length.toString(), l:'Templates' },
                { v: TEMPLATE_REGISTRY.filter(t=>t.free).length.toString(), l:'Gratuits' },
                { v: ALL_CATEGORIES.length.toString(), l:'Catégories' },
                { v:'0', l:'Compte requis' },
              ].map(({ v, l }) => (
                <div key={l} className="border-l-2 border-avs-primary/50 pl-3">
                  <p className="font-display text-xl font-bold text-avs-secondary">{v}</p>
                  <p className="text-xs text-avs-secondary">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filtres ──────────────────────────────────────────────────────── */}
        <div className="sticky top-16 z-20 border-b border-avs-accent/10 bg-avs-secondary/95 backdrop-blur-sm px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3">
            {/* Recherche */}
            <div className="relative min-w-[200px] flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un template…"
                className="avs-input pl-9 py-2 text-sm"
              />
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-1.5">
              {cats.map(({ value, label }) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-all ${category === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Frameworks */}
            <div className="flex gap-1.5 ml-auto">
              {(['all','nextjs','react','html'] as const).map(fw => (
                <button key={fw} onClick={() => setFramework(fw)}
                  className={`rounded-avs px-2.5 py-1.5 text-[11px] font-semibold transition-all ${framework === fw ? 'bg-avs-accent text-avs-secondary' : 'border border-avs-accent/15 text-avs-accent/50 hover:text-avs-accent'}`}>
                  {fw === 'all' ? 'Tous' : FRAMEWORK_LABELS[fw]}
                </button>
              ))}
            </div>

            <p className="text-xs text-avs-accent/35 shrink-0">
              {filtered.length} résultat{filtered.length > 1 ? 's':''}
            </p>
          </div>
        </div>

        {/* ── Grille ───────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-avs-lg border-2 border-dashed border-avs-accent/15">
              <Layers size={28} className="text-avs-accent/25" strokeWidth={1.5}/>
              <p className="text-avs-accent/40">Aucun template trouvé pour « {search} »</p>
              <button onClick={() => { setSearch(''); setCategory('all'); }}
                className="text-xs font-semibold text-avs-primary hover:underline underline-offset-4">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tpl, i) => (
                <TemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  index={i}
                  onFullscreen={setFullscreen}
                />
              ))}
            </div>
          )}

          {/* CTA ajouter un template */}
          <div className="mt-14 rounded-avs-lg avs-pattern-wax-bold relative overflow-hidden">
            <div className="absolute inset-0 bg-avs-accent/90" />
            <div className="relative px-8 py-10 text-center">
              <h2 className="font-display text-2xl font-bold text-avs-secondary">Créez votre propre template</h2>
              <p className="mt-2 text-sm text-avs-secondary max-w-lg mx-auto">
                Construisez votre composant avec le design system AVS, ajoutez-le au registre,
                et il apparaît instantanément dans cette page avec prévisualisation live.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="https://github.com/avs-standard/ui" target="_blank" rel="noopener noreferrer"
                  className="avs-btn-primary text-sm py-2.5 px-6 gap-1.5">
                  <ExternalLink size={14}/> GitHub
                </a>
                <a href="/documentation"
                  className="rounded-avs border border-avs-secondary/30 px-6 py-2.5 text-sm font-semibold text-avs-secondary hover:text-avs-secondary transition-colors">
                  Lire la doc
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal plein écran ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {fullscreen && (
          <FullscreenModal tpl={fullscreen} onClose={() => setFullscreen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}