import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 dark:border-border-dark/70 bg-card dark:bg-card-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted dark:text-muted-dark sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Avans Keuze Kompas. Alle rechten voorbehouden.</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-primary">
            Privacybeleid
          </Link>
          <a
            href="https://www.avans.nl/"
            className="transition-colors hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Avans.nl
          </a>
        </div>
      </div>
    </footer>
  );
}
