'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import { useLogin } from '@buni/auth/hooks';
import { BuniLoader } from '@/components/ui/BuniLoader';
import { z } from 'zod';
import 'primeicons/primeicons.css';

// ── Validation ─────────────────────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

type LoginForm = z.infer<typeof LoginSchema>;
type FieldErrors = Partial<Record<keyof LoginForm, string>>;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);

  const validate = (): boolean => {
    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((e) => {
        const key = e.path[0] as keyof LoginForm;
        if (key) fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-stretch">
      {/* ── Colonne gauche — Décor motif ──────────────────────────────────── */}
      <div className="avs-pattern-ndop-royal relative hidden w-1/2 overflow-hidden lg:block">
        <div className="from-avs-accent to-avs-accent absolute inset-0 bg-linear-to-br" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <Link href="/" className="font-display text-avs-secondary text-2xl font-bold">
              AVS <span className="text-avs-primary">·</span>
            </Link>
          </div>

          <div>
            <blockquote className="font-display text-avs-secondary text-2xl leading-snug font-bold">
              &ldquo;L&apos;identit&eacute; d&apos;un peuple
              <br /> se lit dans ses motifs.&rdquo;
            </blockquote>
            <p className="text-avs-secondary/50 mt-3 text-sm">— Dr. Amara Diop, fondateur AVS</p>
          </div>

          <div className="flex gap-2">
            {['avs-pattern-kente', 'avs-pattern-ndop', 'avs-pattern-wax'].map((p) => (
              <div
                key={p}
                className={`${p} rounded-avs border-avs-secondary/10 h-12 w-12 border`}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Colonne droite — Formulaire ──────────────────────────────────── */}
      <div className="bg-avs-secondary flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link
            href="/"
            className="font-display text-avs-accent mb-8 block text-xl font-bold lg:hidden"
          >
            AVS <span className="text-avs-primary">·</span>
          </Link>

          <h1 className="font-display text-avs-accent text-3xl font-bold">Connexion</h1>
          <p className="text-avs-accent/55 mt-1 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-avs-primary font-semibold hover:underline">
              S&apos;inscrire
            </Link>
          </p>

          {/* Erreur API */}
          {error instanceof Error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              role="alert"
              className="rounded-avs mt-5 flex items-center gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={15} aria-hidden />
              {error.message}
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-avs-accent/50 mb-1.5 block text-xs font-bold tracking-wider uppercase"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="text-avs-accent/35 absolute top-1/2 left-3.5 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={validate}
                  placeholder="vous@exemple.com"
                  disabled={isPending}
                  className={`rounded-avs text-avs-accent placeholder:text-avs-accent/30 w-full border-2 bg-white py-3 pr-4 pl-10 text-sm transition-colors focus:outline-none disabled:opacity-50 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-avs-accent/15 focus:border-avs-primary'
                  }`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-avs-accent/50 block text-xs font-bold tracking-wider uppercase"
                >
                  Mot de passe
                </label>
                <Link href="/auth/forgot" className="text-avs-primary text-xs hover:underline">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  onBlur={validate}
                  placeholder="••••••••"
                  disabled={isPending}
                  className={`rounded-avs text-avs-accent placeholder:text-avs-accent/30 w-full border-2 bg-white py-3 pr-11 pl-4 text-sm transition-colors focus:outline-none disabled:opacity-50 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-avs-accent/15 focus:border-avs-primary'
                  }`}
                  aria-describedby={errors.password ? 'pwd-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  disabled={isPending}
                  className="text-avs-accent/35 hover:text-avs-accent absolute top-1/2 right-3.5 -translate-y-1/2 disabled:opacity-50"
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p id="pwd-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs hover:shadow-avs-md flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              aria-busy={isPending}
            >
              {isPending && <BuniLoader size={24} showText={false} />}
              {isPending ? 'Connexion…' : 'Se connecter'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="bg-avs-accent/10 h-px flex-1" />
              <span className="text-avs-accent/35 text-xs">ou continuer avec</span>
              <div className="bg-avs-accent/10 h-px flex-1" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isPending}
                className="rounded-avs border-avs-accent/15 text-avs-accent hover:border-avs-primary/40 hover:text-avs-primary flex items-center justify-center gap-2 border-2 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <i className="pi pi-github" aria-hidden></i> GitHub
              </button>
              <button
                type="button"
                disabled={isPending}
                className="rounded-avs border-avs-accent/15 text-avs-accent hover:border-avs-primary/40 hover:text-avs-primary flex items-center justify-center gap-2 border-2 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <span className="text-base leading-none font-bold" aria-hidden>
                  G
                </span>{' '}
                Google
              </button>
            </div>
          </form>

          <p className="text-avs-accent/35 mt-8 text-center text-xs leading-relaxed">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="hover:text-avs-primary underline">
              conditions d&apos;utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="hover:text-avs-primary underline">
              politique de confidentialit&eacute;
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
