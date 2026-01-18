'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslation } from '../providers/LanguageProvider';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const navLinks = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.browse', href: '/browse' },
    { labelKey: 'nav.aiAssistant', href: '/recommendations' },
    { labelKey: 'nav.faq', href: '/faq' },
    { labelKey: 'nav.profile', href: '/profile' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex w-full items-center justify-between border-b px-4 py-4 backdrop-blur-md transition-all duration-300 sm:px-6 lg:px-10 ${scrolled
        ? 'border-primary/20 bg-foreground-light/90 shadow-lg shadow-primary/10 dark:bg-foreground-dark/90'
        : 'border-border-light bg-foreground-light/80 dark:border-border-dark dark:bg-foreground-dark/80'
        }`}
    >
      {/* Logo + title */}
      <Link href="/" className="flex items-center gap-4 text-text-primary-light transition-transform duration-300 hover:scale-105 dark:text-text-primary-dark">
        <div className="size-8 text-primary transition-transform duration-300 hover:rotate-12">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] lg:text-xl">
          Avans Keuze Kompas
        </h2>
      </Link>

      {/* Desktop nav */}
      <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium leading-normal transition-colors"
              >
                <span className={isActive ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}>
                  {t(link.labelKey)}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex size-10 items-center justify-center rounded-lg border border-border-light text-text-primary-light transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:border-border-dark dark:text-text-primary-dark"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="material-symbols-outlined text-xl">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
          className="flex h-10 items-center justify-center rounded-lg border border-border-light px-3 text-sm font-bold text-text-primary-light transition-all duration-300 hover:border-primary hover:bg-primary/10 dark:border-border-dark dark:text-text-primary-dark"
          aria-label={language === 'en' ? 'Switch to Dutch' : 'Switch to English'}
        >
          {language === 'en' ? 'NL' : 'EN'}
        </button>

        {isLoggedIn ? (
          <Link href="/profile" className="group relative flex h-11 min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-accent px-6 text-sm font-bold leading-normal tracking-[0.015em] text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/50">
            <span className="relative z-10 truncate">{t('common.myAccount')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ) : pathname !== '/login' && (
          <Link href="/login" className="group relative flex h-11 min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-sm font-bold leading-normal tracking-[0.015em] text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50">
            <span className="relative z-10 truncate">{t('common.login')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="flex size-10 items-center justify-center rounded-lg border border-border-light text-text-primary-light transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 md:hidden dark:border-border-dark dark:text-text-primary-dark"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 right-0 top-full z-20 overflow-hidden border-b border-border-light bg-foreground-light/95 shadow-xl backdrop-blur-lg transition-all duration-300 dark:border-border-dark dark:bg-foreground-dark/95 md:hidden ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link, index) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-text-primary-light hover:bg-primary/5 hover:text-primary dark:text-text-primary-dark'
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: open ? 'slide-up 0.3s ease-out forwards' : 'none'
                }}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}

          {/* Mobile toggles */}
          <div className="flex gap-2 mt-3 border-t border-border-light dark:border-border-dark pt-3">
            <button
              onClick={toggleTheme}
              className="flex flex-1 h-12 items-center justify-center gap-2 rounded-lg border border-border-light text-sm font-medium dark:border-border-dark"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
              className="flex flex-1 h-12 items-center justify-center gap-2 rounded-lg border border-border-light text-sm font-medium dark:border-border-dark"
            >
              {language === 'en' ? '🇳🇱 Nederlands' : '🇬🇧 English'}
            </button>
          </div>

          {isLoggedIn ? (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t('common.myAccount')}
            </Link>
          ) : pathname !== '/login' && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t('common.login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

