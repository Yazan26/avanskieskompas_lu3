import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <HowItWorks />
      <Benefits />
    </main>
  );
}
