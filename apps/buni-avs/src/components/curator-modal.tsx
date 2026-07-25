'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useBecomeCurator } from '@/features/user/hooks/useUser';
import { BecomeCuratorInput, BecomeCuratorSchema } from '@/features/user/schemas/user.schema';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type CuratorForm = BecomeCuratorInput;
type CuratorFieldErrors = Partial<Record<keyof CuratorForm | 'submit', string>>;

// ─────────────────────────────────────────────────────────────────────────────
// MODAL PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface CuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/35">
        {label} {required && <span className="text-red-500">*</span>}
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
// MAIN MODAL
// ─────────────────────────────────────────────────────────────────────────────

export default function CuratorModal({ isOpen, onClose, onSuccess }: CuratorModalProps) {
  const [form, setForm] = useState<CuratorForm>({
    bio: '',
    specialty: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
  });
  const [errors, setErrors] = useState<CuratorFieldErrors>({});
  const becomeCurator = useBecomeCurator();

  const set = (key: keyof CuratorForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const result = BecomeCuratorSchema.safeParse(form);
    if (!result.success) {
      const fe: CuratorFieldErrors = {};
      result.error.issues.forEach((e) => { if (e.path[0]) fe[e.path[0] as keyof CuratorForm] = e.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    try {
      await becomeCurator.mutateAsync(form);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit curator request:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Erreur lors de la soumission' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-avs-accent/8 bg-avs-secondary shadow-2xl"
            >
              {/* Header */}
              <div className="avs-pattern-kente-royale relative h-24 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.85) 0%, rgba(26,18,8,0.70) 100%)' }} />
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 80% at 15% 50%, #C0573E18 0%, transparent 65%)' }} aria-hidden />
                
                <div className="relative flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-avs-primary/20">
                      <Sparkles size={18} className="text-avs-primary" aria-hidden />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-black text-avs-secondary">Devenir Curateur</h2>
                      <p className="text-xs text-avs-secondary/60">Complétez votre profil pour contribuer</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-avs-secondary/20 text-avs-secondary/60 hover:bg-avs-secondary/30 hover:text-avs-secondary transition-colors"
                    aria-label="Fermer"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Required fields */}
                <div className="space-y-4">
                  <Field label="Bio" required error={errors.bio} hint="Décrivez votre expertise en 10-280 caractères">
                    <textarea
                      value={form.bio}
                      onChange={set('bio')}
                      maxLength={280}
                      rows={3}
                      className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all resize-none"
                      placeholder="Tisserand de tradition Ndop depuis 15 ans, je documente les motifs africains..."
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span className="font-mono text-[9px] text-avs-accent/35">{form.bio.length}/280</span>
                    </div>
                  </Field>

                  <Field label="Spécialité" required error={errors.specialty} hint="Votre domaine d'expertise (ex: Ndop, Bogolan, Kente...)">
                    <input
                      type="text"
                      value={form.specialty}
                      onChange={set('specialty')}
                      maxLength={64}
                      className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all"
                      placeholder="Tisserand Ndop"
                    />
                  </Field>

                  <Field label="Localisation" required error={errors.location} hint="Votre ville ou région">
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-avs-accent/30" aria-hidden />
                      <input
                        type="text"
                        value={form.location}
                        onChange={set('location')}
                        maxLength={64}
                        className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 pl-11 pr-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all"
                        placeholder="Foumban, Cameroun"
                      />
                    </div>
                  </Field>
                </div>

                {/* Optional fields */}
                <div className="pt-4 border-t border-avs-accent/8">
                  <p className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-avs-accent/35">Informations optionnelles</p>
                  
                  <div className="space-y-4">
                    <Field label="Site web" error={errors.website}>
                      <input
                        type="url"
                        value={form.website}
                        onChange={set('website')}
                        className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all"
                        placeholder="https://monsite.com"
                      />
                    </Field>

                    <Field label="GitHub" error={errors.github}>
                      <input
                        type="text"
                        value={form.github}
                        onChange={set('github')}
                        maxLength={39}
                        className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all"
                        placeholder="username"
                      />
                    </Field>

                    <Field label="Twitter / X" error={errors.twitter}>
                      <input
                        type="text"
                        value={form.twitter}
                        onChange={set('twitter')}
                        maxLength={15}
                        className="w-full rounded-xl border border-avs-accent/16 bg-avs-accent/4 px-4 py-3 text-sm text-avs-accent placeholder:text-avs-accent/30 focus:border-avs-primary focus:outline-none focus:ring-2 focus:ring-avs-primary/10 transition-all"
                        placeholder="username"
                      />
                    </Field>
                  </div>
                </div>

                {/* Submit error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 p-3"
                  >
                    <p className="flex items-center gap-2 text-xs font-medium text-red-500">
                      <AlertCircle size={12} aria-hidden />
                      {errors.submit}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-avs-accent/8 px-6 py-4 bg-avs-accent/2">
                <button
                  onClick={onClose}
                  disabled={becomeCurator.isPending}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-avs-accent/60 hover:text-avs-accent transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => void handleSubmit()}
                  disabled={becomeCurator.isPending}
                  className="group inline-flex items-center gap-2 rounded-xl bg-avs-primary px-5 py-2.5 text-sm font-bold text-avs-secondary shadow-lg shadow-avs-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-avs-primary/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {becomeCurator.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Soumission...
                    </>
                  ) : (
                    <>
                      <Send size={14} aria-hidden />
                      Soumettre
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
