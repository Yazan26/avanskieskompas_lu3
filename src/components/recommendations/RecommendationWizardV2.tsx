'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    ArrowRight,
    MapPin,
    BookOpen,
    BarChart2,
    Check,
    ChevronRight,
    Sparkles,
    RefreshCw,
    Settings,
    X,
    AlertCircle,
} from 'lucide-react';

import { fetchRecommendations, RecommendationWeights } from '@/services/recommendationService';
import { RecommendedModule } from '@/types/recommendations';
import { RecommendationResultCard } from './RecommendationResultCard';
import { useTranslation } from '../providers/LanguageProvider';
import { SmartTagSelector } from './SmartTagSelector';
import ALL_TAGS from '../../data/moduleTags.json';

// ------------ TYPES & CONSTANTS ----------------
interface RecommendationsResponse {
    recommendations?: RecommendedModule[];
    _debug?: {
        saveSuccess?: boolean;
        userIdFromMiddleware?: string;
    };
}

// De oude AVAILABLE_TAGS is hier verwijderd. 
// We vertrouwen nu volledig op SmartTagSelector en moduleTags.json.

interface WizardState {
    interests: string;
    location: string;
    minEc: number;
    maxDifficulty: number;
    selectedTags: string[];
    weights: RecommendationWeights;
}

const INITIAL_STATE: WizardState = {
    interests: '',
    location: 'any',
    minEc: 0,
    maxDifficulty: 5,
    selectedTags: [],
    weights: {
        text_similarity: 0.7,
        location: 0.4,
        tags: 0.3,
        difficulty: 0.2,
        popularity: 0.1
    }
};

// Tip: Omdat je useTranslation gebruikt, kun je deze labels later 
// ook via je vertaalbestanden laten lopen!
const LOCATIONS_EN = [
    { id: 'any', label: 'Any location', desc: 'Anywhere in Brabant' },
    { id: 'breda', label: 'Breda', desc: 'Cozy student city' },
    { id: 'den bosch', label: "'s-Hertogenbosch", desc: 'Burgundian & Culture' },
    { id: 'tilburg', label: 'Tilburg', desc: 'Creative & Raw' },
];

const LOCATIONS_NL = [
    { id: 'any', label: 'Geen voorkeur', desc: 'Overal in Brabant' },
    { id: 'breda', label: 'Breda', desc: 'Gezellige studentenstad' },
    { id: 'den bosch', label: "'s-Hertogenbosch", desc: 'Bourgondisch & Cultuur' },
    { id: 'tilburg', label: 'Tilburg', desc: 'Creatief & Rauw' },
];

// ------------ COMPONENT ----------------
export const RecommendationWizardV2: React.FC = () => {
    const { t, language } = useTranslation();
    const LOCATIONS = language === 'nl' ? LOCATIONS_NL : LOCATIONS_EN;

    // Stage Management
    // 0: Intro, 1: Interests, 2: Location, 3: Filters (EC/Diff), 4: Tags, 5: Loading/Results
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1); // For slide animations

    // Data State
    const [formData, setFormData] = useState<WizardState>(INITIAL_STATE);

    // Results State
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<RecommendedModule[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'failed' | null>(null);

    // Advanced Settings Toggle
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Dynamic backgrounds based on step
    const getBgColor = () => {
        switch (step) {
            case 0: return 'bg-white dark:bg-gray-950';        // Intro: Clean
            case 1: return 'bg-red-50 dark:bg-gray-900';       // Interests: Warm
            case 2: return 'bg-blue-50 dark:bg-gray-950';      // Location: Cool
            case 3: return 'bg-gray-50 dark:bg-gray-900';      // Filters: Neutral
            case 4: return 'bg-purple-50 dark:bg-gray-950';    // Tags: Creative
            default: return 'bg-white dark:bg-gray-950';       // Results
        }
    };

    // Handlers
    const nextStep = () => {
        setDirection(1);
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(prev => Math.max(0, prev - 1));
    };

    const handleSearch = async () => {
        setDirection(1);
        setStep(5); // Move to results view immediately (loading state)
        setLoading(true);
        setError(null);
        setSaveStatus(null);

        try {
            const data = await fetchRecommendations(
                formData.interests,
                formData.location === 'any' ? '' : formData.location,
                formData.minEc,
                formData.maxDifficulty,
                formData.selectedTags,
                formData.weights
            );

            // Check debug info for save status (response comes from service which might wrap it, 
            // but service returns response.data.recommendations OR response.data.
            // Let's rely on the fact that if we get an array, it worked.)
            const typedData = data as RecommendedModule[] | RecommendationsResponse;
            if (!Array.isArray(typedData) && typedData._debug?.saveSuccess) {
                setSaveStatus('saved');
            } else if (!Array.isArray(typedData) && typedData._debug?.userIdFromMiddleware) {
                // User was logged in but save failed
                setSaveStatus('failed');
            }

            setResults(Array.isArray(typedData) ? typedData : typedData.recommendations || []);

        } catch (err) {
            console.error(err);
            setError(language === 'nl' ? 'Kan geen aanbevelingen ophalen. Probeer het later opnieuw.' : 'Could not fetch recommendations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const restart = () => {
        setFormData(INITIAL_STATE);
        setStep(0);
        setResults([]);
        setLoading(false);
        setSaveStatus(null);
    };

    // Animation Variants
    const pageVariants: Variants = {
        initial: {
            opacity: 0,
            y: 50,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
        exit: {
            opacity: 0,
            y: -50,
            transition: { duration: 0.3 }
        }
    };

    // RENDER STEPS
    const renderStep = () => {
        switch (step) {
            case 0: // INTRO
                return (
                    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-lg md:max-w-2xl px-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-avans-red/10 p-5 md:p-6 rounded-3xl"
                        >
                            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-avans-red" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                            {t('wizard.findYour')} <span className="text-avans-red">{language === 'nl' ? 'Match' : 'Match'}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                            {t('wizard.introText')}
                        </p>
                        <button
                            onClick={nextStep}
                            className="mt-6 md:mt-8 px-8 py-4 md:px-10 md:py-5 bg-[#E4002B] text-white text-lg md:text-xl font-bold rounded-full hover:scale-105 hover:shadow-2xl shadow-xl shadow-red-500/40 ring-4 ring-red-500/20 transition-all flex items-center gap-3"
                        >
                            {t('wizard.startWizard')} <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                );

            case 1: // INTERESTS
                return (
                    <div className="w-full max-w-2xl px-4 md:px-6 space-y-6 md:space-y-8">
                        <div className="space-y-2">
                            <span className="text-avans-red font-bold uppercase tracking-widest text-xs md:text-sm">{language === 'nl' ? 'Stap 1/4' : 'Step 1/4'}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('wizard.step1Title')}</h2>
                            <p className="text-lg text-gray-500">{t('wizard.step1Subtitle')}</p>
                        </div>

                        <div className="relative">
                            <textarea
                                value={formData.interests}
                                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                placeholder={t('wizard.interestsPlaceholder')}
                                className="w-full h-48 md:h-64 p-6 md:p-8 text-lg md:text-xl font-medium bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2rem] border-0 shadow-lg md:shadow-xl focus:ring-4 focus:ring-avans-red/20 resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all"
                                autoFocus
                            />
                            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-xs md:text-sm font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg">
                                {formData.interests.length} {language === 'nl' ? 'tekens' : 'chars'}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 md:pt-8 gap-4">
                            <button onClick={prevStep} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 text-sm md:text-base transition-colors">{t('common.back')}</button>
                            <button
                                onClick={nextStep}
                                disabled={formData.interests.length < 10}
                                className="px-6 py-3 md:px-8 md:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all flex items-center gap-2 text-sm md:text-base"
                            >
                                {t('common.next')} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                );

            case 2: // LOCATION
                return (
                    <div className="w-full max-w-3xl px-4 md:px-6 space-y-8 md:space-y-12">
                        <div className="space-y-2 text-center">
                            <span className="text-avans-red font-bold uppercase tracking-widest text-xs md:text-sm">{language === 'nl' ? 'Stap 2/4' : 'Step 2/4'}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('wizard.step2Title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {LOCATIONS.map(loc => {
                                const active = formData.location === loc.id;
                                return (
                                    <button
                                        key={loc.id}
                                        onClick={() => setFormData({ ...formData, location: loc.id })}
                                        className={`group relative p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 text-left transition-all duration-300
                                            ${active
                                                ? 'border-avans-red bg-white dark:bg-gray-800 shadow-xl scale-[1.02] z-10'
                                                : 'border-transparent bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <MapPin className={`w-6 h-6 md:w-8 md:h-8 ${active ? 'text-avans-red' : 'text-gray-400'}`} />
                                            {active && <div className="bg-avans-red w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg shadow-red-500/50" />}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-1">{loc.label}</h3>
                                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{loc.desc}</p>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={prevStep} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors">{t('common.back')}</button>
                            <button
                                onClick={nextStep}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2"
                            >
                                {t('common.next')} <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );

            case 3: // FILTERS (EC + Diff)
                return (
                    <div className="w-full max-w-xl px-4 md:px-6 space-y-8 md:space-y-12">
                        <div className="space-y-2">
                            <span className="text-avans-red font-bold uppercase tracking-widest text-xs md:text-sm">{language === 'nl' ? 'Stap 3/4' : 'Step 3/4'}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('wizard.step3Title')}</h2>
                        </div>

                        {/* EC */}
                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-lg md:text-xl font-bold flex items-center gap-3">
                                    <BookOpen className="text-gray-400 w-5 h-5 md:w-6 md:h-6" /> <span className="hidden sm:inline">{language === 'nl' ? 'Minimaal aantal' : 'Minimum'}</span> EC
                                </label>
                                <span className="text-xl md:text-2xl font-mono font-bold text-avans-red">{formData.minEc} EC</span>
                            </div>
                            <input
                                type="range" min="0" max="30" step="5"
                                value={formData.minEc}
                                onChange={(e) => setFormData({ ...formData, minEc: parseInt(e.target.value) })}
                                className="w-full h-3 md:h-4 bg-gray-100 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-avans-red"
                            />
                            <div className="flex justify-between text-xs md:text-sm text-gray-400 font-medium">
                                <span>{language === 'nl' ? 'Maakt niet uit' : 'Any'}</span>
                                <span>30 EC</span>
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-lg md:text-xl font-bold flex items-center gap-3">
                                    <BarChart2 className="text-gray-400 w-5 h-5 md:w-6 md:h-6" /> <span className="hidden sm:inline">{language === 'nl' ? 'Maximaal' : 'Maximum'}</span> {t('profile.level')}
                                </label>
                                <span className="text-xl md:text-2xl font-mono font-bold text-avans-red">{t('profile.level')} {formData.maxDifficulty}</span>
                            </div>
                            <input
                                type="range" min="1" max="5" step="1"
                                value={formData.maxDifficulty}
                                onChange={(e) => setFormData({ ...formData, maxDifficulty: parseInt(e.target.value) })}
                                className="w-full h-3 md:h-4 bg-gray-100 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-avans-red"
                            />
                            <div className="flex justify-between text-xs md:text-sm text-gray-400 font-medium">
                                <span>Beginner (1)</span>
                                <span>Expert (5)</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={prevStep} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors">{t('common.back')}</button>
                            <button
                                onClick={nextStep}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2"
                            >
                                {t('common.next')} <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );

            case 4: // TAGS + WEIGHTS
                return (
                    <div className="w-full max-w-4xl px-4 md:px-6 space-y-8 md:space-y-10">
                        <div className="text-center space-y-2">
                            <span className="text-avans-red font-bold uppercase tracking-widest text-xs md:text-sm">{language === 'nl' ? 'Stap 4/4' : 'Step 4/4'}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('wizard.step4Title')}</h2>
                            <p className="text-lg md:text-xl text-gray-500">{t('wizard.step4Subtitle')}</p>
                        </div>

                        {/* Smart Tag Selector with AI suggestions, search, and pagination */}
                        <SmartTagSelector
                            allTags={ALL_TAGS}
                            selectedTags={formData.selectedTags}
                            onTagsChange={(newTags) => setFormData({ ...formData, selectedTags: newTags })}
                            userInterestText={formData.interests}
                        />

                        {/* WEIGHTS TOGGLE */}
                        <div className="max-w-xl mx-auto pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors p-4"
                            >
                                <Settings className="w-4 h-4" />
                                {showAdvanced ? (language === 'nl' ? 'Verberg geavanceerde instellingen' : 'Hide advanced settings') : (language === 'nl' ? 'Toon geavanceerde wegingen' : 'Show advanced weights')}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-4 md:p-8"
                                    >
                                        <div className="grid gap-4 md:gap-6 mt-2">
                                            {[
                                                { key: 'text_similarity', label: 'Tekstovereenkomst', desc: 'Match op tekst' },
                                                { key: 'location', label: 'Locatie', desc: 'Stad voorkeur' },
                                                { key: 'tags', label: 'Tags', desc: 'Onderwerpen' },
                                                { key: 'difficulty', label: 'Niveau', desc: 'Moeilijkheid' },
                                                { key: 'popularity', label: 'Populariteit', desc: 'Trending' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <div className="sm:w-1/3">
                                                        <span className="font-bold block text-sm">{item.label}</span>
                                                        <span className="text-xs text-gray-500 hidden sm:block">{item.desc}</span>
                                                    </div>
                                                    <div className="flex-1 flex items-center gap-4">
                                                        <input
                                                            type="range" min="0" max="1" step="0.1"
                                                            value={formData.weights[item.key as keyof RecommendationWeights]}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                weights: { ...formData.weights, [item.key]: parseFloat(e.target.value) }
                                                            })}
                                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-avans-red"
                                                        />
                                                        <span className="w-10 text-right font-mono font-bold text-avans-red text-sm">
                                                            {(formData.weights[item.key as keyof RecommendationWeights] * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-between items-center pt-4 md:pt-8 gap-4">
                            <button onClick={prevStep} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors">{t('common.back')}</button>
                            <button
                                onClick={handleSearch}
                                className="px-8 py-4 md:px-12 md:py-5 bg-avans-red text-white text-lg md:text-xl font-bold rounded-full shadow-xl shadow-red-500/20 hover:scale-105 hover:shadow-red-500/40 transition-all flex items-center gap-3"
                            >
                                {t('wizard.findMatches')} <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                            </button>
                        </div>
                    </div>
                );
        }
    };

    // VISUALS: RESULTS VIEW (Separate from Wizard Flow animations)
    if (step === 5) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <button onClick={restart} className="inline-flex items-center gap-2 text-gray-500 hover:text-avans-red transition-colors mb-4">
                            <X className="w-4 h-4" /> {language === 'nl' ? 'Reset filters' : 'Reset filters'}
                        </button>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            {t('wizard.resultsTitle')}
                        </h2>

                        {!saveStatus && (
                            <motion.button
                                onClick={async () => {
                                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                    if (!token) {
                                        setSaveStatus('failed');
                                        return;
                                    }
                                    try {
                                        setLoading(true);
                                        const { saveRecommendations } = await import('../../services/recommendationService');
                                        await saveRecommendations(results, {
                                            interests: formData.interests,
                                            location: formData.location === 'any' ? '' : formData.location,
                                            minEc: formData.minEc,
                                            maxDifficulty: formData.maxDifficulty,
                                            selectedTags: formData.selectedTags,
                                            weights: formData.weights
                                        });
                                        setSaveStatus('saved');
                                    } catch (e) {
                                        console.error(e);
                                        setSaveStatus('failed');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all mb-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="material-symbols-outlined">save</span>
                                {t('wizard.saveToProfile')}
                            </motion.button>
                        )}

                        {saveStatus === 'saved' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                            >
                                <Check className="w-4 h-4" /> {t('wizard.saved')} {language === 'nl' ? 'Bekijk je profiel.' : 'Check your profile.'}
                            </motion.div>
                        )}
                        {saveStatus === 'failed' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium"
                            >
                                <AlertCircle className="w-4 h-4" /> {language === 'nl' ? 'Opslaan mislukt. Ben je ingelogd?' : 'Save failed. Are you logged in?'}
                            </motion.div>
                        )}
                        {loading && <p className="text-xl text-gray-500 animate-pulse">{language === 'nl' ? 'De beste opties worden berekend...' : 'Calculating the best options...'}</p>}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="inline-block p-6 bg-red-100 rounded-full text-red-600 mb-6">
                                <X className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{error}</h3>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-500">{t('wizard.noResults')}</p>
                            <button onClick={restart} className="mt-8 text-avans-red font-bold underline text-lg">{t('wizard.tryAgain')}</button>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {results.map((module, idx) => (
                                    <RecommendationResultCard key={idx} module={module} index={idx} />
                                ))}
                            </div>
                            <div className="flex justify-center pb-20">
                                <button onClick={restart} className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 shadow-xl rounded-full font-bold text-gray-900 dark:text-white hover:scale-105 transition-all">
                                    <RefreshCw className="w-5 h-5" /> {language === 'nl' ? 'Nieuwe zoekopdracht' : 'New search'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // VISUALS: WIZARD STEPS
    return (
        <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-700 ease-in-out flex flex-col items-center justify-center ${getBgColor()}`}>

            {/* Background Blobs (Decoration) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: step % 2 === 0 ? -100 : 100,
                        y: step % 2 === 0 ? -100 : 100
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: step % 2 === 0 ? 100 : -100,
                        y: step % 2 === 0 ? 100 : -100
                    }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"
                />
            </div>

            {/* Main Content AnimatePresence */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative z-10 w-full flex justify-center py-20"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            {/* Progress Bubbles at bottom */}
            {step < 5 && (
                <div className="absolute bottom-8 left-0 w-full flex justify-center gap-3 z-20">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-avans-red' :
                                i < step ? 'w-2 bg-gray-300 dark:bg-gray-700' :
                                    'w-2 bg-gray-200 dark:bg-gray-800'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
