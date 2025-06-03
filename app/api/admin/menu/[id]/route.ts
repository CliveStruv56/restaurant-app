
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

    if (data.type === 'category') {
      const category = await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          sortOrder: data.sortOrder,
          isActive: data.isActive
        }
      });
      return NextResponse.json({ data: category });
    } else if (data.type === 'menuItem') {
      const menuItem = await prisma.menuItem.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          categoryId: data.categoryId,
          isAvailable: data.isAvailable
        },
        include: {
          category: true
        }
      });
      return NextResponse.json({ data: menuItem });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Menu update error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'category') {
      await prisma.category.delete({
        where: { id }
      });
    } else if (type === 'menuItem') {
      await prisma.menuItem.delete({
        where: { id }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Menu delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
