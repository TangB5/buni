// ONLY UI / FORM CONFIG (no domain duplication)

// ─────────────────────────────────────────────────────────────
// FORM STEPS (UI ONLY)
// ─────────────────────────────────────────────────────────────

export const FORM_STEPS = [
  { label: 'Identité', desc: 'Nom & origine géographique' },
  { label: 'Description', desc: 'Contexte & symbolisme' },
  { label: 'Couleurs & Assets', desc: 'Palette & fichier SVG' },
  { label: 'Révision', desc: 'Vérification avant envoi' },
] as const;

export type StepIndex = 0 | 1 | 2 | 3;