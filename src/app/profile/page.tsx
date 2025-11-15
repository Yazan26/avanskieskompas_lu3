'use client';

import { motion } from 'framer-motion';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-12 lg:flex-row lg:gap-12">
      {/* Left sidebar */}
      <motion.aside 
        className="w-full flex-shrink-0 lg:w-80"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="sticky top-24 flex h-full flex-col justify-between rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark">
          <div className="flex flex-col gap-6">
            {/* User info */}
            <div className="flex items-center gap-4">
              <div
                className="size-16 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-primary/20 transition-transform duration-300 hover:scale-110"
                aria-label="Profielfoto"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIpIiIzsXSfac2w56GfggYskdugdUbl689dtPcnPKbXzmM1ZV5xrdNZpgHikma-W1iEp0YZB7xeC7ofeI4zQBnnc8Bn0Ydk_y8nn8_6z4ppN1ldgaQ0RfadWK6R4UJ4TK4SCC0j_ep2dOvFNvv-lk_8qd8DbobGWKGsOeVOQFFwJM8PolU6IAyUKaAF5X7VHBMGSNTWUNirySUjKsLc4kWf3eHS169M7TkVxoiHteF-1wDzyJR6Y-tjRMgPYuxAj49Fzwr9f5dnE86')",
                }}
              />
              <div className="flex flex-col overflow-hidden">
                <h1 className="truncate text-lg font-bold text-gray-900 dark:text-text-dark">
                  Student Name
                </h1>
                <p className="truncate text-sm text-text-muted-light dark:text-text-muted-dark">
                  Communicatie &amp; Multimedia Design
                </p>
              </div>
            </div>

            {/* Sidebar nav */}
            <nav className="flex flex-col gap-2 pt-4 text-sm">
              {[
                { icon: 'person', label: 'Accountinstellingen', active: true },
                { icon: 'bookmark', label: 'Mijn Modules', active: false },
                { icon: 'tune', label: 'Mijn Voorkeuren', active: false },
                { icon: 'history', label: 'Activiteit', active: false },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                    item.active
                      ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-105 dark:text-text-dark dark:hover:bg-border-dark'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
              <motion.button 
                className="mt-6 flex items-center gap-3 border-t-2 border-gray-200 px-4 pt-6 text-gray-700 transition-colors duration-300 hover:text-primary dark:border-border-dark dark:text-text-dark dark:hover:text-primary"
                whileHover={{ x: 5 }}
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span>Uitloggen</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.div 
        className="min-w-0 flex-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-8">
          {/* Account settings */}
          <section className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-6 dark:border-border-dark">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-text-dark">
                Accountinstellingen
              </h2>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Verified</span>
              </div>
            </div>

            <form className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.label 
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                    Volledige naam
                  </span>
                  <input
                    className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                    defaultValue="Student Name"
                  />
                </motion.label>
                <motion.label 
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                    E-mailadres
                  </span>
                  <input
                    className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                    defaultValue="student.name@avans.nl"
                  />
                </motion.label>
              </div>

              <motion.div 
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="flex flex-col">
                  <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                    Opleiding
                  </span>
                  <input
                    className="h-12 cursor-not-allowed rounded-xl border-2 border-gray-300 bg-gray-100 px-4 text-sm text-gray-500 shadow-sm outline-none ring-0 dark:border-border-dark dark:bg-background-dark/50 dark:text-text-muted-dark"
                    defaultValue="Communicatie &amp; Multimedia Design"
                    disabled
                  />
                </label>
              </motion.div>

              <motion.div 
                className="flex justify-end pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Wijzigingen opslaan</span>
                  <span className="material-symbols-outlined text-lg">save</span>
                </motion.button>
              </motion.div>
            </form>
          </section>

          {/* Password section */}
          <motion.section 
            className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="pb-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-text-dark">
              Wachtwoord wijzigen
            </h3>
            <p className="border-b-2 border-gray-200 pb-6 text-sm text-text-muted-light dark:border-border-dark dark:text-text-muted-dark">
              Update uw wachtwoord. Zorg ervoor dat het een sterk en uniek wachtwoord is.
            </p>

            <form className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.label 
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                    Nieuw wachtwoord
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                  />
                </motion.label>
                <motion.label 
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                    Bevestig wachtwoord
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                  />
                </motion.label>
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Wachtwoord updaten</span>
                  <span className="material-symbols-outlined text-lg">lock</span>
                </motion.button>
              </div>
            </form>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
