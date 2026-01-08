import { RecommendationEngine } from '../../components/recommendations/RecommendationEngine';

export const metadata = {
  title: 'AI Recommendations - Avans Kieskompas',
  description: 'Find the perfect elective modules based on your interests.',
};

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <RecommendationEngine />
    </main>
  );
}
