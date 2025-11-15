'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeuralNetworkCanvas from './NeuralNetworkCanvas';

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

      {/* Interactive neural network visualization */}
      <motion.div
        className="relative w-full md:min-w-[360px] md:max-w-xl"
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative flex w-full flex-col items-center gap-6">
          <div className="absolute inset-0 -z-10 blur-3xl">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_top,_rgba(26,111,224,0.6),_transparent_60%)]" />
          </div>
          <NeuralNetworkCanvas />
        </div>
      </motion.div>
    </section>
  );
}
