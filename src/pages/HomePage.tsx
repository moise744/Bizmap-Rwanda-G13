import React, { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, Star, Users, Clock, Sparkles, ArrowRight, MessageCircle, Brain, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { businessAPI } from '../lib/api';
import { toast } from 'sonner';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Try to load categories from API, fallback to mock data
      try {
        const categoriesResponse = await businessAPI.getCategories();
        if (Array.isArray(categoriesResponse)) {
          const topCategories = categoriesResponse.slice(0, 6).map((cat: any) => ({
            name: cat.name,
            name_kinyarwanda: cat.name_kinyarwanda,
            name_french: cat.name_french,
            icon: getIconForCategory(cat.name),
            count: '200+',
            image: getImageForCategory(cat.name),
            slug: cat.category_id
          }));
          setCategories(topCategories);
        }
      } catch (error) {
        // console.warn('API not available, using mock categories');
        // Fallback to mock categories
        const mockCategories = [
          { name: 'Food & Dining', slug: 'restaurants' },
          { name: 'Hotels', slug: 'hotels' },
          { name: 'Healthcare', slug: 'healthcare' },
          { name: 'Automotive', slug: 'automotive' },
          { name: 'Education', slug: 'education' },
          { name: 'Services', slug: 'services' }
        ].map(cat => ({
          name: cat.name,
          name_kinyarwanda: '',
          name_french: '',
          icon: getIconForCategory(cat.name),
          count: '200+',
          image: getImageForCategory(cat.name),
          slug: cat.slug
        }));
        setCategories(mockCategories);
      }

      // Try to load businesses from API, fallback to mock data
      try {
        const businessesResponse = await businessAPI.getBusinesses({ page: 1 });
        if (businessesResponse?.results) {
          const businesses = businessesResponse.results.slice(0, 3).map((business: any) => ({
            id: business.business_id,
            name: business.business_name,
            image: 'https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NTgyNTM4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: parseFloat(business.average_rating_score) || 4.5,
            category: business.category_name,
            location: `${business.district}, ${business.province}`,
            address: business.address
          }));
          setRecommendedBusinesses(businesses);
        }
      } catch (error) {
        // console.warn('API not available, using mock businesses');
        // Fallback to mock businesses
        const mockBusinesses = [
          {
            id: 'demo-1',
            name: 'Heaven Restaurant',
            image: 'https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NTgyNTM4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.8,
            category: 'Restaurant',
            location: 'Nyarugenge, Kigali',
            address: 'KN 4 Ave, Nyarugenge'
          },
          {
            id: 'demo-2',
            name: 'Kigali Marriott Hotel',
            image: 'https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMGRpc2NvdmVyeSUyMGhlcm8lMjBpbWFnZXxlbnwxfHx8fDE3NTgyNzg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            category: 'Hotel',
            location: 'Kigali City, Kigali',
            address: 'KN 3 Ave, Kigali'
          },
          {
            id: 'demo-3',
            name: 'Meze Fresh',
            image: 'https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NTgyNTM4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.6,
            category: 'Restaurant',
            location: 'Kimihurura, Kigali',
            address: 'Kimihurura, Kigali'
          }
        ];
        setRecommendedBusinesses(mockBusinesses);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Don't show error toast for API unavailability during development
      // console.warn('Running in demo mode with mock data');
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      'Food & Dining': '🍽️',
      'Restaurants': '🍽️',
      'Hotels': '🏨',
      'Health': '🏥',
      'Healthcare': '🏥',
      'Automotive': '🚗',
      'Shops': '🛍️',
      'Shopping': '🛍️',
      'Education': '🎓',
      'Services': '🔧',
      'Entertainment': '🎭',
      'Luxury Hotels': '🏨',
      'Budget Hotels': '🏨',
      'Cafes & Coffee Shops': '☕',
      'Fast Food': '🍔'
    };
    return iconMap[categoryName] || '🏢';
  };

  const getImageForCategory = (categoryName: string): string => {
    const imageMap: Record<string, string> = {
      'Food & Dining': 'https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NTgyNTM4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Restaurants': 'https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NTgyNTM4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Health': 'https://images.unsplash.com/photo-1673101873283-0bfbeb3d307b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHNlcnZpY2VzfGVufDF8fHx8MTc1ODI3ODc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'Healthcare': 'https://images.unsplash.com/photo-1673101873283-0bfbeb3d307b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHNlcnZpY2VzfGVufDF8fHx8MTc1ODI3ODc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'Automotive': 'https://images.unsplash.com/photo-1689907277936-88db528ef59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwY2FyJTIwc2VydmljZXN8ZW58MXx8fHwxNzU4Mjc4Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'Shops': 'https://images.unsplash.com/photo-1590764095558-abd89de9db5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMHJldGFpbCUyMHN0b3Jlc3xlbnwxfHx8fDE3NTgyNzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Shopping': 'https://images.unsplash.com/photo-1590764095558-abd89de9db5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMHJldGFpbCUyMHN0b3Jlc3xlbnwxfHx8fDE3NTgyNzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Education': 'https://images.unsplash.com/photo-1596574027151-2ce81d85af3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBzY2hvb2wlMjBsZWFybmluZ3xlbnwxfHx8fDE3NTgyNjIzODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Services': 'https://images.unsplash.com/photo-1671040690726-b78261eff126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlcyUyMHRvb2xzfGVufDF8fHx8MTc1ODI3ODc4OXww&ixlib=rb-4.1.0&q=80&w=1080'
    };
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMGRpc2NvdmVyeSUyMGhlcm8lMjBpbWFnZXxlbnwxfHx8fDE3NTgyNzg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080';
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/businesses?category=${categoryId}`);
  };

  const handleAIMode = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      toast.info('Please login to use AI chat features.');
      navigate('/login');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.first_name || 'there';
    
    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 18) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  const howItWorks = [
    {
      icon: MessageCircle,
      title: 'Ask Naturally',
      description: 'Describe what you need in your own words',
      color: 'text-[#EBA910]'
    },
    {
      icon: Brain,
      title: 'AI Understands',
      description: "Our AI understands Rwanda's culture and language",
      color: 'text-[#0D80F2]'
    },
    {
      icon: BarChart3,
      title: 'Get Matched',
      description: 'Find verified businesses near you instantly',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="w-full min-h-[70vh] flex flex-col gap-3 items-center justify-center py-16 px-4 md:px-10 text-white relative"
        style={{
          background: 'linear-gradient(to right, rgba(16,38,79,0.8), rgba(13,128,242,0.5)), url("https://images.unsplash.com/photo-1635249475387-6230016cf06c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMGRpc2NvdmVyeSUyMGhlcm8lMjBpbWFnZXxlbnwxfHx8fDE3NTgyNzg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {isAuthenticated && (
            <h1 className="text-[#EBA910] text-2xl md:text-4xl font-bold mb-4">
              {getGreeting()}
            </h1>
          )}
          
          <h1 className="text-center text-[#EBA910] font-bold text-2xl sm:text-4xl md:text-5xl">
            Find local service providers near you
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl font-bold text-center text-white max-w-3xl mx-auto">
            BizMap connects you with verified professionals for all your needs. 
            Search, review, and book with confidence.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
              <Input 
                type="text" 
                className="bg-white text-gray-900 rounded-md px-4 py-3 flex-1 border-0" 
                placeholder="Search for restaurants, hotels, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="bg-[#0D80F2] hover:bg-blue-700 px-6 py-3 rounded-md text-white"
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>

          {/* AI Mode Section */}
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center text-lg sm:text-3xl md:text-4xl font-bold">
              Want a smarter way to search?
            </h2>
            <Button 
              onClick={handleAIMode}
              className="bg-[#EBA910] hover:bg-yellow-600 py-2 sm:py-3 px-4 sm:px-6 rounded-md text-black font-medium"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Try AI Mode
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-5 sm:px-10 md:px-15 min-h-fit py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl">Categories</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/businesses')}
              className="flex items-center gap-2 hover:text-[#0D80F2] transition duration-150"
            >
              View All Categories <ArrowRight className="w-4 h-4" />
            </Button>
          </header>

          {loading ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                    <div className="w-full h-32 bg-gray-300 rounded mb-4"></div>
                    <div className="w-24 h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
              {categories.map((category) => (
                <Card 
                  key={category.slug}
                  className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-400 rounded-md"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="h-40 md:h-50 w-full object-cover rounded mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
                    <Badge variant="secondary" className="text-xl">{category.count}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Section */}
      <section className="px-5 sm:px-10 md:px-15 py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-8">
            <h2 className="font-bold text-xl sm:text-2xl">Recommended</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/businesses')}
              className="flex items-center gap-2 hover:text-[#0D80F2]"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-40 md:h-50 w-full bg-gray-300 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                      <div className="w-full h-10 bg-gray-300 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommendedBusinesses.map((business) => (
                <Card 
                  key={business.id}
                  className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-400 rounded-md"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <CardContent className="p-0 flex flex-col pb-3">
                    <ImageWithFallback
                      src={business.image}
                      alt={business.name}
                      className="h-40 md:h-50 w-full object-cover rounded-t-lg"
                    />
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{business.rating}</span>
                        <Badge variant="outline">{business.category}</Badge>
                      </div>
                      <p className="text-gray-600 flex items-center gap-1 mb-4">
                        <MapPin className="w-4 h-4" />
                        {business.location}
                      </p>
                      <Button 
                        className="w-full mt-auto bg-[#0D80F2] hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/business/${business.id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How BizMap Works */}
      <section className="px-5 sm:px-10 md:px-15 py-10 md:py-15 flex flex-col items-center gap-5 min-h-fit">
        <header>
          <h2 className="font-bold text-2xl sm:text-3xl text-center">How BizMap Works</h2>
        </header>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto w-full">
          {howItWorks.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="text-center border-none shadow-none bg-red flex flex-col items-center">
                <CardContent className="flex flex-col items-center p-6">
                  <IconComponent className={`w-20 h-20 sm:w-24 sm:h-24 mb-4 ${step.color}`} />
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-15 bg-[#0D80F2] text-white">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-5">
          <h2 className="font-bold text-xl sm:text-2xl mb-4">Join BizMap today</h2>
          <p className="text-sm sm:text-base mb-8">Connect with customers and grow your business.</p>
          <Button 
            className="bg-[#EBA910] hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md"
            onClick={() => navigate(isAuthenticated ? '/manage-business' : '/register')}
          >
            Get started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;