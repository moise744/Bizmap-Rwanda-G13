// Professional application types for BusiMap Rwanda - Updated to match API responses

export interface User {
  id?: string;
  user_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_type: 'customer' | 'business_owner' | 'admin';
  preferred_language: 'en' | 'kinyarwanda' | 'fr';
  is_phone_verified?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  date_joined?: string;
  last_login?: string;
  profile_picture?: string;
  location?: {
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  user_type: 'customer' | 'business_owner';
  preferred_language?: 'en' | 'kinyarwanda' | 'fr';
}

export interface BusinessCategory {
  id?: number;
  category_id: string;
  name: string;
  name_kinyarwanda?: string;
  name_french?: string;
  description?: string;
  icon?: string;
  parent_category?: string | null;
  is_active: boolean;
  subcategories?: BusinessCategory[];
}

export interface BusinessImage {
  id?: number;
  image: string;
  caption?: string;
  is_primary?: boolean;
  uploaded_at?: string;
}

export interface BusinessReview {
  id?: number;
  user?: number;
  user_name?: string;
  user_email?: string;
  rating_score: number;
  review_text: string;
  is_verified_purchase?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Business {
  id?: string;
  business_id: string;
  business_name: string;
  business_category: number;
  category_name?: string;
  full_description: string;
  short_summary: string;
  location?: string; // PostGIS Point field
  latitude?: string | number;
  longitude?: string | number;
  address: string;
  province: string;
  district: string;
  sector?: string;
  cell?: string;
  phone_number: string;
  email_address?: string;
  website_url?: string;
  operating_schedule?: Record<string, any>;
  price_range: 'budget' | 'moderate' | 'premium' | 'luxury';
  accepts_reservations?: boolean;
  delivery_available?: boolean;
  takeaway_available?: boolean;
  outdoor_seating?: boolean;
  wheelchair_accessible?: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  publication_status?: 'draft' | 'published' | 'archived';
  average_rating_score?: string | number;
  total_reviews_count?: number;
  total_view_count?: number;
  images?: BusinessImage[];
  reviews?: BusinessReview[];
  created_at?: string;
  updated_at?: string;
}

export interface NearbyBusiness {
  business_id: string;
  business_name: string;
  business_category: number;
  business_category_id?: string;
  category_name?: string;
  short_summary: string;
  latitude: string;
  longitude: string;
  address: string;
  average_rating_score?: string;
  total_reviews_count?: number;
  price_range: 'budget' | 'moderate' | 'premium' | 'luxury';
  distance_km: string;
}

export interface SearchFilters {
  categories?: BusinessCategory[];
  provinces?: string[];
  districts?: string[];
  price_ranges?: Array<{
    key: string;
    label: string;
  }>;
  amenities?: string[];
  rating_ranges?: Array<{
    min: number;
    max: number;
    label: string;
  }>;
}

export interface Location {
  latitude?: number;
  longitude?: number;
  address?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
  metadata?: any;
}

export interface ChatState {
  messages: AIMessage[];
  isLoading: boolean;
  error?: string;
  conversationId?: string;
  context: {
    userLocation?: Location;
    language: string;
    lastIntent?: string;
    lastCategory?: string;
  };
}

export interface AIResponse {
  success: boolean;
  data?: {
    conversation_id: string;
    ai_response: {
      response: string;
      suggestions?: string[];
      conversation_state: {
        last_intent: string;
        last_category?: string;
        language: string;
        confidence?: number;
        urgency?: string;
      };
      next_step?: string;
      analysis?: {
        intent: string;
        category?: string;
        sentiment?: string;
        urgency?: string;
        entities?: Record<string, string[]>;
      };
    };
  };
  error?: {
    message: string;
    code: string;
    timestamp: number;
  };
  timestamp?: number | string;
  message?: string;
}

export interface SearchResponse {
  success: boolean;
  data?: {
    results?: Business[];
    total_found?: number;
    search_metadata?: {
      query: string;
      language?: string;
      ai_analysis?: any;
      search_suggestions?: string[];
    };
    pagination?: {
      current_page: number;
      total_pages: number;
      page_size: number;
    };
  };
  error?: {
    message: string;
    code: string;
    timestamp: string;
  };
  timestamp?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    timestamp: number | string;
  };
  timestamp?: number | string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface AuthResponse {
  user?: User;
  access_token?: string;
  refresh_token?: string;
  token?: string;
  refresh?: string;
  user_id?: string;
}

export interface BusinessInsights {
  popular_categories: Array<{
    name: string;
    growth: number;
    searches: number;
  }>;
  trending_searches: string[];
  performance_metrics: {
    total_businesses: number;
    verified_businesses: number;
    average_rating: number;
    total_reviews: number;
  };
  growth_trends: Array<{
    period: string;
    new_businesses: number;
    growth_rate: number;
  }>;
}

export interface MarketTrends {
  growth_metrics: {
    overall_growth: number;
    new_businesses: number;
    market_expansion: number;
    digital_adoption: number;
  };
  category_trends: Array<{
    category: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }>;
  predictions: {
    next_quarter: {
      expected_growth: number;
      trending_categories: string[];
    };
  };
}

export interface SearchSuggestion {
  text: string;
  type: 'business' | 'category' | 'location' | 'query';
  metadata?: any;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  results_count: number;
  language?: string;
  metadata?: any;
}

export type SupportedLanguage = 'en' | 'kinyarwanda' | 'fr';
export type UserType = 'customer' | 'business_owner' | 'admin';
export type PriceRange = 'budget' | 'moderate' | 'premium' | 'luxury';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type PublicationStatus = 'draft' | 'published' | 'archived';