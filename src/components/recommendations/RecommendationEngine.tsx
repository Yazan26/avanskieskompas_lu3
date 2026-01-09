'use client';

import React, { useState } from 'react';
import { RecommendationForm } from './RecommendationForm';
import { RecommendationResultCard } from './RecommendationResultCard';
import { fetchRecommendations } from '../../services/recommendationService';
import { RecommendedModule } from '../../types/recommendations';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';

export const RecommendationEngine: React.FC = () => {
  const [results, setResults] = useState<RecommendedModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (interests: string, location: string) => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const data = await fetchRecommendations(interests, location);
      setResults(data);
      setHasSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong while fetching recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-avans-red" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          AI Module Recommender
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tell us about your interests and career goals, and our AI will recommend the perfect modules for you.
        </p>
      </div>

      <div className="mb-12">
        <RecommendationForm onSearch={handleSearch} isLoading={loading} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center justify-center mb-8"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {results.length > 0 && (
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
                Recommended Modules
            </motion.h2>
        )}
        
        <AnimatePresence>
          {results.map((module, index) => (
            <RecommendationResultCard key={`${module.name}-${index}`} module={module} index={index} />
          ))}
        </AnimatePresence>

        {hasSearched && !loading && results.length === 0 && !error && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
                <p className="text-lg">No matching modules found based on your criteria.</p>
                <p className="text-sm">Try broadening your interests or changing the location.</p>
            </motion.div>
        )}
      </div>
    </div>
  );
};
