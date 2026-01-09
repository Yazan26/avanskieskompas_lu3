'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { moduleService, userService } from '@/services/userService';

interface Module {
  _id: string; // The backend returns _id from Mongoose
  id: number;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  contact_id: number;
  level: string;
  learningoutcomes: string;
  module_tags: string; // It looks like a stringified array in the example
  interests_match_score?: number;
  popularity_score?: number;
  estimated_difficulty?: number;
  available_spots?: number;
  start_date?: string;
  module_text?: string;
  
  // Frontend derived/mocked
  recommendation?: string;
  saved?: boolean;
  period?: string;
  language?: string;
  isRecommended?: boolean;
}

export default function BrowsePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [savedModules, setSavedModules] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allModules, userProfile] = await Promise.all([
          moduleService.getAllModules(),
          userService.getProfile().catch(() => null) // Allow failing if not logged in
        ]);

        let savedIds: number[] = [];
        if (userProfile) {
            setIsLoggedIn(true);
            if (userProfile.recommendations && userProfile.recommendations.length > 0) {
                savedIds = userProfile.recommendations;
                setSavedModules(savedIds);
                setHasRecommendations(true);
            }
        }

        // Add saved status and isRecommended flag to modules
        const mappedModules = allModules.map((m: Module) => ({
            ...m,
            saved: savedIds.includes(m.id),
            isRecommended: savedIds.includes(m.id),
            // Mocking these fields for UI consistency as they are missing in backend schema viewed
            period: 'Period 1-4', 
            language: m.description && m.description.includes('Dutch') ? 'Dutch' : 'English'
        }));

        // Sort modules: recommended ones first
        const sortedModules = mappedModules.sort((a: Module, b: Module) => {
            if (a.isRecommended && !b.isRecommended) return -1;
            if (!a.isRecommended && b.isRecommended) return 1;
            return 0;
        });

        setModules(sortedModules);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSave = async (id: number) => {
    const isSaved = savedModules.includes(id);
    try {
        if (isSaved) {
            await userService.removeRecommendation(id);
            setSavedModules(prev => prev.filter(mid => mid !== id));
        } else {
            await userService.addRecommendation(id);
            setSavedModules(prev => [...prev, id]);
        }
    } catch (error) {
        console.error("Failed to update recommendation", error);
        alert("Failed to update favorite status. Please try again.");
    }
  };

  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.shortdescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Verken en filter alle beschikbare VKM&apos;s.
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
            {/* CTA Banner for logged-in users without recommendations */}
            {isLoggedIn && !hasRecommendations && !loading && (
              <motion.div
                className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 shadow-lg md:p-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <span className="material-symbols-outlined text-2xl text-primary">auto_awesome</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        Vind jouw perfecte module!
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Doe onze AI-aanbevelingstest en ontdek welke modules het beste bij jou passen.
                      </p>
                    </div>
                  </div>
                  <Link href="/recommendations">
                    <motion.button 
                      className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start de Wizard</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}

            {loading ? (
                 <motion.div 
                 className="flex animate-pulse flex-col overflow-hidden rounded-2xl border-2 border-border-light bg-foreground-light p-6 dark:border-border-dark dark:bg-foreground-dark"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               >
                 <div className="mb-3 h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
                 <div className="mb-5 flex flex-col gap-2">
                   <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                   <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                 </div>
               </motion.div>
            ) : filteredModules.length === 0 ? (
                <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">Geen modules gevonden.</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {filteredModules.map((module: Module, index: number) => (
                  <motion.div
                    key={module.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border-light bg-foreground-light shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className="flex grow flex-col p-6">
                      <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                        {module.name}
                      </h3>
                      <p className="mb-5 grow text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark line-clamp-3">
                        {module.shortdescription}
                      </p>
                      
                      {/* Tags */}
                      <div className="mb-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                          {module.studycredit} ECTS
                        </span>
                        {module.location && (
                           <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                           {module.location}
                         </span> 
                        )}
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${module.language === 'English' ? 'bg-green-500/10 text-green-500 dark:bg-green-400/10 dark:text-green-400' : 'bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-400'}`}>
                          {module.language || 'Unknown'}
                        </span>
                      </div>
                      
                      {/* AI Recommendation indicator */}
                      {module.isRecommended && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 border border-primary/20">
                            <span className="material-symbols-outlined text-xl text-primary">
                            auto_awesome
                            </span>
                            <div>
                              <p className="text-xs font-bold text-primary">Aanbevolen voor jou</p>
                              <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                                Op basis van jouw voorkeuren
                              </p>
                            </div>
                        </div>
                      )}
                      
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
            </div>
            )}
        

          {/* Pagination */}
          <motion.div 
            className="mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {/* Pagination UI kept for visual structure, functionality dependent on backend support which is currently all-fetch */}
             <button
              className="flex size-10 items-center justify-center rounded-lg border-2 border-border-light bg-foreground-light text-text-secondary-light transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:hover:scale-100 dark:border-border-dark dark:bg-foreground-dark dark:text-text-secondary-dark"
              disabled
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="flex size-10 items-center justify-center rounded-lg border-2 border-primary bg-primary text-white shadow-lg shadow-primary/50 text-sm font-semibold transition-all duration-300 hover:scale-110">
                1
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
