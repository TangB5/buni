'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import 'primeicons/primeicons.css';

const LINKS = {
  Standard: [
    { href: '/patterns', label: 'Motifs culturels' },
    { href: '/colors', label: 'Palettes & tokens' },
    { href: '/artisans', label: 'Réseau artisans' },
  ],
  Ressources: [
    { href: '/about', label: 'Notre mission' },
    { href: '/docs', label: 'Documentation' },
    { href: '/auth/register', label: 'Contribuer' },
  ],
  Légal: [
    { href: '/privacy', label: 'Confidentialité' },
    { href: '/terms', label: 'Conditions' },
    { href: '/licenses', label: 'Licences CC' },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-avs-secondary/5 bg-avs-accent relative overflow-hidden border-t">
      {/* ── EFFETS D'ARRIÈRE-PLAN PREMIUM ─────────────────────────────────── */}
      {/* Grille subtile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 235, 224, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 235, 224, 1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />
      {/* Halo radial ambré dans le coin gauche */}
      <div
        className="pointer-events-none absolute -top-[20%] -left-[10%] h-[500px] w-[500px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(192, 87, 62, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── SECTION HAUTE : Newsletter & CTA ─────────────────────────────── */}
        <div className="border-avs-secondary grid grid-cols-1 gap-8 border-b pb-12 lg:grid-cols-3 lg:items-center">
          <div className="lg:col-span-2">
            <h3 className="font-display text-avs-secondary text-xl font-bold">
              Rejoignez la transmission du patrimoine.
            </h3>
            <p className="text-avs-secondary mt-1 max-w-xl text-sm">
              Inscrivez-vous pour recevoir les nouveaux motifs documentés et les mises à jour des
              standards UI.
            </p>
          </div>
          <div className="flex gap-2 sm:max-w-md">
            <input
              type="email"
              placeholder="votre@email.com"
              className="rounded-avs border-avs-secondary bg-avs-secondary/5 text-avs-secondary placeholder:text-avs-secondary focus:border-avs-primary/50 w-full border px-4 py-3 text-sm transition-colors focus:outline-none"
            />
            <button className="rounded-avs bg-avs-primary text-avs-secondary hover:shadow-avs-md flex items-center gap-2 px-5 py-3 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5">
              S&apos;inscrire
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ── SECTION CENTRALE : Liens & Marque ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div
                className="avs-pattern-kente rounded-avs border-avs-secondary h-9 w-9 border shadow-sm"
                aria-hidden
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-avs-secondary text-xl font-bold">AVS</span>
                <span className="text-avs-primary text-[10px] font-bold tracking-widest uppercase">
                  African Visual Standard
                </span>
              </div>
            </div>
            <p className="text-avs-secondary mt-4 max-w-sm text-sm leading-relaxed">
              Le premier standard open-source dédié à la préservation, la documentation et la
              numérisation du patrimoine visuel africain.
            </p>

            {/* Réseaux Sociaux */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: 'pi pi-twitter', href: '#' },
                { icon: 'pi pi-github', href: '#' },
                { icon: 'pi pi-instagram', href: '#' },
                { icon: 'pi pi-globe', href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="rounded-avs border-avs-secondary text-avs-secondary hover:border-avs-primary/40 hover:text-avs-primary hover:bg-avs-primary/5 flex h-9 w-9 items-center justify-center border transition-all"
                >
                  <i className={`${social.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          {/* Menus de liens */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title} className="col-span-1">
              <h3 className="text-avs-primary mb-5 text-xs font-bold tracking-[0.15em] uppercase">
                {title}
              </h3>
              <ul className="space-y-3">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group text-avs-secondary hover:text-avs-secondary flex items-center gap-1.5 text-sm transition-colors"
                    >
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        {label}
                      </span>
                      <ArrowRight
                        size={12}
                        className="text-avs-primary -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── SECTION BASSE : Copyrights ──────────────────────────────────── */}
        <div className="border-avs-secondary flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-avs-secondary text-xs">
            © 2026 AVS — African Visual Standard. Tous droits réservés.
          </p>
          <div className="text-avs-secondary flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              Fait avec <span className="text-avs-primary">♥</span> pour le patrimoine
            </span>
            <span className="bg-avs-secondary/10 h-3 w-px" />
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
