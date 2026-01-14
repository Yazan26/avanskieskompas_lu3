'use client';

import React, { useState } from 'react';
import { RecommendedModule } from '../../types/recommendations';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';

interface RecommendationResultCardProps {
  module: RecommendedModule;
  index: number;
}

/**
 * Helper function to render markdown-like text with bold formatting
 * Converts **text** to styled spans
 */
function renderReasoningText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export const RecommendationResultCard: React.FC<RecommendationResultCardProps> = ({ module, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const matchPercentage = Math.round(module.final_score * 100);
  
  // Determine match quality tier for visual styling
  const getMatchTier = () => {
    if (matchPercentage >= 70) return { label: 'Uitstekend', color: 'emerald', icon: Award };
    if (matchPercentage >= 50) return { label: 'Sterk', color: 'blue', icon: Sparkles };
    if (matchPercentage >= 30) return { label: 'Goed', color: 'amber', icon: TrendingUp };
    return { label: 'Verken', color: 'slate', icon: BookOpen };
  };
  
  const matchTier = getMatchTier();
  
  // Get top 3 most important reasoning items for preview
  const previewReasoning = module.detailed_reasoning?.slice(0, 3) || [];
  const remainingReasoning = module.detailed_reasoning?.slice(3) || [];
  const hasMoreReasoning = remainingReasoning.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Top accent bar based on match tier */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          matchTier.color === 'emerald' ? 'from-emerald-400 to-teal-500' :
          matchTier.color === 'blue' ? 'from-blue-400 to-indigo-500' :
          matchTier.color === 'amber' ? 'from-amber-400 to-orange-500' :
          'from-slate-400 to-gray-500'
        }`}
      />
      
      {/* Main content */}
      <div className="p-6">
        {/* Header row */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-avans-red transition-colors">
              {module.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {module.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-1 text-avans-red" />
                  {module.location}
                </div>
              )}
              {module.studycredit && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {module.studycredit} EC
                </span>
              )}
              {module.estimated_difficulty && (
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  Niveau {module.estimated_difficulty.toFixed(1)}/5
                </span>
              )}
            </div>
          </div>
          
          {/* Match score badge */}
          <div className="flex flex-col items-center">
            <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl ${
              matchTier.color === 'emerald' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
              matchTier.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
              matchTier.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
              'bg-gradient-to-br from-slate-400 to-gray-500'
            } shadow-lg`}>
              <span className="text-2xl font-bold text-white">
                {matchPercentage}
              </span>
              <span className="absolute bottom-0.5 text-[10px] text-white/80">%</span>
            </div>
            <span className={`mt-1 text-xs font-medium ${
              matchTier.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
              matchTier.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              matchTier.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
              'text-slate-600 dark:text-slate-400'
            }`}>
              {matchTier.label} Match
            </span>
          </div>
        </div>

        {/* Detailed Reasoning Section */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-avans-red" />
            Waarom deze module?
          </h4>
          
          {/* Preview reasoning items */}
          <ul className="space-y-2">
            {previewReasoning.map((reason, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + idx * 0.05 }}
                className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-1"
              >
                {renderReasoningText(reason)}
              </motion.li>
            ))}
          </ul>
          
          {/* Expandable section for more reasoning */}
          <AnimatePresence>
            {isExpanded && remainingReasoning.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {remainingReasoning.map((reason, idx) => (
                  <motion.li 
                    key={idx + 3}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-1"
                  >
                    {renderReasoningText(reason)}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          
          {/* Show more/less button */}
          {hasMoreReasoning && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm font-medium text-avans-red hover:text-avans-red/80 transition-colors mt-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Minder tonen
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {remainingReasoning.length} meer redenen tonen
                </>
              )}
            </button>
          )}
        </div>

        {/* Keywords/Tags section (collapsed) */}
        {module.explanation && module.explanation.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-1.5">
              {module.explanation.slice(0, 6).map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {keyword}
                </span>
              ))}
              {module.explanation.length > 6 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                  +{module.explanation.length - 6} meer
                </span>
              )}
            </div>
          </div>
        )}

        {/* Constraint warnings if any */}
        {module.constraint_reasons && Object.keys(module.constraint_reasons).length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-900/30">
            <ul className="space-y-1">
              {module.constraint_reasons.location && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">ℹ️</span>
                  {module.constraint_reasons.location}
                </li>
              )}
              {module.constraint_reasons.module_tags && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">ℹ️</span>
                  {module.constraint_reasons.module_tags}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Action row */}
        <div className="mt-5 flex items-center justify-between">
          {/* Score breakdown tooltip hint */}
          {module.score_breakdown && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Score: inhoud {Math.round(module.score_breakdown.content_similarity * 100)}%
              {module.score_breakdown.location_match ? ` • locatie +${Math.round(module.score_breakdown.location_match * 100)}%` : ''}
              {module.score_breakdown.tags_match ? ` • tags +${Math.round(module.score_breakdown.tags_match * 100)}%` : ''}
            </div>
          )}
          
          <a 
            href={`/browse/${module.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-avans-red hover:bg-avans-red/90 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Bekijk module
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
