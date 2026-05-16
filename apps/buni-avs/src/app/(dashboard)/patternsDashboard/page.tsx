'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MoreVertical, Edit2, Trash2,
  Eye, Star, Download, ArrowUpDown, CheckCircle2,
  Clock, AlertCircle, Layers, EyeOff, Filter,
  TrendingUp, FileText, Hourglass, BarChart3,
} from 'lucide-react';
import { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Status  = 'published' | 'draft' | 'review' | 'rejected';
type SortKey = 'name' | 'views' | 'downloads' | 'updatedAt';

interface MyPattern {
  id:        string;
  slug:      string;
  name:      string;
  type:      string;
  region:    string;
  status:    Status;
  views:     number;
  downloads: number;
  featured:  boolean;
  css:       string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const PATTERNS: MyPattern[] = [
  { id:'1', slug:'ndop-bamoum',    name:'Ndop Royal Bamoum', type:'NDOP',    region:'Cameroun',    status:'published', views:1820, downloads:340, featured:true,  css:'avs-pattern-ndop-sultan',   createdAt:'2024-01-15', updatedAt:'2024-03-10' },
  { id:'2', slug:'kente-ewe',      name:'Kente Ewé',         type:'KENTE',   region:'Ghana/Togo',  status:'draft',     views:0,    downloads:0,   featured:false, css:'avs-pattern-kente-royale',  createdAt:'2024-02-20', updatedAt:'2024-02-20' },
  { id:'3', slug:'wax-senegalais', name:'Wax Sénégalais',    type:'WAX',     region:'Sénégal',     status:'review',    views:340,  downloads:82,  featured:false, css:'avs-pattern-wax-dakar',     createdAt:'2024-03-01', updatedAt:'2024-03-05' },
  { id:'4', slug:'bogolan-malien', name:'Bogolan du Mali',   type:'BOGOLAN', region:'Mali',        status:'published', views:920,  downloads:210, featured:true,  css:'avs-pattern-bogolan-fanga', createdAt:'2023-11-10', updatedAt:'2024-01-22' },
  { id:'5', slug:'ndebele-mural',  name:'Ndebele Mural',     type:'NDEBELE', region:'Afr. du Sud', status:'rejected',  views:0,    downloads:0,   featured:false, css:'avs-pattern-wax-dakar',     createdAt:'2024-03-18', updatedAt:'2024-03-20' },
  { id:'6', slug:'toghu-bamileke', name:'Toghu Bamiléké',    type:'NDOP',    region:'Cameroun',    status:'draft',     views:0,    downloads:0,   featured:false, css:'avs-pattern-ndop-sultan',   createdAt:'2024-04-02', updatedAt:'2024-04-02' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<Status, {
  label:   string;
  icon:    typeof CheckCircle2;
  pill:    string;
  dot:     string;
}> = {
  published: {
    label: 'Publié',
    icon:  CheckCircle2,
    pill:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    dot:   'bg-emerald-500',
  },
  draft: {
    label: 'Brouillon',
    icon:  FileText,
    pill:  'bg-avs-accent/8 text-avs-accent/50 border border-avs-accent/10',
    dot:   'bg-avs-accent/30',
  },
  review: {
    label: 'En révision',
    icon:  Hourglass,
    pill:  'bg-avs-kente/10 text-avs-kente border border-avs-kente/20',
    dot:   'bg-avs-kente',
  },
  rejected: {
    label: 'Rejeté',
    icon:  AlertCircle,
    pill:  'bg-red-50 text-red-600 border border-red-100',
    dot:   'bg-red-500',
  },
};

const STATUS_FILTERS: { value: Status | 'all'; label: string }[] = [
  { value: 'all',       label: 'Tous'        },
  { value: 'published', label: 'Publiés'     },
  { value: 'draft',     label: 'Brouillons'  },
  { value: 'review',    label: 'En révision' },
  { value: 'rejected',  label: 'Rejetés'     },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, accent,
}: {
  label:  string;
  value:  string | number;
  icon:   typeof TrendingUp;
  accent: string;
}) {
  return (
    <div className="avs-card group relative overflow-hidden p-5 transition-shadow duration-200 hover:shadow-avs-md">
      {/* Background accent strip */}
      <div className={`absolute inset-y-0 left-0 w-0.5 ${accent}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="avs-label">{label}</p>
          <p className="font-display mt-1 text-2xl font-black tracking-tight text-avs-accent">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent} bg-opacity-10`}>
          <Icon size={16} className={accent.replace('bg-', 'text-')} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const { label, icon: Icon, pill, dot } = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[9px] font-black tracking-[0.14em] uppercase ${pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SORT BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function SortBtn({
  col, label, sortKey, toggleSort,
}: {
  col:        SortKey;
  label:      string;
  sortKey:    SortKey;
  toggleSort: (k: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <button
      onClick={() => toggleSort(col)}
      className={`
        flex items-center gap-1 font-mono text-[9px] font-black tracking-[0.14em] uppercase
        transition-colors duration-150
        ${active ? 'text-avs-primary' : 'text-avs-accent/40 hover:text-avs-accent'}
      `}
    >
      {label}
      <ArrowUpDown size={10} className={active ? 'text-avs-primary' : ''} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION MENU
// ─────────────────────────────────────────────────────────────────────────────

function ActionMenu({
  pattern,
  onDelete,
  onToggleFeatured,
}: {
  pattern:          MyPattern;
  onDelete:         (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      icon:    Edit2,
      label:   'Modifier',
      href:    `/dashboard/patterns/${pattern.slug}/edit` as Route,
      variant: 'default' as const,
    },
    {
      icon:  Eye,
      label: 'Voir public',
      href:  `/patterns/${pattern.slug}` as Route,
      variant: 'default' as const,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        aria-expanded={open}
        className="
          flex h-7 w-7 items-center justify-center rounded-lg
          text-avs-accent/30 transition-all duration-150
          hover:bg-avs-accent/8 hover:text-avs-accent
        "
      >
        <MoreVertical size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-avs-accent/10 bg-avs-secondary shadow-avs-lg"
            >
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="
                    flex items-center gap-2.5 px-4 py-2.5
                    text-sm text-avs-accent/70
                    transition-colors duration-100
                    hover:bg-avs-primary/5 hover:text-avs-primary
                  "
                >
                  <Icon size={13} /> {label}
                </Link>
              ))}

              <button
                onClick={() => { onToggleFeatured(pattern.id); setOpen(false); }}
                className="
                  flex w-full items-center gap-2.5 px-4 py-2.5
                  text-sm text-avs-accent/70
                  transition-colors duration-100
                  hover:bg-avs-primary/5 hover:text-avs-primary
                "
              >
                {pattern.featured
                  ? <><EyeOff size={13} /> Retirer vedette</>
                  : <><Star size={13} /> Mettre en vedette</>
                }
              </button>

              <div className="avs-divider mx-3 my-1" />

              <button
                onClick={() => { onDelete(pattern.id); setOpen(false); }}
                className="
                  flex w-full items-center gap-2.5 px-4 py-2.5
                  text-sm text-red-500
                  transition-colors duration-100
                  hover:bg-red-50
                "
              >
                <Trash2 size={13} /> Supprimer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="avs-pattern-wax-dakar flex h-16 w-16 items-center justify-center rounded-2xl opacity-30" aria-hidden />
      <div className="text-center">
        <p className="font-display text-base font-bold text-avs-accent">
          {search ? 'Aucun résultat' : 'Aucun motif'}
        </p>
        <p className="mt-1 text-sm text-avs-accent/40">
          {search
            ? `Aucun motif ne correspond à « ${search} »`
            : 'Créez votre premier motif pour commencer'}
        </p>
      </div>
      {!search && (
        <Link href={`/dashboard/patterns/new` as Route} className="avs-btn-primary mt-1 gap-2">
          <Plus size={14} /> Nouveau motif
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function MyPatternsPage() {
  const [patterns,  setPatterns]  = useState<MyPattern[]>(PATTERNS);
  const [search,    setSearch]    = useState('');
  const [statusF,   setStatusF]   = useState<Status | 'all'>('all');
  const [sortKey,   setSortKey]   = useState<SortKey>('updatedAt');
  const [sortDir,   setSortDir]   = useState<'asc' | 'desc'>('desc');
  const [selected,  setSelected]  = useState<Set<string>>(new Set());

  // ── Computed stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    published:  patterns.filter((p) => p.status === 'published').length,
    drafts:     patterns.filter((p) => p.status === 'draft').length,
    review:     patterns.filter((p) => p.status === 'review').length,
    totalViews: patterns.reduce((s, p) => s + p.views, 0),
  }), [patterns]);

  // ── Sort & filter ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patterns
      .filter((p) => {
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.region.toLowerCase().includes(q);
        const matchStatus = statusF === 'all' || p.status === statusF;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'name')      return mul * a.name.localeCompare(b.name);
        if (sortKey === 'views')     return mul * (a.views - b.views);
        if (sortKey === 'downloads') return mul * (a.downloads - b.downloads);
        return mul * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      });
  }, [patterns, search, statusF, sortKey, sortDir]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce motif définitivement ?'))
      setPatterns((ps) => ps.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = (id: string) =>
    setPatterns((ps) => ps.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)));

  const handleBulkDelete = () => {
    if (confirm(`Supprimer ${selected.size} motif(s) définitivement ?`)) {
      setPatterns((ps) => ps.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
    }
  };

  const allSelected = selected.size === filtered.length && filtered.length > 0;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-avs-accent/10 bg-avs-secondary px-4 py-8 sm:px-6 lg:px-8">
        {/* Subtle watermark */}
        <div className="avs-pattern-ndop-sultan pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden />

        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-px w-6 bg-avs-primary" aria-hidden />
              <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">
                Bibliothèque personnelle · {patterns.length} motif{patterns.length > 1 ? 's' : ''}
              </span>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-avs-accent">
              Mes Motifs
            </h1>
          </div>

          <Link
            href={`/dashboard/patterns/new` as Route}
            className="avs-btn-primary group relative overflow-hidden gap-2"
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-lenear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden
            />
            <Plus size={15} /> Nouveau motif
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        {/* ══ STATS ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Publiés"     value={stats.published}  icon={CheckCircle2} accent="bg-emerald-500" />
          <StatCard label="Brouillons"  value={stats.drafts}     icon={FileText}     accent="bg-avs-accent" />
          <StatCard label="En révision" value={stats.review}     icon={Hourglass}    accent="bg-avs-kente" />
          <StatCard label="Total vues"  value={stats.totalViews} icon={BarChart3}    accent="bg-avs-primary" />
        </div>

        {/* ══ TOOLBAR ══════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-56 flex-1">
            <Search
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/35"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Motif, type, région…"
              className="avs-input pl-10 text-sm"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="shrink-0 text-avs-accent/30" aria-hidden />
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusF(value)}
                  className={`
                    rounded-xl px-3 py-1.5 font-mono text-[9px] font-black tracking-[0.14em] uppercase
                    transition-all duration-150
                    ${statusF === value
                      ? 'bg-avs-primary text-avs-secondary shadow-avs'
                      : 'border border-avs-accent/15 text-avs-accent/50 hover:border-avs-primary/20 hover:text-avs-primary'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BULK ACTION BAR ══════════════════════════════════════════════ */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 rounded-xl border border-avs-primary/25 bg-avs-primary/8 px-4 py-3">
                <span className="font-mono text-xs font-bold text-avs-primary">
                  {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
                </span>

                <div className="avs-divider h-4 w-px" />

                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent/60 transition-colors hover:text-red-500"
                >
                  <Trash2 size={12} /> Supprimer
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent/60 transition-colors hover:text-avs-primary">
                  <Download size={12} /> Exporter
                </button>

                <button
                  onClick={() => setSelected(new Set())}
                  className="ml-auto font-mono text-[9px] font-bold tracking-wider text-avs-accent/30 uppercase transition-colors hover:text-avs-accent"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ TABLE ════════════════════════════════════════════════════════ */}
        <div className="avs-card overflow-hidden">

          {/* Table header */}
          <div className="
            grid items-center gap-3 border-b border-avs-accent/8 bg-avs-secondary-dark px-5 py-3
            grid-cols-[2rem_3rem_1fr_7rem_5rem_5rem_5rem_2rem]
          ">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="rounded accent-avs-primary"
              aria-label="Tout sélectionner"
            />
            <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase text-avs-accent/30">Aperçu</span>
            <SortBtn col="name"      label="Motif"   sortKey={sortKey} toggleSort={toggleSort} />
            <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase text-avs-accent/30">Statut</span>
            <SortBtn col="views"     label="Vues"    sortKey={sortKey} toggleSort={toggleSort} />
            <SortBtn col="downloads" label="DL"      sortKey={sortKey} toggleSort={toggleSort} />
            <SortBtn col="updatedAt" label="Modifié" sortKey={sortKey} toggleSort={toggleSort} />
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ delay: i * 0.025, duration: 0.2 }}
                  className="
                    group grid items-center gap-3 border-b border-avs-accent/6 px-5 py-3.5
                    grid-cols-[2rem_3rem_1fr_7rem_5rem_5rem_5rem_2rem]
                    transition-colors duration-100 last:border-0
                    hover:bg-avs-primary/3
                  "
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="rounded accent-avs-primary"
                    aria-label={`Sélectionner ${p.name}`}
                  />

                  {/* Pattern swatch */}
                  <div
                    className={`${p.css} h-10 w-10 overflow-hidden rounded-xl border border-avs-accent/10 transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden
                  />

                  {/* Name + meta */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-avs-accent">
                        {p.name}
                      </p>
                      {p.featured && (
                        <Star
                          size={11}
                          className="shrink-0 fill-avs-kente text-avs-kente"
                          aria-label="En vedette"
                        />
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-avs-accent/40">
                      {p.type} · {p.region}
                    </p>
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={p.status} />

                  {/* Views */}
                  <p className="tabular-nums text-sm font-medium text-avs-accent/60">
                    {p.views.toLocaleString('fr-FR')}
                  </p>

                  {/* Downloads */}
                  <p className="tabular-nums text-sm font-medium text-avs-accent/60">
                    {p.downloads.toLocaleString('fr-FR')}
                  </p>

                  {/* Date */}
                  <p className="font-mono text-[10px] text-avs-accent/35">
                    {new Date(p.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>

                  {/* Action menu */}
                  <ActionMenu
                    pattern={p}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-avs-accent/8 bg-avs-secondary-dark px-5 py-3">
              <p className="font-mono text-[9px] text-avs-accent/30 tracking-wider uppercase">
                {filtered.length} motif{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
              </p>
              {(search || statusF !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setStatusF('all'); }}
                  className="font-mono text-[9px] font-bold tracking-wider uppercase text-avs-primary underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}