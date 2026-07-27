'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { BuniLoader } from '@buni/ui';
import { useToast } from '@buni/ui';
import { z } from 'zod';
import { Route } from 'next';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { GoogleLoginButton, GithubLoginButton } from '@buni/auth';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@buni/auth';


// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name:            z.string().min(2, 'Minimum 2 caractères'),
  email:           z.string().email('Email invalide'),
  password:        z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  confirmPassword: z.string().min(1, 'Confirmez votre mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof RegisterSchema>;
type FieldErrors  = Partial<Record<keyof RegisterForm, string>>;

// Le rôle sera automatiquement défini à 'viewer' par le backend

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES — only what Tailwind can't express
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.38) !important; opacity: 1; }
  .dark ::placeholder { color: rgba(236,232,225,0.32) !important; }

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
  const { add } = useToast();

  const [form,    setForm]    = useState<RegisterForm>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [githubToken, setGithubToken] = useState<string | null>(null);

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

  // Handle GitHub token from URL callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('github_token');

    if (token) {
      setGithubToken(token);
      authService.githubLogin(token).then((response) => {
        if (response.success) {
          const { user, tokens } = response.data;
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setToken(tokens?.accessToken ?? null);
          window.location.assign('/dashboard');
        }
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate(form, {
      onSuccess: () => {
        add({
          variant: 'success',
          title: 'Compte créé',
          message: 'Votre compte a été créé avec succès. Bienvenue dans la communauté AVS !'
        });
      },
      onError: (err) => {
        add({
          variant: 'error',
          title: 'Échec de la création',
          message: err?.message || 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.'
        });
      }
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

              {/* Confirm Password */}
              <Field id="confirmPassword" label="Confirmer le mot de passe" error={errors.confirmPassword}>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                  <input
                    id="confirmPassword" type={showConfirmPwd ? 'text' : 'password'} autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => { setFocused(null); validate(); }}
                    placeholder="••••••••"
                    disabled={isPending}
                    style={{ ...inputStyle('confirmPassword'), paddingLeft: '2.5rem', paddingRight: '3rem' }}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    disabled={isPending}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32 hover:text-avs-accent transition-colors"
                    aria-label={showConfirmPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
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
                <GithubLoginButton disabled={isPending} />
                <GoogleLoginButton
                  onSuccess={async (accessToken: string) => {
                    const response = await authService.googleLogin(accessToken);
                    if (response.success) {
                      const { user, tokens } = response.data;
                      useAuthStore.getState().setUser(user);
                      useAuthStore.getState().setToken(tokens?.accessToken ?? null);
                      window.location.assign('/dashboard');
                    }
                  }}
                />
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