'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Award, Layers, Shield, TrendingUp, MapPin, ExternalLink, Trophy, Medal, Check } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type ContributorRole = 'admin' | 'curator' | 'contributor' | 'artisan' | 'viewer';
type SortKey = 'patterns' | 'views' | 'score' | 'joined';

interface Contributor {
  id:          string;
  name:        string;
  role:        ContributorRole;
  origin:      string;
  country:     string;     // Code ISO du pays au lieu de l'emoji
  specialty:   string;
  patterns:    number;
  views:       number;
  score:       number;     // score de réputation 0-100
  verified:    boolean;
  featured:    boolean;
  github?:     string;
  avatarCSS:   string;     // CSS pattern pour l'avatar
  joinedYear:  number;
  badges:      string[];
}

// ── Données mock ───────────────────────────────────────────────────────────────
const CONTRIBUTORS: Contributor[] = [
  { id:'1', name:'Njoya Hamidou',     role:'curator',     origin:'Foumban, Cameroun',    country:'CM', specialty:'Ndop & Tissu Bamoum', patterns:47, views:28400, score:98, verified:true,  featured:true,  github:'njoya-h',     avatarCSS:'avs-pattern-ndop-royal', joinedYear:2021, badges:['Fondateur','50 motifs','Artisan vérifié'] },
  { id:'2', name:'Ama Asantewaa',     role:'curator',     origin:'Kumasi, Ghana',        country:'GH', specialty:'Kente & Adinkra',    patterns:63, views:41200, score:100,verified:true,  featured:true,  github:'ama-asante',   avatarCSS:'avs-pattern-kente',      joinedYear:2021, badges:['Top Contributeur','100 motifs','Or AVS'] },
  { id:'3', name:'Fatoumata Coulibaly',role:'contributor', origin:'Ségou, Mali',          country:'ML', specialty:'Bogolan naturel',    patterns:38, views:19800, score:89, verified:true,  featured:false, github:'fatou-art',    avatarCSS:'avs-pattern-wax-bold',   joinedYear:2022, badges:['Artisan vérifié','25 motifs'] },
  { id:'4', name:'Jean-Paul Kamdem',  role:'admin',       origin:'Yaoundé, Cameroun',    country:'CM', specialty:'Toghu & Architecture',patterns:12, views:4200,  score:95, verified:true,  featured:false, github:'jpkamdem',     avatarCSS:'avs-pattern-ndop',       joinedYear:2021, badges:['Fondateur','Admin','Ingénierie'] },
  { id:'5', name:'Sipho Dlamini',     role:'contributor', origin:'Mpumalanga, Afr. Sud', country:'ZA', specialty:'Peinture Ndebele',   patterns:29, views:14500, score:82, verified:false, featured:false, github:undefined,      avatarCSS:'avs-pattern-wax',        joinedYear:2023, badges:['10 motifs'] },
  { id:'6', name:'Kofi Mensah',       role:'curator',     origin:'Accra, Ghana',         country:'GH', specialty:'Symbolisme Adinkra', patterns:85, views:52000, score:97, verified:true,  featured:true,  github:'kofi-symbols', avatarCSS:'avs-pattern-kente',      joinedYear:2022, badges:['Chercheur','100 motifs','Or AVS'] },
  { id:'7', name:'Mariama Bah',       role:'artisan',     origin:'Conakry, Guinée',      country:'GN', specialty:'Tissu Peul',         patterns:31, views:9800,  score:78, verified:false, featured:false, github:undefined,      avatarCSS:'avs-pattern-ndop',       joinedYear:2023, badges:['25 motifs'] },
  { id:'8', name:'Dr. Amara Diop',    role:'admin',       origin:'Dakar, Sénégal',       country:'SN', specialty:'Ethnographie',       patterns:22, views:18000, score:99, verified:true,  featured:true,  github:'amara-diop',   avatarCSS:'avs-pattern-wax-bold',   joinedYear:2021, badges:['Fondateur','Directeur','Chercheur'] },
];

// ── Config rôles ───────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<ContributorRole, { label: string; css: string; icon: typeof Shield }> = {
  admin:       { label:'Admin',        css:'bg-avs-primary text-avs-secondary',    icon: Shield },
  curator:     { label:'Curateur',     css:'bg-avs-kente/20 text-avs-kente',       icon: Star },
  contributor: { label:'Contributeur', css:'bg-avs-ndop/15 text-avs-ndop',         icon: Layers },
  artisan:     { label:'Artisan',      css:'bg-avs-indigo/15 text-avs-indigo',     icon: Award },
  viewer:      { label:'Explorateur',  css:'bg-avs-accent/10 text-avs-accent/60',  icon: Shield },
};

// ── Barre de score ─────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-avs-kente' : score >= 70 ? 'bg-avs-primary' : 'bg-avs-accent/40';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-avs-accent/10">
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${score}%` }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="font-mono text-xs font-bold text-avs-accent/60">{score}</span>
    </div>
  );
}

// ── Carte contributeur ─────────────────────────────────────────────────────────
function ContributorCard({ contributor, rank }: { contributor: Contributor; rank: number }) {
  const { label: roleLabel, css: roleCss } = ROLE_CONFIG[contributor.role];
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity:0, x:-12 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: (rank-1) * 0.04, duration:0.35 }}
      className={`flex items-center gap-4 rounded-avs-lg border p-4 transition-all hover:-translate-x-0.5 hover:shadow-avs ${isTop3 ? 'border-avs-kente/30 bg-avs-kente/4' : 'border-avs-accent/10 bg-avs-secondary'}`}
    >
      {/* Rang */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
        rank === 1 ? 'bg-avs-kente text-avs-accent' :
        rank === 2 ? 'bg-avs-accent/20 text-avs-accent' :
        rank === 3 ? 'bg-avs-primary/20 text-avs-primary' :
        'text-avs-accent/30 font-bold text-xs'
      }`}>
        {rank === 1 ? <Trophy size={16} /> : 
         rank === 2 ? <Medal size={16} /> : 
         rank === 3 ? <Award size={16} /> : 
         `#${rank}`}
      </div>

      {/* Avatar */}
      <div className={`${contributor.avatarCSS} relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${isTop3 ? 'border-avs-kente/40' : 'border-avs-accent/15'}`}>
        <span className="font-display text-sm font-black text-avs-secondary drop-shadow">
          {contributor.name.charAt(0)}
        </span>
        {contributor.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-avs-primary border-2 border-avs-secondary">
            <Check size={10} strokeWidth={4} className="text-avs-secondary" />
          </div>
        )}
      </div>

      {/* Infos principales */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-sm text-avs-accent">{contributor.name}</p>
          <span className={`rounded-avs px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleCss}`}>
            {roleLabel}
          </span>
          {contributor.featured && <Star size={11} className="fill-avs-kente text-avs-kente" aria-label="Featured" />}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-avs-accent/45">
          <MapPin size={10} aria-hidden />
          <span><strong className="text-avs-accent/60 pr-1">{contributor.country}</strong> {contributor.origin}</span>
          <span className="text-avs-accent/25">·</span>
          <span>{contributor.specialty}</span>
        </div>
        {/* Badges */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {contributor.badges.slice(0,3).map(b => (
            <span key={b} className="rounded-avs bg-avs-primary/8 px-1.5 py-0.5 text-[9px] font-semibold text-avs-primary">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Métriques */}
      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1 text-xs text-avs-accent/60">
          <Layers size={11} aria-hidden />
          <span className="font-bold text-avs-accent">{contributor.patterns}</span> motifs
        </div>
        <div className="flex items-center gap-1 text-xs text-avs-accent/60">
          <TrendingUp size={11} aria-hidden />
          <span className="font-bold text-avs-accent">{(contributor.views/1000).toFixed(1)}k</span> vues
        </div>
        <ScoreBar score={contributor.score} />
      </div>

      {/* GitHub */}
      {contributor.github && (
        <a href={`https://github.com/${contributor.github}`} target="_blank" rel="noopener noreferrer"
          className="shrink-0 rounded-avs p-1.5 text-avs-accent/30 hover:bg-avs-accent/8 hover:text-avs-accent transition-colors"
          aria-label={`GitHub de ${contributor.name}`}>
          {/* <Github size={15} /> */}
        </a>
      )}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ContributorsPage() {
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState<ContributorRole | 'all'>('all');
  const [sortBy,  setSortBy]  = useState<SortKey>('score');

  const filtered = CONTRIBUTORS
    .filter(c => {
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

  const totalPatterns = CONTRIBUTORS.reduce((s, c) => s + c.patterns, 0);
  const totalViews    = CONTRIBUTORS.reduce((s, c) => s + c.views, 0);

  return (
    <div className="min-h-screen bg-avs-secondary/50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-avs-accent/10 bg-avs-secondary px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-avs-accent">Contributeurs</h1>
            <p className="text-sm text-avs-accent/50">Communauté AVS — {CONTRIBUTORS.length} membres actifs</p>
          </div>
          <a href="/auth/register?role=contributor"
            className="avs-btn-primary py-2 px-4 text-xs gap-1.5">
            <ExternalLink size={13}/> Rejoindre
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Stats communauté ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { v: CONTRIBUTORS.length.toString(), l:'Membres',      icon: Shield },
            { v: totalPatterns.toString(),        l:'Motifs total', icon: Layers },
            { v: `${(totalViews/1000).toFixed(0)}k`, l:'Vues cumulées', icon: TrendingUp },
            { v: CONTRIBUTORS.filter(c=>c.verified).length.toString(), l:'Vérifiés', icon: Award },
          ].map(({ v, l, icon: Icon }) => (
            <div key={l} className="avs-card p-4 flex items-center gap-3">
              <div className="rounded-avs bg-avs-primary/10 p-2">
                <Icon size={16} className="text-avs-primary" aria-hidden />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-avs-accent">{v}</p>
                <p className="text-xs text-avs-accent/50">{l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Podium Top 3 ───────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display font-bold text-avs-accent mb-4 flex items-center gap-2">
            <Award size={18} className="text-avs-kente" /> Hall of Fame
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {CONTRIBUTORS.sort((a,b) => b.score - a.score).slice(0,3).map((c, i) => {
              const { label: roleLabel, css: roleCss } = ROLE_CONFIG[c.role];
              return (
                <motion.div key={c.id}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.1, duration:0.4 }}
                  className={`relative overflow-hidden rounded-avs-lg border text-center p-6 ${i === 0 ? 'border-avs-kente/40 bg-avs-kente/8' : 'border-avs-accent/10 bg-avs-secondary'}`}
                >
                  {i === 0 && <div className="absolute inset-x-0 top-0 h-1 bg-avs-kente" />}
                  
                  <div className="flex justify-center mb-3">
                    {i === 0 ? <Trophy size={28} className="text-avs-kente" /> : 
                     i === 1 ? <Medal size={28} className="text-avs-accent/60" /> : 
                     <Award size={28} className="text-avs-primary/60" />}
                  </div>

                  <div className={`${c.avatarCSS} mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 ${i === 0 ? 'border-avs-kente/60' : 'border-avs-accent/20'}`}>
                    <span className="font-display text-xl font-black text-avs-secondary drop-shadow">{c.name.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-sm text-avs-accent">{c.name}</p>
                  <p className="text-xs text-avs-accent/45 mt-0.5"><strong className="pr-1">{c.country}</strong> {c.origin.split(',')[1]?.trim()}</p>
                  <span className={`mt-2 inline-block rounded-avs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleCss}`}>{roleLabel}</span>
                  <div className="mt-3 flex justify-center gap-4 text-xs text-avs-accent/60">
                    <span><strong className="text-avs-accent">{c.patterns}</strong> motifs</span>
                    <span><strong className="text-avs-accent">{c.score}</strong> pts</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Classement complet ──────────────────────────────────────────── */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="font-display font-bold text-avs-accent">Classement</h2>
            <div className="ml-auto flex flex-wrap gap-2">
              {/* Recherche */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-avs-accent/35" />
                <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Nom, spécialité…" className="avs-input py-1.5 pl-8 text-xs w-40" />
              </div>
              {/* Filtre rôle */}
              <select
                value={role}
                onChange={e => setRole(e.target.value as ContributorRole | 'all')}
                className="avs-input py-1.5 text-xs w-auto"
                aria-label="Filtrer par rôle"
              >
                <option value="all">Tous les rôles</option>
                {(Object.keys(ROLE_CONFIG) as ContributorRole[]).map(r => (
                  <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
                ))}
              </select>
              {/* Tri */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="avs-input py-1.5 text-xs w-auto"
                aria-label="Trier par"
              >
                <option value="score">Score</option>
                <option value="patterns">Motifs</option>
                <option value="views">Vues</option>
                <option value="joined">Ancienneté</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((c, i) => (
              <ContributorCard key={c.id} contributor={c} rank={i + 1} />
            ))}
            {filtered.length === 0 && (
              <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-avs-lg border-2 border-dashed border-avs-accent/10 text-avs-accent/35">
                <p className="text-sm">Aucun contributeur trouvé</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Rejoindre CTA ───────────────────────────────────────────────── */}
        <div className="rounded-avs-lg avs-pattern-wax relative overflow-hidden">
          <div className="absolute inset-0 bg-avs-accent/90" />
          <div className="relative px-8 py-10 text-center">
            <p className="font-display text-2xl font-bold text-avs-secondary">Devenez contributeur AVS</p>
            <p className="mt-2 text-sm text-avs-secondary/60 max-w-md mx-auto">
              Artisan, chercheur ou designer — votre connaissance enrichit la plus grande archive visuelle africaine open-source.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/auth/register?role=artisan"
                className="avs-btn-primary text-sm py-2.5 px-6">
                Créer un compte gratuit
              </a>
              <a href="/documentation"
                className="rounded-avs border border-avs-secondary/30 px-6 py-2.5 text-sm font-semibold text-avs-secondary/70 hover:text-avs-secondary transition-colors">
                Lire la documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}