export interface RecommendationRequest {
  interests_text: string;
  preferred_location?: string;
  moduletags_include?: string[];
  k?: number;
}

export interface ConstraintReasons {
  location?: string;
  module_tags?: string;
}

export interface RecommendedModule {
  id: number;  // Actual module ID from database (used for navigation)
  pos: number; // Position in dataset (legacy field)
  name: string;
  location: string;
  final_score: number;
  content_sim: number;
  explanation: string[];
  constraint_reasons?: ConstraintReasons;
  popularity_score?: number;
  constraint_score?: number;
  // Enhanced reasoning fields
  detailed_reasoning: string[];
  shortdescription?: string;
  studycredit?: string;
  estimated_difficulty?: number;
  module_tags?: string;
  learningoutcomes?: string;
  score_breakdown?: {
    content_similarity: number;
    keyword_depth?: number;
    constraint_bonus?: number;
    popularity_bonus?: number;
    location_match?: number;
    tags_match?: number;
    difficulty_penalty?: number;
    popularity?: number;
    availability?: number;
    difficulty_factor?: number;
  };
  // NEW: Enhanced scoring fields (guaranteed bounds)
  match_percentage?: number;  // 0-100, GUARANTEED
  confidence?: number;        // 0-1 reliability score
  percentile_rank?: number;   // 0-100 position among all modules
  match_tier?: 'excellent' | 'strong' | 'good' | 'exploratory';
}

export interface Module {
  // Loose definition as specific schema wasn't provided for "all modules" endpoint
  // but we assume it contains basic info
  name: string;
  location?: string;
  description?: string;
  [key: string]: unknown;
}
