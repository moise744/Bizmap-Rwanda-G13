import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../lib/types';
import { authAPI, getUserData, isAuthenticated, handleApiError } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (isAuthenticated()) {
        const userData = getUserData();
        if (userData) {
          setUser(userData);
          // Optionally refresh user data from server
          try {
            const freshUserData = await authAPI.getProfile();
            setUser(freshUserData);
            localStorage.setItem('user_data', JSON.stringify(freshUserData));
          } catch (error) {
            // If profile fetch fails, use cached data
            console.warn('Could not refresh user profile:', error);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authAPI.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      
      // Handle different response formats
      let userProfile = response.user;
      if (!userProfile && response.access_token) {
        // If no user in response, fetch profile
        try {
          userProfile = await authAPI.getProfile();
        } catch (error) {
          console.warn('Could not fetch user profile after login');
        }
      }
      
      if (userProfile) {
        setUser(userProfile);
        toast.success('Welcome back!', {
          description: `Good to see you again, ${userProfile.first_name}!`
        });
      } else {
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const message = handleApiError(error);
      toast.error('Login Failed', {
        description: message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(data);
      
      // Handle different response formats
      let userProfile = response.user;
      if (!userProfile && response.access_token) {
        // If no user in response, fetch profile
        try {
          userProfile = await authAPI.getProfile();
        } catch (error) {
          // Create user object from registration data
          userProfile = {
            user_id: response.user_id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            user_type: data.user_type,
            preferred_language: data.preferred_language || 'kinyarwanda',
            is_phone_verified: false,
            is_active: true,
            phone_number: data.phone_number,
            date_joined: new Date().toISOString()
          };
        }
      }
      
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem('user_data', JSON.stringify(userProfile));
        
        toast.success('Account Created!', {
          description: 'Welcome to BizMap Rwanda! Your account has been created successfully.'
        });
      } else {
        toast.success('Registration successful!');
      }
    } catch (error: any) {
      const message = handleApiError(error);
      toast.error('Registration Failed', {
        description: message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authAPI.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (isAuthenticated()) {
        const freshUserData = await authAPI.getProfile();
        setUser(freshUserData);
        localStorage.setItem('user_data', JSON.stringify(freshUserData));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't logout on refresh failure, just log the error
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook to check if user has specific role
export const useRole = () => {
  const { user } = useAuth();
  
  return {
    isCustomer: user?.user_type === 'customer',
    isBusinessOwner: user?.user_type === 'business_owner',
    isAdmin: user?.user_type === 'admin',
    canManageBusinesses: user?.user_type === 'business_owner' || user?.user_type === 'admin',
    userType: user?.user_type
  };
};