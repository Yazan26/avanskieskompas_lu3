import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FilterPanel } from "@/components/modules/filter-panel";
import { ModuleCard } from "@/components/modules/module-card";
import { dashboardNav } from "@/data/navigation";
import { recommendationFilters, recommendedModules } from "@/data/modules";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDltnxIJw-p6C9PZaj6Ven9COAJsyzzYlbQfU5gNTitHLLFEqnwNAFnhdK6iL6O187Evx1PHUpg_k3RiUwMMIHh67Kxue1DfqPoT2k6pbpyvnkUMRANOcGGZBCNekar-AEK3R7SGCr1oTLcJ4k0mBJCdlXK2RoIfXhkF0N71xUNyF5_sc3_GRBXT73EvV5gWlrKWPFKQSjJ57Am8cPTx_iC6_g5lhdh1GSUGNdmBqUCmhYsSrZYkHJiQZEFGFuYpYXK6wzBZ17Rp3_u";

export default function RecommendationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader
        title="Avans VKM Finder"
        navItems={dashboardNav}
        profileImage={profileImage}
        showSearch
        searchPlaceholder="Zoek op naam of code"
        translucent
      />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        <aside className="w-full lg:w-72">
          <FilterPanel filters={recommendationFilters} className="sticky top-28" />
        </aside>
        <section className="flex-1">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                AI-Powered VKM Recommendations
              </h1>
              <p className="text-sm text-muted dark:text-muted-dark">
                Op maat gemaakte suggesties op basis van jouw profiel.
              </p>
            </div>
            <label className="relative inline-flex items-center">
              <select className="w-48 appearance-none rounded-lg border border-border bg-card px-4 py-2 text-sm text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
                <option>Sorteren op: Aanbevolen</option>
                <option>Sorteren op: Populariteit</option>
                <option>Sorteren op: A-Z</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 text-xl text-muted">
                expand_more
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recommendedModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
            <article className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6">
              <div className="mb-3 h-5 w-3/4 rounded bg-border dark:bg-border-dark" />
              <div className="mb-4 flex flex-col gap-2">
                <div className="h-3 w-full rounded bg-border/70 dark:bg-border-dark/70" />
                <div className="h-3 w-5/6 rounded bg-border/70 dark:bg-border-dark/70" />
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="h-6 w-16 rounded-full bg-border/70 dark:bg-border-dark/70" />
                <div className="h-6 w-24 rounded-full bg-border/70 dark:bg-border-dark/70" />
              </div>
              <div className="mb-4 h-14 rounded-xl bg-border/60 dark:bg-border-dark/50" />
              <div className="mt-auto flex items-center gap-4">
                <div className="h-10 w-full rounded-lg bg-border/60 dark:bg-border-dark/50" />
                <div className="h-10 w-10 rounded-lg bg-border/60 dark:bg-border-dark/50" />
              </div>
            </article>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="flex size-9 items-center justify-center rounded-lg border border-border text-muted dark:border-border-dark dark:text-muted-dark" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-white">
              1
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
              2
            </button>
            <span className="text-muted dark:text-muted-dark">...</span>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
              8
            </button>
            <button className="flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
