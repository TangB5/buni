'use client';

import { useState, useEffect, useLayoutEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Layers, Users, BookOpen, LayoutDashboard,
  Puzzle, Award, LogOut, User, ShoppingBag, ImageIcon, Wand2, Box,
  Moon, Sun, Settings, ArrowRight, Sparkles, Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth, useLogout } from '@buni/auth';
import { useTheme } from 'next-themes';
import { Route } from 'next';
import { authService } from '../../features/auth/services/auth.service';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

type NavChild = { href: string; label: string; icon: typeof Layers; desc: string };
type NavItem  = {
  label: string; href?: string; isMegaMenu?: boolean;
  children?: NavChild[];
  featured?: { title: string; buttonText: string; href: string };
  stats?: Array<{ value: string; label: string }>;
};

// ══════════════════════════════════════════════════════════════════════════════
// NAV DATA
// ══════════════════════════════════════════════════════════════════════════════

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Produits', isMegaMenu: true,
    children: [
      { href: '#', label: 'Components', icon: Puzzle,     desc: 'Bibliothèque UI PrimeReact' },
      { href: '#', label: 'Drop',       icon: ShoppingBag,desc: 'E-commerce artisans'        },
      { href: '#', label: 'Behance',    icon: ImageIcon,  desc: 'Portfolios créatifs'        },
      { href: '#', label: 'Mode',       icon: Wand2,      desc: 'Configurateur 3D'           },
      { href: '#', label: 'Icons',      icon: Box,        desc: 'SVG africains'              },
    ],
    featured: { title: "Envie d'accéder à l'ensemble de nos outils de création ?", buttonText: "Obtenir l'accès premium", href: '#premium' },
    stats: [
      { value: '5',    label: 'Applications puissantes' },
      { value: '100%', label: 'Africain & libre'         },
      { value: '∞',    label: 'Possibilités créatives'  },
    ],
  },
  {
    label: 'Communauté',
    children: [
      { href: '/patterns',     label: 'Motif culturel',  icon: Users, desc: 'Découvrez des motifs riches et documentés' },
      { href: '/colors',       label: 'Palettes & Token',icon: Users, desc: 'Découvrez les créateurs'                   },
      { href: '/contributors', label: 'Classement',      icon: Award, desc: 'Top contributeurs AVS'                    },
    ],
  },
  { href: '/templates',     label: 'Templates' },
  { href: '/documentation', label: 'Docs'      },
  { href: '/about',         label: 'À propos'  },
  { href: '/contact',         label: 'nous contacter'  },
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-avs-accent/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl bg-avs-secondary border border-avs-accent/9">
              <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.04]" aria-hidden />
              <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-0.5" aria-hidden />

              <div className="relative px-8 py-8">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-xl border border-avs-accent/9 text-avs-accent/55 hover:text-avs-accent transition-colors"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-avs-primary/8 text-avs-primary">
                  <Zap size={26} />
                </div>

                <h2 className="mb-2 text-center text-2xl font-black leading-tight text-avs-accent font-display" style={{ letterSpacing: '-0.02em' }}>
                  Accès Premium
                </h2>
                <p className="mb-2 text-center text-sm leading-relaxed text-avs-accent/55">
                  Cette fonctionnalité n&apos;est pas disponible pour le moment.
                </p>
                <p className="mb-7 text-center text-xs text-avs-accent/35">
                  Revenez bientôt pour découvrir l&apos;accès complet à tous nos outils premium.
                </p>

                <button
                  onClick={onClose}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 hover:shadow-avs-lg transition-all duration-200"
                >
                  Compris
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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

function NavDropdown({ item, onPremiumClick }: { item: NavItem; onPremiumClick: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu  = () => { clearTimeout(closeTimer.current!); setOpen(true); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setOpen(false), 120); };

  if (!item.children) {
    const isActive = pathname.startsWith(item.href!);
    return (
      <Link
        href={item.href! as Route}
        className={`relative rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${isActive ? 'text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'}`}
      >
        {item.label}
        {isActive && <span className="absolute inset-x-2 -bottom-4.25 h-px rounded-full bg-avs-primary" />}
      </Link>
    );
  }

  const isChildActive = item.children.some((c) => pathname.startsWith(c.href));

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        aria-expanded={open} aria-haspopup="true"
        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${open || isChildActive ? 'text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'}`}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute top-full z-50 mt-3 overflow-hidden rounded-2xl shadow-2xl bg-avs-secondary border border-avs-accent/9',
              item.isMegaMenu ? 'left-1/2 w-160 -translate-x-1/2 p-5' : 'left-0 w-64 p-2',
            )}
            role="menu"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-80" aria-hidden />

            {item.isMegaMenu ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  {/* Product grid */}
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    {item.children!.map((child) => {
                      const Icon = child.icon;
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href as Route}
                          className={`group flex flex-col items-center rounded-xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5 border ${isActive ? 'bg-avs-primary/8 border-avs-primary/20' : 'bg-avs-accent/4 border-avs-accent/9 hover:bg-avs-primary/8 hover:border-avs-primary/20'}`}
                        >
                          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors text-avs-primary ${isActive ? 'bg-avs-primary/20' : 'bg-avs-primary/8'}`}>
                            <Icon size={18} />
                          </div>
                          <span className="text-sm font-bold text-avs-accent">{child.label}</span>
                          <span className="mt-0.5 text-[11px] leading-tight text-avs-accent/35">{child.desc}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Featured card */}
                  <div className="flex w-56 shrink-0 flex-col items-center justify-center rounded-xl p-5 text-center bg-avs-accent/4 border border-avs-accent/9">
                    <div className="avs-pattern-kente-royale mb-4 h-12 w-12 rounded-xl ring-1 ring-avs-accent/10" aria-hidden />
                    <p className="mb-4 text-[12px] leading-relaxed font-semibold text-avs-accent">
                      {item.featured?.title}
                    </p>
                    <button
                      onClick={onPremiumClick}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-avs-secondary bg-avs-primary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md transition-all duration-200"
                    >
                      <Sparkles size={11} />
                      {item.featured?.buttonText}
                    </button>
                  </div>
                </div>

                {/* Stats footer */}
                {item.stats && (
                  <div className="grid grid-cols-3 gap-2 border-t border-avs-accent/9 pt-4">
                    {item.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl p-3.5 bg-avs-accent/4 border border-avs-accent/9">
                        <span className="font-display text-xl font-black text-avs-primary">{stat.value}</span>
                        <span className="text-[11px] leading-tight text-avs-accent/35">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {item.children!.map((child) => {
                  const Icon = child.icon;
                  const isActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href as Route}
                      className={`group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 ${isActive ? 'bg-avs-primary/8' : 'hover:bg-avs-accent/4'}`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-avs-primary/8 text-avs-primary">
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${isActive ? 'text-avs-primary' : 'text-avs-accent'}`}>{child.label}</p>
                        <p className="mt-0.5 truncate text-xs text-avs-accent/35">{child.desc}</p>
                      </div>
                    </Link>
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

function UserMenu({ user, onLogout }: { user: { name: string; email: string; role: string }; onLogout: () => Promise<void> }) {
  const [open, setOpen]               = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'   },
    { href: '/profile',   icon: User,            label: 'Profil'       },
    { href: '/settings',  icon: Settings,        label: 'Paramètres'  },
  ];

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open} aria-haspopup="true"
        className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-semibold border transition-all duration-200 ${open ? 'bg-avs-primary/8 text-avs-primary border-avs-primary/20' : 'text-avs-accent/55 border-transparent hover:bg-avs-primary/8 hover:text-avs-primary'}`}
      >
        <div className="avs-pattern-ndop-sultan relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-avs-accent/10">
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="font-display text-xs font-black text-avs-secondary drop-shadow">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <span className="hidden max-w-24 truncate md:inline">{user.name}</span>
        <ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl shadow-2xl bg-avs-secondary border border-avs-accent/9"
          >
            <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-80" aria-hidden />

            {/* Profile card */}
            <div className="p-3 pb-0">
              <div className="rounded-xl p-3.5 bg-avs-primary/8 border border-avs-primary/20">
                <div className="flex items-center gap-3">
                  <div className="avs-pattern-kente-royale relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-avs-secondary/20">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="font-display text-sm font-black text-avs-secondary drop-shadow">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-avs-accent">{user.name}</p>
                    <p className="truncate text-[11px] capitalize text-avs-accent/35">{user.role}</p>
                  </div>
                  <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-avs-secondary dark:ring-avs-accent" aria-label="En ligne" />
                </div>
                <p className="mt-2 truncate font-mono text-[10px] text-avs-accent/35">{user.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-0.5 p-2 pt-2">
              {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href as Route}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-primary transition-all duration-150"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-avs-accent/4">
                    <Icon size={14} />
                  </div>
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 pt-0 border-t border-avs-accent/9">
              <button
                onClick={async () => { setOpen(false); setIsLoggingOut(true); await onLogout(); }}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-avs-accent/55 hover:bg-red-500/8 hover:text-red-500 transition-all duration-150 disabled:opacity-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-avs-accent/4">
                  <LogOut size={14} />
                </div>
                <span className="font-medium">{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
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

function IconBtn({ onClick, label, children, className }: {
  onClick?: () => void; label: string; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl border border-avs-accent/9 text-avs-accent/55',
        'hover:bg-avs-accent/4 hover:text-avs-accent hover:border-avs-accent/16',
        'transition-all duration-200',
        className,
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
      <p className="px-3 pb-1 font-mono text-[9px] font-black tracking-[0.2em] uppercase text-avs-accent/35">
        {title}
      </p>
      {children}
    </div>
  );
}

function MobileLink({ href, icon: Icon, label, isActive, onClick, isExternal }: {
  href: string; icon: typeof Layers; label: string;
  isActive?: boolean; onClick?: () => void; isExternal?: boolean;
}) {
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
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const storeLogout = useLogout();
  const { theme, setTheme } = useTheme();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleLogout = async () => {
    try { await authService.logout(); }
    catch (err) { console.error('Logout error:', err); }
    finally { storeLogout(); router.push('/'); }
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

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-avs-secondary border-b border-avs-accent/9 ${scrolled ? 'backdrop-blur-xl shadow-avs' : ''}`}
      >
        {/* Top accent stripe */}
        <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

          {/* ── LOGO ───────────────────────────────────────────────────── */}
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="AVS — Accueil">
            <div className="avs-pattern-kente-royale relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-avs-accent/10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="font-display text-base font-black text-avs-secondary drop-shadow-md" aria-hidden>A</span>
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-black tracking-tight text-avs-accent" style={{ letterSpacing: '-0.02em' }}>AVS</span>
              <span className="hidden font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-avs-primary sm:block">Standard</span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ────────────────────────────────────────────── */}
          <nav aria-label="Navigation principale" className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavDropdown key={item.label} item={item} onPremiumClick={() => setPremiumOpen(true)} />
            ))}
          </nav>

          {/* ── RIGHT ACTIONS ──────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Theme toggle */}
            <div className="hidden md:block">
              <IconBtn onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} label={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  </motion.span>
                </AnimatePresence>
              </IconBtn>
            </div>

            {/* Auth area */}
            {!isHydrated ? (
              <div className="h-9 w-28 animate-pulse rounded-xl bg-avs-accent/4" />
            ) : isAuthenticated && user ? (
              <UserMenu user={user as { name: string; email: string; role: string }} onLogout={handleLogout} />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href={'/auth/login' as Route}
                  className="rounded-xl px-4 py-2 text-[13px] font-semibold text-avs-accent/55 hover:text-avs-accent hover:bg-avs-accent/4 transition-all duration-200"
                >
                  Connexion
                </Link>
                <Link
                  href={'/auth/register' as Route}
                  className="group flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold text-avs-secondary bg-avs-primary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md transition-all duration-200"
                >
                  S&apos;inscrire
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 top-16 z-30 lg:hidden bg-avs-accent/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />

              <motion.nav
                id="mobile-nav"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-40 w-full shadow-2xl lg:hidden bg-avs-secondary border-b border-avs-accent/9"
                aria-label="Navigation mobile"
              >
                <div className="max-h-[80vh] overflow-y-auto px-4 py-5 space-y-5">

                  <MobileSection title="Produits">
                    {[
                      { href: '#', label: 'Components', icon: Puzzle,      desc: 'Bibliothèque UI' },
                      { href: '#', label: 'Drop',       icon: ShoppingBag, desc: 'E-commerce'       },
                      { href: '#', label: 'Behance',    icon: ImageIcon,   desc: 'Portfolios'        },
                      { href: '#', label: 'Mode',       icon: Wand2,       desc: 'Configurateur 3D'  },
                      { href: '#', label: 'Icons',      icon: Box,         desc: 'SVG africains'     },
                    ].map((item) => (
                      <MobileLink key={item.href + item.label} {...item} onClick={() => setMobileOpen(false)} />
                    ))}
                  </MobileSection>

                  <MobileSection title="Communauté">
                    {[
                      { href: '/contributors', icon: Award, label: 'Classement',      isActive: pathname === '/contributors' },
                      { href: '/colors',       icon: Users, label: 'Palettes & Token', isActive: pathname === '/colors'       },
                      { href: '/patterns',     icon: Users, label: 'Motif culturel',   isActive: pathname === '/patterns'     },
                    ].map((item) => (
                      <MobileLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
                    ))}
                  </MobileSection>

                  <MobileSection title="Outils">
                    {isAuthenticated && user && (
                      <MobileLink href="/dashboard" icon={LayoutDashboard} label="Dashboard"
                        isActive={pathname.startsWith('/dashboard')} onClick={() => setMobileOpen(false)} />
                    )}
                    <MobileLink href="/documentation" icon={BookOpen} label="Documentation"
                      isActive={pathname.startsWith('/documentation')} onClick={() => setMobileOpen(false)} />

                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-avs-accent/55 hover:bg-avs-accent/4 hover:text-avs-accent transition-all duration-150"
                    >
                      {theme === 'dark' ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
                      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                    </button>
                  </MobileSection>

                  {/* Auth */}
                  <div className="pt-1 space-y-2 border-t border-avs-accent/9">
                    {!isHydrated ? (
                      <div className="h-10 animate-pulse rounded-xl bg-avs-accent/4" />
                    ) : isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-3 rounded-xl p-3.5 bg-avs-primary/8 border border-avs-primary/20">
                          <div className="avs-pattern-kente-royale relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <span className="font-display text-sm font-black text-avs-secondary">{(user.name || '?').charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-avs-accent">{user.name || 'User'}</p>
                            <p className="truncate text-xs capitalize text-avs-accent/35">{user.role}</p>
                          </div>
                          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        </div>
                        <button
                          onClick={async () => { setMobileOpen(false); await handleLogout(); }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-avs-secondary bg-avs-primary hover:opacity-90 transition-all duration-200"
                        >
                          <LogOut size={15} /> Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={'/auth/login' as Route}
                          onClick={() => setMobileOpen(false)}
                          className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold border border-avs-accent/16 text-avs-accent transition-all duration-200"
                        >
                          Se connecter
                        </Link>
                        <Link
                          href={'/auth/register' as Route}
                          onClick={() => setMobileOpen(false)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-avs-secondary bg-avs-primary hover:opacity-90 transition-all duration-200"
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
    </>
  );
}

export default Header;