import { RecommendationWizardV2 } from '../../components/recommendations/RecommendationWizardV2';

export const metadata = {
  title: 'AI Recommendations - Avans Kieskompas',
  description: 'Find the perfect elective modules based on your interests.',
};

export default function RecommendationsPage() {
  return (
    <main>
      <RecommendationWizardV2 />
    </main>
  );
}
