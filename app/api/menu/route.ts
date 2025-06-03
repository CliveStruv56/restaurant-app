
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
