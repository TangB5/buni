'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
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
  Bell,
  Zap,
} from 'lucide-react';
import { useAuth, useLogout } from '@buni/auth';
import {
  dashboardService,
  type DashboardStats,
  type UserPattern,
  type DashboardActivity,
} from 'apps/buni-avs/src/features/dashboard/services/dashboard.service';
import { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; css: string; dot: string }> = {
  published: {
    label: 'Publié',
    css: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  draft: {
    label: 'Brouillon',
    css: 'bg-avs-accent/6 text-avs-accent/50 border-avs-accent/10',
    dot: 'bg-avs-accent/30',
  },
  review: {
    label: 'En révision',
    css: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  rejected: {
    label: 'Rejeté',
    css: 'bg-red-500/10 text-red-500 border-red-500/20',
    dot: 'bg-red-500',
  },
};

const ACTIVITY_CONFIG: Record<string, { icon: typeof MessageSquare; color: string; bg: string }> = {
  comment: { icon: MessageSquare, color: 'text-avs-indigo', bg: 'bg-avs-indigo/10' },
  download: { icon: Download, color: 'text-avs-ndop', bg: 'bg-avs-ndop/10' },
  review: { icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
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
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay }
});

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

const itemFade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STATS: DashboardStats = {
  patternsCount: 12,
  downloadsTotal: 847,
  viewsTotal: 4200,
  favoritesCount: 89,
};

const MOCK_PATTERNS: UserPattern[] = [
  { id: '1', name: 'Ndop Royal Bamoum', type: 'NDOP', status: 'published', viewCount: 1820, downloadCount: 342 },
  { id: '2', name: 'Kente Ewé', type: 'KENTE', status: 'draft', viewCount: 0, downloadCount: 0 },
  { id: '3', name: 'Wax Sénégalais', type: 'WAX', status: 'review', viewCount: 340, downloadCount: 87 },
  { id: '4', name: 'Bogolan du Mali', type: 'BOGOLAN', status: 'published', viewCount: 920, downloadCount: 156 },
  { id: '5', name: 'Toghu Bamiléké', type: 'NDOP', status: 'draft', viewCount: 0, downloadCount: 0 },
];

const MOCK_ACTIVITY: DashboardActivity[] = [
  { id: '1', type: 'comment', action: 'Commentaire sur', target: 'Ndop Bamoum', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', type: 'download', action: 'Téléchargement de', target: 'Kente Asante', timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: '3', type: 'review', action: 'Validation approuvée —', target: 'Bogolan Malien', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'favorite', action: 'Favori ajouté sur', target: 'Wax Congolais', timestamp: new Date(Date.now() - 259200000).toISOString() },
  { id: '5', type: 'download', action: 'Téléchargement de', target: 'Ndop Sultan', timestamp: new Date(Date.now() - 345600000).toISOString() },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: 'linear-gradient(90deg, var(--skeleton-from) 25%, var(--skeleton-mid) 50%, var(--skeleton-from) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }}
    />
  );
}

// Animated counter hook
function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// Animated KPI value
function AnimatedValue({ value, format }: { value: number; format?: (n: number) => string }) {
  const count = useCounter(value);
  return <>{format ? format(count) : count.toLocaleString()}</>;
}

/** Premium KPI card with tilt effect */
function StatCard({
  label, value, sub, icon: Icon, accentColor, patternCss, delay,
}: {
  label: string; value: number; sub?: string; icon: typeof Layers;
  accentColor: string; patternCss: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-4, 4]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      {...fadeUp(delay)}
      onMouseMove={handleMouse}
      // @ts-ignore
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-shadow duration-500 cursor-default"
    >
      {/* Top accent line with pattern */}
      <div className={`${patternCss} absolute inset-x-0 top-0 h-0.5`} aria-hidden />

      {/* Subtle glow blob */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
        style={{ background: accentColor + '33' }}
        aria-hidden
      />

      <div className="p-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
              {label}
            </p>
            <p className="font-display mt-2 text-[2.25rem] leading-none font-black tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              <AnimatedValue value={value} />
            </p>
            {sub && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: accentColor }}>
                <TrendingUp size={10} aria-hidden /> {sub}
              </p>
            )}
          </div>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: accentColor + '15', color: accentColor }}
          >
            <Icon size={20} aria-hidden />
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-4 h-px w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '68%' }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeInOut' }}
            className="h-full rounded-full"
            style={{ background: accentColor }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Quick action tile */
function QuickAction({
  href, icon: Icon, label, variant = 'ghost', description,
}: {
  href: string; icon: typeof Plus; label: string;
  variant?: 'primary' | 'ghost'; description?: string;
}) {
  return (
    <Link
      href={href as Route}
      className={`group relative overflow-hidden rounded-2xl flex flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-1 ${
        variant === 'primary'
          ? 'bg-avs-primary text-white shadow-lg shadow-avs-primary/20 hover:shadow-xl hover:shadow-avs-primary/25'
          : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-avs-primary/40 hover:text-avs-primary dark:hover:text-avs-primary'
      }`}
    >
      {variant === 'primary' && (
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden>
          <div className="avs-pattern-kente-royale h-full w-full" />
        </div>
      )}
      <div className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
        variant === 'primary' ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-avs-primary/10'
      }`}>
        <Icon size={17} aria-hidden />
      </div>
      <div className="relative">
        <p className="text-sm font-bold leading-tight">{label}</p>
        {description && (
          <p className={`mt-0.5 text-[11px] leading-snug ${variant === 'primary' ? 'text-white/60' : 'text-zinc-400 dark:text-zinc-500'}`}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

/** Section header */
function SectionHeader({ title, patternCss, href, linkLabel }: { title: string; patternCss: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className={`${patternCss} h-full w-full`} aria-hidden />
        </div>
        <h2 className="font-display text-zinc-900 dark:text-zinc-100 font-bold text-[15px]">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href as Route}
          className="flex items-center gap-1 text-xs font-semibold text-avs-primary hover:underline underline-offset-4 transition-colors"
        >
          {linkLabel} <ChevronRight size={11} aria-hidden />
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isHydrated, isAdmin, isCurator } = useAuth();
  const logout = useLogout();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patterns, setPatterns] = useState<UserPattern[]>([]);
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [s, p, a] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentPatterns(5),
          dashboardService.getActivity(6),
        ]);
        setStats(s); setPatterns(p); setActivity(a);
      } catch {
        setStats(MOCK_STATS); setPatterns(MOCK_PATTERNS); setActivity(MOCK_ACTIVITY);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
        <div className="relative h-14 w-14">
          <div className="avs-pattern-kente-royale absolute inset-0 rounded-full opacity-80 animate-spin [animation-duration:2s]" />
          <div className="absolute inset-2 rounded-full bg-white dark:bg-zinc-950" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 animate-pulse">
          Chargement…
        </p>
      </div>
    );
  }

  const roleLabel = isAdmin ? 'Administrateur' : isCurator ? 'Curateur' : 'Contributeur';
  const roleCss = isAdmin
    ? 'bg-avs-primary/10 text-avs-primary border-avs-primary/25'
    : isCurator
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';

  const avatarPattern = isAdmin ? 'avs-pattern-ndop-sultan' : isCurator ? 'avs-pattern-kente-royale' : 'avs-pattern-wax-dakar';

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `il y a ${Math.round(diff / 60000)} min`;
    if (diff < 86400000) return `il y a ${Math.round(diff / 3600000)}h`;
    if (diff < 604800000) return `il y a ${Math.round(diff / 86400000)}j`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const statsCards = [
    { label: 'Mes motifs', value: stats?.patternsCount ?? 0, sub: '+2 ce mois', icon: Layers, accentColor: '#C0573E', patternCss: 'avs-pattern-kente-royale', delay: 0 },
    { label: 'Téléchargements', value: stats?.downloadsTotal ?? 0, sub: '+18%', icon: Download, accentColor: '#4A6741', patternCss: 'avs-pattern-ndop-sultan', delay: 0.08 },
    { label: 'Vues totales', value: stats?.viewsTotal ?? 0, sub: '+320 ce mois', icon: Eye, accentColor: '#2A4A6B', patternCss: 'avs-pattern-bogolan-fanga', delay: 0.16 },
    { label: 'Favoris', value: stats?.favoritesCount ?? 0, sub: '+12', icon: Heart, accentColor: '#B8860B', patternCss: 'avs-pattern-adinkra-sankofa', delay: 0.24 },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global shimmer keyframe */}
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        :root { --skeleton-from: rgb(244 244 245); --skeleton-mid: rgb(250 250 250); }
        .dark { --skeleton-from: rgb(39 39 42); --skeleton-mid: rgb(52 52 56); }
      `}</style>

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        

        <div className="mx-auto max-w-7xl space-y-7 px-6 py-8 lg:px-8">

          {/* ══════════════════════════════════════════════════════
              KPI CARDS
          ══════════════════════════════════════════════════════ */}
          <section aria-label="Statistiques">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <Skeleton className="mb-3 h-2.5 w-20" />
                    <Skeleton className="h-9 w-20 mb-3" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <motion.div initial="initial" animate="animate" variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((card) => (
                  <StatCard key={card.label} {...card} />
                ))}
              </motion.div>
            ) : null}
          </section>

          {/* ══════════════════════════════════════════════════════
              PROFILE STRIP
          ══════════════════════════════════════════════════════ */}
          <motion.section {...fadeUp(0.15)} aria-label="Profil">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 py-5">
                {/* Left accent */}
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className={`${avatarPattern} shrink-0 h-10 w-10 rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10`} aria-hidden />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 flex-1 min-w-0">
                    {[
                      { label: 'Nom', value: user?.name ?? '—' },
                      { label: 'Email', value: user?.email ?? '—' },
                      { label: 'Rôle', value: roleLabel, accent: true },
                      {
                        label: 'Membre depuis',
                        value: user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—',
                      },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className="min-w-0">
                        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600">{label}</p>
                        <p className={`mt-0.5 truncate text-sm font-semibold ${accent ? 'text-avs-primary' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={'/profile' as Route}
                  className="group shrink-0 flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:border-avs-primary/40 hover:text-avs-primary transition-all duration-200"
                >
                  <User size={13} />
                  Modifier le profil
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════
              PATTERNS + ACTIVITY (main content grid)
          ══════════════════════════════════════════════════════ */}
          <div className="grid gap-6 lg:grid-cols-5">

            {/* Patterns — 3 cols */}
            <motion.section
              {...fadeUp(0.2)}
              className="lg:col-span-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
              aria-label="Motifs récents"
            >
              <SectionHeader
                title="Mes motifs récents"
                patternCss="avs-pattern-kente-royale"
                href="/patternsDashboard"
                linkLabel="Tout voir"
              />

              {loading ? (
                <div className="space-y-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60">
                      <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : patterns.length > 0 ? (
                <motion.div initial="initial" animate="animate" variants={stagger} className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {patterns.map((pattern) => {
                    const { label, css, dot } = STATUS_CONFIG[pattern.status] ?? STATUS_CONFIG.draft!;
                    const patCss = CSS_PATTERN_MAP[pattern.type] ?? 'avs-pattern-wax-dakar';

                    return (
                      <motion.div
                        key={pattern.id}
                        variants={itemFade}
                        className="group flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer"
                      >
                        {/* Pattern preview */}
                        <div className={`${patCss} relative h-11 w-11 shrink-0 rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10`}>
                          <div className="absolute inset-0 bg-black/15 dark:bg-black/30" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-avs-primary transition-colors truncate">
                            {pattern.name}
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono tracking-wide">{pattern.type}</p>
                        </div>

                        {/* Status badge */}
                        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${css}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
                          {label}
                        </div>

                        {/* Views */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums w-16 justify-end">
                          <Eye size={11} />
                          {pattern.viewCount.toLocaleString()}
                        </div>

                        <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 group-hover:text-avs-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="avs-pattern-wax-dakar h-14 w-14 rounded-full ring-1 ring-black/10 dark:ring-white/10 opacity-50" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Aucun motif pour le moment</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Commencez par créer votre premier motif</p>
                  </div>
                  <Link
                    href={'/patternsDashboard/new' as Route}
                    className="flex items-center gap-2 rounded-xl bg-avs-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <Plus size={12} /> Créer un motif
                  </Link>
                </div>
              )}
            </motion.section>

            {/* Activity — 2 cols */}
            <motion.section
              {...fadeUp(0.27)}
              className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
              aria-label="Activité récente"
            >
              <SectionHeader title="Activité" patternCss="avs-pattern-adinkra-sankofa" />

              {loading ? (
                <div className="space-y-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60">
                      <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activity.length > 0 ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={stagger}
                  className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
                >
                  {activity.map((item) => {
                    const conf = ACTIVITY_CONFIG[item.type] ?? ACTIVITY_CONFIG.comment!;
                    const Icon = conf.icon;
                    return (
                      <motion.div
                        key={item.id}
                        variants={itemFade}
                        className="flex items-start gap-3.5 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${conf.bg}`}>
                          <Icon size={13} className={conf.color} aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-xs leading-snug text-zinc-600 dark:text-zinc-400">
                            {item.action}{' '}
                            <span className="font-semibold text-avs-primary">{item.target}</span>
                          </p>
                          <p className="mt-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                            {timeAgo(item.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">Aucune activité récente</p>
                </div>
              )}
            </motion.section>
          </div>

          {/* ══════════════════════════════════════════════════════
              QUICK ACTIONS
          ══════════════════════════════════════════════════════ */}
          <motion.section {...fadeUp(0.3)} aria-label="Actions rapides">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <SectionHeader title="Actions rapides" patternCss="avs-pattern-kuba-kasai" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
                <QuickAction href="/patternsDashboard/new" icon={Plus} label="Nouveau motif" description="Soumettre au catalogue" variant="primary" />
                <QuickAction href="/patterns" icon={Layers} label="Bibliothèque" description="Explorer les motifs" />
                <QuickAction href="/dashboard/profile" icon={User} label="Mon profil" description="Gérer le compte" />
                <QuickAction href="/colors" icon={Palette} label="Palettes" description="Couleurs & thèmes" />
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════
              CONTRIBUTION BANNER
          ══════════════════════════════════════════════════════ */}
          <motion.section {...fadeUp(0.35)}>
            <div className="avs-pattern-kente-royale rounded-2xl relative overflow-hidden">
              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(30,20,8,0.90) 60%, rgba(50,25,10,0.82) 100%)' }}
                aria-hidden
              />

              {/* Geometric decor rings */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full border border-avs-primary/10" />
                <div className="absolute -top-4 -right-4 h-36 w-36 rounded-full border border-avs-primary/15" />
                <div className="absolute top-8 right-12 h-16 w-16 rounded-full border border-white/5" />
              </div>

              {/* Zap icon accent */}
              <div className="pointer-events-none absolute top-5 right-5 opacity-5" aria-hidden>
                <Zap size={96} className="text-avs-primary" />
              </div>

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-7 py-8">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-avs-primary/20 border border-avs-primary/30 px-3 py-1 font-mono text-[9px] tracking-[0.18em] uppercase text-avs-primary font-bold">
                      <Sparkles size={9} /> Niveau contributeur
                    </span>
                  </div>
                  <h3 className="font-display text-white text-xl sm:text-2xl leading-snug font-black">
                    Vous avez contribué{' '}
                    <span className="text-avs-primary">{stats?.patternsCount ?? '—'} motifs</span>{' '}
                    au standard AVS
                  </h3>
                  <p className="mt-2.5 text-sm text-white/40 leading-relaxed">
                    Chaque motif ajouté est une page d&apos;histoire préservée pour les générations futures.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={'/patternsDashboard/new' as Route}
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-avs-primary px-6 py-3 text-sm font-bold text-white shadow-[0_4px_24px_rgba(192,87,62,0.35)] hover:shadow-[0_8px_32px_rgba(192,87,62,0.45)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Soumettre un motif
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href={'/analytics' as Route}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:border-white/30 hover:text-white/90 transition-all duration-200"
                  >
                    Analytique
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
}