
import axios from 'axios';
import { RecommendedModule, Module } from '../types/recommendations';

export interface RecommendationWeights {
  text_similarity: number;
  location: number;
  tags: number;
  difficulty: number;
  popularity: number;
}

export interface RecommendationRequest {
  interests_text: string;
  preferred_location?: string;
  moduletags_include?: string[];
  min_ec?: number;
  max_difficulty?: number;
  weights?: RecommendationWeights;
  k?: number;
}

export interface SavePreferences {
    interests: string;
    location: string;
    minEc: number;
    maxDifficulty: number;
    selectedTags: string[];
    weights: RecommendationWeights;
}

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get auth header (if user is logged in)
const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('[recommendationService] Token from localStorage:', token ? 'Present (length: ' + token.length + ')' : 'Not found');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all available modules
 */
export const getAllModules = async (): Promise<Module[]> => {
  try {
    const response = await axios.get(`${DEFAULT_API_URL}/api/recommendations/getmodules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

/**
 * Get AI recommendations
 */
export const fetchRecommendations = async (
  interests: string, 
  location: string = '',
  minEc: number = 0,
  maxDifficulty: number = 5,
  tags: string[] = [],
  weights?: RecommendationWeights
): Promise<RecommendedModule[]> => {
  try {
    const payload: RecommendationRequest = {
        interests_text: interests,
        preferred_location: location === 'any' ? undefined : location,
        moduletags_include: tags,
        min_ec: minEc,
        max_difficulty: maxDifficulty,
        weights: weights,
        k: 5
    };

    if (!payload.preferred_location) delete payload.preferred_location;

    const url = `${DEFAULT_API_URL}/api/recommendations/getrecommend`;
    const headers = getAuthHeader();
    console.log('[recommendationService] Calling URL:', url);
    console.log('[recommendationService] With headers:', JSON.stringify(headers));

    // Include auth header so backend can save recommendations for logged-in users
    const response = await axios.post(url, payload, { headers });
    
    // Log debug info from backend
    if (response.data._debug) {
      console.log('[recommendationService] Backend debug info:', response.data._debug);
    }
    
    // Return the recommendations array (handle both old and new response format)
    return response.data.recommendations || response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const saveRecommendations = async (
    recommendations: RecommendedModule[],
    preferences: SavePreferences
): Promise<{ success: boolean; message?: string }> => {
    const header = getAuthHeader();
    if (Object.keys(header).length === 0) throw new Error('No token found');

    const response = await axios.post(`${DEFAULT_API_URL}/api/recommendations/save`, {
        recommendations,
        preferences
    }, {
        headers: header
    });
    return response.data;
};
