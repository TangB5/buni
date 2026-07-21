'use client';


import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { BuniLoader } from '@buni/ui';
import { z } from 'zod';
import { useAuthStore } from '@buni/auth';
import { Route } from 'next';
import { useLogin } from '@/features/auth/hooks/useLogin';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const LoginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});
type LoginForm   = z.infer<typeof LoginSchema>;
type FieldErrors = Partial<Record<keyof LoginForm, string>>;

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

const PATTERN_CARDS = [
  { css: 'avs-pattern-ndop-sultan',     name: 'Ndop Sultan',   origin: 'Foumban · CM', rotate: '-3deg',   style: { top: '8%',    left: '6%',   width: '52%', height: '44%' } },
  { css: 'avs-pattern-kente-royale',    name: 'Kente Royale',  origin: 'Kumasi · GH',  rotate: '2deg',    style: { top: '6%',    right: '4%',  width: '38%', height: '32%' } },
  { css: 'avs-pattern-bogolan-fanga',   name: 'Bogolan Fanga', origin: 'Ségou · ML',   rotate: '-1.5deg', style: { bottom: '18%',left: '2%',   width: '44%', height: '26%' } },
  { css: 'avs-pattern-adinkra-sankofa', name: 'Adinkra',       origin: 'Akan · GH',    rotate: '1deg',    style: { bottom: '8%', right: '3%',  width: '40%', height: '28%' } },
] as const;

const TESTIMONIALS_MINI = [
  { pattern: 'avs-pattern-kente-royale',    initial: 'A', text: 'Premier outil de référence africain.' },
  { pattern: 'avs-pattern-ndop-sultan',     initial: 'N', text: 'Indispensable pour chaque créateur.'  },
  { pattern: 'avs-pattern-adinkra-sankofa', initial: 'F', text: "Le standard que l'on attendait."      },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Field({ id, label, error, right, children }: {
  id: string; label: string; error?: string;
  right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/38">
          {label}
        </label>
        {right}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"
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

export default function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const { mutate, isPending, error } = useLogin();

  const [form,    setForm]    = useState<LoginForm>({ email: '', password: '' });
  const [errors,  setErrors]  = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validate = (): boolean => {
    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((e) => {
        const k = e.path[0] as keyof LoginForm;
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
    mutate(form);
  };

  // Input border/shadow driven by focus + error state — dynamic, can't be Tailwind
  const inputStyle = (field: keyof LoginForm): React.CSSProperties => ({
    background:   'var(--avs-secondary)',
    color:        'var(--avs-accent)',
    border:       `1.5px solid ${
      errors[field]    ? '#ef4444'
      : focused === field ? 'var(--avs-primary)'
      : 'rgba(29,29,27,0.16)'
    }`,
    outline:      'none',
    borderRadius: '0.75rem',
    boxShadow:    focused === field && !errors[field]
      ? '0 0 0 3px rgba(192,87,62,0.10)'
      : errors[field]
        ? '0 0 0 3px rgba(239,68,68,0.10)'
        : 'none',
    transition:   'border-color 0.18s, box-shadow 0.18s',
    paddingTop:    '0.75rem',
    paddingBottom: '0.75rem',
    fontSize:      '0.875rem',
    width:         '100%',
  });

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="flex min-h-[calc(100vh-4rem)] items-stretch bg-avs-secondary">

        {/* ══ LEFT — Décor immersif ════════════════════════════════════════ */}
        <div className="relative hidden w-[52%] overflow-hidden lg:block">
          <div className="avs-pattern-ndop-sultan absolute inset-0" />
          {/* Multi-stop gradient — justified inline */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.86) 100%)' }} />
          {/* Radial halo — justified inline */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 70% at 40% 45%, rgba(192,87,62,0.20) 0%, transparent 70%)' }} aria-hidden />
          {/* Fine grid — justified inline: repeating background pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(rgba(245,235,224,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,235,224,.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
            aria-hidden
          />

         

          {/* Content layer */}
          <div className="relative flex h-full items-center justify-between p-12">
            {/* Logo */}
           

            {/* Blockquote */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease }}>
              <div className="mb-4 font-display text-6xl leading-none font-black select-none text-avs-primary/60" style={{ fontFamily: 'Georgia, serif' }} aria-hidden>&ldquo;</div>
              <blockquote className="font-display text-2xl font-bold leading-snug text-avs-secondary" style={{ letterSpacing: '-0.015em' }}>
                L&apos;identité d&apos;un peuple<br />se lit dans ses motifs.
              </blockquote>
              <p className="mt-3 text-sm text-avs-secondary/45"> — NDOH yannick TANG, fondateur AVS</p>

              <div className="mt-8 space-y-3">
                {TESTIMONIALS_MINI.map(({ pattern, initial, text }) => (
                  <div key={initial} className="flex items-center gap-3">
                    <div className={`${pattern} relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-avs-secondary/10`}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="font-display text-xs font-black text-avs-secondary drop-shadow">{initial}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-snug text-avs-secondary/50">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            
          </div>
        </div>

        {/* ══ RIGHT — Formulaire ═══════════════════════════════════════════ */}
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
                <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-avs-primary">Espace membre</span>
              </div>
              <h1 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.025em' }}>
                Connexion
              </h1>
              <p className="mt-2 text-sm text-avs-accent/55">
                Pas encore de compte ?{' '}
                <Link href={'/auth/register' as Route} className="font-semibold underline-offset-3 hover:underline text-avs-primary">
                  S&apos;inscrire gratuitement
                </Link>
              </p>
            </div>

            {/* API error */}
            <AnimatePresence>
              {error instanceof Error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  role="alert"
                  className="flex items-center gap-2.5 overflow-hidden rounded-xl px-4 py-3 text-sm text-red-500 bg-red-500/8 border border-red-500/22"
                >
                  <AlertCircle size={14} />
                  {error.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <Field id="email" label="Email" error={errors.email}>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-avs-accent/32" aria-hidden />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
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
              <Field
                id="password"
                label="Mot de passe"
                error={errors.password}
                right={
                  <Link href={'/auth/forgot' as Route} className="text-xs font-medium underline-offset-3 hover:underline text-avs-primary">
                    Oublié ?
                  </Link>
                }
              >
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    onFocus={() => setFocused('password')}
                    onBlur={() => { setFocused(null); validate(); }}
                    placeholder="••••••••"
                    disabled={isPending}
                    style={{ ...inputStyle('password'), paddingLeft: '1rem', paddingRight: '3rem' }}
                    aria-describedby={errors.password ? 'pwd-error' : undefined}
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
                    ? <><BuniLoader size={18} showText={false} /> Connexion…</>
                    : <>Se connecter <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
                <button type="button" disabled={isPending} className="oauth-btn flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
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
                En vous connectant, vous acceptez nos{' '}
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

  