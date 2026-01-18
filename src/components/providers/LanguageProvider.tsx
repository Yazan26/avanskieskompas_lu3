'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/translations/en.json';
import nl from '@/translations/nl.json';

type Language = 'en' | 'nl';

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

const translations: Record<Language, Translations> = { en, nl };

// Helper function to get translation
function getTranslation(language: Language, key: string): string {
    const keys = key.split('.');
    let value: TranslationValue | undefined = translations[language];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, TranslationValue>)[k];
        } else {
            // Fallback to English if key not found
            let fallback: TranslationValue | undefined = translations.en;
            for (const fk of keys) {
                if (fallback && typeof fallback === 'object' && fk in fallback) {
                    fallback = (fallback as Record<string, TranslationValue>)[fk];
                } else {
                    return key; // Return key if not found anywhere
                }
            }
            return typeof fallback === 'string' ? fallback : key;
        }
    }

    return typeof value === 'string' ? value : key;
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Create context with default values for SSR
const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: (key: string) => getTranslation('en', key),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('language') as Language | null;
        if (stored && (stored === 'en' || stored === 'nl')) {
            setLanguageState(stored);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    }, []);

    const t = useCallback((key: string): string => {
        return getTranslation(language, key);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    return useContext(LanguageContext);
}
