'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2, CheckCircle2, MapPin, Globe, ArrowLeft } from 'lucide-react';
import { useAuth, useLogout } from '@buni/auth/hooks';
import { z } from 'zod';
import 'primeicons/primeicons.css';
import Link from 'next/link';

const ProfileSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').max(64),
  bio: z.string().max(280).optional(),
  location: z.string().max(64).optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  github: z.string().max(39).optional(),
  twitter: z.string().max(15).optional(),
  specialty: z.string().max(64).optional(),
});

type ProfileForm = z.infer<typeof ProfileSchema>;
type FieldErrors = Partial<Record<keyof ProfileForm, string>>;

const ROLE_LABELS: Record<string, { label: string; css: string }> = {
  admin: { label: 'Administrateur', css: 'bg-avs-primary text-avs-secondary' },
  curator: { label: 'Curateur', css: 'bg-avs-kente/20 text-avs-kente' },
  contributor: { label: 'Contributeur', css: 'bg-avs-ndop/15 text-avs-ndop' },
  viewer: { label: 'Explorateur', css: 'bg-avs-accent/10 text-avs-accent/60' },
};

const Field = ({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="avs-label">{label}</label>
    {children}
    {hint && !error && <p className="text-avs-accent/35 mt-1 text-xs">{hint}</p>}
    {error && (
      <p role="alert" className="mt-1 text-xs text-red-600">
        {error}
      </p>
    )}
  </div>
);

export default function ProfilePage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const logout = useLogout();

  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    specialty: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'infos' | 'social' | 'stats'>('infos');

  // Wait for auth store to hydrate
  if (!isHydrated) {
    return (
      <div className="bg-avs-secondary flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-avs-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-avs-accent/60 mt-4">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect('/auth/login');
  }

  const roleKey = (user?.role || 'viewer').toLowerCase();
  const { label: roleLabel, css: roleCss } = ROLE_LABELS[roleKey] ?? ROLE_LABELS['viewer']!;

  const save = async () => {
    const result = ProfileSchema.safeParse(form);
    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((e) => {
        if (e.path[0]) fe[e.path[0] as keyof ProfileForm] = e.message;
      });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSaving(true);
    // TODO: Call API endpoint to update profile
    // const response = await patch('/users/me', form);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set =
    (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-avs-secondary/50 min-h-screen">
      {/* Header */}
      <div className="border-avs-accent/10 bg-avs-secondary border-b px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-avs-accent/50 hover:text-avs-accent transition-colors"
              title="Retour au tableau de bord"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-avs-accent text-2xl font-bold">Mon Profil</h1>
              <p className="text-avs-accent/50 text-sm">Gérer vos informations publiques</p>
            </div>
          </div>
          <motion.button
            onClick={() => void save()}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Sauvegarde…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={14} /> Sauvegardé !
              </>
            ) : (
              <>
                <Save size={14} /> Enregistrer
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Avatar & Role */}
        <section className="rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs mb-6 overflow-hidden border">
          <div
            className="from-avs-primary/20 to-avs-kente/20 relative h-32 bg-gradient-to-br"
            aria-hidden
          />
          <div className="relative z-10 -mt-16 px-6 pb-6">
            <div className="flex items-end gap-4">
              <div className="bg-avs-primary/10 border-avs-secondary flex h-24 w-24 items-center justify-center rounded-full border-4">
                <span className="text-4xl">👤</span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-avs-accent text-2xl font-bold">{user?.name}</h2>
                <p className="text-avs-accent/60 text-sm">{user?.email}</p>
                <div className="mt-2">
                  <span
                    className={`rounded-avs inline-block px-3 py-1 text-xs font-medium ${roleCss}`}
                  >
                    {roleLabel}
                  </span>
                </div>
              </div>
              <button className="rounded-avs border-avs-accent/20 text-avs-accent hover:border-avs-accent/40 flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors">
                <Camera size={14} />
                Modifier l&apos;avatar
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-avs-accent/10 mb-6 flex gap-4 border-b">
          {(['infos', 'social', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-avs-primary text-avs-primary'
                  : 'text-avs-accent/50 hover:text-avs-accent border-transparent'
              }`}
            >
              {tab === 'infos' && '📋 Informations'}
              {tab === 'social' && '🔗 Réseaux sociaux'}
              {tab === 'stats' && '📊 Statistiques'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'infos' && (
          <section className="rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs space-y-6 border p-6">
            <Field label="Nom" error={errors.name}>
              <input type="text" value={form.name} onChange={set('name')} className="avs-input" />
            </Field>
            <Field label="Bio" hint="Décrivez-vous en 280 caractères ou moins" error={errors.bio}>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                maxLength={280}
                rows={3}
                className="avs-input"
              />
              <p className="text-avs-accent/40 mt-1 text-xs">{form.bio?.length ?? 0}/280</p>
            </Field>
            <Field label="Localisation" error={errors.location}>
              <div className="avs-input flex items-center gap-3 pl-3">
                <MapPin size={16} className="text-avs-accent/40" aria-hidden />
                <input
                  type="text"
                  value={form.location}
                  onChange={set('location')}
                  placeholder="Ville, Pays"
                  className="flex-1 border-0 bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Site web" error={errors.website}>
              <div className="avs-input flex items-center gap-3 pl-3">
                <Globe size={16} className="text-avs-accent/40" aria-hidden />
                <input
                  type="url"
                  value={form.website}
                  onChange={set('website')}
                  placeholder="https://exemple.com"
                  className="flex-1 border-0 bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field
              label="Spécialité"
              hint="Votre domaine d'expertise (Ndop, Bogolan, etc.)"
              error={errors.specialty}
            >
              <input
                type="text"
                value={form.specialty}
                onChange={set('specialty')}
                className="avs-input"
              />
            </Field>
          </section>
        )}

        {activeTab === 'social' && (
          <section className="rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs space-y-6 border p-6">
            <Field label="GitHub" hint="Votre nom d'utilisateur GitHub">
              <div className="avs-input flex items-center gap-3 pl-3">
                <i className="pi pi-github text-avs-accent/40" aria-hidden />
                <input
                  type="text"
                  value={form.github}
                  onChange={set('github')}
                  placeholder="username"
                  maxLength={39}
                  className="flex-1 border-0 bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Twitter/X" hint="Votre nom d'utilisateur Twitter">
              <div className="avs-input flex items-center gap-3 pl-3">
                <i className="pi pi-twitter text-avs-accent/40" aria-hidden />
                <input
                  type="text"
                  value={form.twitter}
                  onChange={set('twitter')}
                  placeholder="username"
                  maxLength={15}
                  className="flex-1 border-0 bg-transparent outline-none"
                />
              </div>
            </Field>
          </section>
        )}

        {activeTab === 'stats' && (
          <section className="rounded-avs-lg border-avs-accent/10 bg-avs-secondary shadow-avs border p-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-avs bg-avs-accent/5 p-4">
                <p className="text-avs-accent/40 text-xs font-medium tracking-wider uppercase">
                  Motifs créés
                </p>
                <p className="font-display text-avs-accent mt-2 text-3xl font-bold">0</p>
                <p className="text-avs-accent/50 mt-1 text-xs">À développer</p>
              </div>
              <div className="rounded-avs bg-avs-accent/5 p-4">
                <p className="text-avs-accent/40 text-xs font-medium tracking-wider uppercase">
                  Vues totales
                </p>
                <p className="font-display text-avs-accent mt-2 text-3xl font-bold">0</p>
                <p className="text-avs-accent/50 mt-1 text-xs">À développer</p>
              </div>
              <div className="rounded-avs bg-avs-accent/5 p-4">
                <p className="text-avs-accent/40 text-xs font-medium tracking-wider uppercase">
                  Depuis
                </p>
                <p className="font-display text-avs-accent mt-2 text-lg font-bold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
                <p className="text-avs-accent/50 mt-1 text-xs">Inscription</p>
              </div>
            </div>
            <div className="border-avs-accent/10 mt-6 border-t pt-6">
              <p className="text-avs-accent/60 mb-4 text-sm">Actions de compte</p>
              <button
                onClick={logout}
                className="rounded-avs w-full border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
              >
                Déconnexion
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
