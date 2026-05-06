'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Award, Layers, Shield,
  TrendingUp, MapPin, ExternalLink,
  Trophy, Medal, Check, X, ArrowRight,
} from 'lucide-react';

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
const CONTRIBUTORS: Contributor[] = [
  { id:'1', name:'Njoya Hamidou',      role:'curator',     origin:'Foumban, Cameroun',    country:'CM', specialty:'Ndop & Tissu Bamoum',  patterns:47, views:28400, score:98,  verified:true,  featured:true,  github:'njoya-h',     avatarCSS:'avs-pattern-ndop-sultan',    joinedYear:2021, badges:['Fondateur','50 motifs','Artisan vérifié'] },
  { id:'2', name:'Ama Asantewaa',      role:'curator',     origin:'Kumasi, Ghana',        country:'GH', specialty:'Kente & Adinkra',       patterns:63, views:41200, score:100, verified:true,  featured:true,  github:'ama-asante',   avatarCSS:'avs-pattern-kente-royale',   joinedYear:2021, badges:['Top Contributeur','100 motifs','Or AVS'] },
  { id:'3', name:'Fatoumata Coulibaly',role:'contributor', origin:'Ségou, Mali',          country:'ML', specialty:'Bogolan naturel',       patterns:38, views:19800, score:89,  verified:true,  featured:false, github:'fatou-art',    avatarCSS:'avs-pattern-bogolan-fanga',  joinedYear:2022, badges:['Artisan vérifié','25 motifs'] },
  { id:'4', name:'Jean-Paul Kamdem',   role:'admin',       origin:'Yaoundé, Cameroun',    country:'CM', specialty:'Toghu & Architecture',  patterns:12, views:4200,  score:95,  verified:true,  featured:false, github:'jpkamdem',     avatarCSS:'avs-pattern-adinkra-sankofa',joinedYear:2021, badges:['Fondateur','Admin','Ingénierie'] },
  { id:'5', name:'Sipho Dlamini',      role:'contributor', origin:'Mpumalanga, Afr. Sud', country:'ZA', specialty:'Peinture Ndebele',      patterns:29, views:14500, score:82,  verified:false, featured:false, github:undefined,      avatarCSS:'avs-pattern-wax-dakar',      joinedYear:2023, badges:['10 motifs'] },
  { id:'6', name:'Kofi Mensah',        role:'curator',     origin:'Accra, Ghana',         country:'GH', specialty:'Symbolisme Adinkra',    patterns:85, views:52000, score:97,  verified:true,  featured:true,  github:'kofi-symbols', avatarCSS:'avs-pattern-kente-royale',   joinedYear:2022, badges:['Chercheur','100 motifs','Or AVS'] },
  { id:'7', name:'Mariama Bah',        role:'artisan',     origin:'Conakry, Guinée',      country:'GN', specialty:'Tissu Peul',            patterns:31, views:9800,  score:78,  verified:false, featured:false, github:undefined,      avatarCSS:'avs-pattern-kuba-kasai',     joinedYear:2023, badges:['25 motifs'] },
  { id:'8', name:'Dr. Amara Diop',     role:'admin',       origin:'Dakar, Sénégal',       country:'SN', specialty:'Ethnographie',          patterns:22, views:18000, score:99,  verified:true,  featured:true,  github:'amara-diop',   avatarCSS:'avs-pattern-wax-dakar',      joinedYear:2021, badges:['Fondateur','Directeur','Chercheur'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<ContributorRole, { label: string; color: string; icon: typeof Shield }> = {
  admin:       { label: 'Admin',        color: '#C0573E', icon: Shield  },
  curator:     { label: 'Curateur',     color: '#D4A017', icon: Star    },
  contributor: { label: 'Contributeur', color: '#4A6741', icon: Layers  },
  artisan:     { label: 'Artisan',      color: '#2A4A6B', icon: Award   },
  viewer:      { label: 'Explorateur',  color: '#888780', icon: Shield  },
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'score',    label: 'Score'      },
  { value: 'patterns', label: 'Motifs'     },
  { value: 'views',    label: 'Vues'       },
  { value: 'joined',   label: 'Ancienneté' },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_STYLES = `
  :root {
    --ctr-bg:          #faf8f5;
    --ctr-surface:     #ffffff;
    --ctr-subtle:      rgba(29,29,27,0.04);
    --ctr-border:      rgba(29,29,27,0.09);
    --ctr-border-md:   rgba(29,29,27,0.16);
    --ctr-text:        #1D1D1B;
    --ctr-muted:       rgba(29,29,27,0.55);
    --ctr-hint:        rgba(29,29,27,0.35);
    --ctr-primary:     #C0573E;
    --ctr-primary-10:  rgba(192,87,62,0.08);
    --ctr-primary-20:  rgba(192,87,62,0.18);
    --ctr-gold:        #D4A017;
    --ctr-gold-10:     rgba(212,160,23,0.10);
    --ctr-gold-20:     rgba(212,160,23,0.22);
  }
  .dark {
    --ctr-bg:          #111110;
    --ctr-surface:     #1a1917;
    --ctr-subtle:      rgba(255,255,255,0.05);
    --ctr-border:      rgba(255,255,255,0.07);
    --ctr-border-md:   rgba(255,255,255,0.13);
    --ctr-text:        #ece8e1;
    --ctr-muted:       rgba(236,232,225,0.50);
    --ctr-hint:        rgba(236,232,225,0.30);
    --ctr-primary:     #d4694e;
    --ctr-primary-10:  rgba(212,105,78,0.10);
    --ctr-primary-20:  rgba(212,105,78,0.22);
    --ctr-gold:        #ddb030;
    --ctr-gold-10:     rgba(221,176,48,0.12);
    --ctr-gold-20:     rgba(221,176,48,0.24);
  }

  ::placeholder { color: var(--ctr-hint) !important; opacity:1; }

  .ctr-input {
    background: var(--ctr-surface);
    color: var(--ctr-text);
    border: 1.5px solid var(--ctr-border-md);
    border-radius: 0.75rem;
    outline: none;
    font-size: 0.8125rem;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
  }
  .ctr-input:focus {
    border-color: var(--ctr-primary);
    box-shadow: 0 0 0 3px var(--ctr-primary-10);
  }
  .ctr-select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--ctr-surface);
    color: var(--ctr-text);
    border: 1.5px solid var(--ctr-border-md);
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
    border-color: var(--ctr-primary);
    box-shadow: 0 0 0 3px var(--ctr-primary-10);
  }
  .ctr-select option { background: var(--ctr-surface); color: var(--ctr-text); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SCORE BAR
// ─────────────────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? 'var(--ctr-gold)' : score >= 70 ? 'var(--ctr-primary)' : 'var(--ctr-hint)';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ background: 'var(--ctr-subtle)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="font-mono text-xs font-bold tabular-nums" style={{ color: 'var(--ctr-hint)' }}>{score}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD (community overview)
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Shield }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300"
      style={{ background: 'var(--ctr-surface)', border: '1px solid var(--ctr-border)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ctr-primary-20)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ctr-border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: 'var(--ctr-primary)' }} aria-hidden />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--ctr-primary-10)', color: 'var(--ctr-primary)' }}>
          <Icon size={16} aria-hidden />
        </div>
        <div>
          <p className="font-display text-xl font-black leading-none" style={{ color: 'var(--ctr-text)', letterSpacing: '-0.02em' }}>{value}</p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--ctr-hint)' }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PODIUM CARD (top 3)
// ─────────────────────────────────────────────────────────────────────────────
function PodiumCard({ c, rank }: { c: Contributor; rank: number }) {
  const { color } = ROLE_CONFIG[c.role];
  const isFirst = rank === 1;
  const rankIcon = rank === 1 ? Trophy : rank === 2 ? Medal : Award;
  const RankIcon = rankIcon;
  const rankColor = rank === 1 ? 'var(--ctr-gold)' : rank === 2 ? 'var(--ctr-hint)' : 'var(--ctr-primary)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300"
      style={{
        background: isFirst ? 'var(--ctr-gold-10)' : 'var(--ctr-surface)',
        border: `1px solid ${isFirst ? 'var(--ctr-gold-20)' : 'var(--ctr-border)'}`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${rankColor}20`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Pattern accent top */}
      <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />

      <div className="mb-4 flex justify-center">
        <RankIcon size={28} style={{ color: rankColor }} />
      </div>

      {/* Avatar */}
      <div className="relative mx-auto mb-3 h-16 w-16">
        <div
          className={`${c.avatarCSS} relative h-16 w-16 overflow-hidden rounded-2xl`}
          style={{ border: isFirst ? `2.5px solid var(--ctr-gold)` : '2px solid var(--ctr-border-md)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/22">
            <span className="font-display text-xl font-black text-white drop-shadow-md">{c.name.charAt(0)}</span>
          </div>
        </div>
        {c.verified && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: 'var(--ctr-primary)', border: '2px solid var(--ctr-surface)' }}>
            <Check size={9} strokeWidth={3} className="text-white" />
          </div>
        )}
      </div>

      <p className="font-display text-sm font-bold" style={{ color: 'var(--ctr-text)', letterSpacing: '-0.01em' }}>{c.name}</p>
      <p className="mt-0.5 text-[10px]" style={{ color: 'var(--ctr-hint)' }}>
        <strong style={{ color: 'var(--ctr-muted)' }}>{c.country}</strong> · {c.origin.split(',')[1]?.trim()}
      </p>

      {/* Role badge */}
      <span
        className="mt-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[0.14em]"
        style={{ background: `${color}12`, color, border: `1px solid ${color}28` }}
      >
        {ROLE_CONFIG[c.role].label}
      </span>

      <div className="mt-3 flex justify-center gap-4 text-xs" style={{ color: 'var(--ctr-hint)' }}>
        <span><strong style={{ color: 'var(--ctr-text)' }}>{c.patterns}</strong> motifs</span>
        <span><strong style={{ color: isFirst ? 'var(--ctr-gold)' : 'var(--ctr-text)' }}>{c.score}</strong> pts</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTOR ROW
// ─────────────────────────────────────────────────────────────────────────────
function ContributorRow({ c, rank }: { c: Contributor; rank: number }) {
  const { color } = ROLE_CONFIG[c.role];
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min((rank - 1) * 0.035, 0.25), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200"
      style={{
        background: isTop3 ? 'var(--ctr-gold-10)' : 'var(--ctr-surface)',
        border: `1px solid ${isTop3 ? 'var(--ctr-gold-20)' : 'var(--ctr-border)'}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = isTop3 ? 'var(--ctr-gold)' : 'var(--ctr-primary-20)';
        (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = isTop3 ? 'var(--ctr-gold-20)' : 'var(--ctr-border)';
        (e.currentTarget as HTMLElement).style.transform = 'none';
      }}
    >
      {/* Rank */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
        style={
          rank === 1 ? { background: 'var(--ctr-gold)', color: '#1D1D1B' } :
          rank === 2 ? { background: 'rgba(136,135,128,0.18)', color: 'var(--ctr-muted)' } :
          rank === 3 ? { background: 'var(--ctr-primary-10)', color: 'var(--ctr-primary)' } :
          { color: 'var(--ctr-hint)', fontSize: '11px', fontWeight: 600 }
        }
      >
        {rank === 1 ? <Trophy size={15} /> : rank === 2 ? <Medal size={15} /> : rank === 3 ? <Award size={15} /> : `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`${c.avatarCSS} relative h-11 w-11 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105`}
          style={{ border: isTop3 ? '2px solid var(--ctr-gold)' : '1.5px solid var(--ctr-border-md)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/22">
            <span className="font-display text-sm font-black text-white drop-shadow">{c.name.charAt(0)}</span>
          </div>
        </div>
        {c.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full"
            style={{ background: 'var(--ctr-primary)', border: '2px solid var(--ctr-surface)' }}>
            <Check size={8} strokeWidth={3.5} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold leading-tight" style={{ color: 'var(--ctr-text)' }}>
            {c.name}
          </p>
          {/* Role badge */}
          <span
            className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[0.14em]"
            style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
          >
            {ROLE_CONFIG[c.role].label}
          </span>
          {c.featured && (
            <Star size={11} style={{ fill: 'var(--ctr-gold)', color: 'var(--ctr-gold)', flexShrink: 0 }} aria-label="Featured" />
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ctr-hint)' }}>
          <MapPin size={10} style={{ flexShrink: 0 }} aria-hidden />
          <strong style={{ color: 'var(--ctr-muted)', paddingRight: 2 }}>{c.country}</strong>
          {c.origin}
          <span style={{ color: 'var(--ctr-border-md)' }}>·</span>
          {c.specialty}
        </div>

        {/* Badges */}
        {c.badges.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {c.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-semibold"
                style={{ background: 'var(--ctr-primary-10)', color: 'var(--ctr-primary)' }}
              >{b}</span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ctr-hint)' }}>
          <Layers size={10} aria-hidden />
          <strong style={{ color: 'var(--ctr-text)' }}>{c.patterns}</strong> motifs
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ctr-hint)' }}>
          <TrendingUp size={10} aria-hidden />
          <strong style={{ color: 'var(--ctr-text)' }}>{(c.views / 1000).toFixed(1)}k</strong> vues
        </div>
        <ScoreBar score={c.score} />
      </div>

      {/* GitHub link */}
      {c.github && (
        <a
          href={`https://github.com/${c.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150"
          style={{ color: 'var(--ctr-hint)', border: '1px solid var(--ctr-border)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ctr-text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--ctr-border-md)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ctr-hint)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--ctr-border)'; }}
          aria-label={`GitHub de ${c.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ContributorsPage() {
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState<ContributorRole | 'all'>('all');
  const [sortBy,  setSortBy]  = useState<SortKey>('score');

  const filtered = CONTRIBUTORS
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

  const topThree        = [...CONTRIBUTORS].sort((a, b) => b.score - a.score).slice(0, 3);
  const totalPatterns   = CONTRIBUTORS.reduce((s, c) => s + c.patterns, 0);
  const totalViews      = CONTRIBUTORS.reduce((s, c) => s + c.views, 0);
  const verifiedCount   = CONTRIBUTORS.filter((c) => c.verified).length;

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div style={{ background: 'var(--ctr-bg)', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        <div
          style={{ background: 'var(--ctr-surface)', borderBottom: '1px solid var(--ctr-border)' }}
          className="relative"
        >
          <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.03]" aria-hidden />
          <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6" style={{ background: 'var(--ctr-primary)' }} aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--ctr-primary)' }}>
                  Communauté AVS
                </span>
              </div>
              <h1
                className="font-display font-black leading-none"
                style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', color: 'var(--ctr-text)', letterSpacing: '-0.025em' }}
              >
                Contributeurs
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--ctr-hint)' }}>
                {CONTRIBUTORS.length} membres actifs du monde entier
              </p>
            </div>

            <a
              href="/auth/register?role=contributor"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--ctr-primary)', boxShadow: '0 4px 16px var(--ctr-primary-20)' }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              <ExternalLink size={13} /> Rejoindre <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* ══════════════════════════════════════════════════════
              COMMUNITY STATS
          ══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={String(CONTRIBUTORS.length)} label="Membres"          icon={Shield}    />
            <StatCard value={String(totalPatterns)}        label="Motifs total"    icon={Layers}    />
            <StatCard value={`${(totalViews / 1000).toFixed(0)}k`} label="Vues cumulées" icon={TrendingUp} />
            <StatCard value={String(verifiedCount)}        label="Vérifiés"        icon={Award}     />
          </div>

          {/* ══════════════════════════════════════════════════════
              HALL OF FAME — Podium top 3
          ══════════════════════════════════════════════════════ */}
          <section>
            <div className="mb-5 flex items-center gap-2.5">
              <Trophy size={18} style={{ color: 'var(--ctr-gold)' }} aria-hidden />
              <h2 className="font-display text-lg font-black" style={{ color: 'var(--ctr-text)', letterSpacing: '-0.015em' }}>
                Hall of Fame
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {topThree.map((c, i) => <PodiumCard key={c.id} c={c} rank={i + 1} />)}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              FULL LEADERBOARD
          ══════════════════════════════════════════════════════ */}
          <section>
            {/* Controls bar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg font-black" style={{ color: 'var(--ctr-text)', letterSpacing: '-0.015em' }}>
                Classement
              </h2>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ctr-hint)' }} aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nom, spécialité…"
                    className="ctr-input py-2 pl-8 pr-8"
                    style={{ width: '160px' }}
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--ctr-hint)' }}
                        aria-label="Effacer"
                      >
                        <X size={12} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Role filter */}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as ContributorRole | 'all')}
                  className="ctr-select"
                  aria-label="Filtrer par rôle"
                >
                  <option value="all">Tous les rôles</option>
                  {(Object.keys(ROLE_CONFIG) as ContributorRole[]).map((r) => (
                    <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="ctr-select"
                  aria-label="Trier par"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            {(search || role !== 'all') && (
              <p className="mb-3 font-mono text-[10px]" style={{ color: 'var(--ctr-hint)' }}>
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                {role !== 'all' && ` · ${ROLE_CONFIG[role as ContributorRole]?.label}`}
              </p>
            )}

            {/* List */}
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key={`${search}-${role}-${sortBy}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2"
                >
                  {filtered.map((c, i) => <ContributorRow key={c.id} c={c} rank={i + 1} />)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex h-36 flex-col items-center justify-center gap-3 rounded-2xl"
                  style={{ border: '2px dashed var(--ctr-border-md)' }}
                >
                  <div className="avs-pattern-wax-dakar h-10 w-10 rounded-full opacity-30" aria-hidden />
                  <p className="text-sm" style={{ color: 'var(--ctr-hint)' }}>Aucun contributeur trouvé</p>
                  <button
                    onClick={() => { setSearch(''); setRole('all'); }}
                    className="text-xs font-semibold underline underline-offset-3"
                    style={{ color: 'var(--ctr-primary)' }}
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ══════════════════════════════════════════════════════
              JOIN CTA
          ══════════════════════════════════════════════════════ */}
          <section className="avs-pattern-kente-royale relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(26,18,8,0.89) 100%)' }} aria-hidden />
            {/* Decorative rings */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.09)' }} />
              <div className="absolute -top-6 -right-6 h-40 w-40 rounded-full" style={{ border: '1px solid rgba(192,87,62,0.13)' }} />
            </div>

            <div className="relative px-8 py-10 text-center">
              {/* Eyebrow */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2"
                style={{ background: 'rgba(192,87,62,0.10)', borderColor: 'rgba(192,87,62,0.28)' }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--ctr-primary)' }} aria-hidden />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--ctr-primary)' }}>
                  Rejoindre la communauté
                </span>
              </div>

              <p
                className="font-display font-black leading-tight"
                style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', color: '#F5EBE0', letterSpacing: '-0.02em' }}
              >
                Devenez contributeur AVS
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.52)' }}>
                Artisan, chercheur ou designer — votre connaissance enrichit la plus grande archive visuelle africaine open-source.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href="/auth/register?role=artisan"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'var(--ctr-primary)', boxShadow: '4px 4px 0 rgba(192,87,62,0.35)' }}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                  Créer un compte gratuit
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/documentation"
                  className="flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition-all duration-200"
                  style={{ border: '1px solid rgba(245,235,224,0.14)', color: 'rgba(245,235,224,0.72)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,235,224,0.28)'; (e.currentTarget as HTMLElement).style.color = '#F5EBE0'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,235,224,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,235,224,0.72)'; }}
                >
                  Lire la documentation
                </a>
              </div>

              {/* Social proof */}
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(245,235,224,0.22)' }}>
                {CONTRIBUTORS.length} membres · {totalPatterns} motifs · Open Source
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}