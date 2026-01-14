'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sparkles,
    X,
    ChevronDown,
    Cpu,
    Heart,
    Briefcase,
    Palette,
    Leaf,
    BookOpen,
    Check,
    Tag
} from 'lucide-react';

// ------------ TYPES ----------------
interface SmartTagSelectorProps {
    allTags: string[];
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    userInterestText: string;
}

// Category definitions with their keywords for matching
const CATEGORIES = [
    {
        id: 'all',
        label: 'Alles',
        icon: Tag,
        keywords: [] as string[]
    },
    {
        id: 'tech',
        label: 'Tech',
        icon: Cpu,
        keywords: ['ai', 'python', 'data', 'programming', 'software', 'cyber', 'digital', 'machine', 'algoritmiek', 
                   'automatisering', 'robotica', 'iot', 'computational', 'programmeren', 'programeren', 'unity',
                   'game', 'gaming', 'mechatronica', 'plc', 'smart', 'technologie', 'technology', 'bimgis']
    },
    {
        id: 'health',
        label: 'Zorg',
        icon: Heart,
        keywords: ['gezondheid', 'zorg', 'psychologie', 'fysiotherapie', 'health', 'verpleegkunde', 'ggz',
                   'revalidatie', 'verloskunde', 'neonatologie', 'palliatieve', 'welzijn', 'wellbeing',
                   'jeugdzorg', 'hulpverlening', 'trauma', 'herstel', 'diagnostiek']
    },
    {
        id: 'business',
        label: 'Business',
        icon: Briefcase,
        keywords: ['management', 'finance', 'marketing', 'entrepreneurship', 'business', 'economie', 'hrm',
                   'accounting', 'fiscaal', 'boekhouden', 'organisatie', 'leiderschap', 'strateg', 'ondernemen',
                   'recruitment', 'branding', 'advertising', 'corporate', 'startup']
    },
    {
        id: 'creative',
        label: 'Creatief',
        icon: Palette,
        keywords: ['design', 'art', 'animatie', 'fotografie', 'kunst', 'creatief', 'creative', 'illustratie',
                   'muziek', 'drama', 'visual', 'graphic', 'media', 'storytelling', 'podiumkunst', 'beeldende',
                   'compositie', 'regie', 'editorial', 'webtoon']
    },
    {
        id: 'sustainability',
        label: 'Duurzaam',
        icon: Leaf,
        keywords: ['duurzaam', 'circulair', 'energie', 'sustainability', 'sustainable', 'milieu', 'klimaat',
                   'biobased', 'regenerative', 'green', 'eco', 'recycl', 'transitie', 'verduurzam', 'sdg',
                   'water', 'natuur', 'landbouw']
    },
    {
        id: 'other',
        label: 'Overig',
        icon: BookOpen,
        keywords: []
    }
];

// Dutch stopwords to filter out from interest text
const STOP_WORDS = new Set([
    'de', 'het', 'een', 'en', 'van', 'in', 'is', 'op', 'te', 'dat', 'die', 'voor', 'zijn', 'met',
    'als', 'aan', 'door', 'naar', 'maar', 'om', 'ook', 'dan', 'of', 'bij', 'nog', 'kan', 'zou',
    'wel', 'geen', 'meer', 'over', 'wil', 'wilt', 'wou', 'graag', 'heel', 'erg', 'veel', 'wat',
    'hoe', 'waarom', 'wanneer', 'waar', 'wie', 'ik', 'je', 'jij', 'we', 'wij', 'ze', 'zij', 'mij',
    'me', 'mijn', 'jouw', 'hun', 'ons', 'onze', 'later', 'worden', 'leren', 'goed', 'leuk', 'vind',
    'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'i', 'that', 'for', 'on', 'with'
]);

const TAGS_PER_PAGE = 12;

// ------------ COMPONENT ----------------
export const SmartTagSelector: React.FC<SmartTagSelectorProps> = ({
    allTags,
    selectedTags,
    onTagsChange,
    userInterestText
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(TAGS_PER_PAGE);

    // Extract keywords from user's interest text for suggestions
    const extractKeywords = useCallback((text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !STOP_WORDS.has(word));
    }, []);

    // AI-powered tag suggestions based on user's interest text
    const suggestedTags = useMemo(() => {
        if (!userInterestText || userInterestText.length < 10) return [];

        const keywords = extractKeywords(userInterestText);
        const tagScores = new Map<string, number>();

        allTags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            let score = 0;

            keywords.forEach(keyword => {
                // Exact match gets highest score
                if (tagLower === keyword) score += 10;
                // Tag contains keyword
                else if (tagLower.includes(keyword)) score += 5;
                // Keyword contains tag (for short tags)
                else if (keyword.includes(tagLower) && tagLower.length >= 3) score += 3;
                // Starts with same letters
                else if (tagLower.startsWith(keyword.slice(0, 3))) score += 1;
            });

            if (score > 0) tagScores.set(tag, score);
        });

        // Sort by score and return top 8
        return Array.from(tagScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([tag]) => tag);
    }, [userInterestText, allTags, extractKeywords]);

    // Categorize a tag
    const getTagCategory = useCallback((tag: string): string => {
        const tagLower = tag.toLowerCase();
        for (const category of CATEGORIES) {
            if (category.id === 'all' || category.id === 'other') continue;
            if (category.keywords.some(kw => tagLower.includes(kw) || kw.includes(tagLower))) {
                return category.id;
            }
        }
        return 'other';
    }, []);

    // Filter tags based on search and category
    const filteredTags = useMemo(() => {
        let result = [...allTags];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(tag => tag.toLowerCase().includes(query));
        }

        // Apply category filter
        if (activeCategory !== 'all') {
            result = result.filter(tag => getTagCategory(tag) === activeCategory);
        }

        return result;
    }, [allTags, searchQuery, activeCategory, getTagCategory]);

    // Tags to display (paginated)
    const visibleTags = useMemo(() => {
        return filteredTags.slice(0, visibleCount);
    }, [filteredTags, visibleCount]);

    const hasMore = visibleCount < filteredTags.length;

    // Toggle tag selection
    const toggleTag = useCallback((tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    }, [selectedTags, onTagsChange]);

    // Load more tags
    const loadMore = () => {
        setVisibleCount(prev => prev + TAGS_PER_PAGE);
    };

    // Reset visible count when filters change
    React.useEffect(() => {
        setVisibleCount(TAGS_PER_PAGE);
    }, [searchQuery, activeCategory]);

    return (
        <div className="w-full space-y-6">
            {/* AI Suggestions Section */}
            {suggestedTags.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 md:p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="font-bold text-purple-700 dark:text-purple-300 text-sm md:text-base">
                            Aanbevolen voor jou
                        </span>
                        <span className="text-xs text-purple-500 dark:text-purple-400">
                            (gebaseerd op je interesses)
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTags.map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <motion.button
                                    key={`suggestion-${tag}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${isSelected
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700'
                                        }
                                    `}
                                >
                                    {isSelected && <Check className="w-3 h-3" />}
                                    {tag}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek tags..."
                    className="w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border-0 shadow-sm focus:ring-2 focus:ring-avans-red/20 text-base md:text-lg placeholder:text-gray-400"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== 'other').map(category => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-1.5
                                ${isActive
                                    ? 'bg-avans-red text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {/* Tags Grid */}
            <div className="min-h-[120px]">
                {filteredTags.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Geen tags gevonden voor &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <AnimatePresence mode="popLayout">
                                {visibleTags.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <motion.button
                                            key={tag}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                                                ${isSelected
                                                    ? 'bg-avans-red text-white shadow-md shadow-red-500/20'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                                }
                                            `}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                            {tag}
                                        </motion.button>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={loadMore}
                                className="mt-4 w-full py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm transition-colors"
                            >
                                <ChevronDown className="w-4 h-4" />
                                Toon meer ({filteredTags.length - visibleCount} over)
                            </motion.button>
                        )}
                    </>
                )}
            </div>

            {/* Selected Tags Panel */}
            <AnimatePresence>
                {selectedTags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                Geselecteerd ({selectedTags.length})
                            </span>
                            <button
                                onClick={() => onTagsChange([])}
                                className="text-xs text-gray-500 hover:text-avans-red transition-colors"
                            >
                                Alles wissen
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map(tag => (
                                <motion.button
                                    key={`selected-${tag}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => toggleTag(tag)}
                                    className="px-3 py-1.5 bg-avans-red text-white rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                                >
                                    {tag}
                                    <X className="w-3 h-3" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartTagSelector;
