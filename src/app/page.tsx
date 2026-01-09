import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Benefits from '../components/home/Benefits';

export default function HomePage() {
  return (
    <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Hero />
      <HowItWorks />
      <Benefits />
    </main>
  );
}

// Note: This is a Server Component by default in Next.js 13+