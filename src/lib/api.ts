// Professional API layer for BusiMap Rwanda with real backend integration
import { Business, BusinessCategory, User, LoginCredentials, RegisterData } from './types';

// Resolve API base URL from environment (configured at build time via Vite)
// Falls back to localhost for development
const RAW_API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
const API_BASE_URL = (RAW_API_BASE_URL ? RAW_API_BASE_URL.replace(/\/+$/, '') : 'http://localhost:8000');

// HTTP request helper with auth
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - likely backend is not running
      throw new Error('Backend service is not available. Please ensure the Django server is running.');
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await makeRequest('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (data: RegisterData) => {
    const response = await makeRequest('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  getProfile: async () => {
    return makeRequest('/api/auth/profile/');
  },

  updateProfile: async (data: Partial<User>) => {
    return makeRequest('/api/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  verifyPhone: async (data: { verification_code: string }) => {
    return makeRequest('/api/auth/verify-phone/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (email: string) => {
    return makeRequest('/api/auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPasswordConfirm: async (data: { new_password: string; confirm_password: string; token?: string }) => {
    return makeRequest('/api/auth/password-reset-confirm/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Business API
export const businessAPI = {
  getCategories: async () => {
    return makeRequest('/api/businesses/categories/');
  },

  getBusinesses: async (params: {
    search?: string;
    business_category?: number;
    province?: string;
    district?: string;
    price_range?: string;
    verification_status?: string;
    ordering?: string;
    page?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/businesses/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getNearbyBusinesses: async (params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
    ordering?: string;
    page?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/businesses/nearby/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getBusinessDetail: async (businessId: string) => {
    return makeRequest(`/api/businesses/${businessId}/`);
  },

  createBusiness: async (data: any) => {
    return makeRequest('/api/businesses/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBusiness: async (businessId: string, data: any) => {
    return makeRequest(`/api/businesses/${businessId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  partialUpdateBusiness: async (businessId: string, data: any) => {
    return makeRequest(`/api/businesses/${businessId}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  createReview: async (businessId: string, data: {
    rating_score: number;
    review_text: string;
    is_verified_purchase?: boolean;
  }) => {
    return makeRequest(`/api/businesses/${businessId}/reviews/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// AI API
export const aiAPI = {
  chat: async (data: {
    message: string;
    conversation_id?: string;
    language?: string;
    user_location?: { latitude: number; longitude: number };
    conversation_context?: any;
  }) => {
    return makeRequest('/api/ai/chat/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getRecommendations: async (data: {
    user_preferences?: any;
    location?: { latitude: number; longitude: number };
    context?: string;
  }) => {
    return makeRequest('/api/ai/recommendations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  analyzeQuery: async (data: {
    query: string;
    language?: string;
    user_context?: any;
  }) => {
    return makeRequest('/api/ai/analyze-query/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSearchSuggestions: async (data: {
    partial_query?: string;
    language?: string;
    category?: string;
  }) => {
    return makeRequest('/api/ai/search-suggestions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  detectLanguage: async (data: { text: string }) => {
    return makeRequest('/api/ai/detect-language/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  translate: async (data: {
    text: string;
    source_language?: string;
    target_language: string;
  }) => {
    return makeRequest('/api/ai/translate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getBusinessInsights: async () => {
    return makeRequest('/api/ai/business-insights/');
  },

  getMarketTrends: async () => {
    return makeRequest('/api/ai/market-trends/');
  },
};

// Search API
export const searchAPI = {
  intelligentSearch: async (data: {
    query: string;
    language?: string;
    location?: { latitude: number; longitude: number };
    filters?: any;
    sort_by?: string;
    page?: number;
  }) => {
    return makeRequest('/api/search/intelligent/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  quickSearch: async (data: {
    query: string;
    limit?: number;
  }) => {
    return makeRequest('/api/search/quick-search/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  advancedSearch: async (data: {
    query?: string;
    category?: string;
    location?: { latitude: number; longitude: number };
    price_range?: string;
    rating_min?: number;
    amenities?: string[];
    distance_km?: number;
    sort_by?: string;
    page?: number;
  }) => {
    return makeRequest('/api/search/advanced-search/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSuggestions: async (params: {
    query?: string;
    language?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/search/suggestions/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getAutocomplete: async (params: {
    query?: string;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/search/autocomplete/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getSearchHistory: async () => {
    return makeRequest('/api/search/history/');
  },

  saveSearch: async (data: {
    query: string;
    search_results?: any;
    search_metadata?: any;
  }) => {
    return makeRequest('/api/search/save-search/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPopularSearches: async (params: {
    time_period?: string;
    language?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/search/popular-searches/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  nearbySearch: async (data: {
    latitude: number;
    longitude: number;
    query?: string;
    radius_km?: number;
    category?: string;
    page?: number;
  }) => {
    return makeRequest('/api/search/nearby/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  radiusSearch: async (data: {
    latitude: number;
    longitude: number;
    radius_km: number;
    query?: string;
    filters?: any;
    sort_by?: string;
    page?: number;
  }) => {
    return makeRequest('/api/search/radius-search/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  searchByCategory: async (params: {
    category: string;
    location?: string;
    sort_by?: string;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/search/by-category/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getSearchFilters: async () => {
    return makeRequest('/api/search/filters/');
  },

  getTrendingSearches: async (params: {
    time_period?: string;
    language?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/search/trending/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },

  getSearchStats: async () => {
    return makeRequest('/api/search/search-stats/');
  },
};

// Analytics API
export const analyticsAPI = {
  getBusinessPerformance: async (params: {
    business_id?: string;
    time_period?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/analytics/business-performance/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeRequest(endpoint);
  },
};

// Utility functions
export const getAuthToken = () => localStorage.getItem('auth_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};
export const isAuthenticated = () => !!getAuthToken();

// Error handling helper
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.message?.includes('401')) {
    // Token expired, logout user
    authAPI.logout();
    window.location.href = '/login';
    return 'Session expired. Please login again.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};