import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqList } from "@/components/faq/faq-list";
import { dashboardNav } from "@/data/navigation";
import { faqItems } from "@/data/faq";

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader
        title="Avans VKM Zoeker"
        navItems={dashboardNav}
        translucent
      />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-12 sm:px-6 lg:px-0">
        <section className="flex flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            FAQ
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Helpcentrum
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted dark:text-muted-dark">
            Vind antwoorden op veelgestelde vragen. Kun je niet vinden wat je
            zoekt? Neem dan contact met ons op.
          </p>
          <label className="mt-6 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted dark:border-border-dark dark:bg-card-dark">
            <span className="material-symbols-outlined text-xl text-muted">
              search
            </span>
            <input
              type="search"
              placeholder="Zoek naar een vraag..."
              className="flex-1 bg-transparent text-base text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none"
            />
          </label>
        </section>
        <FaqList items={faqItems} />
        <section className="rounded-3xl border border-border bg-card p-8 text-center dark:border-border-dark dark:bg-card-dark">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">
              contact_support
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Kun je het antwoord niet vinden?</h2>
          <p className="mt-2 text-base text-muted dark:text-muted-dark">
            Ons team staat klaar om je te helpen met al je vragen over het
            VKM-keuzeproces en de werking van deze tool.
          </p>
          <button className="mt-6 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90">
            Neem contact op
          </button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
