
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Dashboard API: Starting request', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Check admin authentication
    const adminResult = await requireAdmin(request);
    console.log('✅ Dashboard API: Admin authentication successful', {
      adminId: adminResult?.id,
      adminEmail: adminResult?.email
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('📊 Dashboard API: Fetching statistics...', {
      today: today.toISOString(),
      tomorrow: tomorrow.toISOString()
    });

    // Get dashboard statistics
    const [
      totalOrders,
      totalRevenue,
      totalBookings,
      activeUsers,
      todayOrders,
      todayRevenue,
      todayBookings,
      pendingOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.booking.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        },
        _sum: { totalAmount: true }
      }),
      prisma.booking.count({
        where: {
          bookingDate: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.order.count({
        where: { status: 'PENDING' }
      })
    ]);

    const stats = {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalBookings,
      activeUsers,
      todayOrders,
      todayRevenue: Number(todayRevenue._sum.totalAmount || 0),
      todayBookings,
      pendingOrders
    };

    const responseTime = Date.now() - startTime;
    
    console.log('✅ Dashboard API: Success', {
      stats,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      data: stats,
      meta: {
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 Dashboard API Error:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    // Check if it's an authentication error
    if (error.message?.includes('Unauthorized') || error.message?.includes('Invalid token')) {
      return NextResponse.json(
        { 
          error: 'Unauthorized access',
          details: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }

    // Database or other errors
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
