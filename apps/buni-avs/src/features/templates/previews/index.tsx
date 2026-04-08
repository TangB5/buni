// =============================================================================
// AVS — Vrais composants de prévisualisation
// src/features/components/previews/index.tsx
//
// Chaque export est un composant React autonome — rendu live dans la page.
// =============================================================================

'use client';

import { useState, useRef } from 'react';
import { Loader2, Search, MapPin, Star, Download, Check, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON — toutes les variantes
// ─────────────────────────────────────────────────────────────────────────────
export function ButtonPreview() {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-5 p-8">
      {/* Variantes */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Variantes
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="avs-btn-primary px-4 py-2 text-xs">Primaire</button>
          <button className="avs-btn-secondary px-4 py-2 text-xs">Secondaire</button>
          <button className="rounded-avs bg-avs-kente text-avs-accent shadow-avs px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5">
            Kente
          </button>
          <button className="rounded-avs border-avs-primary/30 text-avs-primary hover:bg-avs-primary/8 border-2 px-4 py-2 text-xs font-semibold transition-colors">
            Ghost
          </button>
          <button className="rounded-avs shadow-avs bg-red-600 px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5">
            Danger
          </button>
        </div>
      </div>

      {/* Tailles */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Tailles
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="avs-btn-primary px-3 py-1 text-[10px]">XS</button>
          <button className="avs-btn-primary px-4 py-2 text-xs">SM</button>
          <button className="avs-btn-primary px-6 py-2.5 text-sm">MD</button>
          <button className="avs-btn-primary px-8 py-3 text-base">LG</button>
        </div>
      </div>

      {/* États */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          États
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLoad}
            disabled={loading}
            className="avs-btn-primary gap-1.5 px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            {loading ? 'Chargement…' : 'Cliquer pour charger'}
          </button>
          <button
            className="avs-btn-primary cursor-not-allowed px-4 py-2 text-xs opacity-40"
            disabled
          >
            Désactivé
          </button>
          <button className="avs-btn-primary gap-1.5 px-4 py-2 text-xs">
            <Download size={13} /> Avec icône
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE — types et variantes
// ─────────────────────────────────────────────────────────────────────────────
export function BadgePreview() {
  return (
    <div className="space-y-5 p-8">
      {/* Types de motifs */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Types de motifs
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'KENTE', css: 'bg-avs-primary/12 text-avs-primary' },
            { label: 'NDOP', css: 'bg-avs-kente/15 text-avs-kente' },
            { label: 'BOGOLAN', css: 'bg-avs-ndop/15 text-avs-ndop' },
            { label: 'WAX', css: 'bg-avs-indigo/15 text-avs-indigo' },
            { label: 'ADINKRA', css: 'bg-avs-earth/15 text-avs-earth' },
          ].map(({ label, css }) => (
            <span
              key={label}
              className={`rounded-avs px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${css}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Statuts */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Statuts
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Publié', css: 'bg-green-100 text-green-700' },
            { label: 'Brouillon', css: 'bg-avs-accent/10 text-avs-accent/60' },
            { label: 'En révision', css: 'bg-amber-100 text-amber-700' },
            { label: 'Rejeté', css: 'bg-red-100 text-red-600' },
            { label: 'Vedette ✦', css: 'bg-avs-kente/15 text-avs-kente' },
          ].map(({ label, css }) => (
            <span key={label} className={`rounded-avs px-2.5 py-1 text-[10px] font-bold ${css}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Avec point de statut */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Avec indicateur
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'En ligne', dot: 'bg-green-500', css: 'bg-green-100 text-green-700' },
            { label: 'Occupé', dot: 'bg-amber-500', css: 'bg-amber-100 text-amber-700' },
            {
              label: 'Hors ligne',
              dot: 'bg-avs-accent/30',
              css: 'bg-avs-accent/10 text-avs-accent/60',
            },
          ].map(({ label, dot, css }) => (
            <span
              key={label}
              className={`rounded-avs inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold ${css}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT — champs de formulaire
// ─────────────────────────────────────────────────────────────────────────────
export function InputPreview() {
  const [val, setVal] = useState('');
  const [email, setEmail] = useState('invalide@');

  const isEmailInvalid = (email.length > 0 && !email.includes('@')) || email.endsWith('@');

  return (
    <div className="mx-auto max-w-sm space-y-5 p-8">
      {/* Simple */}
      <div>
        <label className="avs-label">Nom du motif</label>
        <input
          className="avs-input"
          placeholder="ex: Ndop Bamoum"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>

      {/* Avec icône */}
      <div>
        <label className="avs-label">Recherche</label>
        <div className="relative">
          <Search
            size={14}
            className="text-avs-accent/40 absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input className="avs-input pl-9" placeholder="Kente, Ndop, Ghana…" />
        </div>
      </div>

      {/* Avec erreur (live) */}
      <div>
        <label className="avs-label">Email</label>
        <input
          className={`avs-input ${isEmailInvalid ? 'avs-input-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          type="email"
        />
        {isEmailInvalid && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle size={11} /> Format email invalide
          </p>
        )}
      </div>

      {/* Textarea */}
      <div>
        <label className="avs-label">Description</label>
        <textarea
          className="avs-input resize-none"
          rows={3}
          placeholder="Décrivez le motif culturel…"
        />
        <p className="text-avs-accent/35 mt-0.5 text-right text-[10px]">0 / 500</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT WAX
// ─────────────────────────────────────────────────────────────────────────────
export const WaxInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-sm rounded-[4px] p-1">
      {/* Bordure animée avec le pattern Wax */}
      <motion.div
        className={`avs-pattern-wax-bold pointer-events-none absolute inset-0 rounded-[4px] transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
      />

      {/* Input réel */}
      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-avs-secondary border-avs-accent/20 text-avs-accent relative w-full rounded-[4px] border-2 px-4 py-3 font-medium transition-all duration-300 focus:border-transparent focus:ring-0 focus:outline-none"
        placeholder="Entrez votre texte..."
      />
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────
// CARD — variantes de cartes
// ─────────────────────────────────────────────────────────────────────────────
export function CardPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2">
      {/* Pattern Card */}
      <div className="avs-pattern-ndop-royal rounded-avs-lg border-avs-accent/10 shadow-avs group hover:shadow-avs-md relative cursor-pointer overflow-hidden border transition-all hover:-translate-y-1">
        <div className="h-28" />
        <div className="from-avs-accent/80 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-avs bg-avs-accent/80 text-avs-secondary px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm">
            NDOP
          </span>
          <p className="font-display text-avs-secondary mt-0.5 text-sm font-bold">Ndop Bamoum</p>
          <div className="text-avs-secondary/60 mt-0.5 flex items-center gap-1 text-[10px]">
            <MapPin size={9} /> Foumban, Cameroun
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="avs-card flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div className="rounded-avs bg-avs-primary/10 p-2.5">
            <Star size={16} className="text-avs-primary" />
          </div>
          <span className="rounded-avs bg-avs-kente/15 text-avs-kente px-2 py-0.5 text-[9px] font-bold">
            ✦ Vedette
          </span>
        </div>
        <div>
          <h3 className="font-display text-avs-accent font-bold">Kente Asante</h3>
          <p className="text-avs-accent/55 mt-1 text-xs leading-snug">
            Tissu royal du peuple Akan du Ghana.
          </p>
        </div>
        <div className="mt-auto flex gap-1.5">
          {['#D4A017', '#1D1D1B', '#C0573E'].map((c) => (
            <span
              key={c}
              className="border-avs-accent/10 h-4 w-4 rounded-full border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Stat card */}
      <div className="avs-card p-5">
        <p className="text-avs-accent/40 text-[10px] font-bold tracking-wider uppercase">
          Téléchargements
        </p>
        <p className="font-display text-avs-accent mt-1 text-3xl font-bold">4.2k</p>
        <p className="mt-0.5 text-xs font-semibold text-green-600">+18% ce mois</p>
      </div>

      {/* Artisan card */}
      <div className="avs-card overflow-hidden p-0">
        <div className="avs-pattern-kente relative h-16">
          <div className="bg-avs-accent/50 absolute inset-0" />
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <div className="avs-pattern-kente border-avs-secondary flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                A
              </span>
            </div>
            <p className="text-avs-secondary text-xs font-bold">Ama Asantewaa</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-avs-accent/50 flex items-center gap-1 text-[10px]">
            <MapPin size={9} /> Kumasi 🇬🇭
          </p>
          <p className="text-avs-accent mt-1 text-xs font-semibold">63 motifs · ⭐ 5.0</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS PATTERNS — motifs africains en CSS pur
// ─────────────────────────────────────────────────────────────────────────────
export function CssPatternsPreview() {
  const patterns = [
    { cls: 'avs-pattern-kente', label: 'Kente' },
    { cls: 'avs-pattern-ndop-royal', label: 'Ndop Royal' },
    { cls: 'avs-pattern-wax', label: 'Wax' },
    { cls: 'avs-pattern-wax-bold', label: 'Wax Bold' },
    { cls: 'avs-pattern-ndop', label: 'Ndop' },
    { cls: 'avs-pattern-kente', label: 'Kente Alt' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-6">
      {patterns.map(({ cls, label }) => (
        <div
          key={label}
          className="group rounded-avs-lg border-avs-accent/10 hover:shadow-avs cursor-pointer overflow-hidden border transition-all"
        >
          <div className={`${cls} h-20`} />
          <div className="bg-white px-2.5 py-2">
            <p className="text-avs-accent font-mono text-[9px] font-bold">{label}</p>
            <p className="text-avs-accent/35 mt-0.5 font-mono text-[8px]">.{cls}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT — notifications typées
// ─────────────────────────────────────────────────────────────────────────────
export function AlertPreview() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const alerts = [
    {
      id: 'info',
      icon: Info,
      bg: 'bg-avs-indigo/8 border-avs-indigo/30 text-avs-indigo',
      msg: 'Nouveau motif disponible dans la bibliothèque.',
    },
    {
      id: 'success',
      icon: Check,
      bg: 'bg-green-50 border-green-200 text-green-700',
      msg: 'Votre motif a été publié avec succès !',
    },
    {
      id: 'warning',
      icon: AlertCircle,
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      msg: "Validation en attente — un curateur va l'examiner.",
    },
    {
      id: 'error',
      icon: AlertCircle,
      bg: 'bg-red-50 border-red-200 text-red-600',
      msg: 'Erreur lors de la soumission. Réessayez.',
    },
  ];

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  return (
    <div className="space-y-2.5 p-6">
      {visible.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-avs-accent/40 mb-2 text-xs">Toutes les alertes ont été fermées.</p>
          <button
            onClick={() => setDismissed([])}
            className="text-avs-primary text-xs font-semibold underline-offset-4 hover:underline"
          >
            Réafficher
          </button>
        </div>
      )}
      {visible.map(({ id, icon: Icon, bg, msg }) => (
        <div key={id} className={`rounded-avs flex items-start gap-3 border px-3.5 py-3 ${bg}`}>
          <Icon size={14} className="mt-0.5 shrink-0" />
          <p className="flex-1 text-xs leading-snug font-medium">{msg}</p>
          <button
            onClick={() => setDismissed((d) => [...d, id])}
            className="shrink-0 text-sm leading-none text-current opacity-50 hover:opacity-100"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS — onglets Radix style AVS
// ─────────────────────────────────────────────────────────────────────────────
export function TabsPreview() {
  const [tab, setTab] = useState('motifs');

  const content: Record<string, React.ReactNode> = {
    motifs: (
      <div className="space-y-2">
        {['Ndop Bamoum', 'Kente Asante', 'Bogolan Malien'].map((n) => (
          <div
            key={n}
            className="rounded-avs border-avs-accent/8 flex items-center gap-3 border px-3 py-2.5"
          >
            <div className="avs-pattern-kente h-6 w-6 shrink-0 rounded-sm" />
            <span className="text-avs-accent text-xs font-semibold">{n}</span>
            <span className="text-avs-accent/40 ml-auto text-[9px]">PUBLIÉ</span>
          </div>
        ))}
      </div>
    ),
    couleurs: (
      <div className="flex flex-wrap gap-2">
        {['#C0573E', '#F5EBE0', '#1D1D1B', '#D4A017', '#4A6741', '#2A4A6B'].map((c) => (
          <div key={c} className="text-center">
            <div
              className="border-avs-accent/10 h-8 w-8 rounded-full border shadow-sm"
              style={{ backgroundColor: c }}
            />
            <p className="text-avs-accent/40 mt-1 font-mono text-[8px]">{c}</p>
          </div>
        ))}
      </div>
    ),
    artisans: (
      <div className="text-avs-accent/50 text-xs">312 artisans · 54 pays · 98% vérifiés</div>
    ),
  };

  return (
    <div className="p-5">
      {/* Variante bordure bas */}
      <div className="mb-5">
        <p className="text-avs-accent/35 mb-2 text-[10px] font-bold tracking-widest uppercase">
          Style bordure
        </p>
        <div className="border-avs-accent/10 mb-4 flex gap-0 border-b">
          {['motifs', 'couleurs', 'artisans'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-xs font-semibold capitalize transition-all ${tab === t ? 'border-avs-primary text-avs-primary' : 'text-avs-accent/50 hover:text-avs-accent border-transparent'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="min-h-[80px]">{content[tab]}</div>
      </div>

      {/* Variante pills */}
      <div>
        <p className="text-avs-accent/35 mb-2 text-[10px] font-bold tracking-widest uppercase">
          Style pills
        </p>
        <div className="rounded-avs-lg bg-avs-accent/5 flex gap-1 p-1">
          {['motifs', 'couleurs', 'artisans'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-avs flex-1 px-3 py-1.5 text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-avs-secondary text-avs-accent shadow-avs' : 'text-avs-accent/50 hover:text-avs-accent'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADER — spinners et skeletons
// ─────────────────────────────────────────────────────────────────────────────

// LOADER GRAINE DE CAFÉ (Ovale qui se divise puis s'unit)
export const CoffeeBeanLoader = () => (
  <motion.div
    className="relative h-10 w-8"
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  >
    <motion.div className="bg-avs-primary absolute top-0 left-0 h-10 w-4 rounded-l-full" />
    <motion.div className="bg-avs-accent absolute top-0 right-0 h-10 w-4 rounded-r-full" />
  </motion.div>
);

export const SeedLoader = ({ size = 80 }) => {
  const primary = '#C0573E';
  const accent = '#1D1D1B';

  return (
    <div style={{ width: size, height: size }}>
      <motion.svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Graine */}
        <motion.path
          d="M50 10 C25 10 10 40 10 60 C10 85 35 90 50 90 L50 10Z"
          stroke={accent}
          strokeWidth="2"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />

        <motion.path
          d="M50 10 C75 10 90 40 90 60 C90 85 65 90 50 90 L50 10Z"
          stroke={primary}
          strokeWidth="2"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2.4, delay: 0.4, repeat: Infinity }}
        />

        {/* Noyau */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill={primary}
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.svg>
    </div>
  );
};

// LOADER SOLEIL (Coucher/Lever - Un demi-cercle qui monte et descend)
export const SunLoader = () => (
  <motion.div className="relative h-8 w-16 overflow-hidden">
    <motion.div
      className="bg-avs-kente absolute bottom-0 h-16 w-16 rounded-full"
      animate={{ y: [0, -32, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.div>
);
export const SolarCycleLoader = () => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* Orbite */}
      <div className="border-avs-accent/30 absolute h-14 w-14 rounded-full border" />

      {/* Soleil */}
      <motion.div
        className="bg-avs-primary absolute h-4 w-4 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: '32px 32px',
        }}
      />
    </div>
  );
};
export const DrumPulseLoader = () => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* Cercle extérieur */}
      <div className="border-avs-primary/30 absolute h-14 w-14 rounded-full border-2" />

      {/* Pulsation */}
      <motion.div
        className="bg-avs-primary absolute h-10 w-10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Centre */}
      <div className="bg-avs-accent h-2 w-2 rounded-full" />
    </div>
  );
};
export const OrbitLoader = ({ size = 80 }) => {
  const primary = '#C0573E';

  return (
    <div style={{ width: size, height: size }}>
      <motion.svg viewBox="0 0 100 100">
        {/* Orbite */}
        <circle cx="50" cy="50" r="30" stroke={primary} strokeOpacity="0.2" fill="none" />

        {/* Satellite */}
        <motion.circle
          cx="50"
          cy="20"
          r="4"
          fill={primary}
          animate={{ rotate: 360 }}
          transform="rotate(0 50 50)"
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Centre */}
        <circle cx="50" cy="50" r="3" fill={primary} />
      </motion.svg>
    </div>
  );
};
export const WeaveLoader = () => {
  return (
    <div className="grid h-12 w-12 grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-avs-primary"
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export function LoaderPreview() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <p className="text-avs-accent/35 mb-6 text-[10px] font-bold tracking-widest uppercase">
          Loaders Signature BUNI
        </p>
        <div className="flex flex-wrap items-end gap-12">
          {/* Graine de Café (La Graine Buni) */}
          <div className="flex flex-col items-center gap-3">
            <CoffeeBeanLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Graine Buni</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <SeedLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Graine Buni</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <SolarCycleLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Graine Buni</span>
          </div>

          {/* Cycle Solaire */}
          <div className="flex flex-col items-center gap-3">
            <SunLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Cycle Solaire</span>
          </div>

          {/* Rythme Tam-Tam */}
          <div className="flex flex-col items-center gap-3">
            <TamTamLoaderPreview />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Tam-Tam</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <DrumPulseLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Tam-Tam</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <WeaveLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Tam-Tam</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <OrbitLoader />
            <span className="text-avs-accent/40 text-[9px] font-bold uppercase">Orbite</span>
          </div>
        </div>
      </div>

      {/* Skeletons avec textures culturelles */}
      <div>
        <p className="text-avs-accent/35 mb-4 text-[10px] font-bold tracking-widest uppercase">
          Skeletons Premium
        </p>
        <div className="avs-card w-64 p-4 opacity-50">
          <div className="avs-pattern-ndop rounded-avs h-28 animate-pulse" />
          <div className="mt-4 space-y-2">
            <div className="bg-avs-accent/10 rounded-avs h-3 w-full animate-pulse" />
            <div className="bg-avs-accent/10 rounded-avs h-3 w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAM TAM — effets de percussion
// ─────────────────────────────────────────────────────────────────────────────
export const TamTamLoaderPreview = () => {
  // Définition des hauteurs pour créer une courbe rythmique
  const bars = [25, 45, 65, 80, 65, 45, 25];

  return (
    <div className="flex h-16 items-end justify-center gap-1.5">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="rounded-avs bg-avs-primary w-3"
          initial={{ height: '20%' }}
          animate={{ height: [`${height}%`, '20%', `${height}%`] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1, // L'effet "vague" de percussion
            ease: [0.22, 1, 0.36, 1], // Courbe "organique"
          }}
        />
      ))}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────
// TOAST / NOTIFICATION — système de notifications
// ─────────────────────────────────────────────────────────────────────────────
export function ToastPreview() {
  const [toasts, setToasts] = useState<{ id: string; type: string; msg: string }[]>([]);
  const idRef = useRef(0);

  const addToast = (type: string, msg: string) => {
    const id = (++idRef.current).toString();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const config: Record<string, { css: string; icon: string }> = {
    success: { css: 'bg-green-50 border-green-200 text-green-700', icon: '✓' },
    error: { css: 'bg-red-50 border-red-200 text-red-600', icon: '✕' },
    info: { css: 'bg-avs-indigo/8 border-avs-indigo/30 text-avs-indigo', icon: 'ℹ' },
    kente: { css: 'bg-avs-kente/12 border-avs-kente/30 text-avs-kente', icon: '✦' },
  };

  return (
    <div className="space-y-5 p-8">
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Déclencher un toast
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'success', msg: 'Motif publié avec succès !' },
            { type: 'error', msg: 'Erreur de soumission.' },
            { type: 'info', msg: 'Nouveau motif disponible.' },
            { type: 'kente', msg: '✦ Motif mis en vedette !' },
          ].map(({ type, msg }) => (
            <button
              key={type}
              onClick={() => addToast(type, msg)}
              className={`rounded-avs border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${config[type]?.css}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de toasts */}
      <div className="rounded-avs-lg border-avs-accent/15 bg-avs-accent/3 relative min-h-[80px] overflow-hidden border border-dashed p-3">
        <p className="text-avs-accent/30 mb-2 text-[9px] tracking-wider uppercase">
          Zone de notifications
        </p>
        <div className="space-y-2">
          {toasts.map(({ id, type, msg }) => {
            const { css, icon } = config[type] ?? config['info']!;
            return (
              <div
                key={id}
                className={`rounded-avs animate-fade-up flex items-center gap-2 border px-3 py-2 text-xs font-medium ${css}`}
              >
                <span className="font-bold">{icon}</span>
                {msg}
                <button
                  onClick={() => setToasts((t) => t.filter((x) => x.id !== id))}
                  className="ml-auto opacity-50 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })}
          {toasts.length === 0 && (
            <p className="text-avs-accent/25 py-4 text-center text-[10px]">
              Cliquez sur un bouton pour voir un toast
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCORDION — sections repliables
// ─────────────────────────────────────────────────────────────────────────────
export function AccordionPreview() {
  const [open, setOpen] = useState<string | null>('q1');

  const items = [
    {
      id: 'q1',
      q: "Qu'est-ce que le standard AVS ?",
      a: 'AVS (African Visual Standard) est une bibliothèque open-source de composants, motifs et tokens de design inspirés du patrimoine visuel africain.',
    },
    {
      id: 'q2',
      q: "Ai-je besoin d'un compte pour utiliser les ressources ?",
      a: 'Non. Tous les composants, motifs et templates sont accessibles librement. Le compte est optionnel — il sert uniquement pour contribuer.',
    },
    {
      id: 'q3',
      q: 'Puis-je utiliser AVS dans des projets commerciaux ?',
      a: 'Oui. La majorité des ressources est sous licence CC BY 4.0. Mentionnez AVS dans vos crédits.',
    },
    {
      id: 'q4',
      q: 'Comment ajouter mes propres motifs SVG ?',
      a: 'Placez vos SVG dans public/patterns/, déclarez-les dans svg-patterns.ts, et utilisez le composant SvgPattern partout dans votre app.',
    },
  ];

  return (
    <div className="space-y-2 p-6">
      {items.map(({ id, q, a }) => (
        <div key={id} className="rounded-avs border-avs-accent/12 overflow-hidden border">
          <button
            onClick={() => setOpen(open === id ? null : id)}
            className="hover:bg-avs-primary/5 flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors"
            aria-expanded={open === id}
          >
            <span className="text-avs-accent pr-4 text-sm font-semibold">{q}</span>
            <span
              className={`text-avs-primary shrink-0 text-lg leading-none font-bold transition-transform ${open === id ? 'rotate-45' : ''}`}
            >
              +
            </span>
          </button>
          {open === id && (
            <div className="border-avs-accent/8 bg-avs-accent/3 border-t px-4 py-3">
              <p className="text-avs-accent/65 text-xs leading-relaxed">{a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE / SWITCH
// ─────────────────────────────────────────────────────────────────────────────
export function TogglePreview() {
  const [states, setStates] = useState({
    notifications: true,
    darkMode: false,
    newsletter: false,
    twofa: true,
  });

  const toggle = (key: keyof typeof states) => setStates((s) => ({ ...s, [key]: !s[key] }));

  const rows = [
    {
      key: 'notifications' as const,
      label: 'Notifications email',
      desc: 'Recevoir les alertes par email',
    },
    { key: 'darkMode' as const, label: 'Mode sombre', desc: 'Interface en thème sombre' },
    { key: 'newsletter' as const, label: 'Newsletter AVS', desc: 'Actualités et nouveautés' },
    { key: 'twofa' as const, label: 'Double authentification', desc: 'Sécurité renforcée (2FA)' },
  ];

  return (
    <div className="space-y-1 p-6">
      {rows.map(({ key, label, desc }) => (
        <div
          key={key}
          className="border-avs-accent/8 flex items-center justify-between border-b py-3 last:border-0"
        >
          <div>
            <p className="text-avs-accent text-sm font-semibold">{label}</p>
            <p className="text-avs-accent/45 mt-0.5 text-xs">{desc}</p>
          </div>
          <button
            role="switch"
            aria-checked={states[key]}
            aria-label={label}
            onClick={() => toggle(key)}
            className={`focus-visible:ring-avs-primary relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${states[key] ? 'bg-avs-primary' : 'bg-avs-accent/20'}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${states[key] ? 'translate-x-[18px]' : 'translate-x-1'}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR — avatars avec motifs africains
// ─────────────────────────────────────────────────────────────────────────────
export function AvatarPreview() {
  const avatars = [
    { name: 'Njoya H.', css: 'avs-pattern-ndop-royal', size: 'h-8 w-8', badge: 'curator' },
    { name: 'Ama A.', css: 'avs-pattern-kente', size: 'h-10 w-10', badge: 'top' },
    { name: 'Fatoumata C.', css: 'avs-pattern-wax-bold', size: 'h-12 w-12', badge: null },
    { name: 'Jean-Paul K.', css: 'avs-pattern-ndop', size: 'h-14 w-14', badge: 'admin' },
  ];

  const badgeCss: Record<string, string> = {
    curator: 'bg-avs-kente text-avs-accent',
    top: 'bg-avs-primary text-avs-secondary',
    admin: 'bg-avs-accent text-avs-secondary',
  };

  return (
    <div className="space-y-8 p-8">
      {/* Tailles */}
      <div>
        <p className="text-avs-accent/35 mb-4 text-[10px] font-bold tracking-widest uppercase">
          Tailles avec motifs
        </p>
        <div className="flex flex-wrap items-end gap-4">
          {avatars.map(({ name, css, size, badge }) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div
                className={`${css} ${size} border-avs-secondary shadow-avs relative flex items-center justify-center overflow-hidden rounded-full border-2`}
              >
                <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                  {name.charAt(0)}
                </span>
                {badge && (
                  <div
                    className={`border-avs-secondary absolute -right-0.5 -bottom-0.5 rounded-full border px-1 text-[7px] font-black ${badgeCss[badge]}`}
                  >
                    {badge === 'admin' ? '★' : badge === 'top' ? '✦' : '✓'}
                  </div>
                )}
              </div>
              <p className="text-avs-accent/40 max-w-[60px] text-center text-[9px] leading-tight">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Groupe empilé */}
      <div>
        <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-widest uppercase">
          Groupe empilé
        </p>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              'avs-pattern-kente',
              'avs-pattern-ndop-royal',
              'avs-pattern-wax',
              'avs-pattern-wax-bold',
              'avs-pattern-ndop',
            ].map((css, i) => (
              <div
                key={i}
                className={`${css} border-avs-secondary flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2`}
              >
                <span className="font-display text-avs-secondary text-xs font-black drop-shadow">
                  {['N', 'A', 'F', 'S', 'K'][i]}
                </span>
              </div>
            ))}
            <div className="border-avs-secondary bg-avs-accent text-avs-secondary flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold">
              +5
            </div>
          </div>
          <p className="text-avs-accent/55 text-xs">312 artisans contribuent</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR SWATCH — palette interactive
// ─────────────────────────────────────────────────────────────────────────────
export function ColorSwatchPreview() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  const palette = [
    { name: 'Primary', hex: '#C0573E', label: 'Terre brûlée' },
    { name: 'Secondary', hex: '#F5EBE0', label: 'Lin naturel' },
    { name: 'Accent', hex: '#1D1D1B', label: 'Obsidienne' },
    { name: 'Kente', hex: '#D4A017', label: 'Or kente' },
    { name: 'Ndop', hex: '#4A6741', label: 'Vert Bamiléké' },
    { name: 'Indigo', hex: '#2A4A6B', label: 'Bleu bogolan' },
  ];

  return (
    <div className="p-6">
      <p className="text-avs-accent/35 mb-4 text-[10px] font-bold tracking-widest uppercase">
        Cliquez sur une couleur pour copier le HEX
      </p>
      <div className="grid grid-cols-3 gap-3">
        {palette.map(({ name, hex, label }) => {
          const isLight = parseInt(hex.slice(1), 16) > 0xaaaaaa;
          return (
            <button
              key={hex}
              onClick={() => void copy(hex)}
              className="group rounded-avs-lg border-avs-accent/10 shadow-avs hover:shadow-avs-md overflow-hidden border text-left transition-all hover:-translate-y-0.5"
            >
              <div
                className="relative flex h-12 items-center justify-center"
                style={{ backgroundColor: hex }}
              >
                <span
                  className={`text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100 ${isLight ? 'text-avs-accent' : 'text-white'}`}
                >
                  {copiedColor === hex ? '✓ Copié' : 'Copier'}
                </span>
              </div>
              <div className="bg-white p-2">
                <p className="text-avs-accent/45 font-mono text-[9px]">{hex}</p>
                <p className="text-avs-accent text-[10px] font-semibold">{label}</p>
                <p className="text-avs-accent/30 font-mono text-[8px]">avs-{name.toLowerCase()}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
