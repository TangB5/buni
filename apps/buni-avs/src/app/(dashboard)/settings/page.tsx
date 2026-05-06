'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Lock, Trash2, Eye, EyeOff, Save,
  Loader2, CheckCircle2, Shield, Globe,
  AlertCircle, Monitor, Smartphone, ArrowRight,
} from 'lucide-react';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
type Section = 'notifications' | 'security' | 'privacy' | 'danger';

const SECTIONS: { key: Section; label: string; icon: typeof Bell; danger?: boolean }[] = [
  { key: 'notifications', label: 'Notifications',  icon: Bell   },
  { key: 'security',      label: 'Sécurité',        icon: Lock   },
  { key: 'privacy',       label: 'Confidentialité', icon: Globe  },
  { key: 'danger',        label: 'Zone de danger',  icon: Trash2, danger: true },
];

const PwdSchema = z.object({
  current: z.string().min(8, 'Minimum 8 caractères'),
  next:    z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/, 'Une majuscule requise').regex(/[0-9]/, 'Un chiffre requis'),
  confirm: z.string(),
}).refine((d) => d.next === d.confirm, { message: 'Les mots de passe ne correspondent pas', path: ['confirm'] });

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_STYLES = `
  :root {
    --st-bg:          #faf8f5;
    --st-surface:     #ffffff;
    --st-subtle:      rgba(29,29,27,0.04);
    --st-border:      rgba(29,29,27,0.09);
    --st-border-md:   rgba(29,29,27,0.16);
    --st-text:        #1D1D1B;
    --st-muted:       rgba(29,29,27,0.55);
    --st-hint:        rgba(29,29,27,0.35);
    --st-primary:     #C0573E;
    --st-primary-10:  rgba(192,87,62,0.08);
    --st-primary-20:  rgba(192,87,62,0.18);
    --st-green:       #4A6741;
    --st-green-10:    rgba(74,103,65,0.10);
    --st-icon:        rgba(29,29,27,0.32);
  }
  .dark {
    --st-bg:          #111110;
    --st-surface:     #1a1917;
    --st-subtle:      rgba(255,255,255,0.05);
    --st-border:      rgba(255,255,255,0.07);
    --st-border-md:   rgba(255,255,255,0.13);
    --st-text:        #ece8e1;
    --st-muted:       rgba(236,232,225,0.50);
    --st-hint:        rgba(236,232,225,0.30);
    --st-primary:     #d4694e;
    --st-primary-10:  rgba(212,105,78,0.10);
    --st-primary-20:  rgba(212,105,78,0.22);
    --st-green:       #7aa66e;
    --st-green-10:    rgba(122,166,110,0.12);
    --st-icon:        rgba(236,232,225,0.28);
  }

  ::placeholder { color: var(--st-hint) !important; opacity: 1; }

  .st-input {
    width: 100%;
    background: var(--st-bg);
    color: var(--st-text);
    border: 1.5px solid var(--st-border-md);
    border-radius: 0.75rem;
    padding: 0.6875rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: inherit;
  }
  .st-input:focus {
    border-color: var(--st-primary);
    box-shadow: 0 0 0 3px var(--st-primary-10);
  }
  .st-input-error { border-color: #ef4444 !important; }
  .st-input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: checked ? 'var(--st-primary)' : 'var(--st-border-md)',
        boxShadow: checked ? '0 2px 8px var(--st-primary-20)' : 'none',
        // focus ring color
      }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm"
        style={{ marginLeft: checked ? '18px' : '4px' }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTING ROW
// ─────────────────────────────────────────────────────────────────────────────
function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-6 py-4 last:border-0"
      style={{ borderBottom: '1px solid var(--st-border)' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--st-text)' }}>{label}</p>
        {desc && <p className="mt-0.5 text-xs leading-snug" style={{ color: 'var(--st-hint)' }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconColor, children, danger }: {
  title: string; icon: typeof Bell; iconColor?: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: danger ? 'rgba(239,68,68,0.04)' : 'var(--st-surface)',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.22)' : 'var(--st-border)'}`,
      }}
    >
      <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-60" style={{ position: 'relative' }} aria-hidden />
      <div className="p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: danger ? 'rgba(239,68,68,0.10)' : 'var(--st-primary-10)', color: danger ? '#ef4444' : (iconColor ?? 'var(--st-primary)') }}
          >
            <Icon size={15} aria-hidden />
          </div>
          <h2
            className="font-display font-bold"
            style={{ color: danger ? '#ef4444' : 'var(--st-text)', letterSpacing: '-0.01em' }}
          >{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD FIELD
// ─────────────────────────────────────────────────────────────────────────────
function PwdField({ id, label, value, onChange, show, onToggle, error, autoComplete }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; show: boolean;
  onToggle: () => void; error?: string; autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--st-hint)' }}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className={`st-input pr-11 ${error ? 'st-input-error' : ''}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--st-icon)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--st-text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--st-icon)')}
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            role="alert" className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs font-medium"
            style={{ color: '#ef4444' }}
          >
            <AlertCircle size={11} aria-hidden /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [section, setSection] = useState<Section>('notifications');

  // Notifications
  const [notifs, setNotifs] = useState({
    emailComments:    true,
    emailDownloads:   false,
    emailValidations: true,
    emailNewsletter:  false,
    pushBrowser:      true,
    pushValidations:  true,
  });

  // Security
  const [pwd,     setPwd]     = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved,  setPwdSaved]  = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    { id: '1', device: 'Chrome · macOS',     icon: Monitor,     location: 'Yaoundé, CM', current: true,  lastSeen: 'Maintenant' },
    { id: '2', device: 'Firefox · Ubuntu',   icon: Monitor,     location: 'Douala, CM',  current: false, lastSeen: 'Il y a 2j'  },
    { id: '3', device: 'Safari · iPhone 15', icon: Smartphone,  location: 'Paris, FR',   current: false, lastSeen: 'Il y a 1 semaine' },
  ];

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic:  true,
    showEmail:      false,
    showLocation:   true,
    allowIndexing:  true,
    shareAnalytics: false,
  });

  const changePwd = async () => {
    const r = PwdSchema.safeParse(pwd);
    if (!r.success) {
      const e: Record<string, string> = {};
      r.error.issues.forEach((err) => { if (err.path[0]) e[String(err.path[0])] = err.message; });
      setPwdErrors(e);
      return;
    }
    setPwdErrors({});
    setSavingPwd(true);
    await new Promise((res) => setTimeout(res, 1200));
    setSavingPwd(false);
    setPwdSaved(true);
    setPwd({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwdSaved(false), 3000);
  };

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* Loading overlay */}
      <AnimatePresence>
        {savingPwd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(10,8,6,0.55)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl p-8"
              style={{ background: 'var(--st-surface)', border: '1px solid var(--st-border)' }}>
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--st-primary)' }} />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse" style={{ color: 'var(--st-hint)' }}>
                Mise à jour du mot de passe…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'var(--st-bg)', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        <div
          className="sticky top-0 z-30"
          style={{ background: 'var(--st-surface)', borderBottom: '1px solid var(--st-border)', backdropFilter: 'blur(16px)' }}
        >
          <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
          <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-6" style={{ background: 'var(--st-primary)' }} aria-hidden />
              <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--st-primary)' }}>
                Compte
              </span>
            </div>
            <h1
              className="mt-1 font-display font-black leading-none"
              style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', color: 'var(--st-text)', letterSpacing: '-0.02em' }}
            >
              Paramètres
            </h1>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--st-hint)' }}>Gérer votre compte et vos préférences</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

            {/* ══════════════════════════════════════════════════════
                SIDEBAR NAV
            ══════════════════════════════════════════════════════ */}
            <nav className="space-y-1" aria-label="Sections des paramètres">
              {SECTIONS.map(({ key, label, icon: Icon, danger }) => {
                const isActive = section === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSection(key)}
                    aria-current={isActive ? 'page' : undefined}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-150"
                    style={isActive
                      ? { background: danger ? '#ef4444' : 'var(--st-primary)', color: '#fff', boxShadow: `0 2px 10px ${danger ? 'rgba(239,68,68,0.28)' : 'var(--st-primary-20)'}` }
                      : { color: danger ? (section === key ? '#fff' : 'rgba(239,68,68,0.80)') : 'var(--st-muted)', background: 'transparent' }
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = danger ? 'rgba(239,68,68,0.08)' : 'var(--st-subtle)';
                        (e.currentTarget as HTMLElement).style.color = danger ? '#ef4444' : 'var(--st-text)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = danger ? 'rgba(239,68,68,0.80)' : 'var(--st-muted)';
                      }
                    }}
                  >
                    <Icon size={14} aria-hidden />
                    {label}
                    {key === 'danger' && !isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ══════════════════════════════════════════════════════
                CONTENT
            ══════════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >

                {/* ── NOTIFICATIONS ────────────────────────────────────── */}
                {section === 'notifications' && (
                  <>
                    <SectionCard title="Notifications Email" icon={Bell}>
                      <SettingRow label="Commentaires" desc="Recevoir un email quand quelqu'un commente vos motifs">
                        <Toggle checked={notifs.emailComments}    onChange={(v) => setNotifs((n) => ({ ...n, emailComments: v }))}    label="Notifications commentaires" />
                      </SettingRow>
                      <SettingRow label="Téléchargements" desc="Notifier à chaque téléchargement d'un de vos motifs">
                        <Toggle checked={notifs.emailDownloads}   onChange={(v) => setNotifs((n) => ({ ...n, emailDownloads: v }))}   label="Notifications téléchargements" />
                      </SettingRow>
                      <SettingRow label="Validations" desc="Recevoir le résultat des révisions de vos soumissions">
                        <Toggle checked={notifs.emailValidations} onChange={(v) => setNotifs((n) => ({ ...n, emailValidations: v }))} label="Notifications validations" />
                      </SettingRow>
                      <SettingRow label="Newsletter AVS" desc="Actualités, nouvelles fonctionnalités et événements">
                        <Toggle checked={notifs.emailNewsletter}  onChange={(v) => setNotifs((n) => ({ ...n, emailNewsletter: v }))}  label="Newsletter" />
                      </SettingRow>
                    </SectionCard>

                    <SectionCard title="Notifications Navigateur" icon={Monitor}>
                      <SettingRow label="Push actives" desc="Autoriser les notifications push du navigateur">
                        <Toggle checked={notifs.pushBrowser}     onChange={(v) => setNotifs((n) => ({ ...n, pushBrowser: v }))}     label="Push navigateur" />
                      </SettingRow>
                      <SettingRow label="Résultats de révision" desc="Notification immédiate à la validation d'un motif">
                        <Toggle checked={notifs.pushValidations} onChange={(v) => setNotifs((n) => ({ ...n, pushValidations: v }))} label="Push validations" />
                      </SettingRow>
                    </SectionCard>
                  </>
                )}

                {/* ── SÉCURITÉ ─────────────────────────────────────────── */}
                {section === 'security' && (
                  <>
                    {/* Change password */}
                    <SectionCard title="Changer le mot de passe" icon={Lock}>
                      <div className="space-y-4">
                        <PwdField id="current" label="Mot de passe actuel"      value={pwd.current} onChange={(v) => setPwd((p) => ({ ...p, current: v }))} show={showPwd.current} onToggle={() => setShowPwd((s) => ({ ...s, current: !s.current }))} error={pwdErrors['current']} autoComplete="current-password" />
                        <PwdField id="next"    label="Nouveau mot de passe"     value={pwd.next}    onChange={(v) => setPwd((p) => ({ ...p, next: v }))}    show={showPwd.next}    onToggle={() => setShowPwd((s) => ({ ...s, next: !s.next }))}       error={pwdErrors['next']}    autoComplete="new-password" />
                        <PwdField id="confirm" label="Confirmer le nouveau"     value={pwd.confirm} onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))} show={showPwd.confirm} onToggle={() => setShowPwd((s) => ({ ...s, confirm: !s.confirm }))} error={pwdErrors['confirm']} autoComplete="new-password" />

                        <button
                          onClick={() => void changePwd()}
                          disabled={savingPwd}
                          className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{
                            background: pwdSaved ? '#22c55e' : 'var(--st-primary)',
                            boxShadow: pwdSaved ? '0 4px 16px rgba(34,197,94,0.25)' : '0 4px 16px var(--st-primary-20)',
                            transition: 'background 0.3s, box-shadow 0.3s',
                          }}
                          aria-busy={savingPwd}
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={savingPwd ? 'saving' : pwdSaved ? 'saved' : 'idle'}
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center gap-2"
                            >
                              {savingPwd ? <><Loader2 size={13} className="animate-spin" /> Mise à jour…</>
                              : pwdSaved  ? <><CheckCircle2 size={13} /> Modifié !</>
                              :             <><Save size={13} /> Mettre à jour</>}
                            </motion.span>
                          </AnimatePresence>
                        </button>
                      </div>
                    </SectionCard>

                    {/* 2FA */}
                    <SectionCard title="Double authentification (2FA)" icon={Shield} iconColor="var(--st-green)">
                      <div className="flex items-start justify-between gap-6">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--st-muted)' }}>
                          Ajoutez une couche de sécurité via une application TOTP (Google Authenticator, Authy).
                        </p>
                        <Toggle checked={twoFA} onChange={setTwoFA} label="Activer 2FA" />
                      </div>
                      <AnimatePresence>
                        {twoFA && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div
                              className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                              style={{ background: 'var(--st-green-10)', borderLeft: '3px solid var(--st-green)', border: `1px solid rgba(74,103,65,0.22)`, borderLeftWidth: 3, color: 'var(--st-green)' }}
                            >
                              <p className="mb-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em]">Configuration requise</p>
                              <p className="text-xs" style={{ color: 'var(--st-muted)' }}>
                                Scannez le QR code avec votre application d&apos;authentification pour terminer la configuration.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </SectionCard>

                    {/* Active sessions */}
                    <SectionCard title="Sessions actives" icon={Monitor}>
                      <div className="space-y-2.5">
                        {sessions.map((s) => {
                          const DevIcon = s.icon;
                          return (
                            <div
                              key={s.id}
                              className="flex items-center justify-between rounded-xl p-3.5 transition-all"
                              style={{
                                background: s.current ? 'var(--st-primary-10)' : 'var(--st-subtle)',
                                border: `1px solid ${s.current ? 'var(--st-primary-20)' : 'var(--st-border)'}`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                                  style={{ background: s.current ? 'var(--st-primary-20)' : 'var(--st-border)', color: s.current ? 'var(--st-primary)' : 'var(--st-hint)' }}
                                >
                                  <DevIcon size={14} aria-hidden />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--st-text)' }}>{s.device}</p>
                                    {s.current && (
                                      <span className="rounded-md px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[0.14em]"
                                        style={{ background: 'var(--st-primary-10)', color: 'var(--st-primary)', border: '1px solid var(--st-primary-20)' }}>
                                        Actuelle
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs" style={{ color: 'var(--st-hint)' }}>{s.location} · {s.lastSeen}</p>
                                </div>
                              </div>
                              {!s.current && (
                                <button
                                  className="text-xs font-semibold transition-colors"
                                  style={{ color: 'rgba(239,68,68,0.70)' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(239,68,68,0.70)')}
                                >
                                  Révoquer
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── CONFIDENTIALITÉ ──────────────────────────────────── */}
                {section === 'privacy' && (
                  <>
                    <SectionCard title="Profil Public" icon={Globe}>
                      <SettingRow label="Profil visible" desc="Votre profil est accessible à tous les utilisateurs AVS">
                        <Toggle checked={privacy.profilePublic}  onChange={(v) => setPrivacy((p) => ({ ...p, profilePublic: v }))}  label="Profil public" />
                      </SettingRow>
                      <SettingRow label="Afficher l'email" desc="Visible sur votre page profil publique">
                        <Toggle checked={privacy.showEmail}      onChange={(v) => setPrivacy((p) => ({ ...p, showEmail: v }))}      label="Email public" />
                      </SettingRow>
                      <SettingRow label="Afficher la localisation" desc="Pays et ville sur votre profil">
                        <Toggle checked={privacy.showLocation}   onChange={(v) => setPrivacy((p) => ({ ...p, showLocation: v }))}   label="Localisation publique" />
                      </SettingRow>
                    </SectionCard>

                    <SectionCard title="Données & Analytique" icon={Shield} iconColor="var(--st-green)">
                      <SettingRow label="Indexation par les moteurs de recherche" desc="Votre profil peut apparaître dans Google/Bing">
                        <Toggle checked={privacy.allowIndexing}   onChange={(v) => setPrivacy((p) => ({ ...p, allowIndexing: v }))}   label="Indexation SEO" />
                      </SettingRow>
                      <SettingRow label="Partager les données d'usage" desc="Aidez-nous à améliorer AVS de façon anonyme">
                        <Toggle checked={privacy.shareAnalytics}  onChange={(v) => setPrivacy((p) => ({ ...p, shareAnalytics: v }))}  label="Analytique anonyme" />
                      </SettingRow>

                      <div className="pt-2">
                        <button
                          className="flex items-center gap-1.5 text-xs font-semibold underline-offset-3 hover:underline"
                          style={{ color: 'var(--st-primary)' }}
                        >
                          Télécharger mes données (RGPD) <ArrowRight size={11} />
                        </button>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── ZONE DE DANGER ───────────────────────────────────── */}
                {section === 'danger' && (
                  <>
                    {/* Deactivate */}
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)' }}
                    >
                      <div className="p-6">
                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }}>
                            <Lock size={14} aria-hidden />
                          </div>
                          <div>
                            <h2 className="font-display font-bold" style={{ color: 'var(--st-text)', letterSpacing: '-0.01em' }}>Désactiver le compte</h2>
                            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--st-muted)' }}>
                              Votre compte sera désactivé temporairement. Vos motifs restent accessibles mais vous ne pourrez plus vous connecter.
                            </p>
                          </div>
                        </div>
                        <button
                          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
                          style={{ border: '1.5px solid rgba(239,68,68,0.35)', color: '#ef4444', background: 'rgba(239,68,68,0.06)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                        >
                          Désactiver mon compte
                        </button>
                      </div>
                    </div>

                    {/* Delete — stronger visual weight */}
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '2px solid rgba(239,68,68,0.28)' }}
                    >
                      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)' }} aria-hidden />
                      <div className="p-6">
                        <div className="mb-5 flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(239,68,68,0.15)', color: '#dc2626' }}>
                            <Trash2 size={14} aria-hidden />
                          </div>
                          <div>
                            <h2 className="font-display font-bold" style={{ color: '#dc2626', letterSpacing: '-0.01em' }}>Supprimer le compte</h2>
                            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--st-muted)' }}>
                              <strong style={{ color: '#dc2626' }}>Cette action est irréversible.</strong> Tous vos motifs, données et contributions seront définitivement supprimés.
                            </p>
                          </div>
                        </div>

                        {/* Warning note */}
                        <div
                          className="mb-5 rounded-xl px-4 py-3 text-sm leading-relaxed"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
                        >
                          <p className="mb-1 font-mono text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: '#ef4444' }}>Attention</p>
                          <p className="text-xs" style={{ color: 'var(--st-muted)' }}>
                            Les motifs publiés et validés par la communauté seront archivés et attribués à «&nbsp;Contributeur Anonyme&nbsp;» pour préserver l&apos;intégrité du standard.
                          </p>
                        </div>

                        <button
                          onClick={() => confirm('Êtes-vous absolument certain ? Cette action est irréversible.') && alert('Compte supprimé (mock)')}
                          className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                          style={{ background: '#dc2626', boxShadow: '0 4px 16px rgba(220,38,38,0.30)' }}
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                          <Trash2 size={13} />
                          Supprimer définitivement mon compte
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}