'use client';

import { useState, useEffect, useLayoutEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  Palette,
  Users,
  BookOpen,
  LayoutDashboard,
  Puzzle,
  Sparkles,
  Award,
  LogOut,
  User,
  Type,
  BoxSelect,
  ShoppingBag,
  ImageIcon,
  Wand2,
  Box,
  Moon,
  Sun,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth, useLogout } from '@buni/auth';
import { useTheme } from './ThemeProvider';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

// ── Modal Composant ──────────────────────────────────────────────────────────
function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-avs-secondary border-avs-accent/10 rounded-2xl border p-8 max-w-md w-full shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-avs-accent text-2xl font-bold">Accès Premium</h2>
                <button
                  onClick={onClose}
                  className="text-avs-accent/50 hover:text-avs-accent transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-avs-accent/70 mb-6 text-center">
                Cette fonctionnalité n'est pas disponible pour le moment.
              </p>
              <p className="text-avs-accent/60 text-sm text-center mb-6">
                Revenez bientôt pour découvrir l'accès complet à tous nos outils premium.
              </p>
              <button
                onClick={onClose}
                className="avs-btn-primary w-full justify-center py-3 text-sm font-bold shadow-md"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type NavItem = {
  label: string;
  href?: string;
  isMegaMenu?: boolean;
  children?: Array<{ href: string; label: string; icon: typeof Layers; desc: string }>;
  featured?: { title: string; buttonText: string; href: string };
  stats?: Array<{ value: string; label: string }>;
};

// ── Données navigation restructurées ──────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Produits',
    isMegaMenu: true,
    children: [
      {
        href: '#',
        label: 'Components',
        icon: Puzzle,
        desc: 'Bibliothèque UI PrimeReact',
      },
      { href: '#', label: 'Drop', icon: ShoppingBag, desc: 'E-commerce artisans' },
      {
        href: '#',
        label: 'Behance',
        icon: ImageIcon,
        desc: 'Portfolios créatifs',
      },
      { href: '#', label: 'Mode', icon: Wand2, desc: 'Configurateur 3D' },
      { href: '#', label: 'Icons', icon: Box, desc: 'SVG africains' },
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
      { href: '/artisans', label: 'Artisans', icon: Users, desc: 'Découvrez les créateurs' },
      { href: '/contributors', label: 'Classement', icon: Award, desc: 'Top contributeurs AVS' },
    ],
  },
  { href: '/templates', label: 'Templates' },
  { href: '/documentation', label: 'Docs' },
] as const;

// ── Dropdown Composant ────────────────────────────────────────────────────────
function NavDropdown({ item, onPremiumClick }: { item: NavItem; onPremiumClick: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lien simple
  if (!item.children) {
    const isExternal = item.href?.startsWith('http');
    const isActive = !isExternal && pathname.startsWith(item.href!);
    const LinkComponent = isExternal ? 'a' : Link;
    
    return (
      <LinkComponent
        href={item.href!}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={cn(
          'rounded-avs px-3 py-2 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-avs-primary/10 text-avs-primary'
            : 'text-avs-accent/70 hover:bg-avs-primary/8 hover:text-avs-primary',
        )}
      >
        {item.label}
      </LinkComponent>
    );
  }

  const isChildActive = item.children.some((child) => pathname.startsWith(child.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'rounded-avs flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200',
          open || isChildActive
            ? 'bg-avs-primary/10 text-avs-primary'
            : 'text-avs-accent/70 hover:bg-avs-primary/8 hover:text-avs-primary',
        )}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'bg-avs-secondary border-avs-accent/10 absolute top-full z-50 mt-2 rounded-2xl border p-2 shadow-xl',
              item.isMegaMenu
                ? 'left-1/2 w-200 -translate-x-1/2 cursor-default p-4'
                : 'left-0 w-64',
            )}
            role="menu"
          >
            {item.isMegaMenu ? (
              // ── MEGA MENU (Style Infographiks) ──
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  {/* Grille gauche (3x2) */}
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    {item.children!.map((child) => {
                      const isItemActive = pathname === child.href;
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'group flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200',
                            isItemActive
                              ? 'bg-avs-primary/5 border-avs-primary/20'
                              : 'bg-avs-accent/5 hover:bg-avs-accent/10 border-transparent',
                          )}
                        >
                          <Icon
                            size={24}
                            className={cn(
                              'mb-2 transition-colors',
                              isItemActive
                                ? 'text-avs-primary'
                                : 'text-avs-accent/70 group-hover:text-avs-primary',
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-semibold transition-colors',
                              isItemActive
                                ? 'text-avs-primary'
                                : 'text-avs-accent group-hover:text-avs-primary',
                            )}
                          >
                            {child.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Featured Card Droite */}
                  <div className="bg-avs-accent/5 flex w-70 flex-col items-center justify-center rounded-xl p-6 text-center">
                    <div className="bg-avs-primary/10 text-avs-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                      <Award size={24} />
                    </div>
                    <h4 className="text-avs-accent mb-4 text-sm leading-relaxed font-semibold">
                      {item.featured?.title}
                    </h4>
                    <button
                      onClick={onPremiumClick}
                      className="bg-avs-primary text-avs-secondary rounded-avs w-full px-4 py-2 text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      {item.featured?.buttonText}
                    </button>
                  </div>
                </div>

                {/* Footer Statistiques */}
                {item.stats && (
                  <div className="border-avs-accent/10 grid grid-cols-3 gap-2 border-t pt-4">
                    {item.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-avs-accent/5 hover:bg-avs-accent/10 flex items-center gap-4 rounded-xl p-4 transition-colors"
                      >
                        <span className="text-avs-primary text-xl font-bold">{stat.value}</span>
                        <span className="text-avs-accent/60 text-xs leading-tight">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // ── MENU STANDARD ──
              item.children!.map((child) => {
                const Icon = child.icon;
                const isExternal = child.href.startsWith('http');
                const isItemActive = !isExternal && pathname === child.href;
                const LinkComponent = isExternal ? 'a' : Link;
                
                return (
                  <LinkComponent
                    key={child.href}
                    href={child.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'rounded-avs group flex items-start gap-3 p-3 transition-colors',
                      isItemActive ? 'bg-avs-primary/5' : 'hover:bg-avs-primary/8',
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-avs mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center transition-colors',
                        isItemActive
                          ? 'bg-avs-primary/20 text-avs-primary'
                          : 'bg-avs-primary/10 text-avs-primary group-hover:bg-avs-primary/20',
                      )}
                    >
                      <Icon size={16} aria-hidden />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-semibold transition-colors',
                          isItemActive
                            ? 'text-avs-primary'
                            : 'text-avs-accent group-hover:text-avs-primary',
                        )}
                      >
                        {child.label}
                      </p>
                      <p className="text-avs-accent/50 mt-0.5 line-clamp-1 text-xs">{child.desc}</p>
                    </div>
                  </LinkComponent>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header principal ──────────────────────────────────────────────────────────
export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [, startTransition] = useTransition();

  useLayoutEffect(() => {
    startTransition(() => setMobileOpen(false));
  }, [pathname, startTransition]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled ? 'shadow-sm' : '',
        isDashboard
          ? 'border-avs-accent/10 bg-avs-secondary border-b'
          : 'border-avs-accent/8 bg-avs-secondary border-b backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 max-w-350 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="AVS — Accueil"
        >
          <div className="avs-pattern-kente rounded-avs border-avs-accent/10 flex h-9 w-9 items-center justify-center overflow-hidden border shadow-sm transition-transform group-hover:scale-105">
            <span className="font-display text-avs-accent text-base font-black" aria-hidden>
              A
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-avs-accent text-base font-bold tracking-tight">
              AVS
            </span>
            <span className="text-avs-primary hidden text-[10px] font-semibold tracking-wider uppercase sm:block">
              Standard
            </span>
          </div>
        </Link>

        {/* ── Navigation desktop centrale ──────────────────────────────────── */}
        <nav
          aria-label="Navigation principale"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <NavDropdown key={item.label} item={item} onPremiumClick={() => setPremiumOpen(true)} />
          ))}
        </nav>

        {/* ── Actions utilisateur (Droite) ─────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="#"
            className={cn(
              'rounded-avs hidden items-center gap-2 px-3 py-2 text-sm font-medium transition-colors md:flex',
              pathname.startsWith('/dashboard')
                ? 'bg-avs-primary/10 text-avs-primary'
                : 'text-avs-accent/60 hover:bg-avs-accent/5 hover:text-avs-accent',
            )}
            title="Dashboard"
          >
            <LayoutDashboard size={16} aria-hidden />
            <span className="hidden xl:inline">Dashboard</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-avs text-avs-accent/60 hover:bg-avs-accent/5 hover:text-avs-accent hidden items-center gap-2 px-3 py-2 text-sm font-medium transition-colors md:flex"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            <span className="hidden xl:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <div className="border-avs-accent/10 hidden items-center gap-3 border-l pl-4 sm:flex">
            {!isHydrated ? (
              <div className="bg-avs-accent/10 rounded-avs h-9 w-24 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                <div className="hidden text-right md:block">
                  <p className="text-avs-accent text-sm font-semibold">{user.name}</p>
                  <p className="text-avs-accent/50 text-xs capitalize">{user.role}</p>
                </div>
                <div className="bg-avs-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                  <User size={16} className="text-avs-primary" />
                </div>
                <div className="bg-avs-accent/10 h-6 w-px" />
                <button
                  // onClick={logout}
                  className="rounded-avs text-avs-accent p-2 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Déconnexion"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="#"
                  className="rounded-avs text-avs-accent hover:bg-avs-accent/5 px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Connexion
                </Link>
                <Link href="#" className="avs-btn-primary px-5 py-2 text-sm shadow-sm">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-avs text-avs-accent hover:bg-avs-accent/5 flex h-10 w-10 items-center justify-center transition-colors lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Navigation mobile structurée ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-avs-accent/10 bg-avs-secondary absolute w-full overflow-hidden border-t shadow-lg lg:hidden"
            aria-label="Navigation mobile"
          >
            <div className="flex max-h-[80vh] flex-col space-y-6 overflow-y-auto px-4 py-6">
              {/* Section Produits */}
              <div className="space-y-2">
                <p className="text-avs-accent/40 px-3 text-xs font-bold tracking-wider uppercase">
                  Produits
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { href: 'http://localhost:3001', label: 'Components', icon: Puzzle, desc: 'Bibliothèque UI' },
                    { href: 'http://localhost:3002', label: 'Drop', icon: ShoppingBag, desc: 'E-commerce' },
                    { href: 'http://localhost:3003', label: 'Behance', icon: ImageIcon, desc: 'Portfolios' },
                    { href: 'http://localhost:3004', label: 'Mode', icon: Wand2, desc: 'Configurateur 3D' },
                    { href: 'http://localhost:3005', label: 'Icons', icon: Box, desc: 'SVG africains' },
                  ].map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'rounded-avs flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors',
                        'text-avs-accent hover:bg-avs-accent/5',
                      )}
                    >
                      <Icon size={18} className="text-avs-accent/50" aria-hidden />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Section Communauté */}
              <div className="space-y-2">
                <p className="text-avs-accent/40 px-3 text-xs font-bold tracking-wider uppercase">
                  Communauté
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { href: '#', label: 'Artisans', icon: Users },
                    { href: '#', label: 'Classement', icon: Award },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'rounded-avs flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors',
                        pathname === href
                          ? 'bg-avs-primary/10 text-avs-primary'
                          : 'text-avs-accent hover:bg-avs-accent/5',
                      )}
                    >
                      <Icon size={18} className={pathname === href ? 'text-avs-primary' : 'text-avs-accent/50'} aria-hidden />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Section Outils & Utils */}
              <div className="space-y-2">
                <p className="text-avs-accent/40 px-3 text-xs font-bold tracking-wider uppercase">
                  Outils
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { href: '#', label: 'Documentation', icon: BookOpen },
                    { href: '#', label: 'Tableau de bord', icon: LayoutDashboard },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'rounded-avs flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors',
                        pathname.startsWith(href)
                          ? 'bg-avs-primary/10 text-avs-primary'
                          : 'text-avs-accent hover:bg-avs-accent/5',
                      )}
                    >
                      <Icon
                        size={18}
                        className={
                          pathname.startsWith(href) ? 'text-avs-primary' : 'text-avs-accent/50'
                        }
                        aria-hidden
                      />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={toggleTheme}
                    className={cn(
                      'rounded-avs flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors',
                      'text-avs-accent hover:bg-avs-accent/5',
                    )}
                  >
                    {theme === 'dark' ? <Sun size={18} className="text-avs-accent/50" /> : <Moon size={18} className="text-avs-accent/50" />}
                    {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                  </button>
                </div>
              </div>

              {/* Actions Auth */}
              <div className="border-avs-accent/10 flex flex-col gap-3 border-t pt-6">
                {!isHydrated ? (
                  <div className="bg-avs-accent/10 rounded-avs h-10 animate-pulse" />
                ) : isAuthenticated && user ? (
                  <>
                    <div className="rounded-avs border-avs-primary/20 bg-avs-primary/5 border p-3">
                      <p className="text-avs-accent text-sm font-semibold">{user.name}</p>
                      <p className="text-avs-accent/50 mt-0.5 text-xs capitalize">{user.role}</p>
                    </div>
                    <Link
                      href="#"
                      className="avs-btn-secondary w-full justify-center py-3 text-sm font-bold"
                    >
                      Mon Dashboard
                    </Link>
                    <button
                      // onClick={logout}
                      className="avs-btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm font-bold shadow-md"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="#"
                      className="avs-btn-secondary w-full justify-center py-3 text-sm font-bold"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="#"
                      className="avs-btn-primary w-full justify-center py-3 text-sm font-bold shadow-md"
                    >
                      Créer un compte
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </header>
  );
}

export default Header;
