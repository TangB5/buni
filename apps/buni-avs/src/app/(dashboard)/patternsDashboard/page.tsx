'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, MoreVertical, Edit2, Trash2,
  Eye, EyeOff, Star, Download, ArrowUpDown, CheckCircle2,
  Clock, AlertCircle, Layers,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type Status   = 'published' | 'draft' | 'review' | 'rejected';
type SortKey  = 'name' | 'views' | 'downloads' | 'createdAt' | 'updatedAt';

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

// ── Données mock ───────────────────────────────────────────────────────────────
const PATTERNS: MyPattern[] = [
  { id:'1', slug:'ndop-bamoum',     name:'Ndop Royal Bamoum',  type:'NDOP',    region:'Cameroun',    status:'published', views:1820, downloads:340, featured:true,  css:'avs-pattern-ndop-royal', createdAt:'2024-01-15', updatedAt:'2024-03-10' },
  { id:'2', slug:'kente-ewe',       name:'Kente Ewé',          type:'KENTE',   region:'Ghana/Togo',  status:'draft',     views:0,    downloads:0,   featured:false, css:'avs-pattern-kente',      createdAt:'2024-02-20', updatedAt:'2024-02-20' },
  { id:'3', slug:'wax-senegalais',  name:'Wax Sénégalais',     type:'WAX',     region:'Sénégal',     status:'review',    views:340,  downloads:82,  featured:false, css:'avs-pattern-wax',        createdAt:'2024-03-01', updatedAt:'2024-03-05' },
  { id:'4', slug:'bogolan-malien',  name:'Bogolan du Mali',    type:'BOGOLAN', region:'Mali',        status:'published', views:920,  downloads:210, featured:true,  css:'avs-pattern-wax-bold',   createdAt:'2023-11-10', updatedAt:'2024-01-22' },
  { id:'5', slug:'ndebele-mural',   name:'Ndebele Mural',      type:'NDEBELE', region:'Afr. du Sud', status:'rejected',  views:0,    downloads:0,   featured:false, css:'avs-pattern-wax',        createdAt:'2024-03-18', updatedAt:'2024-03-20' },
  { id:'6', slug:'toghu-bamileke',  name:'Toghu Bamiléké',     type:'NDOP',    region:'Cameroun',    status:'draft',     views:0,    downloads:0,   featured:false, css:'avs-pattern-ndop',       createdAt:'2024-04-02', updatedAt:'2024-04-02' },
];

// ── Config statuts ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  published: { label:'Publié',       icon: CheckCircle2, classes:'bg-green-100 text-green-700' },
  draft:     { label:'Brouillon',    icon: Clock,        classes:'bg-avs-accent/10 text-avs-accent/60' },
  review:    { label:'En révision',  icon: AlertCircle,  classes:'bg-amber-100 text-amber-700' },
  rejected:  { label:'Rejeté',       icon: AlertCircle,  classes:'bg-red-100 text-red-600' },
};

// ── Menu contextuel ────────────────────────────────────────────────────────────
function ActionMenu({ pattern, onDelete }: { pattern: MyPattern; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-avs p-1.5 text-avs-accent/40 hover:bg-avs-accent/8 hover:text-avs-accent"
        aria-label="Actions"
        aria-expanded={open}
      >
        <MoreVertical size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-avs-lg border border-avs-accent/10 bg-white shadow-avs-lg"
            >
              <Link
                href={`/dashboard/patterns/${pattern.slug}/edit`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-avs-accent hover:bg-avs-primary/8 hover:text-avs-primary"
                onClick={() => setOpen(false)}
              >
                <Edit2 size={13} /> Modifier
              </Link>
              <Link
                href={`/patterns/${pattern.slug}`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-avs-accent hover:bg-avs-primary/8 hover:text-avs-primary"
                onClick={() => setOpen(false)}
              >
                <Eye size={13} /> Voir public
              </Link>
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-avs-accent hover:bg-avs-primary/8"
                onClick={() => setOpen(false)}
              >
                {pattern.featured ? <EyeOff size={13} /> : <Star size={13} />}
                {pattern.featured ? 'Retirer vedette' : 'Mettre en vedette'}
              </button>
              <div className="mx-4 my-1 h-px bg-avs-accent/8" />
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                onClick={() => { onDelete(pattern.id); setOpen(false); }}
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

const SortBtn = ({ col, label, sortKey, toggleSort }: { col: SortKey; label: string; sortKey: SortKey; toggleSort: (key: SortKey) => void }) => (
  <button
    onClick={() => toggleSort(col)}
    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-avs-accent/50 hover:text-avs-accent"
  >
    {label}
    <ArrowUpDown size={11} className={sortKey === col ? 'text-avs-primary' : ''} />
  </button>
);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function MyPatternsPage() {
  const [patterns,  setPatterns]  = useState(PATTERNS);
  const [search,    setSearch]    = useState('');
  const [statusF,   setStatusF]   = useState<Status | 'all'>('all');
  const [sortKey,   setSortKey]   = useState<SortKey>('updatedAt');
  const [sortDir,   setSortDir]   = useState<'asc' | 'desc'>('desc');
  const [selected,  setSelected]  = useState<Set<string>>(new Set());

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = patterns
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
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

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce motif définitivement ?')) {
      setPatterns(ps => ps.filter(p => p.id !== id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  };

  return (
    <div className="min-h-screen bg-avs-secondary/50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-avs-accent/10 bg-avs-secondary px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-avs-accent">Mes Motifs</h1>
            <p className="text-sm text-avs-accent/50">{patterns.length} motif{patterns.length > 1 ? 's' : ''} au total</p>
          </div>
          <Link href="/dashboard/patterns/new" className="avs-btn-primary gap-1.5 text-xs py-2 px-4">
            <Plus size={14} /> Nouveau motif
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">

        {/* ── Stats rapides ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            { label: 'Publiés',      value: patterns.filter(p => p.status === 'published').length, color: 'text-green-600' },
            { label: 'Brouillons',   value: patterns.filter(p => p.status === 'draft').length,     color: 'text-avs-accent/50' },
            { label: 'En révision',  value: patterns.filter(p => p.status === 'review').length,    color: 'text-amber-600' },
            { label: 'Total vues',   value: patterns.reduce((s, p) => s + p.views, 0).toLocaleString(), color: 'text-avs-primary' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} className="avs-card p-4 text-center">
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-avs-accent/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Filtres & Recherche ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un motif…"
              className="avs-input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-avs-accent/40" />
            {(['all','published','draft','review','rejected'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-all ${statusF === s ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent'}`}
              >
                {s === 'all' ? 'Tous' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Actions bulk ────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-avs border border-avs-primary/30 bg-avs-primary/8 px-4 py-2.5 flex items-center gap-4"
            >
              <span className="text-sm font-semibold text-avs-primary">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent hover:text-red-600">
                <Trash2 size={13} /> Supprimer
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent hover:text-avs-primary">
                <Download size={13} /> Exporter
              </button>
              <button className="ml-auto text-xs text-avs-accent/50 hover:text-avs-accent" onClick={() => setSelected(new Set())}>
                Annuler
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tableau ─────────────────────────────────────────────────────────── */}
        <div className="avs-card overflow-hidden p-0">
          {/* En-tête tableau */}
          <div className="grid grid-cols-[2rem_2.5rem_1fr_6rem_5rem_5rem_5rem_2.5rem] items-center gap-3 border-b border-avs-accent/8 bg-avs-accent/3 px-4 py-2.5">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="rounded accent-avs-primary"
              aria-label="Sélectionner tout"
            />
            <span className="text-xs text-avs-accent/40">Aperçu</span>
            <SortBtn col="name" label="Motif" sortKey={sortKey} toggleSort={toggleSort} />
            <span className="text-xs font-bold uppercase tracking-wider text-avs-accent/50">Statut</span>
            <SortBtn col="views" label="Vues" sortKey={sortKey} toggleSort={toggleSort} />
            <SortBtn col="downloads" label="DL" sortKey={sortKey} toggleSort={toggleSort} />
            <SortBtn col="updatedAt" label="Modifié" sortKey={sortKey} toggleSort={toggleSort} />
            <span />
          </div>

          {/* Lignes */}
          {filtered.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-avs-accent/40">
              <Layers size={28} strokeWidth={1.5} />
              <p className="text-sm">Aucun motif trouvé</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => {
                const { label, icon: Icon, classes } = STATUS_CONFIG[p.status];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2rem_2.5rem_1fr_6rem_5rem_5rem_5rem_2.5rem] items-center gap-3 border-b border-avs-accent/6 px-4 py-3 transition-colors hover:bg-avs-primary/4 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="rounded accent-avs-primary"
                      aria-label={`Sélectionner ${p.name}`}
                    />

                    {/* Aperçu */}
                    <div className={`${p.css} h-9 w-9 rounded-avs border border-avs-accent/10`} aria-hidden />

                    {/* Nom + type */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-sm text-avs-accent">{p.name}</p>
                        {p.featured && <Star size={11} className="shrink-0 fill-avs-kente text-avs-kente" aria-label="En vedette" />}
                      </div>
                      <p className="text-xs text-avs-accent/45">{p.type} · {p.region}</p>
                    </div>

                    {/* Statut */}
                    <span className={`inline-flex items-center gap-1 rounded-avs px-2 py-0.5 text-[10px] font-bold ${classes}`}>
                      <Icon size={10} aria-hidden />
                      {label}
                    </span>

                    {/* Vues */}
                    <p className="text-sm text-avs-accent/70 tabular-nums">{p.views.toLocaleString()}</p>

                    {/* Downloads */}
                    <p className="text-sm text-avs-accent/70 tabular-nums">{p.downloads.toLocaleString()}</p>

                    {/* Date */}
                    <p className="text-xs text-avs-accent/40">{new Date(p.updatedAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}</p>

                    {/* Menu */}
                    <ActionMenu pattern={p} onDelete={handleDelete} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}