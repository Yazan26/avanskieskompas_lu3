'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { FeatureCard } from '../../types/home';

const steps: FeatureCard[] = [
  {
    icon: 'rule',
    title: '1. Beantwoord Vragen',
    description:
      'Vertel ons over je interesses en wat je zoekt in een module.',
  },
  {
    icon: 'auto_awesome',
    title: '2. Ontvang je Matches',
    description:
      'Ons slimme systeem analyseert je antwoorden en vindt de beste opties.',
  },
  {
    icon: 'explore',
    title: '3. Ontdek & Kies',
    description:
      'Vergelijk de aanbevolen modules en maak de perfecte keuze voor jou.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="hoe-het-werkt" className="py-16 md:py-20" ref={ref}>
      <motion.h2 
        className="px-4 pb-8 pt-5 text-center text-3xl font-bold leading-tight tracking-[-0.015em] md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Hoe het werkt
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            className="group relative flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-border-light bg-foreground-light p-6 text-left shadow-md transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 dark:border-border-dark dark:bg-foreground-dark md:p-8"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -10,
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Icon with rotation on hover */}
            <motion.span 
              className="material-symbols-outlined relative z-10 text-5xl text-primary transition-all duration-500 group-hover:scale-110"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {step.icon}
            </motion.span>
            
            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="text-xl font-bold leading-tight transition-colors duration-300 group-hover:text-primary md:text-2xl">
                {step.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-text-secondary-light transition-colors duration-300 dark:text-text-secondary-dark md:text-base">
                {step.description}
              </p>
            </div>

            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-glow" />
            </div>

            {/* Number badge */}
            <div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition-all duration-300 group-hover:scale-125 group-hover:bg-primary group-hover:text-white">
              {index + 1}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Connection lines for desktop */}
      <div className="relative -mt-32 hidden px-4 md:block">
        <svg className="w-full" height="100" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <motion.path
            d="M 200 50 Q 400 20, 600 50 T 1000 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/30"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </svg>
      </div>
    </section>
  );
}
