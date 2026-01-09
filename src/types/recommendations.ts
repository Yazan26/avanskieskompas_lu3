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
  pos: number;
  name: string;
  location: string;
  final_score: number;
  content_sim: number;
  explanation: string[];
  constraint_reasons?: ConstraintReasons;
}

export interface Module {
  // Loose definition as specific schema wasn't provided for "all modules" endpoint
  // but we assume it contains basic info
  name: string;
  location?: string;
  description?: string;
  [key: string]: unknown;
}
