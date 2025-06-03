
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

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        pickupTime: data.pickupTime ? new Date(data.pickupTime) : undefined
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        orderItems: {
          include: {
            menuItem: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
