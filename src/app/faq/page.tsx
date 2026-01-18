'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function FaqPage() {
  const { t, language } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ content based on language
  const faqs = language === 'nl' ? [
    {
      question: 'Wat is een Vrije Keuze Module (VKM)?',
      answer: 'Een Vrije Keuze Module (VKM) is een onderwijseenheid die je kunt kiezen buiten je eigen opleiding om je kennis te verbreden of te verdiepen in een ander vakgebied. Dit geeft je de kans om je studieprogramma te personaliseren.',
    },
    {
      question: 'Hoe werkt de AI-aanbeveling?',
      answer: "Ons AI-systeem analyseert je studievoortgang, interesses (op basis van opgeslagen favorieten) en het profiel van vergelijkbare studenten om je de meest relevante VKM's aan te bevelen. Hoe meer je de tool gebruikt, hoe beter de aanbevelingen worden.",
    },
    {
      question: 'Hoe kan ik me inschrijven voor een VKM?',
      answer: "Op de detailpagina van een module vind je een 'Aanmelden voor module'-knop. Deze knop leidt je door naar het officiële inschrijfsysteem van Avans (OSIRIS) waar je je inschrijving kunt voltooien. Zorg ervoor dat je voldoet aan de eventuele voorkenniseisen.",
    },
    {
      question: 'Kan ik een VKM kiezen die niet wordt aanbevolen?',
      answer: "Jazeker. De aanbevelingen zijn een hulpmiddel, geen verplichting. Je kunt via de zoek- en filterfunctie door alle beschikbare VKM's bladeren en je inschrijven voor elke module waarvoor je toelaatbaar bent.",
    },
  ] : [
    {
      question: 'What is an Elective Module (VKM)?',
      answer: 'An Elective Module (VKM) is an educational unit that you can choose outside your own program to broaden or deepen your knowledge in another field. This gives you the opportunity to personalize your study program.',
    },
    {
      question: 'How does the AI recommendation work?',
      answer: 'Our AI system analyzes your study progress, interests (based on saved favorites), and the profile of similar students to recommend the most relevant elective modules. The more you use the tool, the better the recommendations become.',
    },
    {
      question: 'How can I register for an elective module?',
      answer: "On the detail page of a module, you'll find a 'Register for module' button. This button will redirect you to the official Avans registration system (OSIRIS) where you can complete your registration. Make sure you meet any prerequisites.",
    },
    {
      question: 'Can I choose a module that is not recommended?',
      answer: "Absolutely. The recommendations are a tool, not a requirement. You can browse all available elective modules using the search and filter function and register for any module you're eligible for.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 md:py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        {/* Heading */}
        <motion.header
          className="flex flex-col items-center gap-5 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="material-symbols-outlined text-3xl text-primary">
              help
            </span>
          </motion.div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              FAQ
            </p>
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl lg:text-6xl">
              {t('faq.helpCenter')}
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-text-muted-light md:text-lg dark:text-text-muted-dark">
            {t('faq.subtitle')}
          </p>
        </motion.header>

        {/* Search input with animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="material-symbols-outlined pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-text-muted-light dark:text-text-muted-dark">
            search
          </span>
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-16 w-full rounded-2xl border-2 border-border-light bg-card-light pl-14 pr-6 text-base text-text-light shadow-lg outline-none ring-0 placeholder:text-text-muted-light transition-all duration-300 focus:border-primary focus:shadow-xl focus:shadow-primary/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
        </motion.div>

        {/* FAQ list with smooth accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              className="group overflow-hidden rounded-2xl border-2 border-border-light bg-card-light shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:border-border-dark dark:bg-card-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-primary/5"
              >
                <span className="pr-4 text-lg font-bold text-text-light transition-colors duration-300 group-hover:text-primary dark:text-text-dark">
                  {item.question}
                </span>
                <motion.span
                  className="material-symbols-outlined flex-shrink-0 text-text-muted-light transition-colors duration-300 group-hover:text-primary dark:text-text-muted-dark"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  expand_more
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="border-t-2 border-border-light bg-gradient-to-b from-primary/5 to-transparent px-6 pb-6 pt-5 dark:border-border-dark">
                  <p className="text-base leading-relaxed text-text-light dark:text-text-dark">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact card with animation */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-6 rounded-2xl border-2 border-border-light bg-gradient-to-br from-card-light to-primary/5 p-10 text-center shadow-xl dark:border-border-dark dark:bg-gradient-to-br dark:from-card-dark dark:to-primary/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="material-symbols-outlined text-3xl text-primary">
              contact_support
            </span>
          </motion.div>
          <h3 className="text-2xl font-bold text-text-light md:text-3xl dark:text-text-dark">
            {t('faq.cantFindAnswer')}
          </h3>
          <p className="max-w-md text-base leading-relaxed text-text-muted-light dark:text-text-muted-dark">
            {t('faq.teamReady')}
          </p>
          <motion.button
            className="mt-2 flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-base font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('faq.contactUs')}</span>
            <span className="material-symbols-outlined">mail</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
