'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Lock, Trash2, Eye, EyeOff, Save,
  Loader2, CheckCircle2, Shield, Globe,
  AlertCircle, Monitor, Smartphone, ArrowRight,
} from 'lucide-react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { userService } from '@/features/user/services/user.service';
import type { UserSettings } from '@/features/user/types/dto/settings.dto';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type Section = 'notifications' | 'security' | 'privacy' | 'danger';

function getSections(t: any): { key: Section; label: string; icon: typeof Bell; danger?: boolean }[] {
  return [
    { key: 'notifications', label: t('sections.notifications'), icon: Bell    },
    { key: 'security',      label: t('sections.security'),      icon: Lock    },
    { key: 'privacy',       label: t('sections.privacy'),       icon: Globe   },
    { key: 'danger',        label: t('sections.danger'),        icon: Trash2, danger: true },
  ];
}

function getPwdSchema(t: any) {
  return z.object({
    current: z.string().min(8, t('validation.min8')),
    next:    z.string().min(8, t('validation.min8')).regex(/[A-Z]/, t('validation.uppercase')).regex(/[0-9]/, t('validation.number')),
    confirm: z.string(),
  }).refine((d) => d.next === d.confirm, { message: t('validation.noMatch'), path: ['confirm'] });
}

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL STYLES — only what Tailwind can't express
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  ::placeholder { color: rgba(29,29,27,0.35) !important; opacity: 1; }
  .dark ::placeholder { color: rgba(236,232,225,0.30) !important; }

  .st-input {
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
  }
  .st-input:focus {
    border-color: var(--avs-primary);
    box-shadow: 0 0 0 3px rgba(192,87,62,0.08);
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
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2 ${checked ? 'bg-avs-primary shadow-avs' : 'bg-avs-accent/16'}`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
        className="inline-block h-3.5 w-3.5 rounded-full bg-avs-secondary shadow-sm"
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
    <div className="flex items-center justify-between gap-6 py-4 border-b border-avs-accent/9 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-avs-accent">{label}</p>
        {desc && <p className="mt-0.5 text-xs leading-snug text-avs-accent/35">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, accentClass = 'text-avs-primary', iconBgClass = 'bg-avs-primary/8', children, danger }: {
  title: string; icon: typeof Bell;
  accentClass?: string; iconBgClass?: string;
  children: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${danger ? 'bg-red-500/4 border-red-500/22' : 'bg-avs-secondary border-avs-accent/9'}`}>
      <div className="avs-pattern-ndop-sultan h-px w-full opacity-60" aria-hidden />
      <div className="p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${danger ? 'bg-red-500/10 text-red-500' : `${iconBgClass} ${accentClass}`}`}>
            <Icon size={15} aria-hidden />
          </div>
          <h2 className={`font-display font-bold ${danger ? 'text-red-500' : 'text-avs-accent'}`} style={{ letterSpacing: '-0.01em' }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD FIELD
// ─────────────────────────────────────────────────────────────────────────────

function PwdField({ id, label, value, onChange, show, onToggle, error, autoComplete, t }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; show: boolean;
  onToggle: () => void; error?: string; autoComplete?: string; t: any;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-avs-accent/35">{label}</label>
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
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-avs-accent/30 hover:text-avs-accent transition-colors"
          aria-label={show ? t('security.password.hide') : t('security.password.show')}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
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
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');
  const [section, setSection] = useState<Section>('notifications');
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const [notifs, setNotifs] = useState({
    emailComments: true, emailDownloads: false, emailValidations: true, emailNewsletter: false,
    pushBrowser: true, pushValidations: true,
  });

  const [pwd,      setPwd]      = useState({ current: '', next: '', confirm: '' });
  const [showPwd,  setShowPwd]  = useState({ current: false, next: false, confirm: false });
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved,  setPwdSaved]  = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [twoFA, setTwoFA] = useState(false);

  const [sessions, setSessions] = useState<Array<{
    id: string;
    device: string;
    location: string;
    lastSeen: string;
    current: boolean;
  }>>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [privacy, setPrivacy] = useState({
    profilePublic: true, showEmail: false, showLocation: true,
    allowIndexing: true, shareAnalytics: false,
  });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await userService.getSettings();

        setNotifs(settings.notifications);
        setPrivacy(settings.privacy);
        setTwoFA(settings.security.twoFAEnabled);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Load sessions when security section is active
  useEffect(() => {
    if (section === 'security') {
      const loadSessions = async () => {
        setLoadingSessions(true);
        try {
          const sessionData = await userService.getSessions();
          setSessions(sessionData);
        } catch (error) {
          console.error('Failed to load sessions:', error);
        } finally {
          setLoadingSessions(false);
        }
      };

      loadSessions();
    }
  }, [section]);

  // Update notification settings
  const updateNotificationSetting = async (key: keyof typeof notifs, value: boolean) => {
    setNotifs(prev => ({ ...prev, [key]: value }));
    
    try {
      await userService.updateSettings({ 
        [key]: value,
      });
    } catch (error) {
      console.error('Failed to update notification setting:', error);
      // Revert on error
      setNotifs(prev => ({ ...prev, [key]: !value }));
    }
  };

  // Update privacy settings
  const updatePrivacySetting = async (key: keyof typeof privacy, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    
    try {
      await userService.updateSettings({
        [key]: value,
      });
    } catch (error) {
      console.error('Failed to update privacy setting:', error);
      // Revert on error
      setPrivacy(prev => ({ ...prev, [key]: !value }));
    }
  };

  // Update 2FA setting
  const update2FASetting = async (value: boolean) => {
    setTwoFA(value);

    try {
      await userService.updateSettings({ twoFAEnabled: value });
    } catch (error) {
      console.error('Failed to update 2FA setting:', error);
      setTwoFA(!value);
    }
  };

  // Revoke a specific session
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await userService.revokeSession(sessionId);
      // Refresh sessions
      const sessionData = await userService.getSessions();
      setSessions(sessionData);
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const changePwd = async () => {
    const schema = getPwdSchema(t);
    const r = schema.safeParse(pwd);
    if (!r.success) {
      const e: Record<string, string> = {};
      r.error.issues.forEach((err) => { if (err.path[0]) e[String(err.path[0])] = err.message; });
      setPwdErrors(e);
      return;
    }
    setPwdErrors({});
    setPwdError(null);
    setSavingPwd(true);
    
    try {
      await userService.changePassword({
        currentPassword: pwd.current,
        newPassword: pwd.next,
      });
      setSavingPwd(false);
      setPwdSaved(true);
      setPwd({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwdSaved(false), 3000);
    } catch (error: any) {
      setSavingPwd(false);
      setPwdError(error.message || 'Failed to change password');
    }
  };

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* Loading overlay */}
      <AnimatePresence>
        {savingPwd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/55 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl p-8 bg-avs-secondary border border-avs-accent/9">
              <Loader2 size={28} className="animate-spin text-avs-primary" />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase animate-pulse text-avs-accent/35">
                {t('updatingPassword')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-avs-secondary-dark">

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 bg-avs-secondary border-b border-avs-accent/9 backdrop-blur-xl">
          <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
          <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-avs-primary" aria-hidden />
              <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">{t('account')}</span>
            </div>
            <h1 className="mt-1 font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', letterSpacing: '-0.02em' }}>
              {t('title')}
            </h1>
            <p className="mt-0.5 text-xs text-avs-accent/35">{t('subtitle')}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">

            {/* ══ SIDEBAR NAV ═════════════════════════════════════════════ */}
            <nav className="space-y-1" aria-label={t('sectionsLabel')}>
              {getSections(t).map(({ key, label, icon: Icon, danger }) => {
                const isActive = section === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSection(key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-150
                      ${isActive
                        ? danger
                          ? 'bg-red-500 text-avs-secondary shadow-avs'
                          : 'bg-avs-primary text-avs-secondary shadow-avs'
                        : danger
                          ? 'text-red-500/80 hover:bg-red-500/8 hover:text-red-500'
                          : 'text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-accent'
                      }
                    `}
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

            {/* ══ CONTENT ═════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >

                {/* ── NOTIFICATIONS ──────────────────────────────────────── */}
                {section === 'notifications' && (
                  <>
                    <SectionCard title={t('notifications.email.title')} icon={Bell}>
                      <SettingRow label={t('notifications.email.comments.label')} desc={t('notifications.email.comments.desc')}>
                        <Toggle checked={notifs.emailComments}    onChange={(v) => updateNotificationSetting('emailComments', v)}    label={t('notifications.email.comments.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('notifications.email.downloads.label')} desc={t('notifications.email.downloads.desc')}>
                        <Toggle checked={notifs.emailDownloads}   onChange={(v) => updateNotificationSetting('emailDownloads', v)}   label={t('notifications.email.downloads.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('notifications.email.validations.label')} desc={t('notifications.email.validations.desc')}>
                        <Toggle checked={notifs.emailValidations} onChange={(v) => updateNotificationSetting('emailValidations', v)} label={t('notifications.email.validations.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('notifications.email.newsletter.label')} desc={t('notifications.email.newsletter.desc')}>
                        <Toggle checked={notifs.emailNewsletter}  onChange={(v) => updateNotificationSetting('emailNewsletter', v)}  label={t('notifications.email.newsletter.toggle')} />
                      </SettingRow>
                    </SectionCard>

                    <SectionCard title={t('notifications.browser.title')} icon={Monitor}>
                      <SettingRow label={t('notifications.browser.push.label')} desc={t('notifications.browser.push.desc')}>
                        <Toggle checked={notifs.pushBrowser}     onChange={(v) => updateNotificationSetting('pushBrowser', v)}     label={t('notifications.browser.push.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('notifications.browser.reviews.label')} desc={t('notifications.browser.reviews.desc')}>
                        <Toggle checked={notifs.pushValidations} onChange={(v) => updateNotificationSetting('pushValidations', v)} label={t('notifications.browser.reviews.toggle')} />
                      </SettingRow>
                    </SectionCard>
                  </>
                )}

                {/* ── SÉCURITÉ ───────────────────────────────────────────── */}
                {section === 'security' && (
                  <>
                    <SectionCard title={t('security.password.title')} icon={Lock}>
                      <div className="space-y-4">
                        <PwdField id="current" label={t('security.password.current')}  value={pwd.current} onChange={(v) => setPwd((p) => ({ ...p, current: v }))} show={showPwd.current} onToggle={() => setShowPwd((s) => ({ ...s, current: !s.current }))} error={pwdErrors['current']} autoComplete="current-password" t={t} />
                        <PwdField id="next"    label={t('security.password.new')} value={pwd.next}    onChange={(v) => setPwd((p) => ({ ...p, next: v }))}    show={showPwd.next}    onToggle={() => setShowPwd((s) => ({ ...s, next: !s.next }))}       error={pwdErrors['next']}    autoComplete="new-password" t={t} />
                        <PwdField id="confirm" label={t('security.password.confirm')} value={pwd.confirm} onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))} show={showPwd.confirm} onToggle={() => setShowPwd((s) => ({ ...s, confirm: !s.confirm }))} error={pwdErrors['confirm']} autoComplete="new-password" t={t} />

                        <AnimatePresence>
                          {pwdError && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              role="alert"
                              className="flex items-center gap-1.5 overflow-hidden text-xs font-medium text-red-500"
                            >
                              <AlertCircle size={11} aria-hidden /> {pwdError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <button
                          onClick={() => void changePwd()}
                          disabled={savingPwd}
                          className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-avs-secondary transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${pwdSaved ? 'bg-emerald-500' : 'bg-avs-primary shadow-avs-md'}`}
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
                              {savingPwd ? <><Loader2 size={13} className="animate-spin" /> {t('security.password.updating')}</>
                              : pwdSaved  ? <><CheckCircle2 size={13} /> {t('security.password.updated')}</>
                              :             <><Save size={13} /> {t('security.password.update')}</>}
                            </motion.span>
                          </AnimatePresence>
                        </button>
                      </div>
                    </SectionCard>

                    {/* 2FA */}
                    <SectionCard title={t('security.2fa.title')} icon={Shield} accentClass="text-avs-ndop" iconBgClass="bg-avs-ndop/10">
                      <div className="flex items-start justify-between gap-6">
                        <p className="text-sm leading-relaxed text-avs-accent/55">
                          {t('security.2fa.description')}
                        </p>
                        <Toggle checked={twoFA} onChange={update2FASetting} label={t('security.2fa.toggle')} />
                      </div>
                      <AnimatePresence>
                        {twoFA && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="rounded-xl px-4 py-3 text-sm leading-relaxed bg-avs-ndop/10 border-l-[3px] border border-avs-ndop/22 text-avs-ndop" style={{ borderLeftColor: 'var(--avs-ndop)' }}>
                              <p className="mb-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em]">{t('security.2fa.setupRequired')}</p>
                              <p className="text-xs text-avs-accent/55">
                                {t('security.2fa.scanQR')}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </SectionCard>

                    {/* Active sessions */}
                    <SectionCard title={t('security.sessions.title')} icon={Monitor}>
                      <div className="space-y-2.5">
                        {loadingSessions ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 size={20} className="animate-spin text-avs-accent/35" />
                          </div>
                        ) : sessions.length === 0 ? (
                          <p className="text-sm text-avs-accent/35 py-4 text-center">{t('security.sessions.noSessions')}</p>
                        ) : (
                          sessions.map((s) => (
                            <div
                              key={s.id}
                              className={`flex items-center justify-between rounded-xl p-3.5 border ${s.current ? 'bg-avs-primary/8 border-avs-primary/20' : 'bg-avs-accent/4 border-avs-accent/9'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.current ? 'bg-avs-primary/20 text-avs-primary' : 'bg-avs-accent/9 text-avs-accent/35'}`}>
                                  <Monitor size={14} aria-hidden />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-avs-accent">{s.device}</p>
                                    {s.current && (
                                      <span className="rounded-md px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-[0.14em] bg-avs-primary/8 text-avs-primary border border-avs-primary/20">
                                        {t('security.sessions.current')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-avs-accent/35">{s.location} · {s.lastSeen}</p>
                                </div>
                              </div>
                              {!s.current && (
                                <button
                                  onClick={() => void handleRevokeSession(s.id)}
                                  className="text-xs font-semibold text-red-500/70 hover:text-red-500 transition-colors"
                                >
                                  {t('security.sessions.revoke')}
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── CONFIDENTIALITÉ ─────────────────────────────────────── */}
                {section === 'privacy' && (
                  <>
                    <SectionCard title={t('privacy.profile.title')} icon={Globe}>
                      <SettingRow label={t('privacy.profile.visible.label')} desc={t('privacy.profile.visible.desc')}>
                        <Toggle checked={privacy.profilePublic}  onChange={(v) => updatePrivacySetting('profilePublic', v)}  label={t('privacy.profile.visible.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('privacy.profile.email.label')} desc={t('privacy.profile.email.desc')}>
                        <Toggle checked={privacy.showEmail}      onChange={(v) => updatePrivacySetting('showEmail', v)}      label={t('privacy.profile.email.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('privacy.profile.location.label')} desc={t('privacy.profile.location.desc')}>
                        <Toggle checked={privacy.showLocation}   onChange={(v) => updatePrivacySetting('showLocation', v)}   label={t('privacy.profile.location.toggle')} />
                      </SettingRow>
                    </SectionCard>

                    <SectionCard title={t('privacy.data.title')} icon={Shield} accentClass="text-avs-ndop" iconBgClass="bg-avs-ndop/10">
                      <SettingRow label={t('privacy.data.indexing.label')} desc={t('privacy.data.indexing.desc')}>
                        <Toggle checked={privacy.allowIndexing}  onChange={(v) => updatePrivacySetting('allowIndexing', v)}  label={t('privacy.data.indexing.toggle')} />
                      </SettingRow>
                      <SettingRow label={t('privacy.data.analytics.label')} desc={t('privacy.data.analytics.desc')}>
                        <Toggle checked={privacy.shareAnalytics} onChange={(v) => updatePrivacySetting('shareAnalytics', v)} label={t('privacy.data.analytics.toggle')} />
                      </SettingRow>
                      <div className="pt-2">
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-avs-primary underline-offset-3 hover:underline">
                          {t('privacy.data.download')} <ArrowRight size={11} />
                        </button>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── ZONE DE DANGER ──────────────────────────────────────── */}
                {section === 'danger' && (
                  <>
                    {/* Deactivate */}
                    <div className="overflow-hidden rounded-2xl border border-red-500/18 bg-red-500/4">
                      <div className="p-6">
                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                            <Lock size={14} aria-hidden />
                          </div>
                          <div>
                            <h2 className="font-display font-bold text-avs-accent" style={{ letterSpacing: '-0.01em' }}>{t('danger.deactivate.title')}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-avs-accent/55">
                              {t('danger.deactivate.description')}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-red-500/35 text-red-500 bg-red-500/6 hover:bg-red-500/12 transition-all duration-200">
                          {t('danger.deactivate.button')}
                        </button>
                      </div>
                    </div>

                    {/* Delete — stronger visual weight */}
                    <div className="overflow-hidden rounded-2xl border-2 border-red-600/28 bg-red-500/6">
                      {/* Gradient top bar — justified inline: dynamic gradient */}
                      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)' }} aria-hidden />
                      <div className="p-6">
                        <div className="mb-5 flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600/15 text-red-600">
                            <Trash2 size={14} aria-hidden />
                          </div>
                          <div>
                            <h2 className="font-display font-bold text-red-600" style={{ letterSpacing: '-0.01em' }}>{t('danger.delete.title')}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-avs-accent/55">
                              <strong className="text-red-600">{t('danger.delete.warning')}</strong> {t('danger.delete.description')}
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 rounded-xl px-4 py-3 text-sm leading-relaxed bg-red-500/8 border border-red-500/22">
                          <p className="mb-1 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-red-500">{t('danger.delete.noteTitle')}</p>
                          <p className="text-xs text-avs-accent/55">
                            {t('danger.delete.note')}
                          </p>
                        </div>

                        <button
                          onClick={() => confirm(t('danger.delete.confirm')) && alert('Compte supprimé (mock)')}
                          className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-avs-secondary bg-red-600 hover:-translate-y-0.5 transition-all duration-200"
                          style={{ boxShadow: '0 4px 16px rgba(220,38,38,0.30)' }}
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                          <Trash2 size={13} />
                          {t('danger.delete.button')}
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