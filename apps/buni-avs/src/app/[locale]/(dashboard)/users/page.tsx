'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, ShieldCheck, ShieldAlert, Search, Filter, LayoutGrid, Table, Users2, UserCheck, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '@buni/auth';
import { userService } from '@/features/user/services/user.service';
import { formatNumber } from '@buni/utils';

type ViewMode = 'table' | 'grid';

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-avs-accent/6 animate-pulse ${className}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setValue(Math.round(target * progress));
      if (frame >= totalFrames) { setValue(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-avs-accent/8 bg-avs-secondary overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function PanelHeader({ title, patternCss }: { title: string; patternCss: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-avs-accent/8 px-5 py-4">
      <div className={`${patternCss} h-5 w-5 overflow-hidden rounded-md opacity-90`} aria-hidden />
      <h3 className="text-[13px] font-bold text-avs-accent">{title}</h3>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  patternCss: string;
  delay: number;
}

function KpiCard({ label, value, icon: Icon, color, patternCss, delay }: KpiCardProps) {
  const count = useCounter(value);
  const pct = Math.min(100, (value / (value * 1.35)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-5 rounded-2xl border border-avs-accent/8 bg-avs-secondary p-6 hover:border-avs-accent/18 transition-colors duration-300"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-avs-accent/40">{label}</p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}14` }}
        >
          <Icon size={16} style={{ color }} aria-hidden />
        </div>
      </div>

      <div>
        <p
          className="font-display text-4xl font-black tabular-nums leading-none text-avs-accent"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatNumber(count)}
        </p>
      </div>

      <div className="h-0.5 w-full overflow-hidden rounded-full bg-avs-accent/6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>

      <div
        className={`${patternCss} pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-br-2xl opacity-[0.07]`}
        aria-hidden
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG — couleurs alignées sur le design system AVS
// Classes utilisées : bg-avs-kente/10 text-avs-kente border-avs-kente/20, idem pour
// avs-indigo, avs-earth, avs-accent — doivent être dans le safelist Tailwind.
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin',  icon: ShieldAlert, color: 'avs-kente'  },
  admin:       { label: 'Admin',        icon: ShieldAlert, color: 'avs-kente'  },
  curator:     { label: 'Curateur',     icon: ShieldCheck, color: 'avs-indigo' },
  contributor: { label: 'Curateur',     icon: ShieldCheck, color: 'avs-indigo' },
  viewer:      { label: 'Visiteur',     icon: Shield,      color: 'avs-accent' },
} as const;

function RoleBadge({ role }: { role: string }) {
  const normalizedRole = role?.toLowerCase() || 'viewer';
  const cfg = ROLE_CONFIG[normalizedRole as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.viewer;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-${cfg.color}/10 text-${cfg.color} border-${cfg.color}/25`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="bg-avs-ndop/10 text-avs-ndop border-avs-ndop/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold">
      <ShieldCheck size={12} />
      Vérifié
    </span>
  ) : (
    <span className="bg-avs-golden/10 text-avs-golden border-avs-golden/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold">
      <ShieldAlert size={12} />
      Non vérifié
    </span>
  );
}

function Avatar({ name, email }: { name?: string | null; email: string }) {
  const initial = (name?.charAt(0) || email.charAt(0)).toUpperCase();
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-avs-secondary"
      style={{ background: 'linear-gradient(135deg, #C0573E 0%, #D4A017 100%)' }}
    >
      {initial}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function UsersManagementPage() {
  const { user: currentUser, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', { search: searchTerm, role: roleFilter }],
    queryFn: () => userService.getAllUsers({ search: searchTerm, role: roleFilter === 'all' ? undefined : roleFilter }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => userService.updateUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du rôle:', error);
    },
  });

  const toggleVerificationMutation = useMutation({
    mutationFn: ({ userId, verified }: { userId: string; verified: boolean }) => userService.toggleUserVerification(userId, verified),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const userRole = user.role?.toLowerCase() || 'viewer';
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'contributor' && (userRole === 'curator' || userRole === 'contributor')) ||
      userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.verified).length,
    admins: users.filter((u) => u.role.toLowerCase() === 'admin' || u.role.toLowerCase() === 'super_admin').length,
    newThisMonth: users.filter((u) => {
      const createdAt = new Date(u.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
  };

  // Chargement de la session — état visible plutôt qu'un return vide
  if (!currentUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-avs-accent/10 border-t-avs-primary" />
      </div>
    );
  }

  const role = currentUser.role.toLowerCase();

  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-avs-golden/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <ShieldAlert className="text-avs-golden h-8 w-8" />
          </div>
          <h2 className="font-display text-avs-accent text-xl font-bold">Accès refusé</h2>
          <p className="text-avs-accent/50 mt-2 text-sm">Seuls les administrateurs peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const kpiCards: KpiCardProps[] = [
    {
      label: 'Total utilisateurs', value: stats.total, icon: Users2, color: '#C0573E', patternCss: 'avs-pattern-kente-royale', delay: 0.1,
    },
    {
      label: 'Vérifiés', value: stats.verified, icon: UserCheck, color: '#4F7CFF', patternCss: 'avs-pattern-ndop-sultan', delay: 0.17,
    },
    {
      label: 'Administrateurs', value: stats.admins, icon: ShieldAlert, color: '#8B5CF6', patternCss: 'avs-pattern-bogolan-fanga', delay: 0.24,
    },
    {
      label: 'Nouveaux ce mois', value: stats.newThisMonth, icon: TrendingUp, color: '#F59E0B', patternCss: 'avs-pattern-adinkra-sankofa', delay: 0.31,
    },
  ];

  return (
    <div className="min-h-screen bg-avs-secondary">
      <div className="mx-auto max-w-7xl space-y-5 px-5 py-7 lg:px-8">
        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary px-5 py-6 sm:px-7 sm:py-7"
        >
          <div className="avs-pattern-wax-dakar absolute inset-0 opacity-[0.03]" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-avs-primary">Administration</span>
              </div>
              <h1 className="font-display text-2xl font-black leading-none text-avs-accent sm:text-3xl" style={{ letterSpacing: '-0.02em' }}>
                Gestion des utilisateurs
              </h1>
              <p className="mt-1.5 text-sm text-avs-accent/50">Gérer les utilisateurs, les rôles et les vérifications</p>
            </div>

            <div className="flex items-center gap-1 self-start rounded-xl border border-avs-accent/9 bg-avs-secondary p-1 sm:self-auto">
              <button
                onClick={() => setViewMode('table')}
                aria-label="Vue tableau"
                className={`rounded-lg p-2 transition-colors ${viewMode === 'table' ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/35 hover:text-avs-accent'}`}
              >
                <Table size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Vue grille"
                className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/35 hover:text-avs-accent'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ══ STATS ═══════════════════════════════════════════════════════ */}
        <section aria-label="Statistiques clés">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-avs-accent/8 bg-avs-secondary p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-9 w-9 rounded-xl" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-0.5 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiCards.map((card) => <KpiCard key={card.label} {...card} />)}
            </div>
          )}
        </section>

        {/* ══ FILTRES ═════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 rounded-2xl border border-avs-accent/9 bg-avs-secondary p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-avs-accent/30" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-avs-accent/12 bg-avs-secondary py-2.5 pl-10 pr-4 text-sm text-avs-accent outline-none transition-all placeholder:text-avs-accent/30 focus:border-avs-primary/40 focus:ring-2 focus:ring-avs-primary/10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-avs-accent/30" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-avs-accent/12 bg-avs-secondary px-3.5 py-2.5 text-sm font-medium text-avs-accent outline-none transition-all focus:border-avs-primary/40 focus:ring-2 focus:ring-avs-primary/10"
              >
                <option value="all">Tous les rôles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="curator">Curateur</option>
                <option value="contributor">Curateur</option>
                <option value="viewer">Visiteur</option>
              </select>
            </div>
            <div className="whitespace-nowrap font-mono text-[11px] text-avs-accent/40">
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* ══ CONTENU ═════════════════════════════════════════════════════ */}
        {isLoading ? (
          <Panel>
            <div className="divide-y divide-avs-accent/6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-2 w-20" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          </Panel>
        ) : filteredUsers.length === 0 ? (
          <Panel>
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="avs-pattern-wax-dakar h-12 w-12 rounded-full ring-1 ring-avs-accent/10 opacity-40" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-avs-accent/40">Aucun utilisateur trouvé</p>
                <p className="mt-0.5 text-xs text-avs-accent/30">Essayez d'ajuster vos filtres de recherche</p>
              </div>
            </div>
          </Panel>
        ) : viewMode === 'table' ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Panel>
              <PanelHeader title="Liste des utilisateurs" patternCss="avs-pattern-kente-royale" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead className="border-b border-avs-accent/9 bg-avs-accent/[0.02]">
                    <tr>
                      {['Utilisateur', 'Statut', 'Membre depuis', 'Rôle'].map((h, i) => (
                        <th
                          key={h || i}
                          className={`px-5 py-3.5 font-mono text-[9px] font-bold uppercase tracking-wider text-avs-accent/40 ${i === 3 ? 'text-right' : 'text-left'}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-avs-accent/6">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
                        className="transition-colors hover:bg-avs-primary/[0.02]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} email={user.email} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-avs-accent">{user.name || 'Non renseigné'}</p>
                              <p className="truncate text-xs text-avs-accent/45">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><VerifiedBadge verified={user.verified} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-avs-accent/45">
                            <Clock size={13} />
                            {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={user.role?.toLowerCase() || 'viewer'}
                              onChange={(e) => updateRoleMutation.mutate({ userId: user.id, role: e.target.value })}
                              disabled={user.id === currentUser.id || updateRoleMutation.isPending}
                              className="rounded-lg border border-avs-accent/12 bg-avs-secondary px-2.5 py-2 text-xs font-medium text-avs-accent outline-none transition-all focus:border-avs-primary/40 focus:ring-2 focus:ring-avs-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <option value="viewer">Visiteur</option>
                              <option value="curator">Curateur</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => toggleVerificationMutation.mutate({ userId: user.id, verified: !user.verified })}
                              disabled={toggleVerificationMutation.isPending}
                              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:opacity-40 ${
                                user.verified
                                  ? 'border border-avs-golden/25 bg-avs-golden/10 text-avs-golden hover:bg-avs-golden/15'
                                  : 'border border-avs-ndop/25 bg-avs-ndop/10 text-avs-ndop hover:bg-avs-ndop/15'
                              }`}
                            >
                              {user.verified ? 'Révoquer' : 'Vérifier'}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 transition-all hover:-translate-y-0.5 hover:border-avs-primary/20"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={user.name} email={user.email} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-avs-accent">{user.name || 'Non renseigné'}</p>
                      <p className="truncate text-xs text-avs-accent/45">{user.email}</p>
                    </div>
                  </div>
                  <div className="shrink-0"><VerifiedBadge verified={user.verified} /></div>
                </div>

                <div className="mb-4 flex items-center gap-1.5 text-xs text-avs-accent/45">
                  <Clock size={13} />
                  Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-avs-accent/8 pt-4">
                  <select
                    value={user.role?.toLowerCase() || 'viewer'}
                    onChange={(e) => updateRoleMutation.mutate({ userId: user.id, role: e.target.value })}
                    disabled={user.id === currentUser.id || updateRoleMutation.isPending}
                    className="rounded-lg border border-avs-accent/12 bg-avs-secondary px-2.5 py-2 text-xs font-medium text-avs-accent outline-none transition-all focus:border-avs-primary/40 focus:ring-2 focus:ring-avs-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <option value="viewer">Visiteur</option>
                    <option value="curator">Curateur</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => toggleVerificationMutation.mutate({ userId: user.id, verified: !user.verified })}
                    disabled={toggleVerificationMutation.isPending}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:opacity-40 ${
                      user.verified
                        ? 'border border-avs-golden/25 bg-avs-golden/10 text-avs-golden hover:bg-avs-golden/15'
                        : 'border border-avs-ndop/25 bg-avs-ndop/10 text-avs-ndop hover:bg-avs-ndop/15'
                    }`}
                  >
                    {user.verified ? 'Révoquer' : 'Vérifier'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}