'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check, ArrowRight, User, Mail, Lock, ChevronDown } from 'lucide-react';
import { BuniLoader } from '@buni/ui';
import { z } from 'zod';
import { Route } from 'next';
import { useRegister } from '@/features/auth/hooks/useRegister';


// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const roles = ['viewer', 'contributor', 'curator', 'admin'] as const;

const RegisterSchema = z.object({
  name:     z.string().min(2, 'Minimum 2 caractères'),
  email:    z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  role: z.enum(roles, { message: 'Rôle invalide' }),
});

type RegisterForm = z.infer<typeof RegisterSchema>;
type FieldErrors  = Partial<Record<keyof RegisterForm, string>>;

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES — only what Tailwind can't express
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.38) !important; opacity: 1; }
  .dark ::placeholder { color: rgba(236,232,225,0.32) !important; }

  .role-select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--avs-secondary);
    color: var(--avs-accent);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    cursor: pointer;
    font-family: inherit;
  }
  .role-select:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.10);
  }
  .role-select option { background: var(--avs-secondary); color: var(--avs-accent); }

  .oauth-btn {
    background: var(--avs-secondary);
    border: 1.5px solid rgba(29,29,27,0.16);
    color: rgba(29,29,27,0.55);
    border-radius: 0.75rem;
    transition: border-color 0.18s, color 0.18s, background 0.18s;
    font-family: inherit;
  }
  .oauth-btn:hover:not(:disabled) {
    border-color: rgba(192,87,62,0.20);
    color: var(--avs-primary);
    background: rgba(192,87,62,0.08);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

// accentHex kept for dynamic inline role badge bg/border — unknown at build time
const ROLE_CONFIG: Record<typeof roles[number], { label: string; desc: string; accentHex: string }> = {
  viewer:      { label: 'Visiteur',     desc: 'Accès lecture & téléchargement',      accentHex: '#2A4A6B' },
  contributor: { label: 'Contributeur', desc: 'Soumission de motifs',                accentHex: '#4A6741' },
  curator:     { label: 'Curateur',     desc: 'Validation & curation éditoriale',    accentHex: '#D4A017' },
  admin:       { label: 'Admin',        desc: 'Accès complet & gestion des membres', accentHex: '#C0573E' },
};

const PERKS = [
  'Accès à 1 248 motifs haute résolution',
  "Palette de design tokens prêts à l'emploi",
  'Communauté de 312 artisans vérifiés',
  'Téléchargement SVG, PNG et JSON illimité',
] as const;

const PATTERN_CARDS = [
  { css: 'avs-pattern-kente-royale',    rotate: '-2.5deg', style: { top: '7%',    left: '5%',   width: '54%', height: '42%' } },
  { css: 'avs-pattern-adinkra-sankofa', rotate: '2deg',    style: { top: '5%',    right: '3%',  width: '38%', height: '34%' } },
  { css: 'avs-pattern-wax-dakar',       rotate: '-1deg',   style: { bottom: '20%',left: '3%',   width: '46%', height: '26%' } },
  { css: 'avs-pattern-kuba-kasai',      rotate: '1.5deg',  style: { bottom: '7%', right: '4%',  width: '42%', height: '30%' } },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD STRENGTH
// ─────────────────────────────────────────────────────────────────────────────

function PasswordStrength({ pwd }: { pwd: string }) {
  const checks = [
    { label: '8 caractères', ok: pwd.length >= 8 },
    { label: 'Majuscule',    ok: /[A-Z]/.test(pwd) },
    { label: 'Chiffre',      ok: /[0-9]/.test(pwd) },
  ];
  const score = checks.filter((c) => c.ok).length;

  // Bar color depends on score — dynamic, justified inline
  const barColor  = score === 0 ? '#ef4444' : score === 1 ? '#f59e0b' : '#22c55e';
  const scoreLabel = score === 0 ? 'Trop court' : score === 1 ? 'Faible' : score === 2 ? 'Moyen' : 'Fort';

  if (!pwd) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-2.5 space-y-2 overflow-hidden"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-avs-accent/16">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i < score ? '100%' : '0%' }}
                transition={{ duration: 0.3, delay: i * 0.06, ease }}
                style={{ background: barColor }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-wide" style={{ color: barColor, opacity: score === 0 ? 0.5 : 1 }}>
            {scoreLabel}
          </p>
          <div className="flex gap-3">
            {checks.map(({ label, ok }) => (
              <span
                key={label}
                className={`flex items-center gap-1 font-mono text-[9px] transition-colors duration-200 ${ok ? 'text-emerald-500' : 'text-avs-accent/35'}`}
              >
                <Check size={9} strokeWidth={ok ? 3 : 1.5} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({ id, label, error, children }: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/38">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs text-red-500"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { mutate, isPending, error } = useRegister();

  const [form,    setForm]    = useState<RegisterForm>({ name: '', email: '', password: '', role: 'contributor' });
  const [errors,  setErrors]  = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validate = (): boolean => {
    const result = RegisterSchema.safeParse(form);
    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((e) => {
        const k = e.path[0] as keyof RegisterForm;
        if (k) fe[k] = e.message;
      });
      setErrors(fe);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate({
      ...form,
      role: form.role.toUpperCase() as any,
    });
  };

  // Input border/shadow driven by focus + error — dynamic, can't be Tailwind
  const inputStyle = (field: keyof RegisterForm): React.CSSProperties => ({
    background:    'var(--avs-secondary)',
    color:         'var(--avs-accent)',
    border:        `1.5px solid ${
      errors[field]    ? '#ef4444'
      : focused === field ? 'var(--avs-primary)'
      : 'rgba(29,29,27,0.16)'
    }`,
    outline:       'none',
    borderRadius:  '0.75rem',
    boxShadow:     focused === field && !errors[field]
      ? '0 0 0 3px rgba(192,87,62,0.10)'
      : errors[field]
        ? '0 0 0 3px rgba(239,68,68,0.10)'
        : 'none',
    transition:    'border-color 0.18s, box-shadow 0.18s',
    paddingTop:    '0.75rem',
    paddingBottom: '0.75rem',
    fontSize:      '0.875rem',
    width:         '100%',
  });

  const roleConf = ROLE_CONFIG[form.role];

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* Loading overlay */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/55 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl p-8 bg-avs-secondary border border-avs-accent/9">
              <BuniLoader size={36} showText={false} />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse text-avs-accent/38">
                Création du compte…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-[calc(100vh-4rem)] items-stretch bg-avs-secondary">

        {/* ══ LEFT — Décor ════════════════════════════════════════════════ */}
        <div className="relative hidden w-[45%] overflow-hidden lg:block">
          <div className="avs-pattern-kente-royale absolute inset-0" />
          {/* Multi-stop gradient — justified inline */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.88) 100%)' }} />
          {/* Radial halo — justified inline */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 65% at 38% 48%, rgba(192,87,62,0.18) 0%, transparent 68%)' }} aria-hidden />
          {/* Fine grid — justified inline */}
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(245,235,224,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,235,224,.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} aria-hidden />

          

          {/* Content */}
          <div className="relative flex h-full  justify-between items-center p-12">
           

            {/* Perks */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease }}>
              <p className="mb-5 font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-avs-primary">
                Pourquoi rejoindre ?
              </p>
              <div className="space-y-3.5">
                {PERKS.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-avs-primary/18">
                      <Check size={10} className="text-avs-primary" strokeWidth={3} />
                    </div>
                    <span className="text-sm leading-snug text-avs-secondary/68">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[{ v: '1 248', l: 'motifs' }, { v: '312', l: 'artisans' }, { v: '54', l: 'pays' }].map(({ v, l }) => (
                  <div key={l} className="rounded-xl px-3.5 py-2 bg-avs-secondary/6 border border-avs-secondary/9">
                    <span className="font-display text-lg font-black text-avs-secondary" style={{ letterSpacing: '-0.02em' }}>{v}</span>
                    <span className="ml-1.5 font-mono text-[9px] text-avs-secondary/40">{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="font-mono text-[9px] tracking-[0.16em] uppercase text-avs-secondary/22"
            >
              Gratuit · Open Source · CC BY 4.0
            </motion.p>
          </div>
        </div>

        {/* ══ RIGHT — Form ════════════════════════════════════════════════ */}
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-14 bg-avs-secondary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="avs-pattern-kente-royale relative h-8 w-8 overflow-hidden rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="font-display text-sm font-black text-avs-secondary">A</span>
                </div>
              </div>
              <span className="font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.02em' }}>AVS</span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-6 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-avs-primary">Créer un compte</span>
              </div>
              <h1 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.025em' }}>
                Rejoindre AVS
              </h1>
              <p className="mt-2 text-sm text-avs-accent/55">
                Vous avez déjà un compte ?{' '}
                <Link href={'/auth/login' as Route} className="font-semibold underline-offset-3 hover:underline text-avs-primary">
                  Se connecter
                </Link>
              </p>
            </div>

            {/* API error */}
            <AnimatePresence>
              {error && typeof error === 'string' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  role="alert"
                  className="flex items-center gap-2.5 overflow-hidden rounded-xl px-4 py-3 text-sm text-red-500 bg-red-500/8 border border-red-500/22"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Name */}
              <Field id="name" label="Nom complet" error={errors.name}>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                  <input
                    id="name" type="text" autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocused('name')}
                    onBlur={() => { setFocused(null); validate(); }}
                    placeholder="Amara Diop"
                    disabled={isPending}
                    style={{ ...inputStyle('name'), paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                </div>
              </Field>

              {/* Email */}
              <Field id="email" label="Email" error={errors.email}>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                  <input
                    id="email" type="email" autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused('email')}
                    onBlur={() => { setFocused(null); validate(); }}
                    placeholder="vous@exemple.com"
                    disabled={isPending}
                    style={{ ...inputStyle('email'), paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
              </Field>

              {/* Password */}
              <Field id="password" label="Mot de passe" error={errors.password}>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                  <input
                    id="password" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    onFocus={() => setFocused('password')}
                    onBlur={() => { setFocused(null); validate(); }}
                    placeholder="••••••••"
                    disabled={isPending}
                    style={{ ...inputStyle('password'), paddingLeft: '2.5rem', paddingRight: '3rem' }}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    disabled={isPending}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32 hover:text-avs-accent transition-colors"
                    aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <PasswordStrength pwd={form.password} />
              </Field>

              {/* Role */}
              <Field id="role" label="Rôle" error={errors.role}>
                <div className="relative">
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as RegisterForm['role'] }))}
                    disabled={isPending}
                    className="role-select"
                    aria-describedby={errors.role ? 'role-error' : undefined}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{ROLE_CONFIG[r].label} — {ROLE_CONFIG[r].desc}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                </div>

                {/* Role badge — accentHex justified inline: dynamic per-role */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={form.role}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                    style={{ background: `${roleConf.accentHex}12`, border: `1px solid ${roleConf.accentHex}28` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: roleConf.accentHex }} aria-hidden />
                    <span className="font-mono text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: roleConf.accentHex }}>
                      {roleConf.label}
                    </span>
                    <span className="text-[10px] text-avs-accent/38">— {roleConf.desc}</span>
                  </motion.div>
                </AnimatePresence>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                aria-busy={isPending}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                <span className="relative flex items-center justify-center gap-2">
                  {isPending
                    ? <><BuniLoader size={18} showText={false} /> Création…</>
                    : <>Créer mon compte <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></>
                  }
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-avs-accent/9" />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-avs-accent/38">ou continuer avec</span>
                <div className="h-px flex-1 bg-avs-accent/9" />
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={isPending} className="oauth-btn flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
                <button type="button" disabled={isPending} className="oauth-btn flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50">
                  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>
            </form>

            {/* Trust footer */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[11px] leading-relaxed text-avs-accent/38">
                En vous inscrivant, vous acceptez nos{' '}
                <Link href={'/terms' as Route} className="underline underline-offset-3 text-avs-accent/38">conditions</Link>
                {' '}et notre{' '}
                <Link href={'/privacy' as Route} className="underline underline-offset-3 text-avs-accent/38">confidentialité</Link>.
              </p>
              <span className="shrink-0 rounded-lg px-2.5 py-1 font-mono text-[9px] font-bold tracking-wide uppercase bg-avs-primary/8 text-avs-primary border border-avs-primary/20">
                Apache 2.0 + Commons Clause
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}