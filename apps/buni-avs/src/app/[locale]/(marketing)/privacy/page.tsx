'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Cookie, ChevronRight, AlertCircle } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.6, delay, ease },
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-avs-secondary">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="avs-pattern-ndop-sultan relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.88) 100%)' }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 60%, rgba(79,124,255,0.16) 0%, transparent 68%)' }} aria-hidden />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-avs-ndop/12 text-avs-ndop" {...fadeUp(0.1)}>
            <Shield size={28} />
          </motion.div>
          <motion.h1
            {...fadeUp(0.15)}
            className="font-display font-black leading-[.9] text-avs-secondary"
            style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', letterSpacing: '-0.025em' }}
          >
            Politique de<br />
            <span className="text-avs-ndop">confidentialité</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-avs-secondary/55">
            Dernière mise à jour : Juillet 2026
          </motion.p>
        </div>
      </section>

      {/* ══ CONTENT ═══════════════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          
          <motion.div {...fadeUp(0.25)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              AVS (African Visual Standard) s&apos;engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre plateforme.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">2. Données collectées</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services :
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-avs-primary/10 text-avs-primary">
                  <Eye size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-avs-accent">Données de compte</p>
                  <p className="mt-1 text-xs text-avs-accent/50">Nom, email, et informations de profil que vous fournissez lors de l&apos;inscription</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-avs-ndop/10 text-avs-ndop">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-avs-accent">Données de contribution</p>
                  <p className="mt-1 text-xs text-avs-accent/50">Motifs, descriptions et métadonnées que vous soumettez à la plateforme</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-avs-kente/10 text-avs-kente">
                  <Cookie size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-avs-accent">Données techniques</p>
                  <p className="mt-1 text-xs text-avs-accent/50">Adresse IP, type de navigateur, et données d&apos;utilisation pour améliorer nos services</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.35)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">3. Utilisation des données</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Vos données sont utilisées pour :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Fournir et améliorer nos services
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Communiquer avec vous concernant votre compte
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Analyser l&apos;utilisation de la plateforme pour des améliorations
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Assurer la sécurité et prévenir les abus
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.4)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">4. Protection des données</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <Lock size={14} className="mt-1 shrink-0 text-avs-primary" />
                Chiffrement des données sensibles
              </li>
              <li className="flex items-start gap-2">
                <Lock size={14} className="mt-1 shrink-0 text-avs-primary" />
                Accès restreint aux données personnelles
              </li>
              <li className="flex items-start gap-2">
                <Lock size={14} className="mt-1 shrink-0 text-avs-primary" />
                Audits de sécurité réguliers
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.45)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">5. Partage des données</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous ne vendons pas vos données personnelles. Nous pouvons partager vos données uniquement dans les cas suivants :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Avec votre consentement explicite
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Pour se conformer aux obligations légales
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Avec nos prestataires de services techniques (hébergement, analytics)
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.5)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">6. Vos droits</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Conformément au RGPD et aux lois applicables, vous disposez des droits suivants :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Accéder à vos données personnelles
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Rectifier des données inexactes
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Supprimer vos données (droit à l&apos;oubli)
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                S&apos;opposer au traitement de vos données
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-avs-primary" />
                <p className="text-xs font-medium text-avs-accent/70">
                  Pour exercer ces droits, contactez-nous à <span className="font-semibold text-avs-primary">buni@avs-standard.com</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.55)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">7. Cookies</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous utilisons des cookies pour améliorer votre expérience de navigation :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Cookies essentiels : nécessaires au fonctionnement de la plateforme
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Cookies de préférences : mémorisent vos choix de navigation
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Cookies analytiques : nous aident à comprendre l&apos;utilisation de la plateforme
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.6)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">8. Conservation des données</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Vos données personnelles sont conservées uniquement aussi longtemps que nécessaire pour les finalités pour lesquelles elles ont été collectées. Lorsque vous supprimez votre compte, vos données personnelles sont supprimées dans un délai raisonnable, à l&apos;exception des données nécessaires à des obligations légales ou à des fins statistiques anonymisées.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.65)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">9. Modifications de la politique</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront notifiées sur la plateforme et entreront en vigueur dès leur publication. Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.7)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">10. Contact</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos données, n&apos;hésitez pas à nous contacter via notre page de contact ou à l&apos;adresse : <span className="font-semibold text-avs-primary">buni@avs-standard.com</span>
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
