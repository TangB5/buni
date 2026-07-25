'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Eye, Sparkles, ArrowRight, User, Calendar, Shield, CheckCircle2,
  AlertCircle, Layers, Star,
} from 'lucide-react';
import { useAuth } from '@buni/auth';
import { formatDate } from '@buni/utils';
import { Route } from 'next';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-avs-accent/6 animate-pulse ${className}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE STRIP
// ─────────────────────────────────────────────────────────────────────────────

function ProfileStrip({ user, avatarPattern }: { user: any; avatarPattern: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-avs-accent/8 bg-avs-secondary overflow-hidden"
    >
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <div className={`${avatarPattern} h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-avs-accent/10`} aria-hidden />
          <div>
            <p className="text-[14px] font-bold text-avs-accent">{user?.name ?? '—'}</p>
            <p className="text-[11px] text-avs-accent/40">{user?.email ?? '—'}</p>
          </div>
          {/* Role badge */}
          <span className="ml-1 hidden rounded-full border border-avs-primary/25 bg-avs-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widset text-avs-primary sm:inline-flex">
            Explorateur
          </span>
          {/* Verification badge */}
          {user?.verified ? (
            <span className="ml-1 hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widset text-emerald-500">
              <CheckCircle2 size={10} aria-hidden /> Vérifié
            </span>
          ) : (
            <span className="ml-1 hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widset text-amber-500">
              <AlertCircle size={10} aria-hidden /> Non vérifié
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6 text-[11px]">
          {user?.createdAt && (
            <div>
              <p className="font-mono uppercase tracking-widset text-avs-accent/30">Membre depuis</p>
              <p className="mt-0.5 font-semibold text-avs-accent">
                {formatDate(user.createdAt)}
              </p>
            </div>
          )}
          <Link
            href={'/profile' as Route}
            className="group flex items-center gap-1.5 rounded-lg border border-avs-accent/12 px-3.5 py-2 text-[12px] font-semibold text-avs-accent/50 transition-all duration-200 hover:border-avs-primary/35 hover:text-avs-primary"
          >
            <User size={12} aria-hidden />
            Profil
            <ArrowRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO CARD - Become Curator
// ─────────────────────────────────────────────────────────────────────────────

function BecomeCuratorCard({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-avs-accent"
    >
      {/* Fond pattern à 8% */}
      <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.08]" aria-hidden />

      {/* Dégradé sombre directionnel */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(110deg, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.55) 55%, transparent 100%)' }}
        aria-hidden
      />

      {/* Cercles décoratifs géométriques */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-avs-secondary/5" aria-hidden />
      <div className="pointer-events-none absolute -right-8  -top-8  h-40 w-40 rounded-full border border-avs-secondary/8" aria-hidden />

      <div className="relative flex flex-col gap-6 px-8 py-8 sm:flex-row sm:items-center sm:justify-between">
        {/* Texte */}
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-avs-primary/30 bg-avs-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-avs-primary">
            <Sparkles size={8} aria-hidden /> Devenez Curateur
          </span>
          <h2 className="font-display mt-3 text-2xl font-black leading-snug text-avs-secondary sm:text-3xl">
            Partagez votre expertise.{' '}
            <span className="text-avs-primary">Contribuez à l'encyclopédie.</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-avs-secondary/45">
            Les curateurs peuvent soumettre des motifs, gérer des collections et participer à la validation des contributions.
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            onClick={onOpenModal}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-avs-primary px-6 py-3 text-sm font-bold text-avs-secondary shadow-lg shadow-avs-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-avs-primary/35"
          >
            Devenir Curateur
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </button>
          <Link
            href={'/patterns' as Route}
            className="inline-flex items-center gap-2 rounded-xl border border-avs-secondary/15 px-6 py-3 text-sm font-semibold text-avs-secondary/55 transition-all duration-200 hover:border-avs-secondary/30 hover:text-avs-secondary/90"
          >
            <Eye size={14} aria-hidden /> Explorer
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

interface ViewerDashboardProps {
  onOpenCuratorModal: () => void;
}

export default function ViewerDashboard({ onOpenCuratorModal }: ViewerDashboardProps) {
  const { user } = useAuth();

  const avatarPattern = 'avs-pattern-adinkra-sankofa';

  return (
    <div className="min-h-screen bg-avs-secondary">
      <div className="mx-auto max-w-7xl space-y-5 px-5 py-7 lg:px-8">

        {/* ══ 1. PROFILE STRIP ══════════════════════════════════════════ */}
        <ProfileStrip user={user} avatarPattern={avatarPattern} />

        {/* ══ 2. BECOME CURATOR HERO ════════════════════════════════════ */}
        <BecomeCuratorCard onOpenModal={onOpenCuratorModal} />

        {/* ══ 4. EXPLORATION QUICK ACTIONS ═══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Actions rapides"
        >
          <div className="rounded-2xl border border-avs-accent/8 bg-avs-secondary overflow-hidden">
            <div className="flex items-center justify-between border-b border-avs-accent/8 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="avs-pattern-kuba-kasai h-5 w-5 overflow-hidden rounded-md opacity-90" aria-hidden />
                <h3 className="text-[13px] font-bold text-avs-accent">Explorer la plateforme</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              <Link
                href="/patterns"
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 border border-avs-accent/8 bg-avs-secondary text-avs-accent hover:border-avs-accent/18"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 bg-avs-accent/6 group-hover:bg-avs-primary/10">
                  <Layers size={15} aria-hidden />
                </div>
                <div className="relative">
                  <p className="text-[13px] font-bold leading-tight">Bibliothèque</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-avs-accent/40">Explorer les motifs</p>
                </div>
              </Link>
              <Link
                href="/colors"
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 border border-avs-accent/8 bg-avs-secondary text-avs-accent hover:border-avs-accent/18"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 bg-avs-accent/6 group-hover:bg-avs-primary/10">
                  <Star size={15} aria-hidden />
                </div>
                <div className="relative">
                  <p className="text-[13px] font-bold leading-tight">Palettes</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-avs-accent/40">Couleurs & thèmes</p>
                </div>
              </Link>
              <Link
                href="/profile"
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 border border-avs-accent/8 bg-avs-secondary text-avs-accent hover:border-avs-accent/18"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 bg-avs-accent/6 group-hover:bg-avs-primary/10">
                  <User size={15} aria-hidden />
                </div>
                <div className="relative">
                  <p className="text-[13px] font-bold leading-tight">Mon profil</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-avs-accent/40">Gérer le compte</p>
                </div>
              </Link>
              <button
                onClick={onOpenCuratorModal}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 bg-avs-primary text-avs-secondary shadow-lg shadow-avs-primary/20 hover:shadow-xl hover:shadow-avs-primary/28"
              >
                <div className="avs-pattern-kente-royale pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 bg-avs-secondary/15">
                  <Sparkles size={15} aria-hidden />
                </div>
                <div className="relative">
                  <p className="text-[13px] font-bold leading-tight">Curateur</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-avs-secondary/50">Devenir contributeur</p>
                </div>
              </button>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
