'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  BarChart, 
  Tag, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  BrainCircuit,
  Sliders,
  RefreshCw,
  Settings,
  ArrowRight
} from 'lucide-react';
import { fetchRecommendations, RecommendationWeights } from '../../services/recommendationService';
import { RecommendedModule } from '../../types/recommendations';
import { RecommendationResultCard } from './RecommendationResultCard';

// Available Tags
const AVAILABLE_TAGS = [
  'python', 'data', 'ai', 'machine learning', 'marketing', 'design', 
  'finance', 'management', 'duurzaamheid', 'gezondheid', 'communicatie',
  'onderzoek', 'programmeren', 'biologie', 'chemie', 'recht'
];

interface Step {
    id: string;
    title: string;
    icon: React.ElementType;
    description: string;
}

const STEPS: Step[] = [
  { id: 'intro', title: 'Start', icon: Sparkles, description: 'Begin jouw reis' },
  { id: 'interests', title: 'Interesses', icon: BookOpen, description: 'Wat wil je leren?' },
  { id: 'location', title: 'Locatie', icon: MapPin, description: 'Waar wil je studeren?' },
  { id: 'filters', title: 'Eisen', icon: BarChart, description: 'Studiepunten & Niveau' },
  { id: 'tags', title: 'Tags', icon: Tag, description: 'Specifieke onderwerpen' },
  // 'weights' is now optional/hidden logic, not a main step unless advanced is toggled
  { id: 'results', title: 'Resultaten', icon: Check, description: 'Jouw matches' },
];

export const RecommendationWizard: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendedModule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form State
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('any');
  const [minEc, setMinEc] = useState(0);
  const [maxDifficulty, setMaxDifficulty] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [weights, setWeights] = useState<RecommendationWeights>({
    text_similarity: 0.7,
    location: 0.4,
    tags: 0.3,
    difficulty: 0.2,
    popularity: 0.1
  });

  const currentStep = STEPS[currentStepIndex];

  // Logic to handle next/back
  const handleNext = async () => {
    // If we are at the last input step (Tags), decide where to go
    if (currentStep.id === 'tags') {
        if (showAdvanced) {
            // If advanced mode is on, we'd theoretically show weights here. 
            // For this design, let's show weights AS a modal or collapsible IN the Tags or Review step?
            // Actually, let's just trigger search if advanced is OFF.
            // If advanced is ON, we could have an extra step, but simpler: 
            // Let "Weights" be a visible section in the "Filters" or "Tags" step, or a separate modal.
            // Let's stick to the prompt's "finetuning... should be optional". 
            // I'll add a specific "Review & Adjust" step if advanced is on? 
            // Or just allow searching directly.
            // Let's treat 'results' as the destination.
            await handleSearch();
        } else {
            await handleSearch();
        }
    } else if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const locationVal = location === 'any' ? '' : location;
      const data = await fetchRecommendations(interests, locationVal, minEc, maxDifficulty, selectedTags, weights);
      setResults(data);
      // Jump to results step (last one)
      setCurrentStepIndex(STEPS.length - 1);
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const inputVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
  };

  // Render content logic
  const renderContent = () => {
      switch (currentStep.id) {
          case 'intro':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center space-y-8 max-w-2xl mx-auto">
                      <div className="relative inline-block">
                          <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                          <BrainCircuit className="w-24 h-24 text-avans-red relative z-10 mx-auto" strokeWidth={1.5} />
                      </div>
                      
                      <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-avans-red to-red-600">
                            Avans Kieskompas AI
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Vind de perfecte keuzemodule die past bij jouw ambities. 
                            <br className="hidden md:block"/>
                            Onze AI analyseert jouw interesses en matcht je met het beste aanbod.
                        </p>
                      </div>
                      
                      <button 
                          onClick={handleNext}
                          className="group relative px-8 py-4 bg-avans-red text-white rounded-full font-bold text-lg shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 overflow-hidden"
                      >
                          <span className="relative z-10 flex items-center gap-2">
                              Start de Wizard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-avans-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                  </motion.div>
              );

          case 'interests':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl mx-auto w-full">
                      <div className="space-y-2">
                          <label className="text-3xl font-bold text-gray-900 dark:text-white block">
                              Wat wil je leren?
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                              Vertel ons over je interesses, hobby's of carrièreplannen. Hoe meer details, hoe beter de match.
                          </p>
                      </div>
                      <div className="relative group">
                          <textarea
                              value={interests}
                              onChange={(e) => setInterests(e.target.value)}
                              className="w-full h-48 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none text-lg leading-relaxed group-hover:border-gray-200 dark:group-hover:border-gray-700"
                              placeholder="Ik ben geïnteresseerd in..."
                              autoFocus
                          />
                          <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded-md">
                              {interests.length} karakters
                          </div>
                      </div>
                  </motion.div>
              );
        
          case 'location':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 max-w-2xl mx-auto w-full">
                      <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Voorkeurslocatie</h2>
                          <p className="text-gray-500">Kies een stad waar je de minor wilt volgen.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {['Any', 'Breda', 'Den Bosch', 'Tilburg'].map((loc) => {
                              const isSelected = location === loc.toLowerCase();
                              return (
                                  <motion.button
                                      key={loc}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => setLocation(loc.toLowerCase())}
                                      className={`p-6 rounded-2xl border-2 text-left flex items-start gap-4 transition-all duration-200
                                          ${isSelected 
                                              ? 'border-avans-red bg-red-50/50 dark:bg-red-900/10 shadow-lg shadow-red-500/10' 
                                              : 'border-gray-100 dark:border-gray-800 hover:border-red-200 hover:bg-white dark:hover:bg-gray-800'
                                          } bg-white dark:bg-gray-900`}
                                  >
                                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                          ${isSelected ? 'border-avans-red' : 'border-gray-300'}`}>
                                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-avans-red" />}
                                      </div>
                                      <div>
                                          <span className="block text-lg font-bold text-gray-900 dark:text-white">
                                              {loc === 'Any' ? 'Geen voorkeur' : loc}
                                          </span>
                                          <span className="text-sm text-gray-500 dark:text-gray-400">
                                              {loc === 'Any' ? 'Toon aanbod van alle locaties' : `Toon aanbod in ${loc}`}
                                          </span>
                                      </div>
                                  </motion.button>
                              );
                          })}
                      </div>
                  </motion.div>
              );

          case 'filters':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 max-w-2xl mx-auto w-full">
                      <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Jouw Eisen</h2>
                          <p className="text-gray-500">Filter modules op studiepunten en moeilijkheid.</p>
                      </div>

                      {/* EC Slider */}
                      <div className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                          <div className="flex justify-between items-end">
                              <div>
                                  <label className="font-bold text-xl block mb-1">Studiepunten (EC)</label>
                                  <span className="text-sm text-gray-500">Minimaal aantal EC</span>
                              </div>
                              <div className="text-3xl font-bold text-avans-red font-mono">{minEc} EC</div>
                          </div>
                          <input 
                              type="range" min="0" max="30" step="5" 
                              value={minEc} 
                              onChange={(e) => setMinEc(parseInt(e.target.value))}
                              className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-avans-red focus:ring-2 focus:ring-red-500/20"
                          />
                          <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <span>Geen min.</span>
                              <span>15 EC</span>
                              <span>30 EC</span>
                          </div>
                      </div>

                      {/* Difficulty */}
                      <div className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                           <div className="flex justify-between items-end">
                              <div>
                                  <label className="font-bold text-xl block mb-1">Moeilijkheidsgraad</label>
                                  <span className="text-sm text-gray-500">Maximaal niveau</span>
                              </div>
                              <div className="text-3xl font-bold text-avans-red font-mono">Niveau {maxDifficulty}</div>
                          </div>
                          <input 
                              type="range" min="1" max="5" step="1" 
                              value={maxDifficulty} 
                              onChange={(e) => setMaxDifficulty(parseInt(e.target.value))}
                              className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-avans-red focus:ring-2 focus:ring-red-500/20"
                          />
                           <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <span>Beginner</span>
                              <span>Expert</span>
                          </div>
                      </div>
                  </motion.div>
              );

          case 'tags':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 max-w-2xl mx-auto w-full">
                      <div className="space-y-2">
                           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Interessante Themen</h2>
                           <p className="text-gray-500">Selecteer optioneel extra onderwerpen.</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                          {AVAILABLE_TAGS.map(tag => {
                              const isSelected = selectedTags.includes(tag);
                              return (
                                  <motion.button
                                      key={tag}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => toggleTag(tag)}
                                      className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2
                                          ${isSelected
                                              ? 'bg-avans-red border-avans-red text-white shadow-md shadow-red-500/20'
                                              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-red-200'}`}
                                  >
                                      {tag}
                                  </motion.button>
                              );
                          })}
                      </div>

                      {/* Advanced Settings Toggle */}
                      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                           <button 
                               onClick={() => setShowAdvanced(!showAdvanced)}
                               className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium text-sm"
                           >
                               <Settings className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
                               {showAdvanced ? 'Verberg geavanceerde instellingen' : 'Toon geavanceerde instellingen (Weging)'}
                           </button>

                           <AnimatePresence>
                               {showAdvanced && (
                                   <motion.div 
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: "auto", opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                   >
                                       <div className="pt-6 grid gap-6">
                                            <p className="text-sm text-gray-400">Bepaal hoe belangrijk elke factor is voor de AI.</p>
                                           {[
                                               { key: 'text_similarity', label: 'Tekstovereenkomst' },
                                               { key: 'location', label: 'Locatie' },
                                               { key: 'tags', label: 'Tags' },
                                               { key: 'difficulty', label: 'Moeilijkheid' },
                                               { key: 'popularity', label: 'Populariteit' }
                                           ].map(({ key, label }) => (
                                               <div key={key} className="space-y-2">
                                                   <div className="flex justify-between text-sm font-medium">
                                                       <span>{label}</span>
                                                       <span className="text-avans-red font-mono">{(weights[key as keyof RecommendationWeights] * 100).toFixed(0)}%</span>
                                                   </div>
                                                   <input 
                                                       type="range" min="0" max="1" step="0.1"
                                                       value={weights[key as keyof RecommendationWeights]}
                                                       onChange={(e) => setWeights(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                                                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-avans-red"
                                                   />
                                               </div>
                                           ))}
                                       </div>
                                   </motion.div>
                               )}
                           </AnimatePresence>
                      </div>
                  </motion.div>
              );

          case 'results':
              return (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-4xl mx-auto space-y-8">
                       <div className="text-center space-y-2">
                          <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                              <Sparkles className="w-8 h-8 text-avans-red" />
                              Aanbevolen Modules
                          </h2>
                          <p className="text-gray-500">Gebaseerd op "{interests.substring(0, 30)}..."</p>
                      </div>

                      {loading ? (
                          <div className="flex flex-col items-center justify-center py-20">
                              <div className="relative">
                                  <div className="w-16 h-16 border-4 border-gray-200 border-t-avans-red rounded-full animate-spin"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <BrainCircuit className="w-6 h-6 text-avans-red/50" />
                                  </div>
                              </div>
                              <p className="mt-6 text-lg font-medium text-gray-500 animate-pulse">AI zoekt de beste matches...</p>
                          </div>
                      ) : error ? (
                          <div className="p-8 bg-red-50 text-red-700 rounded-3xl border border-red-100 text-center space-y-4">
                              <p className="font-semibold">{error}</p>
                              <button onClick={handleSearch} className="px-6 py-2 bg-white rounded-full text-red-600 font-bold shadow-sm hover:shadow-md transition-all">Probeer Opnieuw</button>
                          </div>
                      ) : results.length === 0 ? (
                          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300">
                              <p className="text-xl text-gray-600 font-medium">Geen modules gevonden.</p>
                              <p className="text-gray-400 mb-6">Probeer je zoekopdracht of filters aan te passen.</p>
                              <button onClick={() => setCurrentStepIndex(1)} className="text-avans-red font-bold hover:underline">
                                  Wijzig filters
                              </button>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {results.map((module, idx) => (
                                  <RecommendationResultCard key={idx} module={module} index={idx} />
                              ))}
                              
                              <div className="flex justify-center pt-12">
                                  <button 
                                      onClick={() => setCurrentStepIndex(0)} 
                                      className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full hover:border-avans-red hover:text-avans-red transition-colors font-bold text-gray-600 dark:text-gray-300"
                                  >
                                      <RefreshCw className="w-4 h-4" />
                                      Opnieuw Beginnen
                                  </button>
                              </div>
                          </div>
                      )}
                  </motion.div>
              );
      }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Progress Dots (Only if not intro/results) */}
        {currentStep.id !== 'intro' && (
            <div className="w-full max-w-xl mb-12 flex justify-between items-center px-4">
                 {STEPS.filter(s => s.id !== 'intro' && s.id !== 'results').map((step, idx) => {
                     // Determine index relative to filtered list
                     const actualIdx = STEPS.indexOf(step);
                     const isActive = currentStepIndex === actualIdx;
                     const isPast = currentStepIndex > actualIdx;

                     return (
                         <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                             <div className={`w-3 h-3 rounded-full transition-all duration-300 
                                 ${isActive ? 'bg-avans-red scale-125 ring-4 ring-red-100 dark:ring-red-900/30' : 
                                   isPast ? 'bg-avans-red/40' : 'bg-gray-200 dark:bg-gray-700'}`} 
                             />
                             {isActive && (
                                 <motion.span 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="absolute -bottom-6 text-xs font-bold text-avans-red whitespace-nowrap"
                                 >
                                     {step.title}
                                 </motion.span>
                             )}
                         </div>
                     );
                 })}
                 {/* Connecting Line */}
                 <div className="absolute top-[13px] left-0 w-full h-[2px] bg-gray-100 dark:bg-gray-800 -z-10 mx-4 max-w-[calc(100%-2rem)]">
                     <motion.div 
                        className="h-full bg-avans-red transition-all duration-300 ease-out"
                        style={{ width: `${Math.max(0, (currentStepIndex - 1) / (STEPS.length - 3)) * 100}%` }}
                     />
                 </div>
            </div>
        )}

        {/* Main Content Area */}
        <div className="w-full relative z-10">
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>

        {/* Navigation Footer (Fixed at bottom or relative) */}
        {currentStep.id !== 'intro' && currentStep.id !== 'results' && !loading && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex items-center gap-6 z-20"
             >
                 <button
                    onClick={handleBack}
                    className="p-4 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                 >
                     <ChevronLeft className="w-6 h-6" />
                 </button>
                 
                 <button 
                    onClick={handleNext}
                    disabled={currentStep.id === 'interests' && interests.length < 3}
                    className="group relative px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                 >
                     <span className="flex items-center gap-2">
                        {currentStep.id === 'tags' ? 'Toon Resultaten' : 'Volgende'}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </span>
                 </button>
             </motion.div>
        )}
    </div>
  );
};
