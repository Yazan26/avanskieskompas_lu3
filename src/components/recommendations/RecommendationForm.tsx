import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationFormProps {
  onSearch: (interests: string, location: string) => void;
  isLoading: boolean;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({ onSearch, isLoading }) => {
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('Any');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.trim()) {
      onSearch(interests, location);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="mb-6">
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe your interests
        </label>
        <textarea
          id="interests"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-avans-red focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-base min-h-[120px] resize-y"
          placeholder="e.g. I am interested in AI and Data Science..."
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Preferred Location
        </label>
        <div className="flex flex-wrap gap-4">
          {['Any', 'Breda', 'Den Bosch'].map((loc) => (
            <label key={loc} className="relative cursor-pointer group">
              <input
                type="radio"
                name="location"
                value={loc}
                checked={location === loc}
                onChange={(e) => setLocation(e.target.value)}
                className="peer sr-only"
              />
              <div className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all peer-checked:bg-avans-red peer-checked:text-white peer-checked:border-avans-red hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm">
                {loc}
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !interests.trim()}
        className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-gradient-to-r from-avans-red to-red-600 text-white font-bold text-lg hover:from-red-600 hover:to-red-700 transform transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Finding Matches...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Find Matching Modules
          </>
        )}
      </button>
    </motion.form>
  );
};
