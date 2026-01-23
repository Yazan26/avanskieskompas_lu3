'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
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
  startMonthYear?: string;
}

export default function BrowsePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [savedModules, setSavedModules] = useState<number[]>([]);


  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [tagSearch, setTagSearch] = useState(''); // Local search for tags


  // Filter keys matching backend expectation
  const [activeFilters, setActiveFilters] = useState<{
    locations: string[];
    ecs: number[];
    levels: string[];
    startMonths: string[];
    difficulty: number[];
    spotsRange: [number, number];
    selectedTags: string[];
    interestsScoreRange: [number, number];
    popularityScoreRange: [number, number];
    search: string;
    sort: string;
  }>({
    locations: [],
    ecs: [],
    levels: [],
    startMonths: [],
    difficulty: [],
    spotsRange: [0, 100],
    selectedTags: [],
    interestsScoreRange: [0, 1],
    popularityScoreRange: [0, 500],
    search: '',
    sort: 'recommended'
  });

  const [allModules, setAllModules] = useState<Module[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // Handle responsive filter visibility
  useEffect(() => {
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setShowFilters(true);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Fetch modules with current filters
  const fetchModules = async () => {
    setLoading(true);
    try {
      // Fetch all modules without filters to enable client-side filtering
      const [modulesData, userProfile] = await Promise.all([
        moduleService.getAllModules({}),
        userService.getProfile().catch(() => null)
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

      const mappedModules = modulesData.map((m: Module) => {
          let startMonthYear = undefined;
          if (m.start_date) {
              const date = new Date(m.start_date);
              if (!isNaN(date.getTime())) {
                  startMonthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
              }
          }

          return {
            ...m,
            saved: savedIds.includes(m.id),
            isRecommended: savedIds.includes(m.id),
            period: m.period || 'Period 1-4',
            language: m.language || (m.description && m.description.includes('Dutch') ? 'Dutch' : 'English'),
            // Ensure numeric values for filtering
            available_spots: m.available_spots || 0,
            estimated_difficulty: m.estimated_difficulty || 0,
            interests_match_score: m.interests_match_score || 0,
            popularity_score: m.popularity_score || 0,
            // Parse tags if string
            module_tags: typeof m.module_tags === 'string' ? m.module_tags : JSON.stringify(m.module_tags || []),
            startMonthYear
        };
      });

      setAllModules(mappedModules);
      
      // key Extract unique tags and months
      const tags = new Set<string>();
      const months = new Set<string>();
      
      mappedModules.forEach((m: Module) => {
        if (m.module_tags) {
           try {
             // Handle both stringified array or comma separated
             const parsed = m.module_tags.startsWith('[') 
               ? JSON.parse(m.module_tags) 
               : m.module_tags.split(',').map(t => t.trim());
             
             if (Array.isArray(parsed)) {
               parsed.forEach((t: string) => {
                 const cleanTag = t.toLowerCase().trim();
                 if (cleanTag && !['de', 'het', 'een', 'en', 'in', 'op'].includes(cleanTag)) {
                    tags.add(t.trim()); // Keep original case for display? Or normalize? Let's keep trim.
                 }
               });
             }
           } catch (e) { console.warn('Tag parse error', e); }
        }
        if (m.startMonthYear) {
            months.add(m.startMonthYear);
        }
      });
      
      // Sort months chronologically
      const sortedMonths = Array.from(months).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
      });

      setAvailableTags(Array.from(tags).sort());
      setAvailableMonths(sortedMonths);

      applyFilters(mappedModules, activeFilters);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((modules: Module[], filters: typeof activeFilters) => {
      let result = [...modules];

      // Text Search
      if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(m => 
              m.name.toLowerCase().includes(q) || 
              m.shortdescription.toLowerCase().includes(q) ||
              m.description.toLowerCase().includes(q) ||
              m.learningoutcomes.toLowerCase().includes(q) ||
              m.module_tags?.toLowerCase().includes(q)
          );
      }

      // Location
      if (filters.locations.length > 0) {
          result = result.filter(m => filters.locations.some(loc => m.location.includes(loc)));
      }

      // EC
      if (filters.ecs.length > 0) {
          result = result.filter(m => filters.ecs.includes(m.studycredit));
      }

      // Level
      if (filters.levels.length > 0) {
          result = result.filter(m => filters.levels.includes(m.level));
      }

      // Difficulty
      if (filters.difficulty.length > 0) {
          result = result.filter(m => filters.difficulty.includes(m.estimated_difficulty || 0));
      }

      // Available Spots (Range)
      result = result.filter(m => {
          const spots = m.available_spots || 0;
          return spots >= filters.spotsRange[0] && spots <= filters.spotsRange[1];
      });

      // Tags
      if (filters.selectedTags.length > 0) {
          result = result.filter(m => {
             return filters.selectedTags.some(t => m.module_tags?.toLowerCase().includes(t.toLowerCase()));
          });
      }
      
      // Start Date
      if (filters.startMonths.length > 0) {
          result = result.filter(m => m.startMonthYear && filters.startMonths.includes(m.startMonthYear));
      }

      // Score Filters (Interests Query)
      if (filters.interestsScoreRange[0] > 0 || filters.interestsScoreRange[1] < 1) {
          result = result.filter(m => {
              const s = m.interests_match_score || 0;
              return s >= filters.interestsScoreRange[0] && s <= filters.interestsScoreRange[1];
          });
      }

       // Score Filters (Popularity)
      if (filters.popularityScoreRange[0] > 0 || filters.popularityScoreRange[1] < 500) {
          result = result.filter(m => {
              const s = m.popularity_score || 0;
              return s >= filters.popularityScoreRange[0] && s <= filters.popularityScoreRange[1];
          });
      }

      // Sorting
      if (filters.sort === 'recommended') {
          result.sort((a, b) => (Number(b.isRecommended) - Number(a.isRecommended)));
      } else if (filters.sort === 'popularity') {
          result.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
      } else if (filters.sort === 'az') {
          result.sort((a, b) => a.name.localeCompare(b.name));
      }

      setModules(result);
  }, []);
  
  // Update fetch modules to just re-apply filters if we have modules
  useEffect(() => {
     if (allModules.length > 0) {
         applyFilters(allModules, activeFilters);
     }
  }, [activeFilters, allModules, applyFilters]); // Re-run when filters change

  // Debounce search or fetch on effect? 
  // For simplicity, we fetch on mount and when interactions happen.
  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Apply filters handler
  // Removed explicit handler since useEffect handles it, but we can keep it for manual "Apply" buttons if we want to defer state updates?
  // Current implementation updates activeFilters immediately. 
  // If we want a "Apply" button, we should have a separate "pendingFilters" state.
  // For now, let's make it reactive or keep the manual structure.
  // The UI has "Filters toepassen" (Apply Filters).
  // So we should probably use a separate "pendingFilters" state and only commit to "activeFilters" when Apply is clicked?
  // Or just let it be reactive. Reactive is usually better for web. 
  // But the existing UI had a button.
  // Let's make the individual filter inputs update state, and the effect triggers the list update.
  // So the button is redundant or can just scroll to top/confirm.
  const handleApplyFilters = () => {
      // already applied via effect
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!isDesktop) setShowFilters(false);
  };



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

  const updateFilter = (category: keyof typeof activeFilters, value: string | number) => {
    setActiveFilters(prev => {
        // Handle array toggles
        if (Array.isArray(prev[category])) {
            const arr = prev[category] as (string | number)[];
            if (arr.includes(value)) {
                return { ...prev, [category]: arr.filter(item => item !== value) };
            } else {
                return { ...prev, [category]: [...arr, value] };
            }
        }
        // Handle simple value
        return { ...prev, [category]: value };
    });
  };
  
  const setFilterValue = (category: keyof typeof activeFilters, value: unknown) => {
      setActiveFilters(prev => ({ ...prev, [category]: value }));
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
          <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Browse Vrije Keuze Modules
          </h1>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark md:text-lg">
            Verken en filter alle beschikbare VKM&apos;s.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Search input */}
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
              value={activeFilters.search}
              onChange={(e) => setFilterValue('search', e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleApplyFilters(); }}
              className="w-full rounded-xl border-2 border-border-light bg-foreground-light py-3 pl-12 pr-4 text-sm text-text-primary-light shadow-sm outline-none ring-0 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
            />
          </motion.div>

          {/* Sort select */}
          <div className="relative w-full min-w-[200px] sm:w-52">
            <select
              className="w-full appearance-none rounded-xl border-2 border-border-light bg-foreground-light py-3 pl-4 pr-10 text-sm text-text-primary-light shadow-sm outline-none ring-0 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark dark:text-text-primary-dark"
              value={activeFilters.sort}
              onChange={(e) => {
                setActiveFilters(prev => ({ ...prev, sort: e.target.value }));
                // Trigger fetch immediately on sort change? or wait for Apply? Usually sort is immediate.
                // Let's defer to "Apply" or just trigger it. Re-fetching provides better UX for sort.
                // We'll leave it to manual "Apply" or effect if we wanted automatic.
                // For now, let's keep consistency: "Filters toepassen" applies everything.
                // But typically sort is instant. 
                // Let's trigger fetchModules via a small timeout or assume user clicks Apply. 
                // Actually, let's make sort instant by adding it to a useEffect or calling fetch directly.
                // fetchModules(); // Can't call easily here due to state closure or async. 
                // Ideally, useEffect on activeFilters could trigger fetch, but that might be chatty.
                // For this implementation, I'll rely on the "Filters toepassen" button for everything to be safe and explicit.
              }}
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between gap-3 lg:cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="material-symbols-outlined text-primary">
                    filter_alt
                  </span>
                </div>
                <h3 className="text-lg font-bold">Filters</h3>
              </div>
              <span className="material-symbols-outlined text-gray-500 transition-transform lg:hidden"
                style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden lg:!h-auto lg:!opacity-100"
                >
                  <div className="flex flex-col gap-6 text-sm max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Location Filter */}
                     <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Locatie
                        </h4>
                        <div className="flex flex-col gap-2">
                            {['Breda', "Den Bosch", 'Tilburg'].map((loc) => (
                                <label key={loc} className="group flex cursor-pointer items-center gap-x-3 py-2 transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.locations.includes(loc)}
                                        onChange={() => updateFilter('locations', loc)}
                                        className="size-5 cursor-pointer rounded-md border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary"
                                    />
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">{loc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* EC Filter */}
                    <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Studiepunten (EC)
                        </h4>
                        <div className="flex flex-col gap-2">
                            {[15, 30].map((ec) => (
                                <label key={ec} className="group flex cursor-pointer items-center gap-x-3 py-2 transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.ecs.includes(ec)}
                                        onChange={() => updateFilter('ecs', ec)}
                                        className="size-5 cursor-pointer rounded-md border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary"
                                    />
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">{ec} EC</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Level Filter */}
                    <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Niveau
                        </h4>
                        <div className="flex flex-col gap-2">
                            {['NLQF5', 'NLQF6'].map((lvl) => (
                                <label key={lvl} className="group flex cursor-pointer items-center gap-x-3 py-2 transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.levels.includes(lvl)}
                                        onChange={() => updateFilter('levels', lvl)}
                                        className="size-5 cursor-pointer rounded-md border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary"
                                    />
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">{lvl}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {/* Start Date Filter */}
                    {availableMonths.length > 0 && (
                        <div className="filter-section">
                            <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                              Start Datum
                            </h4>
                            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {availableMonths.map((m) => (
                                    <label key={m} className="group flex cursor-pointer items-center gap-x-3 py-2 transition-colors hover:text-primary">
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.startMonths.includes(m)}
                                            onChange={() => updateFilter('startMonths', m)}
                                            className="size-5 cursor-pointer rounded-md border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary"
                                        />
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Difficulty Filter */}
                    <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Moeilijkheid (Sterren)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((d) => (
                                <label key={d} className={`flex size-10 cursor-pointer items-center justify-center rounded-lg border-2 transition-all ${activeFilters.difficulty.includes(d) ? 'border-primary bg-primary text-white' : 'border-border-light hover:border-primary text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark'}`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={activeFilters.difficulty.includes(d)}
                                        onChange={() => updateFilter('difficulty', d)}
                                    />
                                    <span className="font-bold">{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Spots Range */}
                    <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Beschikbare Plaatsen
                        </h4>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                className="w-full rounded-lg border-2 border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
                                placeholder="0"
                                value={activeFilters.spotsRange[0]}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setFilterValue('spotsRange', [val, activeFilters.spotsRange[1]]);
                                }}
                            />
                            <span className="text-text-secondary-light">-</span>
                            <input 
                                type="number" 
                                className="w-full rounded-lg border-2 border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
                                placeholder="100"
                                value={activeFilters.spotsRange[1]}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 100;
                                    setFilterValue('spotsRange', [activeFilters.spotsRange[0], val]);
                                }}
                            />
                        </div>
                    </div>

                    {/* Tags Filter */}
                     <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Tags
                        </h4>
                        <input 
                             type="text" 
                             className="mb-3 w-full rounded-lg border-2 border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
                             placeholder="Zoek tags..."
                             value={tagSearch}
                             onChange={(e) => setTagSearch(e.target.value)}
                        />
                        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                            {availableTags.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase())).map((tag) => (
                                <label key={tag} className="group flex cursor-pointer items-center gap-x-3 py-1 transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.selectedTags.includes(tag)}
                                        onChange={() => updateFilter('selectedTags', tag)}
                                        className="size-4 shrink-0 cursor-pointer rounded border-2 border-border-light bg-transparent text-primary transition-all duration-300 checked:border-primary checked:bg-primary"
                                    />
                                    <span className="line-clamp-1 text-xs transition-transform duration-300 group-hover:translate-x-1">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {/* Optional Scores */}
                     <div className="filter-section">
                        <h4 className="mb-3 font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                          Scores
                        </h4>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-xs text-text-secondary-light">Interesses Match (0.0 - 1.0)</label>
                                <div className="flex items-center gap-2">
                                     <input type="number" step="0.1" min="0" max="1" className="w-full rounded-md border border-border-light bg-transparent px-2 py-1 text-xs dark:border-border-dark" value={activeFilters.interestsScoreRange[0]} onChange={e => setFilterValue('interestsScoreRange', [parseFloat(e.target.value), activeFilters.interestsScoreRange[1]])} />
                                     <span>-</span>
                                     <input type="number" step="0.1" min="0" max="1" className="w-full rounded-md border border-border-light bg-transparent px-2 py-1 text-xs dark:border-border-dark" value={activeFilters.interestsScoreRange[1]} onChange={e => setFilterValue('interestsScoreRange', [activeFilters.interestsScoreRange[0], parseFloat(e.target.value)])} />
                                </div>
                            </div>
                             <div>
                                <label className="mb-1 block text-xs text-text-secondary-light">Populariteit (Score)</label>
                                <div className="flex items-center gap-2">
                                     <input type="number" step="10" className="w-full rounded-md border border-border-light bg-transparent px-2 py-1 text-xs dark:border-border-dark" value={activeFilters.popularityScoreRange[0]} onChange={e => setFilterValue('popularityScoreRange', [parseInt(e.target.value) || 0, activeFilters.popularityScoreRange[1]])} />
                                     <span>-</span>
                                     <input type="number" step="10" className="w-full rounded-md border border-border-light bg-transparent px-2 py-1 text-xs dark:border-border-dark" value={activeFilters.popularityScoreRange[1]} onChange={e => setFilterValue('popularityScoreRange', [activeFilters.popularityScoreRange[0], parseInt(e.target.value) || 500])} />
                                </div>
                            </div>
                        </div>
                    </div>

                  </div>

                  <motion.button
                    onClick={handleApplyFilters}
                    className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Filters toepassen</span>
                    <span className="material-symbols-outlined text-lg">check</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            {!showFilters && (
              <p className="text-xs text-gray-500 text-center lg:hidden">Tik om filters te tonen</p>
            )}
          </div>
        </motion.aside>

        {/* Modules grid */}
        <main className="flex w-full flex-col gap-8">
           {/* CTA Banner logic unchanged */}
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
          ) : modules.length === 0 ? (
            <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">Geen modules gevonden.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {modules.map((module: Module, index: number) => (
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
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 hover:scale-110 ${savedModules.includes(module.id)
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
