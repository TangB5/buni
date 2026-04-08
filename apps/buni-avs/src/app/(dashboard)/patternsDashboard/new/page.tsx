'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Upload, Plus, X, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { BuniLoader } from '@/components/ui/BuniLoader';

// ── Schémas Zod ────────────────────────────────────────────────────────────────
const Step1Schema = z.object({
  nameFr:      z.string().min(2, 'Minimum 2 caractères').max(128),
  nameEn:      z.string().min(2, 'Minimum 2 caractères').max(128),
  patternType: z.enum(['kente','bogolan','adinkra','ndebele','ndop','wax','kuba','berber']).catch('ndop'),
  region:      z.enum(['west-africa','east-africa','central-africa','north-africa','south-africa','diaspora']).catch('central-africa'),
  country:     z.string().length(2, 'Code pays ISO 2 lettres').toUpperCase(),
  kingdom:     z.string().max(128).optional(),
  era:         z.string().max(64).optional(),
});

const Step2Schema = z.object({
  descFr:         z.string().min(20, 'Minimum 20 caractères').max(2000),
  descEn:         z.string().min(20, 'Minimum 20 caractères').max(2000),
  symbolMeaning:  z.string().min(10).max(512),
  symbolKeywords: z.array(z.string()).min(1, 'Au moins 1 mot-clé').max(10),
  symbolUsage:    z.enum(['ceremonial','daily','royal','spiritual','universal']),
});

const Step3Schema = z.object({
  colorPrimary:   z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur HEX invalide'),
  colorSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur HEX invalide'),
  colorAccent:    z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
});

type Step1Form = z.infer<typeof Step1Schema>;
type Step2Form = z.infer<typeof Step2Schema>;
type Step3Form = z.infer<typeof Step3Schema>;
type FieldErrors = Record<string, string>;

// ── Constantes ─────────────────────────────────────────────────────────────────
const PATTERN_TYPES = ['kente','bogolan','adinkra','ndebele','ndop','wax','kuba','berber'] as const;

const REGIONS = [
  { value:'west-africa',    label:"Afrique de l'Ouest" },
  { value:'east-africa',    label:"Afrique de l'Est" },
  { value:'central-africa', label:"Afrique Centrale" },
  { value:'north-africa',   label:"Afrique du Nord" },
  { value:'south-africa',   label:"Afrique Australe" },
  { value:'diaspora',       label:"Diaspora" },
] as const;

const USAGES = ['ceremonial','daily','royal','spiritual','universal'] as const;

const CSS_PREVIEWS: Record<string, string> = {
  kente:'avs-pattern-kente',   bogolan:'avs-pattern-wax-bold',
  adinkra:'avs-pattern-kente', ndebele:'avs-pattern-wax',
  ndop:'avs-pattern-ndop-royal', wax:'avs-pattern-wax',
  kuba:'avs-pattern-ndop',    berber:'avs-pattern-wax',
};

const STEPS = ['Identité', 'Description', 'Couleurs & Assets', 'Révision'] as const;

// ── Composant Field ────────────────────────────────────────────────────────────
function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="avs-label">
        {label}{required && <span className="ml-0.5 text-avs-primary">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={11} aria-hidden />{error}
        </p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function NewPatternPage() {
  const router  = useRouter();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<FieldErrors>({});

  const [s1, setS1] = useState<Partial<Step1Form>>({});
  const [s2, setS2] = useState<Partial<Step2Form>>({ symbolKeywords: [], symbolUsage: 'ceremonial' });
  const [s3, setS3] = useState<Partial<Step3Form>>({ colorPrimary: '#C0573E', colorSecondary: '#F5EBE0', colorAccent: '' });
  const [newKw, setNewKw] = useState('');

  const validate = (s: number): boolean => {
    try {
      if (s === 0) Step1Schema.parse(s1);
      if (s === 1) Step2Schema.parse(s2);
      if (s === 2) Step3Schema.parse(s3);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe: FieldErrors = {};
        err.issues.forEach(e => { if (e.path[0]) fe[String(e.path[0])] = e.message; });
        setErrors(fe);
      }
      return false;
    }
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const prev = () => { setErrors({}); setStep(s => s - 1); };

  const addKw = () => {
    const kw = newKw.trim().toLowerCase();
    if (kw && !(s2.symbolKeywords ?? []).includes(kw)) {
      setS2(f => ({ ...f, symbolKeywords: [...(f.symbolKeywords ?? []), kw] }));
      setNewKw('');
    }
  };

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    router.push('/dashboard/patterns');
  };

  const previewCSS = CSS_PREVIEWS[s1.patternType ?? ''] ?? 'avs-pattern-wax';

  return (
    <div className="min-h-screen bg-avs-secondary/50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-avs-accent/10 bg-avs-secondary px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button onClick={() => router.back()}
            className="rounded-avs p-2 text-avs-accent/50 hover:bg-avs-accent/8 hover:text-avs-accent">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-avs-accent">Nouveau Motif</h1>
            <p className="text-xs text-avs-accent/50">Étape {step + 1} / {STEPS.length}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Stepper ──────────────────────────────────────────────────────── */}
        <div className="mb-10 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                  ${i < step  ? 'bg-avs-primary text-avs-secondary'
                  : i === step ? 'bg-avs-primary text-avs-secondary ring-4 ring-avs-primary/20'
                               : 'border-2 border-avs-accent/20 text-avs-accent/40'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`hidden sm:block text-[10px] font-semibold whitespace-nowrap
                  ${i === step ? 'text-avs-primary' : 'text-avs-accent/35'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-3 flex-1 h-px transition-colors ${i < step ? 'bg-avs-primary' : 'bg-avs-accent/15'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_260px]">

          {/* ── Formulaire ───────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
              className="avs-card p-7 space-y-6"
            >

              {/* ÉTAPE 1 — Identité */}
              {step === 0 && (<>
                <h2 className="font-display text-lg font-bold text-avs-accent">Identité du motif</h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nom (français)" error={errors['nameFr']} required>
                    <input className="avs-input" value={s1.nameFr ?? ''}
                      onChange={e => setS1(f => ({...f, nameFr: e.target.value}))}
                      placeholder="Ndop Royal Bamoum" />
                  </Field>
                  <Field label="Nom (anglais)" error={errors['nameEn']} required>
                    <input className="avs-input" value={s1.nameEn ?? ''}
                      onChange={e => setS1(f => ({...f, nameEn: e.target.value}))}
                      placeholder="Bamoum Royal Ndop" />
                  </Field>
                </div>

                <Field label="Type de motif" error={errors['patternType']} required>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {PATTERN_TYPES.map(t => (
                      <button key={t} onClick={() => setS1(f => ({...f, patternType: t}))}
                        className={`rounded-avs px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all
                          ${s1.patternType === t
                            ? 'bg-avs-primary text-avs-secondary shadow-avs'
                            : 'border border-avs-accent/20 text-avs-accent/60 hover:border-avs-primary/40'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Région" error={errors['region']} required>
                    <select className="avs-input" value={s1.region ?? ''}
                      onChange={e => setS1(f => ({...f, region: e.target.value as Step1Form['region']}))}>
                      <option value="">Choisir…</option>
                      {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Code pays (ISO 2)" error={errors['country']} required>
                    <input className="avs-input uppercase" maxLength={2} value={s1.country ?? ''}
                      onChange={e => setS1(f => ({...f, country: e.target.value.toUpperCase()}))}
                      placeholder="CM" />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Royaume / Peuple">
                    <input className="avs-input" value={s1.kingdom ?? ''}
                      onChange={e => setS1(f => ({...f, kingdom: e.target.value}))}
                      placeholder="Sultanat Bamoum" />
                  </Field>
                  <Field label="Époque">
                    <input className="avs-input" value={s1.era ?? ''}
                      onChange={e => setS1(f => ({...f, era: e.target.value}))}
                      placeholder="XVIIe siècle — présent" />
                  </Field>
                </div>
              </>)}

              {/* ÉTAPE 2 — Description */}
              {step === 1 && (<>
                <h2 className="font-display text-lg font-bold text-avs-accent">Description & Symbolisme</h2>

                <Field label="Description (français)" error={errors['descFr']} required>
                  <textarea rows={4} className="avs-input resize-none" value={s2.descFr ?? ''}
                    onChange={e => setS2(f => ({...f, descFr: e.target.value}))}
                    placeholder="Décrivez l'histoire et le contexte culturel du motif en français…" />
                  <p className="mt-0.5 text-right text-[10px] text-avs-accent/30">{(s2.descFr ?? '').length}/2000</p>
                </Field>

                <Field label="Description (anglais)" error={errors['descEn']} required>
                  <textarea rows={4} className="avs-input resize-none" value={s2.descEn ?? ''}
                    onChange={e => setS2(f => ({...f, descEn: e.target.value}))}
                    placeholder="Describe the history and cultural context of the pattern in English…" />
                </Field>

                <Field label="Signification symbolique" error={errors['symbolMeaning']} required>
                  <textarea rows={2} className="avs-input resize-none" value={s2.symbolMeaning ?? ''}
                    onChange={e => setS2(f => ({...f, symbolMeaning: e.target.value}))}
                    placeholder="Royauté, spiritualité, protection contre les mauvais esprits…" />
                </Field>

                <Field label="Usage principal" error={errors['symbolUsage']} required>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {USAGES.map(u => (
                      <button key={u} onClick={() => setS2(f => ({...f, symbolUsage: u}))}
                        className={`rounded-avs px-3 py-1.5 text-xs font-semibold capitalize transition-all
                          ${s2.symbolUsage === u
                            ? 'bg-avs-primary text-avs-secondary shadow-avs'
                            : 'border border-avs-accent/20 text-avs-accent/60 hover:border-avs-primary/40'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Mots-clés (1–10)" error={errors['symbolKeywords']} required>
                  <div className="flex gap-2 mb-2">
                    <input className="avs-input flex-1 py-2 text-sm" value={newKw}
                      onChange={e => setNewKw(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKw())}
                      placeholder="Ajouter un mot-clé et Entrée…" />
                    <button onClick={addKw} className="avs-btn-primary py-2 px-3 text-xs"><Plus size={13}/></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(s2.symbolKeywords ?? []).map(kw => (
                      <span key={kw}
                        className="flex items-center gap-1 rounded-avs bg-avs-primary/10 px-2.5 py-1 text-xs font-medium text-avs-primary">
                        {kw}
                        <button
                          onClick={() => setS2(f => ({...f, symbolKeywords: (f.symbolKeywords ?? []).filter(k => k !== kw)}))}
                          className="ml-0.5 hover:text-red-500">
                          <X size={10}/>
                        </button>
                      </span>
                    ))}
                  </div>
                </Field>
              </>)}

              {/* ÉTAPE 3 — Couleurs & Assets */}
              {step === 2 && (<>
                <h2 className="font-display text-lg font-bold text-avs-accent">Couleurs & Assets</h2>

                <div className="grid gap-5 sm:grid-cols-3">
                  {([
                    { key:'colorPrimary',   label:'Couleur principale', req:true },
                    { key:'colorSecondary', label:'Couleur secondaire',  req:true },
                    { key:'colorAccent',    label:'Couleur accent',      req:false },
                  ] as const).map(({ key, label, req }) => (
                    <Field key={key} label={label} error={errors[key]} required={req}>
                      <div className="flex items-center gap-2">
                        <input type="color"
                          value={(s3[key] as string) || '#000000'}
                          onChange={e => setS3(f => ({...f, [key]: e.target.value}))}
                          className="h-10 w-10 cursor-pointer rounded-avs border-2 border-avs-accent/15 bg-white p-0.5"
                          aria-label={label} />
                        <input className="avs-input flex-1 font-mono text-sm uppercase"
                          value={(s3[key] as string) ?? ''}
                          onChange={e => setS3(f => ({...f, [key]: e.target.value}))}
                          placeholder="#000000" maxLength={7} />
                      </div>
                    </Field>
                  ))}
                </div>

                {/* Aperçu palette */}
                <div className="overflow-hidden rounded-avs-lg border border-avs-accent/10">
                  <div className="flex h-14">
                    {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent]
                      .filter(Boolean)
                      .map((c, i) => (
                        <div key={i} className="flex-1 transition-colors" style={{ backgroundColor: c as string }} title={c as string} />
                      ))}
                  </div>
                  <div className="flex gap-4 bg-white px-4 py-2">
                    {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent]
                      .filter(Boolean)
                      .map((c, i) => (
                        <span key={i} className="font-mono text-xs text-avs-accent/50">{c}</span>
                      ))}
                  </div>
                </div>

                {/* Upload SVG */}
                <Field label="Fichier SVG du motif (optionnel)">
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-avs-lg border-2 border-dashed border-avs-accent/20 bg-avs-accent/3 px-6 py-10 transition-colors hover:border-avs-primary/40 hover:bg-avs-primary/4">
                    <Upload size={28} className="text-avs-accent/25" aria-hidden />
                    <div className="text-center">
                      <p className="text-sm text-avs-accent/50">
                        Glisser-déposer ou{' '}
                        <span className="font-semibold text-avs-primary">parcourir</span>
                      </p>
                      <p className="mt-0.5 text-xs text-avs-accent/35">SVG uniquement · max 2 Mo</p>
                    </div>
                    <input type="file" accept=".svg" className="sr-only" />
                  </label>
                  <p className="mt-2 text-xs text-avs-accent/40 leading-relaxed">
                    Le fichier SVG sera placé dans <code className="font-mono bg-avs-accent/8 px-1 rounded">public/patterns/</code> et référencé automatiquement.
                  </p>
                </Field>
              </>)}

              {/* ÉTAPE 4 — Révision */}
              {step === 3 && (<>
                <h2 className="font-display text-lg font-bold text-avs-accent">Révision finale</h2>
                <div className="space-y-2">
                  {([
                    { label:'Nom FR',       value: s1.nameFr },
                    { label:'Nom EN',       value: s1.nameEn },
                    { label:'Type',         value: s1.patternType?.toUpperCase() },
                    { label:'Région',       value: s1.region },
                    { label:'Pays',         value: s1.country },
                    { label:'Royaume',      value: s1.kingdom },
                    { label:'Époque',       value: s1.era },
                    { label:'Usage',        value: s2.symbolUsage },
                    { label:'Mots-clés',    value: (s2.symbolKeywords ?? []).join(', ') },
                    { label:'Couleur 1',    value: s3.colorPrimary },
                    { label:'Couleur 2',    value: s3.colorSecondary },
                  ] as const).map(({ label, value }) => value ? (
                    <div key={label} className="flex items-center gap-3 rounded-avs bg-avs-accent/4 px-4 py-2">
                      <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-avs-accent/40">{label}</span>
                      <span className="text-sm text-avs-accent">{value}</span>
                    </div>
                  ) : null)}
                </div>
                <div className="rounded-avs border-l-4 border-avs-kente bg-avs-kente/8 px-4 py-3 text-xs text-avs-accent/70 leading-relaxed">
                  <strong className="text-avs-accent">ℹ️ Processus de validation :</strong> Votre motif sera relu par un curateur AVS avant publication. Ce processus prend généralement 24–48h ouvrées.
                </div>
              </>)}

              {/* ── Navigation ─────────────────────────────────────────────── */}
              <div className="flex items-center justify-between border-t border-avs-accent/8 pt-4">
                <button onClick={prev} disabled={step === 0}
                  className="avs-btn-secondary py-2 px-4 text-sm gap-1.5 disabled:opacity-30">
                  <ArrowLeft size={14}/> Précédent
                </button>
                {step < STEPS.length - 1 ? (
                  <button onClick={next} className="avs-btn-primary py-2 px-5 text-sm gap-1.5">
                    Suivant <ArrowRight size={14}/>
                  </button>
                ) : (
                  <button onClick={() => void submit()} disabled={loading}
                    className="avs-btn-primary py-2 px-5 text-sm gap-1.5 disabled:opacity-60">
                    {loading
                      ? <><BuniLoader size={20} showText={false} /> Envoi en cours…</>
                      : <><Check size={14}/> Soumettre pour révision</>
                    }
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Aperçu live ────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="avs-card overflow-hidden p-0">
              <div className={`${previewCSS} h-36 transition-all duration-500`} aria-hidden />
              <div className="p-4">
                <p className="font-display font-bold text-avs-accent">
                  {s1.nameFr || <span className="text-avs-accent/30">Nom du motif</span>}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-avs-primary">
                  {s1.patternType ?? '—'} · {s1.country ?? '??'}
                </p>
                <p className="mt-2 text-xs text-avs-accent/55 line-clamp-3">
                  {s2.descFr || <span className="text-avs-accent/25">Description apparaîtra ici…</span>}
                </p>
                {(s2.symbolKeywords ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(s2.symbolKeywords ?? []).slice(0,4).map(kw => (
                      <span key={kw} className="rounded-avs bg-avs-primary/10 px-2 py-0.5 text-[10px] font-medium text-avs-primary">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                {(s3.colorPrimary || s3.colorSecondary) && (
                  <div className="mt-3 flex gap-1.5">
                    {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent].filter(Boolean).map((c, i) => (
                      <span key={i} className="h-4 w-4 rounded-full border border-avs-accent/15 shadow-sm"
                        style={{ backgroundColor: c as string }} title={c as string} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-[10px] text-avs-accent/30 uppercase tracking-widest">
              Aperçu en temps réel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}