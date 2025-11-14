import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { benefitCards, heroImage, howItWorksSteps } from "@/data/home";
import { marketingNav } from "@/data/navigation";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader
        title="Avans Keuze Kompas"
        navItems={marketingNav}
        actionSlot={
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            Inloggen
          </button>
        }
      />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-12 sm:px-6 lg:px-0">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Vrije Keuze Modules
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Vind jouw perfecte VKM met AI.
              </h1>
              <p className="text-base text-muted dark:text-muted-dark">
                Stop met eindeloos zoeken. Krijg persoonlijke aanbevelingen op
                basis van jouw interesses en studie.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90">
                Start mijn aanbeveling
              </button>
              <button className="rounded-lg border border-border px-5 py-3 text-base font-semibold text-text transition-colors hover:border-primary dark:border-border-dark dark:text-text-dark">
                Bekijk alle modules
              </button>
            </div>
          </div>
          <div
            className="aspect-square w-full rounded-3xl bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-label="Illustratie van AI en keuzes"
          />
        </section>
        <section id="hoe-het-werkt" className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Hoe het werkt</h2>
            <p className="text-base text-muted dark:text-muted-dark">
              Zo begeleidt het Avans Keuze Kompas je naar de juiste module.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <article
                key={step.id}
                className="flex flex-col gap-3 rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-5"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  {step.icon}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              De voordelen van het Keuze Kompas
            </h2>
            <p className="text-base text-muted dark:text-muted-dark">
              Ontdek waarom studenten voor ons platform kiezen om hun ideale
              VKM te vinden.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefitCards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col gap-3 rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-5"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  {card.icon}
                </span>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
