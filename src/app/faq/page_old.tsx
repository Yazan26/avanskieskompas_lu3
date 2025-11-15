import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ / Helpcentrum | Avans Keuze Kompas',
};

const faqs = [
  {
    question: 'Wat is een Vrije Keuze Module (VKM)?',
    answer:
      'Een Vrije Keuze Module (VKM) is een onderwijseenheid die je kunt kiezen buiten je eigen opleiding om je kennis te verbreden of te verdiepen in een ander vakgebied. Dit geeft je de kans om je studieprogramma te personaliseren.',
  },
  {
    question: 'Hoe werkt de AI-aanbeveling?',
    answer:
      "Ons AI-systeem analyseert je studievoortgang, interesses (op basis van opgeslagen favorieten) en het profiel van vergelijkbare studenten om je de meest relevante VKM's aan te bevelen. Hoe meer je de tool gebruikt, hoe beter de aanbevelingen worden.",
  },
  {
    question: 'Hoe kan ik me inschrijven voor een VKM?',
    answer:
      "Op de detailpagina van een module vind je een 'Aanmelden voor module'-knop. Deze knop leidt je door naar het officiële inschrijfsysteem van Avans (OSIRIS) waar je je inschrijving kunt voltooien. Zorg ervoor dat je voldoet aan de eventuele voorkenniseisen.",
  },
  {
    question: 'Kan ik een VKM kiezen die niet wordt aanbevolen?',
    answer:
      'Jazeker. De aanbevelingen zijn een hulpmiddel, geen verplichting. Je kunt via de zoek- en filterfunctie door alle beschikbare VKM’s bladeren en je inschrijven voor elke module waarvoor je toelaatbaar bent.',
  },
];

export default function FaqPage() {
  return (
    <section className="py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {/* Heading */}
        <header className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
            FAQ
          </p>
          <h1 className="text-4xl font-black tracking-tight text-text-light dark:text-text-dark md:text-5xl">
            Helpcentrum
          </h1>
          <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">
            Vind antwoorden op veelgestelde vragen. Kunt u niet vinden wat u
            zoekt? Neem dan contact met ons op.
          </p>
        </header>

        {/* Search input (static for now) */}
        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">
            search
          </span>
          <input
            type="text"
            placeholder="Zoek naar een vraag..."
            className="h-14 w-full rounded-lg border border-border-light bg-card-light pl-12 pr-4 text-text-light outline-none ring-0 placeholder:text-text-muted-light transition-all focus:border-primary focus:ring-2 focus:ring-primary/60 dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group overflow-hidden rounded-xl border border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                <span className="text-lg font-bold text-text-light dark:text-text-dark">
                  {item.question}
                </span>
                <span className="material-symbols-outlined transform text-text-muted-light transition-transform duration-300 group-open:rotate-180 dark:text-text-muted-dark">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-base leading-relaxed text-text-light dark:text-text-dark">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact card */}
        <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-border-light bg-card-light p-8 text-center dark:border-border-dark dark:bg-card-dark">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[28px]">
              contact_support
            </span>
          </div>
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Kunt u het antwoord niet vinden?
          </h3>
          <p className="max-w-md text-text-muted-light dark:text-text-muted-dark">
            Ons team staat klaar om u te helpen met al uw vragen over het
            VKM-keuzeproces en de werking van deze tool.
          </p>
          <button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white transition-colors hover:bg-primary/90">
            Neem contact op
          </button>
        </div>
      </div>
    </section>
  );
}
