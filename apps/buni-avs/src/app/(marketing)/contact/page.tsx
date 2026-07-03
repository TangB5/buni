'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MapPin, MessageSquare, Send,
  CheckCircle2, AlertCircle,
  ArrowRight, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Route } from 'next';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name:    z.string().min(2, 'Minimum 2 caractères'),
  email:   z.string().email('Email invalide'),
  subject: z.string().min(3, 'Minimum 3 caractères').max(128),
  message: z.string().min(20, 'Minimum 20 caractères').max(2000),
  role:    z.enum(['artisan', 'designer', 'researcher', 'developer', 'other']),
});
type ContactForm = z.infer<typeof ContactSchema>;
type FieldErrors = Partial<Record<keyof ContactForm, string>>;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  {
    icon:    Mail,
    label:   'Email général',
    value:   'buni@avs-standard.com',
    href:    'mailto:buni@avs-standard.com',
    pattern: 'avs-pattern-wax-dakar',
    accentClass: 'text-avs-primary',
    bgClass:     'bg-avs-primary/8',
  },
  {
    icon:    MessageSquare,
    label:   'Support & contributions',
    value:   'contrib@avs-standard.com',
    href:    'mailto:contrib@avs-standard.com',
    pattern: 'avs-pattern-kente-royale',
    accentClass: 'text-avs-kente',
    bgClass:     'bg-avs-kente/8',
  },
  {
    icon:    MapPin,
    label:   'Basé à',
    value:   'Douala-bonamoussadi',
    href:    undefined,
    pattern: 'avs-pattern-ndop-sultan',
    accentClass: 'text-avs-ndop',
    bgClass:     'bg-avs-ndop/8',
  },
] as const;

const ROLES = [
  { value: 'artisan',    label: 'Artisan / Créateur'   },
  { value: 'designer',   label: 'Designer'              },
  { value: 'researcher', label: 'Chercheur / Académique'},
  { value: 'developer',  label: 'Développeur'           },
  { value: 'other',      label: 'Autre'                 },
] as const;

const FAQS = [
  { q: 'Comment soumettre un motif ?',        a: 'Créez un compte, puis utilisez le formulaire "Nouveau motif" dans votre tableau de bord.' },
  { q: 'Les ressources sont-elles gratuites ?',a: 'Oui. La majorité est sous licence CC BY 4.0, téléchargeable sans compte.' },
  { q: 'Comment devenir curateur ?',           a: 'Contribuez régulièrement pendant 3 mois, puis contactez-nous via ce formulaire.' },
  { q: 'AVS accepte-t-il les partenariats ?', a: 'Oui — musées, universités et entreprises alignées sur nos valeurs culturelles.' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.35) !important; opacity: 1; }
  .dark ::placeholder { color: rgba(236,232,225,0.30) !important; }

  .ct-input {
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
  .ct-input:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }

  .ct-select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--avs-secondary);
    color: var(--avs-accent);
    border: 1.5px solid rgba(29,29,27,0.16);
    border-radius: 0.75rem;
    padding: 0.6875rem 2.5rem 0.6875rem 1rem;
    font-size: 0.875rem;
    width: 100%;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    cursor: pointer;
    font-family: inherit;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(29,29,27,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
  }
  .ct-select:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
  }
  .ct-select option { background: var(--avs-secondary); color: var(--avs-accent); }
`;

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.6, delay, ease },
});

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/35">
        {label}
        {required && <span className="text-avs-primary">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[11px] leading-snug text-avs-accent/35">{hint}</p>}
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
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '', email: '', subject: '', message: '', role: 'other',
  });
  const [errors,    setErrors]    = useState<FieldErrors>({});
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [openFaq,   setOpenFaq]   = useState<number | null>(null);

  const set = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const r = ContactSchema.safeParse(form);
    if (!r.success) {
      const fe: FieldErrors = {};
      r.error.issues.forEach((e) => { if (e.path[0]) fe[e.path[0] as keyof ContactForm] = e.message; });
      setErrors(fe);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="min-h-screen bg-avs-secondary">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="avs-pattern-ndop-sultan relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          {/* Multi-stop gradient overlay — justified inline */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.88) 100%)' }} />
          {/* Radial halo — justified inline */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 60%, rgba(192,87,62,0.16) 0%, transparent 68%)' }} aria-hidden />

          {/* Decor rings */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full border border-avs-primary/8" />
            <div className="absolute -top-8 -right-8 h-52 w-52 rounded-full border border-avs-primary/13" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            

            <motion.h1
              {...fadeUp(0.1)}
              className="font-display font-black leading-[.9] text-avs-secondary"
              style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', letterSpacing: '-0.025em' }}
            >
              Parlons<br />
              <span className="text-avs-primary">patrimoine</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-avs-secondary/55">
              Une question, un partenariat, une contribution à soumettre ?
              Notre équipe distribuée à travers le continent vous répond sous 48h.
            </motion.p>
          </div>
        </section>

        {/* ══ CHANNELS ══════════════════════════════════════════════════════ */}
        <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-avs-accent/9">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href, pattern, accentClass, bgClass }, i) => (
                <motion.div key={label} {...fadeUp(i * 0.08)}>
                  {href ? (
                    <a href={href} className="group block">
                      <ChannelCard Icon={Icon} label={label} value={value} pattern={pattern} accentClass={accentClass} bgClass={bgClass} />
                    </a>
                  ) : (
                    <ChannelCard Icon={Icon} label={label} value={value} pattern={pattern} accentClass={accentClass} bgClass={bgClass} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MAIN GRID — Form + FAQ ════════════════════════════════════════ */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

              {/* ── FORM ───────────────────────────────────────────────────── */}
              <motion.div {...fadeUp(0.1)}>
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-px w-6 bg-avs-primary" aria-hidden />
                    <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">Formulaire</span>
                  </div>
                  <h2 className="font-display text-2xl font-black text-avs-accent" style={{ letterSpacing: '-0.02em' }}>
                    Envoyez-nous un message
                  </h2>
                </div>

                {/* Success state */}
                <AnimatePresence>
                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-5 rounded-2xl border border-avs-ndop/20 bg-avs-ndop/6 p-12 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-avs-ndop/12 text-avs-ndop">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>Message envoyé !</h3>
                        <p className="mt-2 text-sm text-avs-accent/55">Nous vous répondrons dans les 48h ouvrées.</p>
                      </div>
                      <button
                        onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'', role:'other' }); }}
                        className="text-sm font-semibold text-avs-primary underline-offset-3 hover:underline"
                      >
                        Envoyer un autre message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={(e) => void handleSubmit(e)}
                      className="space-y-5 rounded-2xl border border-avs-accent/9 bg-avs-secondary p-7"
                      noValidate
                    >
                      {/* Accent stripe */}
                      <div className="avs-pattern-kente-royale -mx-7 -mt-7 mb-7 h-1 rounded-t-2xl" aria-hidden />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Nom complet" error={errors.name} required>
                          <input className="ct-input" value={form.name} onChange={set('name')} placeholder="Amara Diop" disabled={sending} />
                        </Field>
                        <Field label="Email" error={errors.email} required>
                          <input type="email" className="ct-input" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" disabled={sending} />
                        </Field>
                      </div>

                      <Field label="Vous êtes" error={errors.role} required>
                        <select className="ct-select" value={form.role} onChange={set('role')} disabled={sending}>
                          {ROLES.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Sujet" error={errors.subject} required>
                        <input className="ct-input" value={form.subject} onChange={set('subject')} placeholder="Partenariat, contribution, question…" disabled={sending} />
                      </Field>

                      <Field label="Message" error={errors.message} required hint="Minimum 20 caractères">
                        <textarea className="ct-input" rows={5} value={form.message} onChange={set('message')} placeholder="Décrivez votre demande en détail…" disabled={sending} />
                        <div className="mt-1.5 flex justify-end">
                          <span className="font-mono text-[9px] text-avs-accent/35">{form.message.length}/2000</span>
                        </div>
                      </Field>

                      <button
                        type="submit"
                        disabled={sending}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-300 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-busy={sending}
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                        {sending
                          ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-avs-secondary/30 border-t-avs-secondary" /> Envoi en cours…</>
                          : <><Send size={14} /> Envoyer le message</>
                        }
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── SIDEBAR ────────────────────────────────────────────────── */}
              <div className="space-y-6">

                {/* FAQ */}
                <motion.div {...fadeUp(0.2)}>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-px w-5 bg-avs-primary" aria-hidden />
                      <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">FAQ</span>
                    </div>
                    <h2 className="font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>
                      Questions fréquentes
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {FAQS.map(({ q, a }, i) => (
                      <div key={i} className="overflow-hidden rounded-xl border border-avs-accent/9 bg-avs-secondary">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-avs-accent hover:text-avs-primary transition-colors"
                        >
                          {q}
                          <span className={`shrink-0 transition-transform duration-200 text-avs-accent/35 ${openFaq === i ? 'rotate-180' : ''}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="border-t border-avs-accent/9 px-4 py-3.5 text-xs leading-relaxed text-avs-accent/55">{a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Social links */}
                <motion.div {...fadeUp(0.3)} className="rounded-xl border border-avs-accent/9 bg-avs-secondary p-5">
                  <p className="mb-4 font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/35">Réseaux</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { href: 'https://github.com/avs-standard', icon: "pi pi-Github",  label: 'GitHub',    sub: 'Code source & issues' },
                      { href: 'https://x.com/avs_standard',      icon: "pi pi-Twitter", label: 'Twitter/X', sub: 'Actualités AVS'       },
                    ].map(({ href, icon: Icon, label, sub }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl px-3.5 py-3 border border-avs-accent/9 hover:border-avs-primary/20 hover:bg-avs-primary/4 transition-all duration-150"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-avs-accent/4 text-avs-accent/55 group-hover:text-avs-primary transition-colors">
                          {/* <Icon size={15} /> */}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-avs-accent group-hover:text-avs-primary transition-colors">{label}</p>
                          <p className="text-[10px] text-avs-accent/35">{sub}</p>
                        </div>
                        <ArrowRight size={12} className="ml-auto shrink-0 text-avs-accent/20 group-hover:text-avs-primary transition-colors group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Response time badge */}
                <motion.div {...fadeUp(0.35)} className="flex items-center gap-3 rounded-xl border border-avs-kente/20 bg-avs-kente/6 px-4 py-3.5">
                  <span className="flex h-2 w-2 shrink-0 items-center">
                    <span className="h-2 w-2 animate-ping rounded-full bg-avs-kente opacity-75 absolute" />
                    <span className="h-2 w-2 rounded-full bg-avs-kente relative" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-avs-accent">Délai de réponse</p>
                    <p className="mt-0.5 font-mono text-[9px] text-avs-accent/35">Généralement sous 48h ouvrées</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA BOTTOM ════════════════════════════════════════════════════ */}
        <section className="avs-pattern-bogolan-fanga relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(26,18,8,0.90) 100%)' }} />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-black text-avs-secondary sm:text-3xl" style={{ letterSpacing: '-0.02em' }}>
              Prêt à contribuer au <span className="text-avs-primary">standard africain</span> ?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-avs-secondary/50">
              Rejoignez 312 artisans, chercheurs et designers qui construisent ensemble la plus grande archive visuelle africaine open-source.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={'/auth/register' as Route}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                Créer un compte gratuit
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={'/patterns' as Route}
                className="inline-flex items-center gap-2 rounded-xl border border-avs-secondary/14 px-7 py-3.5 text-sm font-semibold text-avs-secondary/72 hover:border-avs-secondary/28 hover:text-avs-secondary transition-all duration-200"
              >
                Explorer les motifs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANNEL CARD (extracted to avoid repetition)
// ─────────────────────────────────────────────────────────────────────────────

function ChannelCard({ Icon, label, value, pattern, accentClass, bgClass }: {
  Icon: React.ElementType; label: string; value: string;
  pattern: string; accentClass: string; bgClass: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-1 hover:border-avs-primary/20">
      <div className={`${pattern} h-1.5 w-full`} aria-hidden />
      <div className="p-5">
        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bgClass} ${accentClass}`}>
          <Icon size={18} aria-hidden />
        </div>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-avs-accent/35">{label}</p>
        <p className={`mt-1 text-sm font-semibold ${accentClass}`}>{value}</p>
      </div>
    </div>
  );
}