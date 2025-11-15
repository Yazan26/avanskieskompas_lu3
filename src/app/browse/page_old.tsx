import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse VKM | Avans Keuze Kompas',
};

export default function BrowsePage() {
  return (
    <section className="py-8">
      {/* Top row: heading + search + sort + avatar */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-4xl">
            Browse Vrije Keuze Modules
          </h1>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark">
            Verken en filter alle beschikbare VKM&apos;s. Aanbevelingen volgen
            later op basis van jouw profiel.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative w-full min-w-[220px] sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                search
              </span>
            </div>
            <input
              type="search"
              placeholder="Zoek op naam of code"
              className="w-full rounded-lg border border-border-light bg-foreground-light py-2 pl-10 pr-4 text-sm text-text-primary-light outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
            />
          </div>

          {/* Sort select */}
          <div className="relative w-full min-w-[180px] sm:w-48">
            <select
              className="w-full appearance-none rounded-lg border border-border-light bg-foreground-light py-2 pl-4 pr-10 text-sm text-text-primary-light outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
              defaultValue="recommended"
            >
              <option value="recommended">Sorteer: Aanbevolen</option>
              <option value="popularity">Sorteer: Populariteit</option>
              <option value="az">Sorteer: A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                expand_more
              </span>
            </div>
          </div>

          {/* Avatar */}
          <div
            className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
            aria-label="Gebruikersprofiel"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDltnxIJw-p6C9PZaj6Ven9COAJsyzzYlbQfU5gNTitHLLFEqnwNAFnhdK6iL6O187Evx1PHUpg_k3RiUwMMIHh67Kxue1DfqPoT2k6pbpyvnkUMRANOcGGZBCNekar-AEK3R7SGCr1oTLcJ4k0mBJCdlXK2RoIfXhkF0N71xUNyF5_sc3_GRBXT73EvV5gWlrKWPFKQSjJ57Am8cPTx_iC6_g5lhdh1GSUGNdmBqUCmhYsSrZYkHJiQZEFGFuYpYXK6wzBZ17Rp3_u")',
            }}
          />
        </div>
      </div>

      {/* Main content: filters + modules */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 flex flex-col gap-6 rounded-xl border border-border-light bg-foreground-light p-4 dark:border-border-dark dark:bg-foreground-dark">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                filter_alt
              </span>
              <h3 className="text-base font-semibold">Filters</h3>
            </div>

            <div className="flex flex-col gap-6 text-sm">
              {/* Periode */}
              <div>
                <h4 className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Periode
                </h4>
                <div className="flex flex-col gap-1">
                  {['Period 1', 'Period 2', 'Period 3', 'Period 4'].map(
                    (label) => (
                      <label
                        key={label}
                        className="flex items-center gap-x-3 py-1.5"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-2 border-border-light bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-primary/50 focus:ring-offset-0 dark:border-border-dark"
                        />
                        <span>{label}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Taal */}
              <div>
                <h4 className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Taal
                </h4>
                <div className="flex flex-col gap-1">
                  {['Dutch', 'English'].map((label) => (
                    <label
                      key={label}
                      className="flex items-center gap-x-3 py-1.5"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-2 border-border-light bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-primary/50 focus:ring-offset-0 dark:border-border-dark"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Locatie */}
              <div>
                <h4 className="mb-2 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Locatie
                </h4>
                <div className="flex flex-col gap-1">
                  {['Breda', "’s-Hertogenbosch", 'Tilburg'].map((label) => (
                    <label
                      key={label}
                      className="flex items-center gap-x-3 py-1.5"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-2 border-border-light bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-primary/50 focus:ring-offset-0 dark:border-border-dark"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-primary/90">
              Filters toepassen
            </button>
          </div>
        </aside>

        {/* Modules + skeleton + pagination */}
        <main className="flex w-full flex-col">
          {/* Module grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border-light bg-foreground-light transition-shadow hover:shadow-lg dark:border-border-dark dark:bg-foreground-dark">
              <div className="flex grow flex-col p-6">
                <h3 className="mb-2 text-lg font-bold">
                  Circular Entrepreneurship
                </h3>
                <p className="mb-4 grow text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Learn to build sustainable business models that contribute to
                  a circular economy.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    6 ECTS
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                    Period 3
                  </span>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 dark:bg-green-400/10 dark:text-green-400">
                    English
                  </span>
                </div>
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-background-light p-3 dark:bg-background-dark">
                  <span className="material-symbols-outlined text-lg text-primary">
                    auto_awesome
                  </span>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Recommended based on your interest in &apos;Innovation &amp;
                    Business&apos;.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-primary/90">
                    View Details
                  </button>
                  <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-light text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:text-text-secondary-dark">
                    <span className="material-symbols-outlined">
                      bookmark_add
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border-light bg-foreground-light transition-shadow hover:shadow-lg dark:border-border-dark dark:bg-foreground-dark">
              <div className="flex grow flex-col p-6">
                <h3 className="mb-2 text-lg font-bold">
                  Data Science for Business
                </h3>
                <p className="mb-4 grow text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Understand how to leverage data to make informed business
                  decisions.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    6 ECTS
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                    Period 4
                  </span>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 dark:bg-green-400/10 dark:text-green-400">
                    English
                  </span>
                </div>
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-background-light p-3 dark:bg-background-dark">
                  <span className="material-symbols-outlined text-lg text-primary">
                    auto_awesome
                  </span>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Recommended because you excelled in &apos;Statistics&apos;.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-primary/90">
                    View Details
                  </button>
                  <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-light text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:text-text-secondary-dark">
                    <span className="material-symbols-outlined">
                      bookmark_add
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 (saved state) */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border-light bg-foreground-light transition-shadow hover:shadow-lg dark:border-border-dark dark:bg-foreground-dark">
              <div className="flex grow flex-col p-6">
                <h3 className="mb-2 text-lg font-bold">Creative Storytelling</h3>
                <p className="mb-4 grow text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Master the art of narrative to create compelling content for
                  various media.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    6 ECTS
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                    Period 3
                  </span>
                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-500 dark:bg-purple-400/10 dark:text-purple-400">
                    Dutch
                  </span>
                </div>
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-background-light p-3 dark:bg-background-dark">
                  <span className="material-symbols-outlined text-lg text-primary">
                    auto_awesome
                  </span>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Recommended for your &apos;Communication&apos; study
                    profile.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-primary/90">
                    View Details
                  </button>
                  <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/50 bg-primary/10 text-primary transition-colors">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Skeleton loading card (placeholder for future API) */}
            <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border-light bg-foreground-light dark:border-border-dark dark:bg-foreground-dark">
              <div className="flex grow flex-col p-6">
                <div className="mb-3 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-4 flex flex-col gap-2">
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mb-5 h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-4">
                  <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              className="flex size-9 items-center justify-center rounded-lg border border-border-light bg-foreground-light text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark"
              disabled
            >
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-sm font-medium text-white transition-colors">
              1
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border-light bg-foreground-light text-sm text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              2
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border-light bg-foreground-light text-sm text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              3
            </button>
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              ...
            </span>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border-light bg-foreground-light text-sm text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              8
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border-light bg-foreground-light text-text-secondary-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              <span className="material-symbols-outlined text-xl">
                chevron_right
              </span>
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}
