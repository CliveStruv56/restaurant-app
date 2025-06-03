
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    const data = await request.json();
    const { id } = params;

    const table = await prisma.table.update({
      where: { id },
      data: {
        number: data.number,
        capacity: data.capacity,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        description: data.description,
        isActive: data.isActive
      }
    });

    return NextResponse.json({ data: table });
  } catch (error) {
    console.error('Table update error:', error);
    return NextResponse.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    const { id } = params;

    await prisma.table.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Table delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}
