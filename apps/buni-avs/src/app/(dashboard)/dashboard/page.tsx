'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Download,
  Eye,
  Heart,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Settings,
  LogOut,
  TrendingUp,
  MessageSquare,
  Check,
  Palette,
  User,
  BarChart3,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth, useLogout } from '@buni/auth/hooks';
import {
  dashboardService,
  type DashboardStats,
  type UserPattern,
  type DashboardActivity,
} from '@/features/dashboard/services/dashboard.service';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    css: string;
    dot: string;
  }
> = {
  published: {
    label: 'Publié',
    css: 'bg-green-500/10 text-green-600 border-green-500/20',
    dot: 'bg-green-500',
  },
  draft: {
    label: 'Brouillon',
    css: 'bg-avs-accent/6 text-avs-accent/50 border-avs-accent/10',
    dot: 'bg-avs-accent/30',
  },
  review: {
    label: 'En révision',
    css: 'bg-avs-kente/10 text-avs-kente border-avs-kente/20',
    dot: 'bg-avs-kente',
  },
  rejected: {
    label: 'Rejeté',
    css: 'bg-red-500/10 text-red-500 border-red-500/20',
    dot: 'bg-red-500',
  },
};

const ACTIVITY_CONFIG: Record<
  string,
  {
    icon: typeof MessageSquare;
    color: string;
    bg: string;
  }
> = {
  comment: { icon: MessageSquare, color: 'text-avs-indigo', bg: 'bg-avs-indigo/10' },
  download: { icon: Download, color: 'text-avs-ndop', bg: 'bg-avs-ndop/10' },
  review: { icon: Check, color: 'text-green-600', bg: 'bg-green-500/10' },
  favorite: { icon: Heart, color: 'text-avs-primary', bg: 'bg-avs-primary/10' },
};

const CSS_PATTERN_MAP: Record<string, string> = {
  NDOP: 'avs-pattern-ndop-sultan',
  KENTE: 'avs-pattern-kente-royale',
  BOGOLAN: 'avs-pattern-bogolan-fanga',
  WAX: 'avs-pattern-wax-dakar',
  ADINKRA: 'avs-pattern-adinkra-sankofa',
  KUBA: 'avs-pattern-kuba-kasai',
};

// ─────────────────────────────────────────────────────────────────────────────
// ── ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

const itemFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Skeleton shimmer */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-avs bg-avs-accent/6 animate-pulse ${className}`} />;
}

/** KPI card */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  patternCss,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof Layers;
  patternCss: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group rounded-avs-xl border-avs-accent/8 bg-avs-secondary shadow-avs hover:shadow-avs-md relative overflow-hidden border transition-shadow"
    >
      {/* Pattern bande haute */}
      <div className={`${patternCss} absolute inset-x-0 top-0 h-1`} aria-hidden />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-avs-accent/40 font-mono text-[10px] tracking-[.18em] uppercase">
              {label}
            </p>
            <p className="font-display text-avs-accent mt-2 text-3xl leading-none font-black">
              {value}
            </p>
            {sub && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                <TrendingUp size={11} aria-hidden /> {sub}
              </p>
            )}
          </div>
          <div
            className="rounded-avs flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ background: `${color}14`, color }}
          >
            <Icon size={18} aria-hidden />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Quick action button */
function QuickAction({
  href,
  icon: Icon,
  label,
  variant = 'ghost',
}: {
  href: string;
  icon: typeof Plus;
  label: string;
  variant?: 'primary' | 'ghost';
}) {
  return (
    <Link
      href={href}
      className={`group rounded-avs-xl flex flex-col items-center gap-2.5 p-5 transition-all hover:-translate-y-0.5 ${
        variant === 'primary'
          ? 'bg-avs-primary shadow-avs hover:shadow-avs-md text-avs-secondary'
          : 'border-avs-accent/10 text-avs-accent hover:border-avs-primary/30 hover:text-avs-primary border'
      }`}
    >
      <Icon size={20} aria-hidden className={variant === 'primary' ? '' : 'transition-colors'} />
      <span className="text-center text-xs leading-tight font-semibold">{label}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK FALLBACK (quand dashboardService n'est pas connecté)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STATS: DashboardStats = {
  patternsCount: 12,
  downloadsTotal: 847,
  viewsTotal: 4200,
  favoritesCount: 89,
};

const MOCK_PATTERNS: UserPattern[] = [
  {
    id: '1',
    name: 'Ndop Royal Bamoum',
    type: 'NDOP',
    status: 'published',
    viewCount: 1820,
    downloadCount: 342,
  },
  { id: '2', name: 'Kente Ewé', type: 'KENTE', status: 'draft', viewCount: 0, downloadCount: 0 },
  {
    id: '3',
    name: 'Wax Sénégalais',
    type: 'WAX',
    status: 'review',
    viewCount: 340,
    downloadCount: 87,
  },
  {
    id: '4',
    name: 'Bogolan du Mali',
    type: 'BOGOLAN',
    status: 'published',
    viewCount: 920,
    downloadCount: 156,
  },
  {
    id: '5',
    name: 'Toghu Bamiléké',
    type: 'NDOP',
    status: 'draft',
    viewCount: 0,
    downloadCount: 0,
  },
];

const MOCK_ACTIVITY: DashboardActivity[] = [
  {
    id: '1',
    type: 'comment',
    action: 'Commentaire sur',
    target: 'Ndop Bamoum',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '2',
    type: 'download',
    action: 'Téléchargement de',
    target: 'Kente Asante',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: '3',
    type: 'review',
    action: 'Validation approuvée —',
    target: 'Bogolan Malien',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    type: 'favorite',
    action: 'Favori ajouté sur',
    target: 'Wax Congolais',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    type: 'download',
    action: 'Téléchargement de',
    target: 'Ndop Sultan',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isHydrated, isAdmin, isCurator } = useAuth();
  const logout = useLogout();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [s, p, a] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentPatterns(5),
          dashboardService.getActivity(6),
        ]);
        setStats(s);
        setPatterns(p);
        setActivity(a);
      } catch {
        // Fallback mock en dev
        setStats(MOCK_STATS);
        setPatterns(MOCK_PATTERNS);
        setActivity(MOCK_ACTIVITY);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [isHydrated, isAuthenticated]);

  // Hydration guard
  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="avs-pattern-kente-royale h-12 w-12 animate-spin rounded-full opacity-70" />
        <p className="text-avs-accent/40 font-mono text-xs tracking-[.18em] uppercase">
          Chargement…
        </p>
      </div>
    );
  }

  const roleLabel = isAdmin ? 'Administrateur' : isCurator ? 'Curateur' : 'Contributeur';
  const roleCss = isAdmin
    ? 'bg-avs-primary/10 text-avs-primary border-avs-primary/20'
    : isCurator
      ? 'bg-avs-kente/10 text-avs-kente border-avs-kente/20'
      : 'bg-avs-ndop/10 text-avs-ndop border-avs-ndop/20';

  const avatarCss = isAdmin
    ? 'avs-pattern-ndop-sultan'
    : isCurator
      ? 'avs-pattern-kente-royale'
      : 'avs-pattern-wax-dakar';

  // ── Formatage durée relative ──────────────────────────────────────────────
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `il y a ${Math.round(diff / 60000)} min`;
    if (diff < 86400000) return `il y a ${Math.round(diff / 3600000)}h`;
    if (diff < 604800000) return `il y a ${Math.round(diff / 86400000)}j`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-avs-secondary/40 min-h-screen">
      {/* ══════════════════════════════════════════════════════
          HEADER — Salutation éditoriale
      ══════════════════════════════════════════════════════ */}
      <header className="border-avs-accent/8 bg-avs-secondary relative overflow-hidden border-b">
        {/* Pattern en filigrane */}
        <div
          className="avs-pattern-ndop-sultan pointer-events-none absolute inset-0 opacity-[.04]"
          aria-hidden
        />
        {/* Halo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 100% 50%,rgba(192,87,62,.05) 0%,transparent 70%)',
          }}
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-7 lg:px-8">
          {/* Identité utilisateur */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-5">
            {/* Avatar motif */}
            <div
              className={`${avatarCss} border-avs-secondary shadow-avs relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2`}
            >
              <div className="bg-avs-accent/40 absolute inset-0 flex items-center justify-center">
                <span className="font-display text-avs-secondary text-xl font-black drop-shadow">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-avs-accent text-2xl leading-none font-black">
                  Bonjour, <span className="text-avs-primary">{user?.name ?? 'Artisan'}</span>
                </h1>
                <span
                  className={`rounded-avs border px-2.5 py-0.5 font-mono text-[9px] tracking-[.18em] uppercase ${roleCss}`}
                >
                  {roleLabel}
                </span>
              </div>
              <p className="text-avs-accent/40 mt-1.5 flex items-center gap-1.5 text-xs">
                <Sparkles size={11} className="text-avs-primary" aria-hidden />
                Tableau de bord ·{' '}
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          </motion.div>

          {/* Actions header */}
          <motion.div {...fadeUp(0.1)} className="flex items-center gap-2">
            <Link
              href="/analytics"
              className="rounded-avs-xl border-avs-accent/10 text-avs-accent/60 hover:border-avs-primary/25 hover:text-avs-primary flex items-center gap-2 border px-3.5 py-2.5 text-xs font-semibold transition-all"
            >
              <BarChart3 size={14} aria-hidden /> Analytique
            </Link>
            <Link
              href="/settings"
              className="rounded-avs-xl border-avs-accent/10 text-avs-accent/50 hover:border-avs-accent/25 hover:text-avs-accent border p-2.5 transition-all"
              aria-label="Paramètres"
            >
              <Settings size={15} aria-hidden />
            </Link>
            <button
              onClick={() => void logout()}
              className="rounded-avs-xl border-avs-accent/10 text-avs-accent/50 border p-2.5 transition-all hover:border-red-300/40 hover:text-red-500"
              aria-label="Se déconnecter"
            >
              <LogOut size={15} aria-hidden />
            </button>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
        {/* ══════════════════════════════════════════════════════
            KPI CARDS
        ══════════════════════════════════════════════════════ */}
        <section aria-label="Statistiques">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-avs-xl border-avs-accent/8 bg-avs-secondary border p-5"
                >
                  <Skeleton className="mb-3 h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <StatCard
                label="Mes motifs"
                value={stats.patternsCount}
                sub="+2 ce mois"
                icon={Layers}
                patternCss="avs-pattern-kente-royale"
                color="#C0573E"
                delay={0}
              />
              <StatCard
                label="Téléchargements"
                value={(stats?.downloadsTotal ?? 0).toLocaleString()}
                sub="+18%"
                icon={Download}
                patternCss="avs-pattern-ndop-sultan"
                color="#4A6741"
                delay={0.07}
              />
              <StatCard
                label="Vues totales"
                value={
                  stats.viewsTotal >= 1000
                    ? `${(stats.viewsTotal / 1000).toFixed(1)}k`
                    : stats.viewsTotal
                }
                sub="+320 ce mois"
                icon={Eye}
                patternCss="avs-pattern-bogolan-fanga"
                color="#2A4A6B"
                delay={0.14}
              />
              <StatCard
                label="Favoris"
                value={stats.favoritesCount}
                sub="+12"
                icon={Heart}
                patternCss="avs-pattern-adinkra-sankofa"
                color="#D4A017"
                delay={0.21}
              />
            </motion.div>
          ) : null}
        </section>

        {/* ══════════════════════════════════════════════════════
            PROFIL RAPIDE
        ══════════════════════════════════════════════════════ */}
        <motion.section {...fadeUp(0.15)} aria-label="Profil">
          <div className="rounded-avs-xl border-avs-accent/8 bg-avs-secondary relative overflow-hidden border">
            {/* Pattern bande latérale */}
            <div className={`${avatarCss} absolute inset-y-0 left-0 w-1`} aria-hidden />

            <div className="flex items-center justify-between gap-6 px-7 py-5">
              <div className="grid flex-1 gap-x-8 gap-y-2 sm:grid-cols-4">
                {[
                  { label: 'Nom', value: user?.name ?? '—' },
                  { label: 'Email', value: user?.email ?? '—' },
                  { label: 'Rôle', value: roleLabel, accent: true },
                  {
                    label: 'Membre depuis',
                    value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—',
                  },
                ].map(({ label, value, accent }) => (
                  <div key={label}>
                    <p className="text-avs-accent/35 font-mono text-[9px] tracking-[.18em] uppercase">
                      {label}
                    </p>
                    <p
                      className={`mt-0.5 truncate text-sm font-semibold ${accent ? 'text-avs-primary' : 'text-avs-accent'}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/profile"
                className="group rounded-avs border-avs-accent/10 text-avs-accent/50 hover:border-avs-primary/30 hover:text-avs-primary flex shrink-0 items-center gap-1.5 border px-3.5 py-2 text-xs font-semibold transition-all"
              >
                <User size={13} aria-hidden />
                Modifier
                <ArrowUpRight
                  size={11}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            MOTIFS + ACTIVITÉ
        ══════════════════════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mes motifs récents */}
          <motion.section
            {...fadeUp(0.2)}
            className="rounded-avs-xl border-avs-accent/8 bg-avs-secondary overflow-hidden border lg:col-span-2"
            aria-label="Motifs récents"
          >
            {/* En-tête */}
            <div className="border-avs-accent/7 flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-5 overflow-hidden rounded-sm">
                  <div className="avs-pattern-kente-royale h-full w-full" aria-hidden />
                </div>
                <h2 className="font-display text-avs-accent font-bold">Mes motifs récents</h2>
              </div>
              <Link
                href="/dashboard/patternsDashboard"
                className="text-avs-primary flex items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline"
              >
                Tout voir <ChevronRight size={12} aria-hidden />
              </Link>
            </div>

            {/* Liste */}
            {loading ? (
              <div className="space-y-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-avs-accent/5 flex items-center gap-4 border-b px-5 py-4"
                  >
                    <Skeleton className="rounded-avs h-10 w-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : patterns.length > 0 ? (
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="divide-avs-accent/5 divide-y"
              >
                {patterns.map((pattern) => {
                  const { label, css, dot } = STATUS_CONFIG[pattern.status] ?? STATUS_CONFIG.draft!;
                  const patCss = CSS_PATTERN_MAP[pattern.type] ?? 'avs-pattern-wax';

                  return (
                    <motion.div
                      key={pattern.id}
                      variants={itemFade}
                      className="group hover:bg-avs-primary/3 flex items-center gap-4 px-5 py-4 transition-colors"
                    >
                      {/* Aperçu pattern */}
                      <div
                        className={`${patCss} rounded-avs border-avs-accent/10 relative h-10 w-10 shrink-0 overflow-hidden border`}
                      >
                        <div className="bg-avs-accent/20 absolute inset-0" />
                      </div>

                      {/* Infos */}
                      <div className="min-w-0 flex-1">
                        <p className="text-avs-accent group-hover:text-avs-primary truncate text-sm font-semibold transition-colors">
                          {pattern.name}
                        </p>
                        <p className="text-avs-accent/40 mt-0.5 text-xs">{pattern.type}</p>
                      </div>

                      {/* Statut */}
                      <div
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${css}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
                        <span className="text-[10px] font-bold">{label}</span>
                      </div>

                      {/* Vues */}
                      <div className="text-avs-accent/40 hidden w-16 items-center justify-end gap-1 text-xs tabular-nums sm:flex">
                        <Eye size={11} aria-hidden />
                        {pattern.viewCount.toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                <div
                  className="avs-pattern-wax-dakar h-12 w-12 rounded-full opacity-40"
                  aria-hidden
                />
                <p className="text-avs-accent/40 text-sm">Aucun motif pour le moment</p>
                <Link
                  href="/patternsDashboard/new"
                  className="text-avs-primary flex items-center gap-1.5 text-xs font-bold underline-offset-4 hover:underline"
                >
                  <Plus size={12} /> Créer votre premier motif
                </Link>
              </div>
            )}
          </motion.section>

          {/* Activité récente */}
          <motion.section
            {...fadeUp(0.27)}
            className="rounded-avs-xl border-avs-accent/8 bg-avs-secondary overflow-hidden border"
            aria-label="Activité récente"
          >
            <div className="border-avs-accent/7 flex items-center gap-2.5 border-b px-5 py-4">
              <div className="h-5 w-5 overflow-hidden rounded-sm">
                <div className="avs-pattern-adinkra-sankofa h-full w-full" aria-hidden />
              </div>
              <h2 className="font-display text-avs-accent font-bold">Activité</h2>
            </div>

            {loading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-avs-accent/5 flex items-start gap-3 border-b px-5 py-4"
                  >
                    <Skeleton className="rounded-avs h-7 w-7 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length > 0 ? (
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="divide-avs-accent/5 scrollbar-thin max-h-[340px] divide-y overflow-y-auto"
              >
                {activity.map((item) => {
                  const conf = ACTIVITY_CONFIG[item.type] ?? ACTIVITY_CONFIG.comment!;
                  const Icon = conf.icon;
                  return (
                    <motion.div
                      key={item.id}
                      variants={itemFade}
                      className="hover:bg-avs-primary/3 flex items-start gap-3 px-5 py-4 transition-colors"
                    >
                      <div
                        className={`rounded-avs flex h-7 w-7 shrink-0 items-center justify-center ${conf.bg}`}
                      >
                        <Icon size={13} className={conf.color} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-avs-accent/65 text-xs leading-snug">
                          {item.action}{' '}
                          <span className="text-avs-primary font-semibold">{item.target}</span>
                        </p>
                        <p className="text-avs-accent/30 mt-1 text-[10px]">
                          {timeAgo(item.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="text-avs-accent/35 text-sm">Aucune activité récente</p>
              </div>
            )}
          </motion.section>
        </div>

        {/* ══════════════════════════════════════════════════════
            ACTIONS RAPIDES
        ══════════════════════════════════════════════════════ */}
        <motion.section {...fadeUp(0.3)} aria-label="Actions rapides">
          <div className="rounded-avs-xl border-avs-accent/8 bg-avs-secondary overflow-hidden border">
            <div className="border-avs-accent/7 flex items-center gap-2.5 border-b px-5 py-4">
              <div className="h-5 w-5 overflow-hidden rounded-sm">
                <div className="avs-pattern-kuba-kasai h-full w-full" aria-hidden />
              </div>
              <h2 className="font-display text-avs-accent font-bold">Actions rapides</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
              <QuickAction
                href="/patternsDashboard/new"
                icon={Plus}
                label="Nouveau motif"
                variant="primary"
              />
              <QuickAction href="/patterns" icon={Layers} label="Bibliothèque" />
              <QuickAction href="/dashboard/profile" icon={User} label="Mon profil" />
              <QuickAction href="/colors" icon={Palette} label="Palettes" />
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            SCORE / MISE EN AVANT CONTRIBUTION
        ══════════════════════════════════════════════════════ */}
        <motion.section {...fadeUp(0.35)}>
          <div className="avs-pattern-kente-royale rounded-avs-xl relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg,rgba(10,8,6,.95) 0%,rgba(26,18,8,.85) 100%)',
              }}
              aria-hidden
            />
            {/* Cercles déco */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="border-avs-primary/10 absolute -top-8 -right-8 h-48 w-48 rounded-full border" />
              <div className="border-avs-primary/15 absolute -top-2 -right-2 h-28 w-28 rounded-full border" />
            </div>

            <div className="relative flex flex-col gap-6 px-7 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <p className="text-avs-primary/60 font-mono text-[10px] tracking-[.2em] uppercase">
                  Niveau contributeur
                </p>
                <h3 className="font-display text-avs-secondary mt-1.5 text-xl leading-tight font-black">
                  Vous avez contribué{' '}
                  <span className="text-avs-primary">{stats?.patternsCount ?? '—'} motifs</span> au
                  standard AVS
                </h3>
                <p className="text-avs-secondary/45 mt-2 text-sm">
                  Continuez à enrichir le patrimoine. Chaque motif ajouté est une page
                  d&apos;histoire préservée.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/patternsDashboard/new"
                  className="group rounded-avs bg-avs-primary text-avs-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold shadow-[3px_3px_0_rgba(192,87,62,.35)] transition-all hover:-translate-y-px hover:shadow-[5px_5px_0_rgba(192,87,62,.35)]"
                >
                  Soumettre un motif
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="rounded-avs border-avs-secondary/15 text-avs-secondary/55 hover:border-avs-secondary/30 hover:text-avs-secondary inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-all"
                >
                  Voir l&apos;analytique
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
