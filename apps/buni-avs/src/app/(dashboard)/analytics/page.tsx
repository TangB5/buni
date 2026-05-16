'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Eye, Download,
  Users, Layers, Calendar, BarChart3,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d' | '1y';

interface PeriodMetrics {
  views:          number;
  viewsDelta:     number;
  downloads:      number;
  downloadsDelta: number;
  visitors:       number;
  visitorsDelta:  number;
  patterns:       number;
  patternsDelta:  number;
}

interface DayData {
  day:   string;
  views: number;
  dl:    number;
}

interface TopPattern {
  name:      string;
  views:     number;
  downloads: number;
  pct:       number;
  css:       string;
  type:      string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PERIODS: { value: Period; label: string }[] = [
  { value: '7d',  label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '3 mois' },
  { value: '1y',  label: '1 an' },
];

const METRICS: Record<Period, PeriodMetrics> = {
  '7d':  { views: 4240,   viewsDelta: 12,  downloads: 380,   downloadsDelta: 8,  visitors: 1820,  visitorsDelta: 5,  patterns: 2,  patternsDelta: 0  },
  '30d': { views: 18400,  viewsDelta: 24,  downloads: 1640,  downloadsDelta: 18, visitors: 7200,  visitorsDelta: 15, patterns: 4,  patternsDelta: 33 },
  '90d': { views: 52000,  viewsDelta: 38,  downloads: 4800,  downloadsDelta: 31, visitors: 19000, visitorsDelta: 22, patterns: 8,  patternsDelta: 14 },
  '1y':  { views: 195000, viewsDelta: 67,  downloads: 18200, downloadsDelta: 54, visitors: 72000, visitorsDelta: 48, patterns: 12, patternsDelta: 20 },
};

const BAR_DATA: DayData[] = [
  { day: 'Lun', views: 480,  dl: 42  },
  { day: 'Mar', views: 620,  dl: 58  },
  { day: 'Mer', views: 390,  dl: 31  },
  { day: 'Jeu', views: 850,  dl: 94  },
  { day: 'Ven', views: 1120, dl: 112 },
  { day: 'Sam', views: 680,  dl: 63  },
  { day: 'Dim', views: 540,  dl: 48  },
];

const TOP_PATTERNS: TopPattern[] = [
  { name: 'Ndop Royal Bamoum', views: 1820, downloads: 340, pct: 100, css: 'avs-pattern-ndop-sultan',   type: 'NDOP'    },
  { name: 'Bogolan du Mali',   views: 920,  downloads: 210, pct: 51,  css: 'avs-pattern-bogolan-fanga', type: 'BOGOLAN' },
  { name: 'Wax Sénégalais',    views: 340,  downloads: 82,  pct: 19,  css: 'avs-pattern-wax-dakar',     type: 'WAX'     },
];

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString('fr-FR');

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────────────────────────────────────

function MetricCard({
  label, value, delta, icon: Icon, accentClass,
}: {
  label:       string;
  value:       string;
  delta:       number;
  icon:        typeof Eye;
  accentClass: string; // e.g. 'bg-avs-primary'  — used for strip + icon bg
}) {
  const positive = delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="avs-card relative overflow-hidden p-5"
    >
      {/* Left accent strip */}
      <div className={`absolute inset-y-0 left-0 w-0.5 ${accentClass}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="avs-label">{label}</p>
          <p className="font-display mt-1.5 text-3xl font-black tracking-tight text-avs-accent">
            {value}
          </p>
          <p className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {positive ? '+' : ''}{delta}%{' '}
            <span className="font-normal text-avs-accent/40">vs période préc.</span>
          </p>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClass} bg-opacity-10`}>
          <Icon size={17} className={accentClass.replace('bg-', 'text-')} aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART
// ─────────────────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: DayData[] }) {
  const maxViews = Math.max(...data.map((d) => d.views));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative h-52">
      <div className="flex h-full items-end gap-2">
        {data.map((d, i) => {
          const heightPct = (d.views / maxViews) * 100;
          const isHovered = hovered === i;

          return (
            <div
              key={d.day}
              className="group relative flex flex-1 flex-col items-center gap-1.5"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-avs-accent/10 bg-avs-accent px-3 py-1.5 shadow-avs-md"
                >
                  <p className="font-mono text-[10px] font-bold text-avs-secondary">
                    {d.views.toLocaleString('fr-FR')} vues
                  </p>
                  <p className="font-mono text-[9px] text-avs-secondary/50">{d.dl} téléch.</p>
                  {/* Arrow */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-avs-accent" />
                </motion.div>
              )}

              {/* Bar */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: `${heightPct}%` }}
                className={`
                  w-full origin-bottom rounded-t-lg transition-colors duration-150
                  ${isHovered ? 'bg-avs-primary' : 'bg-avs-primary/60'}
                `}
              />

              <span className="font-mono text-[10px] text-avs-accent/40">{d.day}</span>
            </div>
          );
        })}
      </div>

      {/* Mid-line reference */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-avs-accent/10" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP
// ─────────────────────────────────────────────────────────────────────────────

function Heatmap({ data }: { data: number[] }) {
  const intensityClass = (v: number) => {
    if (v > 0.7) return 'bg-avs-primary';
    if (v > 0.4) return 'bg-avs-primary/50';
    if (v > 0.1) return 'bg-avs-primary/20';
    return 'bg-avs-accent/8';
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="pb-1 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-avs-accent/30">
            {d}
          </div>
        ))}
        {data.map((intensity, i) => (
          <div
            key={i}
            title={`${Math.floor(intensity * 100)} vues`}
            className={`aspect-square rounded-md transition-opacity hover:opacity-70 ${intensityClass(intensity)}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[9px] text-avs-accent/30">Moins</span>
        <div className="flex gap-1">
          {['bg-avs-accent/8', 'bg-avs-primary/20', 'bg-avs-primary/50', 'bg-avs-primary'].map((c, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
        </div>
        <span className="font-mono text-[9px] text-avs-accent/30">Plus</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP PATTERN ROW
// ─────────────────────────────────────────────────────────────────────────────

function TopPatternRow({
  pattern, rank, delay,
}: {
  pattern: TopPattern;
  rank:    number;
  delay:   number;
}) {
  const dlRate = ((pattern.downloads / Math.max(pattern.views, 1)) * 100).toFixed(1);

  return (
    <div className="group">
      <div className="mb-2 flex items-center gap-3">
        {/* Swatch */}
        <div
          className={`${pattern.css} h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-avs-accent/10 transition-transform duration-300 group-hover:scale-105`}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-avs-accent">{pattern.name}</p>
            <span className="shrink-0 font-mono text-xs font-black text-avs-primary">#{rank}</span>
          </div>
          <p className="font-mono text-[10px] text-avs-accent/40">
            {pattern.views.toLocaleString('fr-FR')} vues · {pattern.downloads} DL · taux {dlRate}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-avs-accent/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pattern.pct}%` }}
          transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-avs-primary"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const heatmapData = useMemo(() => Array.from({ length: 35 }, () => Math.random()), []);
  const m = METRICS[period];

  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-avs-accent/10 bg-avs-secondary px-4 py-8 sm:px-6 lg:px-8">
        <div className="avs-pattern-ndop-sultan pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden />

        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-px w-6 bg-avs-primary" aria-hidden />
              <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">
                Tableau de bord
              </span>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-avs-accent">
              Analytique
            </h1>
            <p className="mt-0.5 text-sm text-avs-accent/40">Performance de vos motifs</p>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-0.5 rounded-xl border border-avs-accent/15 bg-avs-secondary-dark p-1">
            {PERIODS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`
                  rounded-lg px-4 py-1.5 font-mono text-[10px] font-bold tracking-wider uppercase
                  transition-all duration-150
                  ${period === value
                    ? 'bg-avs-primary text-avs-secondary shadow-avs'
                    : 'text-avs-accent/50 hover:text-avs-accent'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        {/* ══ METRIC CARDS ════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Vues totales"      value={fmt(m.views)}     delta={m.viewsDelta}     icon={Eye}      accentClass="bg-avs-primary" />
          <MetricCard label="Téléchargements"   value={fmt(m.downloads)} delta={m.downloadsDelta} icon={Download} accentClass="bg-avs-ndop"    />
          <MetricCard label="Visiteurs uniques" value={fmt(m.visitors)}  delta={m.visitorsDelta}  icon={Users}    accentClass="bg-avs-indigo"  />
          <MetricCard label="Motifs ajoutés"    value={String(m.patterns)} delta={m.patternsDelta} icon={Layers}  accentClass="bg-avs-kente"   />
        </div>

        {/* ══ BAR CHART ═══════════════════════════════════════════════════ */}
        <div className="avs-card p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-avs-accent">
                Activité — 7 derniers jours
              </h2>
              <p className="mt-0.5 text-xs text-avs-accent/40">Vues quotidiennes · survolez les barres</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-avs-primary/60" />
              <span className="font-mono text-[10px] text-avs-accent/40">Vues</span>
            </div>
          </div>
          <BarChart data={BAR_DATA} />
        </div>

        {/* ══ TOP PATTERNS + HEATMAP ══════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Top patterns */}
          <div className="avs-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 size={15} className="text-avs-accent/40" aria-hidden />
              <h2 className="font-display text-base font-bold text-avs-accent">Top Motifs</h2>
            </div>
            <div className="space-y-5">
              {TOP_PATTERNS.map((p, i) => (
                <TopPatternRow key={p.name} pattern={p} rank={i + 1} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="avs-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Calendar size={15} className="text-avs-accent/40" aria-hidden />
              <h2 className="font-display text-base font-bold text-avs-accent">
                Activité hebdomadaire
              </h2>
            </div>
            <Heatmap data={heatmapData} />
          </div>
        </div>

        {/* ══ DETAILED TABLE ══════════════════════════════════════════════ */}
        <div className="avs-card overflow-hidden">

          {/* Table header */}
          <div className="border-b border-avs-accent/8 px-6 py-4">
            <h2 className="font-display text-base font-bold text-avs-accent">
              Performances détaillées
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-avs-accent/8 bg-avs-secondary-dark">
                  {['Motif', 'Type', 'Vues', 'Téléchargements', 'Taux DL', 'Tendance'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-mono text-[9px] font-black tracking-[0.14em] uppercase text-avs-accent/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-avs-accent/6">
                {TOP_PATTERNS.map(({ name, views, downloads, css, type }) => {
                  const rate    = ((downloads / Math.max(views, 1)) * 100).toFixed(1);
                  const goodRate = parseFloat(rate) > 15;

                  return (
                    <tr
                      key={name}
                      className="transition-colors duration-100 hover:bg-avs-primary/[0.03]"
                    >
                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`${css} h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-avs-accent/10`}
                            aria-hidden
                          />
                          <span className="font-medium text-avs-accent">{name}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <span className="rounded-lg border border-avs-accent/10 bg-avs-secondary-dark px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase text-avs-accent/50">
                          {type}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-5 py-3.5 font-mono text-sm font-semibold tabular-nums text-avs-accent">
                        {views.toLocaleString('fr-FR')}
                      </td>

                      {/* Downloads */}
                      <td className="px-5 py-3.5 font-mono text-sm tabular-nums text-avs-accent/70">
                        {downloads.toLocaleString('fr-FR')}
                      </td>

                      {/* Rate */}
                      <td className="px-5 py-3.5">
                        <span className={`font-mono text-xs font-bold ${goodRate ? 'text-emerald-600' : 'text-avs-accent/50'}`}>
                          {rate}%
                        </span>
                      </td>

                      {/* Trend */}
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600">
                          <TrendingUp size={12} /> +12%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}