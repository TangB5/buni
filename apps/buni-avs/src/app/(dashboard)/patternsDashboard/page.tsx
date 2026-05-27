'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Star,
  Download,
  ArrowUpDown,
  CheckCircle2,
  Layers,
  EyeOff,
  Filter,
  ArrowLeft,
  FileText,
  Hourglass,
  BarChart3,
  X,
} from 'lucide-react';
import { Route } from 'next';
import { Pattern, PatternSymbol } from '@buni/patterns';
import { patternService } from 'apps/buni-avs/src/features/patterns/services/pattern.service';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Status = 'published' | 'draft' | 'review' | 'rejected';
type SortKey = 'name' | 'views' | 'downloads' | 'updatedAt';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  Status,
  { label: string; icon: typeof CheckCircle2; pill: string; dot: string }
> = {
  published: {
    label: 'Publié',
    icon: CheckCircle2,
    pill: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  draft: {
    label: 'Brouillon',
    icon: FileText,
    pill: 'bg-avs-accent/8 text-avs-accent/50 border border-avs-accent/10',
    dot: 'bg-avs-accent/30',
  },
  review: {
    label: 'En révision',
    icon: Hourglass,
    pill: 'bg-avs-kente/10 text-avs-kente border border-avs-kente/20',
    dot: 'bg-avs-kente',
  },
  rejected: {
    label: 'Rejeté',
    icon: CheckCircle2,
    pill: 'bg-red-50 text-red-600 border border-red-100',
    dot: 'bg-red-500',
  },
};

const STATUS_FILTERS: { value: Status | 'all'; label: string }[] = [

  { value: 'all', label: 'Tous' },
  { value: 'published', label: 'Publiés' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'review', label: 'En révision' },
  { value: 'rejected', label: 'Rejetés' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD  — même patron que profil : top-accent + glow
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: typeof Layers;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="group border-avs-accent/9 bg-avs-secondary relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}35`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: color }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${color}25` }}
        aria-hidden
      />
      <div className="relative">
        <div
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${color}12`, color }}
        >
          <Icon size={16} aria-hidden />
        </div>
        <p className="text-avs-accent/35 font-mono text-[9px] font-bold tracking-[0.18em] uppercase">
          {label}
        </p>
        <p
          className="font-display text-avs-accent mt-2 text-3xl leading-none font-black"
          style={{ letterSpacing: '-0.025em' }}
        >
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </p>
        {sub && <p className="text-avs-accent/35 mt-1.5 text-[11px]">{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const normalizedStatus =
  status?.toLowerCase() as Status;

const { label, dot, pill } =
  STATUS_CFG[normalizedStatus];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[9px] font-black tracking-[0.14em] uppercase ${pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SORT BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function SortBtn({
  col,
  label,
  sortKey,
  toggleSort,
}: {
  col: SortKey;
  label: string;
  sortKey: SortKey;
  toggleSort: (k: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <button
      onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 font-mono text-[9px] font-black tracking-[0.14em] uppercase transition-colors ${active ? 'text-avs-primary' : 'text-avs-accent/40 hover:text-avs-accent'}`}
    >
      {label} <ArrowUpDown size={10} className={active ? 'text-avs-primary' : ''} />
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
  pattern: Pattern;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        aria-expanded={open}
        className="text-avs-accent/30 hover:bg-avs-accent/8 hover:text-avs-accent flex h-7 w-7 items-center justify-center rounded-lg transition-all"
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
              className="border-avs-accent/9 bg-avs-secondary shadow-avs-lg absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/dashboard/patterns/${pattern.slug}/edit` as Route}
                onClick={() => setOpen(false)}
                className="text-avs-accent/70 hover:bg-avs-primary/5 hover:text-avs-primary flex items-center gap-2.5 px-4 py-2.5 text-sm"
              >
                <Edit2 size={13} /> Modifier
              </Link>
              <Link
                href={`/patterns/${pattern.slug}` as Route}
                onClick={() => setOpen(false)}
                className="text-avs-accent/70 hover:bg-avs-primary/5 hover:text-avs-primary flex items-center gap-2.5 px-4 py-2.5 text-sm"
              >
                <Eye size={13} /> Voir public
              </Link>
              <button
                onClick={() => {
                  onToggleFeatured(pattern.id);
                  setOpen(false);
                }}
                className="text-avs-accent/70 hover:bg-avs-primary/5 hover:text-avs-primary flex w-full items-center gap-2.5 px-4 py-2.5 text-sm"
              >
                {pattern.featured ? (
                  <>
                    <EyeOff size={13} /> Retirer vedette
                  </>
                ) : (
                  <>
                    <Star size={13} /> Mettre en vedette
                  </>
                )}
              </button>
              <div className="bg-avs-accent/8 mx-3 my-1 h-px" />
              <button
                onClick={() => {
                  onDelete(pattern.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
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
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="avs-pattern-wax-dakar h-12 w-12 rounded-2xl opacity-20" aria-hidden />
      <p className="font-display text-avs-accent text-base font-bold">
        {search ? 'Aucun résultat' : 'Aucun motif'}
      </p>
      <p className="text-avs-accent/40 max-w-xs text-sm">
        {search
          ? `Aucun motif ne correspond à « ${search} »`
          : 'Créez votre premier motif pour commencer'}
      </p>
      {!search && (
        <Link href={'/dashboard/patterns/new' as Route} className="avs-btn-primary mt-2 gap-2">
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
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<Status | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const normalizeStatus = (
  status?: string
): Status => {
  switch (status?.toUpperCase()) {
    case 'PUBLISHED':
      return 'published';

    case 'DRAFT':
      return 'draft';

    case 'REVIEW':
      return 'review';

    case 'REJECTED':
      return 'rejected';

    default:
      return 'draft';
  }
};
  useEffect(() => {
    const loadPatterns = async () => {
      try {
        const patterns = (await patternService.loadPatterns()).map(
  (p) => ({
    ...p,
    status: normalizeStatus(p.status),
  })
);

        
        setPatterns(patterns);
      } catch (error) {
        console.error(error);
        // setPatterns(PATTERNS);
      }
    };

    loadPatterns();
  }, []);

  const stats = useMemo(
    () => ({
      published: patterns.filter((p) => p.status === 'published').length,
      drafts: patterns.filter((p) => p.status === 'draft').length,
      review: patterns.filter((p) => p.status === 'review').length,
      totalViews: patterns.reduce((s, p) => s + p.views, 0),
    }),
    [patterns]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patterns
      .filter((p) => {
        const matchSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.origin.region.toLowerCase().includes(q);
        const matchStatus = statusF === 'all' || p.status === statusF;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'name') return mul * a.name.localeCompare(b.name);
        if (sortKey === 'views') return mul * (a.views - b.views);
        if (sortKey === 'downloads') return mul * (a.downloads - b.downloads);
        return (
          mul *
          (new Date(a.updatedAt ?? '1970-01-01').getTime() -
            new Date(b.updatedAt ?? '1970-01-01').getTime())
        );
      });
  }, [patterns, search, statusF, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce motif définitivement ?'))
      setPatterns((ps) => ps.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = (id: string) =>
    setPatterns((ps) => ps.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id))
    );

  const allSelected = selected.size === filtered.length && filtered.length > 0;

  return (
    <div className="bg-avs-secondary-dark min-h-screen">
      {/* ══ STICKY HEADER — même patron que profil ══════════════════════════ */}
      <div className="border-avs-accent/9 bg-avs-secondary sticky top-0 z-30 border-b backdrop-blur-xl">
        {/* Watermark pattern — identique profil */}
        <div
          className="avs-pattern-ndop-sultan pointer-events-none absolute inset-0 opacity-[0.025]"
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="border-avs-accent/16 text-avs-accent/55 hover:text-avs-accent flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150"
              title="Retour au tableau de bord"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1
                className="font-display text-avs-accent leading-none font-black"
                style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', letterSpacing: '-0.02em' }}
              >
                Mes Motifs
              </h1>
              <p className="text-avs-accent/35 mt-0.5 text-xs">
                {patterns.length} motif{patterns.length > 1 ? 's' : ''} au total
              </p>
            </div>
          </div>

          <Link
            href={'/dashboard/patterns/new' as Route}
            className="group bg-avs-primary text-avs-secondary shadow-avs-md relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden
            />
            <Plus size={15} /> Nouveau motif
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* ══ STAT CARDS — même patron que profil ════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Publiés" value={stats.published} icon={CheckCircle2} color="#4A6741" />
          <StatCard label="Brouillons" value={stats.drafts} icon={FileText} color="#1D1D1B" />
          <StatCard label="En révision" value={stats.review} icon={Hourglass} color="#D4A017" />
          <StatCard
            label="Vues totales"
            value={stats.totalViews}
            icon={BarChart3}
            color="#C0573E"
          />
        </div>

        {/* ══ FILTERS ═════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search
              size={13}
              className="text-avs-accent/35 absolute top-1/2 left-3.5 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Motif, type, région…"
              className="avs-input pl-10 text-sm"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  aria-label="Effacer"
                  className="text-avs-accent/40 hover:text-avs-accent absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                >
                  <X size={12} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-avs-accent/30 shrink-0" aria-hidden />
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusF(value)}
                className={`rounded-xl px-3 py-1.5 font-mono text-[9px] font-black tracking-[0.14em] uppercase transition-all duration-150 ${statusF === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/50 hover:border-avs-primary/20 hover:text-avs-primary border'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ BULK BAR ════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-avs-primary/25 bg-avs-primary/8 flex items-center gap-4 rounded-xl border px-4 py-3">
                <span className="text-avs-primary font-mono text-xs font-bold">
                  {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
                </span>
                <div className="bg-avs-accent/15 h-3.5 w-px" />
                <button className="text-avs-accent/50 flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-red-500">
                  <Trash2 size={12} /> Supprimer
                </button>
                <button className="text-avs-accent/50 hover:text-avs-primary flex items-center gap-1.5 text-xs font-semibold transition-colors">
                  <Download size={12} /> Exporter
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-avs-accent/30 hover:text-avs-accent ml-auto font-mono text-[9px] font-bold tracking-wider uppercase transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ TABLE — section avec border comme profil ════════════════════════ */}
        <section className="border-avs-accent/9 bg-avs-secondary overflow-hidden rounded-2xl border">
          {/* Top accent strip — identique profil */}
          <div className="avs-pattern-ndop-sultan h-0.5 w-full" aria-hidden />

          {/* Table header */}
          <div className="border-avs-accent/8 bg-avs-accent/3 grid grid-cols-[2rem_3rem_1fr_7rem_5rem_5rem_5rem_2rem] items-center gap-3 border-b px-5 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="accent-avs-primary rounded"
              aria-label="Tout sélectionner"
            />
            <span className="text-avs-accent/30 font-mono text-[9px] font-bold tracking-[0.14em] uppercase">
              Aperçu
            </span>
            <SortBtn col="name" label="Motif" sortKey={sortKey} toggleSort={toggleSort} />
            <span className="text-avs-accent/30 font-mono text-[9px] font-bold tracking-[0.14em] uppercase">
              Statut
            </span>
            <SortBtn col="views" label="Vues" sortKey={sortKey} toggleSort={toggleSort} />
            <SortBtn col="downloads" label="DL" sortKey={sortKey} toggleSort={toggleSort} />
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
                  className="group border-avs-accent/6 hover:bg-avs-primary/3 grid grid-cols-[2rem_3rem_1fr_7rem_5rem_5rem_5rem_2rem] items-center gap-3 border-b px-5 py-3.5 transition-colors last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="accent-avs-primary rounded"
                    aria-label={`Sélectionner ${p.name}`}
                  />

                  <div
                    className={`${p.cssClass} border-avs-accent/10 h-10 w-10 overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-avs-accent truncate text-sm font-bold">{p.name}</p>
                      {p.featured && (
                        <Star
                          size={11}
                          className="fill-avs-kente text-avs-kente shrink-0"
                          aria-label="En vedette"
                        />
                      )}
                    </div>
                    <p className="text-avs-accent/40 mt-0.5 font-mono text-[10px]">
                      {p.type} · {p.origin.region}
                    </p>
                  </div>

                  <StatusBadge status={p.status} />

                  <p className="text-avs-accent/60 text-sm font-medium tabular-nums">
                    {p.views.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-avs-accent/60 text-sm font-medium tabular-nums">
                    {p.downloads.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-avs-accent/35 font-mono text-[10px]">
                    {p.updatedAt
                      ? new Date(p.updatedAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : '—'}
                  </p>

                  <ActionMenu
                    pattern={p}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="border-avs-accent/8 bg-avs-accent/3 flex items-center justify-between border-t px-5 py-3">
              <span className="text-avs-accent/30 font-mono text-[9px] tracking-wider uppercase">
                {filtered.length} motif{filtered.length > 1 ? 's' : ''} affiché
                {filtered.length > 1 ? 's' : ''}
              </span>
              {(search || statusF !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusF('all');
                  }}
                  className="text-avs-primary font-mono text-[9px] font-bold tracking-wider uppercase underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}
