'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Upload,
  Plus, X, AlertCircle, Sparkles,
} from 'lucide-react';
import { z } from 'zod';
import { BuniLoader } from '@buni/ui';
import { Route } from 'next';
import type { Pattern } from 'apps/buni-avs/src/features/patterns/types';
import { patternService } from 'apps/buni-avs/src/features/patterns/services/pattern.service';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const Step1Schema = z.object({
  nameFr:      z.string().min(2, 'Minimum 2 caractères').max(128),
  nameLocal:   z.string().min(2, 'Minimum 2 caractères').max(128),
  nameEn:      z.string().min(2, 'Minimum 2 caractères').max(128),
  patternType: z.enum(['kente','bogolan','adinkra','ndebele','ndop','wax','kuba','berber']).catch('ndop'),
  region:      z.enum(['west-africa','east-africa','central-africa','north-africa','south-africa','diaspora']).catch('central-africa'),
  country:     z.string().length(2, 'Code pays ISO 2 lettres').toUpperCase(),
  people:      z.string().max(128).optional(),
  flag:        z.string().max(8).optional(),
  coords:      z.tuple([z.number(), z.number()]).optional(),
  kingdom:     z.string().max(128).optional(),
  era:         z.string().max(64).optional(),
  license:     z.enum(['cc0','cc-by','cc-by-sa','proprietary']).default('cc-by'),
});

const Step2Schema = z.object({
  descFr:         z.string().min(20, 'Minimum 20 caractères').max(2000),
  descEn:         z.string().min(20, 'Minimum 20 caractères').max(2000),
  summary:        z.string().min(10, 'Résumé du motif').max(500),
  history:        z.string().min(10, 'Contexte historique').max(2000),
  technique:      z.string().min(10, 'Technique de fabrication').max(1000),
  symbolMeaning:  z.string().min(10).max(512),
  ceremonial:     z.string().min(10, 'Usage cérémoniel').max(1000),
  symbolKeywords: z.array(z.string()).min(1, 'Au moins 1 mot-clé').max(10),
  symbolUsage:    z.enum(['ceremonial','daily','royal','spiritual','universal']),
});

const Step3Schema = z.object({
  colors: z.array(z.object({
    hex:     z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur HEX invalide'),
    name:    z.string().min(1, 'Nom de la couleur'),
    meaning: z.string().min(1, 'Signification de la couleur'),
  })).min(2, 'Au moins 2 couleurs').max(5),
  svgPattern:   z.string().optional(),
  artisanQuote: z.object({
    text:    z.string().min(10).max(500),
    author:  z.string().min(2).max(128),
    role:    z.string().min(2).max(128),
    country: z.string().min(2).max(64),
  }).optional(),
  sources: z.array(z.string().min(1)).min(1, 'Au moins une source').max(10),
  symbols: z.array(z.object({
    name:       z.string().min(1),
    nameFr:     z.string().min(1),
    cssPreview: z.string().min(1),
    meaning:    z.string().min(1),
    usage:      z.string().min(1),
    sacred:     z.boolean(),
    image:      z.instanceof(File).optional(),
  })).min(1, 'Au moins un symbole').max(20),
});

type Step1Form  = z.infer<typeof Step1Schema>;
type Step2Form  = z.infer<typeof Step2Schema>;
type Step3Form  = z.infer<typeof Step3Schema>;
type FieldErrors = Record<string, string>;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PATTERN_TYPES = ['kente','bogolan','adinkra','ndebele','ndop','wax','kuba','berber'] as const;

const REGIONS = [
  { value: 'west-africa',    label: "Afrique de l'Ouest" },
  { value: 'east-africa',    label: "Afrique de l'Est"   },
  { value: 'central-africa', label: 'Afrique Centrale'   },
  { value: 'north-africa',   label: "Afrique du Nord"    },
  { value: 'south-africa',   label: 'Afrique Australe'   },
  { value: 'diaspora',       label: 'Diaspora'            },
] as const;

const USAGES = ['ceremonial','daily','royal','spiritual','universal'] as const;

const LICENSES = [
  { value: 'cc0',        label: 'CC0'        },
  { value: 'cc-by',      label: 'CC BY'      },
  { value: 'cc-by-sa',   label: 'CC BY-SA'   },
  { value: 'proprietary', label: 'Proprietary' },
] as const;

const CSS_PREVIEWS: Record<string, string> = {
  kente:   'avs-pattern-kente-royale',
  bogolan: 'avs-pattern-bogolan-fanga',
  adinkra: 'avs-pattern-adinkra-sankofa',
  ndebele: 'avs-pattern-wax-dakar',
  ndop:    'avs-pattern-ndop-sultan',
  wax:     'avs-pattern-wax-dakar',
  kuba:    'avs-pattern-kuba-kasai',
  berber:  'avs-pattern-bogolan-fanga',
};

const STEPS = [
  { label: 'Identité',          desc: 'Nom & origine géographique' },
  { label: 'Description',       desc: 'Contexte & symbolisme'      },
  { label: 'Couleurs & Assets', desc: 'Palette & fichier SVG'      },
  { label: 'Révision',          desc: 'Vérification avant envoi'   },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label, error, required, hint, children,
}: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="avs-label flex items-center gap-1.5">
        {label}
        {required && <span className="text-avs-primary">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-[11px] leading-snug text-avs-accent/40">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs font-medium text-red-500"
          >
            <AlertCircle size={11} aria-hidden /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PILL BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl px-3.5 py-1.5
        font-mono text-[9px] font-black tracking-[0.14em] uppercase
        transition-all duration-200
        ${active
          ? 'bg-avs-primary text-avs-secondary shadow-avs'
          : 'border border-avs-accent/15 text-avs-accent/50 bg-avs-secondary hover:border-avs-primary/20 hover:text-avs-primary'
        }
      `}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP TITLE
// ─────────────────────────────────────────────────────────────────────────────

function StepTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 border-b border-avs-accent/10 pb-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-px w-5 bg-avs-primary" aria-hidden />
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-primary">
          {sub}
        </span>
      </div>
      <h2 className="font-display text-xl font-black leading-tight tracking-tight text-avs-accent">
        {title}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAR COUNTER
// ─────────────────────────────────────────────────────────────────────────────

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1 flex justify-end font-mono text-[9px] text-avs-accent/30">
      {value.length}/{max}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHED ADD BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function AddRowBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full rounded-xl border-2 border-dashed border-avs-accent/15 p-3
        text-xs font-semibold text-avs-accent/40
        transition-all duration-150
        hover:border-avs-primary/30 hover:text-avs-primary
      "
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECT WRAPPER (accessible chevron)
// ─────────────────────────────────────────────────────────────────────────────

function Select({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="avs-input appearance-none pr-9"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/30"
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        aria-hidden
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function NewPatternPage() {
  const router = useRouter();

  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<FieldErrors>({});
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [newKw,   setNewKw]   = useState('');

  const [s1, setS1] = useState<Partial<Step1Form>>({ license: 'cc-by' });
  const [s2, setS2] = useState<Partial<Step2Form>>({
    symbolKeywords: [],
    symbolUsage:    'ceremonial',
    summary:        '',
    history:        '',
    technique:      '',
    ceremonial:     '',
    symbolMeaning:  '',
  });
  const [s3, setS3] = useState<Partial<Step3Form>>({
    colors: [
      { hex: '#C0573E', name: 'Primaire',   meaning: 'Couleur principale'  },
      { hex: '#F5EBE0', name: 'Secondaire', meaning: 'Couleur secondaire'  },
    ],
    svgPattern:   '',
    artisanQuote: undefined,
    sources:      [],
    symbols:      [],
  });

  const validate = useCallback((s: number): boolean => {
    try {
      if (s === 0) Step1Schema.parse(s1);
      if (s === 1) Step2Schema.parse(s2);
      if (s === 2) Step3Schema.parse(s3);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe: FieldErrors = {};
        err.issues.forEach((e) => { if (e.path[0]) fe[String(e.path[0])] = e.message; });
        setErrors(fe);
      }
      return false;
    }
  }, [s1, s2, s3]);

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const prev = () => { setErrors({}); setStep((s) => s - 1); };

  const addKw = () => {
    const kw = newKw.trim().toLowerCase();
    if (kw && !(s2.symbolKeywords ?? []).includes(kw)) {
      setS2((f) => ({ ...f, symbolKeywords: [...(f.symbolKeywords ?? []), kw] }));
      setNewKw('');
    }
  };

  const submit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    try {
      // Build FormData with all fields - backend will parse and validate
      const formData = new FormData();

      // Step 1 fields
      formData.append('nameFr', s1.nameFr ?? '');
      formData.append('nameEn', s1.nameEn ?? '');
      formData.append('nameLocal', s1.nameLocal ?? '');
      formData.append('patternType', s1.patternType ?? '');
      formData.append('region', s1.region ?? '');
      formData.append('country', s1.country ?? '');
      formData.append('people', s1.people ?? '');
      formData.append('flag', s1.flag ?? '');
      if (s1.coords) formData.append('coords', JSON.stringify(s1.coords));
      formData.append('kingdom', s1.kingdom ?? '');
      formData.append('era', s1.era ?? '');
      formData.append('license', s1.license ?? 'cc-by');

      // Step 2 fields
      formData.append('descFr', s2.descFr ?? '');
      formData.append('descEn', s2.descEn ?? '');
      formData.append('summary', s2.summary ?? '');
      formData.append('history', s2.history ?? '');
      formData.append('technique', s2.technique ?? '');
      formData.append('symbolMeaning', s2.symbolMeaning ?? '');
      formData.append('symbolUsage', s2.symbolUsage ?? '');
      formData.append('ceremonial', s2.ceremonial ?? '');
      formData.append('symbolKeywords', JSON.stringify(s2.symbolKeywords || []));

      // Step 3 fields
      formData.append('colors', JSON.stringify(s3.colors || []));
      formData.append('sources', JSON.stringify(s3.sources || []));
      
      // Symbols with images
      const symbolsData = (s3.symbols || []).map(sym => ({
        name: sym.name,
        nameFr: sym.nameFr,
        cssPreview: sym.cssPreview,
        meaning: sym.meaning,
        usage: sym.usage,
        sacred: sym.sacred
      }));
      formData.append('symbols', JSON.stringify(symbolsData));
      
      // Add symbol images
      (s3.symbols || []).forEach((sym, index) => {
        if (sym.image) {
          formData.append(`symbolImage_${index}`, sym.image);
        }
      });
      
      if (s3.artisanQuote) formData.append('artisanQuote', JSON.stringify(s3.artisanQuote));
      if (s3.svgPattern) formData.append('svgPattern', s3.svgPattern);

      const result = await patternService.create(formData as any);
      if (result && result.id) {
        router.push(`/dashboard/patternsDashboard/${result.id}?created=true` as Route);
      } else {
        // Fallback to patterns list if no ID returned
        router.push('/dashboard/patternsDashboard?created=true' as Route);
      }
    } catch (err: any) {
      // Extract backend error messages
      let errorMessage = 'Erreur réseau';
      
      if (err?.response?.data) {
        // Backend returned structured error
        const backendError = err.response.data;
        if (backendError.message) {
          errorMessage = backendError.message;
          // Add field-specific errors if available
          if (backendError.errors && Array.isArray(backendError.errors)) {
            const fieldErrors = backendError.errors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join(', ');
            errorMessage += ` (${fieldErrors})`;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const previewCSS = CSS_PREVIEWS[s1.patternType ?? ''] ?? 'avs-pattern-wax-dakar';
  const progress   = (step / (STEPS.length - 1)) * 100;

  // ── helpers for Step3 arrays ──────────────────────────────────────────────

  const updateColor = (i: number, patch: Partial<Step3Form['colors'][number]>) =>
    setS3((f) => {
      const next = [...(f.colors ?? [])];
      next[i] = { ...next[i]!, ...patch };
      return { ...f, colors: next };
    });

  const removeColor = (i: number) =>
    setS3((f) => ({ ...f, colors: (f.colors ?? []).filter((_, idx) => idx !== i) }));

  const updateSource = (i: number, val: string) =>
    setS3((f) => {
      const next = [...(f.sources ?? [])];
      next[i] = val;
      return { ...f, sources: next };
    });

  const removeSource = (i: number) =>
    setS3((f) => ({ ...f, sources: (f.sources ?? []).filter((_, idx) => idx !== i) }));

  const updateSymbol = (i: number, patch: Partial<Step3Form['symbols'][number]>) =>
    setS3((f) => {
      const next = [...(f.symbols ?? [])];
      next[i] = { ...next[i]!, ...patch };
      return { ...f, symbols: next };
    });

  const removeSymbol = (i: number) =>
    setS3((f) => ({ ...f, symbols: (f.symbols ?? []).filter((_, idx) => idx !== i) }));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-avs-secondary">

      {/* ── Loading overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/60 backdrop-blur-sm"
          >
            <div className="avs-card flex flex-col items-center gap-4 p-8">
              <BuniLoader size={36} showText={false} />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-avs-accent/40 animate-pulse">
                Envoi en cours…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-avs-accent/10 bg-avs-secondary/95 backdrop-blur-xl">
        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-avs-accent/10">
          <motion.div
            className="h-full rounded-full bg-avs-primary"
            style={{ originX: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            aria-label="Retour"
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              border border-avs-accent/15 text-avs-accent/40
              transition-all duration-150
              hover:border-avs-accent/25 hover:text-avs-accent
            "
          >
            <ArrowLeft size={16} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-black tracking-tight text-avs-accent">
                Nouveau Motif
              </h1>
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-lg border border-avs-primary/20 bg-avs-primary/10 px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.14em] uppercase text-avs-primary"
                >
                  {STEPS[step]?.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-0.5 text-[11px] text-avs-accent/40">
              Étape {step + 1} / {STEPS.length} — {STEPS[step]?.desc}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Stepper ────────────────────────────────────────────────────── */}
        <div className="mb-10 flex items-center">
          {STEPS.map(({ label }, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={i <= step ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full
                    text-xs font-bold transition-all duration-300
                    ${i < step
                      ? 'bg-avs-primary text-avs-secondary'
                      : i === step
                        ? 'bg-avs-primary text-avs-secondary ring-4 ring-avs-primary/15'
                        : 'border border-avs-accent/15 bg-avs-secondary text-avs-accent/30'
                    }
                  `}
                >
                  {i < step ? <Check size={13} strokeWidth={3} /> : <span>{i + 1}</span>}
                </motion.div>
                <span className={`
                  hidden sm:block font-mono text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap
                  ${i === step ? 'text-avs-primary' : 'text-avs-accent/30'}
                `}>
                  {label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="relative mx-3 h-px flex-1 overflow-hidden bg-avs-accent/15">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-avs-primary"
                    animate={{ width: i < step ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_272px]">

          {/* ── Form panel ────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="avs-card overflow-hidden"
            >
              {/* Top accent strip */}
              <div className="avs-pattern-ndop-sultan h-1 w-full" aria-hidden />

              <div className="space-y-6 p-7">

                {/* ════════════════════════════════════════════════════════
                    STEP 1 — Identité
                ════════════════════════════════════════════════════════ */}
                {step === 0 && (
                  <>
                    <StepTitle title="Identité du motif" sub="Étape 1" />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Nom (français)" error={errors['nameFr']} required>
                        <input className="avs-input" value={s1.nameFr ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, nameFr: e.target.value }))}
                          placeholder="Ndop Royal Bamoum" />
                      </Field>
                      <Field label="Nom local" error={errors['nameLocal']} required>
                        <input className="avs-input" value={s1.nameLocal ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, nameLocal: e.target.value }))}
                          placeholder="Ndop (Ndoup)" />
                      </Field>
                      <Field label="Nom (anglais)" error={errors['nameEn']} required>
                        <input className="avs-input" value={s1.nameEn ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, nameEn: e.target.value }))}
                          placeholder="Bamoum Royal Ndop" />
                      </Field>
                      <Field label="Licence" error={errors['license']} required>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {LICENSES.map((l) => (
                            <PillBtn key={l.value} label={l.label}
                              active={s1.license === l.value}
                              onClick={() => setS1((f) => ({ ...f, license: l.value as Step1Form['license'] }))} />
                          ))}
                        </div>
                      </Field>
                    </div>

                    <Field label="Type de motif" error={errors['patternType']} required>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {PATTERN_TYPES.map((t) => (
                          <PillBtn key={t} label={t} active={s1.patternType === t}
                            onClick={() => setS1((f) => ({ ...f, patternType: t }))} />
                        ))}
                      </div>
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Région" error={errors['region']} required>
                        <Select value={s1.region ?? ''}
                          onChange={(v) => setS1((f) => ({ ...f, region: v as Step1Form['region'] }))}>
                          <option value="">Choisir…</option>
                          {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </Select>
                      </Field>
                      <Field label="Code pays (ISO 2)" error={errors['country']} required hint="Ex : CM pour Cameroun">
                        <input className="avs-input font-mono uppercase" maxLength={2}
                          value={s1.country ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, country: e.target.value.toUpperCase() }))}
                          placeholder="CM" />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Peuple / Ethnie">
                        <input className="avs-input" value={s1.people ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, people: e.target.value }))}
                          placeholder="Peuple Bamoum (Bamum)" />
                      </Field>
                      <Field label="Drapeau (emoji)">
                        <input className="avs-input" value={s1.flag ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, flag: e.target.value }))}
                          placeholder="🇨🇲" maxLength={8} />
                      </Field>
                      <Field label="Royaume">
                        <input className="avs-input" value={s1.kingdom ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, kingdom: e.target.value }))}
                          placeholder="Sultanat Bamoum" />
                      </Field>
                      <Field label="Époque">
                        <input className="avs-input" value={s1.era ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, era: e.target.value }))}
                          placeholder="XVIIe siècle — présent" />
                      </Field>
                    </div>

                    <Field label="Coordonnées géographiques (latitude, longitude)">
                      <div className="grid grid-cols-2 gap-2">
                        <input className="avs-input" type="number" step="0.0001"
                          value={s1.coords?.[0] ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, coords: [parseFloat(e.target.value) || 0, f.coords?.[1] ?? 0] }))}
                          placeholder="6.6885" />
                        <input className="avs-input" type="number" step="0.0001"
                          value={s1.coords?.[1] ?? ''}
                          onChange={(e) => setS1((f) => ({ ...f, coords: [f.coords?.[0] ?? 0, parseFloat(e.target.value) || 0] }))}
                          placeholder="11.1640" />
                      </div>
                    </Field>
                  </>
                )}

                {/* ════════════════════════════════════════════════════════
                    STEP 2 — Description
                ════════════════════════════════════════════════════════ */}
                {step === 1 && (
                  <>
                    <StepTitle title="Description & Symbolisme" sub="Étape 2" />

                    <Field label="Résumé" error={errors['summary']} required>
                      <textarea rows={2} className="avs-input resize-none" value={s2.summary ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, summary: e.target.value }))}
                        placeholder="Brève description utilisée dans les listes et aperçus…" />
                      <CharCount value={s2.summary ?? ''} max={500} />
                    </Field>

                    <Field label="Description (français)" error={errors['descFr']} required>
                      <textarea rows={4} className="avs-input resize-none" value={s2.descFr ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, descFr: e.target.value }))}
                        placeholder="Décrivez l'histoire et le contexte culturel du motif en français…" />
                      <CharCount value={s2.descFr ?? ''} max={2000} />
                    </Field>

                    <Field label="Description (anglais)" error={errors['descEn']} required>
                      <textarea rows={4} className="avs-input resize-none" value={s2.descEn ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, descEn: e.target.value }))}
                        placeholder="Describe the history and cultural context in English…" />
                    </Field>

                    <Field label="Histoire" error={errors['history']} required>
                      <textarea rows={3} className="avs-input resize-none" value={s2.history ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, history: e.target.value }))}
                        placeholder="Contexte historique détaillé, évolution au fil du temps…" />
                      <CharCount value={s2.history ?? ''} max={2000} />
                    </Field>

                    <Field label="Technique de fabrication" error={errors['technique']} required>
                      <textarea rows={3} className="avs-input resize-none" value={s2.technique ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, technique: e.target.value }))}
                        placeholder="Matériaux, savoir-faire, étapes de fabrication…" />
                      <CharCount value={s2.technique ?? ''} max={1000} />
                    </Field>

                    <Field label="Signification symbolique" error={errors['symbolMeaning']} required>
                      <textarea rows={2} className="avs-input resize-none" value={s2.symbolMeaning ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, symbolMeaning: e.target.value }))}
                        placeholder="Royauté, spiritualité, protection contre les mauvais esprits…" />
                    </Field>

                    <Field label="Usage principal" error={errors['symbolUsage']} required>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {USAGES.map((u) => (
                          <PillBtn key={u} label={u} active={s2.symbolUsage === u}
                            onClick={() => setS2((f) => ({ ...f, symbolUsage: u }))} />
                        ))}
                      </div>
                    </Field>

                    <Field label="Usage cérémoniel" error={errors['ceremonial']} required>
                      <textarea rows={2} className="avs-input resize-none" value={s2.ceremonial ?? ''}
                        onChange={(e) => setS2((f) => ({ ...f, ceremonial: e.target.value }))}
                        placeholder="Contextes cérémoniels où le motif est utilisé…" />
                      <CharCount value={s2.ceremonial ?? ''} max={1000} />
                    </Field>

                    <Field label="Mots-clés (1–10)" error={errors['symbolKeywords']} required>
                      <div className="flex gap-2">
                        <input
                          className="avs-input flex-1"
                          value={newKw}
                          onChange={(e) => setNewKw(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKw(); } }}
                          placeholder="Ajouter un mot-clé et Entrée…"
                        />
                        <button type="button" onClick={addKw}
                          className="avs-btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0">
                          <Plus size={15} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {(s2.symbolKeywords ?? []).length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden"
                          >
                            {(s2.symbolKeywords ?? []).map((kw) => (
                              <span key={kw}
                                className="flex items-center gap-1.5 rounded-lg border border-avs-primary/20 bg-avs-primary/10 px-3 py-1.5 font-mono text-xs font-medium text-avs-primary">
                                {kw}
                                <button type="button" aria-label={`Supprimer ${kw}`}
                                  onClick={() => setS2((f) => ({ ...f, symbolKeywords: (f.symbolKeywords ?? []).filter((k) => k !== kw) }))}
                                  className="text-avs-primary/60 transition-colors hover:text-red-500">
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Field>
                  </>
                )}

                {/* ════════════════════════════════════════════════════════
                    STEP 3 — Couleurs & Assets
                ════════════════════════════════════════════════════════ */}
                {step === 2 && (
                  <>
                    <StepTitle title="Couleurs & Assets" sub="Étape 3" />

                    {/* Color palette */}
                    <Field label="Palette de couleurs" required error={errors['colors']}>
                      <div className="space-y-3">
                        {(s3.colors ?? []).map((color, i) => (
                          <div key={i} className="avs-card flex flex-col gap-3 p-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                              {/* Swatch + native picker */}
                              <label className="relative shrink-0 cursor-pointer">
                                <input type="color" value={color.hex}
                                  onChange={(e) => updateColor(i, { hex: e.target.value })}
                                  className="sr-only" />
                                <div
                                  className="h-10 w-10 rounded-xl ring-1 ring-black/10 transition-transform hover:scale-105"
                                  style={{ background: color.hex, boxShadow: `0 2px 8px ${color.hex}40` }}
                                />
                              </label>
                              <input className="avs-input font-mono text-sm uppercase w-30" maxLength={7}
                                value={color.hex} onChange={(e) => updateColor(i, { hex: e.target.value })}
                                placeholder="#C0573E" />
                            </div>
                            <div className="flex gap-3 flex-1 min-w-0">
                              <input className="avs-input flex-1 min-w-0"
                                value={color.name} onChange={(e) => updateColor(i, { name: e.target.value })}
                                placeholder="Nom de la couleur" />
                              <input className="avs-input flex-1 min-w-0"
                                value={color.meaning} onChange={(e) => updateColor(i, { meaning: e.target.value })}
                                placeholder="Signification" />
                            </div>
                            <button type="button" onClick={() => removeColor(i)}
                              className="shrink-0 rounded-lg p-2 text-avs-accent/30 transition-colors hover:bg-red-50 hover:text-red-500 sm:self-start">
                              <X size={15} />
                            </button>
                          </div>
                        ))}

                        {/* Color bar preview */}
                        {(s3.colors ?? []).length > 0 && (
                          <div className="flex h-3 overflow-hidden rounded-full">
                            {(s3.colors ?? []).map((c) => (
                              <div key={c.hex} className="flex-1" style={{ background: c.hex }} title={c.name} />
                            ))}
                          </div>
                        )}

                        <AddRowBtn label="+ Ajouter une couleur"
                          onClick={() => setS3((f) => ({
                            ...f,
                            colors: [...(f.colors ?? []), { hex: '#000000', name: '', meaning: '' }],
                          }))} />
                      </div>
                    </Field>

                    <Field label="Classe CSS du pattern" hint="Ex : avs-pattern-ndop-sultan">
                      <input className="avs-input font-mono" value={s3.svgPattern ?? ''}
                        onChange={(e) => setS3((f) => ({ ...f, svgPattern: e.target.value }))}
                        placeholder="avs-pattern-ndop-sultan" />
                    </Field>

                    {/* SVG upload */}
                    <Field label="Fichier SVG du motif" hint="SVG uniquement · max 2 Mo · Optionnel">
                      <label className={`
                        group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-10
                        border-2 border-dashed transition-all duration-200
                        ${svgFile
                          ? 'border-avs-primary/40 bg-avs-primary/5'
                          : 'border-avs-accent/15 bg-avs-secondary hover:border-avs-primary/25'
                        }
                      `}>
                        <div className={`
                          flex h-12 w-12 items-center justify-center rounded-xl
                          border transition-transform duration-300 group-hover:scale-105
                          ${svgFile
                            ? 'border-avs-primary/20 bg-avs-primary/10 text-avs-primary'
                            : 'border-avs-accent/10 bg-avs-secondary text-avs-accent/30'
                          }
                        `}>
                          {svgFile ? <Check size={22} /> : <Upload size={22} />}
                        </div>
                        {svgFile ? (
                          <div className="text-center">
                            <p className="text-sm font-semibold text-avs-primary">{svgFile.name}</p>
                            <p className="mt-0.5 text-xs text-avs-accent/40">{(svgFile.size / 1024).toFixed(1)} Ko</p>
                          </div>
                        ) : (
                          <p className="text-sm text-avs-accent/40">
                            Glisser-déposer ou <span className="font-semibold text-avs-primary">parcourir</span>
                          </p>
                        )}
                        <input type="file" accept=".svg" className="sr-only"
                          onChange={(e) => setSvgFile(e.target.files?.[0] ?? null)} />
                      </label>
                      {svgFile && (
                        <button type="button" onClick={() => setSvgFile(null)}
                          className="mt-2 flex items-center gap-1.5 text-xs text-avs-accent/40 transition-colors hover:text-red-500">
                          <X size={11} /> Supprimer le fichier
                        </button>
                      )}
                    </Field>

                    {/* Artisan quote */}
                    <Field label="Citation d'artisan (optionnel)">
                      <div className="space-y-3">
                        <textarea rows={2} className="avs-input resize-none"
                          value={s3.artisanQuote?.text ?? ''}
                          onChange={(e) => setS3((f) => ({ ...f, artisanQuote: { ...f.artisanQuote, text: e.target.value, author: f.artisanQuote?.author ?? '', role: f.artisanQuote?.role ?? '', country: f.artisanQuote?.country ?? '' } }))}
                          placeholder="Le Kente ne se porte pas, il se lit. Chaque fil est une lettre…" />
                        <div className="grid gap-3 sm:grid-cols-3">
                          <input className="avs-input"
                            value={s3.artisanQuote?.author ?? ''}
                            onChange={(e) => setS3((f) => ({ ...f, artisanQuote: { ...f.artisanQuote!, author: e.target.value } }))}
                            placeholder="Nom de l'artisan" />
                          <input className="avs-input"
                            value={s3.artisanQuote?.role ?? ''}
                            onChange={(e) => setS3((f) => ({ ...f, artisanQuote: { ...f.artisanQuote!, role: e.target.value } }))}
                            placeholder="Rôle" />
                          <input className="avs-input"
                            value={s3.artisanQuote?.country ?? ''}
                            onChange={(e) => setS3((f) => ({ ...f, artisanQuote: { ...f.artisanQuote!, country: e.target.value } }))}
                            placeholder="Pays" maxLength={64} />
                        </div>
                      </div>
                    </Field>

                    {/* Sources */}
                    <Field label="Sources et références" required error={errors['sources']}>
                      <div className="space-y-2">
                        {(s3.sources ?? []).map((src, i) => (
                          <div key={i} className="flex gap-2">
                            <input className="avs-input flex-1" value={src}
                              onChange={(e) => updateSource(i, e.target.value)}
                              placeholder="Livre, article, site web…" />
                            <button type="button" onClick={() => removeSource(i)}
                              className="shrink-0 rounded-lg p-2 text-avs-accent/30 transition-colors hover:text-red-500">
                              <X size={15} />
                            </button>
                          </div>
                        ))}
                        <AddRowBtn label="+ Ajouter une source"
                          onClick={() => setS3((f) => ({ ...f, sources: [...(f.sources ?? []), ''] }))} />
                      </div>
                    </Field>

                    {/* Symbols */}
                    <Field label="Symboles constitutifs" required error={errors['symbols']}>
                      <div className="space-y-4">
                        {(s3.symbols ?? []).map((sym, i) => (
                          <div key={i} className="avs-card space-y-3 p-4">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/40">
                                Symbole {i + 1}
                              </span>
                              <button type="button" onClick={() => removeSymbol(i)}
                                className="rounded-lg p-1.5 text-avs-accent/30 transition-colors hover:text-red-500">
                                <X size={14} />
                              </button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input className="avs-input" value={sym.name}
                                onChange={(e) => updateSymbol(i, { name: e.target.value })}
                                placeholder="Nom du symbole (en)" />
                              <input className="avs-input" value={sym.nameFr}
                                onChange={(e) => updateSymbol(i, { nameFr: e.target.value })}
                                placeholder="Nom français" />
                            </div>
                            <input className="avs-input font-mono" value={sym.cssPreview}
                              onChange={(e) => updateSymbol(i, { cssPreview: e.target.value })}
                              placeholder="Couleur HEX ou classe CSS (#D4A017)" />
                            <textarea rows={2} className="avs-input resize-none" value={sym.meaning}
                              onChange={(e) => updateSymbol(i, { meaning: e.target.value })}
                              placeholder="Signification du symbole…" />
                            <textarea rows={2} className="avs-input resize-none" value={sym.usage}
                              onChange={(e) => updateSymbol(i, { usage: e.target.value })}
                              placeholder="Usage du symbole…" />
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-avs-accent/70">
                              <input type="checkbox" checked={sym.sacred}
                                onChange={(e) => updateSymbol(i, { sacred: e.target.checked })}
                                className="rounded accent-avs-primary" />
                              Symbole sacré
                            </label>
                            <div className="space-y-2">
                              <label className="block text-xs font-mono uppercase tracking-[0.15em] text-avs-accent/40">
                                Image du symbole
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      updateSymbol(i, { image: file });
                                    }
                                  }}
                                  className="hidden"
                                  id={`symbol-image-${i}`}
                                />
                                <label
                                  htmlFor={`symbol-image-${i}`}
                                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-avs-accent/20 p-4 transition-colors hover:border-avs-primary/40 hover:bg-avs-accent/5"
                                >
                                  {sym.image ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 overflow-hidden rounded">
                                        <img
                                          src={URL.createObjectURL(sym.image)}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <span className="text-xs text-avs-accent/60">
                                        {sym.image.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <Upload size={16} className="text-avs-accent/40" />
                                      <span className="text-xs text-avs-accent/40">
                                        Cliquer pour uploader une image
                                      </span>
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                        <AddRowBtn label="+ Ajouter un symbole"
                          onClick={() => setS3((f) => ({
                            ...f,
                            symbols: [...(f.symbols ?? []), { name: '', nameFr: '', cssPreview: '', meaning: '', usage: '', sacred: false, image: undefined }],
                          }))} />
                      </div>
                    </Field>
                  </>
                )}

                {/* ════════════════════════════════════════════════════════
                    STEP 4 — Révision
                ════════════════════════════════════════════════════════ */}
                {step === 3 && (
                  <>
                    <StepTitle title="Révision finale" sub="Étape 4" />

                    <div className="space-y-1.5">
                      {([
                        { label: 'Nom FR',    value: s1.nameFr },
                        { label: 'Nom EN',    value: s1.nameEn },
                        { label: 'Type',      value: s1.patternType?.toUpperCase() },
                        { label: 'Région',    value: REGIONS.find((r) => r.value === s1.region)?.label },
                        { label: 'Pays',      value: s1.country },
                        { label: 'Peuple',    value: s1.people },
                        { label: 'Royaume',   value: s1.kingdom },
                        { label: 'Époque',    value: s1.era },
                        { label: 'Usage',     value: s2.symbolUsage },
                        { label: 'Licence',   value: s1.license?.toUpperCase() },
                        { label: 'Mots-clés', value: (s2.symbolKeywords ?? []).join(', ') },
                      ] as const).filter((row) => row.value).map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-3 rounded-xl border border-avs-accent/10 bg-avs-secondary-dark px-4 py-2.5">
                          <span className="w-24 shrink-0 font-mono text-[9px] font-black tracking-[0.16em] uppercase text-avs-accent/40">
                            {label}
                          </span>
                          <span className="text-sm font-medium text-avs-accent">{value}</span>
                        </div>
                      ))}

                      {/* Palette preview row */}
                      {(s3.colors ?? []).length > 0 && (
                        <div className="flex items-center gap-3 rounded-xl border border-avs-accent/10 bg-avs-secondary-dark px-4 py-2.5">
                          <span className="w-24 shrink-0 font-mono text-[9px] font-black tracking-[0.16em] uppercase text-avs-accent/40">
                            Palette
                          </span>
                          <div className="flex gap-2">
                            {(s3.colors ?? []).map((c) => (
                              <span key={c.hex} className="h-5 w-5 rounded-lg ring-1 ring-black/10"
                                style={{ background: c.hex }} title={c.name} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Validation notice */}
                    <div className="rounded-xl border border-avs-kente/20 bg-avs-kente/8 p-4 text-sm leading-relaxed" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-avs-kente)' }}>
                      <p className="mb-1.5 font-mono text-[9px] font-black tracking-[0.18em] uppercase text-avs-kente">
                        Processus de validation
                      </p>
                      <p className="text-avs-accent/60">
                        Votre motif sera relu par un curateur AVS avant publication. Ce processus prend généralement{' '}
                        <strong className="text-avs-accent">24–48h ouvrées</strong>.
                      </p>
                    </div>

                    {/* Submit error */}
                    {errors['submit'] && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {errors['submit']}
                      </div>
                    )}
                  </>
                )}

                {/* ── Navigation ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between border-t border-avs-accent/10 pt-5">
                  <button type="button" onClick={prev} disabled={step === 0}
                    className="avs-btn-secondary flex items-center gap-2 disabled:pointer-events-none disabled:opacity-30">
                    <ArrowLeft size={13} /> Précédent
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={next}
                      className="avs-btn-primary group relative flex items-center gap-2 overflow-hidden">
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                      Suivant <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => void submit()} disabled={loading}
                      aria-busy={loading}
                      className="avs-btn-primary group relative flex items-center gap-2 overflow-hidden disabled:cursor-not-allowed disabled:opacity-60">
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                      {loading
                        ? <><BuniLoader size={16} showText={false} /> Envoi…</>
                        : <><Sparkles size={13} /> Soumettre pour révision</>
                      }
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Live Preview sidebar ────────────────────────────────────── */}
          <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">

            {/* Pattern card preview */}
            <div className="avs-card overflow-hidden">
              <div className="relative h-36 overflow-hidden bg-avs-secondary-dark">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewCSS}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`${previewCSS} absolute inset-0`}
                    aria-hidden
                  />
                </AnimatePresence>
                {/* Color swatches */}
                {(s3.colors ?? []).length > 0 && (
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {(s3.colors ?? []).slice(0, 3).map((c) => (
                      <span key={c.hex} className="h-5 w-5 rounded-lg shadow-sm ring-1 ring-black/20"
                        style={{ background: c.hex }} title={c.name} />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4">
                {s1.patternType && (
                  <div className="mb-2">
                    <span className="avs-badge bg-avs-primary/10 text-avs-primary border border-avs-primary/20">
                      {s1.patternType}
                    </span>
                  </div>
                )}
                <p className="font-display text-sm font-bold leading-tight tracking-tight text-avs-accent">
                  {s1.nameFr || <span className="text-avs-accent/30">Nom du motif</span>}
                </p>
                <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-avs-primary">
                  {s1.patternType ?? '—'} · {s1.country ?? '??'}
                </p>
                {s1.kingdom && (
                  <p className="mt-0.5 text-[11px] text-avs-accent/40">{s1.kingdom}</p>
                )}
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-avs-accent/60">
                  {s2.descFr || <span className="text-avs-accent/25">Description apparaîtra ici…</span>}
                </p>
                {(s2.symbolKeywords ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(s2.symbolKeywords ?? []).slice(0, 4).map((kw) => (
                      <span key={kw} className="rounded-md bg-avs-primary/10 px-2 py-0.5 font-mono text-[9px] font-medium text-avs-primary">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-center font-mono text-[9px] tracking-[0.2em] uppercase text-avs-accent/30">
              Aperçu en temps réel
            </p>

            {/* Step progress mini */}
            <div className="avs-card p-4">
              <p className="avs-label mb-3">Progression</p>
              <div className="space-y-2">
                {STEPS.map(({ label }, i) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={`
                      flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold
                      ${i < step
                        ? 'bg-avs-primary text-avs-secondary'
                        : i === step
                          ? 'border border-avs-primary/20 bg-avs-primary/10 text-avs-primary'
                          : 'border border-avs-accent/15 bg-avs-secondary text-avs-accent/30'
                      }
                    `}>
                      {i < step ? <Check size={10} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-medium ${i === step ? 'text-avs-accent' : 'text-avs-accent/40'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}