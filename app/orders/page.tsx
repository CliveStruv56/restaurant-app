
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Clock, Package, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  notes?: string;
  menuItem: {
    id: string;
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  pickupTime?: string;
  notes?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PREPARING: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: RefreshCw },
  READY: { label: 'Ready for Pickup', color: 'bg-green-100 text-green-800', icon: Package },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
          <p className="text-gray-600 mb-6">Start by ordering some delicious food from our menu</p>
          <Button onClick={() => router.push('/menu')} className="bg-orange-600 hover:bg-orange-700">
            Browse Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Placed on {format(new Date(order.createdAt), 'PPp')}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <div className="text-lg font-bold text-orange-600">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Pickup Time */}
                      {order.pickupTime && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            Pickup time: {format(new Date(order.pickupTime), 'PPp')}
                          </span>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Items:</h4>
                        <div className="space-y-1">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.menuItem.name}
                                {item.notes && (
                                  <span className="text-gray-500 ml-2">({item.notes})</span>
                                )}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {order.notes && (
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">Special Instructions:</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      {/* Status-specific messages */}
                      {order.status === 'READY' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 text-sm font-medium">
                            🎉 Your order is ready for pickup! Please come to the restaurant.
                          </p>
                        </div>
                      )}

                      {order.status === 'PREPARING' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-orange-800 text-sm font-medium">
                            👨‍🍳 Our chefs are preparing your order. It will be ready soon!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
