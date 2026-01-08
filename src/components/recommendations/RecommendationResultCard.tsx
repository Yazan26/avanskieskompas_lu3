import React from 'react';
import { RecommendedModule } from '../../types/recommendations';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Tag } from 'lucide-react';

interface RecommendationResultCardProps {
  module: RecommendedModule;
  index: number;
}

export const RecommendationResultCard: React.FC<RecommendationResultCardProps> = ({ module, index }) => {
  const matchPercentage = Math.round(module.final_score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{module.name}</h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-1 text-avans-red" />
            {module.location}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-2xl font-bold ${matchPercentage > 80 ? 'text-green-500' : matchPercentage > 50 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {matchPercentage}%
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Match</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {module.explanation.map((keyword, idx) => (
            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              <Tag className="w-3 h-3 mr-1" />
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {module.constraint_reasons && (Object.keys(module.constraint_reasons).length > 0) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30">
          <p className="font-semibold flex items-center mb-1">
             <CheckCircle className="w-4 h-4 mr-1" /> Note:
          </p>
          <ul className="list-disc list-inside">
             {module.constraint_reasons.location && <li>{module.constraint_reasons.location}</li>}
             {module.constraint_reasons.module_tags && <li>{module.constraint_reasons.module_tags}</li>}
          </ul>
        </div>
      )}
    </motion.div>
  );
};
