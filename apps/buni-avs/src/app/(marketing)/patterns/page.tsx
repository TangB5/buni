'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Search, SlidersHorizontal, Grid3X3, List, Download, X, Loader } from 'lucide-react';
import Link from 'next/link';
import { fetchPatterns, Pattern } from '@/lib/api';

// ── Types locaux ──────────────────────────────────────────────────────────────
type PatternType = 'ALL' | 'kente' | 'bogolan' | 'adinkra' | 'ndop' | 'wax' | 'ndebele' | 'kuba';
type Region =
  | 'ALL'
  | 'west-africa'
  | 'central-africa'
  | 'east-africa'
  | 'north-africa'
  | 'south-africa'
  | 'diaspora';
type ViewMode = 'grid' | 'list';

// ── Type mapping pour affichage ──────────────────────────────────────────────
const PATTERN_TYPE_LABELS: Record<string, string> = {
  kente: 'Kente',
  bogolan: 'Bogolan',
  adinkra: 'Adinkra',
  ndebele: 'Ndebele',
  kuba: 'Kuba',
  ndop: 'Ndop',
  wax: 'Wax',
};

const REGION_LABELS: Record<string, string> = {
  'west-africa': "Afrique de l'Ouest",
  'central-africa': 'Afrique Centrale',
  'east-africa': "Afrique de l'Est",
  'north-africa': 'Afrique du Nord',
  'south-africa': 'Afrique Australe',
  diaspora: 'Diaspora',
};

// ── Animations ────────────────────────────────────────────────────────────────
const cardV = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ── Composants ────────────────────────────────────────────────────────────────
function PatternCard({
  pattern,
  index,
  view,
}: {
  pattern: Pattern;
  index: number;
  view: ViewMode;
}) {
  const colors = [
    pattern.props.colors.primary,
    pattern.props.colors.secondary,
    pattern.props.colors.accent,
  ].filter(Boolean);

  if (view === 'list') {
    return (
      <motion.div
        custom={index}
        variants={cardV}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="rounded-avs border-avs-accent/10 bg-avs-secondary shadow-avs hover:shadow-avs-md flex items-center gap-5 border p-4 transition-all hover:-translate-x-1"
      >
        <div
          className="rounded-avs h-16 w-16 shrink-0 bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${pattern.props.colors.primary}, ${pattern.props.colors.secondary})`,
          }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-avs-accent font-bold">{pattern.props.nameFr}</h3>
              <p className="text-avs-primary text-xs font-semibold tracking-wider uppercase">
                {PATTERN_TYPE_LABELS[pattern.props.patternType]} · {pattern.props.country}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {colors.map((c) => (
                <span
                  key={c}
                  className="border-avs-accent/10 h-4 w-4 rounded-full border"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          <p className="text-avs-accent/55 mt-1 line-clamp-1 text-xs">{pattern.props.descFr}</p>
        </div>
        <Link
          href={`/patterns/${pattern.props.slug}`}
          className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs shrink-0 px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
        >
          Voir
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      custom={index}
      variants={cardV}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs hover:shadow-avs-md overflow-hidden border transition-all hover:-translate-y-1"
    >
      <Link href={`/patterns/${pattern.props.slug}`} className="block">
        <div
          className="relative h-44 overflow-hidden bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${pattern.props.colors.primary}, ${pattern.props.colors.secondary})`,
          }}
        >
          <div className="from-avs-accent/60 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="rounded-avs bg-avs-accent/80 text-avs-secondary absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
            {PATTERN_TYPE_LABELS[pattern.props.patternType]}
          </span>
          <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Download size={12} className="text-avs-secondary" aria-hidden />
            <span className="text-avs-secondary text-xs font-semibold">
              {pattern.props.viewCount.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-avs-accent line-clamp-1 font-bold">
            {pattern.props.nameFr}
          </h3>
          <p className="text-avs-primary mt-0.5 text-xs font-semibold tracking-wider uppercase">
            {pattern.props.country}
          </p>
          <p className="text-avs-accent/55 mt-2 line-clamp-2 text-xs leading-relaxed">
            {pattern.props.descFr}
          </p>
          <div className="mt-3 flex gap-1.5">
            {colors.map((c) => (
              <span
                key={c}
                className="border-avs-accent/10 h-4 w-4 rounded-full border shadow-sm"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeTab, setTypeTab] = useState<PatternType>('ALL');
  const [region, setRegion] = useState<Region>('ALL');
  const [view, setView] = useState<ViewMode>('grid');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const loadPatterns = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchPatterns({
          patternType: typeTab === 'ALL' ? undefined : typeTab,
          region: region === 'ALL' ? undefined : region,
          search: search || undefined,
        });
        setPatterns(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPatterns();
  }, [typeTab, region, search]);

  const filtered = useMemo(
    () =>
      patterns.filter((p) => {
        const q = search.toLowerCase();
        return (
          !q ||
          p.props.nameFr.toLowerCase().includes(q) ||
          p.props.country.toLowerCase().includes(q)
        );
      }),
    [patterns, search],
  );

  const typeTabsConfig: { value: PatternType; label: string }[] = [
    { value: 'ALL', label: 'Tous' },
    ...Object.entries(PATTERN_TYPE_LABELS).map(([type, label]) => ({
      value: type as PatternType,
      label,
    })),
  ];

  const regionsConfig: { value: Region; label: string }[] = [
    { value: 'ALL', label: 'Toutes régions' },
    ...Object.entries(REGION_LABELS).map(([type, label]) => ({ value: type as Region, label })),
  ];

  return (
    <div className="bg-avs-secondary min-h-screen">
      {/* ── En-tête ─────────────────────────────────────────────────────────── */}
      <div className="avs-pattern-wax border-avs-accent/10 border-b px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
            Bibliothèque
          </span>
          <h1 className="font-display text-avs-accent mt-1 text-4xl font-bold sm:text-5xl">
            Motifs Culturels
          </h1>
          <p className="text-avs-accent/60 mt-3 max-w-lg leading-relaxed">
            {!loading && patterns.length > 0
              ? `${patterns.length} motifs documentés — téléchargeables en SVG, PNG et JSON.`
              : 'Chargement des motifs...'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Barre de recherche + contrôles ─────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={16}
              className="text-avs-accent/40 absolute top-1/2 left-3 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un motif, une région…"
              className="rounded-avs border-avs-accent/15 text-avs-accent placeholder:text-avs-accent/40 focus:border-avs-primary w-full border-2 bg-white py-2.5 pr-4 pl-9 text-sm focus:outline-none"
              aria-label="Recherche de motifs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-avs-accent/40 hover:text-avs-primary absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtre région */}
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`rounded-avs flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${showFilter ? 'border-avs-primary bg-avs-primary/10 text-avs-primary' : 'border-avs-accent/15 text-avs-accent hover:border-avs-primary/40'}`}
            aria-expanded={showFilter}
          >
            <SlidersHorizontal size={15} aria-hidden />
            Filtres
            {region !== 'ALL' && <span className="bg-avs-primary ml-1 h-2 w-2 rounded-full" />}
          </button>

          {/* Vue grid/list */}
          <div className="rounded-avs border-avs-accent/15 flex overflow-hidden border">
            {(['grid', 'list'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2.5 transition-colors ${view === v ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/50 hover:text-avs-accent'}`}
                aria-label={v === 'grid' ? 'Vue grille' : 'Vue liste'}
                aria-pressed={view === v}
              >
                {v === 'grid' ? <Grid3X3 size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <p className="text-avs-accent/50 ml-auto text-sm">
            <span className="text-avs-accent font-bold">{filtered.length}</span> résultat
            {filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Panneau filtres région ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-avs border-avs-accent/10 border bg-white p-5">
                <p className="text-avs-accent/50 mb-3 text-xs font-bold tracking-widest uppercase">
                  Région
                </p>
                <div className="flex flex-wrap gap-2">
                  {regionsConfig.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setRegion(value)}
                      className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-colors ${region === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent hover:border-avs-primary/40 hover:text-avs-primary border'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Onglets type ────────────────────────────────────────────────────── */}
        <Tabs.Root
          value={typeTab}
          onValueChange={(v) => setTypeTab(v as PatternType)}
          className="mb-8"
        >
          <Tabs.List
            aria-label="Filtrer par type de motif"
            className="scrollbar-none flex gap-1 overflow-x-auto pb-1"
          >
            {typeTabsConfig.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="rounded-avs text-avs-accent/60 hover:text-avs-accent data-[state=active]:bg-avs-primary data-[state=active]:text-avs-secondary data-[state=active]:shadow-avs shrink-0 px-4 py-2 text-sm font-semibold transition-all"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* ── État chargement / Erreur ────────────────────────────────────────── */}
        {loading && (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader size={32} className="text-avs-primary animate-spin" aria-hidden />
            <p className="text-avs-accent/60">Chargement des motifs...</p>
          </div>
        )}

        {error && (
          <div className="rounded-avs-lg flex h-64 flex-col items-center justify-center gap-3 border-2 border-red-300 bg-red-50">
            <p className="font-display text-lg font-semibold text-red-600">Erreur</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-red-600 underline-offset-4 hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ── Grille / Liste ──────────────────────────────────────────────────── */}
        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <div className="rounded-avs-lg border-avs-accent/15 flex h-64 flex-col items-center justify-center gap-3 border-2 border-dashed">
              <p className="font-display text-avs-accent/40 text-lg font-semibold">
                Aucun motif trouvé
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeTab('ALL');
                  setRegion('ALL');
                }}
                className="text-avs-primary text-xs font-semibold underline-offset-4 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className={
                  view === 'grid'
                    ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-3'
                }
              >
                {filtered.map((item, i) => (
                  <PatternCard key={item.props.id} pattern={item} index={i} view={view} />
                ))}
              </motion.div>
            </AnimatePresence>
          ))}
      </div>
    </div>
  );
}
