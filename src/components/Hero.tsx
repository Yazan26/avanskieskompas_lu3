'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col gap-8 overflow-hidden px-4 py-20 md:flex-row md:items-center md:gap-12 md:py-32">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-gradient" />

      {/* Text content with staggered animations */}
      <motion.div 
        className="flex w-full flex-col gap-6 md:gap-8 md:justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col gap-4 text-left">
          <motion.h1 
            className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-black leading-tight tracking-[-0.033em] text-transparent md:text-5xl lg:text-6xl animate-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Vind jouw perfecte Vrije Keuze Module met AI.
          </motion.h1>
          <motion.h2 
            className="text-base font-normal leading-relaxed text-text-secondary-light md:text-lg dark:text-text-secondary-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Stop met eindeloos zoeken. Krijg persoonlijke aanbevelingen op basis
            van jouw interesses en studie.
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/browse">
            <button className="group relative flex h-14 w-fit min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-8 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50">
              <span className="relative z-10 flex items-center gap-2 truncate">
                Start Mijn Aanbeveling
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </Link>
        </motion.div>

        {/* Stats or features */}
        <motion.div 
          className="flex flex-wrap gap-6 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { icon: 'school', label: '100+ Modules', color: 'text-primary' },
            { icon: 'psychology', label: 'AI-Powered', color: 'text-accent' },
            { icon: 'verified', label: '95% Match Rate', color: 'text-green-500' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="text-sm font-semibold">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Image with parallax and float effect */}
      <motion.div
        className="relative w-full md:min-w-[350px] md:max-w-md lg:max-w-lg"
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative aspect-square w-full animate-float">
          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
          
          {/* Main image */}
          <div
            className="relative h-full w-full overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat shadow-2xl ring-2 ring-primary/20 transition-transform duration-500 hover:scale-105 hover:ring-primary/40"
            aria-label="Abstract graphic with interconnected nodes and pathways representing AI and choices"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASmsmhMKdl2ZeMDHDHMPsL6YEimhvqtRVyeOz4tBxxXgL5sRdNJQrivG6IvwNTC0GDnGfVOxRABjzaeUsfGQUNsSfRTPtGnp6vUMY2L3IqGN5lzR9lPq6dHsqc3Pw0oh0XPFZ0VPGp-pOaHhRaNG9mORhAZoS0Ww8G2-ZtQczlw5dIYXqj4HbfXCz9MhPtZt9osDcVrHaUOtZm1zZJ3hngNzm7pFwu-Ye4Fw4Ds0pP-hoKzGfDd0lc1-2nll2V_dSOazCjc1dybzdG")',
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
