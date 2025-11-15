'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

const modules = [
  {
    id: 1,
    title: 'Circular Entrepreneurship',
    description: 'Learn to build sustainable business models that contribute to a circular economy.',
    ects: 6,
    period: 'Period 3',
    language: 'English',
    recommendation: "Recommended based on your interest in 'Innovation & Business'.",
    saved: false,
  },
  {
    id: 2,
    title: 'Data Science for Business',
    description: 'Understand how to leverage data to make informed business decisions.',
    ects: 6,
    period: 'Period 4',
    language: 'English',
    recommendation: "Recommended because you excelled in 'Statistics'.",
    saved: false,
  },
  {
    id: 3,
    title: 'Creative Storytelling',
    description: 'Master the art of narrative to create compelling content for various media.',
    ects: 6,
    period: 'Period 3',
    language: 'Dutch',
    recommendation: "Recommended for your 'Communication' study profile.",
    saved: true,
  },
];

export default function BrowsePage() {
  const [savedModules, setSavedModules] = useState<number[]>([3]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSave = (id: number) => {
    setSavedModules(prev => 
      prev.includes(id) ? prev.filter(moduleId => moduleId !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-8 md:py-12">
      {/* Top row: heading + search + sort */}
      <motion.div 
        className="mb-8 flex flex-wrap items-start justify-between gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col gap-3">
          <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Browse Vrije Keuze Modules
          </h1>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark md:text-lg">
            Verken en filter alle beschikbare VKM&apos;s. Aanbevelingen volgen
            later op basis van jouw profiel.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Search input with animation */}
          <motion.div 
            className="relative w-full min-w-[240px] sm:w-72"
            whileFocus={{ scale: 1.02 }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="material-symbols-outlined text-xl text-text-secondary-light dark:text-text-secondary-dark">
                search
              </span>
            </div>
            <input
              type="search"
              placeholder="Zoek op naam of code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-border-light bg-foreground-light py-3 pl-12 pr-4 text-sm text-text-primary-light shadow-sm outline-none ring-0 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
            />
          </motion.div>

          {/* Sort select */}
          <div className="relative w-full min-w-[200px] sm:w-52">
            <select
              className="w-full appearance-none rounded-xl border-2 border-border-light bg-foreground-light py-3 pl-4 pr-10 text-sm text-text-primary-light shadow-sm outline-none ring-0 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
              defaultValue="recommended"
            >
              <option value="recommended">Sorteer: Aanbevolen</option>
              <option value="popularity">Sorteer: Populariteit</option>
              <option value="az">Sorteer: A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content: filters + modules */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Sidebar filters */}
        <motion.aside 
          className="w-full shrink-0 lg:w-80"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg dark:border-border-dark dark:bg-foreground-dark">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary">
                  filter_alt
                </span>
              </div>
              <h3 className="text-lg font-bold">Filters</h3>
            </div>

            <div className="flex flex-col gap-6 text-sm">
              {/* Filter sections */}
              {[
                { title: 'Periode', options: ['Period 1', 'Period 2', 'Period 3', 'Period 4'] },
                { title: 'Taal', options: ['Dutch', 'English'] },
                { title: 'Locatie', options: ['Breda', "'s-Hertogenbosch", 'Tilburg'] },
              ].map((section, sectionIndex) => (
                <motion.div 
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + sectionIndex * 0.1 }}
                >
                  <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                    {section.title}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {section.options.map((label) => (
                      <label
                        key={label}
                        className="group flex cursor-pointer items-center gap-x-3 py-2 transition-colors hover:text-primary"
                      >
                        <input
                          type="checkbox"
                          className="size-5 cursor-pointer rounded-md border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary checked:scale-110 focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 dark:border-border-dark"
                        />
                        <span className="transition-transform duration-300 group-hover:translate-x-1">{label}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Filters toepassen</span>
              <span className="material-symbols-outlined text-lg">check</span>
            </motion.button>
          </div>
        </motion.aside>

        {/* Modules grid */}
        <main className="flex w-full flex-col gap-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border-light bg-foreground-light shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="flex grow flex-col p-6">
                  <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                    {module.title}
                  </h3>
                  <p className="mb-5 grow text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {module.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      {module.ects} ECTS
                    </span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                      {module.period}
                    </span>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${module.language === 'English' ? 'bg-green-500/10 text-green-500 dark:bg-green-400/10 dark:text-green-400' : 'bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-400'}`}>
                      {module.language}
                    </span>
                  </div>
                  
                  {/* AI Recommendation */}
                  <div className="mb-6 flex items-start gap-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                    <span className="material-symbols-outlined text-xl text-primary">
                      auto_awesome
                    </span>
                    <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                      {module.recommendation}
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <Link href={`/browse/${module.id}`} className="flex-1">
                      <button className="group/btn flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50">
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover/btn:translate-x-1">
                          arrow_forward
                        </span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => toggleSave(module.id)}
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                        savedModules.includes(module.id)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border-light text-text-secondary-light hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-border-dark dark:text-text-secondary-dark'
                      }`}
                    >
                      <span 
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: savedModules.includes(module.id) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading skeleton */}
            <motion.div 
              className="flex animate-pulse flex-col overflow-hidden rounded-2xl border-2 border-border-light bg-foreground-light p-6 dark:border-border-dark dark:bg-foreground-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="mb-3 h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="mb-5 flex flex-col gap-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                <div className="h-7 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mb-6 h-16 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-3">
                <div className="h-11 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="size-11 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            </motion.div>
          </div>

          {/* Pagination */}
          <motion.div 
            className="mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              className="flex size-10 items-center justify-center rounded-lg border-2 border-border-light bg-foreground-light text-text-secondary-light transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:hover:scale-100 dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark"
              disabled
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`flex size-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all duration-300 hover:scale-110 ${
                  page === 1
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/50'
                    : 'border-border-light bg-foreground-light text-text-secondary-light hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-text-secondary-light dark:text-text-secondary-dark">...</span>
            <button className="flex size-10 items-center justify-center rounded-lg border-2 border-border-light bg-foreground-light text-sm text-text-secondary-light transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              8
            </button>
            <button className="flex size-10 items-center justify-center rounded-lg border-2 border-border-light bg-foreground-light text-text-secondary-light transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </motion.div>
        </main>
      </div>
    </section>
  );
}
