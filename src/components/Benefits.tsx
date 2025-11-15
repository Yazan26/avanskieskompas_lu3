'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { FeatureCard } from '../types/home';

const benefits: FeatureCard[] = [
  {
    icon: 'person_search',
    title: 'Persoonlijk Advies',
    description: 'Krijg aanbevelingen die echt bij jou passen.',
  },
  {
    icon: 'schedule',
    title: 'Tijdbesparend',
    description: 'Niet meer urenlang zoeken door lijsten.',
  },
  {
    icon: 'lightbulb',
    title: 'Ontdek Nieuwe Kansen',
    description:
      'Vind modules waar je zelf misschien nooit aan had gedacht.',
  },
];

export default function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="modules" className="relative flex flex-col gap-12 px-4 py-16 md:py-24" ref={ref}>
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="max-w-[720px] text-3xl font-bold leading-tight tracking-tight md:text-4xl md:font-black md:tracking-[-0.033em] lg:text-5xl">
          De Voordelen van het{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Keuze Kompas
          </span>
        </h2>
        <p className="max-w-[720px] text-base font-normal leading-relaxed text-text-secondary-light md:text-lg dark:text-text-secondary-dark">
          Ontdek waarom studenten voor ons platform kiezen om hun ideale VKM te
          vinden.
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {benefits.map((benefit, index) => (
          <motion.article
            key={benefit.title}
            className="group relative flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-border-light bg-foreground-light p-6 text-left shadow-lg transition-all duration-500 hover:shadow-2xl dark:border-border-dark dark:bg-foreground-dark md:p-8"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ 
              duration: 0.7, 
              delay: index * 0.15,
              type: "spring",
              stiffness: 80
            }}
            whileHover={{ 
              y: -15,
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(230, 0, 0, 0.25)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Icon container with pulse effect */}
            <motion.div 
              className="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <span className="material-symbols-outlined text-4xl text-primary">
                {benefit.icon}
              </span>
            </motion.div>
            
            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="text-xl font-bold leading-tight transition-colors duration-300 group-hover:text-primary md:text-2xl">
                {benefit.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-text-secondary-light transition-colors duration-300 dark:text-text-secondary-dark md:text-base">
                {benefit.description}
              </p>
            </div>

            {/* Animated corner accent */}
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
          </motion.article>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        className="relative z-10 mt-8 flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <button className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50">
          <span className="relative z-10">Ontdek Alle Voordelen</span>
          <span className="material-symbols-outlined relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            arrow_forward
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </motion.div>
    </section>
  );
}
