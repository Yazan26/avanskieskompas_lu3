'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '@/services/userService';

interface ModuleDetailProps {
  module: ModuleDetail;
}

interface ModuleDetail {
  _id: string;
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
  module_tags?: string | string[];
  period?: string;
  start_date?: string;
  estimated_difficulty?: number;
  popularity_score?: number;
  available_spots?: number;
  reviews?: unknown[];
}

export default function ModuleDetailClient({ module }: ModuleDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  // Parse tags
  let tags: string[] = [];
  if (Array.isArray(module.module_tags)) {
    tags = module.module_tags;
  } else if (typeof module.module_tags === 'string') {
    tags = module.module_tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  useEffect(() => {
    const checkAuthAndSaved = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile) {
          setIsLoggedIn(true);
          // Check if this module is in the user's saved recommendations
          if (profile.recommendations && profile.recommendations.includes(module.id)) {
            setIsSaved(true);
          }
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndSaved();
  }, [module.id]);

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      // Redirect to login
      window.location.href = '/login?redirect=/browse/' + module.id;
      return;
    }

    try {
      if (isSaved) {
        await userService.removeRecommendation(module.id);
        setIsSaved(false);
      } else {
        await userService.addRecommendation(module.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to update favorite', error);
      alert('Er ging iets mis. Probeer het opnieuw.');
    }
  };

  // Generate difficulty stars
  const renderDifficulty = (level: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= level ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Format date nicely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const startDate = formatDate(module.start_date);

  return (
    <section className="py-6 md:py-10">
      {/* Hero Section with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 md:p-10"
      >
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-accent/10 blur-2xl" />

        {/* Breadcrumbs */}
        <div className="relative mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-medium text-text-muted-light transition-colors hover:text-primary dark:text-text-muted-dark"
          >
            Home
          </Link>
          <span className="text-text-muted-light dark:text-text-muted-dark">/</span>
          <Link
            href="/browse"
            className="font-medium text-text-muted-light transition-colors hover:text-primary dark:text-text-muted-dark"
          >
            Browse VKM
          </Link>
          <span className="text-text-muted-light dark:text-text-muted-dark">/</span>
          <span className="font-semibold text-text-light dark:text-text-dark">
            {module.name}
          </span>
        </div>

        {/* Module Title and Meta */}
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-3xl font-black leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl lg:text-5xl"
            >
              {module.name}
            </motion.h1>

            {/* Badges Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              {/* EC Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-lg">school</span>
                {module.studycredit} EC
              </span>

              {/* Location */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <span className="material-symbols-outlined text-lg">location_on</span>
                {module.location}
              </span>

              {/* Level */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <span className="material-symbols-outlined text-lg">trending_up</span>
                {module.level || 'HBO-Bachelor'}
              </span>

              {/* Start Date */}
              {startDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:bg-green-500/20 dark:text-green-400">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Start: {startDate}
                </span>
              )}
            </motion.div>
          </div>

          {/* Code Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/80"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
              Module Code
            </span>
            <span className="text-2xl font-black text-primary">{module.id}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Short Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border-light bg-card-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Beschrijving
              </h2>
            </div>
            <p className="text-base leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
              {module.shortdescription || module.description?.slice(0, 300)}
            </p>
          </motion.div>

          {/* Full Description - Expandable */}
          {module.description && module.description !== module.shortdescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border-light bg-card-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark"
            >
              <button
                onClick={() => setShowContent(!showContent)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
                    <span className="material-symbols-outlined text-accent">article</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                    Volledige Inhoud
                  </h2>
                </div>
                <motion.span
                  animate={{ rotate: showContent ? 180 : 0 }}
                  className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark"
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                      {module.description}
                    </div>
                    {module.content && (
                      <div className="mt-4 border-t border-border-light pt-4 dark:border-border-dark">
                        <h3 className="mb-2 font-semibold text-text-light dark:text-text-dark">Inhoud</h3>
                        <div className="whitespace-pre-wrap text-base leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                          {module.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Learning Outcomes - Expandable */}
          {module.learningoutcomes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border-light bg-card-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark"
            >
              <button
                onClick={() => setShowLearning(!showLearning)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-green-500/10">
                    <span className="material-symbols-outlined text-green-500">emoji_objects</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                    Leerdoelen
                  </h2>
                </div>
                <motion.span
                  animate={{ rotate: showLearning ? 180 : 0 }}
                  className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark"
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {showLearning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                      {module.learningoutcomes}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Tags Section */}
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border-light bg-card-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <span className="material-symbols-outlined text-amber-500">sell</span>
                </div>
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Tags & Onderwerpen
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.03 }}
                    className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Quick Facts Card */}
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark">
              <h3 className="mb-4 text-lg font-bold text-text-light dark:text-text-dark">
                Module Details
              </h3>

              <div className="flex flex-col gap-4">
                {/* EC */}
                <div className="flex items-center justify-between rounded-xl bg-primary/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">school</span>
                    <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Studiepunten
                    </span>
                  </div>
                  <span className="text-lg font-bold text-primary">{module.studycredit} EC</span>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between rounded-xl bg-purple-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">trending_up</span>
                    <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Niveau
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {module.level || 'HBO'}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between rounded-xl bg-blue-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">location_on</span>
                    <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Locatie
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {module.location}
                  </span>
                </div>

                {/* Difficulty */}
                {module.estimated_difficulty && (
                  <div className="flex items-center justify-between rounded-xl bg-amber-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500">speed</span>
                      <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        Moeilijkheid
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderDifficulty(module.estimated_difficulty)}
                    </div>
                  </div>
                )}

                {/* Popularity */}
                {module.popularity_score !== undefined && (
                  <div className="flex items-center justify-between rounded-xl bg-green-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-500">trending_up</span>
                      <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        Populariteit
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {module.popularity_score}
                    </span>
                  </div>
                )}

                {/* Available Spots */}
                {module.available_spots !== undefined && (
                  <div className="flex items-center justify-between rounded-xl bg-teal-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-500">group</span>
                      <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        Beschikbaar
                      </span>
                    </div>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      {module.available_spots} plekken
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl"
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                Aanmelden voor module
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 text-base font-bold transition-all ${
                  isSaved
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light bg-card-light text-text-secondary-light hover:border-primary hover:text-primary dark:border-border-dark dark:bg-card-dark dark:text-text-secondary-dark'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isSaved ? 'favorite' : 'favorite_border'}
                </span>
                {isLoading ? 'Laden...' : isSaved ? 'Opgeslagen' : 'Opslaan in favorieten'}
              </motion.button>

              {!isLoggedIn && !isLoading && (
                <p className="text-center text-xs text-text-muted-light dark:text-text-muted-dark">
                  <Link href="/login" className="text-primary hover:underline">
                    Log in
                  </Link>{' '}
                  om modules op te slaan
                </p>
              )}
            </div>

            {/* Share Card */}
            <div className="rounded-2xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
              <h4 className="mb-3 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
                Deel deze module
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-400"
                >
                  <span className="material-symbols-outlined text-xl">link</span>
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(module.name)}&body=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-400"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
