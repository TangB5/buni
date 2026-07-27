'use client';

import { useState, useEffect, useLayoutEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  Users,
  BookOpen,
  LayoutDashboard,
  Puzzle,
  Award,
  LogOut,
  User,
  ShoppingBag,
  ImageIcon,
  Wand2,
  Box,
  Moon,
  Sun,
  Settings,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth, useLogout } from '@buni/auth';
import { Comingsoon } from '@buni/ui';
import { useTheme, ThemeToggle } from '@buni/theme';
import { Route } from 'next';
import { authService } from '../../features/auth/services/auth.service';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

type ModalData = {
  title: string;
  description: string;
  details: string;
  icon: string;
};

type BaseNavItem = {
  label: string;
  href?: string;

  available?: boolean;
  modal?: ModalData;
  hidden?: boolean;
};

type NavChild = BaseNavItem & {
  href: string; // obligatoire pour un enfant
  icon: string;
  desc: string;
};

type NavItem = BaseNavItem & {
  isMegaMenu?: boolean;

  children?: NavChild[];

  featured?: {
    title: string;
    buttonText: string;
    href: string;
  };

  stats?: Array<{
    value: string;
    label: string;
  }>;
};
type NavDropdownProps = {
  item: NavItem;
  onPremiumClick: () => void;
  onItemClick: (item: BaseNavItem) => void;
};
// ══════════════════════════════════════════════════════════════════════════════
// navigation items
// ══════════════════════════════════════════════════════════════════════════════

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Produits',
    isMegaMenu: true,
    hidden: true,
    children: [
      {
        href: '#',
        label: 'Components',
        icon: 'pi pi-box',
        desc: 'Bibliothèque UI PrimeReact',
        available: false,
        modal: {
          title: 'Components bientôt disponibles',
          description:
            'Une bibliothèque complète de composants UI inspirés des meilleures pratiques.',
          details:
            'Buttons, Cards, Forms, Tables, Modals, Charts et bien plus arriveront prochainement.',
          icon: 'pi pi-box',
        },
      },
      {
        href: '#',
        label: 'Drop',
        icon: 'pi pi-shopping-bag',
        desc: 'E-commerce artisans',
        available: false,
        modal: {
          title: 'Drop arrive bientôt',
          description: 'Notre marketplace mettra en relation artisans africains et acheteurs.',
          details:
            'Découvrez des créations authentiques, des éditions limitées et des collections exclusives.',
          icon: 'pi pi-shopping-bag',
        },
      },
      {
        href: '#',
        label: 'Behance',
        icon: 'pi pi-image',
        desc: 'Portfolios créatifs',
        available: false,
        modal: {
          title: 'Behance AVS en préparation',
          description: 'Exposez vos créations et découvrez celles de la communauté.',
          details:
            'Un espace dédié aux designers, illustrateurs, photographes et créateurs africains.',
          icon: 'pi pi-image',
        },
      },
      {
        href: '#',
        label: 'Mode',
        icon: 'pi pi-palette',
        desc: 'Configurateur 3D',
        available: false,
        modal: {
          title: 'Configurateur 3D bientôt disponible',
          description: 'Visualisez vêtements, tissus et motifs en temps réel.',
          details:
            'Essayez des combinaisons de couleurs et de motifs directement sur des modèles 3D.',
          icon: 'pi pi-palette',
        },
      },
      {
        href: '#',
        label: 'Icons',
        icon: 'pi pi-th-large',
        desc: 'SVG africains',
        available: false,
        modal: {
          title: 'Bibliothèque d’icônes en préparation',
          description: "Des centaines d'icônes vectorielles inspirées des cultures africaines.",
          details: 'Téléchargement en SVG, React, Figma et autres formats.',
          icon: 'pi pi-th-large',
        },
      },
    ],

    featured: {
      title: "Envie d'accéder à l'ensemble de nos outils de création ?",
      buttonText: "Obtenir l'accès premium",
      href: '#premium',
    },

    stats: [
      { value: '5', label: 'Applications puissantes' },
      { value: '100%', label: 'Africain & libre' },
      { value: '∞', label: 'Possibilités créatives' },
    ],
  },

  {
    label: 'Communauté',
    children: [
      {
        href: '/patterns',
        label: 'Motif culturel',
        icon: 'pi pi-star',
        desc: 'Découvrez des motifs riches et documentés',
        available: true,
      },
      {
        href: '/colors',
        label: 'Palettes & Token',
        icon: 'pi pi-palette',
        desc: 'Découvrez les créateurs',
        available: true,
      },
      {
        href: '/contributors',
        label: 'Classement',
        icon: 'pi pi-trophy',
        desc: 'Top contributeurs AVS',
        available: true,
      },
    ],
  },

  {
    href: '/templates',
    label: 'Templates',
    available: false,
    hidden: true,
    modal: {
      title: 'Templates bientôt disponibles',
      description: 'Des centaines de modèles prêts à personnaliser.',
      details: 'Landing pages, dashboards, portfolios et interfaces modernes arriveront bientôt.',
      icon: 'pi pi-file',
    },
  },

  {
    href: '/documentation',
    label: 'Docs',
    available: true,
    modal: {
      title: 'Documentation en cours de rédaction',
      description: "Nous préparons une documentation complète d'AVS.",
      details:
        'Guides, API, composants, design tokens et exemples de code seront disponibles prochainement.',
      icon: 'pi pi-book',
    },
  },

  {
    href: '/about',
    label: 'À propos',
    available: true,
  },

  {
    href: '/contact',
    label: 'Nous contacter',
    available: true,
  },
];
// ══════════════════════════════════════════════════════════════════════════════
// PREMIUM MODAL
// ══════════════════════════════════════════════════════════════════════════════

function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="bg-avs-accent/60 fixed inset-0 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-avs-secondary border-avs-accent/9 pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl">
              <div
                className="avs-pattern-kente-royale absolute inset-0 opacity-[0.04]"
                aria-hidden
              />
              <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-0.5" aria-hidden />

              <div className="relative px-8 py-8">
                <button
                  onClick={onClose}
                  className="border-avs-accent/9 text-avs-accent/55 hover:text-avs-accent absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border transition-colors"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>

                <div className="bg-avs-primary/8 text-avs-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
                  <Zap size={26} />
                </div>

                <h2
                  className="text-avs-accent font-display mb-2 text-center text-2xl leading-tight font-black"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Accès Premium
                </h2>
                <p className="text-avs-accent/55 mb-2 text-center text-sm leading-relaxed">
                  Cette fonctionnalité n&apos;est pas disponible pour le moment.
                </p>
                <p className="text-avs-accent/35 mb-7 text-center text-xs">
                  Revenez bientôt pour découvrir l&apos;accès complet à tous nos outils premium.
                </p>

                <button
                  onClick={onClose}
                  className="group text-avs-secondary bg-avs-primary shadow-avs-md hover:shadow-avs-lg flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                >
                  Compris
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV DROPDOWN
// ══════════════════════════════════════════════════════════════════════════════

function NavDropdown({ item, onPremiumClick, onItemClick }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    clearTimeout(closeTimer.current!);
    setOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  if (!item.children) {
    const isActive = pathname.startsWith(item.href!);
    if (item.available === false) {
      return (
        <button
          onClick={() => onItemClick(item)}
          className={`relative rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 text-avs-accent/55 hover:text-avs-accent`}
        >
          {item.label}
        </button>
      );
    }
    return (
      <Link
        href={item.href! as Route}
        className={`relative rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${isActive ? 'text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'}`}
      >
        {item.label}
        {isActive && (
          <span className="bg-avs-primary absolute inset-x-2 -bottom-4.25 h-px rounded-full" />
        )}
      </Link>
    );
  }

  const isChildActive = item.children.some((c) => pathname.startsWith(c.href));

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${open || isChildActive ? 'text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'}`}
      >
        {item.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'bg-avs-secondary border-avs-accent/9 absolute top-full z-50 mt-3 overflow-hidden rounded-2xl border shadow-2xl',
              item.isMegaMenu ? 'left-1/2 w-160 -translate-x-1/2 p-5' : 'left-0 w-64 p-2'
            )}
            role="menu"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <div
              className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-80"
              aria-hidden
            />

            {item.isMegaMenu ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  {/* Product grid */}
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    {item.children!.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <button
                          key={child.href}
                          onClick={() => onItemClick(child)}
                          className={`group flex flex-col items-center rounded-xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${isActive ? 'bg-avs-primary/8 border-avs-primary/20' : 'bg-avs-accent/4 border-avs-accent/9 hover:bg-avs-primary/8 hover:border-avs-primary/20'}`}
                        >
                          <div
                            className={`text-avs-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-avs-primary/20' : 'bg-avs-primary/8'}`}
                          >
                            <i className={child.icon} />
                          </div>
                          <span className="text-avs-accent text-sm font-bold">{child.label}</span>
                          <span className="text-avs-accent/35 mt-0.5 text-[11px] leading-tight">
                            {child.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Featured card */}
                  <div className="bg-avs-accent/4 border-avs-accent/9 flex w-56 shrink-0 flex-col items-center justify-center rounded-xl border p-5 text-center">
                    <div
                      className="avs-pattern-kente-royale ring-avs-accent/10 mb-4 h-12 w-12 rounded-xl ring-1"
                      aria-hidden
                    />
                    <p className="text-avs-accent mb-4 text-[12px] leading-relaxed font-semibold">
                      {item.featured?.title}
                    </p>
                    <button
                      onClick={onPremiumClick}
                      className="group text-avs-secondary bg-avs-primary shadow-avs hover:shadow-avs-md flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <Sparkles size={11} />
                      {item.featured?.buttonText}
                    </button>
                  </div>
                </div>

                {/* Stats footer */}
                {item.stats && (
                  <div className="border-avs-accent/9 grid grid-cols-3 gap-2 border-t pt-4">
                    {item.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-avs-accent/4 border-avs-accent/9 flex items-center gap-3 rounded-xl border p-3.5"
                      >
                        <span className="font-display text-avs-primary text-xl font-black">
                          {stat.value}
                        </span>
                        <span className="text-avs-accent/35 text-[11px] leading-tight">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {item.children!.map((child) => {
                  const isActive = pathname === child.href;
                  return (
                    <button
                      key={child.href}
                      onClick={() => onItemClick(child)}
                      className={`group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 ${isActive ? 'bg-avs-primary/8' : 'hover:bg-avs-accent/4'}`}
                    >
                      <div className="bg-avs-primary/8 text-avs-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                        <i className={child.icon} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          className={`text-sm font-semibold ${isActive ? 'text-avs-primary' : 'text-avs-accent'}`}
                        >
                          {child.label}
                        </p>
                        <p className="text-avs-accent/35 mt-0.5 truncate text-xs">{child.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USER MENU
// ══════════════════════════════════════════════════════════════════════════════

function UserMenu({
  user,
  onLogout,
}: {
  user: { name: string; email: string; role: string };
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profil' },
    { href: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px] font-semibold transition-all duration-200 ${open ? 'bg-avs-primary/8 text-avs-primary border-avs-primary/20' : 'text-avs-accent/55 hover:bg-avs-primary/8 hover:text-avs-primary border-transparent'}`}
      >
        <div className="avs-pattern-ndop-sultan ring-avs-accent/10 relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1">
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="font-display text-avs-secondary text-xs font-black drop-shadow">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <span className="hidden max-w-24 truncate md:inline">{user.name}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="bg-avs-secondary border-avs-accent/9 absolute top-full right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div
              className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-80"
              aria-hidden
            />

            {/* Profile card */}
            <div className="p-3 pb-0">
              <div className="bg-avs-primary/8 border-avs-primary/20 rounded-xl border p-3.5">
                <div className="flex items-center gap-3">
                  <div className="avs-pattern-kente-royale ring-avs-secondary/20 relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-avs-accent truncate text-sm font-bold">{user.name}</p>
                    <p className="text-avs-accent/35 truncate text-[11px] capitalize">
                      {user.role}
                    </p>
                  </div>
                  <span
                    className="ring-avs-secondary dark:ring-avs-accent ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2"
                    aria-label="En ligne"
                  />
                </div>
                <p className="text-avs-accent/35 mt-2 truncate font-mono text-[10px]">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-0.5 p-2 pt-2">
              {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href as Route}
                  onClick={() => setOpen(false)}
                  className="text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-primary flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150"
                >
                  <div className="bg-avs-accent/4 flex h-7 w-7 items-center justify-center rounded-lg">
                    <Icon size={14} />
                  </div>
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-avs-accent/9 border-t p-2 pt-0">
              <button
                onClick={async () => {
                  setOpen(false);
                  setIsLoggingOut(true);
                  await onLogout();
                }}
                disabled={isLoggingOut}
                className="text-avs-accent/55 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 hover:bg-red-500/8 hover:text-red-500 disabled:opacity-50"
              >
                <div className="bg-avs-accent/4 flex h-7 w-7 items-center justify-center rounded-lg">
                  <LogOut size={14} />
                </div>
                <span className="font-medium">
                  {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ICON BUTTON
// ══════════════════════════════════════════════════════════════════════════════

function IconBtn({
  onClick,
  label,
  children,
  className,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'border-avs-accent/9 text-avs-accent/55 flex h-9 w-9 items-center justify-center rounded-xl border',
        'hover:bg-avs-accent/4 hover:text-avs-accent hover:border-avs-accent/16',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MOBILE HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-avs-accent/35 px-3 pb-1 font-mono text-[9px] font-black tracking-[0.2em] uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function MobileLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
  isExternal,
  available,
  onUnavailableClick,
}: {
  href: string;
  icon: typeof Layers;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isExternal?: boolean;
  available?: boolean;
  onUnavailableClick?: () => void;
}) {
  if (available === false && onUnavailableClick) {
    return (
      <button
        onClick={onUnavailableClick}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-150 text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-accent"
      >
        <Icon size={17} aria-hidden />
        {label}
      </button>
    );
  }
  const Tag = isExternal ? 'a' : Link;
  return (
    <Tag
      href={href as Route}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-150 ${isActive ? 'bg-avs-primary/8 text-avs-primary' : 'text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-accent'}`}
    >
      <Icon size={17} aria-hidden />
      {label}
    </Tag>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN HEADER
// ══════════════════════════════════════════════════════════════════════════════

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const storeLogout = useLogout();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [comingSoon, setComingSoon] = useState<ModalData | null>(null);
  const [authState, setAuthState] = useState({ isAuthenticated, user });

  useEffect(() => {
    setAuthState({ isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    await storeLogout();
  };

  useLayoutEffect(() => {
    startTransition(() => setMobileOpen(false));
  }, [pathname, startTransition]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleClick = (item: BaseNavItem) => {
    if (item.available === false) {
      setComingSoon(item.modal ?? null);
      return;
    }

    if (item.href) {
      router.push(item.href as Route);
    }
  };
  return (
    <>
      <header
        className={`bg-avs-secondary border-avs-accent/9 sticky top-0 z-40 w-full border-b transition-all duration-300 ${scrolled ? 'shadow-avs backdrop-blur-xl' : ''}`}
      >
        {/* Top accent stripe */}
        <div
          className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70"
          aria-hidden
        />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* ── LOGO ───────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label="AVS — Accueil"
          >
            <div className="avs-pattern-kente-royale ring-avs-accent/10 relative h-9 w-9 overflow-hidden rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span
                  className="font-display text-avs-secondary text-base font-black drop-shadow-md"
                  aria-hidden
                >
                  A
                </span>
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-display text-avs-accent text-[15px] font-black tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                AVS
              </span>
              <span className="text-avs-primary hidden font-mono text-[9px] font-bold tracking-[0.18em] uppercase sm:block">
                Standard
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ────────────────────────────────────────────── */}
          <nav
            aria-label="Navigation principale"
            className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          >
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => (
              <NavDropdown
                key={item.label}
                item={item}
                onPremiumClick={() => setPremiumOpen(true)}
                onItemClick={handleClick}
              />
            ))}
          </nav>

          {/* ── RIGHT ACTIONS ──────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Auth area */}
            {!isHydrated ? (
              <div className="bg-avs-accent/4 h-9 w-28 animate-pulse rounded-xl" />
            ) : authState.isAuthenticated && authState.user ? (
              <UserMenu
                user={authState.user as { name: string; email: string; role: string }}
                onLogout={handleLogout}
              />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href={'/auth/login' as Route}
                  className="border-2 border-[var(--color-light-border)] px-4 py-2 text-[13px] font-semibold text-[var(--color-light-text)] transition-all duration-200 hover:border-[var(--color-avs-primary)] hover:text-[var(--color-avs-primary)] rounded-xl"
                >
                  Connexion
                </Link>
                <Link
                  href={'/auth/register' as Route}
                  className="group text-avs-secondary bg-avs-primary shadow-avs hover:shadow-avs-md flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                >
                  S&apos;inscrire
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <IconBtn
              onClick={() => setMobileOpen((v) => !v)}
              label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </IconBtn>
          </div>
        </div>

        {/* ── MOBILE NAV ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-avs-accent/40 fixed inset-0 top-16 z-30 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />

              <motion.nav
                id="mobile-nav"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="bg-avs-secondary border-avs-accent/9 absolute z-40 w-full border-b shadow-2xl lg:hidden"
                aria-label="Navigation mobile"
              >
                <div className="max-h-[80vh] space-y-5 overflow-y-auto px-4 py-5">
                  {/* <MobileSection title="Produits">
                    {[
                      { href: '#', label: 'Components', icon: Puzzle, desc: 'Bibliothèque UI' },
                      { href: '#', label: 'Drop', icon: ShoppingBag, desc: 'E-commerce' },
                      { href: '#', label: 'Behance', icon: ImageIcon, desc: 'Portfolios' },
                      { href: '#', label: 'Mode', icon: Wand2, desc: 'Configurateur 3D' },
                      { href: '#', label: 'Icons', icon: Box, desc: 'SVG africains' },
                    ].map((item) => (
                      <MobileLink
                        key={item.href + item.label}
                        {...item}
                        onClick={() => setMobileOpen(false)}
                      />
                    ))}
                  </MobileSection> */}

                  <MobileSection title="Communauté">
                    {[
                      {
                        href: '/patterns',
                        icon: Layers,
                        label: 'Motif culturel',
                        isActive: pathname === '/patterns',
                      },
                      {
                        href: '/colors',
                        icon: Users,
                        label: 'Palettes & Token',
                        isActive: pathname === '/colors',
                      },
                      {
                        href: '/contributors',
                        icon: Award,
                        label: 'Classement',
                        isActive: pathname === '/contributors',
                      },
                    ].map((item) => (
                      <MobileLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
                    ))}
                  </MobileSection>

                  <MobileSection title="Navigation">
                    {/* <MobileLink
                      href="/templates"
                      icon={Box}
                      label="Templates"
                      available={false}
                      onUnavailableClick={() => handleClick({ href: '/templates', label: 'Templates', available: false, modal: NAV_ITEMS.find(i => i.label === 'Templates')?.modal })}
                    /> */}
                    <MobileLink
                      href="/documentation"
                      icon={BookOpen}
                      label="Documentation"
                      available={true}
                      onClick={() => setMobileOpen(false)}
                    />
                    <MobileLink
                      href="/about"
                      icon={User}
                      label="À propos"
                      isActive={pathname === '/about'}
                      onClick={() => setMobileOpen(false)}
                    />
                    <MobileLink
                      href="/contact"
                      icon={Settings}
                      label="Nous contacter"
                      isActive={pathname === '/contact'}
                      onClick={() => setMobileOpen(false)}
                    />
                  </MobileSection>

                  <MobileSection title="Outils">
                    {authState.isAuthenticated && authState.user && (
                      <MobileLink
                        href="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        isActive={pathname.startsWith('/dashboard')}
                        onClick={() => setMobileOpen(false)}
                      />
                    )}
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-accent flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-150"
                    >
                      {theme === 'dark' ? (
                        <Sun size={17} aria-hidden />
                      ) : (
                        <Moon size={17} aria-hidden />
                      )}
                      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                    </button>
                  </MobileSection>

                  {/* Auth */}
                  <div className="border-avs-accent/9 space-y-2 border-t pt-1">
                    {!isHydrated ? (
                      <div className="bg-avs-accent/4 h-10 animate-pulse rounded-xl" />
                    ) : authState.isAuthenticated && authState.user ? (
                      <>
                        <div className="bg-avs-primary/8 border-avs-primary/20 flex items-center gap-3 rounded-xl border p-3.5">
                          <div className="avs-pattern-kente-royale relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <span className="font-display text-avs-secondary text-sm font-black">
                                {(authState.user.name || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-avs-accent truncate text-sm font-bold">
                              {authState.user.name || 'User'}
                            </p>
                            <p className="text-avs-accent/35 truncate text-xs capitalize">
                              {authState.user.role}
                            </p>
                          </div>
                          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        </div>
                        <button
                          onClick={async () => {
                            setMobileOpen(false);
                            await handleLogout();
                          }}
                          className="text-avs-secondary bg-avs-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 hover:opacity-90"
                        >
                          <LogOut size={15} /> Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={'/auth/login' as Route}
                          onClick={() => setMobileOpen(false)}
                          className="border-avs-accent/16 text-avs-accent flex w-full items-center justify-center rounded-xl border py-3 text-sm font-bold transition-all duration-200"
                        >
                          Se connecter
                        </Link>
                        <Link
                          href={'/auth/register' as Route}
                          onClick={() => setMobileOpen(false)}
                          className="text-avs-secondary bg-avs-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 hover:opacity-90"
                        >
                          Créer un compte <ArrowRight size={14} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <Comingsoon
        isOpen={!!comingSoon}
        onClose={() => setComingSoon(null)}
        icon={<i className={`${comingSoon?.icon ?? 'pi pi-sparkles'} text-3xl`} />}
        title={comingSoon?.title ?? ''}
        description={comingSoon?.description ?? ''}
        details={comingSoon?.details ?? ''}
        validation="Compris"
      />
    </>
  );
}

export default Header;
