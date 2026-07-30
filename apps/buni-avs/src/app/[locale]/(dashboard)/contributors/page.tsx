'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Award, Layers, Shield,
  TrendingUp, MapPin, ExternalLink,
  Trophy, Medal, Check, X, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@buni/auth';
import { useTranslations } from 'next-intl';
import { userService } from '@/features/user/services/user.service';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type ContributorRole = 'admin' | 'curator' | 'contributor' | 'artisan' | 'viewer';
type SortKey         = 'patterns' | 'views' | 'score' | 'joined';

interface Contributor {
  id: string; name: string; role: ContributorRole;
  origin: string; country: string; specialty: string;
  patterns: number; views: number; score: number;
  verified: boolean; featured: boolean;
  github?: string; avatarCSS: string;
  joinedYear: number; badges: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG — accentHex kept only for dynamic bg/border tints per role
// ─────────────────────────────────────────────────────────────────────────────

function getRoleConfig(t: any): Record<ContributorRole, { label: string; accentHex: string; icon: typeof Shield }> {
  return {
    admin:       { label: t('roles.admin'),       accentHex: '#C0573E', icon: Shield  },
    curator:     { label: t('roles.curator'),     accentHex: '#D4A017', icon: Star    },
    contributor: { label: t('roles.contributor'), accentHex: '#4A6741', icon: Layers  },
    artisan:     { label: t('roles.artisan'),     accentHex: '#2A4A6B', icon: Award   },
    viewer:      { label: t('roles.viewer'),      accentHex: '#888780', icon: Shield  },
  };
}

function getSortOptions(t: any): { value: SortKey; label: string }[] {
  return [
    { value: 'score',    label: t('sort.score')    },
    { value: 'patterns', label: t('sort.patterns') },
    { value: 'views',    label: t('sort.views')    },
    { value: 'joined',   label: t('sort.joined')   },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES — only what Tailwind can't express
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.35) !important; opacity:1; }
  .dark ::placeholder { color: rgba(236,232,225,0.30) !important; }

  .ctr-input {
    background: var(--avs-secondary);
    color: var(--avs-accent);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    outline: none;
    font-size: 0.8125rem;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
  }
  .ctr-input:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }

  .ctr-select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--avs-secondary);
    color: var(--avs-accent);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    padding: 0.5rem 2rem 0.5rem 0.875rem;
    font-size: 0.8125rem;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(29,29,27,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
  }
  .ctr-select:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }
  .ctr-select option { background: var(--avs-secondary); color: var(--avs-accent); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SCORE BAR
// ─────────────────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const barClass = score >= 90 ? 'bg-avs-kente' : score >= 70 ? 'bg-avs-primary' : 'bg-avs-accent/35';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-avs-accent/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${barClass}`}
        />
      </div>
      <span className="font-mono text-xs font-bold tabular-nums text-avs-accent/35">{score}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon, t }: { value: string; label: string; icon: typeof Shield; t: any }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-avs-primary/20">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-avs-primary" aria-hidden />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-avs-primary/8 text-avs-primary">
          <Icon size={16} aria-hidden />
        </div>
        <div>
          <p className="font-display text-xl font-black leading-none text-avs-accent" style={{ letterSpacing: '-0.02em' }}>{value}</p>
          <p className="mt-0.5 text-xs text-avs-accent/35">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PODIUM CARD
// ─────────────────────────────────────────────────────────────────────────────

function PodiumCard({ c, rank, t }: { c: Contributor; rank: number; t: any }) {
  const { accentHex } = getRoleConfig(t)[c.role];
  const isFirst   = rank === 1;
  const RankIcon  = rank === 1 ? Trophy : rank === 2 ? Medal : Award;
  const rankClass = rank === 1 ? 'text-avs-kente' : rank === 2 ? 'text-avs-accent/35' : 'text-avs-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 border ${
        isFirst ? 'bg-avs-kente/10 border-avs-kente/20' : 'bg-avs-secondary border-avs-accent/9'
      }`}
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${isFirst ? 'rgba(212,160,23,0.15)' : 'rgba(192,87,62,0.10)'}`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />

      <div className="mb-4 flex justify-center">
        <RankIcon size={28} className={rankClass} aria-hidden />
      </div>

      {/* Avatar */}
      <div className="relative mx-auto mb-3 h-16 w-16">
        <div
          className={`${c.avatarCSS} relative h-16 w-16 overflow-hidden rounded-2xl`}
          style={{ border: isFirst ? '2.5px solid var(--avs-kente)' : '2px solid rgba(29,29,27,0.16)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/22">
            <span className="font-display text-xl font-black text-avs-secondary drop-shadow-md">{c.name.charAt(0)}</span>
          </div>
        </div>
        {c.verified && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-avs-primary ring-2 ring-avs-secondary">
            <Check size={9} strokeWidth={3} className="text-avs-secondary" />
          </div>
        )}
      </div>

      <p className="font-display text-sm font-bold text-avs-accent" style={{ letterSpacing: '-0.01em' }}>{c.name}</p>
      <p className="mt-0.5 text-[10px] text-avs-accent/35">
        <strong className="text-avs-accent/55">{c.country}</strong> · {c.origin.split(',')[1]?.trim()}
      </p>

      {/* Role badge — accentHex justified inline for dynamic per-role tint */}
      <span
        className="mt-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[0.14em]"
        style={{ background: `${accentHex}12`, color: accentHex, border: `1px solid ${accentHex}28` }}
      >
        {getRoleConfig(t)[c.role].label}
      </span>

      <div className="mt-3 flex justify-center gap-4 text-xs text-avs-accent/35">
        <span><strong className="text-avs-accent">{c.patterns}</strong> motifs</span>
        <span>
          <strong className={isFirst ? 'text-avs-kente' : 'text-avs-accent'}>{c.score}</strong> pts
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTOR ROW
// ─────────────────────────────────────────────────────────────────────────────

function ContributorRow({ c, rank, t }: { c: Contributor; rank: number; t: any }) {
  const { accentHex } = getRoleConfig(t)[c.role];
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min((rank - 1) * 0.035, 0.25), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:translate-x-0.5 border ${
        isTop3 ? 'bg-avs-kente/10 border-avs-kente/20 hover:border-avs-kente' : 'bg-avs-secondary border-avs-accent/9 hover:border-avs-primary/20'
      }`}
    >
      {/* Rank */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
        rank === 1 ? 'bg-avs-kente text-avs-accent'
        : rank === 2 ? 'bg-avs-accent/18 text-avs-accent/55'
        : rank === 3 ? 'bg-avs-primary/10 text-avs-primary'
        : 'text-avs-accent/35 text-[11px] font-semibold'
      }`}>
        {rank === 1 ? <Trophy size={15} />
        : rank === 2 ? <Medal size={15} />
        : rank === 3 ? <Award size={15} />
        : `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`${c.avatarCSS} relative h-11 w-11 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105`}
          style={{ border: isTop3 ? '2px solid var(--avs-kente)' : '1.5px solid rgba(29,29,27,0.16)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/22">
            <span className="font-display text-sm font-black text-avs-secondary drop-shadow">{c.name.charAt(0)}</span>
          </div>
        </div>
        {c.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-avs-primary ring-2 ring-avs-secondary">
            <Check size={8} strokeWidth={3.5} className="text-avs-secondary" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold leading-tight text-avs-accent">{c.name}</p>
          {/* Role badge — accentHex inline: dynamic per-role */}
          <span
            className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[0.14em]"
            style={{ background: `${accentHex}12`, color: accentHex, border: `1px solid ${accentHex}25` }}
          >
            {getRoleConfig(t)[c.role].label}
          </span>
          {c.featured && (
            <Star size={11} className="text-avs-kente fill-avs-kente shrink-0" aria-label="Featured" />
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-avs-accent/35">
          <MapPin size={10} className="shrink-0" aria-hidden />
          <strong className="text-avs-accent/55 pr-0.5">{c.country}</strong>
          {c.origin}
          <span className="text-avs-accent/16">·</span>
          {c.specialty}
        </div>

        {c.badges.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {c.badges.slice(0, 3).map((b) => (
              <span key={b} className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-semibold bg-avs-primary/8 text-avs-primary">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
        <div className="flex items-center gap-1.5 text-xs text-avs-accent/35">
          <Layers size={10} aria-hidden />
          <strong className="text-avs-accent">{c.patterns}</strong> motifs
        </div>
        <div className="flex items-center gap-1.5 text-xs text-avs-accent/35">
          <TrendingUp size={10} aria-hidden />
          <strong className="text-avs-accent">{(c.views / 1000).toFixed(1)}k</strong> vues
        </div>
        <ScoreBar score={c.score} />
      </div>

      {/* GitHub link */}
      {c.github && (
        <a
          href={`https://github.com/${c.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl border border-avs-accent/9 text-avs-accent/35 hover:text-avs-accent hover:border-avs-accent/16 transition-all duration-150"
          aria-label={`GitHub de ${c.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ContributorsPage() {
  const t = useTranslations('dashboard.contributors');
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [role,   setRole]   = useState<ContributorRole | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await userService.getContributors();
        setContributors(data);
      } catch (error) {
        console.error('Failed to fetch contributors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const filtered = contributors
    .filter((c) => {
      const q = search.toLowerCase();
      const matchS = !q || c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q) || c.origin.toLowerCase().includes(q);
      const matchR = role === 'all' || c.role === role;
      return matchS && matchR;
    })
    .sort((a, b) => {
      if (sortBy === 'patterns') return b.patterns - a.patterns;
      if (sortBy === 'views')    return b.views - a.views;
      if (sortBy === 'joined')   return a.joinedYear - b.joinedYear;
      return b.score - a.score;
    });

  const topThree      = [...contributors].sort((a, b) => b.score - a.score).slice(0, 3);
  const totalPatterns = contributors.reduce((s, c) => s + c.patterns, 0);
  const totalViews    = contributors.reduce((s, c) => s + c.views, 0);
  const verifiedCount = contributors.filter((c) => c.verified).length;

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="min-h-screen bg-avs-secondary-dark">

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <div className="relative bg-avs-secondary border-b border-avs-accent/9">
          <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.03]" aria-hidden />
          <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">
                  {t('title')}
                </span>
              </div>
              <h1 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', letterSpacing: '-0.025em' }}>
                {t('title')}
              </h1>
              <p className="mt-1 text-sm text-avs-accent/35">
                {loading ? t('subtitle') : t('subtitleLoaded', { count: contributors.length })}
              </p>
            </div>

            <a
              href="/auth/register?role=contributor"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              <ExternalLink size={13} /> {t('join')} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* ══ COMMUNITY STATS ═════════════════════════════════════════════ */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 animate-pulse">
                  <div className="h-4 w-16 bg-avs-accent/6 rounded" />
                  <div className="mt-2 h-6 w-12 bg-avs-accent/6 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={String(contributors.length)}                       label={t('stats.members')}        icon={Shield}    t={t} />
              <StatCard value={String(totalPatterns)}                             label={t('stats.totalPatterns')}   icon={Layers}    t={t} />
              <StatCard value={`${(totalViews / 1000).toFixed(0)}k`}              label={t('stats.totalViews')}  icon={TrendingUp} t={t} />
              <StatCard value={String(verifiedCount)}                             label={t('stats.verified')}       icon={Award}     t={t} />
            </div>
          )}

          {/* ══ HALL OF FAME — Podium top 3 ═════════════════════════════════ */}
          <section>
            <div className="mb-5 flex items-center gap-2.5">
              <Trophy size={18} className="text-avs-kente" aria-hidden />
              <h2 className="font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>
                {t('hallOfFame')}
              </h2>
            </div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-6 animate-pulse">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-avs-accent/6" />
                    <div className="mt-4 h-4 w-24 mx-auto bg-avs-accent/6 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {topThree.map((c, i) => <PodiumCard key={c.id} c={c} rank={i + 1} t={t} />)}
              </div>
            )}
          </section>

          {/* ══ FULL LEADERBOARD ════════════════════════════════════════════ */}
          <section>
            {/* Controls bar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>
                {t('leaderboard')}
              </h2>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35" aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('search')}
                    className="ctr-input py-2 pl-8 pr-8"
                    style={{ width: '160px' }}
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-avs-accent/35"
                        aria-label={t('filter.clear')}
                      >
                        <X size={12} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <select value={role} onChange={(e) => setRole(e.target.value as ContributorRole | 'all')} className="ctr-select" aria-label="Filtrer par rôle">
                  <option value="all">{t('filter.all')}</option>
                  {(Object.keys(getRoleConfig(t)) as ContributorRole[]).map((r) => (
                    <option key={r} value={r}>{getRoleConfig(t)[r].label}</option>
                  ))}
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="ctr-select" aria-label="Trier par">
                  {getSortOptions(t).map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            {(search || role !== 'all') && (
              <p className="mb-3 font-mono text-[10px] text-avs-accent/35">
                {t('results', { count: filtered.length })}
                {role !== 'all' && ` · ${getRoleConfig(t)[role as ContributorRole]?.label}`}
              </p>
            )}

            {/* List */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-avs-accent/9 bg-avs-secondary p-4 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-avs-accent/6" />
                      <div className="h-11 w-11 rounded-xl bg-avs-accent/6" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-avs-accent/6 rounded" />
                        <div className="h-3 w-24 bg-avs-accent/6 rounded" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : filtered.length > 0 ? (
                <motion.div
                  key={`${search}-${role}-${sortBy}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2"
                >
                  {filtered.map((c, i) => <ContributorRow key={c.id} c={c} rank={i + 1} t={t} />)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex h-36 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-avs-accent/16"
                >
                  <div className="avs-pattern-wax-dakar h-10 w-10 rounded-full opacity-30" aria-hidden />
                  <p className="text-sm text-avs-accent/35">{t('empty')}</p>
                  <button
                    onClick={() => { setSearch(''); setRole('all'); }}
                    className="text-xs font-semibold underline underline-offset-3 text-avs-primary"
                  >
                    {t('resetFilters')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ══ JOIN CTA ════════════════════════════════════════════════════ */}
          <section className="avs-pattern-kente-royale relative overflow-hidden rounded-2xl">
            {/* Multi-stop gradient — justified inline */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(26,18,8,0.89) 100%)' }} aria-hidden />
            {/* Decorative rings */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-avs-primary/9" />
              <div className="absolute -top-6 -right-6 h-40 w-40 rounded-full border border-avs-primary/13" />
            </div>

            <div className="relative px-8 py-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-avs-primary/28 px-4 py-2 bg-avs-primary/10">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-avs-primary">
                  {t('joinCta.badge')}
                </span>
              </div>

              <p className="font-display font-black leading-tight text-avs-secondary" style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', letterSpacing: '-0.02em' }}>
                {t('joinCta.title')}
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-avs-secondary/52">
                {t('joinCta.description')}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href="/auth/register?role=artisan"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                  {t('joinCta.createAccount')}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/documentation"
                  className="flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold border border-avs-secondary/14 text-avs-secondary/72 hover:border-avs-secondary/28 hover:text-avs-secondary transition-all duration-200"
                >
                  {t('joinCta.readDocs')}
                </a>
              </div>

              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-avs-secondary/22">
                {t('joinCta.footer', { members: contributors.length, patterns: totalPatterns })}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}