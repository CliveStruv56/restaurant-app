
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

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        partySize: data.partySize,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        table: {
          select: { id: true, number: true, capacity: true }
        }
      }
    });

    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
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

    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
