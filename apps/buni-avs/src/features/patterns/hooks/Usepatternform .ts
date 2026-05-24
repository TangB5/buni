import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ZodSchema } from 'zod';
import { z } from 'zod';

import { Step1Schema, Step2Schema, Step3Schema } from '../schemas/create-pattern.schema';
import { patternService, PatternServiceError } from '../services/pattern.service';
import { DEFAULT_COLORS, DEFAULT_SYMBOL } from '../constants/pattern.constants';

import type {
  Step1Data,
  Step2Data,
  Step3Data,
  FieldErrors,
  PatternColor,
  PatternSymbol,
} from '../types';
import type { Route } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_S1: Partial<Step1Data> = { license: 'cc-by' };

const INITIAL_S2: Partial<Step2Data> = {
  symbolKeywords: [],
  symbolUsage: 'ceremonial',
  summary: '', history: '', technique: '', ceremonial: '', symbolMeaning: '',
};

const INITIAL_S3: Partial<Step3Data> = {
  colors:  [...DEFAULT_COLORS],
  sources: [],
  symbols: [],
  svgPattern: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function usePatternForm() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState<FieldErrors>({});
  const [svgFile, setSvgFile]         = useState<File | null>(null);
  const [newKeyword, setNewKeyword]   = useState('');

  const [step1, setStep1] = useState<Partial<Step1Data>>(INITIAL_S1);
  const [step2, setStep2] = useState<Partial<Step2Data>>(INITIAL_S2);
  const [step3, setStep3] = useState<Partial<Step3Data>>(INITIAL_S3);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep = useCallback((step: number): boolean => {
    const schemas: Record<number, ZodSchema> = {
      0: Step1Schema,
      1: Step2Schema,
      2: Step3Schema,
    };
    const data: Record<number, unknown> = { 0: step1, 1: step2, 2: step3 };
    const schema = schemas[step];
    if (!schema) return true; // step 3 is review only

    const result = schema.safeParse(data[step]);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FieldErrors = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
    });
    setErrors(fieldErrors);
    return false;
  }, [step1, step2, step3]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (validateStep(currentStep)) setCurrentStep((s) => s + 1);
  }, [currentStep, validateStep]);

  const goPrev = useCallback(() => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  }, []);

  // ── Keyword management ─────────────────────────────────────────────────────

  const addKeyword = useCallback(() => {
    const kw = newKeyword.trim().toLowerCase();
    const existing = step2.symbolKeywords ?? [];
    if (kw && !existing.includes(kw) && existing.length < 10) {
      setStep2((f) => ({ ...f, symbolKeywords: [...(f.symbolKeywords ?? []), kw] }));
      setNewKeyword('');
    }
  }, [newKeyword, step2.symbolKeywords]);

  const removeKeyword = useCallback((kw: string) => {
    setStep2((f) => ({
      ...f,
      symbolKeywords: (f.symbolKeywords ?? []).filter((k) => k !== kw),
    }));
  }, []);

  // ── Color management ───────────────────────────────────────────────────────

  const updateColor = useCallback((i: number, patch: Partial<PatternColor>) => {
    setStep3((f) => {
      const next = [...(f.colors ?? [])];
      next[i] = { ...next[i]!, ...patch };
      return { ...f, colors: next };
    });
  }, []);

  const addColor = useCallback(() => {
    setStep3((f) => ({
      ...f,
      colors: [...(f.colors ?? []), { hex: '#000000', name: '', meaning: '' }],
    }));
  }, []);

  const removeColor = useCallback((i: number) => {
    setStep3((f) => ({
      ...f,
      colors: (f.colors ?? []).filter((_, idx) => idx !== i),
    }));
  }, []);

  // ── Source management ──────────────────────────────────────────────────────

  const updateSource = useCallback((i: number, val: string) => {
    setStep3((f) => {
      const next = [...(f.sources ?? [])];
      next[i] = val;
      return { ...f, sources: next };
    });
  }, []);

  const addSource = useCallback(() => {
    setStep3((f) => ({ ...f, sources: [...(f.sources ?? []), ''] }));
  }, []);

  const removeSource = useCallback((i: number) => {
    setStep3((f) => ({
      ...f,
      sources: (f.sources ?? []).filter((_, idx) => idx !== i),
    }));
  }, []);

  // ── Symbol management ──────────────────────────────────────────────────────

  const updateSymbol = useCallback((i: number, patch: Partial<PatternSymbol>) => {
    setStep3((f) => {
      const next = [...(f.symbols ?? [])];
      next[i] = { ...next[i]!, ...patch };
      return { ...f, symbols: next };
    });
  }, []);

  const addSymbol = useCallback(() => {
    setStep3((f) => ({
      ...f,
      symbols: [...(f.symbols ?? []), { ...DEFAULT_SYMBOL }],
    }));
  }, []);

  const removeSymbol = useCallback((i: number) => {
    setStep3((f) => ({
      ...f,
      symbols: (f.symbols ?? []).filter((_, idx) => idx !== i),
    }));
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    // Validate all steps before submitting
    const allValid = [0, 1, 2].every((s) => {
      const schemas = [Step1Schema, Step2Schema, Step3Schema];
      const data    = [step1, step2, step3];
      const result  = schemas[s]!.safeParse(data[s]);
      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        result.error.issues.forEach((i) => {
          if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
        });
        setErrors(fieldErrors);
        setCurrentStep(s); // Jump to the offending step
        return false;
      }
      return true;
    });

    if (!allValid) return;

    setLoading(true);
    try {
      const result = await patternService.createFromForm(
        step1 as Step1Data,
        step2 as Step2Data,
        step3 as Step3Data,
        svgFile,
        step3.symbols ?? [],
      );

      const destination = result.id
        ? `/dashboard/patternsDashboard/${result.id}?created=true`
        : '/dashboard/patternsDashboard?created=true';

      router.push(destination as Route);
    } catch (err) {
      if (err instanceof PatternServiceError) {
        setErrors({ submit: err.message, ...err.fieldErrors });
      } else {
        setErrors({ submit: 'Une erreur inattendue est survenue. Veuillez réessayer.' });
      }
    } finally {
      setLoading(false);
    }
  }, [step1, step2, step3, svgFile, router]);

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    // State
    currentStep,
    loading,
    errors,
    svgFile,
    newKeyword,
    step1, step2, step3,

    // Setters
    setStep1, setStep2, setStep3,
    setSvgFile,
    setNewKeyword,

    // Actions
    goNext, goPrev,
    addKeyword, removeKeyword,
    updateColor, addColor, removeColor,
    updateSource, addSource, removeSource,
    updateSymbol, addSymbol, removeSymbol,
    submit,
  };
}