'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, Download, Users, Layers, Calendar } from 'lucide-react';

// ── Types & Données ────────────────────────────────────────────────────────────
type Period = '7d' | '30d' | '90d' | '1y';

const PERIODS: { value: Period; label: string }[] = [
  { value:'7d', label:'7 jours' }, { value:'30d', label:'30 jours' },
  { value:'90d', label:'3 mois' }, { value:'1y',  label:'1 an' },
];

// Données simulées par période
const METRICS: Record<Period, {
  views: number; viewsDelta: number;
  downloads: number; downloadsDelta: number;
  visitors: number; visitorsDelta: number;
  patterns: number;
}> = {
  '7d':  { views:4240,   viewsDelta:12,  downloads:380,  downloadsDelta:8,  visitors:1820, visitorsDelta:5,  patterns:2 },
  '30d': { views:18400,  viewsDelta:24,  downloads:1640, downloadsDelta:18, visitors:7200, visitorsDelta:15, patterns:4 },
  '90d': { views:52000,  viewsDelta:38,  downloads:4800, downloadsDelta:31, visitors:19000,visitorsDelta:22, patterns:8 },
  '1y':  { views:195000, viewsDelta:67,  downloads:18200,downloadsDelta:54, visitors:72000,visitorsDelta:48, patterns:12 },
};

// Données graphique en barres (vues sur 7 jours)
const BAR_DATA = [
  { day:'Lun', views:480,  dl:42 },
  { day:'Mar', views:620,  dl:58 },
  { day:'Mer', views:390,  dl:31 },
  { day:'Jeu', views:850,  dl:94 },
  { day:'Ven', views:1120, dl:112 },
  { day:'Sam', views:680,  dl:63 },
  { day:'Dim', views:540,  dl:48 },
];

// Top motifs
const TOP_PATTERNS = [
  { name:'Ndop Royal Bamoum',  views:1820, downloads:340, pct:100, css:'avs-pattern-ndop-royal' },
  { name:'Bogolan du Mali',    views:920,  downloads:210, pct:51,  css:'avs-pattern-wax-bold' },
  { name:'Wax Sénégalais',     views:340,  downloads:82,  pct:19,  css:'avs-pattern-wax' },
];

// ── Composant : Carte métrique ─────────────────────────────────────────────────
function MetricCard({ label, value, delta, icon: Icon, iconColor, iconBg }: {
  label: string; value: string; delta: number;
  icon: typeof Eye; iconColor: string; iconBg: string;
}) {
  const positive = delta >= 0;
  return (
    <motion.div
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      className="avs-card p-5 flex items-start justify-between"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-avs-accent/40">{label}</p>
        <p className="mt-1.5 font-display text-3xl font-bold text-avs-accent">{value}</p>
        <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
          {positive ? '+' : ''}{delta}% vs période précédente
        </p>
      </div>
      <div className={`rounded-avs p-2.5 ${iconBg}`}>
        <Icon size={18} className={iconColor} aria-hidden />
      </div>
    </motion.div>
  );
}

// ── Composant : Graphe en barres SVG ──────────────────────────────────────────
function BarChart({ data }: { data: typeof BAR_DATA }) {
  const maxViews = Math.max(...data.map(d => d.views));
  return (
    <div className="relative h-48">
      <div className="flex h-full items-end gap-2">
        {data.map((d, i) => {
          const heightPct = (d.views / maxViews) * 100;
          return (
            <div key={d.day} className="group relative flex flex-1 flex-col items-center gap-1">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex
                flex-col items-center rounded-avs bg-avs-accent px-2.5 py-1.5 shadow-avs z-10">
                <span className="text-[10px] font-bold text-avs-secondary">{d.views.toLocaleString()} vues</span>
                <span className="text-[9px] text-avs-secondary/60">{d.dl} DL</span>
              </div>
              {/* Barre vues */}
              <motion.div
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                style={{ height: `${heightPct}%` }}
                className="w-full origin-bottom rounded-t-avs bg-avs-primary/80 transition-colors group-hover:bg-avs-primary"
              />
              <span className="text-[10px] text-avs-accent/50 font-medium">{d.day}</span>
            </div>
          );
        })}
      </div>
      {/* Ligne de référence */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 border-t border-dashed border-avs-accent/10" />
    </div>
  );
}

const generateHeatmapData = () => Array.from({ length: 35 }, () => Math.random());

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [heatmapData] = useState(() => generateHeatmapData());
  const m = METRICS[period]!;

  const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

  return (
    <div className="min-h-screen bg-avs-secondary/50">
      {/* Header */}
      <div className="border-b border-avs-accent/10 bg-avs-secondary px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-avs-accent">Analytique</h1>
            <p className="text-sm text-avs-accent/50">Performance de vos motifs</p>
          </div>
          {/* Sélecteur de période */}
          <div className="flex items-center gap-1 rounded-avs border border-avs-accent/15 p-0.5">
            {PERIODS.map(({ value, label }) => (
              <button key={value} onClick={() => setPeriod(value)}
                className={`rounded-avs px-3 py-1.5 text-xs font-semibold transition-all
                  ${period === value ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'text-avs-accent/60 hover:text-avs-accent'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Métriques ──────────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Vues totales"   value={fmt(m.views)}     delta={m.viewsDelta}     icon={Eye}      iconColor="text-avs-primary"  iconBg="bg-avs-primary/10"  />
          <MetricCard label="Téléchargements" value={fmt(m.downloads)} delta={m.downloadsDelta} icon={Download} iconColor="text-avs-ndop"     iconBg="bg-avs-ndop/10"     />
          <MetricCard label="Visiteurs uniques" value={fmt(m.visitors)} delta={m.visitorsDelta}  icon={Users}    iconColor="text-avs-indigo"   iconBg="bg-avs-indigo/10"   />
          <MetricCard label="Motifs ajoutés" value={String(m.patterns)} delta={20}              icon={Layers}   iconColor="text-avs-kente"    iconBg="bg-avs-kente/10"    />
        </div>

        {/* ── Graphe activité ─────────────────────────────────────────────────── */}
        <div className="avs-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-avs-accent">Activité — 7 derniers jours</h2>
              <p className="text-xs text-avs-accent/45 mt-0.5">Vues quotidiennes (survolez les barres)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-avs-accent/50">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-avs-primary/80" />
                Vues
              </span>
            </div>
          </div>
          <BarChart data={BAR_DATA} />
        </div>

        {/* ── Top motifs + Calendrier ─────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Top motifs */}
          <div className="avs-card p-6">
            <h2 className="font-display font-bold text-avs-accent mb-5">Top Motifs</h2>
            <div className="space-y-5">
              {TOP_PATTERNS.map(({ name, views, downloads, pct, css }, i) => (
                <div key={name}>
                  <div className="mb-2 flex items-center gap-3">
                    <div className={`${css} h-8 w-8 shrink-0 rounded-avs`} aria-hidden />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-avs-accent">{name}</p>
                        <span className="shrink-0 text-xs font-bold text-avs-primary">#{i + 1}</span>
                      </div>
                      <p className="text-xs text-avs-accent/45">{views.toLocaleString()} vues · {downloads} DL</p>
                    </div>
                  </div>
                  {/* Barre de progression */}
                  <div className="h-1.5 w-full rounded-full bg-avs-accent/8">
                    <motion.div
                      initial={{ width:0 }} animate={{ width:`${pct}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease:[0.22,1,0.36,1] }}
                      className="h-full rounded-full bg-avs-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente par jour */}
          <div className="avs-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Calendar size={16} className="text-avs-accent/50" aria-hidden />
              <h2 className="font-display font-bold text-avs-accent">Activité hebdomadaire</h2>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {/* En-têtes jours */}
              {['L','M','M','J','V','S','D'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-bold uppercase text-avs-accent/30 pb-1">{d}</div>
              ))}
              {/* Cellules de chaleur (heatmap simplifié) */}
              {heatmapData.map((intensity, i) => {
                const cls = intensity > 0.7 ? 'bg-avs-primary' :
                            intensity > 0.4 ? 'bg-avs-primary/50' :
                            intensity > 0.1 ? 'bg-avs-primary/20' : 'bg-avs-accent/8';
                return (
                  <div key={i} className={`aspect-square rounded-sm ${cls} transition-opacity hover:opacity-80`}
                    title={`${Math.floor(intensity * 100)} vues`} />
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-avs-accent/35">
              <span>Moins</span>
              <div className="flex gap-1">
                {['bg-avs-accent/8','bg-avs-primary/20','bg-avs-primary/50','bg-avs-primary'].map((c, i) => (
                  <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
                ))}
              </div>
              <span>Plus</span>
            </div>
          </div>
        </div>

        {/* ── Tableau détaillé ─────────────────────────────────────────────── */}
        <div className="avs-card overflow-hidden p-0">
          <div className="border-b border-avs-accent/8 px-6 py-4">
            <h2 className="font-display font-bold text-avs-accent">Performances détaillées</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-avs-accent/8 bg-avs-accent/3">
                {['Motif','Type','Vues','Téléchargements','Taux DL','Tendance'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-avs-accent/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-avs-accent/6">
              {TOP_PATTERNS.map(({ name, views, downloads, css }) => {
                const rate = ((downloads / Math.max(views, 1)) * 100).toFixed(1);
                return (
                  <tr key={name} className="transition-colors hover:bg-avs-primary/3">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`${css} h-8 w-8 shrink-0 rounded-avs`} aria-hidden />
                        <span className="font-medium text-avs-accent">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-avs-accent/60">NDOP</td>
                    <td className="px-5 py-3 font-semibold tabular-nums">{views.toLocaleString()}</td>
                    <td className="px-5 py-3 tabular-nums">{downloads}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold ${parseFloat(rate) > 15 ? 'text-green-600' : 'text-avs-accent/60'}`}>
                        {rate}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <TrendingUp size={12}/> +12%
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
  );
}