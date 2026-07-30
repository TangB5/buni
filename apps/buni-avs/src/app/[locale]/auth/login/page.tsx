'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { BuniLoader } from '@buni/ui';
import { useToast } from '@buni/ui';
import { z } from 'zod';
import { useAuthStore } from '@buni/auth';
import { Route } from 'next';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { authService } from '@/features/auth/services/auth.service';
import { GoogleLoginButton,GithubLoginButton } from '@buni/auth';
import { useTranslations } from '@/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

// Schema will be created inside component to use translations
type LoginForm = {
  email: string;
  password: string;
};
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
// DATA (moved inside component for i18n)
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  right,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-avs-accent/38 font-mono text-[9px] font-bold tracking-[0.2em] uppercase"
        >
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
  const t = useTranslations('login');
  const user = useAuthStore((s) => s.user);
  const { mutate, isPending, error } = useLogin();
  const { add } = useToast();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [githubCode, setGithubCode] = useState<string | null>(null);

  const TESTIMONIALS_MINI = [
    {
      pattern: 'avs-pattern-kente-royale',
      initial: 'A',
      text: t('testimonials.a'),
    },
    { pattern: 'avs-pattern-ndop-sultan', initial: 'N', text: t('testimonials.n') },
    { pattern: 'avs-pattern-adinkra-sankofa', initial: 'F', text: t('testimonials.f') },
  ] as const;

  const LoginSchema = z.object({
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string().min(8, t('validation.passwordTooShort')),
  });

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('github_code');

    if (!code) return;

    setGithubCode(code);
    authService.githubLogin(code).then((response) => {
      if (response.success) {
        const { user, tokens } = response.data;
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setToken(tokens?.accessToken ?? null);
        window.location.assign('/dashboard');
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate(form, {
      onSuccess: () => {
        add({
          variant: 'success',
          title: t('toast.success.title'),
          message: t('toast.success.message')
        });
      },
      onError: (err) => {
        add({
          variant: 'error',
          title: t('toast.error.title'),
          message: err?.message || t('toast.error.message')
        });
      }
    });
  };

  // Input border/shadow driven by focus + error state — dynamic, can't be Tailwind
  const inputStyle = (field: keyof LoginForm): React.CSSProperties => ({
    background: 'var(--avs-secondary)',
    color: 'var(--avs-accent)',
    border: `1.5px solid ${
      errors[field] ? '#ef4444' : focused === field ? 'var(--avs-primary)' : 'rgba(29,29,27,0.16)'
    }`,
    outline: 'none',
    borderRadius: '0.75rem',
    boxShadow:
      focused === field && !errors[field]
        ? '0 0 0 3px rgba(192,87,62,0.10)'
        : errors[field]
          ? '0 0 0 3px rgba(239,68,68,0.10)'
          : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    fontSize: '0.875rem',
    width: '100%',
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
              <BuniLoader size={36} showText={false} theme="dark" />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse text-avs-accent/38">
                {t('loading')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-avs-secondary flex min-h-[calc(100vh-4rem)] items-stretch">
        {/* ══ LEFT — Décor immersif ════════════════════════════════════════ */}
        <div className="relative hidden w-[52%] overflow-hidden lg:block">
          <div className="avs-pattern-ndop-sultan absolute inset-0" />
          {/* Multi-stop gradient — justified inline */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.86) 100%)',
            }}
          />
          {/* Radial halo — justified inline */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 70% at 40% 45%, rgba(192,87,62,0.20) 0%, transparent 70%)',
            }}
            aria-hidden
          />
          {/* Fine grid — justified inline: repeating background pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245,235,224,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,235,224,.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden
          />

          {/* Content layer */}
          <div className="relative flex h-full items-center justify-between p-12">
            {/* Logo */}

            {/* Blockquote */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <div
                className="font-display text-avs-primary/60 mb-4 text-6xl leading-none font-black select-none"
                style={{ fontFamily: 'Georgia, serif' }}
                aria-hidden
              >
                &ldquo;
              </div>
              <blockquote
                className="font-display text-avs-secondary text-2xl leading-snug font-bold"
                style={{ letterSpacing: '-0.015em' }}
              >
                {t('quote.line1')}
                <br />
                {t('quote.line2')}
              </blockquote>
              <p className="text-avs-secondary/45 mt-3 text-sm">
                {' '}
                — {t('quote.author')}
              </p>

              <div className="mt-8 space-y-3">
                {TESTIMONIALS_MINI.map(({ pattern, initial, text }) => (
                  <div key={initial} className="flex items-center gap-3">
                    <div
                      className={`${pattern} ring-avs-secondary/10 relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="font-display text-avs-secondary text-xs font-black drop-shadow">
                          {initial}
                        </span>
                      </div>
                    </div>
                    <p className="text-avs-secondary/50 text-xs leading-snug">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══ RIGHT — Formulaire ═══════════════════════════════════════════ */}
        <div className="bg-avs-secondary flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-14">
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
                  <span className="font-display text-avs-secondary text-sm font-black">A</span>
                </div>
              </div>
              <span
                className="font-display text-avs-accent text-lg font-black"
                style={{ letterSpacing: '-0.02em' }}
              >
                AVS
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="bg-avs-primary h-px w-6" aria-hidden />
                <span className="text-avs-primary font-mono text-[9px] tracking-[0.24em] uppercase">
                  {t('heading.label')}
                </span>
              </div>
              <h1
                className="font-display text-avs-accent leading-none font-black"
                style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.025em' }}
              >
                {t('heading.title')}
              </h1>
              <p className="text-avs-accent/55 mt-2 text-sm">
                {t('heading.noAccount')}{' '}
                <Link
                  href={'/auth/register' as Route}
                  className="text-avs-primary font-semibold underline-offset-3 hover:underline"
                >
                  {t('heading.registerLink')}
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
                  className="flex items-center gap-2.5 overflow-hidden rounded-xl border border-red-500/22 bg-red-500/8 px-4 py-3 text-sm text-red-500"
                >
                  <AlertCircle size={14} />
                  {error.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <Field id="email" label={t('fields.email.label')} error={errors.email}>
                <div className="relative">
                  <Mail
                    size={14}
                    className="text-avs-accent/32 absolute top-1/2 left-3.5 -translate-y-1/2"
                    aria-hidden
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused('email')}
                    onBlur={() => {
                      setFocused(null);
                      validate();
                    }}
                    placeholder={t('fields.email.placeholder')}
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
                label={t('fields.password.label')}
                error={errors.password}
                right={
                  <Link
                    href={'/auth/forgot' as Route}
                    className="text-avs-primary text-xs font-medium underline-offset-3 hover:underline"
                  >
                    {t('fields.password.forgot')}
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
                    onBlur={() => {
                      setFocused(null);
                      validate();
                    }}
                    placeholder={t('fields.password.placeholder')}
                    disabled={isPending}
                    style={{ ...inputStyle('password'), paddingLeft: '1rem', paddingRight: '3rem' }}
                    aria-describedby={errors.password ? 'pwd-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    disabled={isPending}
                    className="text-avs-accent/32 hover:text-avs-accent absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                    aria-label={showPwd ? t('fields.password.hide') : t('fields.password.show')}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="group text-avs-secondary bg-avs-primary shadow-avs-md relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                aria-busy={isPending}
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      {t('submit.loading')}
                    </>
                  ) : (
                    <>
                      {t('submit.text')}{' '}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="bg-avs-accent/9 h-px flex-1" />
                <span className="text-avs-accent/38 font-mono text-[9px] tracking-[0.18em] uppercase">
                  {t('divider')}
                </span>
                <div className="bg-avs-accent/9 h-px flex-1" />
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <GithubLoginButton
                  // onSuccess={async (accessToken) => {
                  //   await authService.githubLogin(accessToken);
                  // }}
                />
                
                  
                <GoogleLoginButton
                  onSuccess={async (accessToken) => {
                    await authService.googleLogin(accessToken);
                  }}
                />
              </div>
            </form>

            {/* Trust footer */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-avs-accent/38 text-[11px] leading-relaxed">
                {t('footer.acceptTerms')}{' '}
                <Link
                  href={'/terms' as Route}
                  className="text-avs-accent/38 underline underline-offset-3"
                >
                  {t('footer.terms')}
                </Link>{' '}
                {t('footer.and')}{' '}
                <Link
                  href={'/privacy' as Route}
                  className="text-avs-accent/38 underline underline-offset-3"
                >
                  {t('footer.privacy')}
                </Link>
                .
              </p>
              <span className="bg-avs-primary/8 text-avs-primary border-avs-primary/20 shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[9px] font-bold tracking-wide uppercase">
                {t('footer.license')}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
