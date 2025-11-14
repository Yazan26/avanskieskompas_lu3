import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ModuleCard } from "@/components/modules/module-card";
import { dashboardNav } from "@/data/navigation";
import { searchFilters, searchModules } from "@/data/modules";

export default function ModulesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader
        title="Avans VKM Zoeker"
        navItems={dashboardNav}
        actionSlot={
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            Log in
          </button>
        }
        translucent
      />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-4xl font-black tracking-tight">
              Vind jouw perfecte module
            </h1>
            <p className="mt-2 text-base text-muted dark:text-muted-dark">
              Zoek op trefwoord, thema of code...
            </p>
          </div>
          <div className="sticky top-20 z-10 -mx-4 bg-surface/95 px-4 py-4 backdrop-blur-sm dark:bg-surface-dark/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <label className="relative block">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                search
              </span>
              <input
                type="search"
                placeholder="Zoek een VKM..."
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-base text-text placeholder:text-muted focus:border-primary focus:outline-none dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
              />
            </label>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
                  {searchFilters.map((section) => (
                    <details
                      key={section.id}
                      className="group border-b border-border last:border-0 dark:border-border-dark"
                      open={section.options.some((option) => option.selected)}
                    >
                      <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-semibold text-text dark:text-text-dark">
                        {section.title}
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                          expand_more
                        </span>
                      </summary>
                      <div className="pb-4">
                        <div className="space-y-3">
                          {section.options.map((option) => (
                            <label
                              key={option.id}
                              className="flex items-center gap-3 text-sm text-muted dark:text-muted-dark"
                            >
                              <input
                                type={section.type === "radio" ? "radio" : "checkbox"}
                                name={section.id}
                                defaultChecked={option.selected}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/60 dark:border-border-dark"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                    Apply Filters
                  </button>
                  <button className="flex-1 rounded-lg bg-border/50 py-2.5 text-sm font-semibold text-text dark:bg-border-dark/40 dark:text-text-dark">
                    Reset
                  </button>
                </div>
              </div>
            </aside>
            <section className="lg:col-span-3">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted dark:text-muted-dark">
                  12 modules gevonden
                </p>
                <button className="flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-text hover:border-primary dark:border-border-dark dark:text-text-dark">
                  Sorteer op: Relevantie
                  <span className="material-symbols-outlined text-lg">
                    expand_more
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {searchModules.map((module) => (
                  <ModuleCard key={module.id} module={module} variant="search" />
                ))}
              </div>
              <nav
                aria-label="Pagination"
                className="mt-10 flex items-center justify-center gap-2"
              >
                <button className="rounded-l-lg border border-border px-3 py-2 text-muted dark:border-border-dark dark:text-muted-dark">
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button className="border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white">
                  1
                </button>
                <button className="border border-border px-4 py-2 text-sm font-semibold text-text dark:border-border-dark dark:text-text-dark">
                  2
                </button>
                <span className="px-2 text-sm text-muted dark:text-muted-dark">
                  ...
                </span>
                <button className="rounded-r-lg border border-border px-3 py-2 text-muted dark:border-border-dark dark:text-muted-dark">
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </nav>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
