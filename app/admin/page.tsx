
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  AlertCircle,
  Menu,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/lib/types';
import { toast } from 'sonner';

interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const logError = (error: any, context: string) => {
    const timestamp = new Date().toISOString();
    console.group(`🚨 Admin Dashboard Error - ${context}`);
    console.log('Timestamp:', timestamp);
    console.log('Error:', error);
    console.log('Retry count:', retryCount);
    console.log('Current URL:', window.location.href);
    console.log('User agent:', navigator.userAgent);
    console.groupEnd();
  };

  const fetchDashboardStats = async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching dashboard stats...', {
        attempt: retryCount + 1,
        timestamp: new Date().toISOString(),
        url: '/api/admin/dashboard'
      });

      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store'
      });

      const responseTime = Date.now() - startTime;
      
      console.log('📡 Dashboard API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        responseTime: `${responseTime}ms`,
        url: response.url
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorDetails: ErrorDetails = {
          message: `API request failed: ${response.status} ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          timestamp: new Date().toISOString()
        };
        
        console.error('❌ Dashboard API Error Response:', {
          ...errorDetails,
          responseBody: errorText,
          responseTime: `${responseTime}ms`
        });

        setError(errorDetails);
        logError(errorDetails, 'API Response Error');
        toast.error(`Dashboard API Error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();
      
      console.log('✅ Dashboard API Success:', {
        dataReceived: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      });

      if (!result.data) {
        const errorDetails: ErrorDetails = {
          message: 'No data received from API',
          timestamp: new Date().toISOString()
        };
        setError(errorDetails);
        logError(errorDetails, 'Missing Data');
        toast.error('No dashboard data received');
        return;
      }

      setStats(result.data);
      setRetryCount(0); // Reset retry count on success
      toast.success('Dashboard loaded successfully');

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const errorDetails: ErrorDetails = {
        message: error.message || 'Network error occurred',
        timestamp: new Date().toISOString()
      };

      console.error('💥 Dashboard Fetch Error:', {
        error: error,
        message: error.message,
        stack: error.stack,
        name: error.name,
        responseTime: `${responseTime}ms`,
        retryCount: retryCount
      });

      setError(errorDetails);
      logError(error, 'Network/Fetch Error');
      toast.error(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    console.log(`🔄 Retrying dashboard fetch (attempt ${retryCount + 2})`);
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-900">Failed to load dashboard</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-red-700">
                    {error?.message || 'Unknown error occurred'}
                  </p>
                  {error?.status && (
                    <p className="text-xs text-red-600">
                      Status: {error.status} {error.statusText}
                    </p>
                  )}
                  {error?.timestamp && (
                    <p className="text-xs text-red-600">
                      Time: {new Date(error.timestamp).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-red-600">
                    Retry attempts: {retryCount}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={handleRetry} size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debugging Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <div>Current URL: {window.location.href}</div>
              <div>User Agent: {navigator.userAgent}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
              <div>Cookies Available: {document.cookie ? 'Yes' : 'No'}</div>
              <div>Local Storage Available: {typeof Storage !== 'undefined' ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Today\'s Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Today\'s Orders',
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayBookings.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Welcome back, admin! Here's what's happening today.
          </div>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/menu">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Menu className="h-6 w-6" />
                <span>Manage Menu</span>
              </Button>
            </Link>
            <Link href="/admin/tables">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Table Layout</span>
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>View Bookings</span>
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <ShoppingCart className="h-6 w-6" />
                <span>Manage Orders</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="mx-auto h-8 w-8 mb-2" />
              <p>Recent orders will appear here</p>
              <Link href="/admin/orders">
                <Button variant="outline" className="mt-2">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-8 w-8 mb-2" />
              <p>Upcoming bookings will appear here</p>
              <Link href="/admin/bookings">
                <Button variant="outline" className="mt-2">
                  View All Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
