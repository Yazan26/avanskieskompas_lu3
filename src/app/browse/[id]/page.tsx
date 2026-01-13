import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  language?: string;
  period?: string;
  start_date?: string;
  reviews?: any[]; 
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
  const module = await getModule(id);
  
  if (!module) {
    return {
      title: 'Module niet gevonden | Avans Keuze Kompas',
    };
  }

  return {
    title: `${module.name} | Avans Keuze Kompas`,
    description: module.shortdescription,
  };
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const module = await getModule(id);

  if (!module) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Module niet gevonden</h1>
            <p className="mb-6 text-gray-500">De module met ID {id} kon niet worden gevonden.</p>
            <p className="text-sm text-gray-400">Controleer of de backend draait en de route <code>/api/keuzemodules/:id</code> heeft.</p>
            <Link href="/browse" className="mt-4 text-primary hover:underline">
                Terug naar overzicht
            </Link>
        </div>
    );
  }

  // Parse tags if they are a string
  let tags: string[] = [];
  if (Array.isArray(module.module_tags)) {
      tags = module.module_tags;
  } else if (typeof module.module_tags === 'string') {
      tags = module.module_tags.split(',').map(t => t.trim());
  }

  return (
    <section className="py-8">
      {/* Breadcrumbs */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="font-medium text-accent hover:underline"
        >
          Home
        </Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">
          /
        </span>
        <Link
          href="/browse"
          className="font-medium text-accent hover:underline"
        >
          Browse VKM
        </Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">
          /
        </span>
        <span className="font-medium text-text-light dark:text-text-dark">
          {module.name}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
              {module.name}
            </h1>
            <p className="text-base font-medium text-text-muted-light dark:text-text-muted-dark">
              Code: {module.id}
            </p>
          </div>

          <div className="flex flex-col gap-8 pt-2">
            {/* Description */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                Beschrijving
              </h3>
              <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-text-light dark:text-text-dark whitespace-pre-wrap">
                {module.description || module.shortdescription}
              </div>
            </section>

             {/* Content / Inhoud */}
             {module.content && (
              <section className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Inhoud
                </h3>
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-text-light dark:text-text-dark whitespace-pre-wrap">
                  {module.content}
                </div>
              </section>
            )}

            {/* Learning Outcomes */}
             {module.learningoutcomes && (
              <section className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Leerdoelen
                </h3>
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-text-light dark:text-text-dark whitespace-pre-wrap">
                  {module.learningoutcomes}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          
          {/* Key facts */}
          <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-card-light p-6 dark:border-border-dark dark:bg-card-dark">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              Details
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  ECTS
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  {module.studycredit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Niveau
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  {module.level || 'HBO-Bachelor'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Taal
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  {module.language || 'Onbekend'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  Locatie
                </span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  {module.location}
                </span>
              </div>
            </div>
             {/* Tags */}
             {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <span key={index} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-bold text-white transition-colors hover:bg-primary/90">
              Aanmelden voor module
            </button>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary/20 text-base font-bold text-secondary transition-colors hover:bg-secondary/30 dark:bg-secondary/30 dark:hover:bg-secondary/40">
              <span className="material-symbols-outlined">
                favorite_border
              </span>
              Opslaan in favorieten
            </button>
          </div>

        </aside>
      </div>
    </section>
  );
}
