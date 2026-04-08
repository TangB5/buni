'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Trash2, Eye, EyeOff, Save, Loader2, CheckCircle2, Shield, Globe } from 'lucide-react';
import { z } from 'zod';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

// ── Sections ───────────────────────────────────────────────────────────────────
type Section = 'notifications' | 'security' | 'privacy' | 'danger';

const SECTIONS: { key: Section; label: string; icon: typeof Bell }[] = [
  { key:'notifications', label:'Notifications',  icon: Bell   },
  { key:'security',      label:'Sécurité',        icon: Lock   },
  { key:'privacy',       label:'Confidentialité', icon: Globe  },
  { key:'danger',        label:'Zone de danger',  icon: Trash2 },
];

// ── Toggle switch ──────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avs-primary focus-visible:ring-offset-2 ${checked ? 'bg-avs-primary' : 'bg-avs-accent/20'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-1'}`} />
    </button>
  );
}

// ── SettingRow ─────────────────────────────────────────────────────────────────
function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-avs-accent/8 last:border-0">
      <div>
        <p className="text-sm font-semibold text-avs-accent">{label}</p>
        {desc && <p className="text-xs text-avs-accent/45 mt-0.5 leading-snug">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const PwdSchema = z.object({
  current: z.string().min(8, 'Minimum 8 caractères'),
  next:    z.string().min(8).regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
  confirm: z.string(),
}).refine(d => d.next === d.confirm, { message: 'Les mots de passe ne correspondent pas', path:['confirm'] });

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('notifications');

  // Notifications
  const [notifs, setNotifs] = useState({
    emailComments:     true,
    emailDownloads:    false,
    emailValidations:  true,
    emailNewsletter:   false,
    pushBrowser:       true,
    pushValidations:   true,
  });

  // Security
  const [pwd, setPwd] = useState({ current:'', next:'', confirm:'' });
  const [showPwd, setShowPwd] = useState({ current:false, next:false, confirm:false });
  const [pwdErrors, setPwdErrors] = useState<Record<string,string>>({});
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [sessions] = useState([
    { id:'1', device:'Chrome · macOS',     location:'Yaoundé, CM', current:true,  lastSeen:'Maintenant' },
    { id:'2', device:'Firefox · Ubuntu',   location:'Douala, CM',  current:false, lastSeen:'Il y a 2j' },
    { id:'3', device:'Safari · iPhone 15', location:'Paris, FR',   current:false, lastSeen:'Il y a 1 sem' },
  ]);

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic:    true,
    showEmail:        false,
    showLocation:     true,
    allowIndexing:    true,
    shareAnalytics:   false,
  });

  const changePwd = async () => {
    const r = PwdSchema.safeParse(pwd);
    if (!r.success) {
      const e: Record<string,string> = {};
      r.error.issues.forEach(err => { if (err.path[0]) e[String(err.path[0])] = err.message; });
      setPwdErrors(e);
      return;
    }
    setPwdErrors({});
    setSavingPwd(true);
    await new Promise(res => setTimeout(res, 1200));
    setSavingPwd(false);
    setPwdSaved(true);
    setPwd({ current:'', next:'', confirm:'' });
    setTimeout(() => setPwdSaved(false), 3000);
  };

  return (
    <>
      <LoadingOverlay isLoading={savingPwd} message="Mise à jour du mot de passe…" />
      <div className="min-h-screen bg-avs-secondary/50">
      {/* Header */}
      <div className="border-b border-avs-accent/10 bg-avs-secondary px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-2xl font-bold text-avs-accent">Paramètres</h1>
          <p className="text-sm text-avs-accent/50">Gérer votre compte et vos préférences</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">

          {/* ── Sidebar sections ─────────────────────────────────────────── */}
          <nav className="space-y-1" aria-label="Sections des paramètres">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSection(key)}
                className={`w-full flex items-center gap-3 rounded-avs px-3 py-2.5 text-sm font-medium transition-all text-left
                  ${section === key
                    ? 'bg-avs-primary text-avs-secondary shadow-avs'
                    : `text-avs-accent/60 hover:bg-avs-accent/8 hover:text-avs-accent ${key === 'danger' ? 'hover:text-red-600' : ''}`}`}
                aria-current={section === key ? 'page' : undefined}
              >
                <Icon size={15} aria-hidden />
                {label}
              </button>
            ))}
          </nav>

          {/* ── Contenu section ────────────────────────────────────────────── */}
          <motion.div key={section} initial={{opacity:0, x:12}} animate={{opacity:1, x:0}} transition={{duration:0.2}}>

            {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
            {section === 'notifications' && (
              <div className="avs-card p-6 space-y-1">
                <h2 className="font-display font-bold text-avs-accent mb-2">Notifications Email</h2>
                <SettingRow label="Commentaires" desc="Recevoir un email quand quelqu'un commente vos motifs">
                  <Toggle checked={notifs.emailComments} onChange={v => setNotifs(n=>({...n,emailComments:v}))} label="Notifications commentaires" />
                </SettingRow>
                <SettingRow label="Téléchargements" desc="Notifier à chaque téléchargement d'un de vos motifs">
                  <Toggle checked={notifs.emailDownloads} onChange={v => setNotifs(n=>({...n,emailDownloads:v}))} label="Notifications téléchargements" />
                </SettingRow>
                <SettingRow label="Validations" desc="Recevoir le résultat des révisions de vos soumissions">
                  <Toggle checked={notifs.emailValidations} onChange={v => setNotifs(n=>({...n,emailValidations:v}))} label="Notifications validations" />
                </SettingRow>
                <SettingRow label="Newsletter AVS" desc="Actualités, nouvelles fonctionnalités et événements">
                  <Toggle checked={notifs.emailNewsletter} onChange={v => setNotifs(n=>({...n,emailNewsletter:v}))} label="Newsletter" />
                </SettingRow>

                <div className="pt-4">
                  <h2 className="font-display font-bold text-avs-accent mb-2">Notifications Navigateur</h2>
                  <SettingRow label="Push actives" desc="Autoriser les notifications push du navigateur">
                    <Toggle checked={notifs.pushBrowser} onChange={v => setNotifs(n=>({...n,pushBrowser:v}))} label="Push navigateur" />
                  </SettingRow>
                  <SettingRow label="Résultats de révision" desc="Notification immédiate à la validation d'un motif">
                    <Toggle checked={notifs.pushValidations} onChange={v => setNotifs(n=>({...n,pushValidations:v}))} label="Push validations" />
                  </SettingRow>
                </div>
              </div>
            )}

            {/* ── SÉCURITÉ ───────────────────────────────────────────────── */}
            {section === 'security' && (
              <div className="space-y-5">
                {/* Changer le mot de passe */}
                <div className="avs-card p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={16} className="text-avs-accent/60" />
                    <h2 className="font-display font-bold text-avs-accent">Changer le mot de passe</h2>
                  </div>
                  {(['current','next','confirm'] as const).map(k => (
                    <div key={k}>
                      <label className="avs-label">
                        {k==='current'?'Mot de passe actuel':k==='next'?'Nouveau mot de passe':'Confirmer le nouveau'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPwd[k] ? 'text' : 'password'}
                          value={pwd[k]}
                          onChange={e => setPwd(p=>({...p,[k]:e.target.value}))}
                          className={`avs-input pr-10 ${pwdErrors[k] ? 'avs-input-error' : ''}`}
                          placeholder="••••••••"
                          autoComplete={k==='current'?'current-password':'new-password'}
                        />
                        <button type="button"
                          onClick={() => setShowPwd(s=>({...s,[k]:!s[k]}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-avs-accent/35 hover:text-avs-accent"
                          aria-label={showPwd[k]?'Masquer':'Afficher'}>
                          {showPwd[k] ? <EyeOff size={15}/> : <Eye size={15}/>}
                        </button>
                      </div>
                      {pwdErrors[k] && <p role="alert" className="mt-1 text-xs text-red-600">{pwdErrors[k]}</p>}
                    </div>
                  ))}
                  <button onClick={() => void changePwd()} disabled={savingPwd}
                    className="avs-btn-primary py-2 px-4 text-sm gap-1.5">
                    {savingPwd ? <><Loader2 size={13} className="animate-spin"/> Mise à jour…</>
                    : pwdSaved  ? <><CheckCircle2 size={13}/> Modifié !</>
                                : <><Save size={13}/> Mettre à jour</>}
                  </button>
                </div>

                {/* 2FA */}
                <div className="avs-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={16} className="text-avs-ndop" />
                        <h2 className="font-display font-bold text-avs-accent">Double authentification (2FA)</h2>
                      </div>
                      <p className="text-sm text-avs-accent/55">Ajoutez une couche de sécurité supplémentaire à votre compte via une application TOTP.</p>
                    </div>
                    <Toggle checked={twoFA} onChange={setTwoFA} label="Activer 2FA" />
                  </div>
                  {twoFA && (
                    <div className="mt-4 rounded-avs border-l-4 border-avs-ndop bg-avs-ndop/8 px-4 py-3 text-xs text-avs-accent/70">
                      Scannez le QR code avec Google Authenticator ou Authy pour terminer la configuration.
                    </div>
                  )}
                </div>

                {/* Sessions actives */}
                <div className="avs-card p-6">
                  <h2 className="font-display font-bold text-avs-accent mb-4">Sessions actives</h2>
                  <div className="space-y-3">
                    {sessions.map(s => (
                      <div key={s.id} className={`flex items-center justify-between rounded-avs p-3 ${s.current ? 'bg-avs-primary/8 border border-avs-primary/20' : 'bg-avs-accent/4'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-avs-accent">{s.device}</p>
                            {s.current && <span className="text-[10px] font-bold text-avs-primary uppercase tracking-wider">Session actuelle</span>}
                          </div>
                          <p className="text-xs text-avs-accent/45">{s.location} · {s.lastSeen}</p>
                        </div>
                        {!s.current && (
                          <button className="text-xs font-semibold text-red-500 hover:text-red-700">
                            Révoquer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CONFIDENTIALITÉ ────────────────────────────────────────── */}
            {section === 'privacy' && (
              <div className="avs-card p-6 space-y-1">
                <h2 className="font-display font-bold text-avs-accent mb-2">Profil Public</h2>
                <SettingRow label="Profil visible" desc="Votre profil est accessible à tous les utilisateurs AVS">
                  <Toggle checked={privacy.profilePublic} onChange={v=>setPrivacy(p=>({...p,profilePublic:v}))} label="Profil public" />
                </SettingRow>
                <SettingRow label="Afficher l'email" desc="Visible sur votre page profil publique">
                  <Toggle checked={privacy.showEmail} onChange={v=>setPrivacy(p=>({...p,showEmail:v}))} label="Email public" />
                </SettingRow>
                <SettingRow label="Afficher la localisation" desc="Pays et ville sur votre profil">
                  <Toggle checked={privacy.showLocation} onChange={v=>setPrivacy(p=>({...p,showLocation:v}))} label="Localisation publique" />
                </SettingRow>
                <div className="pt-4">
                  <h2 className="font-display font-bold text-avs-accent mb-2">Données & Analytique</h2>
                  <SettingRow label="Indexation par les moteurs de recherche" desc="Votre profil peut apparaître dans Google/Bing">
                    <Toggle checked={privacy.allowIndexing} onChange={v=>setPrivacy(p=>({...p,allowIndexing:v}))} label="Indexation SEO" />
                  </SettingRow>
                  <SettingRow label="Partager les données d'usage" desc="Aidez-nous à améliorer AVS de façon anonyme">
                    <Toggle checked={privacy.shareAnalytics} onChange={v=>setPrivacy(p=>({...p,shareAnalytics:v}))} label="Analytique anonyme" />
                  </SettingRow>
                </div>
                <div className="pt-4">
                  <button className="text-xs text-avs-accent/50 underline-offset-4 hover:underline hover:text-avs-accent">
                    Télécharger mes données (RGPD)
                  </button>
                </div>
              </div>
            )}

            {/* ── ZONE DE DANGER ─────────────────────────────────────────── */}
            {section === 'danger' && (
              <div className="space-y-5">
                <div className="avs-card p-6 border border-red-200 bg-red-50/30">
                  <div className="flex items-start gap-3 mb-4">
                    <Trash2 size={18} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h2 className="font-display font-bold text-avs-accent">Désactiver le compte</h2>
                      <p className="text-sm text-avs-accent/55 mt-1">Votre compte sera désactivé temporairement. Vos motifs restent accessibles mais vous ne pourrez plus vous connecter.</p>
                    </div>
                  </div>
                  <button className="rounded-avs border-2 border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                    Désactiver mon compte
                  </button>
                </div>

                <div className="avs-card p-6 border-2 border-red-300 bg-red-50/40">
                  <div className="flex items-start gap-3 mb-4">
                    <Trash2 size={18} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <h2 className="font-display font-bold text-red-700">Supprimer le compte</h2>
                      <p className="text-sm text-red-600/70 mt-1">
                        <strong>Cette action est irréversible.</strong> Tous vos motifs, données et contributions seront définitivement supprimés.
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 rounded-avs bg-red-100 px-4 py-3 text-xs text-red-700 leading-relaxed">
                    ⚠️ Les motifs publi&eacute;s et valid&eacute;s par la communaut&eacute; seront archiv&eacute;s et attribu&eacute;s &agrave; &laquo;&nbsp;Contributeur Anonyme&nbsp;&raquo; pour pr&eacute;server l&apos;int&eacute;grit&eacute; du standard.
                  </div>
                  <button
                    onClick={() => confirm('Êtes-vous absolument certain ? Cette action est irréversible.') && alert('Compte supprimé (mock)')}
                    className="rounded-avs bg-red-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-red-700 transition-colors">
                    Supprimer définitivement mon compte
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );}
