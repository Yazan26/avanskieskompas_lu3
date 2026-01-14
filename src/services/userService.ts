import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Preferences interface for type safety
export interface UserPreferences {
    interests: string;
    location: string;
    minEc: number;
    maxDifficulty: number;
    selectedTags: string[];
    weights: {
        text_similarity: number;
        location: number;
        tags: number;
        difficulty: number;
        popularity: number;
    };
}

export const userService = {
    getProfile: async () => {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    updateProfile: async (data: { name?: string; password?: string }) => {
        const response = await axios.put(`${API_URL}/api/users/profile`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Save/update user preferences
    savePreferences: async (preferences: UserPreferences) => {
        const response = await axios.put(`${API_URL}/api/users/preferences`, preferences, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Clear preferences (optionally also clear recommendations)
    clearPreferences: async (clearRecommendationsAlso: boolean = false) => {
        const response = await axios.delete(`${API_URL}/api/users/preferences?clearRecommendationsAlso=${clearRecommendationsAlso}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    addRecommendation: async (moduleId: number) => {
        const response = await axios.post(`${API_URL}/api/users/recommendations`, { moduleId }, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    removeRecommendation: async (moduleId: number) => {
        const response = await axios.delete(`${API_URL}/api/users/recommendations/${moduleId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Clear all recommendations
    clearRecommendations: async () => {
        const response = await axios.delete(`${API_URL}/api/users/recommendations`, {
            headers: getAuthHeader(),
        });
        return response.data;
    }
};


export interface ModuleFilters {
    search?: string;
    location?: string;
    language?: string;
    period?: string;
    sort?: string;
    limit?: number;
}

export const moduleService = {
    getAllModules: async (filters: ModuleFilters = {}) => {
        const response = await axios.get(`${API_URL}/api/keuzemodules`, {
            params: filters
        });
        return response.data;
    }
};

