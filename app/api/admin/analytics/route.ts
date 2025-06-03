
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Analytics API: Starting request', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Check admin authentication
    const adminResult = await requireAdmin(request);
    console.log('✅ Analytics API: Admin authentication successful', {
      adminId: adminResult?.id,
      adminEmail: adminResult?.email
    });

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    console.log('📊 Analytics API: Fetching data...', {
      days,
      startDate: startDate.toISOString()
    });

    // Sales data
    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { totalAmount: true },
      _count: true
    });

    // Booking data
    const bookingData = await prisma.booking.groupBy({
      by: ['bookingDate'],
      where: {
        bookingDate: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      _count: true
    });

    // Popular items
    const popularItems = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    });

    // Get menu item details for popular items
    const menuItemIds = popularItems.map(item => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true }
    });

    const popularItemsWithNames = popularItems.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return {
        id: item.menuItemId,
        name: menuItem?.name || 'Unknown',
        totalOrdered: item._sum.quantity || 0,
        revenue: Number(item._sum.price || 0)
      };
    });

    // Format sales data
    const formattedSalesData = salesData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      revenue: Number(item._sum.totalAmount || 0),
      orders: item._count
    }));

    // Format booking data
    const formattedBookingData = bookingData.map(item => ({
      date: item.bookingDate.toISOString().split('T')[0],
      bookings: item._count
    }));

    const responseTime = Date.now() - startTime;
    
    console.log('✅ Analytics API: Success', {
      salesDataCount: formattedSalesData.length,
      bookingDataCount: formattedBookingData.length,
      popularItemsCount: popularItemsWithNames.length,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      data: {
        salesData: formattedSalesData,
        bookingData: formattedBookingData,
        popularItems: popularItemsWithNames
      },
      meta: {
        days,
        startDate: startDate.toISOString(),
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 Analytics API Error:', {
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
