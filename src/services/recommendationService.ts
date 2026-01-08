import { RecommendationRequest, RecommendedModule, Module } from '../types/recommendations';

const DEFAULT_API_URL = 'http://localhost:3000/api/keuzemodules';

export class AIService {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all available modules
   */
  async getAllModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getmodules`);
      if (!response.ok) {
        throw new Error(`Failed to fetch modules: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }

  /**
   * Get AI recommendations based on user interests
   */
  async getRecommendations(params: RecommendationRequest): Promise<RecommendedModule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getrecommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        // Handle 503 specifically
        if (response.status === 503) {
          console.warn('AI Service unavailable, falling back or showing error.');
          // You might want to try to parse the error body if possible
          try {
            const errorData = await response.json();
            console.error('503 Details:', errorData);
            throw new Error(errorData.message || 'AI Service is currently unavailable.');
          } catch (e) {
            throw new Error('AI Service is currently unavailable (503).');
          }
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: RecommendedModule[] = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }
}

// Export a singleton instance for ease of use
export const aiService = new AIService();

// Backward compatibility (optional, but good if we don't want to break existing imports immediately, 
// though we will update the consumer in the next step)
export const fetchRecommendations = (interests: string, location: string) => {
    return aiService.getRecommendations({
        interests_text: interests,
        preferred_location: location === 'Any' ? undefined : location,
        k: 5
    });
};
