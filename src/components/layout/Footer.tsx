'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border-light bg-foreground-light px-6 py-12 dark:border-border-dark dark:bg-foreground-dark">
      {/* Gradient background effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Top section: Logo + Description */}
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className="size-10 text-primary transition-transform duration-300 hover:rotate-12">
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
                <h3 className="text-xl font-bold">Avans Keuze Kompas</h3>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                Vind jouw perfecte Vrije Keuze Module met AI-gestuurde aanbevelingen en maak je studietraject uniek.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
                  Navigatie
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Browse VKM', href: '/browse' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Profile', href: '/profile' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
                    >
                      <span className="size-1 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">
                  Support
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Avans website', href: 'https://avans.nl' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
                    >
                      <span className="size-1 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="relative h-px w-full overflow-hidden bg-border-light dark:bg-border-dark">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Bottom section: Copyright + Social */}
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark md:flex-row md:text-left">
            <p className="flex items-center gap-2">
              <span>© {currentYear} Avans Keuze Kompas.</span>
              <span className="hidden md:inline">Alle rechten voorbehouden.</span>
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
