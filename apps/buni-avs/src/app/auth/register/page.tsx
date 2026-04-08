'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

import { BuniLoader } from '@buni/ui';
import 'primeicons/primeicons.css';
import { z } from 'zod';
import { Route } from 'next';
import { useRegister } from 'apps/buni-avs/src/features/auth/hooks/useAuth';

// ── ROLES CORRECTS ─────────────────────────────
const roles = ['viewer', 'contributor', 'curator', 'admin'] as const;

const RegisterSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  role: z.enum(roles, { message: 'Rôle invalide' }),
});

type RegisterForm = z.infer<typeof RegisterSchema>;
type FieldErrors = Partial<Record<keyof RegisterForm, string>>;

// ── PASSWORD STRENGTH ─────────────────────────────
function PasswordStrength({ pwd }: { pwd: string }) {
  const checks = [
    { label: '8 caractères', ok: pwd.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(pwd) },
    { label: 'Chiffre', ok: /[0-9]/.test(pwd) },
  ];

  const score = checks.filter((c) => c.ok).length;

  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['Faible', 'Moyen', 'Fort'];

  if (!pwd) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < score ? colors[Math.max(score - 1, 0)] : 'bg-avs-accent/10'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-avs-accent/50 text-[10px]">
          {labels[Math.max(score - 1, 0)] ?? 'Trop court'}
        </p>

        <div className="flex gap-3">
          {checks.map(({ label, ok }) => (
            <span
              key={label}
              className={`flex items-center gap-0.5 text-[10px] ${
                ok ? 'text-green-600' : 'text-avs-accent/35'
              }`}
            >
              <Check size={9} strokeWidth={ok ? 3 : 1.5} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PAGE REGISTER ─────────────────────────────
export default function RegisterPage() {
  const { mutate, isPending, error } = useRegister();

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);

  // ── VALIDATION ─────────────────────────────
  const validate = () => {
    const result = RegisterSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};

      result.error.issues.forEach((e) => {
        const key = e.path[0] as keyof RegisterForm | undefined;
        if (key) fieldErrors[key] = e.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  console.log('Render RegisterPage with form state:', form, 'and errors:', errors);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutate(form);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-stretch">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <BuniLoader />
        </div>
      )}
      {/* ── LEFT PANEL ───────────────────────────── */}
      <div className="avs-pattern-kente relative hidden w-[45%] overflow-hidden lg:block">
        <div className="from-avs-accent/85 to-avs-accent/97 absolute inset-0 bg-gradient-to-br" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="font-display text-avs-secondary text-2xl font-bold">
            AVS <span className="text-avs-primary">·</span>
          </Link>

          <div>
            <p className="text-avs-primary mb-3 text-xs font-bold tracking-[0.2em] uppercase">
              Pourquoi rejoindre ?
            </p>

            {[
              'Accès à 1 248 motifs haute résolution',
              "Palette de design tokens prêts à l'emploi",
              'Communauté de 312 artisans vérifiés',
              'Téléchargement SVG, PNG et JSON illimité',
            ].map((item) => (
              <div key={item} className="mb-3 flex items-start gap-2.5">
                <Check size={14} className="text-avs-primary mt-0.5" />
                <span className="text-avs-secondary/70 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-avs-secondary/30 text-xs">Gratuit · Open Source · CC BY 4.0</p>
        </div>
      </div>

      {/* ── FORM ───────────────────────────── */}
      <div className="bg-avs-secondary flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-avs-accent text-3xl font-bold">Créer un compte</h1>

          <p className="text-avs-accent/55 mt-1 text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href={"/auth/login" as Route} className="text-avs-primary font-semibold">
              Se connecter
            </Link>
          </p>

          {/* ERROR BACKEND */}
          {error instanceof Error && (
            <div className="rounded-avs mt-5 flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={15} />
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* NAME */}
            <div>
              <input
                placeholder="Nom complet"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-avs w-full border px-4 py-3"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-avs w-full border px-4 py-3"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="rounded-avs w-full border px-4 py-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

              <PasswordStrength pwd={form.password} />
            </div>

            {/* ROLE */}
            <div>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value as RegisterForm['role'] }))
                }
                className="rounded-avs w-full border px-4 py-3"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-avs bg-avs-primary text-avs-secondary w-full py-3 font-bold"
            >
              {isPending ? 'Création...' : 'Créer un compte'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
