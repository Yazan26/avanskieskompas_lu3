import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { dashboardNav } from "@/data/navigation";
import { moduleDetails, relatedModules } from "@/data/modules";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ModuleDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return moduleDetails.map((module) => ({ slug: module.slug }));
}

export default function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const activeModule = moduleDetails.find((item) => item.slug === params.slug);

  if (!activeModule) {
    notFound();
  }

  const related = relatedModules.filter((item) =>
    activeModule.relatedIds.includes(item.id),
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader title="Avans VKM Zoeker" navItems={dashboardNav} translucent />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted dark:text-muted-dark">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/modules" className="hover:text-primary">
            Zoeken
          </Link>
          <span>/</span>
          <span className="text-text font-semibold dark:text-text-dark">
            {activeModule.title}
          </span>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <div className="flex flex-col gap-2">
              <p className="text-4xl font-black tracking-tight">
                {activeModule.title}
              </p>
              <p className="text-lg text-muted dark:text-muted-dark">
                {activeModule.summary}
              </p>
            </div>
            <div className="border-b border-border dark:border-border-dark">
              <div className="flex flex-wrap gap-6">
                {["Omschrijving", "Leerdoelen", "Reviews", "Docenten"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      className={`border-b-2 pb-3 text-sm font-semibold ${
                        index === 0
                          ? "border-primary text-text dark:text-text-dark"
                          : "border-transparent text-muted dark:text-muted-dark"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>
            </div>
            <article className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Beschrijving van de module</h2>
              <p className="text-base leading-relaxed text-muted dark:text-muted-dark">
                {activeModule.description}
              </p>
            </article>
            <article className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Voorkennis</h2>
              <ul className="list-inside list-disc space-y-2 text-muted dark:text-muted-dark">
                {activeModule.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Beoordeling</h2>
              <p className="text-base leading-relaxed text-muted dark:text-muted-dark">
                {activeModule.assessment}
              </p>
            </article>
            {activeModule.reason ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary">
                <span className="material-symbols-outlined mr-2 align-middle">
                  star
                </span>
                {activeModule.reason}
              </div>
            ) : null}
          </section>
          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
              <div className="text-sm font-semibold uppercase text-primary">
                {activeModule.highlightLabel ?? "Aanbevolen"}
              </div>
              <h3 className="mt-2 text-lg font-bold">{activeModule.title}</h3>
              <dl className="mt-4 space-y-2 text-sm text-muted dark:text-muted-dark">
                <div className="flex justify-between">
                  <dt>ECTS</dt>
                  <dd className="font-semibold text-text dark:text-text-dark">
                    {activeModule.ects}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Periode</dt>
                  <dd className="font-semibold text-text dark:text-text-dark">
                    {activeModule.periods}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taal</dt>
                  <dd className="font-semibold text-text dark:text-text-dark">
                    {activeModule.language}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Locatie</dt>
                  <dd className="font-semibold text-text dark:text-text-dark">
                    {activeModule.location}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white">
                  Aanmelden voor module
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-base font-semibold text-text dark:border-border-dark dark:text-text-dark">
                  <span className="material-symbols-outlined text-xl">
                    favorite_border
                  </span>
                  Opslaan in favorieten
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
              <h3 className="text-lg font-bold">Studentenbeoordeling</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {activeModule.rating.value.toFixed(1)}
                </span>
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className="material-symbols-outlined text-xl"
                      style={{
                        fontVariationSettings: `'FILL' ${
                          index + 0.5 < activeModule.rating.value ? 1 : 0
                        }`,
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted dark:text-muted-dark">
                Gebaseerd op {activeModule.rating.count} reviews
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
              <h3 className="mb-4 text-lg font-bold">Gerelateerde modules</h3>
              <div className="space-y-3 text-sm">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/modules/${item.slug}`}
                    className="block rounded-xl border border-border px-4 py-3 text-text transition-colors hover:border-primary dark:border-border-dark dark:text-text-dark"
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-muted dark:text-muted-dark">
                      {item.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
