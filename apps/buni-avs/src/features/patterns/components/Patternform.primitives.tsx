'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export function Field({
  label, error, required, hint, children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="avs-label flex items-center gap-1.5">
        {label}
        {required && <span className="text-avs-primary" aria-hidden>*</span>}
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

export function PillBtn({
  label, active, onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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
          : 'border border-avs-accent/15 bg-avs-secondary text-avs-accent/50 hover:border-avs-primary/20 hover:text-avs-primary'
        }
      `}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECT (accessible, with chevron)
// ─────────────────────────────────────────────────────────────────────────────

export function SelectField({
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
// STEP TITLE
// ─────────────────────────────────────────────────────────────────────────────

export function StepTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 border-b border-avs-accent/10 pb-5">
      {sub && (
        <div className="mb-2 flex items-center gap-2">
          <div className="h-px w-5 bg-avs-primary" aria-hidden />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-avs-primary">
            {sub}
          </span>
        </div>
      )}
      <h2 className="font-display text-xl font-black leading-tight tracking-tight text-avs-accent">
        {title}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAR COUNT
// ─────────────────────────────────────────────────────────────────────────────

export function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <p className={`mt-1 flex justify-end font-mono text-[9px] ${over ? 'text-red-500' : 'text-avs-accent/30'}`}>
      {value.length}/{max}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHED ADD BUTTON
// ─────────────────────────────────────────────────────────────────────────────

export function AddRowBtn({ label, onClick }: { label: string; onClick: () => void }) {
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