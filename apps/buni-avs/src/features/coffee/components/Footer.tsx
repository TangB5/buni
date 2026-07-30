'use client';

import { useTranslations } from '@/i18n';
// PrimeIcons are used as CSS classes (e.g., 'pi pi-coffee')

export function CoffeeFooter() {
  const t = useTranslations('coffee.footer');

  return (
    <footer className="bg-avs-secondary border-t border-avs-accent/10 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <i className="pi pi-coffee text-lg text-avs-primary"></i>
            <span className="font-display font-bold text-2xl text-avs-accent">Buni</span>
          </div>
          <p className="font-mono text-xs tracking-wider text-avs-accent/40">
            {t('text')}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm">
          {[
            { href: '/about', label: t('links.about') },
            { href: '/contact', label: t('links.contact') },
            { href: '/coffee', label: t('links.support') },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-avs-accent/50 hover:text-avs-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { icon: <i className="pi pi-github text-lg"></i>, href: '#', label: 'GitHub' },
            { icon: <i className="pi pi-twitter text-lg"></i>, href: '#', label: 'Twitter' },
            { icon: <i className="pi pi-linkedin text-lg"></i>, href: '#', label: 'LinkedIn' },
            { icon: <i className="pi pi-envelope text-lg"></i>, href: '#', label: 'Email' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="w-10 h-10 rounded-full bg-avs-accent/5 flex items-center justify-center text-avs-accent/50 hover:bg-avs-primary/10 hover:text-avs-primary transition-all duration-300"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-avs-accent/20" />
            <div className="w-2 h-2 rounded-full bg-avs-primary/30" />
            <div className="h-px w-12 bg-avs-accent/20" />
          </div>
          <p className="text-xs text-avs-accent/30">
            © {new Date().getFullYear()} Buni. Crafted with passion for African heritage.
          </p>
        </div>
      </div>
    </footer>
  );
}
