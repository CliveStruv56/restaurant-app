
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Menu API: Starting request', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Check admin authentication
    const adminResult = await requireAdmin(request);
    console.log('✅ Menu API: Admin authentication successful', {
      adminId: adminResult?.id,
      adminEmail: adminResult?.email
    });

    console.log('📊 Menu API: Fetching categories and menu items...');

    const categories = await prisma.category.findMany({
      include: {
        menuItems: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    const responseTime = Date.now() - startTime;
    
    console.log('✅ Menu API: Success', {
      categoriesCount: categories.length,
      totalMenuItems: categories.reduce((sum, cat) => sum + cat.menuItems.length, 0),
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      data: categories,
      meta: {
        categoriesCount: categories.length,
        totalMenuItems: categories.reduce((sum, cat) => sum + cat.menuItems.length, 0),
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 Menu API Error:', {
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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Menu API POST: Starting request', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method
    });

    // Check admin authentication
    const adminResult = await requireAdmin(request);
    console.log('✅ Menu API POST: Admin authentication successful', {
      adminId: adminResult?.id,
      adminEmail: adminResult?.email
    });

    const body = await request.json();
    console.log('📝 Menu API POST: Request body', body);

    if (body.type === 'category') {
      const category = await prisma.category.create({
        data: {
          name: body.name,
          description: body.description,
          sortOrder: body.sortOrder,
          isActive: body.isActive
        }
      });

      const responseTime = Date.now() - startTime;
      console.log('✅ Menu API POST: Category created', {
        categoryId: category.id,
        categoryName: category.name,
        responseTime: `${responseTime}ms`
      });

      return NextResponse.json({ data: category });
    } else if (body.type === 'menuItem') {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: body.name,
          description: body.description,
          price: parseFloat(body.price),
          image: body.image,
          categoryId: body.categoryId,
          isAvailable: body.isAvailable
        }
      });

      const responseTime = Date.now() - startTime;
      console.log('✅ Menu API POST: Menu item created', {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        categoryId: menuItem.categoryId,
        responseTime: `${responseTime}ms`
      });

      return NextResponse.json({ data: menuItem });
    } else {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 Menu API POST Error:', {
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
