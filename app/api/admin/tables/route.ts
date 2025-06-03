
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' }
    });

    return NextResponse.json({ data: tables });
  } catch (error) {
    console.error('Tables fetch error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = await request.json();

    const table = await prisma.table.create({
      data: {
        number: data.number,
        capacity: data.capacity,
        x: data.x || 0,
        y: data.y || 0,
        width: data.width || 80,
        height: data.height || 80,
        description: data.description,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    return NextResponse.json({ data: table });
  } catch (error) {
    console.error('Table create error:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}
