
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    let settings = await prisma.restaurantSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.restaurantSettings.create({
        data: {}
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = await request.json();

    let settings = await prisma.restaurantSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: data
      });
    } else {
      settings = await prisma.restaurantSettings.update({
        where: { id: settings.id },
        data: data
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
