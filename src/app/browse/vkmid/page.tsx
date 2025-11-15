import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI for Business – Module details | Avans Keuze Kompas',
};

export default function ModuleAiForBusinessPage() {
  return (
    <section className="py-8">
      {/* Breadcrumbs */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="font-medium text-accent hover:underline"
        >
          Home
        </Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">
          /
        </span>
        <Link
          href="/browse"
          className="font-medium text-accent hover:underline"
        >
          Browse VKM
        </Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">
          /
        </span>
        <span className="font-medium text-text-light dark:text-text-dark">
          AI for Business
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Heading */}
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-black leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
              AI for Business
            </p>
            <p className="text-base font-medium text-text-muted-light dark:text-text-muted-dark">
              PRJ4
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border-light dark:border-border-dark">
            <div className="flex gap-6">
              <button className="flex flex-col items-center border-b-[3px] border-b-primary pb-3 pt-1 text-sm font-bold text-text-light dark:text-text-dark">
                Omschrijving
              </button>
              <button className="flex flex-col items-center border-b-[3px] border-b-transparent pb-3 pt-1 text-sm font-bold text-text-muted-light transition-colors hover:border-primary/50 hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark">
                Leerdoelen
              </button>
              <button className="flex flex-col items-center border-b-[3px] border-b-transparent pb-3 pt-1 text-sm font-bold text-text-muted-light transition-colors hover:border-primary/50 hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark">
                Reviews
              </button>
              <button className="flex flex-col items-center border-b-[3px] border-b-transparent pb-3 pt-1 text-sm font-bold text-text-muted-light transition-colors hover:border-primary/50 hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark">
                Docenten
              </button>
            </div>
          </div>

          {/* Tab content – static placeholder for now */}
          <div className="flex flex-col gap-8 pt-2">
            {/* Description */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                Beschrijving van de module
              </h3>
              <p className="text-base leading-relaxed text-text-light dark:text-text-dark">
                Een uitgebreide samenvatting van de inhoud en het doel van de
                module. Deze sectie beschrijft de kernconcepten die worden
                behandeld, de structuur van de cursus en wat studenten kunnen
                verwachten van de algehele leerervaring. De module &quot;AI for
                Business&quot; richt zich op het toepassen van kunstmatige
                intelligentie in een zakelijke context, waarbij de focus ligt
                op praktische implementatie en strategische waardecreatie.
              </p>
            </section>

            {/* Prerequisites */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                Voorkennis
              </h3>
              <div className="rounded-lg border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
                <ul className="list-inside list-disc space-y-2 text-base text-text-light dark:text-text-dark">
                  <li>Basiskennis van programmeren (bij voorkeur Python).</li>
                  <li>Inleidende statistiek en data-analyse.</li>
                  <li>Voltooiing van de propedeuse is vereist.</li>
                </ul>
              </div>
            </section>

            {/* Assessment */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                Beoordeling
              </h3>
              <p className="text-base leading-relaxed text-text-light dark:text-text-dark">
                De beoordeling voor deze module bestaat uit een combinatie van
                een praktijkgericht project en een individueel schriftelijk
                tentamen. Het project telt voor 60% mee en het tentamen voor
                40%. Beide onderdelen moeten met een voldoende (5,5 of hoger)
                worden afgesloten om de module te behalen.
              </p>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* AI tag */}
          <div className="flex w-full items-center gap-3 rounded-lg border border-primary/30 bg-primary/20 p-3 text-primary-dark dark:text-primary">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
            >
              star
            </span>
            <p className="text-sm font-bold">Aanbevolen voor jou</p>
          </div>

          {/* Key facts */}
          <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-card-light p-6 dark:border-border-dark dark:bg-card-dark">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              Kerngegevens
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  ECTS
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  15
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Periode
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  3 &amp; 4
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Taal
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  Nederlands
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Locatie
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  Breda
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-bold text-white transition-colors hover:bg-primary/90">
              Aanmelden voor module
            </button>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary/20 text-base font-bold text-secondary transition-colors hover:bg-secondary/30 dark:bg-secondary/30 dark:hover:bg-secondary/40">
              <span className="material-symbols-outlined">
                favorite_border
              </span>
              Opslaan in favorieten
            </button>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2 rounded-xl border border-border-light bg-card-light p-6 dark:border-border-dark dark:bg-card-dark">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              Studentenbeoordeling
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-text-light dark:text-text-dark">
                4.5
              </span>
              <div className="flex text-yellow-500">
                {['star', 'star', 'star', 'star', 'star_half'].map((icon) => (
                  <span
                    key={icon}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
            <button className="w-fit text-left text-sm font-medium text-accent hover:underline">
              Gebaseerd op 23 reviews
            </button>
          </div>

          {/* Related modules */}
          <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-card-light p-6 dark:border-border-dark dark:bg-card-dark">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              Gerelateerde modules
            </h3>
            <div className="flex flex-col gap-3">
              <button className="rounded-lg p-3 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                <p className="font-semibold text-text-light dark:text-text-dark">
                  Data Science Fundamentals
                </p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  PRJ5 – 15 ECTS
                </p>
              </button>
              <button className="rounded-lg p-3 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                <p className="font-semibold text-text-light dark:text-text-dark">
                  Digital Transformation
                </p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  BUS2 – 15 ECTS
                </p>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
