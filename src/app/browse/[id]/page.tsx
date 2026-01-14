import { Link } from 'lucide-react';
import ModuleDetailClient from './ModuleDetailClient';

interface ModuleDetail {
  _id: string;
  id: number;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  contact_id: number;
  level: string;
  learningoutcomes: string;
  module_tags?: string | string[];
  period?: string;
  start_date?: string;
  estimated_difficulty?: number;
  popularity_score?: number;
  available_spots?: number;
  reviews?: unknown[];
}

// Ensure this matches your backend port (usually 3001)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getModule(id: string): Promise<ModuleDetail | null> {
  try {
    // Fetch directly from the backend endpoint
    const res = await fetch(`${API_URL}/api/keuzemodules/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch module: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch module', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moduleDetail = await getModule(id);
  
  if (!moduleDetail) {
    return {
      title: 'Module niet gevonden | Avans Keuze Kompas',
    };
  }

  return {
    title: `${moduleDetail.name} | Avans Keuze Kompas`,
    description: moduleDetail.shortdescription,
  };
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moduleDetail = await getModule(id);

  if (!moduleDetail) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-500/10">
          <span className="material-symbols-outlined text-4xl text-red-500">error</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-text-light dark:text-text-dark">
          Module niet gevonden
        </h1>
        <p className="mb-2 text-gray-500">
          De module met ID <span className="font-mono font-bold">{id}</span> kon niet worden gevonden.
        </p>
        <p className="mb-8 text-sm text-gray-400">
          Controleer of de backend draait en de route{' '}
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-800">
            /api/keuzemodules/:id
          </code>{' '}
          beschikbaar is.
        </p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Terug naar overzicht
        </Link>
      </div>
    );
  }

  return <ModuleDetailClient module={moduleDetail} />;
}
