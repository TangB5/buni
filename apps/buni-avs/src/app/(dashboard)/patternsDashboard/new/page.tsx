'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Upload, Plus, X, AlertCircle, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { BuniLoader } from '@buni/ui';
import { Route } from 'next';

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
  coords:       z.tuple([z.number(), z.number()]).optional(),
  kingdom:     z.string().max(128).optional(),
  era:         z.string().max(64).optional(),
  license:     z.enum(['cc0','cc-by','cc-by-sa']).catch('cc-by'),
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
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur HEX invalide'),
    name: z.string().min(1, 'Nom de la couleur'),
    meaning: z.string().min(1, 'Signification de la couleur'),
  })).min(2, 'Au moins 2 couleurs').max(5),
  svgPattern: z.string().optional(),
  artisanQuote: z.object({
    text: z.string().min(10, 'Texte de la citation').max(500),
    author: z.string().min(2, 'Nom de l\'artisan').max(128),
    role: z.string().min(2, 'Rôle de l\'artisan').max(128),
    country: z.string().min(2, 'Pays de l\'artisan').max(64),
  }).optional(),
  sources: z.array(z.string().min(1)).min(1, 'Au moins une source').max(10),
  symbols: z.array(z.object({
    name: z.string().min(1, 'Nom du symbole'),
    nameFr: z.string().min(1, 'Nom français du symbole'),
    cssPreview: z.string().min(1, 'CSS preview'),
    meaning: z.string().min(1, 'Signification du symbole'),
    usage: z.string().min(1, 'Usage du symbole'),
    sacred: z.boolean(),
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
  { value:'west-africa',    label:"Afrique de l'Ouest" },
  { value:'east-africa',    label:"Afrique de l'Est"   },
  { value:'central-africa', label:'Afrique Centrale'   },
  { value:'north-africa',   label:"Afrique du Nord"    },
  { value:'south-africa',   label:'Afrique Australe'   },
  { value:'diaspora',       label:'Diaspora'            },
] as const;

const USAGES = ['ceremonial','daily','royal','spiritual','universal'] as const;

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
  { label: 'Identité',          desc: 'Nom & origine géographique'   },
  { label: 'Description',       desc: 'Contexte & symbolisme'        },
  { label: 'Couleurs & Assets', desc: 'Palette & fichier SVG'        },
  { label: 'Révision',          desc: 'Vérification avant envoi'     },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES (CSS vars, injected once)
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_STYLES = `
  :root {
    --np-bg:          #faf8f5;
    --np-surface:     #ffffff;
    --np-subtle:      rgba(29,29,27,0.04);
    --np-border:      rgba(29,29,27,0.09);
    --np-border-md:   rgba(29,29,27,0.16);
    --np-text:        #1D1D1B;
    --np-muted:       rgba(29,29,27,0.55);
    --np-hint:        rgba(29,29,27,0.35);
    --np-primary:     #C0573E;
    --np-primary-10:  rgba(192,87,62,0.08);
    --np-primary-20:  rgba(192,87,62,0.18);
    --np-kente:       #D4A017;
    --np-icon:        rgba(29,29,27,0.32);
  }
  .dark {
    --np-bg:          #111110;
    --np-surface:     #1a1917;
    --np-subtle:      rgba(255,255,255,0.05);
    --np-border:      rgba(255,255,255,0.07);
    --np-border-md:   rgba(255,255,255,0.13);
    --np-text:        #ece8e1;
    --np-muted:       rgba(236,232,225,0.50);
    --np-hint:        rgba(236,232,225,0.30);
    --np-primary:     #d4694e;
    --np-primary-10:  rgba(212,105,78,0.10);
    --np-primary-20:  rgba(212,105,78,0.22);
    --np-kente:       #ddb030;
    --np-icon:        rgba(236,232,225,0.30);
  }

  ::placeholder { color: var(--np-hint) !important; opacity: 1; }

  .np-input {
    width: 100%;
    background: var(--np-surface);
    color: var(--np-text);
    border: 1.5px solid var(--np-border-md);
    border-radius: 0.75rem;
    padding: 0.6875rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
  }
  .np-input:focus {
    border-color: var(--np-primary);
    box-shadow: 0 0 0 3px var(--np-primary-10);
  }
  .np-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .np-textarea { resize: none; }

  .np-select {
    appearance: none;
    -webkit-appearance: none;
    background: var(--np-surface);
    color: var(--np-text);
    border: 1.5px solid var(--np-border-md);
    border-radius: 0.75rem;
    padding: 0.6875rem 2.5rem 0.6875rem 1rem;
    font-size: 0.875rem;
    width: 100%;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    cursor: pointer;
    font-family: inherit;
  }
  .np-select:focus {
    border-color: var(--np-primary);
    box-shadow: 0 0 0 3px var(--np-primary-10);
  }
  .np-select option {
    background: var(--np-surface);
    color: var(--np-text);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--np-hint)' }}>
        {label}
        {required && <span style={{ color: 'var(--np-primary)' }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-[11px] leading-snug" style={{ color: 'var(--np-hint)' }}>{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            role="alert" className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs font-medium"
            style={{ color: '#ef4444' }}
          >
            <AlertCircle size={11} aria-hidden />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PILL BUTTON (pattern type / usage selector)
// ─────────────────────────────────────────────────────────────────────────────
function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200"
      style={active
        ? { background: 'var(--np-primary)', color: '#fff', boxShadow: `0 2px 10px var(--np-primary-20)` }
        : { border: '1.5px solid var(--np-border-md)', color: 'var(--np-muted)', background: 'var(--np-surface)' }
      }
      onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-primary-20)'; (e.currentTarget as HTMLElement).style.color = 'var(--np-primary)'; } }}
      onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-border-md)'; (e.currentTarget as HTMLElement).style.color = 'var(--np-muted)'; } }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PICKER FIELD
// ─────────────────────────────────────────────────────────────────────────────
function ColorField({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--np-hint)' }}>
        {label}{required && <span style={{ color: 'var(--np-primary)' }}> *</span>}
      </label>
      <div className="flex items-center gap-2">
        <label className="relative cursor-pointer">
          <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)}
            className="sr-only" />
          <div
            className="h-10 w-10 rounded-xl ring-1 ring-black/10 dark:ring-white/10 transition-transform hover:scale-105"
            style={{ background: value || '#000', boxShadow: `0 2px 8px ${value}40` }}
          />
        </label>
        <input
          className="np-input flex-1 font-mono text-sm uppercase"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION TITLE
// ─────────────────────────────────────────────────────────────────────────────
function StepTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 border-b pb-5" style={{ borderColor: 'var(--np-border)' }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="h-px w-5" style={{ background: 'var(--np-primary)' }} aria-hidden />
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--np-primary)' }}>
          {sub}
        </span>
      </div>
      <h2 className="font-display text-xl font-black leading-tight" style={{ color: 'var(--np-text)', letterSpacing: '-0.015em' }}>
        {title}
      </h2>
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

  const [s1, setS1] = useState<Partial<Step1Form>>({});
  const [s2, setS2] = useState<Partial<Step2Form>>({ 
    symbolKeywords: [], 
    symbolUsage: 'ceremonial',
    summary: '',
    history: '',
    technique: '',
    ceremonial: ''
  });
  const [s3, setS3] = useState<Partial<Step3Form>>({ 
    colors: [
      { hex: '#C0573E', name: 'Primaire', meaning: 'Couleur principale' },
      { hex: '#F5EBE0', name: 'Secondaire', meaning: 'Couleur secondaire' }
    ],
    svgPattern: '',
    artisanQuote: undefined,
    sources: [],
    symbols: []
  });
  const [newKw, setNewKw] = useState('');

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
      const formData = new FormData();
      
      // Step 1 fields
      formData.append('nameFr', s1.nameFr || '');
      formData.append('nameLocal', s1.nameLocal || '');
      formData.append('nameEn', s1.nameEn || '');
      formData.append('patternType', s1.patternType || '');
      formData.append('region', s1.region || '');
      formData.append('country', s1.country || '');
      formData.append('people', s1.people || '');
      formData.append('flag', s1.flag || '');
      if (s1.coords) {
        formData.append('coords', JSON.stringify(s1.coords));
      }
      formData.append('kingdom', s1.kingdom || '');
      formData.append('era', s1.era || '');
      formData.append('license', s1.license || '');
      
      // Step 2 fields
      formData.append('summary', s2.summary || '');
      formData.append('descFr', s2.descFr || '');
      formData.append('descEn', s2.descEn || '');
      formData.append('history', s2.history || '');
      formData.append('technique', s2.technique || '');
      formData.append('symbolMeaning', s2.symbolMeaning || '');
      formData.append('ceremonial', s2.ceremonial || '');
      formData.append('symbolUsage', s2.symbolUsage || '');
      formData.append('symbolKeywords', JSON.stringify(s2.symbolKeywords || []));
      
      // Step 3 fields
      formData.append('colors', JSON.stringify(s3.colors || []));
      formData.append('svgPattern', s3.svgPattern || '');
      if (s3.artisanQuote) {
        formData.append('artisanQuote', JSON.stringify(s3.artisanQuote));
      }
      formData.append('sources', JSON.stringify(s3.sources || []));
      formData.append('symbols', JSON.stringify(s3.symbols || []));
      
      // SVG file
      if (svgFile) {
        formData.append('svgFile', svgFile);
      }

      const response = await fetch('api/v1/patterns', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const params = new URLSearchParams({ created: 'true' });
        router.push(`/dashboard/patterns?${params.toString()}` as Route);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Erreur lors de la création' });
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const previewCSS = CSS_PREVIEWS[s1.patternType ?? ''] ?? 'avs-pattern-wax-dakar';

  // Progress %
  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(10,8,6,0.60)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl p-8"
              style={{ background: 'var(--np-surface)', border: '1px solid var(--np-border)' }}>
              <BuniLoader size={36} showText={false} />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--np-hint)' }}>
                Envoi en cours…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'var(--np-bg)', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30" style={{ background: 'var(--np-surface)', borderBottom: '1px solid var(--np-border)', backdropFilter: 'blur(16px)' }}>
          {/* Progress bar */}
          <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'var(--np-border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--np-primary)', originX: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150"
              style={{ border: '1px solid var(--np-border-md)', color: 'var(--np-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--np-text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-border-md)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--np-muted)'; }}
              aria-label="Retour"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-black" style={{ color: 'var(--np-text)', letterSpacing: '-0.015em' }}>
                  Nouveau Motif
                </h1>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-lg px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.14em] uppercase"
                    style={{ background: 'var(--np-primary-10)', color: 'var(--np-primary)', border: '1px solid var(--np-primary-20)' }}
                  >
                    {STEPS[step]?.label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--np-hint)' }}>
                Étape {step + 1} / {STEPS.length} — {STEPS[step]?.desc}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ══════════════════════════════════════════════════════
              STEPPER
          ══════════════════════════════════════════════════════ */}
          <div className="mb-10 flex items-center">
            {STEPS.map(({ label }, i) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  {/* Step dot */}
                  <motion.div
                    animate={i <= step ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                    style={i < step
                      ? { background: 'var(--np-primary)', color: '#fff' }
                      : i === step
                        ? { background: 'var(--np-primary)', color: '#fff', boxShadow: '0 0 0 4px var(--np-primary-10)' }
                        : { border: '1.5px solid var(--np-border-md)', color: 'var(--np-hint)', background: 'var(--np-surface)' }
                    }
                  >
                    {i < step ? <Check size={13} strokeWidth={3} /> : <span>{i + 1}</span>}
                  </motion.div>
                  {/* Label */}
                  <span
                    className="hidden sm:block font-mono text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap"
                    style={{ color: i === step ? 'var(--np-primary)' : 'var(--np-hint)' }}
                  >{label}</span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="relative mx-3 h-px flex-1 overflow-hidden" style={{ background: 'var(--np-border-md)' }}>
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: 'var(--np-primary)' }}
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════
              MAIN GRID
          ══════════════════════════════════════════════════════ */}
          <div className="grid gap-6 lg:grid-cols-[1fr_272px]">

            {/* ── FORM PANEL ─────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl"
                style={{ background: 'var(--np-surface)', border: '1px solid var(--np-border)' }}
              >
                {/* Top accent */}
                <div className="avs-pattern-ndop-sultan h-1 w-full" aria-hidden />

                <div className="space-y-6 p-7">

                  {/* ── STEP 1 — Identité ────────────────────────────────── */}
                  {step === 0 && (
                    <>
                      <StepTitle title="Identité du motif" sub="Étape 1" />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Nom (français)" error={errors['nameFr']} required>
                          <input className="np-input" value={s1.nameFr ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, nameFr: e.target.value }))}
                            placeholder="Ndop Royal Bamoum" />
                        </Field>
                        <Field label="Nom local" error={errors['nameLocal']} required>
                          <input className="np-input" value={s1.nameLocal ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, nameLocal: e.target.value }))}
                            placeholder="Ndop (Ndoup)" />
                        </Field>
                        <Field label="Nom (anglais)" error={errors['nameEn']} required>
                          <input className="np-input" value={s1.nameEn ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, nameEn: e.target.value }))}
                            placeholder="Bamoum Royal Ndop" />
                        </Field>
                        <Field label="Licence" error={errors['license']} required>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {[
                              { value: 'cc0', label: 'CC0' },
                              { value: 'cc-by', label: 'CC BY' },
                              { value: 'cc-by-sa', label: 'CC BY-SA' },
                            ].map((license) => (
                              <PillBtn key={license.value} label={license.label} active={s1.license === license.value}
                                onClick={() => setS1((f) => ({ ...f, license: license.value as Step1Form['license'] }))} />
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
                          <div className="relative">
                            <select className="np-select" value={s1.region ?? ''}
                              onChange={(e) => setS1((f) => ({ ...f, region: e.target.value as Step1Form['region'] }))}>
                              <option value="">Choisir…</option>
                              {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--np-icon)' }} aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </Field>
                        <Field label="Code pays (ISO 2)" error={errors['country']} required hint="Ex : CM pour Cameroun">
                          <input className="np-input font-mono uppercase" maxLength={2} value={s1.country ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, country: e.target.value.toUpperCase() }))}
                            placeholder="CM" />
                        </Field>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Peuple / Ethnie">
                          <input className="np-input" value={s1.people ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, people: e.target.value }))}
                            placeholder="Peuple Bamoum (Bamum)" />
                        </Field>
                        <Field label="Drapeau (emoji)">
                          <input className="np-input" value={s1.flag ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, flag: e.target.value }))}
                            placeholder="🇨🇲" maxLength={8} />
                        </Field>
                        <Field label="Royaume / Royaume">
                          <input className="np-input" value={s1.kingdom ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, kingdom: e.target.value }))}
                            placeholder="Sultanat Bamoum" />
                        </Field>
                        <Field label="Époque">
                          <input className="np-input" value={s1.era ?? ''}
                            onChange={(e) => setS1((f) => ({ ...f, era: e.target.value }))}
                            placeholder="XVIIe siècle — présent" />
                        </Field>
                      </div>

                      <Field label="Coordonnées géographiques (latitude, longitude)">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            className="np-input" 
                            type="number" 
                            step="0.0001"
                            value={s1.coords?.[0] ?? ''}
                            onChange={(e) => setS1((f) => ({ 
                              ...f, 
                              coords: [parseFloat(e.target.value) || 0, (f.coords?.[1] || 0)]
                            }))}
                            placeholder="6.6885" 
                          />
                          <input 
                            className="np-input" 
                            type="number" 
                            step="0.0001"
                            value={s1.coords?.[1] ?? ''}
                            onChange={(e) => setS1((f) => ({ 
                              ...f, 
                              coords: [(f.coords?.[0] || 0), parseFloat(e.target.value) || 0]
                            }))}
                            placeholder="-1.6244" 
                          />
                        </div>
                      </Field>
                    </>
                  )}

                  {/* ── STEP 2 — Description ─────────────────────────────── */}
                  {step === 1 && (
                    <>
                      <StepTitle title="Description & Symbolisme" sub="Étape 2" />

                      <Field label="Résumé" error={errors['summary']} required>
                        <textarea rows={2} className="np-input np-textarea" value={s2.summary ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, summary: e.target.value }))}
                          placeholder="Brève description du motif (utilisé dans les listes et aperçus)" />
                        <div className="mt-1 flex justify-end">
                          <span className="font-mono text-[9px]" style={{ color: 'var(--np-hint)' }}>
                            {(s2.summary ?? '').length}/500
                          </span>
                        </div>
                      </Field>

                      <Field label="Description (français)" error={errors['descFr']} required>
                        <textarea rows={4} className="np-input np-textarea" value={s2.descFr ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, descFr: e.target.value }))}
                          placeholder="Décrivez l'histoire et le contexte culturel du motif en français…" />
                        <div className="mt-1 flex justify-end">
                          <span className="font-mono text-[9px]" style={{ color: 'var(--np-hint)' }}>
                            {(s2.descFr ?? '').length}/2000
                          </span>
                        </div>
                      </Field>

                      <Field label="Description (anglais)" error={errors['descEn']} required>
                        <textarea rows={4} className="np-input np-textarea" value={s2.descEn ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, descEn: e.target.value }))}
                          placeholder="Describe the history and cultural context of the pattern in English…" />
                      </Field>

                      <Field label="Histoire" error={errors['history']} required>
                        <textarea rows={3} className="np-input np-textarea" value={s2.history ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, history: e.target.value }))}
                          placeholder="Contexte historique détaillé du motif, son évolution au fil du temps…" />
                        <div className="mt-1 flex justify-end">
                          <span className="font-mono text-[9px]" style={{ color: 'var(--np-hint)' }}>
                            {(s2.history ?? '').length}/2000
                          </span>
                        </div>
                      </Field>

                      <Field label="Technique de fabrication" error={errors['technique']} required>
                        <textarea rows={3} className="np-input np-textarea" value={s2.technique ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, technique: e.target.value }))}
                          placeholder="Description détaillée de la technique de fabrication, matériaux utilisés, savoir-faire…" />
                        <div className="mt-1 flex justify-end">
                          <span className="font-mono text-[9px]" style={{ color: 'var(--np-hint)' }}>
                            {(s2.technique ?? '').length}/1000
                          </span>
                        </div>
                      </Field>

                      <Field label="Signification symbolique" error={errors['symbolMeaning']} required>
                        <textarea rows={2} className="np-input np-textarea" value={s2.symbolMeaning ?? ''}
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
                        <textarea rows={2} className="np-input np-textarea" value={s2.ceremonial ?? ''}
                          onChange={(e) => setS2((f) => ({ ...f, ceremonial: e.target.value }))}
                          placeholder="Description des contextes cérémoniels où le motif est utilisé…" />
                        <div className="mt-1 flex justify-end">
                          <span className="font-mono text-[9px]" style={{ color: 'var(--np-hint)' }}>
                            {(s2.ceremonial ?? '').length}/1000
                          </span>
                        </div>
                      </Field>

                      <Field label="Mots-clés (1–10)" error={errors['symbolKeywords']} required>
                        <div className="flex gap-2">
                          <input
                            className="np-input flex-1"
                            value={newKw}
                            onChange={(e) => setNewKw(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKw(); } }}
                            placeholder="Ajouter un mot-clé et Entrée…"
                          />
                          <button
                            type="button" onClick={addKw}
                            className="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:-translate-y-0.5"
                            style={{ background: 'var(--np-primary)', boxShadow: '0 2px 8px var(--np-primary-20)' }}
                          >
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
                                <span
                                  key={kw}
                                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium"
                                  style={{ background: 'var(--np-primary-10)', color: 'var(--np-primary)', border: '1px solid var(--np-primary-20)' }}
                                >
                                  {kw}
                                  <button
                                    type="button"
                                    onClick={() => setS2((f) => ({ ...f, symbolKeywords: (f.symbolKeywords ?? []).filter((k) => k !== kw) }))}
                                    className="transition-colors"
                                    style={{ color: 'var(--np-primary)' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--np-primary)')}
                                    aria-label={`Supprimer ${kw}`}
                                  >
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

                  {/* ── STEP 3 — Couleurs & Assets ───────────────────────── */}
                  {step === 2 && (
                    <>
                      <StepTitle title="Couleurs & Assets" sub="Étape 3" />

                      {/* Color palette */}
                      <Field label="Palette de couleurs" required>
                        <div className="space-y-4">
                          {(s3.colors ?? []).map((color, index) => (
                            <div key={index} className="grid grid-cols-4 gap-3 items-center">
                              <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => {
                                  const newColors = [...(s3.colors ?? [])];
                                  newColors[index] = { ...color, hex: e.target.value };
                                  setS3((f) => ({ ...f, colors: newColors }));
                                }}
                                className="h-10 w-10 rounded-lg border border-black/10"
                              />
                              <input
                                type="text"
                                value={color.name}
                                onChange={(e) => {
                                  const newColors = [...(s3.colors ?? [])];
                                  newColors[index] = { ...color, name: e.target.value };
                                  setS3((f) => ({ ...f, colors: newColors }));
                                }}
                                placeholder="Nom de la couleur"
                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                value={color.meaning}
                                onChange={(e) => {
                                  const newColors = [...(s3.colors ?? [])];
                                  newColors[index] = { ...color, meaning: e.target.value };
                                  setS3((f) => ({ ...f, colors: newColors }));
                                }}
                                placeholder="Signification"
                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newColors = (s3.colors ?? []).filter((_, i) => i !== index);
                                  setS3((f) => ({ ...f, colors: newColors }));
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setS3((f) => ({ 
                                ...f, 
                                colors: [...(f.colors ?? []), { hex: '#000000', name: 'Nouvelle couleur', meaning: 'Description' }]
                              }));
                            }}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                          >
                            + Ajouter une couleur
                          </button>
                        </div>
                      </Field>

                      <Field label="Pattern SVG (optionnel)" hint="Nom de la classe CSS pour le pattern">
                        <input className="np-input" value={s3.svgPattern ?? ''}
                          onChange={(e) => setS3((f) => ({ ...f, svgPattern: e.target.value }))}
                          placeholder="avs-pattern-ndop-sultan" />
                      </Field>

                      {/* Color strip preview */}
                      <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--np-border)' }}>
                        <div className="flex h-14">
                          {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent].filter(Boolean).map((c, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 transition-colors duration-300"
                              style={{ background: c as string }}
                              whileHover={{ flex: 2 }}
                              transition={{ duration: 0.22 }}
                              title={c as string}
                            />
                          ))}
                        </div>
                        <div className="flex gap-4 px-4 py-2" style={{ background: 'var(--np-surface)', borderTop: '1px solid var(--np-border)' }}>
                          {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent].filter(Boolean).map((c, i) => (
                            <span key={i} className="font-mono text-[10px]" style={{ color: 'var(--np-hint)' }}>{c}</span>
                          ))}
                        </div>
                      </div>

                      {/* SVG upload */}
                      <Field label="Fichier SVG du motif" hint="SVG uniquement · max 2 Mo · Optionnel">
                        <label
                          className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-10 transition-all duration-200"
                          style={{
                            border: `2px dashed ${svgFile ? 'var(--np-primary)' : 'var(--np-border-md)'}`,
                            background: svgFile ? 'var(--np-primary-10)' : 'var(--np-subtle)',
                          }}
                          onMouseEnter={(e) => { if (!svgFile) (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-primary-20)'; }}
                          onMouseLeave={(e) => { if (!svgFile) (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-border-md)'; }}
                        >
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                            style={{ background: svgFile ? 'var(--np-primary-20)' : 'var(--np-surface)', color: svgFile ? 'var(--np-primary)' : 'var(--np-hint)', border: '1px solid var(--np-border-md)' }}
                          >
                            {svgFile ? <Check size={22} /> : <Upload size={22} />}
                          </div>
                          {svgFile ? (
                            <div className="text-center">
                              <p className="text-sm font-semibold" style={{ color: 'var(--np-primary)' }}>{svgFile.name}</p>
                              <p className="mt-0.5 text-xs" style={{ color: 'var(--np-hint)' }}>{(svgFile.size / 1024).toFixed(1)} Ko</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-sm" style={{ color: 'var(--np-muted)' }}>
                                Glisser-déposer ou <span style={{ color: 'var(--np-primary)', fontWeight: 600 }}>parcourir</span>
                              </p>
                            </div>
                          )}
                          <input
                            type="file" accept=".svg" className="sr-only"
                            onChange={(e) => setSvgFile(e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {svgFile && (
                          <button
                            type="button"
                            onClick={() => setSvgFile(null)}
                            className="mt-2 flex items-center gap-1.5 text-xs transition-colors"
                            style={{ color: 'var(--np-hint)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--np-hint)')}
                          >
                            <X size={11} /> Supprimer le fichier
                          </button>
                        )}
                        <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--np-hint)' }}>
                          Le fichier sera placé dans <code className="rounded px-1 font-mono text-[10px]" style={{ background: 'var(--np-subtle)', border: '1px solid var(--np-border)' }}>public/patterns/</code> et référencé automatiquement.
                        </p>
                      </Field>

                      {/* Artisan Quote */}
                      <Field label="Citation d'artisan (optionnel)">
                        <div className="space-y-3">
                          <input className="np-input" value={s3.artisanQuote?.text ?? ''}
                            onChange={(e) => setS3((f) => ({ 
                              ...f, 
                              artisanQuote: { 
                                ...f.artisanQuote, 
                                text: e.target.value 
                              }
                            }))}
                            placeholder="Le Kente ne se porte pas, il se lit. Chaque fil est une lettre..." />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input className="np-input" value={s3.artisanQuote?.author ?? ''}
                              onChange={(e) => setS3((f) => ({ 
                                ...f, 
                                artisanQuote: { 
                                  ...f.artisanQuote, 
                                  author: e.target.value 
                                }
                              }))}
                              placeholder="Nom de l'artisan" />
                            <input className="np-input" value={s3.artisanQuote?.role ?? ''}
                              onChange={(e) => setS3((f) => ({ 
                                ...f, 
                                artisanQuote: { 
                                  ...f.artisanQuote, 
                                  role: e.target.value 
                                }
                              }))}
                              placeholder="Rôle" />
                          </div>
                          <input className="np-input" value={s3.artisanQuote?.country ?? ''}
                            onChange={(e) => setS3((f) => ({ 
                              ...f, 
                              artisanQuote: { 
                                ...f.artisanQuote, 
                                country: e.target.value 
                              }
                            }))}
                            placeholder="Pays" maxLength={64} />
                        </div>
                      </Field>

                      {/* Sources */}
                      <Field label="Sources et références" required>
                        <div className="space-y-2">
                          {(s3.sources ?? []).map((source, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                className="np-input flex-1"
                                value={source}
                                onChange={(e) => {
                                  const newSources = [...(s3.sources ?? [])];
                                  newSources[index] = e.target.value;
                                  setS3((f) => ({ ...f, sources: newSources }));
                                }}
                                placeholder="Livre, article, site web..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newSources = (s3.sources ?? []).filter((_, i) => i !== index);
                                  setS3((f) => ({ ...f, sources: newSources }));
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setS3((f) => ({ 
                                ...f, 
                                sources: [...(s3.sources ?? []), '']
                              }));
                            }}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                          >
                            + Ajouter une source
                          </button>
                        </div>
                      </Field>

                      {/* Symbols */}
                      <Field label="Symboles constitutifs" required>
                        <div className="space-y-4">
                          {(s3.symbols ?? []).map((symbol, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                  className="np-input"
                                  value={symbol.name}
                                  onChange={(e) => {
                                    const newSymbols = [...(s3.symbols ?? [])];
                                    newSymbols[index] = { ...symbol, name: e.target.value };
                                    setS3((f) => ({ ...f, symbols: newSymbols }));
                                  }}
                                  placeholder="Nom du symbole"
                                />
                                <input
                                  className="np-input"
                                  value={symbol.nameFr}
                                  onChange={(e) => {
                                    const newSymbols = [...(s3.symbols ?? [])];
                                    newSymbols[index] = { ...symbol, nameFr: e.target.value };
                                    setS3((f) => ({ ...f, symbols: newSymbols }));
                                  }}
                                  placeholder="Nom français"
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                  className="np-input"
                                  value={symbol.cssPreview}
                                  onChange={(e) => {
                                    const newSymbols = [...(s3.symbols ?? [])];
                                    newSymbols[index] = { ...symbol, cssPreview: e.target.value };
                                    setS3((f) => ({ ...f, symbols: newSymbols }));
                                  }}
                                  placeholder="#couleur"
                                />
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={symbol.sacred}
                                    onChange={(e) => {
                                      const newSymbols = [...(s3.symbols ?? [])];
                                      newSymbols[index] = { ...symbol, sacred: e.target.checked };
                                      setS3((f) => ({ ...f, symbols: newSymbols }));
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm">Sacré</span>
                                </label>
                              </div>
                              <textarea
                                className="np-input np-textarea"
                                value={symbol.meaning}
                                onChange={(e) => {
                                  const newSymbols = [...(s3.symbols ?? [])];
                                  newSymbols[index] = { ...symbol, meaning: e.target.value };
                                  setS3((f) => ({ ...f, symbols: newSymbols }));
                                }}
                                placeholder="Signification du symbole"
                                rows={2}
                              />
                              <textarea
                                className="np-input np-textarea"
                                value={symbol.usage}
                                onChange={(e) => {
                                  const newSymbols = [...(s3.symbols ?? [])];
                                  newSymbols[index] = { ...symbol, usage: e.target.value };
                                  setS3((f) => ({ ...f, symbols: newSymbols }));
                                }}
                                placeholder="Usage du symbole"
                                rows={2}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newSymbols = (s3.symbols ?? []).filter((_, i) => i !== index);
                                  setS3((f) => ({ ...f, symbols: newSymbols }));
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setS3((f) => ({ 
                                ...f, 
                                symbols: [...(s3.symbols ?? []), {
                                  name: '',
                                  nameFr: '',
                                  cssPreview: '',
                                  meaning: '',
                                  usage: '',
                                  sacred: false
                                }]
                              }));
                            }}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                          >
                            + Ajouter un symbole
                          </button>
                        </div>
                      </Field>
                    </>
                  )}

                  {/* ── STEP 4 — Révision ────────────────────────────────── */}
                  {step === 3 && (
                    <>
                      <StepTitle title="Révision finale" sub="Étape 4" />

                      <div className="space-y-1.5">
                        {([
                          { label: 'Nom FR',    value: s1.nameFr },
                          { label: 'Nom EN',    value: s1.nameEn },
                          { label: 'Type',      value: s1.patternType?.toUpperCase() },
                          { label: 'Région',    value: s1.region },
                          { label: 'Pays',      value: s1.country },
                          { label: 'Royaume',   value: s1.kingdom },
                          { label: 'Époque',    value: s1.era },
                          { label: 'Usage',     value: s2.symbolUsage },
                          { label: 'Mots-clés', value: (s2.symbolKeywords ?? []).join(', ') },
                        ] as const).map(({ label, value }) =>
                          value ? (
                            <div
                              key={label}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                              style={{ background: 'var(--np-subtle)', border: '1px solid var(--np-border)' }}
                            >
                              <span className="w-20 shrink-0 font-mono text-[9px] font-black tracking-[0.16em] uppercase" style={{ color: 'var(--np-hint)' }}>{label}</span>
                              <span className="text-sm font-medium" style={{ color: 'var(--np-text)' }}>{value}</span>
                            </div>
                          ) : null
                        )}

                        {/* Color preview row */}
                        <div
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                          style={{ background: 'var(--np-subtle)', border: '1px solid var(--np-border)' }}
                        >
                          <span className="w-20 shrink-0 font-mono text-[9px] font-black tracking-[0.16em] uppercase" style={{ color: 'var(--np-hint)' }}>Palette</span>
                          <div className="flex gap-2">
                            {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent].filter(Boolean).map((c, i) => (
                              <span key={i} className="h-5 w-5 rounded-lg ring-1 ring-black/10 dark:ring-white/10" style={{ background: c as string }} title={c as string} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Validation notice */}
                      <div
                        className="rounded-xl p-4 text-sm leading-relaxed"
                        style={{ background: 'rgba(212,160,23,0.08)', borderLeft: '3px solid var(--np-kente)', border: '1px solid rgba(212,160,23,0.20)', borderLeftWidth: 3 }}
                      >
                        <p className="mb-1.5 font-mono text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: 'var(--np-kente)' }}>
                          Processus de validation
                        </p>
                        <p style={{ color: 'var(--np-muted)' }}>
                          Votre motif sera relu par un curateur AVS avant publication. Ce processus prend généralement <strong style={{ color: 'var(--np-text)' }}>24–48h ouvrées</strong>.
                        </p>
                      </div>
                    </>
                  )}

                  {/* ── Navigation ───────────────────────────────────────── */}
                  <div className="flex items-center justify-between pt-5" style={{ borderTop: '1px solid var(--np-border)' }}>
                    <button
                      type="button"
                      onClick={prev}
                      disabled={step === 0}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
                      style={{ border: '1.5px solid var(--np-border-md)', color: 'var(--np-muted)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--np-text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--np-border-md)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--np-muted)'; }}
                    >
                      <ArrowLeft size={13} /> Précédent
                    </button>

                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={next}
                        className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: 'var(--np-primary)', boxShadow: '0 4px 16px var(--np-primary-20)' }}
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                        Suivant <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void submit()}
                        disabled={loading}
                        className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: 'var(--np-primary)', boxShadow: '0 4px 16px var(--np-primary-20)' }}
                        aria-busy={loading}
                      >
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

            {/* ── LIVE PREVIEW ───────────────────────────────────────────── */}
            <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--np-border)', background: 'var(--np-surface)' }}>
                {/* Pattern preview — animates on type change */}
                <div className="relative h-36 overflow-hidden">
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
                  {/* Color swatches overlay — bottom */}
                  {(s3.colorPrimary || s3.colorSecondary) && (
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {[s3.colorPrimary, s3.colorSecondary, s3.colorAccent].filter(Boolean).map((c, i) => (
                        <span key={i} className="h-5 w-5 rounded-lg shadow-sm ring-1 ring-black/20" style={{ background: c as string }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Type badge */}
                  {s1.patternType && (
                    <div className="mb-2 inline-flex">
                      <span className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.2em] uppercase" style={{ background: 'var(--np-primary-10)', color: 'var(--np-primary)', border: '1px solid var(--np-primary-20)' }}>
                        {s1.patternType}
                      </span>
                    </div>
                  )}

                  <p className="font-display text-sm font-bold leading-tight" style={{ color: 'var(--np-text)', letterSpacing: '-0.01em' }}>
                    {s1.nameFr || <span style={{ color: 'var(--np-hint)' }}>Nom du motif</span>}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--np-primary)' }}>
                    {s1.patternType ?? '—'} · {s1.country ?? '??'}
                  </p>
                  {s1.kingdom && (
                    <p className="mt-0.5 text-[11px]" style={{ color: 'var(--np-hint)' }}>{s1.kingdom}</p>
                  )}
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed" style={{ color: 'var(--np-muted)' }}>
                    {s2.descFr || <span style={{ color: 'var(--np-hint)' }}>Description apparaîtra ici…</span>}
                  </p>

                  {(s2.symbolKeywords ?? []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(s2.symbolKeywords ?? []).slice(0, 4).map((kw) => (
                        <span key={kw} className="rounded-md px-2 py-0.5 font-mono text-[9px] font-medium"
                          style={{ background: 'var(--np-primary-10)', color: 'var(--np-primary)' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview label */}
              <p className="text-center font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--np-hint)' }}>
                Aperçu en temps réel
              </p>

              {/* Step progress mini */}
              <div className="overflow-hidden rounded-xl p-4" style={{ background: 'var(--np-surface)', border: '1px solid var(--np-border)' }}>
                <p className="mb-3 font-mono text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--np-hint)' }}>Progression</p>
                <div className="space-y-2">
                  {STEPS.map(({ label }, i) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                        style={i < step
                          ? { background: 'var(--np-primary)', color: '#fff' }
                          : i === step
                            ? { background: 'var(--np-primary-10)', color: 'var(--np-primary)', border: '1px solid var(--np-primary-20)' }
                            : { background: 'var(--np-subtle)', color: 'var(--np-hint)', border: '1px solid var(--np-border)' }
                        }
                      >
                        {i < step ? <Check size={10} strokeWidth={3} /> : i + 1}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: i === step ? 'var(--np-text)' : 'var(--np-hint)' }}>
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
    </>
  );
}