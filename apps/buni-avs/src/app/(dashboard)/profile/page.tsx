'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Save, Loader2, CheckCircle2, MapPin, Globe,
  ArrowLeft, AlertCircle, User, Layers, Eye, Calendar, LogOut,
} from 'lucide-react';
import { useAuth, useLogout } from '@buni/auth';
import { z } from 'zod';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  name:      z.string().min(2, 'Minimum 2 caractères').max(64),
  bio:       z.string().max(280).optional(),
  location:  z.string().max(64).optional(),
  website:   z.string().url('URL invalide').optional().or(z.literal('')),
  github:    z.string().max(39).optional(),
  twitter:   z.string().max(15).optional(),
  specialty: z.string().max(64).optional(),
});
type ProfileForm = z.infer<typeof ProfileSchema>;
type FieldErrors = Partial<Record<keyof ProfileForm, string>>;

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES — only what Tailwind can't express
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.35) !important; opacity: 1; }
  .dark ::placeholder { color: rgba(236,232,225,0.30) !important; }

  .prf-input {
    width: 100%;
    background: var(--avs-secondary);
    color: var(--avs-accent);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    padding: 0.6875rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
    resize: none;
  }
  .prf-input:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }

  .prf-input-icon {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--avs-secondary);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    padding-left: 0.875rem;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .prf-input-icon:focus-within {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }
  .prf-input-icon input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--avs-accent);
    font-size: 0.875rem;
    padding: 0.6875rem 1rem 0.6875rem 0;
    font-family: inherit;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; accentClass: string; pattern: string }> = {
  admin:       { label: 'Administrateur', color: '#C0573E', accentClass: 'text-avs-primary', pattern: 'avs-pattern-ndop-sultan'     },
  curator:     { label: 'Curateur',       color: '#D4A017', accentClass: 'text-avs-kente',   pattern: 'avs-pattern-kente-royale'   },
  contributor: { label: 'Contributeur',   color: '#4A6741', accentClass: 'text-avs-ndop',    pattern: 'avs-pattern-bogolan-fanga'  },
  viewer:      { label: 'Explorateur',    color: '#2A4A6B', accentClass: 'text-avs-indigo',  pattern: 'avs-pattern-adinkra-sankofa'},
};

const TABS = [
  { id: 'infos',  label: 'Informations',    icon: User    },
  { id: 'social', label: 'Réseaux sociaux', icon: Globe   },
  { id: 'stats',  label: 'Statistiques',    icon: Layers  },
] as const;
type TabId = typeof TABS[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/35">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-[11px] leading-snug text-avs-accent/35">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs font-medium text-red-500"
          >
            <AlertCircle size={11} aria-hidden />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: typeof Layers; color: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-0.5"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}35`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: color }} aria-hidden />
      {/* Glow */}
      <div
        className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${color}25` }}
        aria-hidden
      />
      <div className="relative">
        <div
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${color}12`, color }}
        >
          <Icon size={16} aria-hidden />
        </div>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/35">{label}</p>
        <p className="font-display mt-2 text-3xl font-black leading-none text-avs-accent" style={{ letterSpacing: '-0.025em' }}>{value}</p>
        <p className="mt-1.5 text-[11px] text-avs-accent/35">{sub}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL INPUT ROW
// ─────────────────────────────────────────────────────────────────────────────

function SocialRow({ icon, platform, prefix, value, onChange, maxLength, placeholder }: {
  icon: React.ReactNode; platform: string; prefix?: string;
  value: string; onChange: (v: string) => void;
  maxLength?: number; placeholder?: string;
}) {
  return (
    <Field label={platform}>
      <div className="prf-input-icon">
        <span className="text-avs-accent/30 shrink-0">{icon}</span>
        {prefix && <span className="font-mono text-sm text-avs-accent/35 shrink-0">{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'username'}
          maxLength={maxLength}
        />
      </div>
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const logout = useLogout();

  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || '', bio: '', location: '', website: '',
    github: '', twitter: '', specialty: '',
  });
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('infos');

  // Hydration guard
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-avs-secondary">
        <div className="flex flex-col items-center gap-4">
          <div className="avs-pattern-kente-royale h-12 w-12 animate-spin rounded-full opacity-70" style={{ animationDuration: '2s' }} />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse text-avs-accent/35">
            Chargement du profil…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) redirect('/auth/login');

  const roleKey = (user?.role || 'viewer').toLowerCase();
  const role    = ROLE_CONFIG[roleKey] ?? ROLE_CONFIG['viewer']!;
  const set     = (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    const result = ProfileSchema.safeParse(form);
    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((e) => { if (e.path[0]) fe[e.path[0] as keyof ProfileForm] = e.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="min-h-screen bg-avs-secondary-dark">

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 bg-avs-secondary border-b border-avs-accent/9 backdrop-blur-xl">
          <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />

          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-avs-accent/16 text-avs-accent/55 hover:text-avs-accent transition-all duration-150"
                title="Retour au tableau de bord"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', letterSpacing: '-0.02em' }}>
                  Mon Profil
                </h1>
                <p className="mt-0.5 text-xs text-avs-accent/35">Gérer vos informations publiques</p>
              </div>
            </div>

            {/* Save button */}
            <motion.button
              onClick={() => void save()}
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-avs-secondary transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${saved ? 'bg-emerald-500 shadow-emerald-500/25' : 'bg-avs-primary shadow-avs-md'}`}
              aria-busy={saving}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.span
                  key={saving ? 'saving' : saved ? 'saved' : 'idle'}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Sauvegarde…</>
                  : saved  ? <><CheckCircle2 size={13} /> Sauvegardé !</>
                  :          <><Save size={13} /> Enregistrer</>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

          {/* ══ AVATAR & IDENTITY CARD ══════════════════════════════════════ */}
          <section className="overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary">
            {/* Pattern banner */}
            <div className={`${role.pattern} relative h-28 overflow-hidden`}>
              {/* Multi-stop gradient — justified inline */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.85) 0%, rgba(26,18,8,0.70) 100%)' }} />
              {/* Dynamic halo — justified inline: role.color not known at build time */}
              <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 80% at 15% 50%, ${role.color}18 0%, transparent 65%)` }} aria-hidden />
            </div>

            <div className="relative -mt-14 px-6 pb-6">
              <div className="flex flex-wrap items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className={`${role.pattern} relative h-24 w-24 overflow-hidden rounded-2xl ring-[3px] ring-avs-secondary shadow-avs-md`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="font-display text-3xl font-black text-avs-secondary drop-shadow-lg">
                        {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-avs-secondary" aria-label="En ligne" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', letterSpacing: '-0.02em' }}>
                      {user?.name}
                    </h2>
                    {/* Role badge — dynamic color justified inline */}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em]"
                      style={{ background: `${role.color}12`, color: role.color, border: `1px solid ${role.color}28` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: role.color }} aria-hidden />
                      {role.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-avs-accent/55">{user?.email}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-avs-accent/35">
                    <Calendar size={10} aria-hidden />
                    Membre depuis {memberSince}
                  </p>
                </div>

                {/* Avatar change button */}
                <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-avs-accent/16 text-avs-accent/55 hover:border-avs-primary/20 hover:text-avs-primary transition-all duration-200">
                  <Camera size={14} /> Modifier l&apos;avatar
                </button>
              </div>
            </div>
          </section>

          {/* ══ TABS ════════════════════════════════════════════════════════ */}
          <div className="flex gap-0 border-b border-avs-accent/9">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  -mb-px flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all duration-150
                  ${activeTab === id
                    ? 'border-avs-primary text-avs-primary'
                    : 'border-transparent text-avs-accent/35 hover:text-avs-accent'
                  }
                `}
              >
                <Icon size={14} aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ══ TAB CONTENT ═════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ── TAB: INFOS ─────────────────────────────────────────────── */}
              {activeTab === 'infos' && (
                <section className="space-y-5 rounded-2xl border border-avs-accent/9 bg-avs-secondary p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nom complet" error={errors.name}>
                      <input type="text" value={form.name} onChange={set('name')} className="prf-input" placeholder="Amara Diop" />
                    </Field>
                    <Field label="Spécialité" hint="Votre domaine d'expertise (Ndop, Bogolan…)" error={errors.specialty}>
                      <input type="text" value={form.specialty} onChange={set('specialty')} className="prf-input" placeholder="Tisserand Ndop" />
                    </Field>
                  </div>

                  <Field label="Bio" hint="Décrivez-vous en 280 caractères ou moins" error={errors.bio}>
                    <textarea
                      value={form.bio} onChange={set('bio')} maxLength={280} rows={3}
                      className="prf-input"
                      placeholder="Tisserand de tradition, je documente les motifs Ndop depuis 20 ans…"
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span className="font-mono text-[9px] text-avs-accent/35">{form.bio?.length ?? 0}/280</span>
                    </div>
                  </Field>

                  <Field label="Localisation" error={errors.location}>
                    <div className="prf-input-icon">
                      <MapPin size={14} className="text-avs-accent/30 shrink-0" aria-hidden />
                      <input type="text" value={form.location} onChange={set('location')} placeholder="Foumban, Cameroun" />
                    </div>
                  </Field>

                  <Field label="Site web" error={errors.website}>
                    <div className="prf-input-icon">
                      <Globe size={14} className="text-avs-accent/30 shrink-0" aria-hidden />
                      <input type="url" value={form.website} onChange={set('website')} placeholder="https://exemple.com" />
                    </div>
                  </Field>
                </section>
              )}

              {/* ── TAB: SOCIAL ────────────────────────────────────────────── */}
              {activeTab === 'social' && (
                <section className="space-y-5 rounded-2xl border border-avs-accent/9 bg-avs-secondary p-6">
                  <SocialRow
                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                    platform="GitHub" prefix="github.com/"
                    value={form.github ?? ''} onChange={(v) => setForm((f) => ({ ...f, github: v }))}
                    maxLength={39} placeholder="username"
                  />

                  <SocialRow
                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    platform="Twitter / X" prefix="x.com/"
                    value={form.twitter ?? ''} onChange={(v) => setForm((f) => ({ ...f, twitter: v }))}
                    maxLength={15} placeholder="username"
                  />

                  {/* Preview links */}
                  {(form.github || form.twitter) && (
                    <div className="rounded-xl p-4 bg-avs-accent/4 border border-avs-accent/9">
                      <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/35">Aperçu des liens</p>
                      <div className="flex flex-wrap gap-2">
                        {form.github && (
                          <a href={`https://github.com/${form.github}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-avs-secondary border border-avs-accent/16 text-avs-accent/55 hover:text-avs-primary transition-colors">
                            github.com/{form.github}
                          </a>
                        )}
                        {form.twitter && (
                          <a href={`https://x.com/${form.twitter}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-avs-secondary border border-avs-accent/16 text-avs-accent/55 hover:text-avs-primary transition-colors">
                            x.com/{form.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ── TAB: STATS ─────────────────────────────────────────────── */}
              {activeTab === 'stats' && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Motifs créés"  value="0"                              sub="À développer"    icon={Layers}   color="#C0573E" />
                    <StatCard label="Vues totales"  value="0"                              sub="À développer"    icon={Eye}      color="#2A4A6B" />
                    <StatCard label="Membre depuis" value={memberSince.split(' ')[2] ?? 'N/A'} sub={memberSince} icon={Calendar} color="#4A6741" />
                  </div>

                  {/* Contribution level */}
                  <div className="overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary">
                    <div className={`${role.pattern} h-1.5`} aria-hidden />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/35">Niveau de contribution</p>
                          <p className="mt-1 font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>{role.label}</p>
                        </div>
                        {/* Dynamic role badge — inline justified */}
                        <span
                          className="rounded-xl px-3.5 py-2 font-mono text-sm font-black"
                          style={{ background: `${role.color}12`, color: role.color, border: `1px solid ${role.color}25` }}
                        >
                          {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                        </span>
                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-avs-accent/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: roleKey === 'admin' ? '100%' : roleKey === 'curator' ? '66%' : roleKey === 'contributor' ? '33%' : '10%' }}
                          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ background: role.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5">
                    <p className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/35">
                      Actions de compte
                    </p>
                    <button
                      onClick={() => void logout()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border border-red-500/30 text-red-500 bg-red-500/6 hover:bg-red-500/12 hover:border-red-500/45 transition-all duration-200"
                    >
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}