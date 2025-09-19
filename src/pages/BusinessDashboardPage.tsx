import React, { useState } from 'react';
import { 
  TrendingUp, Users, Star, Eye, MessageSquare, Calendar, 
  BarChart3, PieChart, Activity, Plus, Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BusinessDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats] = useState({
    totalViews: 1247,
    totalReviews: 23,
    averageRating: 4.6,
    monthlyGrowth: 15.2
  });

  const [recentReviews] = useState([
    {
      id: '1',
      customerName: 'John Doe',
      rating: 5,
      comment: 'Excellent service and quality!',
      date: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Good experience overall.',
      date: '2024-01-14'
    }
  ]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ComponentType<any>;
    color?: string;
  }> = ({ title, value, change, icon: Icon, color = 'text-blue-600' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gray-100 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.first_name}! Here's how your business is performing.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/manage-business')} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Business
            </Button>
            <Button onClick={() => navigate('/manage-business')} className="bg-[#0D80F2] hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            change="+12% this month"
            icon={Eye}
            color="text-blue-600"
          />
          <StatCard
            title="Customer Reviews"
            value={stats.totalReviews}
            change="+3 new reviews"
            icon={MessageSquare}
            color="text-green-600"
          />
          <StatCard
            title="Average Rating"
            value={`${stats.averageRating}/5`}
            icon={Star}
            color="text-yellow-600"
          />
          <StatCard
            title="Monthly Growth"
            value={`${stats.monthlyGrowth}%`}
            change="vs last month"
            icon={TrendingUp}
            color="text-purple-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Performance charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New customer review</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Business profile viewed 15 times</p>
                      <p className="text-xs text-gray-600">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile needs updates</p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/manage-business')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Business Info
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Respond to Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Update Hours
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Reviews</span>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{review.customerName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Status */}
            <Card>
              <CardHeader>
                <CardTitle>Business Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verification Status</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completeness</span>
                    <Badge variant="outline">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Listing Status</span>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboardPage;