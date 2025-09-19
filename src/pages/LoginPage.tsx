import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(formData);
      
      // Navigate based on user type or default
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the context and toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0D80F2] to-[#102654] items-center justify-center p-12">
        <div className="max-w-lg text-center text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to BizMap Rwanda</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover Rwanda's best businesses with our AI-powered platform. 
              Connect with local services and grow your network.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#EBA910]">1000+</div>
              <div className="text-sm text-blue-200">Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#EBA910]">50k+</div>
              <div className="text-sm text-blue-200">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#EBA910]">100%</div>
              <div className="text-sm text-blue-200">Verified</div>
            </div>
          </div>
          
          <div className="mt-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMGRpc2NvdmVyeSUyMGhlcm8lMjBpbWFnZXxlbnwxfHx8fDE3NTgyNzg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Business Discovery Platform"
              className="w-full h-64 object-cover rounded-lg opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#0D80F2] rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BizMap</span>
            </div>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center">
                <h2 className="text-3xl font-bold text-[#0D80F2] mb-2">Welcome back</h2>
                <p className="text-gray-600 font-normal text-base">
                  Sign in to your account to continue
                </p>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Show general error */}
              {errors.general && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {errors.general}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-[#0D80F2]'}`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`h-12 pr-12 ${errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-[#0D80F2]'}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#0D80F2] hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#0D80F2] hover:bg-blue-700 text-white font-medium rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                {/* Demo Accounts */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Customer: customer@demo.com / demo123</div>
                    <div>Business: business@demo.com / demo123</div>
                  </div>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-[#0D80F2] hover:text-blue-700 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-4">
              <Link to="/privacy" className="hover:text-[#0D80F2] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#0D80F2] transition-colors">
                Terms of Service
              </Link>
              <Link to="/help" className="hover:text-[#0D80F2] transition-colors">
                Help Center
              </Link>
            </div>
            
            <p className="text-xs text-gray-400">
              © 2025 BizMap Rwanda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;