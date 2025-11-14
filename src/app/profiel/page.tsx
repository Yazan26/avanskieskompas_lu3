import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { dashboardNav } from "@/data/navigation";

const headerAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJYwH8rwiv5msQhjCUTLjGUkKGGJTIBMXhBm5LcogPF7J3RHXc6NxtlQwq82iYKr-84B71y9iq4737RyUCzfXgHS8qerwz5IYIC43SMBwNng1P9T6No9GrHEerYVi9zphQdeQAmj96hCscifKXCbDdFjbGM5aboB7OB4vrCM4HVc3vxSubhT7avkrceaRrzQDPnGn7a4AJFgKhZcnYrWcoKkf90CFgvIbPpXG9od1-fvOPEWBzkJqCbteAdX_Bt9E1JUBFlDw6_YJ6";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text dark:bg-surface-dark dark:text-text-dark">
      <SiteHeader
        title="Avans VKM Zoeker"
        navItems={dashboardNav}
        profileImage={headerAvatar}
        translucent
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-72">
            <ProfileSidebar
              name="Student Name"
              subtitle="Communicatie & Multimedia Design"
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCIpIiIzsXSfac2w56GfggYskdugdUbl689dtPcnPKbXzmM1ZV5xrdNZpgHikma-W1iEp0YZB7xeC7ofeI4zQBnnc8Bn0Ydk_y8nn8_6z4ppN1ldgaQ0RfadWK6R4UJ4TK4SCC0j_ep2dOvFNvv-lk_8qd8DbobGWKGsOeVOQFFwJM8PolU6IAyUKaAF5X7VHBMGSNTWUNirySUjKsLc4kWf3eHS169M7TkVxoiHteF-1wDzyJR6Y-tjRMgPYuxAj49Fzwr9f5dnE86"
            />
          </aside>
          <section className="flex-1 space-y-8">
            <form className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 dark:border-border-dark">
                <h1 className="text-2xl font-bold">Accountinstellingen</h1>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col text-sm font-semibold text-text dark:text-text-dark">
                  Volledige naam
                  <input
                    className="mt-2 rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                    defaultValue="Student Name"
                  />
                </label>
                <label className="flex flex-col text-sm font-semibold text-text dark:text-text-dark">
                  Emailadres
                  <input
                    className="mt-2 rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                    defaultValue="student.name@avans.nl"
                  />
                </label>
                <label className="flex flex-col text-sm font-semibold text-text dark:text-text-dark">
                  Opleiding
                  <input
                    disabled
                    className="mt-2 cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-3 text-base text-muted dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark"
                    defaultValue="Communicatie & Multimedia Design"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white">
                  Wijzigingen opslaan
                </button>
              </div>
            </form>
            <form className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
              <div className="border-b border-border pb-4 dark:border-border-dark">
                <h2 className="text-xl font-bold">Wachtwoord wijzigen</h2>
                <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                  Update je wachtwoord. Kies een sterk en uniek wachtwoord.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col text-sm font-semibold text-text dark:text-text-dark">
                  Nieuw wachtwoord
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-2 rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                  />
                </label>
                <label className="flex flex-col text-sm font-semibold text-text dark:text-text-dark">
                  Bevestig wachtwoord
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-2 rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:border-primary focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white">
                  Wachtwoord updaten
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
