'use client';

import { motion } from 'framer-motion';
import { Shield, Scale, AlertCircle, ChevronRight, FileText } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.6, delay, ease },
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-avs-secondary">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="avs-pattern-kente-royale relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.94) 0%, rgba(26,18,8,0.88) 100%)' }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 60%, rgba(192,87,62,0.16) 0%, transparent 68%)' }} aria-hidden />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-avs-primary/12 text-avs-primary" {...fadeUp(0.1)}>
            <Scale size={28} />
          </motion.div>
          <motion.h1
            {...fadeUp(0.15)}
            className="font-display font-black leading-[.9] text-avs-secondary"
            style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', letterSpacing: '-0.025em' }}
          >
            Conditions<br />
            <span className="text-avs-primary">d&apos;utilisation</span>
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
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">1. Acceptation des conditions</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              En accédant à AVS (African Visual Standard) et en utilisant nos services, vous acceptez les présentes conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">2. Description du service</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              AVS est une archive visuelle open-source dédiée aux motifs et patterns africains. Notre mission est de préserver, documenter et partager le patrimoine visuel africain à travers une plateforme collaborative.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Accès gratuit aux ressources sous licence CC BY 4.0
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Possibilité de contribuer et de soumettre des motifs
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Outils de recherche et de filtrage avancés
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.35)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">3. Comptes utilisateurs</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Pour certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte.
            </p>
            <div className="mt-4 rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-avs-primary" />
                <p className="text-xs font-medium text-avs-accent/70">
                  Nous nous réservons le droit de suspendre ou de résilier les comptes qui violent nos conditions d&apos;utilisation.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.4)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">4. Propriété intellectuelle</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Tous les contenus disponibles sur AVS sont protégés par les lois sur la propriété intellectuelle.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
                <p className="text-sm font-semibold text-avs-accent">Ressources visuelles (motifs, patterns)</p>
                <p className="mt-1 text-xs text-avs-accent/50">
                  Mises à disposition sous licence Creative Commons CC BY 4.0. Vous pouvez les utiliser librement à condition d&apos;attribuer la source.
                </p>
              </div>
              <div className="rounded-xl border border-avs-accent/8 bg-avs-secondary p-4">
                <p className="text-sm font-semibold text-avs-accent">Logiciel AVS Standard</p>
                <p className="mt-1 text-xs text-avs-accent/50">
                  Distribué sous licence Apache 2.0 avec Commons Clause (non-commercial). L&apos;usage commercial du logiciel est interdit sans autorisation écrite.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.45)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">5. Contributions</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              En soumettant des motifs à AVS, vous déclarez être le propriétaire des droits ou avoir l&apos;autorisation nécessaire. Vous accordez à AVS une licence mondiale, non exclusive, perpétuelle et libre de redevances pour utiliser, reproduire et distribuer votre contribution.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.5)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">6. Utilisation acceptable</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Vous acceptez de n&apos;utiliser AVS que dans un but légitime et conformément aux lois applicables. Il est interdit d&apos;utiliser la plateforme pour :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-avs-accent/60">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Violer les droits de propriété intellectuelle d&apos;autrui
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Diffuser du contenu offensant, discriminatoire ou illégal
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-1 shrink-0 text-avs-primary" />
                Tenter d&apos;interrompre ou de compromettre la sécurité de la plateforme
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.55)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">7. Limitation de responsabilité</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              AVS est fourni « tel quel » sans aucune garantie. Nous ne pouvons garantir l&apos;exactitude, la complétude ou la disponibilité permanente de la plateforme. En aucun cas AVS ne pourra être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation de nos services.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.6)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">8. Modifications des conditions</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Nous nous réservons le droit de modifier ces conditions d&apos;utilisation à tout moment. Les modifications entreront en vigueur dès leur publication sur la plateforme. Il est de votre responsabilité de consulter régulièrement cette page.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.65)}>
            <h2 className="mb-4 font-display text-xl font-black text-avs-accent">9. Contact</h2>
            <p className="text-sm leading-relaxed text-avs-accent/60">
              Pour toute question concernant ces conditions d&apos;utilisation, n&apos;hésitez pas à nous contacter via notre page de contact ou à l&apos;adresse : <span className="font-semibold text-avs-primary">buni@avs-standard.com</span>
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
